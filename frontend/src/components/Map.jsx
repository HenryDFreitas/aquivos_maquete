import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import BusMarker from './BusMarker';
import MonumentMarker from './MonumentMarker';
import StationMarker from './StationMarker';

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

          <StationMarker />

          <MonumentMarker />

          <BusMarker busPos={busPos} busData={busData} />
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
