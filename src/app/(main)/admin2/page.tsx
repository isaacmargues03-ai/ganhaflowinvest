'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Copy, TicketPlus, Trash2, Shield } from 'lucide-react';
import type { Token } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { toast } = useToast();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [amount, setAmount] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedTokens = window.localStorage.getItem('ganhaflow_tokens');
      if (storedTokens) {
        setTokens(JSON.parse(storedTokens));
      }
    } catch (error) {
      console.error("Failed to load tokens from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      try {
        window.localStorage.setItem('ganhaflow_tokens', JSON.stringify(tokens));
      } catch (error) {
        console.error("Failed to save tokens to localStorage", error);
      }
    }
  }, [tokens, isLoading]);

  const generateToken = () => {
    if (typeof amount !== 'number' || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Valor Inválido",
        description: "Por favor, insira um valor numérico positivo.",
      });
      return;
    }

    const newId = `GANHAFLOW-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
    const newToken: Token = {
      id: newId,
      value: amount,
      isRedeemed: false,
    };

    setTokens(prev => [newToken, ...prev]);
    setAmount('');
    toast({
      title: "Token Gerado!",
      description: `Token ${newId} de R$ ${Number(amount).toFixed(2)} foi criado.`,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Token copiado para a área de transferência.",
    });
  };

  const deleteToken = (tokenId: string) => {
    setTokens(tokens.filter(t => t.id !== tokenId));
    toast({
        variant: 'destructive',
        title: 'Token Removido',
        description: `O token foi removido da lista.`,
    });
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Shield className="text-primary"/>
            Painel do Administrador
        </h1>
        <p className="text-muted-foreground">Gere e gerencie os tokens de recarga.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TicketPlus /> Gerar Novo Token</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Valor do Token (R$)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="Ex: 50" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                />
              </div>
              <Button onClick={generateToken} className="w-full">Gerar Token</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Tokens Gerados</CardTitle>
              <CardDescription>Aqui estão os tokens que foram gerados. Compartilhe o código com o usuário.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Carregando tokens...</p>
              ) : tokens.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {tokens.map(token => (
                    <div key={token.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                      <div className="font-mono text-sm">
                        <p className="font-bold">{token.id}</p>
                        <p className="text-muted-foreground">Valor: R$ {token.value.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {token.isRedeemed ? (
                          <Badge variant="secondary">Resgatado</Badge>
                        ) : (
                          <Badge variant="outline" className="border-green-500 text-green-500">Disponível</Badge>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(token.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteToken(token.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">Nenhum token gerado ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
