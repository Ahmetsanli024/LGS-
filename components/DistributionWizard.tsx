
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, CheckCircle2, ChevronDown, BookOpen, 
  CalendarDays, Target, Layers, Info, Trash2, Check, Upload,
  Plus, Search, Sliders, Loader2, BrainCircuit, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRICULUM_DB, DISTRIBUTION_MODES, DAYS, STUDENT_LEVELS, SUBTOPIC_SUGGESTIONS } from '../constants';

import { DistributeParams, GradeLevel, TopicSelection, StudyMode, WeeklyPlanItem, THEME_PRESETS } from '../types';

// Define multipliers for 8th Grade LGS
const LGS_COEFFICIENTS: Record<string, number> = {
  "TÜRKÇE": 4,
  "MATEMATİK": 4,
  "FEN BİLİMLERİ": 4,
  "İNKILAP/SOSYAL": 1,
  "İNGİLİZCE": 1,
  "DİN": 1
};

const TEMPO_META = {
  LIGHT: {
    badge: "🌱 HAFİF TEMPO",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    focusPower: "Düşük Yoğunluk",
    description: "Okul derslerine katkı sağlamak, konuyu pekiştirmek ve yorulmadan düzenli ilerlemek için idealdir.",
    progressVal: 25,
    progressColor: "bg-emerald-500",
    recommendation: "Okula Destek & Takip",
  },
  MEDIUM: {
    badge: "⚡ STANDART HIZ",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    focusPower: "Dengeli Tempo",
    description: "Ortalama bir öğrencinin haftalık sınav hazırlığı ve konu kazanım süreçleri için en dengeli seviyedir.",
    progressVal: 50,
    progressColor: "bg-slate-900",
    recommendation: "Düzenli Sınav Hazırlığı",
  },
  HEAVY: {
    badge: "🔥 YOĞUN KAMP",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-100",
    focusPower: "Yüksek Performans",
    description: "Eksikleri hızlıca kapatmak, soru çözme hızını ve motivasyonunu artırmak isteyen odaklı öğrenciler için.",
    progressVal: 75,
    progressColor: "bg-amber-500",
    recommendation: "Derece Hedefli Sınav Öğrencileri",
  },
  SEMESTER: {
    badge: "🏔️ TATİL KAMPI",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-100",
    focusPower: "Maksimum Yoğunluk",
    description: "Tatil dönemlerinde tüm müfredatı kapsamlı şekilde tekrar edip seri deneme ve soru odaklı uçuş modu.",
    progressVal: 100,
    progressColor: "bg-rose-500",
    recommendation: "Yoğun Tekrar & Soru Kampı",
  }
};

interface DistributionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onDistribute: (params: DistributeParams) => void;
  isDistributing?: boolean;
  grade: GradeLevel;
  setGrade: (grade: GradeLevel) => void;
  targetModule: 'module4';
  goalUnit?: 'Soru' | 'Test' | 'Deneme';
  setGoalUnit?: (unit: 'Soru' | 'Test' | 'Deneme') => void;
  onNetsParsed?: (
    nets: Record<string, number>, 
    studentName?: string, 
    schoolName?: string, 
    classGroup?: string,
    suggestedTasksLevel1?: {key: string, txt: string, gain: string}[],
    suggestedTasksLevel2?: {key: string, txt: string, gain: string}[]
  ) => void;
  v2Nets?: Record<string, number>;
  setV2Nets?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  v2TargetNets?: Record<string, number>;
  setV2TargetNets?: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  v2Tasks1?: {key: string, txt: string, gain: string}[];
  setV2Tasks1?: React.Dispatch<React.SetStateAction<{key: string, txt: string, gain: string}[]>>;
  v2Tasks2?: {key: string, txt: string, gain: string}[];
  setV2Tasks2?: React.Dispatch<React.SetStateAction<{key: string, txt: string, gain: string}[]>>;
  v2Checklist?: Record<string, boolean>;
  setV2Checklist?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  levelCompletion?: Record<string, boolean>;
  setLevelCompletion?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  accentTheme?: string;
}

