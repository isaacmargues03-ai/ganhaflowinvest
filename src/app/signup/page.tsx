'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function SignupPage() {
  const telegramSupportUrl = 'http://t.me/GANHE_FLOEINVEST';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!auth || !firestore) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });
      
      const userDocRef = doc(firestore, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        name: name,
        email: email,
        balance: 0,
        createdAt: serverTimestamp(),
      });
      
      toast({
          title: 'Conta criada com sucesso!',
          description: 'Redirecionando para o seu dashboard.',
      });
      router.push('/dashboard');
    } catch (error) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Erro no Cadastro',
            description: 'Não foi possível criar sua conta. Verifique os dados ou tente novamente.',
        });
    } finally {
        setIsLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm border-primary/20 shadow-glow-primary">
        <CardHeader className="text-center">
          <div className="mb-4 inline-block">
            <Logo />
          </div>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>Crie sua conta para começar a investir.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSignup}>
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input 
                id="name" 
                placeholder="Seu Nome" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm space-y-2">
            <div>
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary/80 hover:text-primary underline">
                Login
              </Link>
            </div>
             <div>
              Problemas ou dúvidas?{' '}
              <Link href={telegramSupportUrl} target="_blank" rel="noopener noreferrer" className="text-primary/80 hover:text-primary underline">
                Fale com o suporte
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
