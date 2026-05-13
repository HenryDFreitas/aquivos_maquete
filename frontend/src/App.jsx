import React, { useState, useEffect } from 'react';
// 1. IMPORTANTE: Adicionado 'query' e 'limitToLast' aqui na importação
import { ref, onValue, query, limitToLast } from 'firebase/database';
import { database } from './firebase/config';
import Header from './components/Header';
import Map from './components/Map';
import StatusPanel from './components/StatusPanel';
import HistoryPanel from './components/HistoryPanel';
import Footer from './components/Footer';

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
    
    // 2. IMPORTANTE: Limitando a busca do Firebase para as últimas 15 notificações
    const notifRef = query(ref(database, 'vupt/historico_notificacoes'), limitToLast(15));
    
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
    <div className="min-h-screen lg:h-screen overflow-y-auto lg:overflow-hidden bg-transparent text-slate-800 dark:text-slate-200 font-sans p-4 md:p-6 lg:p-8 flex flex-col selection:bg-[#FACC15] selection:text-black transition-colors duration-500">
      <Header 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode} 
        currentTime={currentTime} 
        busData={busData} 
      />

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 min-h-0 mt-4 lg:mt-0">
        
        <div className="lg:col-span-8 flex flex-col min-h-[400px] lg:min-h-0 rounded-2xl overflow-hidden relative">
          <Map busData={busData} isDarkMode={isDarkMode} />
        </div>
        
        <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8 min-h-0">
          <StatusPanel busData={busData} />
          
          {/* 3. IMPORTANTE: Este 'div' em volta do HistoryPanel força a altura no celular */}
          <div className="flex-1 flex flex-col min-h-[300px] max-h-[400px] lg:max-h-none overflow-hidden">
            <HistoryPanel notifications={notifications} />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}