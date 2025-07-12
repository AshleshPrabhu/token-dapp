'use client';

import { Button } from '@/components/ui/button';
import { Coins, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

export function Hero() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/dashboard');
  };

  return (
    <div className="relative">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-8 w-8 text-foreground" />
            <span className="text-xl font-bold text-foreground">Token Manager</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Manage Your Tokens
              <br />
              <span className="text-muted-foreground">Like a Pro</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Complete token management solution with minting, burning, transfers, and real-time analytics. 
              Connect your wallet and take control of your digital assets.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6 h-auto"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Coins className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Token Operations</h3>
              <p className="text-muted-foreground text-sm">
                Mint, burn, and transfer tokens with ease. Complete control over your token lifecycle.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Track balances, transaction history, and get detailed insights into your token performance.
              </p>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground text-sm">
                Built with security in mind. Your wallet, your keys, your tokens - always under your control.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet and start managing your tokens in seconds.
            </p>
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              variant="outline"
              className="text-lg px-8 py-6 h-auto"
            >
              Launch Dashboard
              <Zap className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}