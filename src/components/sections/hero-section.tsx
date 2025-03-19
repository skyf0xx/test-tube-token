import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ChevronDown } from 'lucide-react';
import { useTestTubeWalletStore } from '@/hooks/use-testtube-wallet';
import { scrollToSection } from '@/utils/helpers';

export const HeroSection: React.FC = () => {
    const { connect, connected } = useTestTubeWalletStore();

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <section
            id="hero"
            className="min-h-[75vh] w-full flex items-center relative overflow-hidden border-b border-border"
        >
            {/* Background with subtle grid pattern */}
            <div className="absolute inset-0 lab-grid-bg opacity-30"></div>

            {/* Main content container */}
            <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left column: Text content */}
                    <motion.div
                        className="flex flex-col"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div
                            className="inline-flex items-center mb-4 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium max-w-fit"
                            variants={itemVariants}
                        >
                            <FlaskConical size={16} className="mr-2" />
                            Laboratory-Grade Blockchain Faucet
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold font-headings mb-4 bg-clip-text text-transparent bg-gradient-to-r from-laboratory-blue to-test-tube-green"
                            variants={itemVariants}
                        >
                            Tokens for Your Blockchain Experiments
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-lg"
                            variants={itemVariants}
                        >
                            Get free test tokens instantly. Connect your wallet,
                            request tokens, and start building your blockchain
                            experiments with scientific precision.
                        </motion.p>

                        <motion.div variants={itemVariants}>
                            {!connected ? (
                                <motion.button
                                    onClick={connect}
                                    className="inline-flex items-center bg-gradient-to-r from-laboratory-blue to-test-tube-green text-white font-medium rounded-lg px-6 py-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <FlaskConical size={18} className="mr-2" />
                                    Connect Laboratory
                                </motion.button>
                            ) : (
                                <motion.button
                                    onClick={() =>
                                        scrollToSection('token-dispenser')
                                    }
                                    className="inline-flex items-center bg-gradient-to-r from-laboratory-blue to-test-tube-green text-foreground font-medium rounded-lg px-6 py-3 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Request Test Tokens
                                </motion.button>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Right column: Laboratory visualization */}
                    <motion.div
                        className="hidden md:flex justify-center items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <LaboratoryVisualization />
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer"
                    onClick={() => scrollToSection('token-dispenser')}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    whileHover={{ y: 5 }}
                >
                    <span className="text-sm text-foreground/60 mb-2">
                        Scroll to explore
                    </span>
                    <ChevronDown
                        size={20}
                        className="text-primary animate-bounce"
                    />
                </motion.div>
            </div>
        </section>
    );
};

// Laboratory visualization component
const LaboratoryVisualization: React.FC = () => {
    return (
        <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px]">
            {/* Large flask in background */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <FlaskConical
                    size={120}
                    className="text-primary/30"
                    strokeWidth={1}
                />
            </motion.div>

            {/* Flask with liquid animation */}
            <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="relative h-[200px] w-[140px]">
                    {/* Flask outline */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FlaskConical
                            size={180}
                            className="text-laboratory-blue"
                            strokeWidth={2}
                        />
                    </div>

                    {/* Animated liquid */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[80px] h-[80px] rounded-b-full overflow-hidden">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-test-tube-green to-laboratory-blue opacity-80"
                            initial={{ y: 80 }}
                            animate={{ y: 0 }}
                            transition={{
                                duration: 2,
                                ease: 'easeOut',
                                repeat: Infinity,
                                repeatType: 'reverse',
                                repeatDelay: 1,
                            }}
                        >
                            {/* Bubbles */}
                            <motion.div
                                className="absolute w-4 h-4 rounded-full bg-white opacity-50 left-[20%] top-[30%]"
                                animate={{ y: [-20, 0], opacity: [0.7, 0] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 0.5,
                                }}
                            />
                            <motion.div
                                className="absolute w-3 h-3 rounded-full bg-white opacity-50 left-[60%] top-[50%]"
                                animate={{ y: [-15, 0], opacity: [0.6, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 1,
                                }}
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Label */}
                <div className="mt-4 bg-white/90 px-3 py-1 rounded-md border border-border shadow-sm">
                    <span className="text-xs font-mono text-primary font-medium">
                        TEST_TUBE_TOKEN
                    </span>
                </div>
            </motion.div>

            {/* Decorative elements */}
            <motion.div
                className="absolute top-[30%] right-[10%] h-6 w-6 rounded-full bg-test-tube-green/20 border border-test-tube-green/30"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-[20%] left-[15%] h-8 w-8 rounded-full bg-scientific-purple/20 border border-scientific-purple/30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            />
        </div>
    );
};
