import React from 'react';

export default function StationMarker() {
  return (
    <g transform="translate(400, 540)">
      <rect x="-70" y="-30" width="140" height="60" fill="#3b82f6" rx="8" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.2)] dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
      <text x="0" y="5" fill="#eff6ff" fontSize="16" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">Etec / Escola</text>
    </g>
  );
}
