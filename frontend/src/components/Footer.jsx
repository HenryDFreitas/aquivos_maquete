import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto lg:mt-6 pt-6 pb-2 border-t border-slate-200 dark:border-zinc-800 flex flex-col justify-center items-center gap-3 opacity-60 dark:opacity-50 transition-opacity shrink-0">
      <div className="w-full max-w-5xl px-2 text-[10px] md:text-xs uppercase tracking-widest font-bold text-center flex flex-wrap justify-center items-center gap-x-3 gap-y-2 leading-relaxed">
        <span className="w-full lg:w-auto mb-1 lg:mb-0 text-slate-500 dark:text-slate-400">Desenvolvido por:</span>
        
        <span className="whitespace-nowrap">Bianca Duarte Correia</span>
        <span className="hidden lg:inline text-slate-300 dark:text-zinc-700">•</span>
        
        <span className="whitespace-nowrap">João Gabriel Marcelino dos Santos</span>
        <span className="hidden lg:inline text-slate-300 dark:text-zinc-700">•</span>
        
        <span className="whitespace-nowrap">Gabrielly de Jesus Oliveira</span>
        <span className="hidden lg:inline text-slate-300 dark:text-zinc-700">•</span>
        
        <span className="whitespace-nowrap">Henry de Souza Freitas</span>
      </div>
      
      <div className="text-[10px] md:text-xs tracking-widest font-mono text-[#FACC15] mt-1">
        VUPT.SMARTBUS@GMAIL.COM
      </div>
    </footer>
  );
}
