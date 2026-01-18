'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from 'lucide-react';

export default function RedeemTokenPage() {
  const [token, setToken] = useState('');
  const { toast } = useToast();

  const handleRedeem = () => {
    if (token.trim()) {
      toast({
        title: "Token Resgatado!",
        description: `O token "${token}" foi resgatado com sucesso. Seu saldo foi atualizado.`,
      });
      setToken('');
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um token válido.",
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
            onChange={(e) => setToken(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleRedeem}>Resgatar</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
