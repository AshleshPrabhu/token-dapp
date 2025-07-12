'use client';

import { Search, Menu, Wallet, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileSidebar } from '@/components/mobile-sidebar';

interface HeaderProps {
  isWalletConnected?: boolean;
}

export function Header({ isWalletConnected = false }: HeaderProps) {
  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <MobileSidebar />
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tokens..."
              className="pl-9 bg-muted/50 border-muted-foreground/20 focus:bg-background"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isWalletConnected ? (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 rounded-md border border-orange-200 dark:border-orange-800">
              <Wallet className="h-4 w-4" />
              <span className="text-sm font-medium">Not Connected</span>
            </div>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}