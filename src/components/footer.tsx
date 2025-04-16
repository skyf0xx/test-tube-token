import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Heart, ExternalLink } from 'lucide-react';
import { useAnimationPreferences } from '@/utils/helpers';

export const Footer: React.FC = () => {
    const { isAnimationEnabled } = useAnimationPreferences();

    // Animation settings
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    // Partners data with Twitter handles and URLs
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
        <footer className="w-full py-8 border-t border-border bg-muted/20">
            <div className="container mx-auto px-4">
                <motion.div
                    className="flex flex-col items-center"
                    initial={isAnimationEnabled ? 'hidden' : 'visible'}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    {/* Laboratory line decoration */}
                    <div className="w-16 h-1 bg-laboratory-blue rounded-full mb-6"></div>

                    {/* Powered by section */}
                    <div className="flex flex-col items-center mb-6">
                        <p className="text-sm text-foreground/60 mb-3 font-headings">
                            Powered by
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 max-w-lg">
                            {partners.map((partner, index) => (
                                <a
                                    key={index}
                                    href={partner.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border rounded-lg hover:border-primary transition-colors duration-200 group"
                                >
                                    <Twitter
                                        size={14}
                                        className="text-laboratory-blue"
                                    />
                                    <span className="text-sm font-mono group-hover:text-primary transition-colors duration-200">
                                        {partner.handle}
                                    </span>
                                    <ExternalLink
                                        size={12}
                                        className="text-foreground/40 group-hover:text-primary transition-colors duration-200"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Copyright info */}
                    <div className="flex items-center text-xs text-foreground/50 mt-4">
                        <span>
                            © {new Date().getFullYear()} Test Tube Token
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                            Made with{' '}
                            <Heart
                                size={12}
                                className="text-reaction-orange mx-1"
                            />{' '}
                            in the laboratory
                        </span>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};
