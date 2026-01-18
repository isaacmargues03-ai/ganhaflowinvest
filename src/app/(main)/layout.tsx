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
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { InvestmentsProvider } from '@/context/investments-context';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/machines', icon: Gem, label: 'Máquinas' },
  { href: '/my-machines', icon: Wallet, label: 'Minhas Máquinas' },
  { href: '/deposit', icon: PiggyBank, label: 'Recarregar' },
  { href: '/redeem-token', icon: Ticket, label: 'Resgatar Token' },
  { href: '/withdraw', icon: DollarSign, label: 'Saque' },
  { href: '/support', icon: LifeBuoy, label: 'Suporte' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Gem className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <InvestmentsProvider>
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
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />
                ) : (
                  <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="male portrait" />
                )}
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
    </InvestmentsProvider>
  );
}
