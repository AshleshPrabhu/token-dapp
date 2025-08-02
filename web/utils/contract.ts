"use client"
import { ethers } from "ethers";

export function getContract(contractAddress: string, contractNetwork: string, ABI: any) {
  let url;
  if (contractNetwork === "Ethereum Sepolia") {
    url = "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37";
  } else {
    url = "https://eth-mainnet.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37";
  }
  
  const provider = new ethers.JsonRpcProvider(url);
  return new ethers.Contract(contractAddress, ABI, provider);
}

export function getProvider( contractNetwork:string ){
  let url;
  if (contractNetwork === "Ethereum Sepolia") {
    url = "https://eth-sepolia.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37";
  } else {
    url = "https://eth-mainnet.g.alchemy.com/v2/fQZ3GExRdziF2fHUbxX6Jwt9w18XWj37";
  }
  
  const provider = new ethers.JsonRpcProvider(url);
  return provider
}