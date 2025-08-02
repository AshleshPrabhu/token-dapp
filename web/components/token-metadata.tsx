"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Copy,
  ExternalLink,
  Shield,
  Plus,
  Send,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useContext } from "react";
import { ContractContext } from "@/app/context";
import { Input } from "@/components/ui/input"; // Import Input component
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Import Select components
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function TokenMetadata() {
  const {
    contractAddress,
    contractNetwork,
    setContractAddress,
    setContractNetwork,
    isContractValid,
    isContractLoading,
    contractError,
  } = useContext(ContractContext);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    toast.success("Copied contract address to clipboard!");
  };

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
          {/* Contract Address Field */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Contract Address
            </label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                className="text-sm"
              />
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm">
                <a
                  href={`https://${contractNetwork === "Ethereum Sepolia" ? "sepolia." : ""}etherscan.io/address/${contractAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Contract Validation Status */}
          <div>
            {isContractLoading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Validating contract address...
                </AlertDescription>
              </Alert>
            )}
            
            {!isContractLoading && isContractValid && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Contract is valid and accessible
                </AlertDescription>
              </Alert>
            )}
            
            {!isContractLoading && !isContractValid && contractError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {contractError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Contract Network Dropdown */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Network
            </label>
            <div className="mt-1">
              <Select
                value={contractNetwork}
                onValueChange={(value) => setContractNetwork(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ethereum Sepolia">Ethereum Sepolia</SelectItem>
                  <SelectItem value="Ethereum Mainnet">Ethereum Mainnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Token Standard */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Token Standard
            </label>
            <div className="mt-1">
              <Badge variant="outline">ERC-20</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/mint">
                <Plus className="h-4 w-4 mr-2" />
                Mint Tokens
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/transfer">
                <Send className="h-4 w-4 mr-2" />
                Transfer Tokens
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/dashboard/balance">
                <CreditCard className="h-4 w-4 mr-2" />
                Check Balance
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
