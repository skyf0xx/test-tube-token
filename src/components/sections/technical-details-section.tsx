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
    Info,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { TEST_TOKEN } from '@/utils/wallet-actions';

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
                <motion.div
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold font-headings mb-3">
                        Technical Details
                    </h2>
                    <p className="text-foreground/70 max-w-xl mx-auto">
                        Essential information for developers integrating Test
                        Tube Tokens into their blockchain experiments.
                    </p>
                </motion.div>

                {/* Technical details card */}
                <motion.div
                    className="max-w-3xl mx-auto bg-card rounded-xl border border-border overflow-hidden shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {/* Header toggle with clearer indication */}
                    <button
                        className="w-full p-5 flex items-center justify-between bg-muted/50 hover:bg-muted/70 transition-colors"
                        onClick={() => setExpanded(!expanded)}
                        aria-expanded={expanded}
                        aria-controls="technical-details-content"
                    >
                        <div className="flex items-center">
                            <FileText size={20} className="text-primary mr-3" />
                            <span className="font-headings font-medium text-lg">
                                Developer Information
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-foreground/60 mr-2">
                                {expanded ? 'Hide details' : 'Show details'}
                            </span>
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

                    {/* Expandable content with ID for aria-controls */}
                    {expanded && (
                        <div id="technical-details-content" className="p-5">
                            {/* Tabs navigation with improved styling */}
                            <div className="flex border-b border-border mb-6">
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

                            {/* Tab content with improved information hierarchy */}
                            <div className="py-2">
                                {activeTab === 'contract' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                                <Code
                                                    size={16}
                                                    className="mr-2 text-primary"
                                                />
                                                Token Contract Address
                                            </h3>
                                            <div className="flex items-center bg-muted p-3 rounded-lg">
                                                <code className="text-xs font-mono flex-1 overflow-x-auto">
                                                    {TEST_TOKEN}
                                                </code>
                                                <motion.button
                                                    className="ml-2 p-1.5 rounded-md hover:bg-foreground/10 flex items-center gap-1"
                                                    onClick={() =>
                                                        handleCopy(
                                                            TEST_TOKEN,
                                                            'Token contract address'
                                                        )
                                                    }
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    aria-label="Copy contract address"
                                                    title="Copy to clipboard"
                                                >
                                                    <Copy
                                                        size={14}
                                                        className="text-foreground/70"
                                                    />
                                                    <span className="text-xs text-foreground/70">
                                                        Copy
                                                    </span>
                                                </motion.button>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border">
                                            <h4 className="text-sm font-medium mb-2">
                                                Resources
                                            </h4>
                                            <a
                                                href={`https://ao.arweave.dev/#/process/${TEST_TOKEN}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:underline text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                <span>
                                                    View token on AO Explorer
                                                </span>
                                            </a>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'network' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                                <Server
                                                    size={16}
                                                    className="mr-2 text-primary"
                                                />
                                                Network Information
                                            </h3>
                                            <div className="bg-muted p-4 rounded-lg">
                                                <div className="grid grid-cols-3 gap-2 mb-3 pb-2 border-b border-border">
                                                    <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                        Protocol
                                                    </span>
                                                    <span className="text-sm font-mono col-span-2">
                                                        AO / Arweave
                                                    </span>
                                                </div>
                                                <div className="text-xs text-foreground/60 flex items-center mt-2">
                                                    <Info
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    AO is a computation protocol
                                                    built on Arweave.
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                                <Code
                                                    size={16}
                                                    className="mr-2 text-primary"
                                                />
                                                Integration Details
                                            </h3>
                                            <div className="bg-muted p-4 rounded-lg space-y-3">
                                                <div className="grid grid-cols-3 gap-2 pb-2 border-b border-border">
                                                    <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                        Wallet
                                                    </span>
                                                    <span className="text-sm font-mono col-span-2">
                                                        ArConnect
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                        Library
                                                    </span>
                                                    <span className="text-sm font-mono col-span-2">
                                                        @permaweb/aoconnect
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border">
                                            <h4 className="text-sm font-medium mb-2">
                                                Resources
                                            </h4>
                                            <a
                                                href="https://ao.arweave.net/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:underline text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                <span>
                                                    Learn more about AO Protocol
                                                </span>
                                            </a>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'specs' && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                                <Database
                                                    size={16}
                                                    className="mr-2 text-primary"
                                                />
                                                Token Specifications
                                            </h3>
                                            <div className="bg-muted p-4 rounded-lg">
                                                <div className="space-y-2">
                                                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                                                        <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                            Name
                                                        </span>
                                                        <span className="text-sm font-mono col-span-2">
                                                            Test Tube Token
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 py-2 border-b border-border">
                                                        <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                            Symbol
                                                        </span>
                                                        <span className="text-sm font-mono col-span-2">
                                                            TEST
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-3 gap-2 py-2">
                                                        <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                            Decimals
                                                        </span>
                                                        <span className="text-sm font-mono col-span-2">
                                                            12
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-semibold mb-3 flex items-center">
                                                <FlaskConical
                                                    size={16}
                                                    className="mr-2 text-secondary"
                                                />
                                                Distribution
                                            </h3>
                                            <div className="bg-muted p-4 rounded-lg">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <span className="text-sm font-medium text-foreground/70 col-span-1">
                                                            Amount per Request
                                                        </span>
                                                        <div className="text-sm col-span-2">
                                                            <span className="font-mono block mb-2">
                                                                Random
                                                            </span>
                                                            <div className="flex items-center text-xs text-foreground/70">
                                                                <span>
                                                                    Powered by{' '}
                                                                </span>
                                                                <a
                                                                    href="https://github.com/RandAOLabs/Random-Module"
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="ml-1 text-primary hover:underline flex items-center"
                                                                >
                                                                    RandAOToken
                                                                    <ExternalLink
                                                                        size={
                                                                            10
                                                                        }
                                                                        className="ml-1"
                                                                    />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border">
                                            <h4 className="text-sm font-medium mb-2">
                                                Documentation
                                            </h4>
                                            <div className="text-sm text-foreground/70 mb-3">
                                                For additional technical details
                                                and integration samples, check
                                                the official documentation.
                                            </div>
                                            <a
                                                href="https://github.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:underline text-sm p-2 rounded-md hover:bg-muted/50 transition-colors"
                                            >
                                                <ExternalLink
                                                    size={14}
                                                    className="mr-2"
                                                />
                                                <span>View Documentation</span>
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Decorative flask diagram - preserved from original */}
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
            role="tab"
            aria-selected={active}
        >
            <span className="mr-2">{icon}</span>
            {label}
        </button>
    );
};

// Need to import this for the icon
import { FlaskConical } from 'lucide-react';
