'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { TokenInfo } from '@/components/token-info';
import { TokenMetadata } from '@/components/token-metadata';
import { DashboardContent } from '@/components/dashboard-content';
import { WalletConnectModal } from '@/components/wallet-connect-modal';

export default function Dashboard() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);

  useEffect(() => {
    setShowWalletModal(true);
  }, []);

  const handleWalletConnect = (walletType: string) => {
    console.log('Connecting to:', walletType);
    setIsWalletConnected(true);
    setShowWalletModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header isWalletConnected={isWalletConnected} />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  {isWalletConnected 
                    ? "Welcome to your token management dashboard" 
                    : "Connect your wallet to get started"
                  }
                </p>
              </div>
              <div className="space-y-6">
                <TokenInfo />
                <TokenMetadata />
                <DashboardContent />
              </div>
            </div>
          </main>
        </div>
      </div>

      <WalletConnectModal 
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}