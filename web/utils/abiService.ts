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
        this.subscribers.forEach(callback => {
            try {
                callback(abi, contractAddress);
            } catch (error) {
                console.error('Error in ABI subscriber:', error);
            }
        });
    }

    private async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchWithRetry(url: string, retries = 3): Promise<Response> {
        for (let i = 0; i < retries; i++) {
            try {
                console.log(`🔄 Attempting ABI fetch (${i + 1}/${retries})`);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

                const response = await fetch(url, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'TokenDApp/1.0'
                    }
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    return response;
                }

                if (response.status === 429) {
                    console.warn(`⏳ Rate limited, waiting before retry ${i + 1}/${retries}`);
                    await this.delay(Math.pow(2, i) * 2000); // Exponential backoff
                    continue;
                }

                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            } catch (error: any) {
                console.warn(`❌ Fetch attempt ${i + 1} failed:`, error.message);
                
                if (i === retries - 1) {
                    throw error;
                }
                
                // Wait before retry with exponential backoff
                await this.delay(Math.pow(2, i) * 1000);
            }
        }
        
        throw new Error('All retry attempts failed');
    }

    async fetchABI(contractAddress: string, contractNetwork: string): Promise<any> {
    const cacheKey = `${contractAddress}-${contractNetwork}`;
    
    const cached = abiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log("Using cached ABI for:", contractAddress);
        this.notifySubscribers(cached.abi, contractAddress);
        return cached.abi;
    }

    if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
        console.warn("Invalid contract address format");
        const defaultAbi = DEFAULT_ABI;
        this.notifySubscribers(defaultAbi, contractAddress);
        return defaultAbi;
    }

    console.log("Fetching ABI for:", contractAddress, "on", contractNetwork);
    
    try {
        let apiUrl: string;
        
        if (contractNetwork === "Ethereum Sepolia") {
            apiUrl = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
        } else {
            apiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}`;
        }

        console.log(" API URL:", apiUrl);

        const response = await this.fetchWithRetry(apiUrl);
        const data = await response.json();

        console.log(" API Response:", data);

        if (data.status === "1" && data.result) {
            try {
                const abi = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
                
                if (Array.isArray(abi) && abi.length > 0) {
                    console.log("ABI fetched successfully from Etherscan");
                    
                    abiCache.set(cacheKey, { abi, timestamp: Date.now() });
                    
                    this.notifySubscribers(abi, contractAddress);
                    return abi;
                } else {
                    throw new Error("Invalid ABI structure received");
                }
            } catch (parseError) {
                console.error(" Failed to parse ABI:", parseError);
                throw new Error("Invalid ABI format received from API");
            }
        } else {
            const errorMsg = data.result || data.message || "Unknown API error";
            console.warn(" Etherscan API response:", errorMsg);
            
            if (errorMsg.includes("Contract source code not verified")) {
                console.info(" Contract not verified - using default ERC20 ABI");
            } else if (errorMsg.includes("Invalid API Key") || errorMsg.includes("Missing/Invalid API Key")) {
                console.info(" Using public API endpoint (rate limited)");
            } else if (errorMsg.includes("Max rate limit reached")) {
                console.warn(" Rate limit reached - using default ABI");
            } else {
                console.warn(" API request failed - using default ABI");
            }
            
            abiCache.set(cacheKey, { abi: DEFAULT_ABI, timestamp: Date.now() - (CACHE_DURATION / 2) });
            
            this.notifySubscribers(DEFAULT_ABI, contractAddress);
            return DEFAULT_ABI;
        }
    } catch (error: any) {
        console.error(' Error fetching ABI:', error.message);
        
        let errorContext = "using default ERC20 ABI";
        if (error.name === 'AbortError') {
            errorContext = "request timeout - " + errorContext;
            console.warn(" Request timed out - " + errorContext);
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorContext = "network error - " + errorContext;
            console.warn(" Network connectivity issue - " + errorContext);
        } else if (error.message.includes('rate limit')) {
            errorContext = "rate limited - " + errorContext;
            console.warn(" API rate limited - " + errorContext);
        } else {
            console.warn(" API error - " + errorContext);
        }
        
        console.info(` Falling back to default ABI (${errorContext})`);
        
        abiCache.set(cacheKey, { abi: DEFAULT_ABI, timestamp: Date.now() - (CACHE_DURATION / 2) });
        
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
