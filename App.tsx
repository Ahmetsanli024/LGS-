import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { 
  GraduationCap, Printer, Trash2, Loader2, Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Module4 = lazy(() => import('./components/Module4'));

import { MOTIVATION_QUOTES } from './constants';
import { ScheduleM4, THEME_PRESETS, ThemePreset } from './types';

export default function App() {
  const [studentName, setStudentName] = useState("ÖĞRENCİ İSMİ GİRİN");
  const [globalLogo, setGlobalLogo] = useState<string | null>(null);

  const [m4Schedule, setM4Schedule] = useState<ScheduleM4>({});

  // Theme support - locked to Neutral for a unified premium modern style
  const accentTheme = 'neutral';

  // Toast notifications state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  // Track first load to avoid showing instant toast on page load
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const savedData = localStorage.getItem('lgs_pro_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.globalLogo) setGlobalLogo(parsed.globalLogo);
        if (parsed.m4Schedule) setM4Schedule(parsed.m4Schedule);
      } catch (e) { console.error("Yükleme hatası:", e); }
    }
  }, []);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      const dataToSave = {
        studentName, globalLogo, m4Schedule
      };
      localStorage.setItem('lgs_pro_data', JSON.stringify(dataToSave));
      
      // Trigger toast notification
      setToastMessage("Değişiklikler başarıyla kaydedildi! 💾");
      setShowToast(true);

      const toastTimeout = setTimeout(() => {
        setShowToast(false);
      }, 2500);

      return () => clearTimeout(toastTimeout);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [studentName, globalLogo, m4Schedule]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setGlobalLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearAllData = () => {
    if(window.confirm("TÜM SİSTEM VERİLERİ VE LOGO SİLİNECEK. EMİN MİSİNİZ?")) {
      setStudentName("ÖĞRENCİ İSMİ GİRİN");
      setGlobalLogo(null);
      setM4Schedule({});
      localStorage.removeItem('lgs_pro_data');
      
      setToastMessage("Sistem tamamen sıfırlandı.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const theme = THEME_PRESETS[accentTheme] || THEME_PRESETS.neutral;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
      <div className="w-full min-h-screen flex flex-col">
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-[100] no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${theme.bg} rounded-lg flex items-center justify-center text-white transition-all duration-300`}>
              <GraduationCap size={24} />
            </div>
            <h1 className="text-sm font-black uppercase tracking-tight text-slate-800">LGS & Ara Sınıf Pro</h1>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={clearAllData} className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-red-200 flex items-center gap-2 group">
              <Trash2 size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">TEMİZLE</span>
            </button>
            <button onClick={() => window.print()} className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg no-print border border-slate-200" title="PDF Olarak Yazdır">
              <Printer size={18} />
            </button>
          </div>
        </div>
      </nav>



      <main className="max-w-7xl mx-auto p-6 pb-24 w-full">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-20 gap-4">
             <Loader2 size={48} className="animate-spin text-black" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Modül Yükleniyor...</p>
          </div>
        }>
          <Module4 
            studentName={studentName} setStudentName={(v) => setStudentName(v.toLocaleUpperCase('tr-TR'))}
            logo={globalLogo} onLogoUpload={handleLogoUpload}
            schedule={m4Schedule} setM4Schedule={setM4Schedule}
            accentTheme={accentTheme}
          />
        </Suspense>
      </main>

      {/* Subtle bottom-right Toast Notification using Framer Motion */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] bg-slate-900 border border-slate-800 text-white rounded-xl shadow-2xl p-4 flex items-center gap-3 no-print max-w-sm animate-none"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
               <Save size={16} />
            </div>
            <div>
               <p className="text-xs font-black tracking-wide text-white">{toastMessage}</p>
               <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-widest leading-none mt-0.5">Sistem Güvencesi</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        @media print {
          @page {
            size: A4 landscape;
            margin: 4mm;
          }
          .no-print { display: none !important; }
          body { background: white !important; margin: 0; padding: 0; visibility: hidden; }
          
          /* Show specific capture containers based on their IDs in Module components */
          #module11-capture, #classic-planner-capture, #homework-module-capture, #module14-capture, #module16-capture {
             visibility: visible; 
             position: absolute; 
             left: 0; 
             top: 0; 
             width: 100% !important; 
             margin: 0 !important; 
             padding: 0 !important;
             /* Ensure they sit on top of everything */
             z-index: 9999;
          }
          
          /* Override body visibility for the active capture area */
          #module11-capture *, #classic-planner-capture *, #homework-module-capture *, #module14-capture *, #module16-capture * {
             visibility: visible;
          }
        }
      `}</style>
      </div>
    </div>
  );
}
