import React from 'react';
import { useBranding } from '../../context/BrandingContext';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'symbol' | 'horizontal' | 'light';
  showSubtitle?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showSubtitle = true,
  className = '',
}) => {
  const { branding, activeLogoSrc } = useBranding();

  const sizeDimensions = {
    xs: { symbol: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    sm: { symbol: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    md: { symbol: 'w-11 h-11', text: 'text-lg', sub: 'text-[11px]' },
    lg: { symbol: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
    xl: { symbol: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  }[size];

  const isLight = variant === 'light';

  // Vector PCG Monogram as fallback or base
  const VectorSymbol = (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center select-none shadow-md ${
        sizeDimensions.symbol
      } ${
        isLight
          ? 'bg-[#0B132B] text-white border border-slate-300'
          : 'bg-gradient-to-br from-[#1C2541] via-[#0B132B] to-[#070D1F] border border-amber-500/30 shadow-amber-500/10'
      }`}
    >
      {/* 3D metallic highlights */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-amber-400/10 pointer-events-none" />
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1 drop-shadow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF1BE" />
            <stop offset="40%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA820A" />
            <stop offset="100%" stopColor="#F5D061" />
          </linearGradient>
          <linearGradient id="silverMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>
        </defs>

        {/* Outer subtle shield or geometric frame */}
        <polygon
          points="50,6 92,28 92,72 50,94 8,72 8,28"
          fill="none"
          stroke="url(#goldMetallic)"
          strokeWidth="2.5"
          opacity="0.4"
        />

        {/* Stylized P */}
        <path
          d="M22 74V26h18c7.5 0 13 4.5 13 12s-5.5 12-13 12H32v24H22zm10-28h7.5c2.8 0 4.5-1.8 4.5-4.5s-1.7-4.5-4.5-4.5H32v9z"
          fill="url(#silverMetallic)"
        />

        {/* Stylized C */}
        <path
          d="M68 37c-3.2-3.8-7.5-5.8-12.8-5.8-9.8 0-16.5 7.2-16.5 18.8s6.7 18.8 16.5 18.8c5.3 0 9.6-2 12.8-5.8l-5.6-5c-2 2.2-4.4 3.4-7.2 3.4-5.3 0-8.8-4.5-8.8-11.4s3.5-11.4 8.8-11.4c2.8 0 5.2 1.2 7.2 3.4l5.6-4.8z"
          fill="url(#goldMetallic)"
        />

        {/* Stylized G accent */}
        <path
          d="M78 50h-12v7.5h5c-.6 3.5-3.5 6-7.5 6-4.8 0-8-3.8-8-9s3.2-9 8-9c2.8 0 5 1.2 6.5 3.2l5.8-5.2C72 39 67.5 36.5 63.5 36.5c-9 0-16 6.8-16 16.5s7 16.5 16 16.5c8.5 0 14.5-5.5 14.5-14.5V50z"
          fill="url(#silverMetallic)"
          opacity="0.85"
        />
      </svg>
    </div>
  );

  const LogoSymbol = (
    <div className={`relative shrink-0 ${sizeDimensions.symbol}`}>
      {activeLogoSrc ? (
        <img
          src={activeLogoSrc}
          alt={branding.companyName}
          className="w-full h-full object-cover rounded-xl border border-amber-500/30 shadow-md shadow-amber-500/10"
          onError={(e) => {
            // fallback if custom image breaks
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        VectorSymbol
      )}
    </div>
  );

  if (variant === 'symbol') {
    return <div className={`inline-flex items-center ${className}`}>{LogoSymbol}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoSymbol}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-heading font-extrabold tracking-wider whitespace-nowrap ${
            sizeDimensions.text
          } ${
            isLight
              ? 'text-slate-900'
              : 'bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent drop-shadow-sm'
          }`}
        >
          {branding.companyName}
        </span>
        {showSubtitle && (
          <span
            className={`font-medium tracking-widest uppercase truncate ${
              sizeDimensions.sub
            } ${isLight ? 'text-slate-500' : 'text-amber-400/90'}`}
          >
            {branding.companyShortName} · {branding.subtitle || "Xodimlarni boshqarish tizimi"}
          </span>
        )}
      </div>
    </div>
  );
};
