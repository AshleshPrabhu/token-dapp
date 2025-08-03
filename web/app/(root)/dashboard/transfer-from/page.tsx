"use client";

import { useEffect, useState, useContext } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ethers } from "ethers";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits, createPublicClient, http, isAddress } from "viem";
import { toast } from "sonner";
import { sepolia, mainnet } from "viem/chains";
import { readContract } from "viem/actions";
import { useContractABI } from "@/utils/abi";
import { ContractContext } from "@/app/context";

export default function TransferFromPage() {
    const [fromAddress, setFromAddress] = useState("");
    const [toAddress, setToAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [allowanceBalance, setAllowanceBalance] = useState("");
    const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
    const { address } = useAccount();
    const { ABI, contractAddress: ContractAddress } = useContractABI();
    const { contractNetwork } = useContext(ContractContext);

    const getClient = () => {
        const chain = contractNetwork === "Ethereum Sepolia" ? sepolia : mainnet;
        const rpcUrl = contractNetwork === "Ethereum Sepolia" 
        ? "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37"
        : "https://eth-mainnet.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37";
        
        return createPublicClient({
            chain,
            transport: http(rpcUrl),
        });
    };

    const { writeContract, isPending, isError, error, data } = useWriteContract();

    const handleTransferFrom = async () => {
        try {
            if (!fromAddress || !isAddress(fromAddress)) {
                toast.error("Please enter a valid 'from' address");
                return;
            }
            if (!toAddress || !isAddress(toAddress)) {
                toast.error("Please enter a valid 'to' address");
                return;
            }
            if (!amount || parseFloat(amount) <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }

            writeContract({
                address: ContractAddress as `0x${string}`,
                abi: ABI,
                functionName: "transferFrom",
                args: [fromAddress, toAddress, parseUnits(amount, 18)], // TODO: decimal should be taken from contract
            });
            
            toast.success("Transfer initiated successfully");
        } catch (err: unknown) {
            toast.error("Failed to transfer tokens");
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
            if (!fromAddress || !isAddress(fromAddress)) {
                toast.error("Please enter a valid 'from' address");
                return;
            }
            if (!address) {
                toast.error("Please connect your wallet");
                return;
            }

            setIsCheckingAllowance(true);
            
            const client = getClient(); 
            const result = await readContract(client, {
                address: ContractAddress as `0x${string}`,
                abi: ABI,
                functionName: "allowance",
                args: [fromAddress, address],
            });

            const formattedAllowance = ethers.formatUnits(result as bigint, 18);
            setAllowanceBalance(formattedAllowance);
            
            if (parseFloat(formattedAllowance) === 0) {
                toast.warning("No allowance set for your address");
            } else {
                toast.success(`Allowance found: ${formattedAllowance} tokens`);
            }
        } catch (error) {
            console.error("Error checking allowance:", error);
            toast.error("Failed to check allowance");
            setAllowanceBalance("0");
        } finally {
            setIsCheckingAllowance(false);
        }
    };

    useEffect(() => {
        if (fromAddress && isAddress(fromAddress) && address) {
        checkAllowance();
        } else {
        setAllowanceBalance("");
        }
    }, [fromAddress, address, contractNetwork]);

    useEffect(() => {
        if (data && !isPending) {
            setFromAddress("");
            setToAddress("");
            setAmount("");
            setAllowanceBalance("");
        }
    }, [data, isPending]);

return (
    <div className="min-h-screen bg-background">
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-4 sm:p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center flex-wrap">
                                <ArrowRightLeft className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" />
                                <span>Transfer From</span>
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                            Transfer tokens on behalf of another address (requires prior approval)
                            </p>
                            <div className="mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Network: {contractNetwork}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <Card>
                            <CardHeader>
                                <CardTitle>Transfer From Another Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    You can only transfer tokens from addresses that have approved your wallet to spend their tokens.
                                </AlertDescription>
                                </Alert>

                                <div>
                                <Label htmlFor="fromAddress">From Address (Token Owner)</Label>
                                <Input
                                    id="fromAddress"
                                    placeholder="0x..."
                                    value={fromAddress}
                                    onChange={(e) => setFromAddress(e.target.value)}
                                    className="mt-1 text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    The address that currently owns the tokens
                                </p>
                                </div>

                                <div>
                                <Label htmlFor="toAddress">To Address (Recipient)</Label>
                                <Input
                                    id="toAddress"
                                    placeholder="0x..."
                                    value={toAddress}
                                    onChange={(e) => setToAddress(e.target.value)}
                                    className="mt-1 text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    The address that will receive the tokens
                                </p>
                                </div>

                                <div>
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 text-sm"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Amount of tokens to transfer
                                </p>
                                </div>

                                {allowanceBalance && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm font-medium">Available Allowance</p>
                                    <p className="text-xl sm:text-2xl font-bold break-all">{allowanceBalance}</p>
                                    <p className="text-xs text-muted-foreground">
                                    tokens you can transfer from this address
                                    </p>
                                </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    variant="outline"
                                    onClick={checkAllowance}
                                    disabled={!fromAddress || isCheckingAllowance}
                                    className="flex-1"
                                >
                                    {isCheckingAllowance ? "Checking..." : "Check Allowance"}
                                </Button>
                                <Button
                                    onClick={handleTransferFrom}
                                    disabled={
                                    !fromAddress || 
                                    !toAddress || 
                                    !amount || 
                                    isPending ||
                                    parseFloat(allowanceBalance || "0") === 0
                                    }
                                    className="flex-1"
                                >
                                    {isPending ? "Transferring..." : "Transfer From"}
                                </Button>
                                </div>

                                {parseFloat(allowanceBalance || "0") === 0 && fromAddress && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <AlertDescription className="text-sm">
                                    No allowance found. The owner needs to approve your address first using the Allowance page.
                                    </AlertDescription>
                                </Alert>
                                )}
                            </CardContent>
                            </Card>

                            {isError && (
                            <Card>
                                <CardContent className="pt-4">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <AlertDescription className="break-words text-sm">
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
                            <Card>
                                <CardContent className="pt-4">
                                <Alert>
                                    <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                    <AlertDescription className="flex flex-col text-sm">
                                    <span>Transfer successful!</span>
                                    <span className="text-xs text-muted-foreground break-all mt-1">
                                        Transaction Hash: {data}
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
