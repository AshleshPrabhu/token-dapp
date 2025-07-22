"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Flame, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAccount, useEnsAddress, useWriteContract } from "wagmi";
import ABI, { ContractAddress } from "@/utils/abi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import tokenContract from "@/utils/contract";
import { ethers } from "ethers";

export default function BurnPage() {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      const bal = await tokenContract.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));
    };

    fetchBalance();
  }, [address]);
  const { writeContract, isPending, isError, error, data } = useWriteContract();
  const handleBurn = async () => {
    try {
      writeContract({
        address: ContractAddress,
        abi: ABI,
        functionName: "burn",
        args: [parseUnits(amount, 18)], //TODO:  here decimal should be taken from contract not hardcode
      });
      toast.success("burned successfully");
    } catch (err: unknown) {
      toast.error("failed to burn");
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        err.name === "ContractFunctionRevertedError"
      ) {
        if ("message" in err) {
          console.error("Revert Reason:", err.message);
        }
      }
    }
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
                        <strong>Warning:</strong> Burning tokens is
                        irreversible. Tokens will be permanently destroyed.
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
                        Available balance: {balance} tokens
                      </p>
                    </div>

                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <h4 className="font-medium text-destructive mb-2">
                        Confirm Burn
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You are about to burn <strong>{amount || "0"}</strong>{" "}
                        tokens. This action cannot be undone and will reduce the
                        total supply.
                      </p>
                    </div>

                    <Button
                      onClick={handleBurn}
                      disabled={!amount || isPending}
                      variant="destructive"
                      className="w-full"
                    >
                      {isPending ? "Burning..." : "Burn Tokens"}
                    </Button>
                  </CardContent>
                </Card>

                {isError && (
                  <Card className="md:col-span-2">
                    <CardContent className="pt-4">
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="break-words">
                          {error?.message
                            ? typeof error.message === "string"
                              ? error.message
                              : JSON.stringify(error.message)
                            : "Transaction failed"}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}

                {!isPending && data && (
                  <Card className="md:col-span-2">
                    <CardContent className="pt-4">
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription className="flex flex-col">
                          <span>Transaction successful!</span>
                          <span className="text-xs text-muted-foreground break-all mt-1">
                            Hash: {data}
                          </span>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
