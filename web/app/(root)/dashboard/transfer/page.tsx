"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useAccount, useWriteContract } from "wagmi";
// import tokenContract from "@/utils/contract";
// import ABI, { ContractAddress } from "@/utils/abi";
import { parseUnits } from "viem";
import { ethers, isAddress } from "ethers";
import { toast } from "sonner";
import { ContractContext } from "@/app/context";
import { getContract } from "@/utils/contract";
import { useContractABI } from "@/utils/abi";

export default function TransferPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const [balance, setBalance] = useState("");
  const { contractAddress, contractNetwork } = useContext(ContractContext);
  const {ABI,contractAddress:ContractAddress} = useContractABI()
  
  const fetchBalance = useCallback(async () => {
    if (!address || !contractAddress || !ABI) return;
    try {
      console.log("Fetching balance for", address, "on", contractNetwork);
      const tokenContract = getContract(contractAddress, contractNetwork, ABI);
      const bal = await tokenContract.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalance("0.0");
    }
  }, [address, contractAddress, contractNetwork, ABI]);
  
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const { writeContract, isPending, isError, error, data } = useWriteContract();

  const handleTransfer = async () => {
    if (!recipient || !isAddress(recipient)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    try {
      try {
        if (!amount || parseFloat(amount) <= 0) {
          toast.error("Please enter a valid amount to transfer");
          return;
        }
        if (parseFloat(amount) > parseFloat(balance)) {
          toast.error("You don't have enough balance to transfer");
          return;
        }
      } catch (error) {
        
      }
      writeContract({
        address: ContractAddress as `0x${string}`,
        abi: ABI,
        functionName: "transfer",
        args: [recipient, parseUnits(amount, 18)], //TODO:  here decimal should be taken from contract not hardcode
      });
      setAmount("");
      setRecipient("");
      toast.success("transfered successfully");
    } catch (err: unknown) {
      toast.error("failed to transfer");
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
  // TODO:  add refresh balance method

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
                        Available balance: {balance} tokens
                      </p>
                    </div>

                    <Button
                      onClick={handleTransfer}
                      disabled={!recipient || !amount || isPending}
                      className="w-full"
                    >
                      {isPending ? "Sending..." : "Send Tokens"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Transfer Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Your Balance:
                        </span>
                        <span>{balance} tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Fee:</span>
                        <span>~0.001 ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Network:</span>
                        <span>Ethereum Sepolia</span>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Double-check the recipient address. Transactions cannot
                        be reversed.
                      </AlertDescription>
                    </Alert>
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
