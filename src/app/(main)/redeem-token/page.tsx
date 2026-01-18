'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from 'lucide-react';
import type { Token } from '@/lib/types';

export default function RedeemTokenPage() {
  const [token, setToken] = useState('');
  const { toast } = useToast();

  const handleRedeem = () => {
    if (!token.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um token válido.",
      });
      return;
    }

    try {
      const storedTokens = window.localStorage.getItem('ganhaflow_tokens');
      let tokens: Token[] = storedTokens ? JSON.parse(storedTokens) : [];
      
      const tokenToRedeem = tokens.find(t => t.id === token.trim() && !t.isRedeemed);

      if (tokenToRedeem) {
        // Mark token as redeemed
        const updatedTokens = tokens.map(t => 
          t.id === tokenToRedeem.id ? { ...t, isRedeemed: true } : t
        );
        window.localStorage.setItem('ganhaflow_tokens', JSON.stringify(updatedTokens));

        // Update balance
        const currentBalance = Number(window.localStorage.getItem('ganhaflow_balance') || '0');
        const newBalance = currentBalance + tokenToRedeem.value;
        window.localStorage.setItem('ganhaflow_balance', String(newBalance));

        toast({
          title: "Token Resgatado!",
          description: `R$ ${tokenToRedeem.value.toFixed(2)} foram adicionados ao seu saldo.`,
        });
        setToken('');
      } else {
        toast({
          variant: "destructive",
          title: "Token Inválido",
          description: "O token inserido não é válido, já foi usado ou não existe.",
        });
      }
    } catch (error) {
      console.error("Failed to redeem token", error);
      toast({
        variant: "destructive",
        title: "Erro no Sistema",
        description: "Não foi possível resgatar o token. Tente novamente mais tarde.",
      });
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
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            className="uppercase"
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleRedeem}>Resgatar</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
