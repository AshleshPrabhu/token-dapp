"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWriteContract } from "wagmi";
import { parseUnits } from "viem";
// import ABI, { ContractAddress } from "@/utils/abi";
import { toast } from "sonner";
import { useContractABI } from "@/utils/abi";

export default function MintPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const {ABI,contractAddress:ContractAddress} = useContractABI()
  const { writeContract, isPending, isError, error, data } = useWriteContract();
  const handleMint = async () => {
    try {
      writeContract({
        address: ContractAddress as `0x${string}`,
        abi: ABI,
        functionName: "mint",
        args: [recipient, parseUnits(amount, 18)], //TODO:  here decimal should be taken from contract not hardcode
      });
      // console.log("Mint initiated",data);
      toast.success("minted successfully");
    } catch (err: unknown) {
      // console.error("Mint failed:", err);
      toast.error("failed to mint");
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
                  <Plus className="h-8 w-8 mr-3" />
                  Mint Tokens
                </h1>
                <p className="text-muted-foreground mt-1">
                  Create new tokens and send them to a specified address
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Mint New Tokens</CardTitle>
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
                      <Label htmlFor="amount">Amount to Mint</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleMint}
                      disabled={!recipient || !amount || isPending}
                      className="w-full"
                    >
                      {isPending ? "Minting..." : "Mint Tokens"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Minting Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Only authorized addresses can mint new tokens. Make sure
                        you have the required permissions.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        {/* <span className="text-muted-foreground">Gas Fee:</span>
                        <span>~0.002 ETH</span> */}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span>Ethereum Sepolia</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Confirmation Time:
                        </span>
                        <span>~30 seconds</span>
                      </div>
                    </div>
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
