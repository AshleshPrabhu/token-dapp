'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Hash, FileText, Globe } from 'lucide-react';
import tokenContract from '@/utils/contract';
import { useEffect, useState } from 'react';
import {formatUnits} from "ethers";

export function TokenInfo() {
  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [decimals, setDecimals] = useState(18)  
  const [totalSupply, setTotalSupply] = useState("0.0")

  const getDetails = async()=>{
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol();
    const decimals = await tokenContract.decimals();
    const decimalInt = Number(decimals);
    const totalSupply = await tokenContract.totalSupply();
    const formattedTotalSupply = formatUnits(totalSupply,decimals);
    console.log(name,symbol,decimals,totalSupply)
    setName(name);
    setSymbol(symbol);
    setDecimals(decimalInt);
    setTotalSupply(parseFloat(formattedTotalSupply).toFixed(decimalInt));
  }

  useEffect(()=>{
    getDetails()
  },[])

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
          <div className="text-2xl font-bold">{name}</div>
          {/* <p className="text-xs text-muted-foreground">
            {name}
          </p> */}
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
          <div className="text-2xl font-bold">{symbol}</div>
          {/* <p className="text-xs text-muted-foreground">
            {symbol}
          </p> */}
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
          <div className="text-2xl font-bold">{decimals}</div>
          {/* <p className="text-xs text-muted-foreground">
            {decimals}
          </p> */}
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
          <div className="text-2xl font-bold">{totalSupply.slice(0,7)}</div>
          <p className="text-xs text-muted-foreground">
            {totalSupply}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}