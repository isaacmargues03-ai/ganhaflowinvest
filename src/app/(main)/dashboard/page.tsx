'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Loader2, Users } from "lucide-react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  const availableBalance = userData?.balance ?? 0;

  if (isUserLoading || isUserDataLoading) {
    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </main>
    )
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua conta.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <span className="text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground mt-1">Seu saldo em tempo real.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status da Conta</CardTitle>
            <CheckCircle className="text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              Conta Ativa
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/50">PRO</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Todos os sistemas operando normalmente.</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              Comunidade no Telegram
            </CardTitle>
            <CardDescription>
              Junte-se à nossa comunidade para tirar dúvidas, ver novidades e interagir com outros investidores.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button asChild className="w-full">
                <Link href="https://t.me/+kBUR1ezlHQJkNGEx" target="_blank" rel="noopener noreferrer">
                    Entrar na Comunidade
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

    </main>
  );
}
