"use client"

import { ContractContext } from "@/app/context";
import { useContext, useEffect, useState } from "react";
import { Abi } from "viem";
import { abiService, DEFAULT_ABI } from "./abiService";

export function useContractABI() {
  const [ABI, setABI] = useState(DEFAULT_ABI);
  const { 
    contractAddress, 
    contractNetwork, 
    isContractValid 
  } = useContext(ContractContext);
  
  useEffect(() => {
    if (!contractAddress || !contractNetwork) {
      setABI(DEFAULT_ABI);
      return;
    }

    console.log("useContractABI: Setting up for", contractAddress, contractNetwork);

    // Set default ABI immediately
    setABI(DEFAULT_ABI);

    // Only fetch ABI if contract is valid
    if (!isContractValid) {
      console.log("Contract is invalid, using default ABI");
      return;
    }

    // Fetch the actual ABI
    const fetchABI = async () => {
      try {
        const abi = await abiService.fetchABI(contractAddress, contractNetwork);
        setABI(abi);
      } catch (error) {
        console.error("Error in useContractABI:", error);
        setABI(DEFAULT_ABI);
      }
    };

    fetchABI();

    // Subscribe to ABI updates
    const unsubscribe = abiService.subscribe((abi, address) => {
      if (address === contractAddress) {
        console.log("ABI updated for", address);
        setABI(abi);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [contractAddress, contractNetwork, isContractValid]);

  return { ABI, contractAddress };
}

export function useContractAddress() {
  const { contractAddress } = useContext(ContractContext);
  return contractAddress;
} 

