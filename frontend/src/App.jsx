import React, { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase/config';
import Header from './components/Header';
import Map from './components/Map';
import StatusPanel from './components/StatusPanel';
import HistoryPanel from './components/HistoryPanel';
import { MapPin, Activity, Wifi } from 'lucide-react';

export default function App() {
  const [busData, setBusData] = useState({ status: 'desconhecido', online: false, estimativa: 0 });
  const [notifications, setNotifications] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Efeito global para o HTML Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Firebase Realtime Updates
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString('pt-BR')), 1000);
    
    const busRef = ref(database, 'vupt/onibus_01');
    const unsubscribeBus = onValue(busRef, (snapshot) => {
      if (snapshot.exists()) setBusData(snapshot.val());
      else setBusData({ status: 'desconhecido', online: false });
    });
    
    const notifRef = ref(database, 'vupt/historico_notificacoes');
    const unsubscribeNotif = onValue(notifRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const notifArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setNotifications(notifArray.reverse());
      } else {
        setNotifications([]);
      }
    });

    return () => { 
      clearInterval(timer); 
      unsubscribeBus(); 
      unsubscribeNotif(); 
    };
  }, []);

  return (
    <div className="h-screen overflow-y-auto lg:overflow-hidden bg-transparent text-slate-800 dark:text-slate-200 font-sans p-4 md:p-6 lg:p-8 flex flex-col selection:bg-[#FACC15] selection:text-black transition-colors duration-500">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDarkMode ? '#3f3f46' : '#cbd5e1'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? '#52525b' : '#94a3b8'}; }
      `}} />

      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        currentTime={currentTime} 
        busData={busData} 
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-0">
        <Map busData={busData} isDarkMode={isDarkMode} />
        
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 min-h-0">
          <StatusPanel busData={busData} />
          <HistoryPanel notifications={notifications} />
        </div>
      </div>
      
      <footer className="mt-8 flex justify-center items-center gap-12 opacity-40 dark:opacity-30 pointer-events-none transition-opacity">
        <div className="flex flex-col items-center gap-2">
          <MapPin className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Planejamento VUPT</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Activity className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Arduino Sensor</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Wifi className="w-6 h-6" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Firebase Logic</span>
        </div>
      </footer>
    </div>
  );
}
