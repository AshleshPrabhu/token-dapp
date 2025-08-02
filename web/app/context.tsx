"use client"
import { createContext, useState, ReactNode, Dispatch, SetStateAction, useEffect } from "react";
import { isAddress } from "ethers";

interface ContractContextType {
    contractAddress: string;
    setContractAddress: Dispatch<SetStateAction<string>>;
    contractNetwork: string;
    setContractNetwork: Dispatch<SetStateAction<string>>;
    isContractValid: boolean;
    isContractLoading: boolean;
    contractError: string | null;
}

const ContractContext = createContext<ContractContextType>({
    contractAddress: "",
    setContractAddress: () => {},
    contractNetwork: "",
    setContractNetwork: () => {},
    isContractValid: false,
    isContractLoading: false,
    contractError: null,
});

export { ContractContext };

interface ContractContextProviderProps {
    children: ReactNode;
}

export default function ContractContextProvider({ children }: ContractContextProviderProps) {
    const [contractAddress, setContractAddress] = useState("0x31b2da62a1fccb0d99eeaf0940a3127045a86830");
    const [contractNetwork, setContractNetwork] = useState("Ethereum Sepolia");
    const [isContractValid, setIsContractValid] = useState(true);
    const [isContractLoading, setIsContractLoading] = useState(false);
    const [contractError, setContractError] = useState<string | null>(null);

    // Validate contract whenever address or network changes
    useEffect(() => {
        const validateContract = async () => {
            if (!contractAddress) {
                setIsContractValid(false);
                setContractError("Contract address is required");
                return;
            }

            if (!isAddress(contractAddress)) {
                setIsContractValid(false);
                setContractError("Invalid contract address format");
                return;
            }

            setIsContractLoading(true);
            setContractError(null);

            try {
                // Import here to avoid circular dependency
                const { getContract } = await import("@/utils/contract");
                const { DEFAULT_ABI } = await import("@/utils/abiService");
                
                // Try to create a contract instance and call a basic method
                const contract = getContract(contractAddress, contractNetwork, DEFAULT_ABI);
                
                // Try to call totalSupply to verify it's a valid ERC20 contract
                await contract.totalSupply();
                
                setIsContractValid(true);
                setContractError(null);
            } catch (error) {
                console.error("Contract validation failed:", error);
                setIsContractValid(false);
                setContractError("Invalid contract: Not a valid ERC20 token contract");
            } finally {
                setIsContractLoading(false);
            }
        };

        validateContract();
    }, [contractAddress, contractNetwork]);

    return (
        <ContractContext.Provider
            value={{
                contractAddress,
                setContractAddress,
                contractNetwork,
                setContractNetwork,
                isContractValid,
                isContractLoading,
                contractError,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
}
