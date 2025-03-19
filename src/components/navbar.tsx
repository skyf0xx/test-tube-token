import React from 'react';
import { motion } from 'framer-motion';
import { FlaskConical } from 'lucide-react';
import { TestTubeWalletButton } from './TestTubeWalletButton';
import { scrollToSection } from '@/utils/helpers';

export const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-sm border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <motion.div
                    className="flex items-center cursor-pointer"
                    onClick={() => scrollToSection('hero')}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2 }}
                >
                    <FlaskConical
                        size={28}
                        className="text-[#1C7ED6] mr-2"
                        strokeWidth={1.7}
                    />
                    <div className="flex items-center">
                        <span className="font-bold text-lg text-[#1C7ED6] font-headings hidden sm:inline">
                            Test Tube Token
                        </span>
                        <span className="font-bold text-lg text-[#1C7ED6] font-headings sm:hidden">
                            TTT
                        </span>
                    </div>
                </motion.div>

                {/* Navigation links - only shows on larger screens */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavItem href="#how-it-works" label="How It Works" />
                    <NavItem href="#use-cases" label="Use Cases" />
                    <NavItem
                        href="#technical-details"
                        label="Technical Details"
                    />
                </nav>

                {/* Wallet connection button */}
                <TestTubeWalletButton />
            </div>
        </header>
    );
};

// Navigation item component
interface NavItemProps {
    href: string;
    label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, label }) => {
    return (
        <motion.a
            href={href}
            className="text-foreground/80 hover:text-primary font-medium text-sm transition-colors duration-200"
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            onClick={(e) => {
                e.preventDefault();
                scrollToSection(href.replace('#', ''));
            }}
        >
            {label}
        </motion.a>
    );
};
