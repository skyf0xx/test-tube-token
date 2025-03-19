import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Code, BookOpen, Layers, PenTool } from 'lucide-react';

export const UseCasesSection: React.FC = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    // Use cases data
    const useCases = [
        {
            icon: <Code className="text-laboratory-blue" size={32} />,
            title: 'Test Smart Contracts',
            description:
                'Develop and test smart contracts in a controlled environment without using real tokens.',
        },
        {
            icon: <Layers className="text-test-tube-green" size={32} />,
            title: 'Prototype dApps',
            description:
                'Build and test decentralized applications with no financial risk before deploying to mainnet.',
        },
        {
            icon: <BookOpen className="text-scientific-purple" size={32} />,
            title: 'Educational Projects',
            description:
                'Teach blockchain concepts in academic settings with practical, hands-on examples.',
        },
        {
            icon: <PenTool className="text-reaction-orange" size={32} />,
            title: 'Developer Experimentation',
            description:
                'Experiment with blockchain features and functionality in a safe development sandbox.',
        },
    ];

    return (
        <section id="use-cases" className="w-full py-16 bg-background">
            <div className="container mx-auto px-4">
                {/* Section heading */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-50px' }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold font-headings mb-3">
                            Use Cases
                        </h2>
                        <p className="text-foreground/70 max-w-xl mx-auto">
                            Discover the various ways you can use Test Tube
                            Tokens in your blockchain experiments.
                        </p>
                    </motion.div>
                </div>

                {/* Use cases grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {useCases.map((useCase, index) => (
                        <UseCase
                            key={index}
                            icon={useCase.icon}
                            title={useCase.title}
                            description={useCase.description}
                            variants={cardVariants}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

interface UseCaseProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    variants?: Variants;
}

const UseCase: React.FC<UseCaseProps> = ({
    icon,
    title,
    description,
    variants,
}) => {
    return (
        <motion.div
            className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden group"
            variants={variants}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
        >
            {/* Laboratory grid background that appears on hover */}
            <div className="absolute inset-0 lab-grid-bg opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-muted">{icon}</div>
                    <h3 className="text-xl font-bold font-headings">{title}</h3>
                </div>
                <p className="text-foreground/70">{description}</p>
            </div>

            {/* Decorative corner element */}
            <div className="absolute bottom-0 right-0 w-12 h-12 opacity-10 bg-gradient-to-tl from-primary to-transparent rounded-tl-xl"></div>
        </motion.div>
    );
};
