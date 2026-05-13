import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';

export default function Map({ busData, isDarkMode }) {
  const [busPos, setBusPos] = useState({ x: 400, y: 540, rot: 90 });
  const requestRef = useRef();
  const angleRef = useRef(Math.PI / 2); // Começa na estação (parte inferior)
  const lastTimeRef = useRef();

  const animate = (time) => {
    if (lastTimeRef.current === undefined) {
      lastTimeRef.current = time;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 8 segundos por volta completa, acompanhando a maquete
    const speed = (2 * Math.PI) / 8000; 
    angleRef.current -= speed * deltaTime;
    if (angleRef.current < 0) {
      angleRef.current += 2 * Math.PI;
    }
    
    // Equação paramétrica da elipse
    const cx = 400;
    const cy = 300;
    const rx = 320;
    const ry = 240;
    
    const x = cx + rx * Math.cos(angleRef.current);
    const y = cy + ry * Math.sin(angleRef.current);
    
    // Rotação tangente invertida para sentido anti-horário
    const dx = rx * Math.sin(angleRef.current);
    const dy = -ry * Math.cos(angleRef.current);
    const rot = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

    setBusPos({ x, y, rot });
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (busData.status === 'em_movimento') {
      lastTimeRef.current = undefined;
      if (!requestRef.current) {
        requestRef.current = requestAnimationFrame(animate);
      }
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
      
      if (busData.status === 'embarcando' || busData.status === 'recolhido') {
        angleRef.current = Math.PI / 2;
        setBusPos({ x: 400, y: 540, rot: 90 });
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = undefined;
      }
    };
  }, [busData.status]);

  return (
    <div className="lg:col-span-8 bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 overflow-hidden relative shadow-lg dark:shadow-2xl flex flex-col min-h-[400px] transition-colors duration-500">
      
      <div className="absolute top-6 left-6 z-30 bg-white/90 dark:bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-200 dark:border-zinc-700 flex items-center gap-3 shadow-md dark:shadow-xl transition-colors">
        <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        <span className="text-slate-800 dark:text-slate-200 font-bold tracking-wide text-sm md:text-base transition-colors">
          Linha 101 <span className="text-slate-400 dark:text-slate-500 mx-2 transition-colors">•</span> Centro ⇌ Terminal
        </span>
      </div>

      <div className="absolute inset-0 opacity-50 dark:opacity-30 transition-colors duration-500" style={{ 
        backgroundImage: isDarkMode 
          ? 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)'
          : 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', 
        backgroundSize: '40px 40px' 
      }} />
      
      <div className="relative z-10 w-full h-full flex items-center justify-center p-8 overflow-hidden">
        <svg className="w-full h-auto max-w-4xl mx-auto drop-shadow-xl dark:drop-shadow-2xl" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
          <rect x="20" y="20" width="760" height="560" rx="40" className="fill-white dark:fill-black stroke-slate-200 dark:stroke-zinc-800 transition-colors duration-500" strokeWidth="4" />
          
          <ellipse cx="400" cy="300" rx="320" ry="240" fill="none" className="stroke-slate-200 dark:stroke-zinc-800 transition-colors duration-500" strokeWidth="60" />
          <ellipse cx="400" cy="300" rx="320" ry="240" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="15 15" opacity="0.5" />

          <rect x="80" y="270" width="640" height="60" className="fill-slate-200 dark:fill-zinc-800 transition-colors duration-500" />
          <rect x="370" y="60" width="60" height="480" className="fill-slate-200 dark:fill-zinc-800 transition-colors duration-500" />

          <circle cx="400" cy="300" r="50" className="fill-slate-200 dark:fill-zinc-800 transition-colors duration-500" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="400" cy="300" r="30" className="fill-white dark:fill-black transition-colors duration-500 animate-[spin_20s_linear_infinite] origin-center" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 5" style={{ transformOrigin: '400px 300px' }} />

          <g transform="translate(400, 540)">
            <rect x="-70" y="-30" width="140" height="60" fill="#3b82f6" rx="8" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.2)] dark:drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            <text x="0" y="5" fill="#eff6ff" fontSize="16" fontWeight="bold" textAnchor="middle" className="uppercase tracking-widest">Etec / Escola</text>
          </g>

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
        </svg>
      </div>
      
      {busData.status === 'sistema_pausado' && (
        <div className="absolute inset-0 z-20 bg-white/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center rounded-[2rem] transition-colors duration-500">
          <div className="bg-rose-50 border border-rose-200 dark:bg-rose-500/20 dark:border-rose-500/50 text-rose-600 dark:text-rose-200 px-8 py-5 rounded-full flex items-center gap-4 animate-pulse shadow-xl dark:shadow-[0_0_50px_rgba(244,63,94,0.3)] backdrop-blur-xl transition-colors">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <span className="text-xl md:text-2xl font-black tracking-widest uppercase">Simulação Pausada</span>
          </div>
        </div>
      )}
    </div>
  );
}
