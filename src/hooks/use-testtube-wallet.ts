import { useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { getBalance, TEST_TOKEN } from '@/utils/wallet-actions';

// Track if initialization has already happened
let isInitialized = false;

interface TestTubeWalletState {
    address: string | null;
    connecting: boolean;
    connected: boolean;
    balance: number | undefined;
    isBalanceLoading: boolean;
    lastBalanceUpdate: number;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkConnection: () => Promise<void>;
    refreshBalance: () => Promise<void>;
}

export const useTestTubeWalletStore = create<TestTubeWalletState>()(
    devtools(
        (set, get) => ({
            address: null,
            connecting: false,
            connected: false,
            balance: undefined,
            isBalanceLoading: false,
            lastBalanceUpdate: 0,

            refreshBalance: async () => {
                const {
                    address,
                    connected,
                    isBalanceLoading,
                    lastBalanceUpdate,
                } = get();
                if (!connected || !address) return;

                // Prevent multiple simultaneous balance requests
                if (isBalanceLoading) return;

                // Throttle balance updates - only refresh if it's been at least 3 seconds
                const now = Date.now();
                if (now - lastBalanceUpdate < 3000) return;

                try {
                    set({ isBalanceLoading: true });

                    const balanceResponse = await getBalance(
                        address,
                        TEST_TOKEN,
                        12
                    );

                    if (balanceResponse) {
                        set({
                            balance: parseFloat(balanceResponse.balance),
                            lastBalanceUpdate: now,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching balance:', error);
                    toast.error('Failed to fetch token balance', {
                        autoClose: 5000,
                    });
                } finally {
                    set({ isBalanceLoading: false });
                }
            },

            checkConnection: async () => {
                try {
                    // Check if ArConnect is installed
                    if (!window.arweaveWallet) {
                        return;
                    }

                    const permissions =
                        await window.arweaveWallet.getPermissions();
                    if (permissions.includes('ACCESS_ADDRESS')) {
                        const address =
                            await window.arweaveWallet.getActiveAddress();

                        // Only update state if the address has changed
                        const { address: currentAddress } = get();
                        if (currentAddress !== address) {
                            set({
                                address,
                                connecting: false,
                                connected: true,
                            });

                            // Fetch balance after confirming connection
                            const { refreshBalance } = get();
                            await refreshBalance();
                        } else if (!currentAddress) {
                            // If we didn't have an address before but now we do
                            set({
                                address,
                                connecting: false,
                                connected: true,
                            });

                            // Fetch balance
                            const { refreshBalance } = get();
                            await refreshBalance();
                        }
                    }
                } catch (error) {
                    console.error('Error checking connection:', error);
                }
            },

            connect: async () => {
                try {
                    set({ connecting: true });

                    // Check if ArConnect is installed
                    if (!window.arweaveWallet) {
                        toast.info(
                            '🧪 Wallet needed! Please install ArConnect to continue',
                            {
                                autoClose: 5000,
                            }
                        );
                        window.open('https://arconnect.io', '_blank');
                        return;
                    }

                    // Request permissions
                    await window.arweaveWallet.connect([
                        'ACCESS_ADDRESS',
                        'SIGN_TRANSACTION',
                    ]);

                    const address =
                        await window.arweaveWallet.getActiveAddress();

                    set({
                        address,
                        connecting: false,
                        connected: true,
                    });

                    // Fetch balance after connecting
                    const { refreshBalance } = get();
                    await refreshBalance();

                    toast.success(
                        '🧪 Wallet connected! Wallet successfully linked',
                        {
                            autoClose: 3000,
                        }
                    );
                } catch (error) {
                    console.error('Error connecting wallet:', error);
                    toast.error(
                        'Connection failed! Unable to establish wallet link',
                        {
                            autoClose: 5000,
                        }
                    );
                } finally {
                    set({ connecting: false });
                }
            },

            disconnect: async () => {
                try {
                    await window.arweaveWallet?.disconnect();
                    set({
                        address: null,
                        connecting: false,
                        connected: false,
                        balance: undefined, // Reset balance on disconnect
                    });

                    toast.info('🧬 Wallet disconnected. Wallet link removed', {
                        autoClose: 3000,
                    });
                } catch (error) {
                    console.error('Error disconnecting wallet:', error);
                    toast.error('Failed to disconnect wallet equipment', {
                        autoClose: 5000,
                    });
                }
            },
        }),
        { name: 'test-tube-wallet-store' }
    )
);

// Hook to initialize wallet event listeners (ensures only one initialization)
export const useTestTubeWalletInit = () => {
    const { checkConnection } = useTestTubeWalletStore();

    useEffect(() => {
        // Prevent multiple initializations
        if (isInitialized) return;
        isInitialized = true;

        // Check connection once on mount
        checkConnection();

        // Listen for wallet events
        const handleWalletEvent = () => {
            checkConnection();
        };

        window.addEventListener('arweaveWalletLoaded', handleWalletEvent);
        window.addEventListener('walletSwitch', handleWalletEvent);

        return () => {
            window.removeEventListener(
                'arweaveWalletLoaded',
                handleWalletEvent
            );
            window.removeEventListener('walletSwitch', handleWalletEvent);
            isInitialized = false;
        };
    }, []);
};
