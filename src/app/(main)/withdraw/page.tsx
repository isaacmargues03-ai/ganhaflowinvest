'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function WithdrawPage() {
  const availableBalance = 1234.56;
  const { toast } = useToast();

  const handleWithdraw = () => {
    toast({
      title: "Solicitação de Saque Enviada",
      description: "Sua solicitação de saque foi enviada e será processada em breve.",
    });
  };

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
              <Input id="amount" type="number" placeholder="0,00" className="pl-10"/>
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
