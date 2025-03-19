import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Copy,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Server,
    Database,
    Code,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { MINT_TOKEN, MINT_PROCESS } from '@/utils/wallet-actions';

export const TechnicalDetailsSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState<
        'contract' | 'network' | 'specs'
    >('contract');
    const [expanded, setExpanded] = useState(false);

    // Handler for copying data to clipboard
    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.info(`📋 ${label} copied to clipboard`, {
            autoClose: 2000,
        });
    };

    return (
        <section id="technical-details" className="w-full py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold font-headings mb-3">
                            Technical Details
                        </h2>
                        <p className="text-foreground/70 max-w-xl mx-auto">
                            Essential information for developers integrating
                            Test Tube Tokens into their blockchain experiments.
                        </p>
                    </motion.div>
                </div>

                {/* Technical details card */}
                <motion.div
                    className="max-w-3xl mx-auto bg-card rounded-xl border border-border overflow-hidden shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Header toggle */}
                    <button
                        className="w-full p-5 flex items-center justify-between bg-muted/50 hover:bg-muted/70 transition-colors"
                        onClick={() => setExpanded(!expanded)}
                    >
                        <div className="flex items-center">
                            <FileText size={20} className="text-primary mr-3" />
                            <span className="font-headings font-medium">
                                Developer Information
                            </span>
                        </div>
                        <div>
                            {expanded ? (
                                <ChevronUp
                                    size={20}
                                    className="text-foreground/70"
                                />
                            ) : (
                                <ChevronDown
                                    size={20}
                                    className="text-foreground/70"
                                />
                            )}
                        </div>
                    </button>

                    {/* Expandable content */}
                    {expanded && (
                        <div className="p-5">
                            {/* Tabs navigation */}
                            <div className="flex border-b border-border mb-4">
                                <TabButton
                                    active={activeTab === 'contract'}
                                    onClick={() => setActiveTab('contract')}
                                    icon={<Code size={16} />}
                                    label="Contract"
                                />
                                <TabButton
                                    active={activeTab === 'network'}
                                    onClick={() => setActiveTab('network')}
                                    icon={<Server size={16} />}
                                    label="Network"
                                />
                                <TabButton
                                    active={activeTab === 'specs'}
                                    onClick={() => setActiveTab('specs')}
                                    icon={<Database size={16} />}
                                    label="Specifications"
                                />
                            </div>

                            {/* Tab content */}
                            <div className="p-1">
                                {activeTab === 'contract' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="mb-4">
                                            <div className="text-sm font-medium mb-2">
                                                Token Contract
                                            </div>
                                            <div className="flex items-center bg-muted p-3 rounded-lg">
                                                <code className="text-xs font-mono flex-1 overflow-x-auto">
                                                    {MINT_TOKEN}
                                                </code>
                                                <motion.button
                                                    className="ml-2 p-1.5 rounded-md hover:bg-foreground/10"
                                                    onClick={() =>
                                                        handleCopy(
                                                            MINT_TOKEN,
                                                            'Token contract address'
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Copy
                                                        size={14}
                                                        className="text-foreground/70"
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="text-sm font-medium mb-2">
                                                Mint Process
                                            </div>
                                            <div className="flex items-center bg-muted p-3 rounded-lg">
                                                <code className="text-xs font-mono flex-1 overflow-x-auto">
                                                    {MINT_PROCESS}
                                                </code>
                                                <motion.button
                                                    className="ml-2 p-1.5 rounded-md hover:bg-foreground/10"
                                                    onClick={() =>
                                                        handleCopy(
                                                            MINT_PROCESS,
                                                            'Mint process ID'
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Copy
                                                        size={14}
                                                        className="text-foreground/70"
                                                    />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border">
                                            <a
                                                href={`https://ao.arweave.dev/#/process/${MINT_TOKEN}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:underline text-sm"
                                            >
                                                <span>
                                                    View token on AO Explorer
                                                </span>
                                                <ExternalLink
                                                    size={14}
                                                    className="ml-1"
                                                />
                                            </a>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'network' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium mb-2">
                                                    Network
                                                </div>
                                                <div className="bg-muted p-3 rounded-lg">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Protocol
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            AO / Arweave
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium mb-2">
                                                    Integration
                                                </div>
                                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Wallet
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            ArConnect
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Library
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            @permaweb/aoconnect
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-border">
                                                <a
                                                    href="https://ao.arweave.net/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-primary hover:underline text-sm"
                                                >
                                                    <span>
                                                        Learn more about AO
                                                        Protocol
                                                    </span>
                                                    <ExternalLink
                                                        size={14}
                                                        className="ml-1"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'specs' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-sm font-medium mb-2">
                                                    Token Specifications
                                                </div>
                                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Name
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            Test Tube Token
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Symbol
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            TEST
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Decimals
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            8
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Standard
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            AO PST
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-sm font-medium mb-2">
                                                    Distribution
                                                </div>
                                                <div className="bg-muted p-3 rounded-lg space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Amount per Request
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            100 TEST
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            Frequency Limit
                                                        </span>
                                                        <span className="text-sm font-mono">
                                                            24 hours
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-border space-y-2">
                                                <div className="text-sm text-foreground/70">
                                                    For additional technical
                                                    details and integration
                                                    samples, check the official
                                                    documentation.
                                                </div>
                                                <a
                                                    href="https://github.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-primary hover:underline text-sm"
                                                >
                                                    <span>
                                                        View Documentation
                                                    </span>
                                                    <ExternalLink
                                                        size={14}
                                                        className="ml-1"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Decorative flask diagram */}
                <div className="mt-12 opacity-10 flex justify-center">
                    <svg
                        width="200"
                        height="40"
                        viewBox="0 0 200 40"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M20 10 L100 10 L180 10"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <path
                            d="M100 10 L100 30"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <path
                            d="M70 30 L130 30"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                        <circle cx="20" cy="10" r="3" fill="currentColor" />
                        <circle cx="180" cy="10" r="3" fill="currentColor" />
                        <circle cx="100" cy="10" r="3" fill="currentColor" />
                        <circle cx="70" cy="30" r="3" fill="currentColor" />
                        <circle cx="130" cy="30" r="3" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </section>
    );
};

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
    active,
    onClick,
    icon,
    label,
}) => {
    return (
        <button
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-border'
            }`}
            onClick={onClick}
        >
            <span className="mr-2">{icon}</span>
            {label}
        </button>
    );
};
