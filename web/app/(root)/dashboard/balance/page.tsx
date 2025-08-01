"use client";

import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Search,
  Wallet,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
// import tokenContract from "@/utils/contract";
import { ethers, parseUnits } from "ethers";
import { toast } from "sonner";
// import ABI, { ContractAddress } from "@/utils/abi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isAddress } from "ethers";
import { ContractContext } from "@/app/context";
import { getContract } from "@/utils/contract";
import { useContractABI } from "@/utils/abi";
export default function BalancePage() {
  const [searchAddress, setSearchAddress] = useState("");
  const { address } = useAccount();
  const [balance, setBalance] = useState("");
  const { contractAddress, contractNetwork } = useContext(ContractContext);
  const {ABI, contractAddress: ContractAddress} = useContractABI();

  useEffect(() => {
    const fetchBalance = async () => {
      if (!address || !contractAddress || !ABI) return;
      try {
        const tokenContract = getContract(contractAddress, contractNetwork, ABI);
        const bal = await tokenContract.balanceOf(address);
        setBalance(ethers.formatUnits(bal, 18));
      } catch (error) {
        console.error("Error fetching balance:", error);
        setBalance("0.0");
      }
    };

    fetchBalance();
  }, [address, contractAddress, contractNetwork, ABI]);

  const handleSearch = async () => {
    if (!searchAddress || !isAddress(searchAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    if (!ContractAddress || !ABI) {
      toast.error("Contract not loaded yet. Please wait.");
      return;
    }

    try {
      const tokenContract = getContract(ContractAddress, contractNetwork, ABI);
      const result = await tokenContract.balanceOf(searchAddress);
      const formattedBalance = ethers.formatUnits(result, 18);
      setBalance(formattedBalance);
      toast.success(`Balance fetched for ${searchAddress.slice(0, 6)}...${searchAddress.slice(-4)}`);
    } catch (err) {
      toast.error("Failed to fetch balance");
      console.error(err);
    }
  };
  // useEffect(()=>{
  //   if(!isPending && data){
  //     console.log(data)
  //     setBalance(data)
  //   }
  // },[isPending,data])

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
                  <CreditCard className="h-8 w-8 mr-3" />
                  Token Balance
                </h1>
                <p className="text-muted-foreground mt-1">
                  Check token balances for any address
                </p>
              </div>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Check Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          placeholder="Enter address or use connected wallet"
                          value={searchAddress}
                          onChange={(e) => setSearchAddress(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button onClick={() => handleSearch()}>
                          <Search className="h-4 w-4 mr-2" />
                          Check
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Current Balance
                      </CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{balance}</div>
                      <p className="text-xs text-muted-foreground">
                        Your connected wallet
                      </p>
                    </CardContent>
                  </Card>
                  {/* {isError && (
                    <Card className="md:col-span-2">
                      <CardContent className="pt-4">
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="break-words">
                            {error?.message ? 
                            (typeof error.message === 'string' ? error.message : JSON.stringify(error.message)) 
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
                  )} */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
