'use client';

import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { History, Search, ExternalLink, Filter } from 'lucide-react';

const transactions = [
  {
    id: '1',
    type: 'Transfer',
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    from: '0xabcd...1234',
    to: '0xefgh...5678',
    amount: '100.00',
    timestamp: '2 hours ago',
    status: 'Success'
  },
  {
    id: '2',
    type: 'Mint',
    hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    from: '0x0000...0000',
    to: '0xabcd...1234',
    amount: '500.00',
    timestamp: '1 day ago',
    status: 'Success'
  },
  {
    id: '3',
    type: 'Burn',
    hash: '0x567890abcdef1234567890abcdef1234567890ab',
    from: '0xabcd...1234',
    to: '0x0000...0000',
    amount: '50.00',
    timestamp: '2 days ago',
    status: 'Success'
  },
  {
    id: '4',
    type: 'Approval',
    hash: '0xcdef1234567890abcdef1234567890abcdef1234',
    from: '0xabcd...1234',
    to: '0x1111...2222',
    amount: '1000.00',
    timestamp: '3 days ago',
    status: 'Success'
  }
];

export default function HistoryPage() {
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
                  <History className="h-8 w-8 mr-3" />
                  Transaction History
                </h1>
                <p className="text-muted-foreground mt-1">
                  View all token transactions and activities
                </p>
              </div>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Filter Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by transaction hash or address..."
                        className="w-full"
                      />
                    </div>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div>
                            <Badge variant={
                              tx.type === 'Transfer' ? 'default' :
                              tx.type === 'Mint' ? 'secondary' :
                              tx.type === 'Burn' ? 'destructive' :
                              'outline'
                            }>
                              {tx.type}
                            </Badge>
                          </div>
                          <div>
                            <p className="font-medium">{tx.amount} tokens</p>
                            <p className="text-sm text-muted-foreground">
                              From: {tx.from} → To: {tx.to}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">{tx.timestamp}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {tx.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button variant="outline">
                      Load More Transactions
                    </Button>
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