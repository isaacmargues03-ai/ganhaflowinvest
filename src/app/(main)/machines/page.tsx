'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { machines } from "@/lib/data";
import { Gem } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInvestments } from "@/context/investments-context";
import type { Machine } from '@/lib/types';

export default function MachinesPage() {
  const { toast } = useToast();
  const { addUserInvestment } = useInvestments();

  const handleRent = (machine: Machine) => {
    addUserInvestment(machine);
    toast({
      title: "Máquina Alugada!",
      description: `Você alugou a máquina ${machine.name} com sucesso.`,
    });
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Máquinas de Investimento</h1>
        <p className="text-muted-foreground">Escolha uma máquina para alugar e comece a ganhar.</p>
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
