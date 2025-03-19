import React from 'react';
import { Beaker, Loader2 } from 'lucide-react';
import {
    useTestTubeWalletInit,
    useTestTubeWalletStore,
} from '@/hooks/use-testtube-wallet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const TestTubeWalletButton: React.FC = () => {
    // Initialize wallet event listeners
    useTestTubeWalletInit();

    // Get state and actions from the store
    const { address, connecting, connected, connect, disconnect } =
        useTestTubeWalletStore();

    const formatAddress = (addr: string) => {
        if (!addr) return '';
        return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    };

    if (connecting) {
        return (
            <Button
                disabled
                className="bg-gray-100 text-gray-600 opacity-80"
                size="sm"
            >
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Connecting lab...
            </Button>
        );
    }

    if (connected && address) {
        return (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={disconnect}
                    variant="outline"
                    size="sm"
                    className="group relative overflow-hidden border-[#37B24D]/30 text-[#37B24D] hover:text-white"
                >
                    <span className="relative z-10 flex items-center">
                        <Beaker className="h-4 w-4 mr-2" />
                        {formatAddress(address)}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-[#37B24D] to-[#1C7ED6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                onClick={connect}
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-[#1C7ED6] to-[#37B24D] hover:to-[#1C7ED6] transition-all duration-300"
            >
                <span className="relative z-10 flex items-center">
                    <Beaker className="h-4 w-4 mr-2" />
                    Connect your Wallet
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#7950F2] to-[#7950F2] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
        </motion.div>
    );
};
