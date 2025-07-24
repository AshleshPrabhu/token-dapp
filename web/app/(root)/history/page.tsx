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
  const { contractAddress, contractNetwork } = useContext(ContractContext);
  const tokenContract = getContract(contractAddress, contractNetwork);
  const provider = getProvider(contractNetwork)

  const getOrStoreInLocalStorage = async () => {
    const data = localStorage.getItem("transactions");
    if (data) {
      const parsedData = JSON.parse(data);
      const oldDate = new Date(parsedData.timestamp);
      const currentDate = new Date();

      if (currentDate.getTime() - oldDate.getTime() < 24 * 60 * 60 * 1000) {
        setTransactions(parsedData.transactions);
        return;
      }
    }
    const transactions = await getTransactions();
    if (transactions && Array.isArray(transactions)) {
      setTransactions(transactions);
      const newData = {
        timestamp: new Date().toISOString(),
        transactions,
      };
      localStorage.setItem("transactions", JSON.stringify(newData));
    }
  };

  const getTransactions = async () => {
    console.log(address);
    if (!address) return;
    try {
      const fromBlock = 8700000;
      const latestBlock = await provider.getBlockNumber();
      const chunkSize = 500;
      let allLogs: any[] = [];

      for (let start = fromBlock; start <= latestBlock; start += chunkSize) {
        console.log(start);
        const end = Math.min(start + chunkSize - 1, latestBlock);

        const sentLogs = await tokenContract.queryFilter(
          tokenContract.filters.Transfer(address, null),
          start,
          end,
        );
        const receivedLogs = await tokenContract.queryFilter(
          tokenContract.filters.Transfer(null, address),
          start,
          end,
        );

        allLogs.push(...sentLogs, ...receivedLogs);
      }

      const parsedTxs: Transaction[] = allLogs
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
            id: `${log.transactionHash}-${index}`,
            hash: log.transactionHash,
            from,
            to,
            amount: formatUnits(value, 18), // TODO:
            type,
            timestamp: `Block #${log.blockNumber}`,
            status: "Success",
          };
        });

      // setTransactions(parsedTxs);
      return parsedTxs;
    } catch (err) {
      console.error(" Error while fetching transactions:", err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center">
                    <History className="h-8 w-8 mr-3" />
                    Transaction History
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    View all token transactions and activities
                  </p>
                </div>
                <Button onClick={() => getOrStoreInLocalStorage()}>
                  <Search className="h-4 w-4 mr-2" />
                  Get Transactions
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <Badge
                            variant={
                              tx.type === "Transfer"
                                ? "default"
                                : tx.type === "Mint"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {tx.type}
                          </Badge>
                          <div>
                            <p className="font-medium">{tx.amount} tokens</p>
                            <p className="text-sm text-muted-foreground">
                              From: {tx.from.slice(0, 6)}...{tx.from.slice(-4)}{" "}
                              → To: {tx.to.slice(0, 6)}...
                              {tx.to.slice(-4)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-medium">{tx.timestamp}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {tx.status}
                            </Badge>
                            <a
                              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="ghost" size="sm">
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {transactions.length === 0 && (
                    <div className="text-center text-muted-foreground mt-4">
                      No transactions found.
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
