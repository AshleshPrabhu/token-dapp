'use client';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { TokenInfo } from '@/components/token-info';
import { TokenMetadata } from '@/components/token-metadata';
import { Info } from 'lucide-react';

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header isWalletConnected={true} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Info className="h-8 w-8 mr-3" />
                  Token Information
                </h1>
                <p className="text-muted-foreground mt-1">
                  Detailed information about your token contract
                </p>
              </div>
              <div className="space-y-6">
                <TokenInfo />
                <TokenMetadata />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}