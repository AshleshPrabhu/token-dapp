"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Hash, FileText, Globe } from "lucide-react";
// import tokenContract from "@/utils/contract";
import { useContext, useEffect, useState } from "react";
import { formatUnits } from "ethers";
import { ContractContext } from "@/app/context";
import { getContract } from "@/utils/contract";
import { useContractABI } from "@/utils/abi";

export function TokenInfo() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [decimals, setDecimals] = useState(18);
  const [totalSupply, setTotalSupply] = useState("0.0");
  const [isLoading, setIsLoading] = useState(false);
  const { contractAddress, contractNetwork } = useContext(ContractContext);
  const { ABI } = useContractABI();
  
  const getDetails = async () => {
    if (!contractAddress || !ABI) return;
    
    setIsLoading(true);
    try {
      const tokenContract = getContract(contractAddress, contractNetwork, ABI);
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        tokenContract.name(),
        tokenContract.symbol(),
        tokenContract.decimals(),
        tokenContract.totalSupply()
      ]);
      
      const decimalInt = Number(decimals);
      const formattedTotalSupply = formatUnits(totalSupply, decimals);
      
      console.log(name, symbol, decimals, totalSupply);
      setName(name);
      setSymbol(symbol);
      setDecimals(decimalInt);
      setTotalSupply(parseFloat(formattedTotalSupply).toFixed(decimalInt));
    } catch (error) {
      console.error("Error fetching token details:", error);
      // Reset to default values on error
      setName("Unknown");
      setSymbol("???");
      setDecimals(18);
      setTotalSupply("0.0");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("TokenInfo useEffect triggered:", { contractAddress, contractNetwork, ABI: !!ABI });
    if (contractAddress && contractNetwork && ABI) {
      getDetails();
    }
  }, [contractAddress, contractNetwork, ABI]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Token Name
          </CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : name || "Unknown"}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Symbol
          </CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : symbol || "???"}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Decimals
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : decimals}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Supply
          </CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : totalSupply.slice(0, 7)}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLoading ? "" : totalSupply}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
