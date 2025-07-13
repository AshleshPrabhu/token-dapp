'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { TokenInfo } from '@/components/token-info';
import { TokenMetadata } from '@/components/token-metadata';
import { DashboardContent } from '@/components/dashboard-content';
import { WalletConnectModal } from '@/components/wallet-connect-modal';
import { useAccount } from 'wagmi';

export default function Dashboard() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      setShowWalletModal(!isConnected);
    }
  }, [isConnected, hasMounted]);

  if (!hasMounted) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  {isConnected
                    ? "Welcome to your token management dashboard"
                    : "Connect your wallet to get started"}
                </p>
              </div>
              <div className="space-y-6">
                <TokenInfo />
                <TokenMetadata />
                {/* <DashboardContent /> */}
              </div>
            </div>
          </main>
        </div>
      </div>

      <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      />
    </div>
  );
}
