import React from 'react';

export default function BusMarker({ busPos, busData }) {
  return (
    <g 
      transform={`translate(${busPos?.x || 400}, ${busPos?.y || 60}) rotate(${busPos?.rot || 0})`}
      className={`${
        busData.status === 'embarcando' ? 'drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] dark:drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]' : 
        busData.status === 'em_movimento' ? 'drop-shadow-[0_0_10px_rgba(52,211,153,0.5)] dark:drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 
        'drop-shadow-[0_0_5px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'
      }`}
    >
      {busData.status === 'embarcando' && (
        <circle cx="0" cy="0" r="30" fill="#facc15" className="animate-ping opacity-30" />
      )}
      <rect x="-14" y="-24" width="28" height="48" rx="6" fill={
        busData.status === 'recolhido' ? '#64748b' : 
        busData.status === 'embarcando' ? '#facc15' : '#10b981'
      } />
      <rect x="-10" y="-18" width="20" height="8" rx="2" className="fill-slate-800 dark:fill-black opacity-80 transition-colors" />
      <rect x="-10" y="10" width="20" height="8" rx="2" className="fill-slate-800 dark:fill-black opacity-50 transition-colors" />
      <rect x="-6" y="-5" width="12" height="10" rx="1" fill="#ffffff" opacity="0.3" />
      {busData.status === 'sistema_pausado' && (
        <g transform="translate(20, -20)">
          <circle cx="0" cy="0" r="10" fill="#ef4444" className="animate-pulse" />
          <text x="0" y="4" fill="#fff" fontSize="12" fontWeight="bold" textAnchor="middle">!</text>
        </g>
      )}
    </g>
  );
}
