import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight, Coins, Flame, Send, Shield, Info, History, CreditCard } from 'lucide-react';

export function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Tokens
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Coins className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">No tokens added yet</p>
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Token
              </Button>
            </div>
          </CardContent>
        </Card> */}

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
      </div>
    </div>
  );
}