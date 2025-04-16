import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, ChevronDown, Twitter, ExternalLink } from 'lucide-react';
import { useTestTubeWalletStore } from '@/hooks/use-testtube-wallet';
import { scrollToSection } from '@/utils/helpers';

export const HeroSection: React.FC = () => {
    const { connect, connected } = useTestTubeWalletStore();

    // Simplified animation variants
    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } },
    };

    // Partners data with Twitter handles and URLs (reused from footer)
    const partners = [
        {
            handle: '@AlwaysBigger',
            url: 'https://x.com/AlwaysBigger',
        },
        {
            handle: '@Mithril_Labs',
            url: 'https://x.com/Mithril_Labs',
        },
        {
            handle: '@RandAOToken',
            url: 'https://x.com/RandAOToken',
        },
    ];

    return (
        <section
            id="hero"
            className="min-h-[80vh] w-full flex items-center relative overflow-hidden border-b border-border"
        >
            {/* Background with subtle grid pattern */}
            <div className="absolute inset-0 lab-grid-bg opacity-20"></div>

            {/* Main content container */}
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                    {/* Text content - takes 3/5 of space on desktop */}
                    <motion.div
                        className="md:col-span-3 flex flex-col"
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    >
                        {/* Bold, direct headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-headings mb-6 text-foreground leading-tight">
                            Free Test Tokens{' '}
                            <span className="text-laboratory-blue">
                                for Blockchain Experiments
                            </span>
                        </h1>

                        {/* Clear, concise subheadline */}
                        <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-2xl font-medium">
                            Get tokens instantly. Build with confidence.
                        </p>

                        {/* Prominent CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <motion.button
                                onClick={
                                    connected
                                        ? () =>
                                              scrollToSection('token-dispenser')
                                        : connect
                                }
                                className="bg-laboratory-blue text-foreground text-lg font-bold px-8 py-4 rounded-lg shadow-lg hover:bg-laboratory-blue/90 transition-all cursor-pointer"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {connected
                                    ? 'Get Tokens Now'
                                    : 'Connect Wallet'}
                            </motion.button>

                            {/* Secondary action for those who want to learn more */}
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="flex items-center text-foreground/70 hover:text-laboratory-blue font-medium px-4 py-2 transition-colors"
                            >
                                How it works{' '}
                                <ChevronDown size={18} className="ml-1" />
                            </button>
                        </div>

                        {/* Trust indicator */}
                        <div className="mt-8 flex items-center text-foreground/60 text-sm">
                            <FlaskConical
                                size={16}
                                className="mr-2 text-test-tube-green"
                            />
                            Laboratory-grade tokens for developers
                        </div>

                        {/* Powered by section - subtle placement below the main CTA */}
                        <motion.div
                            className="mt-10 border-t border-border/30 pt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <p className="text-xs text-foreground/50 mb-2 font-headings">
                                Powered by
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {partners.map((partner, index) => (
                                    <a
                                        key={index}
                                        href={partner.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 px-2 py-1 bg-card/50 border border-border/50 rounded-md hover:border-laboratory-blue/50 transition-colors duration-200 group"
                                    >
                                        <Twitter
                                            size={12}
                                            className="text-laboratory-blue"
                                        />
                                        <span className="text-xs font-mono group-hover:text-laboratory-blue transition-colors duration-200">
                                            {partner.handle}
                                        </span>
                                        <ExternalLink
                                            size={10}
                                            className="text-foreground/40 group-hover:text-laboratory-blue transition-colors duration-200"
                                        />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Visual element - takes 2/5 of space on desktop */}
                    <motion.div
                        className="hidden md:flex md:col-span-2 justify-center items-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Simplified visualization */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-56 h-56 rounded-full bg-laboratory-blue/10 flex items-center justify-center">
                                    <FlaskConical
                                        size={120}
                                        className="text-laboratory-blue"
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </div>

                            {/* Animated liquid element */}
                            <motion.div
                                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-t from-test-tube-green to-laboratory-blue rounded-full opacity-70"
                                animate={{
                                    y: [0, -8, 0],
                                    opacity: [0.7, 0.9, 0.7],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />

                            {/* Token label */}
                            <div className="mt-64 text-center">
                                <span className="text-sm font-mono font-semibold bg-white/90 px-3 py-1 rounded-md border border-border shadow-sm">
                                    TEST TUBE TOKEN
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
