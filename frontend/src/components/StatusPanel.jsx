import React from 'react';
import { Clock, Bus } from 'lucide-react';

export default function StatusPanel({ busData }) {
  const getStatusCardStyle = (status) => {
    switch (status) {
      case 'recolhido': return 'bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 shadow-none border border-slate-200 dark:border-zinc-800';
      case 'embarcando': return 'bg-amber-400 text-amber-950 shadow-[0_0_60px_rgba(251,191,36,0.3)] border border-transparent';
      case 'em_movimento': return 'bg-[#FACC15] text-[#422006] shadow-[0_0_60px_rgba(250,204,21,0.3)] border border-transparent';
      case 'sistema_pausado': return 'bg-rose-500 text-white shadow-[0_0_60px_rgba(244,63,94,0.4)] border border-transparent';
      default: return 'bg-slate-100 dark:bg-zinc-900 text-slate-500 dark:text-slate-400 shadow-none border border-slate-200 dark:border-zinc-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'recolhido': return 'NA GARAGEM';
      case 'embarcando': return 'EMBARCANDO';
      case 'em_movimento': return 'A CAMINHO';
      case 'sistema_pausado': return 'PAUSADO';
      default: return 'DESCONHECIDO';
    }
  };

  return (
    <div className={`rounded-[2rem] p-8 relative overflow-hidden transition-colors duration-700 shadow-xl dark:shadow-2xl flex-shrink-0 ${getStatusCardStyle(busData.status)}`}>
      <div className="absolute -right-4 -top-8 opacity-[0.05] dark:opacity-[0.08] pointer-events-none transition-opacity">
        <Bus className="w-56 h-56 transform -rotate-12" />
      </div>
      <p className="text-xs md:text-sm font-bold uppercase tracking-widest opacity-80 mb-2">
        Status em Tempo Real
      </p>
      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 flex items-center gap-4">
        {getStatusLabel(busData.status)}
        {busData.status === 'embarcando' && (
          <div className="w-4 h-4 rounded-full bg-current opacity-80 animate-ping" />
        )}
      </h2>
      {(busData.status === 'em_movimento' || busData.status === 'embarcando') && (
        <div className="flex items-center justify-between border-t border-current/10 pt-6 mt-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">
              Estimativa Próxima Parada
            </p>
            <p className="text-3xl font-black">{busData.estimativa ? `${busData.estimativa}s` : '--'}</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-black/20 flex items-center justify-center backdrop-blur-md border border-black/5 dark:border-white/5 transition-colors">
            <Clock className="w-7 h-7 opacity-80" />
          </div>
        </div>
      )}
    </div>
  );
}
