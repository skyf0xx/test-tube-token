import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical,
    Beaker,
    Loader2,
    CheckCircle2,
    Copy,
    AlertCircle,
    Clock,
    RefreshCcw,
    ChevronDown,
    ChevronUp,
    ExternalLink,
} from 'lucide-react';
import { useTestTubeWalletStore } from '@/hooks/use-testtube-wallet';
import { toast } from 'react-toastify';
import { MINT_TOKEN } from '@/utils/wallet-actions';
import { cn } from '@/utils/utils';
import { sendMessage } from '@/utils/messages';

export const TokenDispenserSection: React.FC = () => {
    return (
        <section
            id="token-dispenser"
            className="w-full py-16 bg-gradient-to-b from-background to-muted"
        >
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold font-headings mb-3">
                        Token Dispenser
                    </h2>
                    <p className="text-foreground/70 max-w-xl mx-auto">
                        Request your test tokens for the AO blockchain. New
                        specimens available every 24 hours.
                    </p>
                </div>

                {/* Token Dispenser Component */}
                <div className="max-w-xl mx-auto">
                    <TokenDispenserCard />
                </div>
            </div>
        </section>
    );
};

// Core functionality component
const TokenDispenserCard: React.FC = () => {
    const { address, connected, connect } = useTestTubeWalletStore();

    // If not connected, show connect state
    if (!connected) {
        return <DisconnectedDispenser onConnect={connect} />;
    }

    // If connected, show the main dispenser
    return <ConnectedDispenser address={address!} />;
};

