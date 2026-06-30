import React from 'react';

export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00E5A0" />
          <stop offset="100%" stopColor="#00B0FF" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0A0E14" />
      <path
        d="M16 44 L16 36 M28 44 L28 26 M40 44 L40 18 M52 44 L52 30"
        stroke="url(#logoGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="52" cy="22" r="4" fill="#00E5A0" />
    </svg>
  );
}
