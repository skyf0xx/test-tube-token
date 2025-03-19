import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Github, ExternalLink } from 'lucide-react';
import { scrollToSection } from '@/utils/helpers';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-muted border-t border-border mt-16 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand column */}
                    <div className="flex flex-col space-y-3">
                        <motion.div
                            className="flex items-center cursor-pointer"
                            onClick={() => scrollToSection('hero')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <FlaskConical
                                size={20}
                                className="text-primary mr-2"
                                strokeWidth={1.5}
                            />
                            <span className="font-bold text-primary font-headings">
                                Test Tube Token
                            </span>
                        </motion.div>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Catalyzing blockchain innovation, one token at a
                            time
                        </p>
                    </div>

                    {/* Quick links column */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="font-headings font-medium text-sm uppercase tracking-wider text-muted-foreground">
                            Laboratory Sections
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink
                                onClick={() => scrollToSection('how-it-works')}
                                label="How It Works"
                            />
                            <FooterLink
                                onClick={() => scrollToSection('use-cases')}
                                label="Use Cases"
                            />
                            <FooterLink
                                onClick={() =>
                                    scrollToSection('technical-details')
                                }
                                label="Technical Details"
                            />
                        </ul>
                    </div>

                    {/* Resources column */}
                    <div className="flex flex-col space-y-3">
                        <h3 className="font-headings font-medium text-sm uppercase tracking-wider text-muted-foreground">
                            Lab Resources
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink
                                href="https://arweave.org/"
                                label="Arweave Blockchain"
                                external
                            />
                            <FooterLink
                                href="https://arconnect.io/"
                                label="ArConnect Wallet"
                                external
                            />
                            <FooterLink
                                href="https://ao.arweave.net/"
                                label="AO Protocol"
                                external
                            />
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Test Tube Token. All rights
                        reserved.
                    </p>
                    <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                        <motion.a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Github size={18} />
                        </motion.a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

interface FooterLinkProps {
    label: string;
    href?: string;
    onClick?: () => void;
    external?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({
    label,
    href,
    onClick,
    external = false,
}) => {
    const content = (
        <span className="inline-flex items-center">
            {label}
            {external && <ExternalLink size={12} className="ml-1 opacity-70" />}
        </span>
    );

    return (
        <li>
            <motion.div
                className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                whileHover={{ x: 2 }}
            >
                {href ? (
                    <a
                        href={href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                    >
                        {content}
                    </a>
                ) : (
                    <span onClick={onClick}>{content}</span>
                )}
            </motion.div>
        </li>
    );
};
