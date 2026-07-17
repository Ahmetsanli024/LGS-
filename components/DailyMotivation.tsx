import React, { useEffect, useState } from 'react';
import { MOTIVATION_QUOTES } from '../constants';
import { Sparkles, Quote } from 'lucide-react';
import { THEME_PRESETS } from '../types';

interface DailyMotivationProps {
  accentTheme?: string;
}

export function DailyMotivation({ accentTheme = 'neutral' }: DailyMotivationProps) {
  const [quote, setQuote] = useState('');
  const theme = THEME_PRESETS[accentTheme] || THEME_PRESETS.neutral;

  useEffect(() => {
    // Select a random quote on mount (each time the application is opened)
    const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    setQuote(MOTIVATION_QUOTES[randomIndex]);
  }, []);

  if (!quote) return null;

  return (
    <div className="no-print mb-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Decorative background glow */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 pointer-events-none" style={{ backgroundColor: theme.hex }} />
      
      <div className="flex items-start gap-3.5">
        <div className={`p-3 rounded-xl ${theme.bg} text-white shrink-0 shadow-md shadow-slate-100`}>
          <Quote size={18} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black uppercase tracking-widest ${theme.textColor}`}>GÜNÜN MOTİVASYONU</span>
            <Sparkles size={11} className={`${theme.textColor} animate-pulse`} />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">"{quote}"</p>
        </div>
      </div>
      
      <button 
        onClick={() => {
          const current = MOTIVATION_QUOTES.indexOf(quote);
          let nextIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
          if (nextIndex === current && MOTIVATION_QUOTES.length > 1) {
            nextIndex = (nextIndex + 1) % MOTIVATION_QUOTES.length;
          }
          setQuote(MOTIVATION_QUOTES[nextIndex]);
        }}
        className={`shrink-0 px-4 py-2 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 bg-white hover:bg-slate-50 w-full sm:w-auto text-center cursor-pointer`}
        style={{ borderColor: theme.hex, color: theme.hex }}
      >
        YENİ SÖZ AL
      </button>
    </div>
  );
}
