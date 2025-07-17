'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAccount } from 'wagmi';
import tokenContract from '@/utils/contract';
import { ethers } from 'ethers';

export default function TransferPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const { address } = useAccount()
    const [balance, setBalance] = useState('')
  
    useEffect(() => {
      const fetchBalance = async () => {
        if (!address) return
        const bal = await tokenContract.balanceOf(address)
        setBalance(ethers.formatUnits(bal, 18))
      }
  
      fetchBalance()
    }, [address])

  const handleTransfer = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setTxHash('0xabcdef1234567890...');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Send className="h-8 w-8 mr-3" />
                  Transfer Tokens
                </h1>
                <p className="text-muted-foreground mt-1">
                  Send tokens to another address
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Tokens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="amount">Amount</Label>
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

                    <Button 
                      onClick={handleTransfer}
                      disabled={!recipient || !amount || isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Sending...' : 'Send Tokens'}
                    </Button>

                    {txHash && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Transfer successful! Hash: {txHash}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transfer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Your Balance:</span>
                        <span>1,000.00 tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Fee:</span>
                        <span>~0.001 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span>Ethereum Mainnet</span>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Double-check the recipient address. Transactions cannot be reversed.
                      </AlertDescription>
                    </Alert>
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