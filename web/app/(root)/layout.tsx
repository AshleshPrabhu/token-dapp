
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletConnect from "../wallet-connect";
import { ContractGuard } from "@/components/contract-guard";
import {Toaster} from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Token Manager - Dashboard",
    description: "Manage and track your tokens",
};

export default function RootLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <WalletConnect/>
                <ContractGuard>
                    <Toaster />
                    {children}
                </ContractGuard>
            </body>
        </html>
    );
}
