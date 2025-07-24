"use client"
import { createContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface ContractContextType {
    contractAddress: string;
    setContractAddress: Dispatch<SetStateAction<string>>;
    contractNetwork: string;
    setContractNetwork: Dispatch<SetStateAction<string>>;
}

const ContractContext = createContext<ContractContextType>({
    contractAddress: "",
    setContractAddress: () => {},
    contractNetwork: "",
    setContractNetwork: () => {},
});

export { ContractContext };

interface ContractContextProviderProps {
    children: ReactNode;
}

export default function ContractContextProvider({ children }: ContractContextProviderProps) {
    const [contractAddress, setContractAddress] = useState("0x31b2da62a1fccb0d99eeaf0940a3127045a86830");
    const [contractNetwork, setContractNetwork] = useState("Ethereum Sepolia");

    return (
        <ContractContext.Provider
            value={{
                contractAddress,
                setContractAddress,
                contractNetwork,
                setContractNetwork,
            }}
        >
            {children}
        </ContractContext.Provider>
    );
}
