import React from 'react';

interface KlothOSLogoProps {
  className?: string;
  size?: number;
}

export const KlothOSLogo: React.FC<KlothOSLogoProps> = ({ 
  className = '', 
  size = 40 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Tangerine Gradient */}
        <linearGradient id="klothos-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7A52" />
          <stop offset="100%" stopColor="#E05D38" />
        </linearGradient>

        {/* Inner Gold Accents */}
        <linearGradient id="gold-accent" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>

        {/* Soft Drop Shadow */}
        <filter id="klothos-shadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#E05D38" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect 
        x="5" 
        y="5" 
        width="90" 
        height="90" 
        rx="24" 
        fill="url(#klothos-grad)" 
        filter="url(#klothos-shadow)"
      />

      {/* Interlocking Woven Thread / Letter "K" Motif */}
      {/* Vertical Fabric Thread Spine */}
      <path 
        d="M32 26V74" 
        stroke="white" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />

      {/* Top Thread Loop */}
      <path 
        d="M36 50L64 28" 
        stroke="white" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />

      {/* Bottom Thread Loop */}
      <path 
        d="M36 50L64 72" 
        stroke="white" 
        strokeWidth="9" 
        strokeLinecap="round" 
      />

      {/* WhatsApp Chat Badge Corner Notch */}
      <circle cx="66" cy="28" r="4.5" fill="url(#gold-accent)" />
      <circle cx="66" cy="72" r="4.5" fill="url(#gold-accent)" />

      {/* Center Weave Ribbon Accent */}
      <path 
        d="M48 40L56 50L48 60" 
        stroke="url(#gold-accent)" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
