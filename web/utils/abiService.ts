"use client"

import { Abi } from "viem";

const abiCache = new Map<string, { abi: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

const DEFAULT_ABI = [
    {
        type: "constructor",
        inputs: [
        {
            name: "_name",
            type: "string",
            internalType: "string",
        },
        {
            name: "_symbol",
            type: "string",
            internalType: "string",
        },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "allowance",
        inputs: [
        {
            name: "owner",
            type: "address",
            internalType: "address",
        },
        {
            name: "spender",
            type: "address",
            internalType: "address",
        },
        ],
        outputs: [
        {
            name: "",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "approve",
        inputs: [
        {
            name: "spender",
            type: "address",
            internalType: "address",
        },
        {
            name: "value",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        outputs: [
        {
            name: "",
            type: "bool",
            internalType: "bool",
        },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "balanceOf",
        inputs: [
        {
            name: "account",
            type: "address",
            internalType: "address",
        },
        ],
        outputs: [
        {
            name: "",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "burn",
        inputs: [
        {
            name: "_amount",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "decimals",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "uint8",
            internalType: "uint8",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "mint",
        inputs: [
        {
            name: "_to",
            type: "address",
            internalType: "address",
        },
        {
            name: "_amount",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "name",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "string",
            internalType: "string",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "owner",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "address",
            internalType: "address",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "renounceOwnership",
        inputs: [],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "symbol",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "string",
            internalType: "string",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "totalSupply",
        inputs: [],
        outputs: [
        {
            name: "",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "transfer",
        inputs: [
        {
            name: "to",
            type: "address",
            internalType: "address",
        },
        {
            name: "value",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        outputs: [
        {
            name: "",
            type: "bool",
            internalType: "bool",
        },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "transferFrom",
        inputs: [
        {
            name: "from",
            type: "address",
            internalType: "address",
        },
        {
            name: "to",
            type: "address",
            internalType: "address",
        },
        {
            name: "value",
            type: "uint256",
            internalType: "uint256",
        },
        ],
        outputs: [
        {
            name: "",
            type: "bool",
            internalType: "bool",
        },
        ],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "transferOwnership",
        inputs: [
        {
            name: "newOwner",
            type: "address",
            internalType: "address",
        },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "Approval",
        inputs: [
        {
            name: "owner",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        {
            name: "spender",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
        },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "OwnershipTransferred",
        inputs: [
        {
            name: "previousOwner",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        {
            name: "newOwner",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "Transfer",
        inputs: [
        {
            name: "from",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        {
            name: "to",
            type: "address",
            indexed: true,
            internalType: "address",
        },
        {
            name: "value",
            type: "uint256",
            indexed: false,
            internalType: "uint256",
        },
        ],
        anonymous: false,
    }
];

class ABIService {
    private static instance: ABIService;
    private subscribers: Set<(abi: any, contractAddress: string) => void> = new Set();

    static getInstance(): ABIService {
        if (!ABIService.instance) {
        ABIService.instance = new ABIService();
        }
        return ABIService.instance;
    }

    subscribe(callback: (abi: any, contractAddress: string) => void) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    private notifySubscribers(abi: any, contractAddress: string) {
        this.subscribers.forEach(callback => callback(abi, contractAddress));
    }

    async fetchABI(contractAddress: string, contractNetwork: string): Promise<any> {
        const cacheKey = `${contractAddress}-${contractNetwork}`;
        
        // Check cache first
        const cached = abiCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log("Using cached ABI for:", contractAddress);
            this.notifySubscribers(cached.abi, contractAddress);
            return cached.abi;
        }

        console.log("Fetching ABI for:", contractAddress, "on", contractNetwork);
        
        try {
        let url;
        if (contractNetwork === "Ethereum Sepolia") {
            url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
        } else {
            url = `https://api-mainnet.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        
        if (data.status === "1") {
            const abi = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
            console.log("ABI fetched successfully from Etherscan");
            
            // Cache the result
            abiCache.set(cacheKey, { abi, timestamp: Date.now() });
            
            this.notifySubscribers(abi, contractAddress);
            return abi;
        } else {
            console.warn("ABI fetch failed:", data.result, "- Using default ABI");
            
            // Cache the default ABI to avoid repeated failed requests
            abiCache.set(cacheKey, { abi: DEFAULT_ABI, timestamp: Date.now() });
            
            this.notifySubscribers(DEFAULT_ABI, contractAddress);
            return DEFAULT_ABI;
        }
        } catch (error) {
        console.error('Error fetching ABI:', error, "- Using default ABI");
        
        // Cache the default ABI to avoid repeated failed requests
        abiCache.set(cacheKey, { abi: DEFAULT_ABI, timestamp: Date.now() });
        
        this.notifySubscribers(DEFAULT_ABI, contractAddress);
        return DEFAULT_ABI;
        }
    }

    getDefaultABI(): any {
        return DEFAULT_ABI;
    }
}

export const abiService = ABIService.getInstance();
export { DEFAULT_ABI };
