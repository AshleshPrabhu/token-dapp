'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Shield, Clock,Plus, ArrowRight, Coins, Flame, Send, Info, History, CreditCard } from 'lucide-react';

import { toast } from 'sonner';

export function TokenMetadata() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Contract Details
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="flex-1 text-sm bg-muted px-2 py-1 rounded cursor-pointer">
                0x31b2da62a1fccb0d99eeaf0940a3127045a86830
              </code>
              <Button variant="ghost" size="sm" onClick={() => {
                  navigator.clipboard.writeText("0x31b2da62a1fccb0d99eeaf0940a3127045a86830")
                  toast.success("copied") 
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <a href="https://sepolia.etherscan.io/address/0x31b2da62a1fccb0d99eeaf0940a3127045a86830" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Network</label>
            <div className="mt-1">
              <Badge variant="secondary">Ethereum Sepolia</Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Token Standard</label>
            <div className="mt-1">
              <Badge variant="outline">ERC-20</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Quick Actions
                    <Button variant="ghost" size="sm">
                      More
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Mint Tokens
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Send className="h-4 w-4 mr-2" />
                      Transfer Tokens
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Check Balance
                    </Button>
                  </div>
                </CardContent>
              </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Token Metadata
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-sm mt-1 text-muted-foreground">
              Connect your wallet to view token metadata
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Website</label>
            <div className="mt-1">
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Created</label>
            <div className="mt-1">
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
            <div className="mt-1">
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}