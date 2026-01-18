'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { machines } from "@/lib/data";
import { Gem, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Machine, UserProfile } from '@/lib/types';
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc, runTransaction, serverTimestamp, collection, addDoc } from "firebase/firestore";

export default function MachinesPage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading, error } = useDoc<UserProfile>(userDocRef);

  const balance = userData?.balance ?? 0;

  const handleRent = async (machine: Machine) => {
    if (!firestore || !user) {
        toast({ variant: "destructive", title: "Erro", description: "Usuário não autenticado." });
        return;
    }

    try {
        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef!);
            if (!userDoc.exists()) {
                throw "Documento do usuário não existe!";
            }

            const currentBalance = userDoc.data().balance;
            if (currentBalance < machine.price) {
                throw "Saldo Insuficiente";
            }
            
            const newBalance = currentBalance - machine.price;
            transaction.update(userDocRef!, { balance: newBalance });

            const investmentsCollectionRef = collection(firestore, 'users', user.uid, 'investments');
            const newInvestment = {
                machineId: machine.id,
                purchaseDate: serverTimestamp(),
                machineName: machine.name,
                machinePrice: machine.price,
                machineTotalReturn: machine.totalReturn,
                machineCycleDays: machine.cycleDays,
            };
            transaction.set(doc(investmentsCollectionRef), newInvestment);
        });

        toast({
            title: "Máquina Alugada!",
            description: `Você alugou a máquina ${machine.name} com sucesso.`,
        });

    } catch (e: any) {
        console.error("Falha ao alugar máquina:", e);
        if (e === "Saldo Insuficiente") {
             toast({
                variant: "destructive",
                title: "Saldo Insuficiente",
                description: `Você precisa de R$ ${machine.price.toFixed(2)} para alugar esta máquina.`,
            });
        } else {
            toast({
                variant: "destructive",
                title: "Erro na Transação",
                description: "Não foi possível alugar a máquina. Tente novamente.",
            });
        }
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
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Máquinas de Investimento</h1>
            <p className="text-muted-foreground">Escolha uma máquina para alugar e comece a ganhar.</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">Seu Saldo</p>
            <p className="text-2xl font-bold text-primary">R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {machines.map((machine) => (
          <Card key={machine.id} className="flex flex-col overflow-hidden border-primary/20 transition-all hover:border-primary hover:shadow-glow-primary">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Gem className="text-primary" />
                {machine.name}
              </CardTitle>
              <CardDescription>Ciclo de {machine.cycleDays} dias</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Investimento</p>
                <p className="text-3xl font-bold text-accent">
                  R$ {machine.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">Retorno Total</p>
                <p className="text-4xl font-bold text-primary">
                  R$ {machine.totalReturn.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full font-bold" onClick={() => handleRent(machine)}>Alugar Máquina</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
