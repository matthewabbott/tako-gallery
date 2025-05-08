'use client';

// Animation variants for framer-motion or CSS transitions
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
};

export const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export const slideUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export const slideDown = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

// CSS keyframes for shimmer effect
export const shimmerKeyframes = `
@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}
`;

// CSS classes for animations
export const animationClasses = {
    shimmer: 'animate-shimmer',
    fadeIn: 'animate-fadeIn',
    scaleIn: 'animate-scaleIn',
    cardHover: 'card-hover-transition',
    cardHoverActive: 'card-hover-active',
};

// Generate a shimmer background style
export const getShimmerStyle = () => ({
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite linear',
});

// Generate a card hover transition style
export const getCardHoverStyle = (isHovering: boolean) => ({
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    transform: isHovering ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
    boxShadow: isHovering
        ? '0 10px 20px rgba(0,0,0,0.1)'
        : '0 1px 3px rgba(0,0,0,0.05)',
    zIndex: isHovering ? 10 : 'auto',
});

// Generate a staggered animation delay based on index
export const getStaggeredDelay = (index: number, baseDelay = 50) => ({
    animationDelay: `${index * baseDelay}ms`,
    transitionDelay: `${index * baseDelay}ms`,
});