export const DistributionWizard: React.FC<DistributionWizardProps> = ({ 
  isOpen, onClose, onDistribute, isDistributing = false, grade, setGrade, targetModule, goalUnit = 'Soru',
  setGoalUnit, onNetsParsed,
  v2Nets, setV2Nets,
  v2TargetNets, setV2TargetNets,
  v2Tasks1, setV2Tasks1,
  v2Tasks2, setV2Tasks2,
  v2Checklist, setV2Checklist,
  levelCompletion, setLevelCompletion,
  accentTheme
}) => {
  const theme = THEME_PRESETS[accentTheme || 'neutral'] || THEME_PRESETS.neutral;
  const [viewGrade, setViewGrade] = useState<GradeLevel>(grade);

  const [localV2Nets, setLocalV2Nets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_nets');
      return saved ? JSON.parse(saved) : { TRK: 15, MAT: 10, FEN: 12, INK: 8, DIN: 9, ING: 7 };
    } catch {
      return { TRK: 15, MAT: 10, FEN: 12, INK: 8, DIN: 9, ING: 7 };
    }
  });
  const currentV2Nets = v2Nets || localV2Nets;
  const setCurrentV2Nets = setV2Nets || setLocalV2Nets;

  const [localV2TargetNets, setLocalV2TargetNets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_target_nets');
      return saved ? JSON.parse(saved) : { TRK: 18, MAT: 15, FEN: 16, INK: 10, DIN: 10, ING: 9 };
    } catch {
      return { TRK: 18, MAT: 15, FEN: 16, INK: 10, DIN: 10, ING: 9 };
    }
  });
  const currentV2TargetNets = v2TargetNets || localV2TargetNets;
  const setCurrentV2TargetNets = setV2TargetNets || setLocalV2TargetNets;

  const [localV2Tasks1, setLocalV2Tasks1] = useState<{key: string, txt: string, gain: string}[]>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_tasks_1');
      return saved ? JSON.parse(saved) : [
        { key: 't1', txt: 'MATEMATİK: Üslü İfadeler / Çarpanlar ve Katlar', gain: '+1.63 Net font-black' },
        { key: 't2', txt: 'FEN BİLİMLERİ: Enerji Piramidi / Sıvı Basıncı', gain: '+1.74 Net font-black' },
        { key: 't3', txt: 'TÜRKÇE: Paragrafta Yapı ve Anlam Rutinleri', gain: '+1.09 Net font-black' }
      ];
    } catch {
      return [
        { key: 't1', txt: 'MATEMATİK: Üslü İfadeler / Çarpanlar ve Katlar', gain: '+1.63 Net font-black' },
        { key: 't2', txt: 'FEN BİLİMLERİ: Enerji Piramidi / Sıvı Basıncı', gain: '+1.74 Net font-black' },
        { key: 't3', txt: 'TÜRKÇE: Paragrafta Yapı ve Anlam Rutinleri', gain: '+1.09 Net font-black' }
      ];
    }
  });
  const currentV2Tasks1 = v2Tasks1 || localV2Tasks1;
  const setCurrentV2Tasks1 = setV2Tasks1 || setLocalV2Tasks1;

  const [localV2Tasks2, setLocalV2Tasks2] = useState<{key: string, txt: string, gain: string}[]>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_tasks_2');
      return saved ? JSON.parse(saved) : [
        { key: 't4', txt: 'MATEMATİK: Ebob - Ekok Yeni Nesil Soru Çözün', gain: '+1.13 Net font-black' },
        { key: 't5', txt: 'FEN BİLİMLERİ: Kalıtım / Basit Makineler Özet', gain: '+0.90 Net' },
        { key: 't6', txt: 'İNKILAP / DİN: 20 Yüzyıl Osmanlı & Kader İnancı', gain: '+1.54 Net' }
      ];
    } catch {
      return [
        { key: 't4', txt: 'MATEMATİK: Ebob - Ekok Yeni Nesil Soru Çözün', gain: '+1.13 Net font-black' },
        { key: 't5', txt: 'FEN BİLİMLERİ: Kalıtım / Basit Makineler Özet', gain: '+0.90 Net' },
        { key: 't6', txt: 'İNKILAP / DİN: 20 Yüzyıl Osmanlı & Kader İnancı', gain: '+1.54 Net' }
      ];
    }
  });
  const currentV2Tasks2 = v2Tasks2 || localV2Tasks2;
  const setCurrentV2Tasks2 = setV2Tasks2 || setLocalV2Tasks2;

  const [localV2Checklist, setLocalV2Checklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_checklist_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const currentV2Checklist = v2Checklist || localV2Checklist;
  const setCurrentV2Checklist = setV2Checklist || setLocalV2Checklist;

  const [localLevelCompletion, setLocalLevelCompletion] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_level_completion');
      return saved ? JSON.parse(saved) : { level1: false, level2: false };
    } catch {
      return { level1: false, level2: false };
    }
  });
  const currentLevelCompletion = levelCompletion || localLevelCompletion;
  const setCurrentLevelCompletion = setLevelCompletion || setLocalLevelCompletion;

  const calculateWizardSimulation = () => {
    const totalNets = Number(
      (
        (currentV2Nets.TRK || 0) + 
        (currentV2Nets.MAT || 0) + 
        (currentV2Nets.FEN || 0) + 
        (currentV2Nets.INK || 0) + 
        (currentV2Nets.DIN || 0) + 
        (currentV2Nets.ING || 0)
      ).toFixed(2)
    );

    let simulatedScore = 450.98;
    let simulatedPercentile = 4.67;
    
    if (totalNets <= 77.53) {
      const diff = 77.53 - totalNets;
      simulatedScore = Math.max(200, Number((450.98 - (diff * 3.8)).toFixed(2)));
      simulatedPercentile = Math.min(25, Number((4.67 + (diff * 0.35)).toFixed(2)));
    } else if (totalNets <= 83.00) {
      const ratio = (totalNets - 77.53) / (83.00 - 77.53);
      simulatedScore = Number((450.98 + ratio * (472.22 - 450.98)).toFixed(2));
      simulatedPercentile = Number((4.67 - ratio * (4.67 - 1.81)).toFixed(2));
    } else {
      const ratio = Math.min(1, (totalNets - 83.00) / (87.26 - 83.00));
      simulatedScore = Number((472.22 + ratio * (484.42 - 472.22)).toFixed(2));
      simulatedPercentile = Number((1.81 - ratio * (1.81 - 0.61)).toFixed(2));
      if (totalNets > 87.26) {
        const extraRatio = Math.min(1, (totalNets - 87.26) / (90.00 - 87.26));
        simulatedScore = Number((484.42 + extraRatio * (500 - 484.42)).toFixed(2));
        simulatedPercentile = Number((0.61 - extraRatio * (0.61 - 0.01)).toFixed(2));
      }
    }

    return { totalNets, simulatedScore, simulatedPercentile };
  };

  const { totalNets, simulatedScore, simulatedPercentile } = calculateWizardSimulation();

  const handleLevelCompletionChange = (lvl: 'level1' | 'level2', checked: boolean) => {
    const updated = { ...currentLevelCompletion, [lvl]: checked };
    setCurrentLevelCompletion(updated);
    localStorage.setItem('lgs_v2_level_completion', JSON.stringify(updated));
    
    // Update Simulated nets based on level completion
    if (lvl === 'level1') {
      setCurrentV2Nets(prev => {
        const u = {
          ...prev,
          MAT: checked ? Math.max(prev.MAT || 0, 15.87) : 10.50,
          FEN: checked ? Math.max(prev.FEN || 0, 17.00) : 12.00,
          TRK: checked ? Math.max(prev.TRK || 0, 18.00) : 15.00
        };
        localStorage.setItem('lgs_v2_nets', JSON.stringify(u));
        return u;
      });
    } else if (lvl === 'level2') {
      setCurrentV2Nets(prev => {
        const u = {
          ...prev,
          INK: checked ? 9.50 : 8.00,
          DIN: checked ? 10.00 : 9.00,
          ING: checked ? 9.00 : 7.00,
          MAT: checked ? (currentLevelCompletion.level1 ? 19.00 : 17.50) : (currentLevelCompletion.level1 ? 17.50 : 15.87)
        };
        localStorage.setItem('lgs_v2_nets', JSON.stringify(u));
        return u;
      });
    }
  };

  const handleTaskCheckChange = (taskKey: string, checked: boolean) => {
    const updated = { ...currentV2Checklist, [taskKey]: checked };
    setCurrentV2Checklist(updated);
    localStorage.setItem('lgs_v2_checklist_tasks', JSON.stringify(updated));
  };
  const [distLevel, setDistLevel] = useState<'LIGHT' | 'MEDIUM' | 'HEAVY' | 'SEMESTER'>('MEDIUM');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Record<string, TopicSelection[]>>({});
  const [subjectQuestionCounts, setSubjectQuestionCounts] = useState<Record<string, number>>({});
  const [subjectDays, setSubjectDays] = useState<Record<string, string[]>>({});
  const [isParagraphEnabled, setIsParagraphEnabled] = useState<boolean>(true);
  const [paragraphCount, setParagraphCount] = useState<number>(20);
  const [clearPrevious, setClearPrevious] = useState<boolean>(true);
  const [topicSearch, setTopicSearch] = useState<string>("");
  const [customTopicInputs, setCustomTopicInputs] = useState<Record<string, string>>({});
  
  const [showAI, setShowAI] = useState(false);
  const [aiText, setAiText] = useState("");
  const [aiWeeklyPlan, setAiWeeklyPlan] = useState<WeeklyPlanItem[] | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [extractedPdfText, setExtractedPdfText] = useState<string>("");
  const skipGradeResetRef = useRef<boolean>(false);
  const userChangedGradeManuallyRef = useRef<boolean>(false);
  const isInitialMountRef = useRef<boolean>(true);

  const [targetGoalProfile, setTargetGoalProfile] = useState<'DERECE' | 'DENGELİ' | 'DESTEK'>('DENGELİ');

  const getActiveStudentName = () => {
    try {
      const data = localStorage.getItem('lgs_pro_data');
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.studentName && parsed.studentName !== "ÖĞRENCİ İSMİ GİRİN") {
          return parsed.studentName;
        }
      }
    } catch {}
    return "Öğrenci";
  };

  const handleApplyProfile = (profile: 'DERECE' | 'DENGELİ' | 'DESTEK') => {
    setTargetGoalProfile(profile);
    const isLGS = viewGrade === 8;
    
    if (profile === 'DERECE') {
      setDistLevel('HEAVY');
      setIsParagraphEnabled(true);
      setParagraphCount(30);
      
      const subs = isLGS 
        ? ["TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ", "İNKILAP/SOSYAL", "İNGİLİZCE", "DİN"]
        : Object.keys(CURRICULUM_DB[viewGrade] || {});
        
      setSelectedSubjects(subs);
      
      const counts: Record<string, number> = {};
      const daysM: Record<string, string[]> = {};
      
      subs.forEach(s => {
        const isCore = ["MATEMATİK", "FEN BİLİMLERİ", "TÜRKÇE", "TÜRK DİLİ VE EDEBİYATI", "FİZİK", "KİMYA", "BİYOLOJİ"].includes(s.toUpperCase());
        counts[s] = isCore ? 50 : 25;
        daysM[s] = isCore 
          ? ["Pazartesi", "Çarşamba", "Cuma", "Pazar"]
          : ["Salı", "Perşembe", "Cumartesi"];
      });
      
      setSubjectQuestionCounts(counts);
      setSubjectDays(daysM);
    } else if (profile === 'DENGELİ') {
      setDistLevel('MEDIUM');
      setIsParagraphEnabled(true);
      setParagraphCount(20);
      
      const subs = isLGS 
        ? ["TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ", "İNKILAP/SOSYAL", "İNGİLİZCE", "DİN"]
        : Object.keys(CURRICULUM_DB[viewGrade] || {});
        
      setSelectedSubjects(subs);
      
      const counts: Record<string, number> = {};
      const daysM: Record<string, string[]> = {};
      
      subs.forEach(s => {
        const isCore = ["MATEMATİK", "FEN BİLİMLERİ", "TÜRKÇE", "TÜRK DİLİ VE EDEBİYATI", "FİZİK", "KİMYA", "BİYOLOJİ"].includes(s.toUpperCase());
        counts[s] = isCore ? 30 : 15;
        daysM[s] = isCore 
          ? ["Pazartesi", "Çarşamba", "Cuma"]
          : ["Salı", "Perşembe"];
      });
      
      setSubjectQuestionCounts(counts);
      setSubjectDays(daysM);
    } else if (profile === 'DESTEK') {
      setDistLevel('LIGHT');
      setIsParagraphEnabled(true);
      setParagraphCount(15);
      
      const subs = isLGS 
        ? ["TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ"]
        : Object.keys(CURRICULUM_DB[viewGrade] || {}).slice(0, 3);
        
      setSelectedSubjects(subs);
      
      const counts: Record<string, number> = {};
      const daysM: Record<string, string[]> = {};
      
      subs.forEach(s => {
        const isCore = ["MATEMATİK", "FEN BİLİMLERİ", "TÜRKÇE", "TÜRK DİLİ VE EDEBİYATI"].includes(s.toUpperCase());
        counts[s] = isCore ? 15 : 10;
        daysM[s] = isCore 
          ? ["Salı", "Perşembe"]
          : ["Çarşamba"];
      });
      
      setSubjectQuestionCounts(counts);
      setSubjectDays(daysM);
    }
  };

  const calculateValidityScore = () => {
    let score = 0;
    const items: { label: string; passed: boolean; tip: string }[] = [];

    // Check 1: Paragraph Routine
    const hasParagraph = isParagraphEnabled && paragraphCount >= 15;
    score += hasParagraph ? 25 : 0;
    items.push({
      label: "Günlük Paragraf Rutini",
      passed: hasParagraph,
      tip: "Günde en az 15 paragraf sorusu analitik kavrayışı zirvede tutar."
    });

    // Check 2: Core Subject Coverage (Math, Science, Turkish mapped correctly)
    const hasMath = selectedSubjects.includes("MATEMATİK") && (subjectDays["MATEMATİK"] || []).length >= 2;
    const hasSci = selectedSubjects.includes("FEN BİLİMLERİ") && (subjectDays["FEN BİLİMLERİ"] || []).length >= 2;
    const hasTrk = selectedSubjects.includes("TÜRKÇE") && (subjectDays["TÜRKÇE"] || []).length >= 2;
    
    const coreCheck = hasMath && hasSci && hasTrk;
    score += coreCheck ? 30 : 10;
    items.push({
      label: "Temel Derslerin Dengeli Dağılımı",
      passed: coreCheck,
      tip: "LGS katsayısı yüksek olan Matematik, Fen ve Türkçe derslerinin haftada en az 2 gün çalışılması elzemdir."
    });

    // Check 3: Daily Target Volume Check based on Tempo
    let totalWeeklyVal = 0;
    selectedSubjects.forEach(s => {
      const dCount = (subjectDays[s] || []).length;
      const qCount = subjectQuestionCounts[s] || 0;
      totalWeeklyVal += dCount * qCount;
    });
    if (isParagraphEnabled) {
      totalWeeklyVal += 7 * paragraphCount;
    }

    let volumeOk = false;
    if (distLevel === 'LIGHT' && totalWeeklyVal >= 100) volumeOk = true;
    else if (distLevel === 'MEDIUM' && totalWeeklyVal >= 300) volumeOk = true;
    else if (distLevel === 'HEAVY' && totalWeeklyVal >= 600) volumeOk = true;
    else if (distLevel === 'SEMESTER' && totalWeeklyVal >= 800) volumeOk = true;

    score += volumeOk ? 25 : 10;
    items.push({
      label: "Tempoya Uygun Soru Hacmi",
      passed: volumeOk,
      tip: `${distLevel === 'MEDIUM' ? 'Orta' : distLevel === 'HEAVY' ? 'Yoğun' : 'Hafif'} tempo için haftalık soru sayısı dengeli ayarlanmalıdır.`
    });

    // Check 4: Inter-disciplinary Day Spreading
    const allDaysUsed = new Set();
    selectedSubjects.forEach(s => {
      (subjectDays[s] || []).forEach(d => allDaysUsed.add(d));
    });
    const balancedSpread = allDaysUsed.size >= 4;
    score += balancedSpread ? 20 : 5;
    items.push({
      label: "Haftalık Çalışma Dinlenme Dengesi",
      passed: balancedSpread,
      tip: "Görevlerin haftanın en az 4 gününe yayılarak yükün dengelenmesi gerekir."
    });

    return {
      score: Math.min(100, score),
      checklist: items,
      totalWeeklyVal
    };
  };

  // V2 Diagnostic Report Integrator function
  const handleLoadFromDiagnosis = () => {
    try {
      const savedNets = localStorage.getItem('lgs_v2_nets');
      const savedChecklist = localStorage.getItem('lgs_v2_checklist_tasks');
      
      const nets = savedNets ? JSON.parse(savedNets) : {
        TRK: 17.41,
        MAT: 15.87,
        FEN: 16.76,
        INK: 9.33,
        DIN: 9.13,
        ING: 9.03
      };
      
      const checklist = savedChecklist ? JSON.parse(savedChecklist) : {};
      
      const mappedTopics: Record<string, string[]> = {
        "MATEMATİK": [],
        "FEN BİLİMLERİ": [],
        "TÜRKÇE": [],
        "İNKILAP/SOSYAL": [],
        "İNGİLİZCE": [],
        "DİN": []
      };
      
      const weakTopicsDescription: string[] = [];
      
      if (!checklist.t1) {
        mappedTopics["MATEMATİK"].push("Üslü İfadeler / Çarpanlar ve Katlar");
        weakTopicsDescription.push("Matematik: Üslü İfadeler, Çarpanlar ve Katlar");
      }
      if (!checklist.t2) {
        mappedTopics["FEN BİLİMLERİ"].push("Sıvı Basıncı / Enerji Piramidi");
        weakTopicsDescription.push("Fen Bilimleri: Enerji Piramidi / Sıvı Basıncı");
      }
      if (!checklist.t3) {
        mappedTopics["TÜRKÇE"].push("Paragrafta Yapı ve Anlam Rutinleri");
        weakTopicsDescription.push("Türkçe: Paragrafta Yapı ve Anlam");
      }
      if (!checklist.t4) {
        mappedTopics["MATEMATİK"].push("Ebob - Ekok Yeni Nesil");
        weakTopicsDescription.push("Matematik: Ebob - Ekok Yeni Nesil");
      }
      if (!checklist.t5) {
        mappedTopics["FEN BİLİMLERİ"].push("Kalıtım / Basit Makineler");
        weakTopicsDescription.push("Fen Bilimleri: Kalıtım / Basit Makineler");
      }
      if (!checklist.t6) {
        mappedTopics["İNKILAP/SOSYAL"].push("20. Yüzyıl Başlarında Osmanlı Devleti");
        mappedTopics["DİN"].push("Kader İnancı");
        weakTopicsDescription.push("İnkılap: 20. Yüzyıl Osmanlı, Din: Kader İnancı");
      }
      
      setViewGrade(8);
      
      const targetSubjects = ["TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ", "İNKILAP/SOSYAL", "İNGİLİZCE", "DİN"];
      setSelectedSubjects(targetSubjects);
      
      const formattedSelectedTopics: Record<string, TopicSelection[]> = {};
      targetSubjects.forEach(sub => {
        const topicsList = mappedTopics[sub] || [];
        if (topicsList.length > 0) {
          formattedSelectedTopics[sub] = topicsList.map(name => ({
            name,
            mode: 'question',
            subTopics: []
          }));
        } else {
          const base = (CURRICULUM_DB[8]?.[sub] || []).slice(0, 2);
          formattedSelectedTopics[sub] = base.map(name => ({
            name,
            mode: 'question',
            subTopics: []
          }));
        }
      });
      setSelectedTopics(formattedSelectedTopics);
      
      const promptText = `LGS Teşhis Paneli analizi doğrultusunda plan oluşturmak istiyorum.
Öğrenci LGS Deneme Ortalaması Netleri:
- Türkçe: ${nets.TRK?.toFixed(2)} Net
- Matematik: ${nets.MAT?.toFixed(2)} Net
- Fen Bilimleri: ${nets.FEN?.toFixed(2)} Net
- İnkılap Tarihi: ${nets.INK?.toFixed(2)} Net
- Din Kültürü: ${nets.DIN?.toFixed(2)} Net
- İngilizce: ${nets.ING?.toFixed(2)} Net

Öncelikli Geliştirilecek Konular:
${weakTopicsDescription.map(t => "• " + t).join("\n")}

Lütfen bu verileri dikkate alarak, öğrencinin netlerini yukarı taşımak üzere, zayıf olduğu bu konulara daha fazla ağırlık veren ve eksik gelişim adımlarını mükemmel şekilde koordine eden özel bir LGS haftalık çalışma programı dağıtımı yap!`;

      setAiText(promptText);
      alert("Teşhis karnesi verileri başarıyla aktarıldı! Yapay zeka promptu zayıf olduğunuz konulara ve deneme netlerinize göre otomatik olarak optimize edildi. Şimdi 'Yapay Zeka İle Analiz Et' veya 'Planı Hazırla' butonuna basabilirsiniz.");
    } catch (e: any) {
      alert("Teşhis verileri yüklenirken bir hata oluştu: " + e.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Lütfen geçerli bir PDF dosyası yükleyin.");
      return;
    }

    setIsPdfLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-pdf", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("PDF metni ayıklanamadı.");
      const data = await res.json();
      const rawText = data.text || "";
      setExtractedPdfText(rawText);
      setAiText(rawText);

      alert("📋 PDF karnesi başarıyla okundu! Şimdi \"YAPAY ZEKA İLE ANALİZ ET\" butonuna tıklayarak haftalık ders çalışma programınızı, hedeflerinizi ve gelişim reçetenizi otomatik oluşturabilirsiniz.");
    } catch (err: any) {
      alert("PDF çözümleme hatası: " + err.message);
    } finally {
      setIsPdfLoading(false);
      e.target.value = '';
    }
  };

  const handleAIParse = async () => {
    if (!aiText.trim()) {
      alert("Lütfen önce bir analiz metni (deneme sonucu, öğretmen notu vb.) girin.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const prompt = `Şu anki seçili sınıf düzeyi: ${viewGrade}.
Kullanıcıdan gelen rapor/not/deneme sonucu:
"""
${aiText}
"""

Lütfen bu metni analiz et ve öğrencinin çalışması gereken sınıf düzeyini, DERSLERİ, KONULARI ve İHTİYACI OLAN SORU SAYILARINI JSON formatında çıkar.
Eğer metinden öğrencinin sınıf düzeyini (örn: "8. Sınıf", "8-F2", "LGS", "LGS ANALİZİ" vb.) tespit edebilirsen "detectedGrade" alanında belirt. LGS grupları her zaman 8. Sınıf'tır (LGS ise de 8 döndür).

Ayrıca öğrencinin LGS veya yazılı durum ders başarısı ve deneme netleri verilerinden teşhis hedefleri ile 7 günlük bir "Haftalık Çalışma Planı"nı (Pazartesi'den Pazar'a) tam olarak oluşturup "weeklyPlan" dizisine eklemelisin.
Plana konuları dağıtırken ve haftalık planı ders-konu ve soru hedefleriyle doldururken, şu 3 adımlı analiz karnesi tarifini BİREBİR VE EKSİKSİZ UYGULAMALISIN:

### TARİF VE ADIMLAR:

Adım 1: Analiz Karnesinden Verileri Çıkarma (Teşhis Aşaması)
- Karnedeki zayıf, zayıflamaya yakın ve güçlü olunan konu ya da dersleri belirleyin:
  * Seviye 1 Görevleri (Kritik Müdahale): Karnedeki "1. Öncelikli Konu Listesi"ni inceleyin. Buradaki konular öğrencinin en çok net kaybettiği ve temelinin zayıf olduğu yerlerdir. Örneğin; Fen Bilimleri dersinden "Enerji Piramidi", "Maddenin Isı İle Etkileşimi" veya Matematik dersinden "Üslü İfadeler", "Doğrusal Denklemler", "Eşitsizlikler" bu gruptaysa, acil müdahale gerektirir.
  * Seviye 2 Görevleri (İnce Ayar): Karnedeki "2. Öncelikli Konu Listesi"ne geçin. Bu gruptaki konular, öğrencinin konuyu bildiği ancak yeni nesil sorularda zorlandığı veya dikkat hatası yaptığı yerlerdir. Örneğin; İnkılap Tarihi dersinden "20. Yüzyıl Başlarında Osmanlı", "Atatürkçülük" veya Türkçe dersinden "Sözcükte Anlam", "Paragrafta Anlam ve Yapı" bu listedeyse, pratik eksiği var demektir.
  * Seviye 3 Görevleri (Koruma): Başarısı %85 ve üzerinde olan, öncelikli konular listesinde yer almayan güçlü olunan dersleri veya konuları belirleyin.

Adım 2: Belirlenen Görevleri Günlere Dağıtma (Reçete Yazma Aşaması)
Elde ettiğiniz bu üç seviyeyi, boş çalışma programındaki günlere stratejik bir sırayla yerleştirin:
- Haftanın İlk Günleri (Pazartesi ve Salı): Bu günlere sadece en ağır yük olan "Seviye 1" konularını yazın. Sadece konu adını yazıp bırakmayın; görevin niteliğini de belirtin. Eylem olarak mutlaka "Konu Anlatımı Çalışması", "Fasikül Bitirme" veya "Temel Düzey Soru Çözümü" (veya "Konu Anlatımı + Soru Çözümü") ifadelerini ekleyin.
- Haftanın Ortası (Çarşamba ve Perşembe): Bu günlere "Seviye 2" konularını dağıtın. Bu konular için plana "Kısa Tekrar" ve "Orta/Zor Seviye Yeni Nesil Soru Çözümü" eylemlerini yazın.
- Haftanın Sonu ve Rutinler (Cuma, Cumartesi ve Pazar - Koruma): Öğrencinin zaten iyi olduğu "Seviye 3" dersleri için günlere sadece "Branş Denemesi ve Soru Çözümü" görevini yazın.
- Paragraf Rutini (İstisnasız Tüm Günler): Programın istisnasız Her Günü için (Pazartesi'den Pazar'a kadar her gün) "PARAGRAF" dersinin altına "PARAGRAF ÇÖZÜMÜ" eklentisini yapın.

Adım 3: Programa Yazım Şekli (JSON Yapı ve Format Kuralları)
- subject: Dersin resmi tam adı ("TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ", "İNKILAP/SOSYAL", "İNGİLİZCE", "DİN") ya da her gün için "PARAGRAF".
- day: Türkçe gün adı ("Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar").
- topic: Program hücresindeki metindir. Tam olarak eylemi de belirtmelidir. Örneğin: "Üslü İfadeler (Fasikül Çalışması + 40 Soru)", "Maddenin Isı İle Etkileşimi (Konu Etüdü + Temel Test)", "Branş Denemesi ve Soru Çözümü" veya "PARAGRAF ÇÖZÜMÜ".
- action: Hücrenin eylemi: "KONU TEKRARI" | "SORU ÇÖZÜMÜ" | "KONU + SORU" | "DENEME SINAVI" | "PARAGRAF".
- count: Soru hedefi formatta yazılmalı (örneğin: "40 SORU", "30 SORU", "20 SORU" vb.).

Çıktı formatın sadece şu JSON yapısında olmalı, başka hiçbir açıklayıcı metin ya da markdown dışı yazı kullanma:
{
  "studentName": "ÖĞRENCİ ADI (Eğer bulunursa büyük harflerle. Bulunamazsa null)",
  "schoolName": "OKUL ADI (Eğer bulunursa. Bulunamazsa null)",
  "classGroup": "SINIF/ŞUBE (Eğer bulunursa, örn: '8-F2' veya '8-B'. Bulunamazsa null)",
  "detectedGrade": 8,
  "nets": {
    "TRK": 17.33,
    "MAT": 15.27,
    "FEN": 16.11,
    "INK": 9.56,
    "DIN": 9.73,
    "ING": 9.38
  },
  "suggestedTasksLevel1": [
    { "key": "l1_1", "txt": "MATEMATİK: Doğrusal Denklemler (Konu Anlatımı Çalışması + 40 Soru)", "gain": "+1.87 Net" },
    { "key": "l1_2", "txt": "FEN BİLİMLERİ: Maddenin Isı İle Etkileşimi (Konu Etüdü + Temel Test)", "gain": "+2.01 Net" },
    { "key": "l1_3", "txt": "MATEMATİK: Üslü İfadeler (Fasikül Çalışması + 40 Soru)", "gain": "+1.87 Net" }
  ],
  "suggestedTasksLevel2": [
    { "key": "l2_1", "txt": "MATEMATİK: Basit Olayların Olma Olasılığı (Kısa Tekrar + 30 Soru)", "gain": "+1.16 Net" },
    { "key": "l2_2", "txt": "FEN BİLİMLERİ: Mevsimlerin Oluşumu (Kısa Tekrar ve Yeni Nesil Soru Çözümü)", "gain": "+1.06 Net" },
    { "key": "l2_3", "txt": "İNKILAP TARİHİ: 20. Yüzyıl Başlarında Osmanlı (Kısa Tekrar + 20 Yeni Nesil Soru)", "gain": "+0.61 Net" }
  ],
  "selectedSubjects": ["TÜRKÇE", "MATEMATİK", "FEN BİLİMLERİ", "İNKILAP/SOSYAL", "İNGİLİZCE", "DİN"],
  "selectedTopics": {
    "MATEMATİK": ["Doğrusal Denklemler", "Üslü İfadeler", "Eşitsizlikler"],
    "FEN BİLİMLERİ": ["Maddenin Isı İle Etkileşimi", "Basit Makineler"],
    "TÜRKÇE": ["Görsel Okuma", "Grafik ve Tablo Okuma"]
  },
  "subjectQuestionCounts": {
    "TÜRKÇE": 50,
    "MATEMATİK": 40,
    "FEN BİLİMLERİ": 30,
    "İNKILAP/SOSYAL": 20,
    "İNGİLİZCE": 20,
    "DİN": 20
  },
  "subjectDays": {
    "MATEMATİK": ["Pazartesi", "Çarşamba", "Cuma", "Cumartesi"],
    "FEN BİLİMLERİ": ["Salı", "Perşembe", "Cumartesi"],
    "TÜRKÇE": ["Pazartesi", "Perşembe", "Pazar"]
  },
  "paragraphCount": 20,
  "targetGoalProfile": "DENGELİ",
  "weeklyPlan": [
    {
      "day": "Pazartesi",
      "subject": "MATEMATİK",
      "topic": "Doğrusal Denklemler (Konu Anlatımı Çalışması + 40 Soru)",
      "action": "KONU + SORU",
      "count": "45 SORU"
    },
    {
      "day": "Pazartesi",
      "subject": "PARAGRAF",
      "topic": "PARAGRAF ÇÖZÜMÜ",
      "action": "PARAGRAF",
      "count": "20 SORU"
    }
    // ... Bütün günler için her günü dolduracak şekilde öğrencinin analizine göre plan!
  ]
}

Sadece geçerli bir JSON string döndürüp başka hiçbir markdown veya açıklama içerme.`;
      
      const res = await fetch("/api/ai-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      
      if (!res.ok) throw new Error("Yapay zeka servisi yanıt vermedi.");
      const data = await res.json();
      
      let parsed;
      try {
        let text = data.text || "";
        const startIndex = text.indexOf("{");
        const endIndex = text.lastIndexOf("}");
        if (startIndex !== -1 && endIndex !== -1) {
          text = text.substring(startIndex, endIndex + 1);
        }
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("AI JSON Parse Error, raw output:", data.text);
        throw new Error("Yapay zeka yanıt formatı okunamadı. Lütfen tekrar deneyin.");
      }
      
      // 1. Identify and set active grade first
      let activeGrade = viewGrade;
      if (parsed.detectedGrade && [5, 6, 7, 8, 9, 10, 11].includes(Number(parsed.detectedGrade))) {
        const detGrade = Number(parsed.detectedGrade) as GradeLevel;
        if (detGrade !== viewGrade) {
          activeGrade = detGrade;
          setViewGrade(detGrade);
          if (setGrade) {
            setGrade(detGrade);
          }
        }
      }

      // Activate skipping effects to preserve custom AI counts/topics on grade change
      skipGradeResetRef.current = true;
      setTimeout(() => {
        skipGradeResetRef.current = false;
      }, 150);

      // Map goal profile
      if (parsed.targetGoalProfile) {
        if (['DERECE', 'DENGELİ', 'DESTEK'].includes(parsed.targetGoalProfile)) {
          setTargetGoalProfile(parsed.targetGoalProfile);
          if (parsed.targetGoalProfile === 'DERECE') setDistLevel('HEAVY');
          else if (parsed.targetGoalProfile === 'DESTEK') setDistLevel('LIGHT');
          else setDistLevel('MEDIUM');
        }
      }

      const gradeSubjects = Object.keys(CURRICULUM_DB[activeGrade] || {});

      // 2. Normalization helpers
      const normalizeSubjectName = (subjName: string, gradeNum: number): string => {
        const norm = subjName.toUpperCase().trim()
          .replace(/İ/g, "I")
          .replace(/Ğ/g, "G")
          .replace(/Ü/g, "U")
          .replace(/Ş/g, "S")
          .replace(/Ö/g, "O")
          .replace(/Ç/g, "C");
        
        if (gradeNum <= 8) {
          if (norm.includes("TURKCE") || norm.includes("EDEBIYAT")) return "TÜRKÇE";
          if (norm.includes("MATEMATIK") || norm.includes("MAT")) return "MATEMATİK";
          if (norm.includes("FEN") || norm.includes("FIZIK") || norm.includes("KIMYA") || norm.includes("BIYOLOJI") || norm.includes("SCI")) return "FEN BİLİMLERİ";
          if (norm.includes("INKILAP") || norm.includes("SOSYAL") || norm.includes("TARIH") || norm.includes("COGRAFYA") || norm.includes("HISTORY")) return "İNKILAP/SOSYAL";
          if (norm.includes("INGILIZCE") || norm.includes("ENGLISH") || norm.includes("YABANCI")) return "İNGİLİZCE";
          if (norm.includes("DIN") || norm.includes("AHLAK") || norm.includes("RELIGION")) return "DİN";
        } else {
          if (norm.includes("TURK DILI") || norm.includes("EDEBIYAT") || norm.includes("TURKCE")) return "TÜRK DİLİ VE EDEBİYATI";
          if (norm.includes("MATEMATIK") || norm.includes("MAT")) return "MATEMATİK";
          if (norm.includes("FIZIK") || norm.includes("PHYSICS")) return "FİZİK";
          if (norm.includes("KIMYA") || norm.includes("CHEMISTRY")) return "KİMYA";
          if (norm.includes("BIYOLOJI") || norm.includes("BIOLOGY")) return "BİYOLOJİ";
          if (norm.includes("TARIH") || norm.includes("INKILAP") || norm.includes("HISTORY")) return "TARİH";
          if (norm.includes("COGRAFYA") || norm.includes("GEOGRAPHY")) return "COĞRAFYA";
        }
        return subjName;
      };

      const getExactCurriculumSubjectName = (subjName: string): string | null => {
        const normSubj = normalizeSubjectName(subjName, activeGrade);
        return gradeSubjects.find(g => g.toUpperCase() === normSubj.toUpperCase()) || null;
      };

      const getExactTopicName = (subj: string, topicName: string): string => {
        const dbTopics = CURRICULUM_DB[activeGrade]?.[subj] || [];
        const cleanTopicName = topicName.trim();
        
        // Case insensitive match
        const found = dbTopics.find(t => t.toUpperCase() === cleanTopicName.toUpperCase() || t.toLowerCase() === cleanTopicName.toLowerCase());
        if (found) return found;
        
        // Loose substring match
        const foundPartial = dbTopics.find(t => t.toLowerCase().includes(cleanTopicName.toLowerCase()) || cleanTopicName.toLowerCase().includes(t.toLowerCase()));
        if (foundPartial) return foundPartial;
        
        return cleanTopicName;
      };

      // Set v2 dynamic nets and LGS targets to automatically update simulator!
      if (parsed.nets) {
        if (onNetsParsed) {
          onNetsParsed(
            parsed.nets, 
            parsed.studentName || undefined, 
            parsed.schoolName || undefined, 
            parsed.classGroup || undefined,
            parsed.suggestedTasksLevel1 || undefined,
            parsed.suggestedTasksLevel2 || undefined
          );
        }
        
        setCurrentV2Nets(parsed.nets);
        localStorage.setItem('lgs_v2_nets', JSON.stringify(parsed.nets));

        const updatedTargets = { ...currentV2TargetNets };
        Object.keys(parsed.nets).forEach((key) => {
          const val = parsed.nets[key] || 0;
          updatedTargets[key] = Math.min(key === 'TRK' || key === 'MAT' || key === 'FEN' ? 20 : 10, Number((val + 1.5).toFixed(2)));
        });
        setCurrentV2TargetNets(updatedTargets);
        localStorage.setItem('lgs_v2_target_nets', JSON.stringify(updatedTargets));

        if (parsed.suggestedTasksLevel1) {
          setCurrentV2Tasks1(parsed.suggestedTasksLevel1);
          localStorage.setItem('lgs_v2_tasks_1', JSON.stringify(parsed.suggestedTasksLevel1));
        }
        if (parsed.suggestedTasksLevel2) {
          setCurrentV2Tasks2(parsed.suggestedTasksLevel2);
          localStorage.setItem('lgs_v2_tasks_2', JSON.stringify(parsed.suggestedTasksLevel2));
        }

        if (parsed.studentName) {
          const currentData = localStorage.getItem('lgs_pro_data') || "{}";
          try {
            const currentParsed = JSON.parse(currentData);
            currentParsed.studentName = parsed.studentName;
            localStorage.setItem('lgs_pro_data', JSON.stringify(currentParsed));
          } catch {}
        }
      }

      // 3. Populate custom parsed states
      let finalSelectedSubjects: string[] = [];
      if (parsed.selectedSubjects && Array.isArray(parsed.selectedSubjects)) {
        parsed.selectedSubjects.forEach((s: string) => {
          const matchedSubj = getExactCurriculumSubjectName(s);
          if (matchedSubj && !finalSelectedSubjects.includes(matchedSubj)) {
            finalSelectedSubjects.push(matchedSubj);
          }
        });
      }

      // If no valid subjects listed, default to all of them
      if (finalSelectedSubjects.length === 0) {
        finalSelectedSubjects = [...gradeSubjects];
      }
      setSelectedSubjects(finalSelectedSubjects);

      // 4. Map selectedTopics
      if (parsed.selectedTopics) {
        const topicsFormatted: Record<string, TopicSelection[]> = {};
        Object.keys(parsed.selectedTopics).forEach(subj => {
          const matchedSubj = getExactCurriculumSubjectName(subj);
          if (matchedSubj) {
            const rawTopicsList = parsed.selectedTopics[subj];
            if (Array.isArray(rawTopicsList)) {
              topicsFormatted[matchedSubj] = rawTopicsList.map((t: string) => {
                const matchedTopic = getExactTopicName(matchedSubj, t);
                 return { name: matchedTopic, mode: 'question', subTopics: [] };
              });
            }
          }
        });
        setSelectedTopics(topicsFormatted);
      }

      // 5. Map question/test targets
      if (parsed.subjectQuestionCounts) {
        const countsFormatted: Record<string, number> = {};
        // Initialize default bases first
        const base = DISTRIBUTION_MODES[distLevel].questionBase;
        gradeSubjects.forEach(sub => {
          let finalBase = base;
          if (activeGrade === 8) {
            const coeff = LGS_COEFFICIENTS[sub.toUpperCase()] || 2;
            finalBase = Math.round(base * (coeff / 2));
          }
          countsFormatted[sub] = (goalUnit === 'Test' || goalUnit === 'Deneme') ? Math.max(1, Math.round(finalBase / 15)) : finalBase;
        });

        // Overlay with parsed counts
        Object.keys(parsed.subjectQuestionCounts).forEach(subj => {
          const matchedSubj = getExactCurriculumSubjectName(subj);
          if (matchedSubj) {
            const val = Number(parsed.subjectQuestionCounts[subj]);
            if (!isNaN(val) && val > 0) {
              countsFormatted[matchedSubj] = val;
            }
          }
        });
        setSubjectQuestionCounts(countsFormatted);
      }

      if (typeof parsed.paragraphCount === "number" && parsed.paragraphCount >= 0) {
        setParagraphCount(parsed.paragraphCount);
        setIsParagraphEnabled(parsed.paragraphCount > 0);
      }

      if (parsed.subjectDays) {
        const daysFormatted: Record<string, string[]> = {};
        Object.keys(parsed.subjectDays).forEach(subj => {
          const matchedSubj = getExactCurriculumSubjectName(subj);
          if (matchedSubj && Array.isArray(parsed.subjectDays[subj])) {
            daysFormatted[matchedSubj] = parsed.subjectDays[subj];
          }
        });
        setSubjectDays(daysFormatted);
      }

      // 6. Map weeklyPlan if exists
      if (parsed.weeklyPlan && Array.isArray(parsed.weeklyPlan)) {
        const normalizedWeeklyPlan: WeeklyPlanItem[] = [];
        parsed.weeklyPlan.forEach((item: any) => {
          if (item.day && item.subject && item.topic) {
            let matchedSubj: string | null = null;
            if (item.subject.toUpperCase() === "PARAGRAF") {
              matchedSubj = "PARAGRAF";
            } else {
              matchedSubj = getExactCurriculumSubjectName(item.subject);
            }
            
            if (matchedSubj) {
              normalizedWeeklyPlan.push({
                day: item.day,
                subject: matchedSubj,
                topic: item.topic,
                action: item.action || "SORU ÇÖZÜMÜ",
                count: item.count || "30 SORU"
              });
            }
          }
        });
        setAiWeeklyPlan(normalizedWeeklyPlan);
      } else {
        setAiWeeklyPlan(null);
      }
      
      let summaryMessage = "🎉 Karne Raporu Başarıyla Analiz Edildi!\n\n";
      if (parsed.studentName) summaryMessage += `Öğrenci: ${parsed.studentName}\n`;
      if (parsed.schoolName) summaryMessage += `Okul: ${parsed.schoolName}\n`;
      if (parsed.classGroup) summaryMessage += `Sınıf: ${parsed.classGroup}\n`;
      if (parsed.nets) {
        summaryMessage += `\nNet Ortalamaları:\n`;
        summaryMessage += `• Türkçe: ${parsed.nets.TRK} Net\n`;
        summaryMessage += `• Matematik: ${parsed.nets.MAT} Net\n`;
        summaryMessage += `• Fen Bilimleri: ${parsed.nets.FEN} Net\n`;
        summaryMessage += `• İnkılap: ${parsed.nets.INK} Net\n`;
        summaryMessage += `• Din: ${parsed.nets.DIN} Net\n`;
        summaryMessage += `• İngilizce: ${parsed.nets.ING} Net\n`;
      }
      summaryMessage += `\nBu veriler "Seçim & Müfredat Dağıtımı" kısmında yer alan ders, konu ve soru hedeflerini otomatik güncelledi! Ders çalışma programınız arka planda yüklendi, "Planı Hazırla" butonuna bastığınızda şablonunuz tam hazır olacaktır!`;
      
      alert(summaryMessage);
      setShowAI(false);
      setAiText("");
    } catch (err: any) {
      alert("Yapay zeka optimizasyonu sırasında hata oluştu: " + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Use a separate effect for grade changes to reset everything
  useEffect(() => {
    const isInitial = isInitialMountRef.current;
    if (isInitial) {
      isInitialMountRef.current = false;
    }

    if (!isInitial && !userChangedGradeManuallyRef.current) {
      return;
    }
    userChangedGradeManuallyRef.current = false;

    if (viewGrade && CURRICULUM_DB[viewGrade]) {
      const dbSubjects = Object.keys(CURRICULUM_DB[viewGrade]);
      const initialCounts: Record<string, number> = {};
      const initialDays: Record<string, string[]> = {};
      const base = DISTRIBUTION_MODES[distLevel].questionBase;

      dbSubjects.forEach(sub => {
        let finalBase = base;
        if (viewGrade === 8) {
          const coeff = LGS_COEFFICIENTS[sub.toUpperCase()] || 2;
          finalBase = Math.round(base * (coeff / 2));
        }
        initialCounts[sub] = (goalUnit === 'Test' || goalUnit === 'Deneme') ? Math.max(1, Math.round(finalBase / 15)) : finalBase;
        initialDays[sub] = [...DAYS];
      });

      setSubjectQuestionCounts(initialCounts);
      setSubjectDays(initialDays);
      setSelectedSubjects(dbSubjects); // Reset subjects on grade change
      setSelectedTopics({}); // Clear topics on grade change
      
      let pBase = 20;
      if (viewGrade === 8) {
        pBase = Math.round(20 * (LGS_COEFFICIENTS["TÜRKÇE"] / 2));
      }
      setParagraphCount((goalUnit === 'Test' || goalUnit === 'Deneme') ? (viewGrade === 8 ? 4 : 2) : pBase);
    }
  }, [viewGrade]);

  // Use another effect for tempo/goal unit changes to update only numbers
  useEffect(() => {
    if (skipGradeResetRef.current) return;
    if (viewGrade && CURRICULUM_DB[viewGrade]) {
      const dbSubjects = Object.keys(CURRICULUM_DB[viewGrade]);
      const initialCounts: Record<string, number> = {};
      const base = DISTRIBUTION_MODES[distLevel].questionBase;

      dbSubjects.forEach(sub => {
        let finalBase = base;
        if (viewGrade === 8) {
          const coeff = LGS_COEFFICIENTS[sub.toUpperCase()] || 2;
          finalBase = Math.round(base * (coeff / 2));
        }
        initialCounts[sub] = (goalUnit === 'Test' || goalUnit === 'Deneme') ? Math.max(1, Math.round(finalBase / 15)) : finalBase;
      });

      setSubjectQuestionCounts(initialCounts);
      
      let pBase = 20;
      if (viewGrade === 8) {
        pBase = Math.round(20 * (LGS_COEFFICIENTS["TÜRKÇE"] / 2));
      }
      setParagraphCount((goalUnit === 'Test' || goalUnit === 'Deneme') ? (viewGrade === 8 ? 4 : 2) : pBase);
    }
  }, [distLevel, goalUnit, viewGrade]);

  if (!isOpen) return null;

  const calculateTotalDailyEstimate = () => {
    let dayTotals: Record<string, number> = {};
    DAYS.forEach(d => dayTotals[d] = 0);

    const mainSubjects = ['MATEMATİK', 'TÜRKÇE', 'FEN BİLİMLERİ', 'TÜRK DİLİ VE EDEBİYATI', 'FİZİK', 'KİMYA', 'BİYOLOJİ'];
    const subSubjects = ['İNKILAP/SOSYAL', 'SOSYAL BİLGİLER', 'İNKILAP TARİHİ', 'DİN KÜLTÜRÜ', 'DİN', 'İNGİLİZCE', 'TARİH', 'COĞRAFYA'];

    selectedSubjects.forEach(subj => {
      const qCount = subjectQuestionCounts[subj] || 0;
      const activeDays = subjectDays[subj] || [];
      const subUpper = subj.toUpperCase();
      
      let minsPerQ = 1.5; // Default fallback
      if (mainSubjects.includes(subUpper)) {
        minsPerQ = 2; // Ana dersler (2 dk)
      } else if (subSubjects.some(s => subUpper.includes(s) || s.includes(subUpper))) {
        minsPerQ = 0.75; // Ara dersler (45 sn)
      }

      activeDays.forEach(day => {
        dayTotals[day] += qCount * minsPerQ;
      });
    });

    if (isParagraphEnabled) {
      DAYS.forEach(day => {
        dayTotals[day] += paragraphCount * 1.5;
      });
    }

    const totalMins = Object.values(dayTotals).reduce((a, b) => a + b, 0);
    const activeDayCount = Object.values(dayTotals).filter(v => v > 0).length || 1;
    const avgMins = totalMins / activeDayCount;

    const hrs = Math.floor(avgMins / 60);
    const mns = Math.round(avgMins % 60);
    return { hrs, mns, totalMins };
  };

  const { hrs, mns } = calculateTotalDailyEstimate();

  let totalWeeklyQ = 0;
  selectedSubjects.forEach(s => {
    const dCount = (subjectDays[s] || []).length;
    const qCount = subjectQuestionCounts[s] || 0;
    totalWeeklyQ += dCount * qCount;
  });
  if (isParagraphEnabled) {
    totalWeeklyQ += 7 * paragraphCount;
  }

  const handleRun = () => {
    const finalTopics: Record<string, TopicSelection[]> = {};
    selectedSubjects.forEach(sub => {
      const selections = selectedTopics[sub] || [];
      finalTopics[sub] = selections;
    });

    onDistribute({ 
      mode: 'manual', 
      distLevel, 
      examScores: null, 
      grade: viewGrade, 
      selectedSubjects, 
      selectedTopics: finalTopics, 
      subjectQuestionCounts, 
      subjectDays, 
      clearPrevious, 
      paragraphCount: isParagraphEnabled ? paragraphCount : 0, 
      duration: distLevel === 'SEMESTER' ? 15 : 7,
      studyMode: 'SORU',
      weeklyPlan: aiWeeklyPlan || undefined
    });
    setAiWeeklyPlan(null); // Clean up after applying
    onClose();
  };

  const gradeSubjects = Object.keys(CURRICULUM_DB[viewGrade] || {});
  const isAllSelected = selectedSubjects.length === gradeSubjects.length;

  const toggleAll = () => {
    if (isAllSelected) setSelectedSubjects([]);
    else setSelectedSubjects(gradeSubjects);
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-900/60 flex items-center justify-center p-4">
      <div 
        className="bg-white w-full max-w-6xl max-h-[95vh] rounded-3xl shadow-xl flex flex-col overflow-hidden border border-slate-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 ${theme.bg} rounded-xl flex items-center justify-center shadow-lg shadow-slate-200`}>
              <Sparkles className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none">Hızlı Program Sihirbazı</h2>
              <p className="text-xs text-slate-500 mt-1">Pratik ve etkili ders dağıtımı</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Core Settings */}
          <div className="w-full md:w-[420px] border-r border-slate-100 p-6 space-y-6 overflow-y-auto bg-slate-50/20 shrink-0">

            {/* Student Goal Profile Selector */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Öğrenci Hazırlık Hedefi</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
                {(['DESTEK', 'DENGELİ', 'DERECE'] as const).map(prof => {
                  const isSelected = targetGoalProfile === prof;
                  let colorClass = "text-slate-600 hover:text-slate-950";
                  if (isSelected) {
                    if (prof === 'DESTEK') colorClass = "bg-neutral-600 text-white shadow shadow-slate-100";
                    else if (prof === 'DENGELİ') colorClass = `${theme.bg} text-white shadow shadow-slate-200`;
                    else if (prof === 'DERECE') colorClass = "bg-zinc-800 text-white shadow shadow-zinc-200 animate-pulse";
                  }
                  
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => handleApplyProfile(prof)}
                      className={`py-1.5 text-[9px] font-black uppercase rounded-xl transition-all ${colorClass}`}
                    >
                      {prof === 'DESTEK' ? 'Temel Destek' : prof === 'DENGELİ' ? 'Dengeli' : 'Derece'}
                    </button>
                  );
                })}
              </div>
              <p className="text-[8px] text-slate-400 font-bold leading-tight uppercase">
                * Hedef seviyesi değiştiğinde ders dağılımları, soru adetleri ve sıklık seviyeleri akademik protokollere göre otomatik güncellenir.
              </p>
            </section>

            {/* Grade Selection */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Müfredat Sınıfı</label>
              <div className="grid grid-cols-4 gap-2">
                {[5,6,7,8,9,10,11].map(g => (
                  <button 
                    key={g}
                    onClick={() => {
                      userChangedGradeManuallyRef.current = true;
                      setViewGrade(g as GradeLevel);
                    }}
                    className={`px-2 py-1.5 rounded-xl text-[10px] font-bold transition-all border ${viewGrade === g ? `${theme.bg} border-transparent text-white shadow-md shadow-slate-100` : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}
                  >
                    {g === 8 ? 'LGS' : `${g}. Sınıf`}
                  </button>
                ))}
              </div>
            </section>

            {/* Goal Unit Selection / Planlama Birimi */}
            <section className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans block">Planlama Birimi ({goalUnit})</label>
              <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200">
                {(['Soru', 'Test', 'Deneme'] as const).map(unit => {
                  const isSelected = goalUnit === unit;
                  return (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => setGoalUnit?.(unit)}
                      className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-xl transition-all ${
                        isSelected 
                          ? `${theme.bg} text-white shadow-md shadow-slate-200` 
                          : 'text-slate-600 hover:text-slate-950 bg-transparent'
                      }`}
                    >
                      {unit}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Yapay Zeka & PDF Analiz Bölümü */}
            <section className="space-y-4 pb-4 border-t border-slate-100 pt-4">
              <div className="bg-gradient-to-br from-slate-50 via-slate-50/50 to-slate-100/30 border border-slate-250 rounded-2xl p-4 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900">
                    <BrainCircuit size={16} className={`${theme.textColor} animate-pulse`} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Otomatik Akıllı Planlama</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest text-white ${theme.bg} px-2 py-0.5 rounded-md`}>AI DESTEKLİ</span>
                </div>
                
                <p className="text-[10px] text-slate-500 font-medium leading-normal">
                  Karneleri, LGS deneme analiz PDF'lerini veya çalışma notlarını sisteme tanıtarak ders, konu ve soru dağılımını otomatik yapın.
                </p>

                {/* 2-Column Wide Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PDF Upload Dropzone */}
                  <div className={`relative border-2 border-dashed border-slate-250 hover:border-black hover:bg-white rounded-xl p-3 bg-white/50 transition-all flex flex-col items-center justify-center text-center gap-2 min-h-[110px] group cursor-pointer shadow-sm`}>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:text-white transition-colors duration-250`}>
                      <Upload className="text-slate-700 transition-colors" size={14} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase text-slate-900 block tracking-tight">PDF Yükle</span>
                      <span className="text-[8px] font-bold text-slate-400 block leading-tight">Karne veya Deneme Analizi</span>
                    </div>
                  </div>

                  {/* Prompt Text / Extra Notes Input */}
                  <div className="flex flex-col">
                    <textarea
                      value={aiText}
                      onChange={(e) => setAiText(e.target.value)}
                      placeholder="Buraya eklemek istediğiniz özel istekleri veya deneme netlerinizi yazabilirsiniz..."
                      className="w-full h-[110px] p-3 text-[10px] border border-slate-200 rounded-xl bg-white shadow-inner resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 placeholder-slate-400 font-semibold leading-relaxed"
                    />
                  </div>
                </div>

                {/* Extracted PDF Preview Box ("Önizleme Kutusu") */}
                {extractedPdfText && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <FileText size={12} className="text-slate-500" />
                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">PDF ÖNİZLEME KUTUSU</span>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          setExtractedPdfText("");
                          setAiText("");
                        }}
                        className="text-[8px] font-black text-rose-600 uppercase tracking-tight hover:underline flex items-center gap-0.5"
                      >
                        <X size={10} /> Kaldır
                      </button>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-[9px] p-2.5 rounded-lg overflow-y-auto max-h-24 leading-relaxed shadow-inner">
                      {extractedPdfText}
                    </div>
                    
                    <div className="text-[8px] font-bold text-emerald-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                      Metin PDF'ten başarıyla ayıklandı. Şimdi analiz et butonuna tıklayabilirsiniz.
                    </div>
                  </div>
                )}

                {/* Animated Status Indicators / Loading States */}
                {(isPdfLoading || isAiLoading) && (
                  <div className="space-y-2">
                    {isPdfLoading && (
                      <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl animate-pulse">
                        <Loader2 className="animate-spin text-black shrink-0" size={14} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-black uppercase text-slate-900 leading-none">PDF Metni Okunuyor...</div>
                          <div className="text-[8px] text-slate-600 font-bold mt-0.5">Karne içeriği ayıklanıyor.</div>
                        </div>
                      </div>
                    )}
                    {isAiLoading && (
                      <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 p-2.5 rounded-xl animate-pulse">
                        <Loader2 className="animate-spin text-black shrink-0" size={14} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] font-black uppercase text-slate-900 leading-none">Analiz Ediliyor...</div>
                          <div className="text-[8px] text-slate-600 font-bold mt-0.5">Dersler ve soru adetleri yapay zeka tarafından planlanıyor.</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Analysis Action Button */}
                <button
                  type="button"
                  onClick={handleAIParse}
                  disabled={isAiLoading || isPdfLoading || !aiText.trim()}
                  className={`w-full flex items-center justify-center gap-1.5 py-3 px-4 ${theme.bg} ${theme.hoverBg} text-white rounded-xl text-[10px] font-black uppercase tracking-wider disabled:opacity-40 disabled:hover:${theme.bg} transition-all shadow-md shadow-slate-101`}
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={14} />
                      Analiz Ediliyor...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Yapay Zeka İle Analiz Et
                    </>
                  )}
                </button>
              </div>

              {/* Real-time statistics card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-3.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">ÖZET PROGRAM VERİLERİ</span>
                
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase block tracking-tight">Haftalık Hedef</span>
                  <span className="text-sm font-black text-slate-900 mt-1 block">{totalWeeklyQ} {goalUnit}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Curriculum Topic Selection */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-white shrink-0">
            <header className="border-b border-slate-150 pb-4 font-sans space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-3">
                  <BookOpen size={18} className="text-black animate-pulse" />
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest font-sans">
                    ÇALIŞMA PLANLAYICISI DETAYLARI
                  </h3>
                </div>
                <button 
                  onClick={toggleAll}
                  className="text-[10px] font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors uppercase tracking-tighter border border-slate-200 font-sans"
                >
                  {isAllSelected ? "Tümünü Kaldır" : "Tüm Dersleri Seç"}
                </button>
              </div>
            </header>

            <div className="space-y-6 pb-4">
              {/* Special Row: Paragraph */}
              <div className={`rounded-2xl border-2 transition-all overflow-hidden ${isParagraphEnabled ? 'border-emerald-200 bg-emerald-50/20 shadow-sm' : 'border-slate-50 opacity-40 grayscale'}`}>
                <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex items-center gap-3 min-w-[160px]">
                    <button 
                      onClick={() => setIsParagraphEnabled(!isParagraphEnabled)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isParagraphEnabled ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200'}`}
                    >
                      {isParagraphEnabled && <Check size={14} strokeWidth={4} />}
                    </button>
                    <div className="flex flex-col">
                      <span className={`text-sm font-black uppercase transition-colors ${isParagraphEnabled ? 'text-emerald-900' : 'text-slate-400'}`}>PARAGRAF RUTİNİ</span>
                      <span className="text-[9px] font-bold text-emerald-600 uppercase">Her Gün Uygulanır</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-emerald-100 min-w-[140px]">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase leading-none">GÜNLÜK ADET</span>
                    <input 
                      type="number"
                      value={paragraphCount}
                      onChange={(e) => setParagraphCount(Number(e.target.value))}
                      className="w-16 bg-emerald-50/50 border border-emerald-100 rounded-lg p-1 text-center text-xs font-black text-emerald-700 outline-none focus:ring-2 ring-emerald-100"
                    />
                    <span className="text-[10px] font-bold text-emerald-400">{goalUnit}</span>
                  </div>

                  <div className="flex-1 text-right">
                    <span className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-1 rounded-full border border-emerald-100 shadow-sm">
                      ZİHİN AÇICI & ODAKLANMA
                    </span>
                  </div>
                </div>
              </div>

              {gradeSubjects.map(subj => {
                const isSelected = selectedSubjects.includes(subj);
                const topics = selectedTopics[subj] || [];
                
                return (
                  <div key={subj} className={`rounded-2xl border-2 transition-all overflow-hidden ${isSelected ? `${theme.key === 'neutral' ? 'border-black' : theme.borderColor} bg-white shadow-md` : 'border-slate-50 opacity-40'}`}>
                    <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4 bg-white border-b border-slate-50">
                      {/* Subject Selection */}
                      <div className="flex items-center gap-3 min-w-[170px]">
                        <button 
                          onClick={() => {
                            if (isSelected) setSelectedSubjects(selectedSubjects.filter(s => s !== subj));
                            else setSelectedSubjects([...selectedSubjects, subj]);
                          }}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? `${theme.bg} ${theme.key === 'neutral' ? 'border-black' : 'border-transparent'} text-white` : 'bg-white border-slate-200'}`}
                        >
                          {isSelected && <Check size={14} strokeWidth={4} />}
                        </button>
                        <span className={`text-base font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>{subj}</span>
                      </div>

                      {/* Daily Question Count */}
                      <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100 min-w-[130px]">
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-slate-500 uppercase leading-none mb-1">GÜNLÜK HEDEF</span>
                           <div className="flex items-center gap-1">
                             <input 
                               type="number"
                               value={subjectQuestionCounts[subj] || 0}
                               onChange={(e) => setSubjectQuestionCounts({...subjectQuestionCounts, [subj]: Math.max(0, Number(e.target.value))})}
                               className="w-14 bg-white border border-slate-200 rounded-lg p-1 text-center text-xs font-black text-black outline-none focus:ring-2 ring-slate-100 font-sans"
                             />
                             <span className="text-[10px] font-bold text-slate-400">{goalUnit}</span>
                           </div>
                        </div>
                      </div>

                      {/* Day Selection */}
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-1 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {DAYS.map((d, i) => {
                            const isDayOn = (subjectDays[subj] || []).includes(d);
                            const dayShort = ["PTESİ", "SALI", "ÇARŞ", "PERŞ", "CUMA", "CMTESİ", "PAZAR"][i];
                            return (
                              <button 
                                key={d}
                                onClick={() => {
                                  if (!isSelected) return;
                                  const cur = subjectDays[subj] || [];
                                  setSubjectDays({...subjectDays, [subj]: isDayOn ? cur.filter(x => x !== d) : [...cur, d]});
                                }}
                                className={`px-2 h-8 rounded-lg text-[10px] font-black border transition-all ${isDayOn ? `${theme.bg} ${theme.key === 'neutral' ? 'border-black' : 'border-transparent'} text-white shadow-sm` : 'bg-white border-slate-200 text-slate-300'}`}
                                disabled={!isSelected}
                              >
                                {dayShort}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                      {/* Topic Grid (Visible by default if selected) */}
                    {isSelected && (
                      <div className="p-4 bg-slate-50/30">
                        <div className="flex items-center justify-between mb-3 px-1 gap-4">
                          <div className="flex items-center gap-2 flex-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Çalışılacak Konular</label>
                            <div className="flex-1 flex gap-1 items-center max-w-xs">
                              <input 
                                type="text"
                                placeholder="Elle konu ekle..."
                                value={customTopicInputs[subj] || ""}
                                onChange={(e) => setCustomTopicInputs({...customTopicInputs, [subj]: e.target.value})}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const val = customTopicInputs[subj]?.trim();
                                    if (val) {
                                      const cur = topics;
                                      if (!cur.some(t => t.name === val)) {
                                         setSelectedTopics({...selectedTopics, [subj]: [...cur, { name: val, mode: 'question', subTopics: [] }]});
                                      }
                                      setCustomTopicInputs({...customTopicInputs, [subj]: ""});
                                    }
                                  }
                                }}
                                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[10px] font-bold outline-none focus:ring-2 ring-slate-100 focus:border-slate-400 transition-all"
                              />
                              <button 
                                onClick={() => {
                                  const val = customTopicInputs[subj]?.trim();
                                  if (!val) return;
                                  const cur = topics;
                                  if (!cur.some(t => t.name === val)) {
                                     setSelectedTopics({...selectedTopics, [subj]: [...cur, { name: val, mode: 'question', subTopics: [] }]});
                                  }
                                  setCustomTopicInputs({...customTopicInputs, [subj]: ""});
                                }}
                                className={`${theme.bg} ${theme.hoverBg} text-white p-1.5 rounded-lg transition-colors`}
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-900 px-2 py-0.5 bg-slate-100 rounded-full border border-slate-200">
                            {topics.length > 0 ? `${topics.length} SEÇİLDİ` : "YALNIZCA SORU HEDEFİ"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                          {(() => {
                            const dbTopics = [...(CURRICULUM_DB[viewGrade]?.[subj] || []), "Branş Deneme"];
                            const combined = Array.from(new Set([...dbTopics, ...topics.map(t => t.name)]));
                            const searchTerm = topicSearch.toLowerCase();
                            
                            return combined
                              .filter(t => !searchTerm || t.toLowerCase().includes(searchTerm))
                              .map(topicName => {
                                const isTopicOn = topics.some(t => t.name === topicName);
                                return (
                                  <button 
                                    key={topicName}
                                    onClick={() => {
                                      if (isTopicOn) setSelectedTopics({...selectedTopics, [subj]: topics.filter(t => t.name !== topicName)});
                                      else setSelectedTopics({...selectedTopics, [subj]: [...topics, { name: topicName, mode: 'question', subTopics: [] }]});
                                    }}
                                    className={`text-left p-2 rounded-xl text-[10px] font-bold flex items-center justify-between group transition-all border ${isTopicOn ? `bg-white ${theme.key === 'neutral' ? 'border-black text-black' : `${theme.borderColor} ${theme.textColor}`} shadow-md ring-2 ring-slate-100` : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'}`}
                                  >
                                    <span className="flex-1 pr-1 uppercase break-words leading-tight">{topicName}</span>
                                    {isTopicOn ? <CheckCircle2 size={12} className="shrink-0" /> : <Plus size={12} className="opacity-30 group-hover:opacity-100 shrink-0" />}
                                  </button>
                                );
                              });
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seçilen Ders</span>
              <span className="text-xl font-black text-slate-900 leading-tight">{selectedSubjects.length}</span>
            </div>
            
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <button 
              onClick={() => setClearPrevious(!clearPrevious)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${!clearPrevious ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-200 border-slate-300 text-slate-500'}`}
            >
              <Layers size={14} />
              {!clearPrevious ? 'PROGRAMA EKLE' : 'YENI PROGRAM YAP'}
            </button>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-400 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all font-sans"
            >
              Vazgeç
            </button>
            <button 
              onClick={handleRun}
              disabled={selectedSubjects.length === 0 || isDistributing}
              className={`flex-1 sm:px-12 py-3 ${theme.bg} ${theme.hoverBg} text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-colors disabled:opacity-30 flex items-center justify-center gap-2 font-sans`}
            >
              {isDistributing ? <><Loader2 size={16} className="animate-spin" /> İŞLENİYOR...</> : "Planı Hazırla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
