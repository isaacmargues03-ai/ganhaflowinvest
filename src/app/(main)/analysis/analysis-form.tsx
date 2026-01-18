'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { analyzeTransactions, type TransactionAnalysisOutput } from '@/ai/flows/transaction-analysis-flow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  transactionHistory: z.string().min(10, { message: 'Por favor, insira um histórico de transações.' }),
  availableBalance: z.coerce.number().min(0, { message: 'O saldo deve ser um número positivo.' }),
});

export function AnalysisForm() {
  const { toast } = useToast();
  const [analysisResult, setAnalysisResult] = useState<TransactionAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionHistory: '',
      availableBalance: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeTransactions(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing transactions:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na Análise',
        description: 'Não foi possível processar sua solicitação. Tente novamente mais tarde.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Análise de Transações com IA</CardTitle>
          <CardDescription>
            Forneça seu histórico de transações e saldo para receber sugestões de investimento e uma avaliação de risco personalizada.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="transactionHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Histórico de Transações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex:&#10;Depósito: R$ 50,00 - 01/05/2024&#10;Saque: R$ 10,00 - 05/05/2024&#10;Aluguel Máquina Bronze: -R$ 10,00 - 06/05/2024"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="availableBalance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saldo Disponível</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">R$</span>
                        <Input type="number" placeholder="0,00" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Agora
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        {isLoading && (
          <>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                 <Skeleton className="h-4 w-1/4 mt-2" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          </>
        )}
        
        {analysisResult && (
          <>
            <Card className="border-green-500/50 shadow-lg shadow-green-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Sparkles /> Sugestão de Investimento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{analysisResult.investmentSuggestion}</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/50 shadow-lg shadow-amber-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle /> Avaliação de Risco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{analysisResult.riskAssessment}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