// Component shown when wallet is not connected
const DisconnectedDispenser: React.FC<{ onConnect: () => Promise<void> }> = ({
    onConnect,
}) => {
    return (
        <motion.div
            className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex flex-col items-center text-center">
                <div className="relative h-32 w-32 mb-6">
                    {/* Empty test tube visualization */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center opacity-50"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    >
                        <FlaskConical
                            size={100}
                            className="text-muted-foreground"
                            strokeWidth={1.5}
                        />
                    </motion.div>
                </div>

                <h3 className="text-xl font-bold font-headings mb-3">
                    Laboratory Equipment Needed
                </h3>

                <p className="text-foreground/70 mb-6 max-w-md">
                    Connect your ArConnect wallet to access the token dispenser
                    and begin your blockchain experiments.
                </p>

                <motion.button
                    onClick={onConnect}
                    className="inline-flex items-center bg-gradient-to-r from-laboratory-blue to-test-tube-green text-white font-medium rounded-lg px-6 py-3 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <FlaskConical size={18} className="mr-2" />
                    Connect Laboratory
                </motion.button>
            </div>
        </motion.div>
    );
};

// Component shown when wallet is connected
const ConnectedDispenser: React.FC<{ address: string }> = ({ address }) => {
    // State for the dispenser
    const [dispenserState, setDispenserState] = useState<
        'ready' | 'processing' | 'success' | 'error' | 'rate-limited'
    >('ready');
    const [transaction, setTransaction] = useState<{
        id: string;
        timestamp: number;
    } | null>(null);
    const [nextRequestTime, setNextRequestTime] = useState<number | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [countdown, setCountdown] = useState<string>('');

    // Check if user already requested tokens today
    useEffect(() => {
        const checkPreviousRequest = () => {
            const lastRequest = localStorage.getItem(
                `testTubeLastRequest_${address}`
            );
            if (lastRequest) {
                const { timestamp } = JSON.parse(lastRequest);
                const now = Date.now();
                const nextAvailable = timestamp + 24 * 60 * 60 * 1000; // 24 hours

                if (now < nextAvailable) {
                    setNextRequestTime(nextAvailable);
                    setDispenserState('rate-limited');

                    // Load the transaction from last request
                    const txData = JSON.parse(lastRequest);
                    setTransaction(txData);
                }
            }
        };

        checkPreviousRequest();
    }, [address]);

    // Countdown timer when rate limited
    useEffect(() => {
        if (!nextRequestTime) return;

        const updateCountdown = () => {
            const now = Date.now();
            const timeRemaining = nextRequestTime - now;

            if (timeRemaining <= 0) {
                setDispenserState('ready');
                setNextRequestTime(null);
                setCountdown('');
                return;
            }

            const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
            const minutes = Math.floor(
                (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
            );
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            setCountdown(
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            );
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [nextRequestTime]);

    // Handler for requesting tokens
    const handleRequestTokens = async () => {
        setDispenserState('processing');

        try {
            // Send token request to blockchain
            const tags = [
                { name: 'Action', value: 'Mint' },
                { name: 'Recipient', value: address },
                { name: 'Quantity', value: '10000000000' }, // 100 tokens with 8 decimal places
            ];

            const txId = await sendMessage(MINT_TOKEN, tags, true);

            // Store the transaction details and timestamp
            const txData = { id: txId, timestamp: Date.now() };
            setTransaction(txData);

            // Save to localStorage for rate limiting
            localStorage.setItem(
                `testTubeLastRequest_${address}`,
                JSON.stringify(txData)
            );

            // Set next available time (24 hours from now)
            const nextAvailable = Date.now() + 24 * 60 * 60 * 1000;
            setNextRequestTime(nextAvailable);

            // Update state to success
            setDispenserState('success');

            toast.success('🧪 Test tokens successfully dispensed!', {});
        } catch (error) {
            console.error('Error dispensing tokens:', error);
            setDispenserState('error');
            toast.error('⚠️ Token dispensing failed! Please try again.', {});
        }
    };

    // Reset from error state
    const handleRetry = () => {
        setDispenserState('ready');
        setTransaction(null);
    };

    // Copy transaction ID to clipboard
    const handleCopyTx = () => {
        if (transaction?.id) {
            navigator.clipboard.writeText(transaction.id);
            toast.info('📋 Transaction ID copied to clipboard', {
                autoClose: 2000,
            });
        }
    };

    // Format wallet address for display
    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <motion.div
            className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Laboratory grid background */}
            <div className="absolute inset-0 lab-grid-bg opacity-20"></div>

            <div className="relative z-10">
                {/* Connected wallet info */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center bg-muted px-3 py-1.5 rounded-lg">
                        <span className="text-xs font-mono mr-2">
                            {formatAddress(address)}
                        </span>
                        <motion.button
                            onClick={() => {
                                navigator.clipboard.writeText(address);
                                toast.info('📋 Address copied to clipboard', {
                                    autoClose: 2000,
                                });
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Copy
                                size={14}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            />
                        </motion.button>
                    </div>
                    <div className="text-xs text-foreground/60 font-mono bg-muted px-3 py-1.5 rounded-lg">
                        Network: AO
                    </div>
                </div>

                {/* Test tube visualization */}
                <div className="relative flex justify-center mb-8">
                    <TestTubeVisualization state={dispenserState} />
                </div>

                {/* Action content based on dispenser state */}
                <AnimatePresence mode="wait">
                    {dispenserState === 'ready' && (
                        <motion.div
                            key="ready"
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <h3 className="text-xl font-bold font-headings mb-3 text-center">
                                Request Test Tokens
                            </h3>
                            <p className="text-foreground/70 mb-6 text-center max-w-md">
                                Receive 100 TEST tokens for your blockchain
                                experiments.
                            </p>
                            <motion.button
                                onClick={handleRequestTokens}
                                className="inline-flex items-center bg-gradient-to-r from-laboratory-blue to-test-tube-green text-white font-medium rounded-lg px-6 py-3 shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Beaker size={18} className="mr-2" />
                                Request Test Specimen
                            </motion.button>
                        </motion.div>
                    )}

                    {dispenserState === 'processing' && (
                        <motion.div
                            key="processing"
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="relative mb-2">
                                <Loader2
                                    size={28}
                                    className="animate-spin text-primary"
                                />
                            </div>
                            <h3 className="text-xl font-bold font-headings mb-2 text-center">
                                Preparing Your Test Specimen
                            </h3>
                            <p className="text-foreground/70 text-center max-w-md">
                                Transaction in progress. This may take a few
                                seconds...
                            </p>
                        </motion.div>
                    )}

                    {dispenserState === 'success' && (
                        <motion.div
                            key="success"
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="mb-2">
                                <CheckCircle2
                                    size={28}
                                    className="text-test-tube-green"
                                />
                            </div>
                            <h3 className="text-xl font-bold font-headings mb-2 text-center">
                                Experiment Materials Delivered!
                            </h3>
                            <p className="text-foreground/70 text-center mb-4 max-w-md">
                                Your test tokens have been successfully
                                dispensed to your wallet.
                            </p>

                            {transaction && (
                                <div className="w-full mb-4">
                                    <button
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                        className="flex items-center justify-between w-full p-3 bg-muted rounded-lg text-sm font-medium transition-colors hover:bg-muted/80"
                                    >
                                        <span>Transaction Details</span>
                                        {showDetails ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>

                                    {showDetails && (
                                        <motion.div
                                            className="mt-2 p-3 bg-muted/50 rounded-lg border border-border"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Transaction ID:
                                                    </span>
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-mono mr-2">
                                                            {transaction.id.slice(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                            {transaction.id.slice(
                                                                -8
                                                            )}
                                                        </span>
                                                        <motion.button
                                                            onClick={
                                                                handleCopyTx
                                                            }
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Copy
                                                                size={14}
                                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                            />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Amount:
                                                    </span>
                                                    <span className="text-xs font-mono">
                                                        100 TEST
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Time:
                                                    </span>
                                                    <span className="text-xs font-mono">
                                                        {new Date(
                                                            transaction.timestamp
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-border">
                                                    <a
                                                        href={`https://ao.arweave.dev/#/process/${MINT_TOKEN}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center text-xs text-primary hover:underline"
                                                    >
                                                        <span>
                                                            View on AO Explorer
                                                        </span>
                                                        <ExternalLink
                                                            size={12}
                                                            className="ml-1"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {nextRequestTime && (
                                <div className="w-full mt-2 p-3 bg-muted/70 rounded-lg text-sm text-center">
                                    <div className="flex items-center justify-center text-muted-foreground">
                                        <Clock size={14} className="mr-1" />
                                        <span>Next specimen available in:</span>
                                    </div>
                                    <div className="font-mono text-foreground mt-1 font-medium">
                                        {countdown}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {dispenserState === 'rate-limited' && (
                        <motion.div
                            key="rate-limited"
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="mb-2">
                                <Clock
                                    size={28}
                                    className="text-scientific-purple"
                                />
                            </div>
                            <h3 className="text-xl font-bold font-headings mb-2 text-center">
                                Laboratory Recharging
                            </h3>
                            <p className="text-foreground/70 text-center mb-4 max-w-md">
                                You&apos;ve already received test tokens today.
                                Please wait for the laboratory to recharge.
                            </p>

                            <div className="w-full p-4 bg-muted/70 rounded-lg text-center mb-4">
                                <div className="text-foreground/80 text-sm mb-1">
                                    Next specimen available in:
                                </div>
                                <div className="font-mono text-lg font-bold text-foreground">
                                    {countdown}
                                </div>
                            </div>

                            {transaction && (
                                <div className="w-full">
                                    <button
                                        onClick={() =>
                                            setShowDetails(!showDetails)
                                        }
                                        className="flex items-center justify-between w-full p-3 bg-muted rounded-lg text-sm font-medium transition-colors hover:bg-muted/80"
                                    >
                                        <span>Previous Transaction</span>
                                        {showDetails ? (
                                            <ChevronUp size={16} />
                                        ) : (
                                            <ChevronDown size={16} />
                                        )}
                                    </button>

                                    {showDetails && (
                                        <motion.div
                                            className="mt-2 p-3 bg-muted/50 rounded-lg border border-border"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: 'auto',
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                        >
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Transaction ID:
                                                    </span>
                                                    <div className="flex items-center">
                                                        <span className="text-xs font-mono mr-2">
                                                            {transaction.id.slice(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                            {transaction.id.slice(
                                                                -8
                                                            )}
                                                        </span>
                                                        <motion.button
                                                            onClick={
                                                                handleCopyTx
                                                            }
                                                            whileHover={{
                                                                scale: 1.1,
                                                            }}
                                                            whileTap={{
                                                                scale: 0.9,
                                                            }}
                                                        >
                                                            <Copy
                                                                size={14}
                                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                                            />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Amount:
                                                    </span>
                                                    <span className="text-xs font-mono">
                                                        100 TEST
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-muted-foreground">
                                                        Time:
                                                    </span>
                                                    <span className="text-xs font-mono">
                                                        {new Date(
                                                            transaction.timestamp
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {dispenserState === 'error' && (
                        <motion.div
                            key="error"
                            className="flex flex-col items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="mb-2">
                                <AlertCircle
                                    size={28}
                                    className="text-destructive"
                                />
                            </div>
                            <h3 className="text-xl font-bold font-headings mb-2 text-center">
                                Experiment Failed
                            </h3>
                            <p className="text-foreground/70 text-center mb-6 max-w-md">
                                There was an error dispensing your test tokens.
                                Please ensure your wallet is properly connected
                                and try again.
                            </p>
                            <motion.button
                                onClick={handleRetry}
                                className="inline-flex items-center bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg px-6 py-3 shadow-sm"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <RefreshCcw size={18} className="mr-2" />
                                Retry Experiment
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Test tube visualization component based on state
const TestTubeVisualization: React.FC<{ state: string }> = ({ state }) => {
    // Define different configurations based on state
    const configs = {
        ready: {
            liquidHeight: '30%',
            liquidColor: 'from-test-tube-green/70 to-laboratory-blue/70',
            animation: {},
        },
        processing: {
            liquidHeight: '50%',
            liquidColor: 'from-laboratory-blue/70 to-scientific-purple/70',
            animation: {
                y: [0, -5, 0],
                transition: {
                    repeat: Infinity,
                    duration: 1.5,
                },
            },
        },
        success: {
            liquidHeight: '80%',
            liquidColor: 'from-test-tube-green to-laboratory-blue',
            animation: {
                scale: [1, 1.05, 1],
                transition: { duration: 0.5 },
            },
        },
        error: {
            liquidHeight: '20%',
            liquidColor: 'from-destructive/60 to-reaction-orange/60',
            animation: {
                x: [0, 5, -5, 5, -5, 0],
                transition: { duration: 0.5 },
            },
        },
        'rate-limited': {
            liquidHeight: '65%',
            liquidColor: 'from-scientific-purple/60 to-laboratory-blue/60',
            animation: {},
        },
    };

    // Get config for current state
    const config = configs[state as keyof typeof configs] || configs.ready;

    return (
        <div className="relative h-40 w-40 flex items-center justify-center">
            {/* Background circular glow */}
            <motion.div
                className={cn(
                    'absolute inset-0 rounded-full opacity-10',
                    state === 'error' ? 'bg-destructive' : 'bg-primary'
                )}
                animate={{
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                }}
            />

            {/* Flask container */}
            <div className="relative h-32 w-24">
                {/* Flask outline */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={config.animation}
                >
                    <FlaskConical
                        size={120}
                        className={cn(
                            'text-foreground',
                            state === 'error' && 'text-destructive/80'
                        )}
                        strokeWidth={1.5}
                    />
                </motion.div>

                {/* Liquid */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[50px] h-[95px] rounded-b-3xl overflow-hidden">
                    <motion.div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${config.liquidColor}`}
                        style={{ height: config.liquidHeight }}
                        initial={{ height: '0%' }}
                        animate={{ height: config.liquidHeight }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Bubbles - only show for non-error states */}
                        {state !== 'error' && (
                            <>
                                <motion.div
                                    className="absolute w-3 h-3 rounded-full bg-white opacity-40 left-[30%] bottom-[20%]"
                                    animate={{ y: [-15, 0], opacity: [0.4, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatDelay: 1,
                                    }}
                                />
                                <motion.div
                                    className="absolute w-2 h-2 rounded-full bg-white opacity-30 left-[60%] bottom-[30%]"
                                    animate={{ y: [-10, 0], opacity: [0.3, 0] }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        repeatDelay: 0.5,
                                    }}
                                />
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
