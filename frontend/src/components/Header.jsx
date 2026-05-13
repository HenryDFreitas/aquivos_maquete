import React from 'react';
import { Bus, Clock, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

export default function Header({ isDarkMode, setIsDarkMode, currentTime, busData }) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 px-2 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="bg-[#FACC15] p-2 rounded-xl shadow-[0_0_20px_rgba(250,204,21,0.3)]">
          <Bus className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-widest text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
            VUPT <span className="text-[#FACC15] text-xl">•</span>
          </h1>
        </div>
        <span className="hidden lg:block text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wide border-l border-slate-300 dark:border-zinc-700 pl-4 ml-2 transition-colors">
          Sistema de Monitoramento de Ônibus Inteligente
        </span>
      </div>

      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-end">
        {/* Dark Mode Toggle Button */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          title={isDarkMode ? "Mudar para Branco" : "Mudar para Preto"}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-zinc-900 px-4 py-2 rounded-full border border-slate-200 dark:border-zinc-800 transition-colors shadow-sm">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-sm tracking-widest">{currentTime}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors duration-500 shadow-sm ${busData.online ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)] dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'}`}>
          {busData.online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-xs md:text-sm font-bold tracking-widest uppercase">
            {busData.online ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}
