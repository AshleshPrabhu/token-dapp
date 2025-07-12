import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink, Shield, Clock } from 'lucide-react';

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
              <code className="flex-1 text-sm bg-muted px-2 py-1 rounded">
                0x...
              </code>
              <Button variant="ghost" size="sm">
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Network</label>
            <div className="mt-1">
              <Badge variant="secondary">Ethereum Mainnet</Badge>
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
      </Card>
    </div>
  );
}