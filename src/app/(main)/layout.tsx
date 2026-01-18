'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  DollarSign,
  Gem,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Wallet,
  LifeBuoy,
  Ticket,
  Shield,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/machines', icon: Gem, label: 'Máquinas' },
  { href: '/my-machines', icon: Wallet, label: 'Minhas Máquinas' },
  { href: '/deposit', icon: PiggyBank, label: 'Recarregar' },
  { href: '/redeem-token', icon: Ticket, label: 'Resgatar Token' },
  { href: '/withdraw', icon: DollarSign, label: 'Saque' },
  { href: '/support', icon: LifeBuoy, label: 'Suporte' },
];

const adminEmail = 'isaacmargues03@gmail.com';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const isUserAdmin = user?.email === adminEmail;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };
  
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  // Specific protection for admin page
  if (pathname === '/admin2' && !isUserAdmin) {
    router.push('/dashboard'); // or a 404 page
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Acesso negado. Redirecionando...</p>
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <Logo />
              <SidebarTrigger className="ml-auto" />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {isUserAdmin && (
                 <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === '/admin2'}
                    tooltip={{ children: 'Admin Panel' }}
                  >
                    <Link href="/admin2">
                      <Shield />
                      <span>Painel Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu className="px-2">
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: 'Sair' }}>
                    <LogOut />
                    <span>Sair</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center gap-3 p-2 mt-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.photoURL ?? `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="male portrait" />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="font-semibold truncate">{user.displayName || 'Usuário'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
  );
}
