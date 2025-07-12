'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function BurnPage() {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleBurn = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setTxHash('0xdef1234567890abc...');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header isWalletConnected={true} />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Flame className="h-8 w-8 mr-3" />
                  Burn Tokens
                </h1>
                <p className="text-muted-foreground mt-1">
                  Permanently remove tokens from circulation
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Burn Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> Burning tokens is irreversible. Tokens will be permanently destroyed.
                      </AlertDescription>
                    </Alert>

                    <div>
                      <Label htmlFor="amount">Amount to Burn</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Available balance: 1,000.00 tokens
                      </p>
                    </div>

                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">Confirm Burn</h4>
                      <p className="text-sm text-muted-foreground">
                        You are about to burn <strong>{amount || '0'}</strong> tokens. 
                        This action cannot be undone and will reduce the total supply.
                      </p>
                    </div>

                    <Button 
                      onClick={handleBurn}
                      disabled={!amount || isLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      {isLoading ? 'Burning...' : 'Burn Tokens'}
                    </Button>

                    {txHash && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Burn successful! Hash: {txHash}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Burn Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Supply:</span>
                        <span className="font-medium">10,000,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Burned:</span>
                        <span className="font-medium text-destructive">500,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Burn Rate:</span>
                        <span className="font-medium">5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Balance:</span>
                        <span className="font-medium">1,000.00</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Recent Burns</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">2 hours ago</span>
                          <span className="text-destructive">-100 tokens</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">1 day ago</span>
                          <span className="text-destructive">-250 tokens</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">3 days ago</span>
                          <span className="text-destructive">-500 tokens</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}