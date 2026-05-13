import React from 'react';

export default function MonumentMarker() {
  return (
    <g transform="translate(400, 300)" className="group cursor-pointer hover:scale-110 transition-transform duration-300 origin-bottom" style={{ transformOrigin: '0px 20px' }}>
      <rect x="-50" y="-60" width="100" height="80" fill="transparent" />
      <path d="M -20 15 L 20 15 L 15 25 L -15 25 Z" className="fill-slate-300 dark:fill-zinc-700 stroke-slate-400 dark:stroke-zinc-600 transition-colors duration-500" strokeWidth="2" />
      <rect x="-10" y="-5" width="20" height="20" className="fill-slate-400 dark:fill-zinc-600 transition-colors duration-500" />
      <path d="M -6 -5 L -4 -40 L 4 -40 L 6 -5 Z" fill="#94a3b8" />
      <path d="M -35 -25 Q -10 -22 0 -22 Q 10 -22 35 -25 L 35 -20 Q 10 -17 0 -17 Q -10 -17 -35 -20 Z" fill="#94a3b8" />
      <circle cx="0" cy="-45" r="5" className="fill-slate-100 dark:fill-[#f8fafc] transition-colors duration-500" />
      <path d="M -35 -25 L 35 -25 L 35 -20 L -35 -20 Z" className="fill-white opacity-40 dark:opacity-20" filter="drop-shadow(0 0 5px rgba(255,255,255,0.6))" />
      <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <rect x="-80" y="-80" width="160" height="26" className="fill-white dark:fill-black stroke-slate-300 dark:stroke-[#3b82f6] transition-colors duration-500" rx="6" strokeWidth="1" />
        <text x="0" y="-62" className="fill-blue-600 dark:fill-[#60a5fa] transition-colors duration-500" fontSize="12" textAnchor="middle" fontWeight="bold" style={{ letterSpacing: '0.05em' }}>Cristo Redentor de Lins</text>
        <polygon points="-5,-54 5,-54 0,-48" className="fill-white dark:fill-black stroke-slate-300 dark:stroke-[#3b82f6] transition-colors duration-500" strokeWidth="1" />
      </g>
    </g>
  );
}
