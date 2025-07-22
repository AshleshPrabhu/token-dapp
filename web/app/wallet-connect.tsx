'use client'
import { WalletConnectModal } from '@/components/wallet-connect-modal'
import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi';

function WalletConnect() {
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const { isConnected } = useAccount();

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted) {
            setShowWalletModal(!isConnected);
        }
    }, [isConnected, hasMounted]);
    if (!hasMounted) return null;

    return (
        <div className="">
        <WalletConnectModal
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
        />
        </div>
    )
}

export default WalletConnect