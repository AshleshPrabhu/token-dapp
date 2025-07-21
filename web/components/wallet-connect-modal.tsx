"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useConnect } from "wagmi";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// const wallets = [
//   {
//     name: 'MetaMask',
//     icon: Chrome,
//     description: 'Connect using browser extension',
//     id: 'metamask'
//   },
//   {
//     name: 'WalletConnect',
//     icon: Smartphone,
//     description: 'Connect using mobile wallet',
//     id: 'walletconnect'
//   },
//   {
//     name: 'Coinbase Wallet',
//     icon: Wallet,
//     description: 'Connect using Coinbase Wallet',
//     id: 'coinbase'
//   },
//   {
//     name: 'Hardware Wallet',
//     icon: HardDrive,
//     description: 'Connect using Ledger or Trezor',
//     id: 'hardware'
//   }
// ];

export function WalletConnectModal({
  isOpen,
  onClose,
}: WalletConnectModalProps) {
  const { connectors, connect } = useConnect();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred wallet to connect and start managing your
            tokens.
          </p>
          {connectors.map((connector) => (
            <Button
              key={connector.uid}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => {
                connect({ connector });
              }}
            >
              <Wallet className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-medium">{connector.name}</div>
                {/* <div className="text-xs text-muted-foreground">{connector.description}</div> */}
              </div>
            </Button>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            By connecting your wallet, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
