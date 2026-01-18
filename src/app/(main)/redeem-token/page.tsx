'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Ticket, Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { collection, query, where, getDocs, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

export default function RedeemTokenPage() {
  const [tokenCode, setTokenCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();

  const handleRedeem = async () => {
    if (!tokenCode.trim()) {
      toast({ variant: "destructive", title: "Erro", description: "Por favor, insira um token válido." });
      return;
    }
    if (!firestore || !user) {
      toast({ variant: "destructive", title: "Erro", description: "Serviço indisponível ou usuário não logado." });
      return;
    }

    setIsLoading(true);
    const tokensRef = collection(firestore, 'tokens');
    const q = query(tokensRef, where("code", "==", tokenCode.trim()));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({ variant: "destructive", title: "Token Inválido", description: "O token inserido não existe." });
        setIsLoading(false);
        return;
      }

      const tokenDoc = querySnapshot.docs[0];
      const tokenData = tokenDoc.data();

      if (tokenData.isRedeemed) {
        toast({ variant: "destructive", title: "Token Já Utilizado", description: "Este token já foi resgatado." });
        setIsLoading(false);
        return;
      }
      
      const userDocRef = doc(firestore, 'users', user.uid);
      const tokenDocRef = doc(firestore, 'tokens', tokenDoc.id);

      await runTransaction(firestore, async (transaction) => {
        const freshTokenDoc = await transaction.get(tokenDocRef);
        const freshUserDoc = await transaction.get(userDocRef);

        if (!freshTokenDoc.exists() || freshTokenDoc.data().isRedeemed) {
          throw new Error("Token já utilizado ou inválido.");
        }
        if (!freshUserDoc.exists()) {
          throw new Error("Usuário não encontrado.");
        }

        const tokenValue = freshTokenDoc.data().value;
        const currentBalance = freshUserDoc.data().balance;
        const newBalance = currentBalance + tokenValue;

        transaction.update(userDocRef, { balance: newBalance });
        transaction.update(tokenDocRef, { 
          isRedeemed: true,
          redeemedBy: user.uid,
          redeemedAt: serverTimestamp()
        });
      });

      toast({
        title: "Token Resgatado!",
        description: `R$ ${tokenData.value.toFixed(2)} foram adicionados ao seu saldo.`,
      });
      setTokenCode('');

    } catch (error: any) {
      console.error("Failed to redeem token", error);
      toast({
        variant: "destructive",
        title: "Erro no Resgate",
        description: error.message || "Não foi possível resgatar o token. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Ticket className="text-primary"/>
            Resgatar Token
          </CardTitle>
          <CardDescription>Insira o token recebido para adicionar saldo à sua conta.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input 
            placeholder="Seu token de recarga"
            value={tokenCode}
            onChange={(e) => setTokenCode(e.target.value.toUpperCase())}
            className="uppercase"
            disabled={isLoading}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleRedeem} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Resgatar'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
