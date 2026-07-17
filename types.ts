
export type GradeLevel = 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface CurriculumDBType {
  [grade: number]: {
    [subject: string]: string[];
  };
}

export interface StudentLevel {
  label: string;
  multiplier: number;
  color: string;
}

export interface DistributionMode {
  label: string;
  questionBase: number;
  color: string;
}

export interface GroupScheduleItem {
  code: string;
  locked?: boolean;
}

export interface GroupSchedules {
  [groupName: string]: {
    [timeKey: string]: GroupScheduleItem;
  };
}

export type StudyMode = 'topic' | 'question' | 'both';

export interface TopicSelection {
  name: string;
  mode: StudyMode;
  subTopics?: string[];
}

// Module 4 Types - Updated to Support Multiple Tasks Per Cell
export interface ScheduleItemM4 {
  id: string; // Unique ID for task management
  topic: string;
  source?: string; 
  action: string; 
  count: string;  
  isCompleted?: boolean;
}

export interface ScheduleM4 {
  [cellKey: string]: ScheduleItemM4[];
}

export interface WeeklyPlanItem {
  day: string;
  subject: string;
  topic: string;
  action: string;
  count: string;
}

export interface DistributeParams {
  mode: string;
  distLevel: string;
  examScores: Record<string, number> | null;
  grade: GradeLevel;
  selectedSubjects: string[];
  selectedTopics: Record<string, TopicSelection[]>; 
  subjectQuestionCounts: Record<string, number>;
  subjectDays: Record<string, string[]>; 
  clearPrevious: boolean;
  paragraphCount: number; 
  duration?: number; 
  studyMode?: 'SORU' | 'TEKRAR' | 'DENEME' | 'BRANS';
  weeklyPlan?: WeeklyPlanItem[];
}

export interface ThemePreset {
  key: string;
  name: string;
  bg: string;
  hoverBg: string;
  textColor: string;
  badgeColor: string;
  lightBg: string;
  borderColor: string;
  indicatorColor: string;
  hex: string;
  
  // Style-specific options for full layout transformations
  fontFamily: string;
  fontFamilyClass: string;
  tableBorderColor: string;
  tableTextColor: string;
  tableHeaderBg: string;
  tableHeaderTextColor: string;
  tableBorderStyle: string;
  cellBg: string;
  titleStyle: string;
  layoutVariant: 'modern' | 'classic' | 'elegant' | 'cyber' | 'nostalgi';
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  neutral: {
    key: 'neutral',
    name: 'Modern Minimal',
    bg: 'bg-slate-900',
    hoverBg: 'hover:bg-slate-800',
    textColor: 'text-slate-900',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    lightBg: 'bg-slate-50',
    borderColor: 'border-slate-200',
    indicatorColor: '#0f172a',
    hex: '#0f172a',
    fontFamily: "'Inter', 'Arial', sans-serif",
    fontFamilyClass: 'font-sans',
    tableBorderColor: '#cbd5e1',
    tableTextColor: '#1e293b',
    tableHeaderBg: '#f8fafc',
    tableHeaderTextColor: '#0f172a',
    tableBorderStyle: 'solid',
    cellBg: '#ffffff',
    titleStyle: 'font-sans tracking-tight font-extrabold',
    layoutVariant: 'modern'
  },
  rose: {
    key: 'rose',
    name: 'Zarif Kitabe',
    bg: 'bg-rose-600',
    hoverBg: 'hover:bg-rose-700',
    textColor: 'text-rose-650',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-105',
    lightBg: 'bg-rose-50/50',
    borderColor: 'border-rose-200',
    indicatorColor: '#e11d48',
    hex: '#e11d48',
    fontFamily: "'Playfair Display', 'Georgia', serif",
    fontFamilyClass: 'font-serif',
    tableBorderColor: '#fda4af',
    tableTextColor: '#4c0519',
    tableHeaderBg: '#fff1f2',
    tableHeaderTextColor: '#881337',
    tableBorderStyle: 'double',
    cellBg: '#fffdfd',
    titleStyle: 'font-serif italic font-bold tracking-normal',
    layoutVariant: 'elegant'
  },
  emerald: {
    key: 'emerald',
    name: 'Klasik Defter',
    bg: 'bg-emerald-700',
    hoverBg: 'hover:bg-emerald-800',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    lightBg: 'bg-emerald-50/50',
    borderColor: 'border-emerald-300',
    indicatorColor: '#047857',
    hex: '#047857',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontFamilyClass: 'font-serif',
    tableBorderColor: '#059669',
    tableTextColor: '#064e3b',
    tableHeaderBg: '#ecfdf5',
    tableHeaderTextColor: '#065f46',
    tableBorderStyle: 'solid',
    cellBg: '#fcfdfa',
    titleStyle: 'font-serif font-black tracking-tight underline decoration-emerald-200/50',
    layoutVariant: 'classic'
  },
  violet: {
    key: 'violet',
    name: 'Siber Neon',
    bg: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    textColor: 'text-indigo-600',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    lightBg: 'bg-indigo-50/40',
    borderColor: 'border-indigo-400',
    indicatorColor: '#4f46e5',
    hex: '#4f46e5',
    fontFamily: "'Courier New', Courier, monospace",
    fontFamilyClass: 'font-mono',
    tableBorderColor: '#818cf8',
    tableTextColor: '#1e1b4b',
    tableHeaderBg: '#e0e7ff',
    tableHeaderTextColor: '#312e81',
    tableBorderStyle: 'dashed',
    cellBg: '#fafaff',
    titleStyle: 'font-mono tracking-widest font-black uppercase text-glow',
    layoutVariant: 'cyber'
  },
  amber: {
    key: 'amber',
    name: 'Retro Gazete',
    bg: 'bg-amber-700',
    hoverBg: 'hover:bg-amber-850',
    textColor: 'text-amber-800',
    badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
    lightBg: 'bg-amber-50/50',
    borderColor: 'border-amber-400',
    indicatorColor: '#b45309',
    hex: '#b45309',
    fontFamily: "'Courier New', 'Georgia', serif",
    fontFamilyClass: 'font-serif',
    tableBorderColor: '#b45309',
    tableTextColor: '#451a03',
    tableHeaderBg: '#fef3c7',
    tableHeaderTextColor: '#78350f',
    tableBorderStyle: 'double',
    cellBg: '#fffdf4',
    titleStyle: 'font-serif tracking-tight font-black uppercase',
    layoutVariant: 'nostalgi'
  }
};

declare global {
  interface Window {
    html2canvas: any;
  }
}
