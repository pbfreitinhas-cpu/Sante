"use client";

import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface ProtectionDomeProps {
    src: string;
    alt: string;
    centerX?: number; // percentage (0-100)
    centerY?: number; // percentage (0-100)
    activationRadius?: number; // pixels
}

export const ProtectionDome: React.FC<ProtectionDomeProps> = ({ 
    src, 
    alt, 
    centerX = 50, 
    centerY = 50, 
    activationRadius = 350 
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse coordinates relative to container (0 to 100)
    const mouseX = useMotionValue(centerX);
    const mouseY = useMotionValue(centerY);

    // Proximity factor (0 = far, 1 = exactly on center)
    const proximity = useMotionValue(0);

    // Smoothing settings (High-end fluid motion)
    const springConfig = { damping: 40, stiffness: 80, mass: 1.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);
    const smoothProximity = useSpring(proximity, { damping: 50, stiffness: 60 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        
        mouseX.set(px);
        mouseY.set(py);

        const distCenterPx = {
            x: (centerX / 100) * rect.width,
            y: (centerY / 100) * rect.height
        };
        
        const distance = Math.sqrt(
            Math.pow(x - distCenterPx.x, 2) + 
            Math.pow(y - distCenterPx.y, 2)
        );

        const factor = Math.max(0, 1 - (distance / activationRadius));
        proximity.set(factor);
    };

    // Derived values for the dome shield effect
    const domeSize = useTransform(smoothProximity, [0, 1], [0, 260]);
    const domeOpacity = useTransform(smoothProximity, [0, 0.2], [0, 1]);
    const domeScale = useTransform(smoothProximity, [0, 1], [0.85, 1]);
    
    // Subtle shield displacement
    const driftX = useTransform(smoothX, [0, 100], [3, -3]);
    const driftY = useTransform(smoothY, [0, 100], [3, -3]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center overflow-visible select-none group"
            onMouseLeave={() => proximity.set(0)}
            onMouseMove={handleMouseMove}
        >
            {/* 1. Base Image */}
            <div className="relative w-full h-full flex items-center justify-center">
                <img 
                    src={src} 
                    alt={alt} 
                    className="w-full h-full object-contain pointer-events-none transition-all duration-700"
                />
            </div>

            {/* 2. Protection Dome Layer (Forcefield Effect) */}
            <motion.div 
                className="absolute inset-0 z-20 pointer-events-none will-change-[mask-image,opacity]"
                style={{
                    opacity: domeOpacity,
                    scale: domeScale,
                    maskImage: useTransform(
                        [smoothX, smoothY, domeSize],
                        ([x, y, size]) => `radial-gradient(circle ${size}px at ${x}% ${y}%, black 0%, black 70%, transparent 100%)`
                    ),
                    WebkitMaskImage: useTransform(
                        [smoothX, smoothY, domeSize],
                        ([x, y, size]) => `radial-gradient(circle ${size}px at ${x}% ${y}%, black 0%, black 70%, transparent 100%)`
                    ),
                }}
            >
                <motion.div 
                    className="w-full h-full relative"
                    style={{ 
                        x: driftX, 
                        y: driftY,
                        scale: 1.03 // Subtle Magnification
                    }}
                >
                    <img 
                        src={src} 
                        alt={`${alt} Shielded`} 
                        className="w-full h-full object-contain filter brightness-[1.1] contrast-[1.15] saturate-[1.2]"
                    />
                    
                    {/* Atmospheric Shield Tint */}
                    <div className="absolute inset-0 bg-brand-blue-500/10 mix-blend-color backdrop-blur-[1px]" />
                    
                    {/* Hexagonal Energy Mesh (Iron Dome Style) */}
                    <div 
                        className="absolute inset-0 opacity-40 mix-blend-screen"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='42' viewBox='0 0 24 42'%3E%3Cpath fill='%2336a9f7' fill-opacity='0.5' d='M12 8L22 14V28L12 34L2 28V14L12 8ZM0 14L12 7L24 14V28L12 35L0 28V14Z'/%3E%3C/svg%3E")`,
                            backgroundSize: '24px auto'
                        }}
                    />

                    {/* Shield Shimmer / Energy Flow */}
                    <motion.div 
                        animate={{ 
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-tr from-brand-blue-400/5 via-brand-blue-200/20 to-transparent"
                    />
                </motion.div>
                
                {/* Soft Edge Glow (Instead of hard circle) */}
                <motion.div 
                    className="absolute inset-0 z-30"
                    style={{
                        background: useTransform(
                            [smoothX, smoothY, domeSize],
                            ([x, y, size]) => `radial-gradient(circle ${size}px at ${x}% ${y}%, transparent 80%, rgba(0, 110, 255, 0.2) 90%, transparent 100%)`
                        )
                    }}
                />
            </motion.div>


        </div>
    );
};
