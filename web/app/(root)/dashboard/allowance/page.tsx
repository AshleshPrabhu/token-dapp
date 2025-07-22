"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import ABI, { ContractAddress } from "@/utils/abi";
import { parseUnits, createPublicClient, http, isAddress } from "viem";
import { toast } from "sonner";
import { sepolia } from "viem/chains";
import { readContract } from "viem/actions";
import { WalletConnectModal } from "@/components/wallet-connect-modal";

export default function AllowancePage() {
  const [spender, setSpender] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAccount();
  const [balance, setBalance] = useState("");
  // const [showWalletModal, setShowWalletModal] = useState(false);
  // const [hasMounted, setHasMounted] = useState(false);
  // const { isConnected } = useAccount();

  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  // useEffect(() => {
  //   if (hasMounted) {
  //     setShowWalletModal(!isConnected);
  //   }
  // }, [isConnected, hasMounted]);


  const client = createPublicClient({
    chain: sepolia,
    transport: http(
      "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37",
    ),
  });

  const { writeContract, isPending, isError, error, data } = useWriteContract();

  const handleApprove = async () => {
    try {
      writeContract({
        address: ContractAddress,
        abi: ABI,
        functionName: "approve",
        args: [spender, parseUnits(amount, 18)], //TODO:  here decimal should be taken from contract not hardcode
      });
      toast.success("approved successfully");
      setSpender("");
      setAmount("");
    } catch (err: unknown) {
      toast.error("failed to approve");
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

  const checkAllowance = async () => {
    try {
      if (!spender || !isAddress(spender)) {
        toast.error("Please enter a valid Ethereum address");
        return;
      }
      setIsLoading(true);
      const result = await readContract(client, {
        address: ContractAddress,
        abi: ABI,
        functionName: "allowance",
        args: [address, spender],
      });

      const formattedBalance = ethers.formatUnits(result as bigint, 18);
      setBalance(formattedBalance);
    } catch (error) {
      console.log(error);
      toast.error("failed to fetch the allowance");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground flex items-center">
                  <Shield className="h-8 w-8 mr-3" />
                  Token Allowance
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage spending permissions for your tokens
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Set Allowance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="spender">Spender Address</Label>
                      <Input
                        id="spender"
                        placeholder="0x..."
                        value={spender}
                        onChange={(e) => setSpender(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="amount">Allowance Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter amount for allowance
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleApprove}
                        disabled={!spender || !amount || isPending}
                        className="flex-1"
                      >
                        {isPending ? "Approving..." : "Approve"}
                      </Button>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Only approve trusted contracts and addresses. This gives
                        them permission to spend your tokens.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Check Allowance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="owner">Owner Address</Label>
                      <Input
                        id="owner"
                        placeholder="Your address (auto-filled)"
                        className="mt-1"
                        disabled
                      />
                    </div>

                    <div>
                      <Label htmlFor="checkSpender">Spender Address</Label>
                      <Input
                        id="checkSpender"
                        placeholder="0x..."
                        className="mt-1"
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => checkAllowance()}
                      disabled={isLoading}
                    >
                      Check Allowance
                    </Button>

                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">Current Allowance</p>
                      <p className="text-2xl font-bold">{balance}</p>
                      <p className="text-xs text-muted-foreground">
                        tokens approved
                      </p>
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
      {/* <WalletConnectModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
      /> */}
    </div>
  );
}
