'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const telegramSupportUrl = 'https://t.me/GANHE_FLOEINVEST';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  const firestore = getFirestore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        name: name,
        email: user.email,
        balance: 0, // Initial balance
      });

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Redirecionando para o seu dashboard.',
      });
      router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
       let description = 'Ocorreu um erro ao criar sua conta. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'Este endereço de e-mail já está em uso.';
      } else if (error.code === 'auth/weak-password') {
        description = 'Sua senha é muito fraca. Tente uma senha mais forte.';
      }
      toast({
        variant: 'destructive',
        title: 'Erro no Cadastro',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
