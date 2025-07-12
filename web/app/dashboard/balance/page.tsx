'use client';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Search, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useState } from 'react';

export default function BalancePage() {
  const [searchAddress, setSearchAddress] = useState('');

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
                  <CreditCard className="h-8 w-8 mr-3" />
                  Token Balance
                </h1>
                <p className="text-muted-foreground mt-1">
                  Check token balances for any address
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Check Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address or use connected wallet"
                          value={searchAddress}
                          onChange={(e) => setSearchAddress(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button>
                          <Search className="h-4 w-4 mr-2" />
                          Check
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Current Balance
                      </CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,000.00</div>
                      <p className="text-xs text-muted-foreground">
                        Your connected wallet
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        24h Change
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">+2.5%</div>
                      <p className="text-xs text-muted-foreground">
                        +25.00 tokens
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        USD Value
                      </CardTitle>
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$1,250.00</div>
                      <p className="text-xs text-muted-foreground">
                        @ $1.25 per token
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Balance History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Received</p>
                          <p className="text-sm text-muted-foreground">2 hours ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+100.00</p>
                          <p className="text-sm text-muted-foreground">From: 0x123...abc</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Sent</p>
                          <p className="text-sm text-muted-foreground">1 day ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-red-600">-50.00</p>
                          <p className="text-sm text-muted-foreground">To: 0x456...def</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Minted</p>
                          <p className="text-sm text-muted-foreground">3 days ago</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-600">+950.00</p>
                          <p className="text-sm text-muted-foreground">Initial mint</p>
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