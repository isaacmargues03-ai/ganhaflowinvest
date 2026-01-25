'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Copy, Users, Gift, Loader2 } from "lucide-react";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, Timestamp } from "firebase/firestore";
import type { UserProfile, Referral } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ReferralsPage() {
    const { toast } = useToast();
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);

    const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

    const referralsCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        return collection(firestore, 'users', user.uid, 'referrals');
    }, [firestore, user]);

    const { data: referrals, isLoading: isReferralsLoading } = useCollection<Referral>(referralsCollectionRef);

    const copyToClipboard = (text: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast({
            title: "Copiado!",
            description: "Seu código de indicação foi copiado.",
        });
    };

    const isLoading = isUserLoading || isUserDataLoading || isReferralsLoading;

    return (
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Programa de Indicação</h1>
                <p className="text-muted-foreground">Convide amigos e ganhe recompensas.</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="border-primary/20 shadow-glow-primary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Gift className="text-primary" />
                            Seu Código de Indicação
                        </CardTitle>
                        <CardDescription>Compartilhe este código com seus amigos. Quando eles se cadastrarem, você será recompensado!</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isUserDataLoading || !userData ? (
                             <div className="flex items-center justify-center">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : userData.referralCode ? (
                            <div className="flex items-center gap-4 rounded-lg border bg-muted p-4">
                                <p className="text-2xl font-bold font-mono tracking-widest flex-1 text-center">{userData.referralCode}</p>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(userData.referralCode)}>
                                    <Copy />
                                </Button>
                            </div>
                        ) : (
                             <p className="text-muted-foreground text-center">Não foi possível carregar seu código.</p>
                        )}
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            Suas Indicações
                        </CardTitle>
                        <CardDescription>Acompanhe os amigos que você indicou.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : referrals && referrals.length > 0 ? (
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                                {referrals.sort((a, b) => ((b.createdAt as Timestamp)?.seconds ?? 0) - ((a.createdAt as Timestamp)?.seconds ?? 0)).map(r => (
                                    <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                                        <div>
                                            <p className="font-semibold">{r.referredUserName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Indicado em: {r.createdAt ? format((r.createdAt as Timestamp).toDate(), "dd/MM/yyyy", { locale: ptBR }) : '...'}
                                            </p>
                                        </div>
                                        <Badge variant={r.status === 'completed' ? 'default' : 'secondary'} className={r.status === 'completed' ? 'bg-primary/80' : ''}>
                                            {r.status === 'completed' ? 'Completo' : 'Pendente'}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-4">Você ainda não indicou ninguém.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
