'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { userInvestments } from "@/lib/data";
import { add, differenceInDays, format, formatDistanceToNow } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Gem, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyMachinesPage() {

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minhas Máquinas</h1>
        <p className="text-muted-foreground">Acompanhe o progresso dos seus investimentos.</p>
      </div>

      {userInvestments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userInvestments.map((investment) => {
            const endDate = add(investment.purchaseDate, { days: investment.machine.cycleDays });
            const daysPassed = differenceInDays(new Date(), investment.purchaseDate);
            const progress = Math.min(100, (daysPassed / investment.machine.cycleDays) * 100);
            const isCompleted = progress >= 100;
            
            return (
              <Card key={investment.id} className="flex flex-col overflow-hidden border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gem className="text-primary" />
                    {investment.machine.name}
                  </CardTitle>
                  <CardDescription>
                    Investido em: {format(investment.purchaseDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progresso do Ciclo</span>
                        <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Ciclo Concluído!
                        </span>
                      ) : (
                        <span>
                          Retorno em {formatDistanceToNow(endDate, { locale: ptBR })}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-baseline pt-2">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">Investimento</p>
                            <p className="font-bold text-accent">R$ {investment.machine.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-xs text-muted-foreground">Retorno</p>
                            <p className="text-2xl font-bold text-primary">R$ {investment.machine.totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle>Nenhuma máquina alugada</CardTitle>
            <CardDescription>Vá para a seção de máquinas para começar a investir.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
                <Link href="/machines">Ver Máquinas</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
