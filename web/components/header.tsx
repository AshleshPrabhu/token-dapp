'use client';

import { Wallet, CheckCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileSidebar } from '@/components/mobile-sidebar';
import { useAccount, useDisconnect } from 'wagmi';

export function Header() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <MobileSidebar />
        </div>
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-md border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
              </div>
              <Button
                variant="outline"
                className="h-8 px-3 text-sm flex items-center space-x-1"
                onClick={() => disconnect()}
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </Button>
            </>
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
