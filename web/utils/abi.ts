"use client"

import { ContractContext } from "@/app/context";
import { useContext, useEffect, useState } from "react";
import { Abi } from "viem";
import { abiService, DEFAULT_ABI } from "./abiService";
import { toast } from "sonner";

export function useContractABI() {
  const [ABI, setABI] = useState(DEFAULT_ABI);
  const [isLoadingABI, setIsLoadingABI] = useState(false);
  const { 
    contractAddress, 
    contractNetwork, 
    isContractValid 
  } = useContext(ContractContext);
  
  useEffect(() => {
    if (!contractAddress || !contractNetwork) {
      setABI(DEFAULT_ABI);
      setIsLoadingABI(false);
      return;
    }

    console.log("useContractABI: Setting up for", contractAddress, contractNetwork);

    // Set default ABI immediately
    setABI(DEFAULT_ABI);

    // Only fetch ABI if contract is valid
    if (!isContractValid) {
      console.log("Contract is invalid, using default ABI");
      setIsLoadingABI(false);
      return;
    }

    setIsLoadingABI(true);

    // Fetch the actual ABI
    const fetchABI = async () => {
      try {
        const abi = await abiService.fetchABI(contractAddress, contractNetwork);
        setABI(abi);
        
        // Only show success toast if we got a non-default ABI
        if (abi !== DEFAULT_ABI && Array.isArray(abi) && abi.length > DEFAULT_ABI.length) {
          toast.success("Contract ABI loaded successfully");
        } else {
          // toast.info("Using default ERC20 ABI (contract not verified or API error)");
        }
      } catch (error) {
        console.error("Error in useContractABI:", error);
        setABI(DEFAULT_ABI);
        toast.warning("Failed to load contract ABI, using default ERC20 ABI");
      } finally {
        setIsLoadingABI(false);
      }
    };

    fetchABI();

    // Subscribe to ABI updates
    const unsubscribe = abiService.subscribe((abi, address) => {
      if (address === contractAddress) {
        console.log("ABI updated for", address);
        setABI(abi);
        setIsLoadingABI(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [contractAddress, contractNetwork, isContractValid]);

  return { 
    ABI, 
    contractAddress, 
    isLoadingABI 
  };
}

export function useContractAddress() {
  const { contractAddress } = useContext(ContractContext);
  return contractAddress;
} 

