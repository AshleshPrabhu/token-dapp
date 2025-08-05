"use client"
import { ethers } from "ethers";

export function getContract(contractAddress: string, contractNetwork: string, ABI: any) {
  let url;
  if (contractNetwork === "Ethereum Sepolia") {
    url = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  } else {
    url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  }
  
  const provider = new ethers.JsonRpcProvider(url);
  return new ethers.Contract(contractAddress, ABI, provider);
}

export function getProvider( contractNetwork:string ){
  let url;
  if (contractNetwork === "Ethereum Sepolia") {
    url = `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  } else {
    url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
  }
  
  const provider = new ethers.JsonRpcProvider(url);
  return provider
}