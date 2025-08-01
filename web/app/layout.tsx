import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { WagmiConfigProvider } from "./wagmi-config-provider";
import ContractContextProvider from "./context";
import { Toaster } from "sonner";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WagmiConfigProvider>
            <ContractContextProvider>
              <Toaster />
              {children}
            </ContractContextProvider>
          </WagmiConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
