'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const predefinedAmounts = [10, 20, 50, 100, 200];
const telegramSupportUrl = 'http://t.me/GANHE_FLOEINVEST';

export default function DepositPage() {
  const [amount, setAmount] = useState<number | string>(50);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === '' ? '' : Number(value));
  };
  
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-lg border-accent/30 shadow-glow-accent">
        <CardHeader>
          <CardTitle className="text-2xl">Recarregar Saldo</CardTitle>
          <CardDescription>Escolha ou digite um valor para recarregar.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Como funciona a recarga?</AlertTitle>
            <AlertDescription>
              1. Entre em contato com nosso <Link href={telegramSupportUrl} target="_blank" rel="noopener noreferrer" className="font-bold underline">suporte no Telegram</Link>.<br/>
              2. Solicite a chave PIX para o valor desejado.<br/>
              3. Envie o comprovante do pagamento.<br/>
              4. Você receberá um token para resgatar seu saldo.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-3 gap-4">
            {predefinedAmounts.map((predefinedAmount) => (
              <Button
                key={predefinedAmount}
                variant={amount === predefinedAmount ? 'default' : 'outline'}
                className="py-6 text-lg"
                onClick={() => setAmount(predefinedAmount)}
              >
                R$ {predefinedAmount}
              </Button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
            <Input 
              type="number" 
              placeholder="Outro valor"
              className="pl-10 text-lg h-12"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full text-lg py-6 bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href={telegramSupportUrl} target="_blank" rel="noopener noreferrer">Contatar Suporte para Recarregar</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
