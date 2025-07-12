'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Plus, Minus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AllowancePage() {
  const [spender, setSpender] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header isWalletConnected={true} />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Shield className="h-8 w-8 mr-3" />
                  Token Allowance
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage spending permissions for your tokens
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Set Allowance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="spender">Spender Address</Label>
                      <Input
                        id="spender"
                        placeholder="0x..."
                        value={spender}
                        onChange={(e) => setSpender(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Allowance Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter amount or use "unlimited" for maximum allowance
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={handleApprove}
                        disabled={!spender || !amount || isLoading}
                        className="flex-1"
                      >
                        {isLoading ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Revoke
                      </Button>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Only approve trusted contracts and addresses. This gives them permission to spend your tokens.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Check Allowance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="owner">Owner Address</Label>
                      <Input
                        id="owner"
                        placeholder="Your address (auto-filled)"
                        className="mt-1"
                        disabled
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="checkSpender">Spender Address</Label>
                      <Input
                        id="checkSpender"
                        placeholder="0x..."
                        className="mt-1"
                      />
                    </div>

                    <Button variant="outline" className="w-full">
                      Check Allowance
                    </Button>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Current Allowance</p>
                      <p className="text-2xl font-bold">0.00</p>
                      <p className="text-xs text-muted-foreground">tokens approved</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Active Allowances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Uniswap V3 Router</p>
                        <p className="text-sm text-muted-foreground">0x68b3...c4c8</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">500.00</p>
                        <p className="text-sm text-muted-foreground">tokens approved</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">1inch Exchange</p>
                        <p className="text-sm text-muted-foreground">0x11111...1111</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Unlimited</p>
                        <p className="text-sm text-muted-foreground">maximum approved</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Revoke
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}