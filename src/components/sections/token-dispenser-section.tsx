import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    FlaskConical,
    ArrowRight,
    Droplet,
} from 'lucide-react';
import { useTestTubeWalletStore } from '@/hooks/use-testtube-wallet';
import { getTokens } from '@/utils/wallet-actions';

// Number counter animation component
const AnimatedCounter = ({
    value,
    duration = 1.5,
}: {
    value: number;
    duration?: number;
}) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const [counter, setCounter] = useState(value);

    useEffect(() => {
        let start = value;
        // Get current value
        if (nodeRef.current && nodeRef.current.textContent) {
            start = parseFloat(
                nodeRef.current.textContent.replace(/[^0-9.-]+/g, '')
            );
        }
        if (isNaN(start)) start = 0;

        // Calculate step size
        const end = value;
        const range = end - start;
        const minStep = 0.001;
        const stepCount = Math.max(Math.floor(duration * 60), 1);
        const step = Math.max(minStep, Math.abs(range) / stepCount);

        let current = start;
        const timer = setInterval(() => {
            if (range > 0) {
                current = Math.min(current + step, end);
            } else {
                current = Math.max(current - step, end);
            }
            setCounter(current);
            if (Math.abs(current - end) < minStep) {
                setCounter(end);
                clearInterval(timer);
            }
        }, 1000 / 60);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span ref={nodeRef}>{counter.toFixed(4)}</span>;
};

export const TokenDispenserSection: React.FC = () => {
    const { connected, address, balance } = useTestTubeWalletStore();
    const [dispensing, setDispensing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previousBalance, setPreviousBalance] = useState(balance || 0);
    const [showBalanceHighlight, setShowBalanceHighlight] = useState(false);
    const [tokenAmount, setTokenAmount] = useState(0);
    const bubbleControls = useAnimation();

    // Track previous balance to detect changes
    useEffect(() => {
        if (balance !== undefined && balance !== previousBalance) {
            // Only trigger animation if it's an increase
            if (balance > previousBalance) {
                const gained = balance - previousBalance;
                setTokenAmount(gained);
                setShowBalanceHighlight(true);

                // Start the bubble animations
                bubbleControls.start({
                    opacity: [0, 1, 0],
                    y: [0, -60],
                    transition: { duration: 2, ease: 'easeOut' },
                });

                // Reset highlight after animation
                setTimeout(() => {
                    setShowBalanceHighlight(false);
                }, 1500);
            }
            setPreviousBalance(balance);
        }
    }, [balance, previousBalance]);

    const handleGetTokens = async () => {
        if (!connected) return;

        setDispensing(true);
        setError(null);

        try {
            // Generate random number between 10 and 100
            const randomAmount = Math.floor(Math.random() * 91) + 10;

            // Add 12 zeros (multiply by 10^12) and convert to string
            const quantity = (randomAmount * Math.pow(10, 12)).toString();

            console.log(`Requesting ${randomAmount} TEST tokens`);

            // Get tokens and retrieve the new balance
            const newBalance = await getTokens(quantity);

            // Update the wallet store with the new balance
            useTestTubeWalletStore.setState({
                balance: parseFloat(newBalance),
            });

            setSuccess(true);
            // Reset success state after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Failed to dispense tokens'
            );
        } finally {
            setDispensing(false);
        }
    };

    // Laboratory liquid animation variants
    const liquidVariants = {
        initial: {
            d: 'M31 150 Q31 179 50 179 Q69 179 69 150 L69 150 L31 150 Z',
        },
        dispensing: {
            d: [
                'M31 150 Q31 179 50 179 Q69 179 69 150 L69 150 L31 150 Z',
                'M31 150 Q31 179 50 179 Q69 179 69 150 L69 100 L31 100 Z',
                'M31 150 Q31 179 50 179 Q69 179 69 150 L69 70 L31 70 Z',
            ],
            transition: {
                duration: 2,
                ease: 'easeInOut',
                times: [0, 0.7, 1],
            },
        },
    };

    return (
        <section
            id="token-dispenser"
            className="w-full py-16 bg-background relative overflow-hidden"
        >
            {/* Laboratory grid background with increased opacity */}
            <div className="absolute inset-0 lab-grid-bg opacity-30"></div>

            {/* Decorative elements - test tube shapes at edges */}
            <div className="absolute -left-20 top-20 w-40 h-80 bg-laboratory-blue/5 rounded-full rotate-12"></div>
            <div className="absolute -right-20 bottom-20 w-40 h-80 bg-test-tube-green/5 rounded-full -rotate-12"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-3xl mx-auto">
                    {/* Section heading with clear purpose */}
                    <motion.div
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl font-bold font-headings mb-3">
                            Get Your Test Tokens
                        </h2>
                        <p className="text-foreground/70 max-w-xl mx-auto">
                            One click for instant test tokens. Start
                            experimenting immediately.
                        </p>
                    </motion.div>

                    {/* Main dispenser container */}
                    <motion.div
                        className="bg-card rounded-xl border border-border shadow-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {/* Two-column layout for dispenser */}
                        <div className="grid grid-cols-1 md:grid-cols-5">
                            {/* Visual column - test tube animation */}
                            <div className="md:col-span-2 bg-gradient-to-br from-laboratory-blue/20 to-test-tube-green/20 p-8 flex items-center justify-center">
                                <div className="relative h-64 w-40">
                                    {/* Test tube container */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg
                                            width="100"
                                            height="200"
                                            viewBox="0 0 100 200"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="overflow-visible"
                                        >
                                            {/* Test tube outline */}
                                            <path
                                                d="M30 30 L30 150 Q30 180 50 180 Q70 180 70 150 L70 30 L30 30 Z"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                fill="none"
                                                className="text-foreground/30"
                                            />

                                            {/* Test tube cap */}
                                            <rect
                                                x="25"
                                                y="15"
                                                width="50"
                                                height="15"
                                                rx="2"
                                                fill="currentColor"
                                                className="text-foreground/30"
                                            />

                                            {/* Liquid fill level - animates during dispensing */}
                                            <motion.path
                                                d="M31 150 Q31 179 50 179 Q69 179 69 150 L69 100 L31 100 Z"
                                                fill="url(#testTubeGradient)"
                                                variants={liquidVariants}
                                                initial="initial"
                                                animate={
                                                    dispensing
                                                        ? 'dispensing'
                                                        : 'initial'
                                                }
                                            />

                                            {/* Gradient definition for liquid */}
                                            <defs>
                                                <linearGradient
                                                    id="testTubeGradient"
                                                    x1="50"
                                                    y1="70"
                                                    x2="50"
                                                    y2="179"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop
                                                        offset="0"
                                                        stopColor="var(--laboratory-blue)"
                                                    />
                                                    <stop
                                                        offset="1"
                                                        stopColor="var(--test-tube-green)"
                                                    />
                                                </linearGradient>
                                            </defs>
                                        </svg>

                                        {/* Token droplets that flow from test tube to balance when dispensing */}
                                        {dispensing && (
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                                                <motion.div
                                                    className="absolute"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 0,
                                                    }}
                                                    animate={{
                                                        opacity: [0, 1, 0],
                                                        y: [0, 120],
                                                        x: [0, 40],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        delay: 0.5,
                                                        times: [0, 0.3, 1],
                                                    }}
                                                >
                                                    <Droplet className="text-laboratory-blue w-5 h-5" />
                                                </motion.div>
                                                <motion.div
                                                    className="absolute"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 0,
                                                    }}
                                                    animate={{
                                                        opacity: [0, 1, 0],
                                                        y: [0, 120],
                                                        x: [0, 60],
                                                    }}
                                                    transition={{
                                                        duration: 1.8,
                                                        delay: 0.8,
                                                        times: [0, 0.3, 1],
                                                    }}
                                                >
                                                    <Droplet className="text-test-tube-green w-4 h-4" />
                                                </motion.div>
                                                <motion.div
                                                    className="absolute"
                                                    initial={{
                                                        opacity: 0,
                                                        y: 0,
                                                    }}
                                                    animate={{
                                                        opacity: [0, 1, 0],
                                                        y: [0, 120],
                                                        x: [0, 20],
                                                    }}
                                                    transition={{
                                                        duration: 1.6,
                                                        delay: 1.1,
                                                        times: [0, 0.3, 1],
                                                    }}
                                                >
                                                    <Droplet className="text-scientific-purple w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        )}

                                        {/* Bubbles animation during dispensing */}
                                        {dispensing && (
                                            <>
                                                <motion.div
                                                    className="absolute bottom-20 left-1/2 w-3 h-3 rounded-full bg-white/60"
                                                    animate={{
                                                        y: [-50, -100],
                                                        opacity: [0.7, 0],
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                        repeatType: 'loop',
                                                        delay: 0.2,
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute bottom-16 left-[45%] w-2 h-2 rounded-full bg-white/60"
                                                    animate={{
                                                        y: [-30, -80],
                                                        opacity: [0.7, 0],
                                                    }}
                                                    transition={{
                                                        duration: 1.2,
                                                        repeat: Infinity,
                                                        repeatType: 'loop',
                                                        delay: 0.5,
                                                    }}
                                                />
                                                <motion.div
                                                    className="absolute bottom-24 left-[55%] w-2 h-2 rounded-full bg-white/60"
                                                    animate={{
                                                        y: [-40, -90],
                                                        opacity: [0.7, 0],
                                                    }}
                                                    transition={{
                                                        duration: 1.8,
                                                        repeat: Infinity,
                                                        repeatType: 'loop',
                                                        delay: 0.8,
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Label for test tube */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center w-full">
                                        <span className="inline-block bg-foreground/5 border border-border rounded-md px-3 py-1 text-sm font-mono">
                                            TEST TUBE TOKEN
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Interaction column - wallet info and dispense button */}
                            <div className="md:col-span-3 p-8">
                                {connected ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold font-headings mb-4">
                                                Wallet Ready
                                            </h3>

                                            {/* Wallet connection status */}
                                            <div className="bg-muted/50 rounded-lg p-4 mb-6">
                                                <div className="flex items-center mb-3">
                                                    <div className="w-3 h-3 rounded-full bg-test-tube-green mr-2 animate-pulse"></div>
                                                    <span className="text-sm font-medium">
                                                        Wallet Connected
                                                    </span>
                                                </div>

                                                {/* Wallet address with truncation */}
                                                <div className="flex flex-col space-y-2">
                                                    <span className="text-xs text-foreground/60">
                                                        Address:
                                                    </span>
                                                    <code className="text-xs bg-background/50 p-2 rounded font-mono overflow-x-auto">
                                                        {address}
                                                    </code>
                                                </div>

                                                {/* Current balance with animation when it changes */}
                                                {balance !== undefined && (
                                                    <div className="mt-3 relative">
                                                        {/* Visual bubbles animation for balance increase */}
                                                        <div className="absolute bottom-0 left-4 pointer-events-none">
                                                            <AnimatePresence>
                                                                {showBalanceHighlight && (
                                                                    <>
                                                                        <motion.div
                                                                            className="absolute left-2"
                                                                            animate={
                                                                                bubbleControls
                                                                            }
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: 0,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                            }}
                                                                        >
                                                                            <Droplet className="text-laboratory-blue w-3 h-3" />
                                                                        </motion.div>
                                                                        <motion.div
                                                                            className="absolute left-6"
                                                                            animate={
                                                                                bubbleControls
                                                                            }
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: 0,
                                                                            }}
                                                                            transition={{
                                                                                delay: 0.2,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                            }}
                                                                        >
                                                                            <Droplet className="text-test-tube-green w-3 h-3" />
                                                                        </motion.div>
                                                                        <motion.div
                                                                            className="absolute left-4"
                                                                            animate={
                                                                                bubbleControls
                                                                            }
                                                                            initial={{
                                                                                opacity: 0,
                                                                                y: 0,
                                                                            }}
                                                                            transition={{
                                                                                delay: 0.4,
                                                                            }}
                                                                            exit={{
                                                                                opacity: 0,
                                                                            }}
                                                                        >
                                                                            <Droplet className="text-scientific-purple w-3 h-3" />
                                                                        </motion.div>
                                                                    </>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>

                                                        {/* Balance display with animation */}
                                                        <div className="flex items-center text-sm">
                                                            <FlaskConical className="w-4 h-4 mr-2 text-laboratory-blue" />
                                                            <span>
                                                                Current Balance:{' '}
                                                                <motion.strong
                                                                    className="font-mono relative"
                                                                    animate={
                                                                        showBalanceHighlight
                                                                            ? {
                                                                                  boxShadow:
                                                                                      [
                                                                                          '0 0 0px rgba(55, 178, 77, 0)',
                                                                                          '0 0 8px rgba(55, 178, 77, 0.8)',
                                                                                          '0 0 0px rgba(55, 178, 77, 0)',
                                                                                      ],
                                                                                  color: [
                                                                                      'inherit',
                                                                                      'var(--test-tube-green)',
                                                                                      'inherit',
                                                                                  ],
                                                                              }
                                                                            : {}
                                                                    }
                                                                    transition={{
                                                                        duration: 1.5,
                                                                    }}
                                                                >
                                                                    <AnimatedCounter
                                                                        value={
                                                                            balance
                                                                        }
                                                                        duration={
                                                                            1.5
                                                                        }
                                                                    />{' '}
                                                                    TEST
                                                                </motion.strong>
                                                            </span>
                                                        </div>

                                                        {/* Token amount notification */}
                                                        <AnimatePresence>
                                                            {showBalanceHighlight && (
                                                                <motion.div
                                                                    className="absolute left-24 -top-6"
                                                                    initial={{
                                                                        opacity: 0,
                                                                        y: 10,
                                                                        scale: 0.8,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        y: 0,
                                                                        scale: 1,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        y: -10,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.5,
                                                                    }}
                                                                >
                                                                    <div className="bg-test-tube-green/20 text-test-tube-green px-2 py-1 rounded-full text-xs font-mono font-bold flex items-center">
                                                                        <span>
                                                                            +
                                                                            {tokenAmount.toFixed(
                                                                                2
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bold call-to-action with clear indication */}
                                            <motion.button
                                                className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all cursor-pointer 
                                                    ${
                                                        dispensing || success
                                                            ? 'bg-muted cursor-not-allowed'
                                                            : 'bg-laboratory-blue hover:bg-laboratory-blue/90'
                                                    } 
                                                    ${
                                                        success
                                                            ? 'bg-test-tube-green'
                                                            : ''
                                                    }
                                                    text-foreground shadow-lg`}
                                                onClick={handleGetTokens}
                                                disabled={dispensing || success}
                                                whileHover={
                                                    !dispensing && !success
                                                        ? { scale: 1.02 }
                                                        : {}
                                                }
                                                whileTap={
                                                    !dispensing && !success
                                                        ? { scale: 0.98 }
                                                        : {}
                                                }
                                            >
                                                {dispensing ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span>
                                                            Dispensing Tokens...
                                                        </span>
                                                    </>
                                                ) : success ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        <span>
                                                            Tokens Received!
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FlaskConical className="w-5 h-5" />
                                                        <span>
                                                            Dispense Test Tokens
                                                        </span>
                                                        <ArrowRight className="w-4 h-4 ml-1" />
                                                    </>
                                                )}
                                            </motion.button>

                                            {/* Error message if token dispensing fails */}
                                            {error && (
                                                <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg flex items-start">
                                                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm">
                                                        {error}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Success message with instructions */}
                                            {success && (
                                                <div className="mt-4 p-3 bg-test-tube-green/10 text-test-tube-green rounded-lg">
                                                    <p className="text-sm">
                                                        Your tokens have been
                                                        added to your wallet.
                                                        You can now use them for
                                                        your blockchain
                                                        experiments!
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Usage hint */}
                                        <div className="text-sm text-foreground/60 pt-4 border-t border-border">
                                            <p className="flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                                For testing purposes only.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <h3 className="text-xl font-bold font-headings mb-4">
                                            Connect Your Wallet
                                        </h3>
                                        <p className="text-foreground/70 mb-6">
                                            You need to connect your ArConnect
                                            wallet to receive test tokens.
                                        </p>
                                        <motion.button
                                            onClick={() =>
                                                (window.location.href = '#hero')
                                            }
                                            className="bg-primary text-white font-medium px-6 py-3 rounded-lg inline-flex items-center"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <ArrowRight className="w-4 h-4 mr-2" />
                                            Connect Wallet
                                        </motion.button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
