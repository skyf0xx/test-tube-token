import React from 'react';
import Head from 'next/head';
import { Layout } from '@/components/layout';
import { Navbar } from '@/components/navbar';
import { HeroSection } from '@/components/sections/hero-section';
import { TokenDispenserSection } from '@/components/sections/token-dispenser-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { UseCasesSection } from '@/components/sections/use-cases-section';
import { TechnicalDetailsSection } from '@/components/sections/technical-details-section';
import { Footer } from '@/components/footer';
import { useTestTubeWalletInit } from '@/hooks/use-testtube-wallet';

export default function Home() {
    // Initialize wallet event listeners
    useTestTubeWalletInit();

    return (
        <>
            <Head>
                <title>
                    Test Tube Token | Tokens for Your Blockchain Experiments
                </title>
                <meta
                    name="description"
                    content="A laboratory-grade faucet for Arweave/AO blockchain development"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>

            <Layout>
                <Navbar />

                <main className="flex flex-col items-center w-full">
                    {/* Hero Section */}
                    <HeroSection />

                    {/* Token Dispenser Section - Core Functionality */}
                    <TokenDispenserSection />

                    {/* How It Works Section */}
                    <HowItWorksSection />

                    {/* Use Cases Section */}
                    <UseCasesSection />

                    {/* Technical Details Section */}
                    <TechnicalDetailsSection />
                </main>

                <Footer />
            </Layout>
        </>
    );
}
