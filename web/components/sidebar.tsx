'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Coins,
  Home,
  Plus,
  Flame,
  Send,
  Shield,
  Info,
  History,
  CreditCard,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Mint', href: '/dashboard/mint', icon: Plus },
  { name: 'Burn', href: '/dashboard/burn', icon: Flame },
  { name: 'Transfer', href: '/dashboard/transfer', icon: Send },
  { name: 'Balance', href: '/dashboard/balance', icon: CreditCard },
  { name: 'Allowance', href: '/dashboard/allowance', icon: Shield },
  { name: 'Info', href: '/dashboard/info', icon: Info },
  { name: 'History', href: '/history', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-background border-r border-border">
        <div className="flex items-center flex-shrink-0 px-4">
          <Coins className="h-8 w-8 text-primary" />
          <span className="ml-2 text-lg font-semibold text-foreground">
            Token Manager
          </span>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-4 w-4 flex-shrink-0',
                      isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}