'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export default function WithdrawPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [withdrawAmount, setWithdrawAmount] = useState<number|string>('');
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading, error } = useDoc<UserProfile>(userDocRef);

  const availableBalance = userData?.balance ?? 0;

  const handleWithdraw = async () => {
    const amountToWithdraw = Number(withdrawAmount);
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
        toast({
            variant: "destructive",
            title: "Valor Inválido",
            description: "Por favor, insira um valor de saque válido.",
        });
        return;
    }
    if (amountToWithdraw > availableBalance) {
      toast({
        variant: "destructive",
        title: "Saldo Insuficiente",
        description: "Você não tem saldo suficiente para este saque.",
      });
      return;
    }
    if (!userDocRef) return;

    try {
      const newBalance = availableBalance - amountToWithdraw;
      await updateDoc(userDocRef, { balance: newBalance });
      setWithdrawAmount('');

      toast({
        title: "Solicitação de Saque Enviada",
        description: `Sua solicitação de R$ ${amountToWithdraw.toFixed(2)} foi enviada. O valor será creditado na sua chave PIX em breve.`,
      });

    } catch (e) {
      console.error("Erro ao solicitar saque:", e);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível processar seu saque. Fale com o suporte.",
      });
    }
  };
  
   if (isUserLoading || isUserDataLoading) {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </main>
    )
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl">Realizar Saque</CardTitle>
          <CardDescription>
            Seu saldo disponível é de <span className="font-bold text-primary">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Valor do Saque</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0,00" 
                className="pl-10"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pix-type">Tipo de Chave PIX</Label>
            <Select>
              <SelectTrigger id="pix-type">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cpf">CPF</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="phone">Celular</SelectItem>
                <SelectItem value="random">Chave Aleatória</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pix-key">Chave PIX</Label>
            <Input id="pix-key" type="text" placeholder="Sua chave PIX" />
          </div>
           <div className="text-center text-sm text-muted-foreground pt-2">
            Problemas com o saque?{' '}
            <Link href="/support" className="text-primary/80 hover:text-primary underline">
              Fale com o suporte
            </Link>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleWithdraw}>Solicitar Saque</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
