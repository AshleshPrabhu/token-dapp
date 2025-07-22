
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WalletConnect from "../wallet-connect";

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
                {children}
            </body>
        </html>
    );
}
