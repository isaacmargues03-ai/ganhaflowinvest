'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
                <SidebarMenuButton asChild tooltip={{ children: 'Sair' }}>
                  <Link href="/login">
                    <LogOut />
                    <span>Sair</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <div className="flex items-center gap-3 p-2 mt-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/user/100/100" data-ai-hint="male portrait" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="font-semibold truncate">Usuário Teste</p>
                <p className="text-xs text-muted-foreground truncate">usuario@teste.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </InvestmentsProvider>
  );
}
