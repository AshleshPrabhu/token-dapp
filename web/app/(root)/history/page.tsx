"use client";

import { useContext, useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { History, Search, ExternalLink, Filter } from "lucide-react";
import { useAccount } from "wagmi";
// import tokenContract, { provider } from "@/utils/contract";
import { formatUnits } from "ethers";
import { ContractContext } from "@/app/context";
import { getContract, getProvider } from "@/utils/contract";
import { useContractABI } from "@/utils/abi";
import { toast } from "sonner";

interface Transaction {
  id: string;
  hash: string;
  from: string;
  to: string;
  amount: string;
  type: "Transfer" | "Mint" | "Burn";
  timestamp: string;
  status: "Success" | "Failed";
}

export default function HistoryPage() {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { contractAddress, contractNetwork } = useContext(ContractContext);
  const { ABI } = useContractABI();
  const provider = getProvider(contractNetwork);

  const getOrStoreInLocalStorage = async () => {

    if (!contractAddress || !ABI) {
      toast.error("Contract not properly configured");
      return;
    }
    console.log(contractAddress)
    if (contractAddress !== "0x31b2da62a1fccb0d99eeaf0940a3127045a86830") {
      console.log("here")
      toast.info("Transaction history feature is only implemented for the demo token to avoid costs");
      return;
    }

    if (isLoading) {
      toast.warning("Transaction fetch already in progress");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {

      const data = localStorage.getItem(`transactions-${contractAddress}-${contractNetwork}`);
      if (data) {
        const parsedData = JSON.parse(data);
        const oldDate = new Date(parsedData.timestamp);
        const currentDate = new Date();

        if (currentDate.getTime() - oldDate.getTime() < 24 * 60 * 60 * 1000) {
          setTransactions(parsedData.transactions);
          toast.success("Loaded transactions from cache");
          setIsLoading(false);
          return;
        }
      }

      toast.info("Fetching transaction history... This may take a while");
      const fetchedTransactions = await getTransactions();
      
      if (fetchedTransactions && Array.isArray(fetchedTransactions)) {
        setTransactions(fetchedTransactions);
        
        const newData = {
          timestamp: new Date().toISOString(),
          transactions: fetchedTransactions,
        };
        localStorage.setItem(`transactions-${contractAddress}-${contractNetwork}`, JSON.stringify(newData));
        
        toast.success(`Found ${fetchedTransactions.length} transactions`);
      } else {
        setTransactions([]);
        toast.info("No transactions found");
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transaction history");
      toast.error("Failed to fetch transaction history");
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactions = async () => {
    if (!address || !contractAddress || !ABI) {
      throw new Error("Missing required parameters for transaction fetch");
    }
    
    try {
      const tokenContract = getContract(contractAddress, contractNetwork, ABI);
      const fromBlock = 8700000;
      const latestBlock = await provider.getBlockNumber();
      const chunkSize = 500;
      let allLogs: any[] = [];

      const totalChunks = Math.ceil((latestBlock - fromBlock) / chunkSize);
      let processedChunks = 0;

      for (let start = fromBlock; start <= latestBlock; start += chunkSize) {
        processedChunks++;
        console.log(`Processing chunk ${processedChunks}/${totalChunks} (blocks ${start} to ${Math.min(start + chunkSize - 1, latestBlock)})`);
        
        const end = Math.min(start + chunkSize - 1, latestBlock);

        const [sentLogs, receivedLogs] = await Promise.all([
          tokenContract.queryFilter(
            tokenContract.filters.Transfer(address, null),
            start,
            end,
          ),
          tokenContract.queryFilter(
            tokenContract.filters.Transfer(null, address),
            start,
            end,
          )
        ]);

        allLogs.push(...sentLogs, ...receivedLogs);
        
        if (processedChunks % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const uniqueLogs = allLogs.filter((log, index, self) => 
        index === self.findIndex(l => l.transactionHash === log.transactionHash && l.logIndex === log.logIndex)
      );

      const parsedTxs: Transaction[] = uniqueLogs
        .filter((log) => log.args)
        .sort((a, b) => b.blockNumber - a.blockNumber)
        .map((log, index) => {
          const { from, to, value } = log.args;
          const type =
            from === "0x0000000000000000000000000000000000000000"
              ? "Mint"
              : to === "0x0000000000000000000000000000000000000000"
                ? "Burn"
                : "Transfer";

          return {
            id: `${log.transactionHash}-${log.logIndex}`,
            hash: log.transactionHash,
            from,
            to,
            amount: formatUnits(value, 18), // TODO: get decimals from contract
            type,
            timestamp: `Block #${log.blockNumber}`,
            status: "Success",
          };
        });

      return parsedTxs;
    } catch (err) {
      console.error("Error while fetching transactions:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (contractAddress && contractNetwork) {
      const data = localStorage.getItem(`transactions-${contractAddress}-${contractNetwork}`);
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          setTransactions(parsedData.transactions || []);
        } catch (err) {
          console.error("Error parsing cached transactions:", err);
        }
      }
    }
  }, [contractAddress, contractNetwork]);

  useEffect(() => {
    setTransactions([]);
    setError(null);
  }, [contractAddress, contractNetwork]);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center flex-wrap">
                    <History className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 flex-shrink-0" />
                    <span>Transaction History</span>
                  </h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    View all token transactions and activities
                  </p>
                </div>
                <Button 
                  onClick={() => getOrStoreInLocalStorage()} 
                  className="w-full sm:w-auto"
                  disabled={isLoading || !address || !contractAddress}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Fetching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Get Transactions
                    </>
                  )}
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  {error && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2" 
                        onClick={() => getOrStoreInLocalStorage()}
                        disabled={isLoading}
                      >
                        Try Again
                      </Button>
                    </div>
                  )}

                  {isLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-sm text-muted-foreground">Fetching transaction history...</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a few minutes</p>
                    </div>
                  )}

                  {!isLoading && (
                    <div className="space-y-3 sm:space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors space-y-3 sm:space-y-0"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <Badge
                            variant={
                              tx.type === "Transfer"
                                ? "default"
                                : tx.type === "Mint"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="w-fit"
                          >
                            {tx.type}
                          </Badge>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm sm:text-base">{tx.amount} tokens</p>
                            <div className="text-xs sm:text-sm text-muted-foreground space-y-1 sm:space-y-0">
                              <div className="flex flex-col sm:flex-row sm:space-x-2">
                                <span className="font-medium">From:</span>
                                <span className="break-all">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
                              </div>
                              <div className="flex flex-col sm:flex-row sm:space-x-2">
                                <span className="font-medium">To:</span>
                                <span className="break-all">{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start sm:text-right space-x-2 sm:space-x-0">
                          <p className="text-xs sm:text-sm font-medium">{tx.timestamp}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {tx.status}
                            </Badge>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                    </div>
                  )}

                  {!isLoading && transactions.length === 0 && !error && (
                    <div className="text-center text-muted-foreground mt-8 py-8">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm sm:text-base">No transactions found.</p>
                      <p className="text-xs sm:text-sm mt-2">
                        {!address ? "Please connect your wallet first." : "Click \"Get Transactions\" to fetch your transaction history."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
