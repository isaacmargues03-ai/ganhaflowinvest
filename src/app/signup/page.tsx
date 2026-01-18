import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const telegramSupportUrl = 'https://t.me/GANHE_FLOEINVEST';

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
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Seu Nome" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" asChild>
              <Link href="/dashboard">Criar conta</Link>
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
