import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle,
    Loader2,
    FlaskConical,
    ArrowRight,
} from 'lucide-react';
import { useTestTubeWalletStore } from '@/hooks/use-testtube-wallet';
import { getTokens } from '@/utils/wallet-actions';

export const TokenDispenserSection: React.FC = () => {
    const { connected, address, balance } = useTestTubeWalletStore();
    const [dispensing, setDispensing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetTokens = async () => {
        if (!connected) return;

        setDispensing(true);
        setError(null);

        try {
            await getTokens();
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
                                                initial={{
                                                    d: 'M31 150 Q31 179 50 179 Q69 179 69 150 L69 150 L31 150 Z',
                                                }}
                                                animate={
                                                    dispensing
                                                        ? {
                                                              d: [
                                                                  'M31 150 Q31 179 50 179 Q69 179 69 150 L69 150 L31 150 Z',
                                                                  'M31 150 Q31 179 50 179 Q69 179 69 150 L69 100 L31 100 Z',
                                                                  'M31 150 Q31 179 50 179 Q69 179 69 150 L69 70 L31 70 Z',
                                                              ],
                                                          }
                                                        : {}
                                                }
                                                transition={{
                                                    duration: 2,
                                                    ease: 'easeInOut',
                                                    times: [0, 0.7, 1],
                                                }}
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
                                                Laboratory Ready
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

                                                {/* Current balance if available */}
                                                {balance !== undefined && (
                                                    <div className="mt-3 flex items-center text-sm">
                                                        <FlaskConical className="w-4 h-4 mr-2 text-laboratory-blue" />
                                                        <span>
                                                            Current Balance:{' '}
                                                            <strong className="font-mono">
                                                                {balance.toFixed(
                                                                    4
                                                                )}{' '}
                                                                TEST
                                                            </strong>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bold call-to-action with clear indication */}
                                            <motion.button
                                                className={`w-full py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center space-x-2 transition-all 
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
                                                    text-white shadow-lg`}
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
                                                For testing purposes only. One
                                                request per wallet per 24 hours.
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

                    {/* Rate limit information */}
                    <div className="mt-6 text-center text-sm text-foreground/60">
                        <p>
                            Need more tokens for your experiments? Try again in
                            24 hours.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
