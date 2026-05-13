import React from 'react';
import { Activity, Clock, MapPin, PlaneTakeoff, AlertTriangle, WifiOff, Info } from 'lucide-react';

export default function HistoryPanel({ notifications }) {
  const getNotificationIcon = (mensagem) => {
    const msg = String(mensagem).toLowerCase();
    if (msg.includes('chegou')) return <MapPin className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
    if (msg.includes('saiu') || msg.includes('partiu')) return <PlaneTakeoff className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    if (msg.includes('pausada') || msg.includes('atraso') || msg.includes('obstáculo')) return <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />;
    if (msg.includes('desligado') || msg.includes('erro')) return <WifiOff className="w-5 h-5 text-rose-500 dark:text-rose-400" />;
    return <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />;
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-900 rounded-[2rem] border border-slate-200 dark:border-zinc-800 p-6 lg:p-8 flex-1 flex flex-col min-h-[300px] lg:min-h-0 shadow-xl dark:shadow-2xl relative overflow-hidden group transition-colors duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-100 opacity-50 pointer-events-none" />
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm flex items-center gap-3 transition-colors">
          <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          Histórico Recente
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-0 pr-4 custom-scrollbar relative z-10">
        <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-zinc-800 transition-colors duration-500" />
        
        <div className="space-y-8 pb-4">
          {notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <div key={notif.id} className="flex gap-6 items-start relative group/item">
                <div className="bg-white dark:bg-black border-2 border-slate-200 dark:border-zinc-700 w-10 h-10 rounded-full flex items-center justify-center z-10 shrink-0 group-hover/item:border-[#FACC15] group-hover/item:scale-110 transition-all duration-300 shadow-sm dark:shadow-lg">
                  {getNotificationIcon(notif.mensagem)}
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest transition-colors">
                      {notif.mensagem}
                    </h4>
                    <span className="text-xs md:text-sm font-mono text-slate-500">
                      {notif.horario}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-wider font-bold transition-colors">
                    Registro do Sistema IoT
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-600 space-y-4 transition-colors">
              <Clock className="w-8 h-8 opacity-20" />
              <p className="text-sm tracking-widest uppercase text-center">Nenhum evento registrado hoje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
