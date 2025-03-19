import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, FlaskConical, Code } from 'lucide-react';
import {
    useAnimationPreferences,
    getConditionalAnimations,
} from '@/utils/helpers';

export const HowItWorksSection: React.FC = () => {
    const { isAnimationEnabled } = useAnimationPreferences();
    const animations = getConditionalAnimations(isAnimationEnabled);

    // Animation variants for section container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    // Steps data
    const steps = [
        {
            id: 1,
            title: 'Connect Laboratory',
            description:
                'Link your ArConnect wallet to identify your equipment',
            icon: Wallet,
            color: 'from-[#1C7ED6] to-[#4DABF7]',
        },
        {
            id: 2,
            title: 'Request Test Specimen',
            description: 'Obtain your test tokens with one click',
            icon: FlaskConical,
            color: 'from-[#37B24D] to-[#69DB7C]',
        },
        {
            id: 3,
            title: 'Begin Experiments',
            description: 'Start developing on Arweave/AO blockchain',
            icon: Code,
            color: 'from-[#7950F2] to-[#9775FA]',
        },
    ];

    return (
        <section id="how-it-works" className="w-full py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <motion.div
                    className="text-center mb-16"
                    {...animations.reveal}
                >
                    <h2 className="text-3xl font-bold font-headings mb-3">
                        How It Works
                    </h2>
                    <p className="text-foreground/70 max-w-xl mx-auto">
                        Our scientific process makes obtaining test tokens
                        simple and efficient.
                    </p>
                </motion.div>

                {/* Steps container */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {steps.map((step, index) => (
                        <StepCard
                            key={step.id}
                            step={step}
                            index={index}
                            isAnimationEnabled={isAnimationEnabled}
                        />
                    ))}
                </motion.div>

                {/* Laboratory process visualization - visible only on larger screens */}
                <div className="hidden md:flex justify-center mt-6">
                    <ProcessVisualization />
                </div>
            </div>
        </section>
    );
};

// Step card component
interface StepProps {
    step: {
        id: number;
        title: string;
        description: string;
        icon: React.ElementType;
        color: string;
    };
    index: number;
    isAnimationEnabled: boolean;
}

const StepCard: React.FC<StepProps> = ({ step, index, isAnimationEnabled }) => {
    // Animation settings for each step
    const stepVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: index * 0.2,
            },
        },
    };

    const IconComponent = step.icon;

    return (
        <motion.div
            className="flex flex-col items-center text-center"
            variants={isAnimationEnabled ? stepVariants : undefined}
        >
            {/* Step number badge */}
            <div className="relative mb-6">
                <motion.div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                    whileHover={
                        isAnimationEnabled
                            ? { scale: 1.05, rotate: 5 }
                            : undefined
                    }
                >
                    <IconComponent size={32} className="text-white" />
                </motion.div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-xs font-bold">{step.id}</span>
                </div>
            </div>

            {/* Step content */}
            <h3 className="text-xl font-bold font-headings mb-2">
                {step.title}
            </h3>
            <p className="text-foreground/70 max-w-xs">{step.description}</p>
        </motion.div>
    );
};

// Process visualization with connecting lines between steps
const ProcessVisualization: React.FC = () => {
    return (
        <div className="relative w-full max-w-3xl h-4 mt-10">
            {/* Process line */}
            <div className="absolute top-1/2 left-[16.67%] right-[16.67%] h-1 bg-gradient-to-r from-[#1C7ED6] via-[#37B24D] to-[#7950F2] rounded-full transform -translate-y-1/2">
                {/* Animated pulse effect */}
                <motion.div
                    className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-[#1C7ED6]/0 via-white/40 to-[#7950F2]/0"
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                    }}
                />
            </div>

            {/* Process nodes */}
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full"
                    style={{ left: `${16.67 + i * 33.33}%` }}
                />
            ))}
        </div>
    );
};
