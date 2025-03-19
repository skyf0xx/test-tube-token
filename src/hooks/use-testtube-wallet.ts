import { useEffect } from 'react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { toast } from 'react-toastify';

interface TestTubeWalletState {
    address: string | null;
    connecting: boolean;
    connected: boolean;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    checkConnection: () => Promise<void>;
}

export const useTestTubeWalletStore = create<TestTubeWalletState>()(
    devtools(
        (set) => ({
            address: null,
            connecting: false,
            connected: false,

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
                        set({
                            address,
                            connecting: false,
                            connected: true,
                        });
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
                            '🧪 Laboratory equipment needed! Please install ArConnect to continue',
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

                    toast.success(
                        '🧪 Laboratory connected! Wallet successfully linked',
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
                    });

                    toast.info(
                        '🧬 Laboratory disconnected. Wallet link removed',
                        {
                            autoClose: 3000,
                        }
                    );
                } catch (error) {
                    console.error('Error disconnecting wallet:', error);
                    toast.error('Failed to disconnect laboratory equipment', {
                        autoClose: 5000,
                    });
                }
            },
        }),
        { name: 'test-tube-wallet-store' }
    )
);

// Hook to initialize wallet event listeners
export const useTestTubeWalletInit = () => {
    const checkConnection = useTestTubeWalletStore(
        (state) => state.checkConnection
    );

    useEffect(() => {
        checkConnection();

        // Listen for wallet events
        window.addEventListener('arweaveWalletLoaded', checkConnection);
        window.addEventListener('walletSwitch', checkConnection);

        return () => {
            window.removeEventListener('arweaveWalletLoaded', checkConnection);
            window.removeEventListener('walletSwitch', checkConnection);
        };
    }, [checkConnection]);
};
