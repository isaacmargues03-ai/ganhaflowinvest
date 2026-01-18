'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { add, differenceInSeconds, format, formatDistance } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Gem, Calendar, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, Timestamp } from "firebase/firestore";
import type { UserInvestment } from "@/lib/types";

// Helper to convert Firestore Timestamp to Date
const toDate = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export default function MyMachinesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [currentTime, setCurrentTime] = useState(new Date());

  const investmentsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'investments');
  }, [firestore, user]);
  
  const { data: userInvestments, isLoading: isInvestmentsLoading } = useCollection<UserInvestment>(investmentsCollectionRef);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  if (isUserLoading || isInvestmentsLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Minhas Máquinas</h1>
          <p className="text-muted-foreground">Acompanhe o progresso dos seus investimentos.</p>
        </div>
        <Card className="text-center py-12 flex flex-col items-center justify-center">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                Carregando suas máquinas...
            </CardTitle>
          </CardHeader>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Minhas Máquinas</h1>
        <p className="text-muted-foreground">Acompanhe o progresso dos seus investimentos.</p>
      </div>

      {userInvestments && userInvestments.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {userInvestments.map((investment) => {
            if (!investment || !investment.purchaseDate) {
              return null;
            }
            
            const purchaseDate = toDate(investment.purchaseDate);
            const endDate = add(purchaseDate, { days: investment.machineCycleDays });
            
            const totalCycleSeconds = investment.machineCycleDays * 24 * 60 * 60;
            const secondsPassed = differenceInSeconds(currentTime, purchaseDate);
            
            const progress = Math.min(100, (secondsPassed / totalCycleSeconds) * 100);
            const isCompleted = progress >= 100;
            
            return (
              <Card key={investment.id} className="flex flex-col overflow-hidden border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Gem className="text-primary" />
                    {investment.machineName}
                  </CardTitle>
                  <CardDescription>
                    Investido em: {format(purchaseDate, "dd 'de' MMMM, yyyy, HH:mm", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Progresso do Ciclo</span>
                        <span className="text-sm font-bold text-primary">{progress.toFixed(2)}%</span>
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
                          Retorno {formatDistance(endDate, currentTime, { locale: ptBR, addSuffix: true })}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-baseline pt-2">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">Investimento</p>
                            <p className="font-bold text-accent">R$ {investment.machinePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                         <div className="text-center">
                            <p className="text-xs text-muted-foreground">Retorno</p>
                            <p className="text-2xl font-bold text-primary">R$ {investment.machineTotalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
