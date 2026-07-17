
import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Camera, Sparkles, Trash2, Calendar, Plus, Edit2, X, Printer, Download, Check, FileText, BrainCircuit, Loader2, Upload, RefreshCw } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

import { DistributionWizard } from './DistributionWizard';
import { CURRICULUM_DB, MOTIVATION_QUOTES } from '../constants';
import { GradeLevel, DistributeParams, ScheduleM4, ScheduleItemM4, THEME_PRESETS, ThemePreset } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Module4Props {
  studentName: string;
  setStudentName: (name: string) => void;
  logo: string | null;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  schedule: ScheduleM4;
  setM4Schedule: (schedule: ScheduleM4) => void;
  accentTheme?: string;
}

export default function Module4({ 
  studentName, setStudentName, logo, onLogoUpload, schedule, setM4Schedule, accentTheme 
}: Module4Props) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [motivationQuote, setMotivationQuote] = useState('');

  useEffect(() => {
    if (MOTIVATION_QUOTES && MOTIVATION_QUOTES.length > 0) {
      const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      setMotivationQuote(MOTIVATION_QUOTES[randomIndex]);
    }
  }, []);

  const handleNewQuote = () => {
    if (MOTIVATION_QUOTES && MOTIVATION_QUOTES.length > 0) {
      const currentIndex = MOTIVATION_QUOTES.indexOf(motivationQuote);
      let nextIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      if (nextIndex === currentIndex && MOTIVATION_QUOTES.length > 1) {
        nextIndex = (nextIndex + 1) % MOTIVATION_QUOTES.length;
      }
      setMotivationQuote(MOTIVATION_QUOTES[nextIndex]);
    }
  };
  const [grade, setGrade] = useState<GradeLevel>(8);
  const [goalUnit, setGoalUnit] = useState<'Soru' | 'Test' | 'Deneme'>('Soru');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]); 
  const [editingCell, setEditingCell] = useState<{key: string, subject: string, dayIdx: number} | null>(null);
  const [editingDay, setEditingDay] = useState<{dayIdx: number, dayName: string} | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // V2 Analysis Scorecard & Simulator States
  const [showV2Dashboard, setShowV2Dashboard] = useState(true);
  const [schoolName, setSchoolName] = useState("ÖZEL İBRAHİM ARI ORTAOKULU");
  const [classGroup, setClassGroup] = useState("8-F2");
  
  // Student baseline study nets from report card
  const [v2Nets, setV2Nets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_nets');
      return saved ? JSON.parse(saved) : {
        TRK: 17.41,
        MAT: 15.87,
        FEN: 16.76,
        INK: 9.33,
        DIN: 9.13,
        ING: 9.03
      };
    } catch {
      return {
        TRK: 17.41,
        MAT: 15.87,
        FEN: 16.76,
        INK: 9.33,
        DIN: 9.13,
        ING: 9.03
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('lgs_v2_nets', JSON.stringify(v2Nets));
  }, [v2Nets]);

  const [v2TargetNets, setV2TargetNets] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_target_nets');
      return saved ? JSON.parse(saved) : {
        TRK: 19.00,
        MAT: 18.00,
        FEN: 18.50,
        INK: 10.00,
        DIN: 10.00,
        ING: 10.00
      };
    } catch {
      return {
        TRK: 19.00,
        MAT: 18.00,
        FEN: 18.50,
        INK: 10.00,
        DIN: 10.00,
        ING: 10.00
      };
    }
  });

  useEffect(() => {
    localStorage.setItem('lgs_v2_target_nets', JSON.stringify(v2TargetNets));
  }, [v2TargetNets]);

  const [levelCompletion, setLevelCompletion] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_level_completion');
      return saved ? JSON.parse(saved) : { level1: false, level2: false };
    } catch {
      return { level1: false, level2: false };
    }
  });

  const [v2Checklist, setV2Checklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_checklist_tasks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [v2Tasks1, setV2Tasks1] = useState<{key: string, txt: string, gain: string}[]>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_tasks_1');
      return saved ? JSON.parse(saved) : [
        { key: 't1', txt: 'MATEMATİK: Üslü İfadeler / Çarpanlar ve Katlar', gain: '+1.63 Net' },
        { key: 't2', txt: 'FEN BİLİMLERİ: Enerji Piramidi / Sıvı Basıncı', gain: '+1.74 Net' },
        { key: 't3', txt: 'TÜRKÇE: Paragrafta Yapı ve Anlam Rutinleri', gain: '+1.09 Net' }
      ];
    } catch {
      return [
        { key: 't1', txt: 'MATEMATİK: Üslü İfadeler / Çarpanlar ve Katlar', gain: '+1.63 Net' },
        { key: 't2', txt: 'FEN BİLİMLERİ: Enerji Piramidi / Sıvı Basıncı', gain: '+1.74 Net' },
        { key: 't3', txt: 'TÜRKÇE: Paragrafta Yapı ve Anlam Rutinleri', gain: '+1.09 Net' }
      ];
    }
  });

  const [v2Tasks2, setV2Tasks2] = useState<{key: string, txt: string, gain: string}[]>(() => {
    try {
      const saved = localStorage.getItem('lgs_v2_tasks_2');
      return saved ? JSON.parse(saved) : [
        { key: 't4', txt: 'MATEMATİK: Ebob - Ekok Yeni Nesil Soru Çözün', gain: '+1.13 Net' },
        { key: 't5', txt: 'FEN BİLİMLERİ: Kalıtım / Basit Makineler Özet', gain: '+0.90 Net' },
        { key: 't6', txt: 'İNKILAP / DİN: 20 Yüzyıl Osmanlı & Kader İnancı', gain: '+1.54 Net' }
      ];
    } catch {
      return [
        { key: 't4', txt: 'MATEMATİK: Ebob - Ekok Yeni Nesil Soru Çözün', gain: '+1.13 Net' },
        { key: 't5', txt: 'FEN BİLİMLERİ: Kalıtım / Basit Makineler Özet', gain: '+0.90 Net' },
        { key: 't6', txt: 'İNKILAP / DİN: 20 Yüzyıl Osmanlı & Kader İnancı', gain: '+1.54 Net' }
      ];
    }
  });

  useEffect(() => {
    localStorage.setItem('lgs_v2_tasks_1', JSON.stringify(v2Tasks1));
  }, [v2Tasks1]);

  useEffect(() => {
    localStorage.setItem('lgs_v2_tasks_2', JSON.stringify(v2Tasks2));
  }, [v2Tasks2]);

  const calculateScientificEvaluation = () => {
    let validityScore = 0;
    const checks: { label: string; ok: boolean; desc: string }[] = [];

    const programmedDays: Record<string, Set<string>> = {
      "TÜRKÇE": new Set(),
      "MATEMATİK": new Set(),
      "FEN BİLİMLERİ": new Set()
    };

    let totalPlannedCount = 0;
    let plannedTopics: string[] = [];

    Object.keys(schedule).forEach(cellKey => {
      const parts = cellKey.split('_');
      if (parts.length >= 2) {
        const subject = parts[0];
        const day = parts[1];
        const items = schedule[cellKey] || [];
        if (items.length > 0) {
          if (programmedDays[subject]) {
            programmedDays[subject].add(day);
          }
          items.forEach(itm => {
            const num = parseInt(itm.count);
            if (!isNaN(num)) {
              totalPlannedCount += num;
            } else {
              totalPlannedCount += 20;
            }
            if (itm.topic) {
              plannedTopics.push(itm.topic.toUpperCase());
            }
          });
        }
      }
    });

    const matDays = programmedDays["MATEMATİK"].size;
    const fenDays = programmedDays["FEN BİLİMLERİ"].size;
    const trkDays = programmedDays["TÜRKÇE"].size;

    const matOk = matDays >= 2;
    checks.push({
      label: "Matematik Frekans Dengesi (Validasyon)",
      ok: matOk,
      desc: matOk 
        ? "Matematik dersi haftalık plana dengeli yayılmış (Kritik sıklık sağlandı)." 
        : "Matematik dersi haftada en az 2 farklı güne planlanmalıdır."
    });
    if (matOk) validityScore += 25;

    const scienceAndTrkOk = fenDays >= 2 && trkDays >= 2;
    checks.push({
      label: "Sözel & Sayısal Başat Dağılım Tutarlılığı",
      ok: scienceAndTrkOk,
      desc: scienceAndTrkOk
        ? "Türkçe ve Fen dersleri haftalık planda kritik sıklık eşiğini (en az 2 gün) aşmış."
        : "Türkçe ve Fen dersleri haftada en az 2 gün planda bulunmalıdır."
    });
    if (scienceAndTrkOk) validityScore += 25;

    let totalTargetGap = 0;
    Object.keys(v2TargetNets).forEach(key => {
      totalTargetGap += Math.max(0, (v2TargetNets[key] || 0) - (v2Nets[key] || 0));
    });
    const minRequiredVolume = Math.ceil(totalTargetGap * 100);
    const volumeOk = totalPlannedCount >= Math.max(150, Math.min(600, minRequiredVolume));
    checks.push({
      label: "Hacim & Hedef Güvenilirliği (Reliability)",
      ok: volumeOk,
      desc: volumeOk
        ? `Toplam planlanan soru hacmi (${totalPlannedCount} adet) net hedefleri destekler nitelikte.`
        : `Net hedeflere ulaşmak için planda daha fazla soru olmalıdır (Min: ${Math.max(150, minRequiredVolume)} soru).`
    });
    if (volumeOk) validityScore += 25;

    let matchedTopicCount = 0;
    const allPrescribedTopics = [...v2Tasks1, ...v2Tasks2];
    allPrescribedTopics.forEach(t => {
      const labelParts = t.txt.split(':');
      const topicLabel = (labelParts[1] || t.txt).toUpperCase();
      const words = topicLabel.replace(/[^\w\sğüşöçıİĞÜŞÖÇ]/g, '').split(' ');
      const matched = plannedTopics.some(pt => {
        return words.some(w => w.length > 2 && pt.includes(w));
      });
      if (matched) {
        matchedTopicCount++;
      }
    });

    const syncOk = matchedTopicCount >= 1 || allPrescribedTopics.length === 0;
    checks.push({
      label: "Kritik Kazanım Senkronizasyonu",
      ok: syncOk,
      desc: syncOk
        ? "Reçetedeki zayıf konular programa başarıyla yansıtılmış."
        : "Reçetedeki zayıf konulardan en az birini haftalık planda bir güne eklemelisiniz."
    });
    if (syncOk) validityScore += 25;

    return {
      invalidityProportion: 100 - validityScore,
      validityScore,
      checks,
      totalPlannedCount
    };
  };

  const handleLevelCompletionChange = (lvl: string, checked: boolean) => {
    const updated = { ...levelCompletion, [lvl]: checked };
    setLevelCompletion(updated);
    localStorage.setItem('lgs_v2_level_completion', JSON.stringify(updated));

    // Update Simulated nets based on level completion
    if (lvl === 'level1') {
      setV2Nets(prev => ({
        ...prev,
        // Level 1: Focuses on TRK, MAT, FEN critical gaps
        TRK: checked ? 18.50 : 17.41,
        MAT: checked ? 17.50 : 15.87,
        FEN: checked ? 18.50 : 16.76,
      }));
    } else if (lvl === 'level2') {
      setV2Nets(prev => ({
        ...prev,
        // Level 2: Fine-tuning all subjects
        INK: checked ? 10.00 : 9.33,
        DIN: checked ? 10.00 : 9.13,
        ING: checked ? 10.00 : 9.03,
        MAT: checked ? (levelCompletion.level1 ? 19.00 : 17.50) : (levelCompletion.level1 ? 17.50 : 15.87)
      }));
    }
  };

  const handleTaskCheckChange = (taskKey: string, checked: boolean) => {
    const updated = { ...v2Checklist, [taskKey]: checked };
    setV2Checklist(updated);
    localStorage.setItem('lgs_v2_checklist_tasks', JSON.stringify(updated));
  };
  
  
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  const days = React.useMemo(() => {
    const daysArr = [];
    const start = new Date(startDate); 
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
      const dayName = d.toLocaleDateString('tr-TR', { weekday: 'long' }).toUpperCase();
      const isWeekend = d.getDay() === 0 || d.getDay() === 6;
      daysArr.push({ full: dayName, key: i, date: dateStr, isWeekend });
    }
    return daysArr;
  }, [startDate]);

  const activeRows = React.useMemo(() => {
    let rows: Set<string> = new Set();
    
    Object.keys(CURRICULUM_DB[grade] || {}).forEach(s => rows.add(s.toUpperCase()));
    
    Object.keys(schedule).forEach(key => {
      const subj = key.split('_')[0];
      if (subj) rows.add(subj.toUpperCase());
    });

    rows.add("PARAGRAF");
    
    return Array.from(rows);
  }, [grade, schedule]);

  const dailyStatsList = React.useMemo(() => {
    return days.map(day => {
      let totalQuestions = 0;
      let totalMinutes = 0;

      const mainSubjects = ['MATEMATİK', 'TÜRKÇE', 'FEN BİLİMLERİ', 'TÜRK DİLİ VE EDEBİYATI', 'FİZİK', 'KİMYA', 'BİYOLOJİ'];

      activeRows.forEach(subj => {
        const item = schedule[`${subj}_${day.key}`]?.[0];
        if (item && item.count) {
          const num = parseInt(item.count.replace(/[^0-9]/g, '')) || 0;
          totalQuestions += num;

          const subUpper = subj.toUpperCase();
          let perQuestionTime = 1.5;

          const subSubjects = ['İNKILAP/SOSYAL', 'SOSYAL BİLGİLER', 'İNKILAP TARİHİ', 'DİN', 'İNGİLİZCE', 'TARİH', 'COĞRAFYA'];
          if (mainSubjects.includes(subUpper)) {
            perQuestionTime = 2;
          } else if (subSubjects.some(s => subUpper.includes(s) || s.includes(subUpper))) {
            perQuestionTime = 0.75;
          }

          if (!item.count.toLowerCase().includes("soru") && !item.count.toLowerCase().includes("test") && !item.count.toLowerCase().includes("deneme")) {
             totalMinutes += 40;
          } else {
             const isTest = item.count.toLowerCase().includes("test");
             const isDeneme = item.count.toLowerCase().includes("deneme");
             const multiplier = isDeneme ? 20 : (isTest ? 15 : 1);
             const unitTime = perQuestionTime * multiplier;
             totalMinutes += num * unitTime;
          }
        }
      });

      const hours = Math.floor(totalMinutes / 60);
      const mins = Math.floor(totalMinutes % 60);

      return { totalQuestions, hours, mins, totalMinutes };
    });
  }, [days, activeRows, schedule, goalUnit]);

  const theme = THEME_PRESETS[accentTheme || 'neutral'] || THEME_PRESETS.neutral;

  const subjectStats = React.useMemo(() => {
    const stats: Record<string, { totalQuestions: number, totalMinutes: number, hours: number }> = {};
    const mainSubjects = ['MATEMATİK', 'TÜRKÇE', 'FEN BİLİMLERİ', 'TÜRK DİLİ VE EDEBİYATI', 'FİZİK', 'KİMYA', 'BİYOLOJİ'];
    const subSubjects = ['İNKILAP/SOSYAL', 'SOSYAL BİLGİLER', 'İNKILAP TARİHİ', 'DİN', 'İNGİLİZCE', 'TARİH', 'COĞRAFYA'];

    activeRows.forEach(subj => {
      let totalQuestions = 0;
      let totalMinutes = 0;

      days.forEach(day => {
        const items = schedule[`${subj}_${day.key}`] || [];
        items.forEach(item => {
          if (item && item.count) {
            const num = parseInt(item.count.replace(/[^0-9]/g, '')) || 0;
            totalQuestions += num;

            const subUpper = subj.toUpperCase();
            let perQuestionTime = 1.5;

            if (mainSubjects.includes(subUpper)) {
              perQuestionTime = 2;
            } else if (subSubjects.some(s => subUpper.includes(s) || s.includes(subUpper))) {
              perQuestionTime = 0.75;
            }

            if (!item.count.toLowerCase().includes("soru") && !item.count.toLowerCase().includes("test") && !item.count.toLowerCase().includes("deneme")) {
               totalMinutes += 40;
            } else {
               const isTest = item.count.toLowerCase().includes("test");
               const isDeneme = item.count.toLowerCase().includes("deneme");
               const multiplier = isDeneme ? 20 : (isTest ? 15 : 1);
               const unitTime = perQuestionTime * multiplier;
               totalMinutes += num * unitTime;
            }
          }
        });
      });

      const hours = parseFloat((totalMinutes / 60).toFixed(1));
      if (totalQuestions > 0 || totalMinutes > 0) {
        stats[subj] = { totalQuestions, totalMinutes, hours };
      }
    });

    return Object.entries(stats).map(([subject, data]) => ({
      subject: subject.toUpperCase(),
      hours: data.hours,
      questions: data.totalQuestions,
    })).filter(item => item.hours > 0 || item.questions > 0);
  }, [days, activeRows, schedule]);

  const handleNetsParsed = (
    parsedNets: Record<string, number>, 
    pName?: string, 
    pSchoolName?: string, 
    pClassGroup?: string,
    pTasks1?: {key: string, txt: string, gain: string}[],
    pTasks2?: {key: string, txt: string, gain: string}[]
  ) => {
    if (parsedNets && Object.keys(parsedNets).length > 0) {
      setV2Nets(parsedNets);
      localStorage.setItem('lgs_v2_nets', JSON.stringify(parsedNets));
      
      // Auto upgrade targets to be slightly higher than parsed nets
      const updatedTargets = { ...v2TargetNets };
      Object.keys(parsedNets).forEach(key => {
        const itemMax = (['TRK', 'MAT', 'FEN'].includes(key)) ? 20 : 10;
        updatedTargets[key] = Math.min(itemMax, Number((parsedNets[key] + 1.5).toFixed(2)));
      });
      setV2TargetNets(updatedTargets);
      localStorage.setItem('lgs_v2_target_nets', JSON.stringify(updatedTargets));
    }
    if (pName) {
      setStudentName(pName);
    }
    if (pSchoolName) {
      setSchoolName(pSchoolName);
    }
    if (pClassGroup) {
      setClassGroup(pClassGroup);
    }
    if (pTasks1 && pTasks1.length > 0) {
      setV2Tasks1(pTasks1);
      localStorage.setItem('lgs_v2_tasks_1', JSON.stringify(pTasks1));
    }
    if (pTasks2 && pTasks2.length > 0) {
      setV2Tasks2(pTasks2);
      localStorage.setItem('lgs_v2_tasks_2', JSON.stringify(pTasks2));
    }
  };

  const handleSmartDistribute = (params: DistributeParams) => {
    setGrade(params.grade);
    
    // Check if a structured AI weekly plan exists
    if (params.weeklyPlan && params.weeklyPlan.length > 0) {
      const cleanSchedule: ScheduleM4 = params.clearPrevious ? {} : { ...schedule };
      
      // Clear all existing entries for the days we are going to write (or clear all if clearPrevious is true)
      if (!params.clearPrevious) {
        // If we don't clear everything, we can clear only the cell keys that have matching subjects in curriculum
        const curriculumSubjects = Object.keys(CURRICULUM_DB[params.grade] || {}).map(s => s.toUpperCase());
        curriculumSubjects.push("PARAGRAF");
        curriculumSubjects.forEach(subjUpper => {
          days.forEach(day => {
            delete cleanSchedule[`${subjUpper}_${day.key}`];
          });
        });
      }

      params.weeklyPlan.forEach(item => {
        const itemDayUpper = item.day.toUpperCase();
        const matchedDay = days.find(d => {
          const dFullUpper = d.full.toUpperCase();
          return dFullUpper === itemDayUpper || dFullUpper.includes(itemDayUpper) || itemDayUpper.includes(dFullUpper);
        });
        
        if (matchedDay) {
          const dayIdx = matchedDay.key;
          const rowKey = item.subject.toUpperCase();
          const cellKey = `${rowKey}_${dayIdx}`;
          
          if (!cleanSchedule[cellKey]) {
            cleanSchedule[cellKey] = [];
          }
          
          // Make sure the action name matches standard/nice display casing or uppercase
          let displayAction = item.action;
          if (displayAction.toUpperCase() === "PARAGRAF") displayAction = "PARAGRAF";
          
          // Synchronize counts with params.subjectQuestionCounts or params.paragraphCount
          let finalCount = item.count;
          let baseCount = 30; // default fallback
          
          if (rowKey === "PARAGRAF") {
            baseCount = params.paragraphCount || 20;
            finalCount = `${baseCount} ${goalUnit.toUpperCase()}`;
          } else {
            const matchedSubjKey = Object.keys(params.subjectQuestionCounts || {}).find(k => k.toUpperCase() === rowKey) || rowKey;
            baseCount = params.subjectQuestionCounts?.[matchedSubjKey] !== undefined ? params.subjectQuestionCounts[matchedSubjKey] : 30;
            finalCount = `${baseCount} ${goalUnit.toUpperCase()}`;
          }

          // Rewrite references to numbers inside topic text to match baseCount
          let updatedTopic = item.topic;
          if (rowKey === "PARAGRAF") {
            if (!updatedTopic || updatedTopic.toUpperCase().includes("RUTİN") || updatedTopic.toUpperCase().includes("RUTIN") || updatedTopic.toUpperCase().includes("GÜNLÜK")) {
              updatedTopic = "PARAGRAF ÇÖZÜMÜ";
            }
          } else {
            updatedTopic = updatedTopic.replace(/\b\d+(\s*(soru|test|deneme|Soru|Test|Deneme))\b/gi, `${baseCount}$1`);
          }
          
          cleanSchedule[cellKey].push({
            id: Math.random().toString(36).substr(2, 9),
            topic: updatedTopic,
            action: displayAction,
            count: finalCount,
            source: 'wizard-ai'
          });
        }
      });
      
      setM4Schedule(cleanSchedule);
      setIsWizardOpen(false);
      return;
    }

    const newSchedule: ScheduleM4 = params.clearPrevious ? {} : { ...schedule };
    
    // If not clearing previous, we should at least clear the subjects that are in the 
    // current grade's curriculum or currently active but are NOT selected in the wizard, 
    // to respect the "turned off" state.
    if (!params.clearPrevious) {
      const selectedSubjUpper = params.selectedSubjects.map(s => s.toUpperCase());
      const allPossibleSubjects = new Set([
        ...Object.keys(CURRICULUM_DB[params.grade] || {}).map(s => s.toUpperCase()),
        ...activeRows.map(s => s.toUpperCase())
      ]);
      
      allPossibleSubjects.forEach(subjUpper => {
        if (subjUpper !== "PARAGRAF" && !selectedSubjUpper.includes(subjUpper)) {
          days.forEach(day => {
            delete newSchedule[`${subjUpper}_${day.key}`];
          });
        }
      });
      // Also handle Paragraf row
      if (params.paragraphCount === 0) {
        days.forEach(day => {
          delete newSchedule[`PARAGRAF_${day.key}`];
        });
      }
    }

    let paragrafBaseCount = params.paragraphCount || 20; // default if not set

    params.selectedSubjects.forEach(subj => {
      const rowKey = subj.toUpperCase();
      const wizardTopics = params.selectedTopics[subj] || [];
      
      let topics = wizardTopics;
      if (wizardTopics.length === 0) {
        topics = [{ name: "", mode: 'question' as const }];
      }
      
      if (topics.length === 0) return; // Skip if all topics were moved to paragraph
      
      const wizardDays = params.subjectDays[subj] || [];
      
      // Identify valid days for this subject
      const targetDayIndices = days.filter(d => 
        wizardDays.some(wd => wd.toUpperCase() === d.full)
      ).map(d => d.key);
      
      if (targetDayIndices.length === 0) return;

      const totalSlots = targetDayIndices.length;

      targetDayIndices.forEach((dayIdx, i) => {
          const cellKey = `${rowKey}_${dayIdx}`;
          
          let topicsForThisDay: typeof topics = [];
          
          if (topics.length <= totalSlots) {
             // If fewer topics than slots, cycle through topics
             topicsForThisDay = [topics[i % topics.length]];
          } else {
             // If more topics than slots, divide them evenly among slots
             const start = Math.floor(i * topics.length / totalSlots);
             const end = Math.floor((i + 1) * topics.length / totalSlots);
             topicsForThisDay = topics.slice(start, end);
          }
          
          if (topicsForThisDay.length === 0) return;

          // Combine topics into one string, including sub-topics
          const combinedTopicName = topicsForThisDay.map(t => {
            let name = t.name;
            if (t.subTopics && t.subTopics.length > 0) {
              name += `\n(${t.subTopics.join(', ')})`;
            }
            return name;
          }).join('\n+ ');

          // Determine the action based on the mix of modes
          const modes = topicsForThisDay.map(t => t.mode);
          let finalAction = "SORU ÇÖZÜMÜ";
          if (modes.some(m => m === 'both')) finalAction = "KONU + SORU";
          else if (modes.some(m => m === 'topic') && modes.some(m => m === 'question')) finalAction = "KONU + SORU";
          else if (modes.every(m => m === 'topic')) finalAction = "KONU TEKRARI";
          else if (modes.every(m => m === 'question')) finalAction = "SORU ÇÖZÜMÜ";
          else finalAction = "KONU + SORU";

          // Calculate total count
          const baseCount = params.subjectQuestionCounts[subj] || 30;
          const totalCount = baseCount; // Fixed: Use base count directly, do not multiply by topics length

          newSchedule[cellKey] = [{
            id: Math.random().toString(36).substr(2, 9),
            topic: combinedTopicName,
            action: finalAction,
            count: `${totalCount} ${goalUnit.toUpperCase()}`,
            source: 'wizard'
          }];
      });
    });

    if (params.paragraphCount > 0) {
      days.forEach((_, idx) => {
        newSchedule[`PARAGRAF_${idx}`] = [{
          id: "prg_" + idx,
          topic: "PARAGRAF ÇÖZÜMÜ",
          action: "PARAGRAF",
          count: `${paragrafBaseCount} ${goalUnit.toUpperCase()}`,
          source: 'wizard'
        }];
      });
    }

    setM4Schedule(newSchedule);
    setIsWizardOpen(false);
  };

  const handleManualCellUpdate = (cellKey: string, data: Partial<ScheduleItemM4>) => {
    const parts = cellKey.split('_');
    const subj = parts[0];
    const newSchedule = { ...schedule };

    if (data.topic !== undefined && subj) {
      // Sync the topic to ALL existing days for this subject
      Object.keys(newSchedule).forEach(key => {
        if (key.startsWith(`${subj}_`)) {
          const items = newSchedule[key] || [];
          if (items.length > 0) {
            newSchedule[key] = [{ ...items[0], topic: data.topic || "" }];
          }
        }
      });
    }

    const existing = newSchedule[cellKey] || [];
    const newItem = existing.length > 0 ? { ...existing[0], ...data } : {
      id: Math.random().toString(36).substr(2, 9),
      topic: data.topic || "Konu Başlığı",
      action: data.action || "SORU ÇÖZ",
      count: data.count || `30 ${goalUnit.toUpperCase()}`,
      source: 'manual'
    };
    newSchedule[cellKey] = [newItem];
    setM4Schedule(newSchedule);
  };

  const handleDayAction = (action: 'TRIAL' | 'CLEAR') => {
    if (!editingDay) return;
    
    const newSchedule = { ...schedule };
    const dayIdx = editingDay.dayIdx;
    
    // First, clear all entries for this day
    activeRows.forEach(subj => {
      const cellKey = `${subj}_${dayIdx}`;
      delete newSchedule[cellKey];
    });

    if (action === 'TRIAL') {
      // Set all subjects to Trial Exam
      activeRows.forEach(subj => {
        const cellKey = `${subj}_${dayIdx}`;
        newSchedule[cellKey] = [{
          id: Math.random().toString(36).substr(2, 9),
          topic: "GENEL DENEME PROVASI",
          action: "DENEME SINAVI",
          count: "1 ADET",
          source: 'manual-day'
        }];
      });
    }

    setM4Schedule(newSchedule);
    setEditingDay(null);
  };

  const handleShiftIncompletes = () => {
    const newSchedule = { ...schedule };
    const incompleteTasks: ScheduleItemM4[] = [];
    
    // 1. Collect all incomplete tasks from weekdays (0-4)
    [0, 1, 2, 3, 4].forEach(dayIdx => {
      activeRows.forEach(subj => {
        const cellKey = `${subj}_${dayIdx}`;
        const items = schedule[cellKey] || [];
        const remaining = items.filter(it => !it.isCompleted);
        const completed = items.filter(it => it.isCompleted);
        
        if (remaining.length > 0) {
          incompleteTasks.push(...remaining);
          if (completed.length > 0) {
            newSchedule[cellKey] = completed;
          } else {
            delete newSchedule[cellKey];
          }
        }
      });
    });

    if (incompleteTasks.length === 0) {
      alert("Kaydırılacak eksik görev bulunamadı.");
      return;
    }

    // 2. Distribute them to weekend (Saturday: 5, Sunday: 6)
    incompleteTasks.forEach((task, idx) => {
      const targetDay = (idx % 2 === 0) ? 5 : 6;
      const subj = activeRows.find(s => task.topic.toUpperCase().includes(s)) || "DİĞER";
      const cellKey = `${subj}_${targetDay}`;
      
      if (!newSchedule[cellKey]) newSchedule[cellKey] = [];
      // Avoid duplicates by ID
      if (!newSchedule[cellKey].some(it => it.id === task.id)) {
        newSchedule[cellKey].push({
          ...task,
          source: 'shifted',
          topic: `[EKSİK] ${task.topic}`
        });
      }
    });

    setM4Schedule(newSchedule);
    alert(`${incompleteTasks.length} görev hafta sonuna aktarıldı.`);
  };

  const handleDownload = async () => {
    const el = document.getElementById('classic-planner-capture');
    if (!el) return;

    // Set data attributes
    const inputs = el.querySelectorAll('input, textarea');
    inputs.forEach((node) => {
        const input = node as HTMLInputElement | HTMLTextAreaElement;
        input.setAttribute('data-capture-value', input.value);
    });

    try {
      const canvas = await html2canvas(el, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        onclone: (clonedDoc) => {
           const clonedEl = clonedDoc.getElementById('classic-planner-capture');
           if (clonedEl) {
             const noPdfElems = clonedEl.querySelectorAll('.no-pdf, .no-print');
             noPdfElems.forEach(elem => {
                (elem as HTMLElement).style.display = 'none';
             });
             
             clonedEl.style.height = 'max-content';
             clonedEl.style.width = el.scrollWidth + 'px';
             clonedEl.style.maxWidth = 'none';
             clonedEl.style.boxSizing = 'border-box';
             
             clonedEl.style.overflow = 'visible';
             clonedEl.style.maxHeight = 'none';
             
             
             // Replace inputs
             const clonedInputs = clonedEl.querySelectorAll('input, textarea');
             clonedInputs.forEach((node) => {
                const input = node as HTMLInputElement | HTMLTextAreaElement;
                const val = input.getAttribute('data-capture-value') || '';
                const div = clonedDoc.createElement('div');
                div.textContent = val;
                div.className = input.className;
                div.style.border = 'none';
                div.style.outline = 'none';
                div.style.background = 'transparent';
                div.style.display = input.tagName === 'TEXTAREA' ? 'block' : 'inline-block';
                div.style.whiteSpace = 'pre-wrap';
                div.style.letterSpacing = 'normal';
                div.style.wordSpacing = 'normal';
                if(input.tagName === 'TEXTAREA') {
                    div.style.whiteSpace = 'pre-wrap';
                div.style.letterSpacing = 'normal';
                div.style.wordSpacing = 'normal';
                    div.style.wordBreak = 'break-word';
                }
                if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
                    div.style.fontSize = '24px';
                    div.style.fontWeight = '900';
                    div.style.wordBreak = 'break-word';
                }
                // Maintain text color & size
                const computed = window.getComputedStyle(input);
                div.style.color = computed.color;
                div.style.fontSize = computed.fontSize;
                div.style.fontWeight = computed.fontWeight;
                
                if (input.parentNode) {
                    input.parentNode.replaceChild(div, input);
                }
             });
           }
        }
      });
      
      const link = document.createElement('a');
      link.download = `Haftalik_Plan_${studentName.replace(/\s+/g, '_') || 'Ogrenci'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Download failed", error);
      alert("Resim oluşturulamadı.");
    }
  };

  const handleDownloadPdf = async () => {
    const el = document.getElementById('classic-planner-capture');
    if (!el) return;

    const exportRoot = document.createElement('div');
    exportRoot.style.position = 'absolute';
    exportRoot.style.left = '-9999px';
    exportRoot.style.top = '-9999px';
    document.body.appendChild(exportRoot);

    const clone = el.cloneNode(true) as HTMLElement;
    const printWidth = 1120;
    clone.style.width = printWidth + 'px';
    clone.style.height = 'max-content';
    clone.style.maxWidth = 'none';
    clone.style.maxHeight = 'none';
    clone.style.overflow = 'visible';
    clone.style.boxSizing = 'border-box';
    clone.style.margin = '0';
    clone.style.padding = '15px';
    exportRoot.appendChild(clone);

    // Inject compact style overrides to fit within A4 landscape proportions beautifully
    const compactStyles = document.createElement('style');
    compactStyles.textContent = `
      #classic-planner-capture {
         padding: 12px 15px !important;
      }
      .planner-table th, .planner-table td {
         padding: 4px 6px !important;
      }
      .planner-table td {
         min-height: 38px !important;
      }
      .subject-header {
         padding: 6px 8px !important;
         font-size: 11px !important;
         width: 105px !important;
      }
      .cell-topic {
         font-size: 11px !important;
         line-height: 1.1 !important;
      }
      .cell-target {
         font-size: 11px !important;
         margin-bottom: 2px !important;
         padding-bottom: 1px !important;
      }
      .cell-action {
         font-size: 8px !important;
         margin-top: 2px !important;
      }
      .total-row td {
         padding: 4px !important;
      }
      .total-label {
         font-size: 11px !important;
      }
      .total-value {
         font-size: 13px !important;
      }
      .logo-container {
         width: 52px !important;
         height: 52px !important;
      }
      h1 {
         font-size: 20px !important;
      }
      textarea {
         min-height: 30px !important;
         padding: 4px !important;
      }
    `;
    clone.appendChild(compactStyles);

    const noPdfElems = clone.querySelectorAll('.no-pdf, .no-print');
    noPdfElems.forEach(elem => {
        (elem as HTMLElement).style.display = 'none';
    });

    const originalInputs = el.querySelectorAll('input, textarea');
    const clonedInputs = clone.querySelectorAll('input, textarea');
    originalInputs.forEach((node, index) => {
        const input = node as HTMLInputElement | HTMLTextAreaElement;
        const cInput = clonedInputs[index] as HTMLInputElement | HTMLTextAreaElement;
        if (cInput) {
            cInput.value = input.value;
            const div = document.createElement('div');
            div.textContent = input.value;
            div.className = input.className;
            div.style.border = 'none';
            div.style.outline = 'none';
            div.style.background = 'transparent';
            div.style.display = input.tagName === 'TEXTAREA' ? 'block' : 'inline-block';
            div.style.whiteSpace = 'pre-wrap';
            div.style.wordBreak = 'break-word';
            div.style.letterSpacing = 'normal';
            
            if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
                div.style.fontSize = '24px';
                div.style.fontWeight = '900';
                div.style.wordBreak = 'break-word';
            } else {
                const computed = window.getComputedStyle(input);
                div.style.color = computed.color;
                div.style.fontSize = computed.fontSize;
                div.style.fontWeight = computed.fontWeight;
                div.style.textAlign = computed.textAlign;
                div.style.fontFamily = computed.fontFamily;
            }
            if (cInput.parentNode) cInput.parentNode.replaceChild(div, cInput);
        }
    });

    try {
      // Force text rendering optimization on the clone
      const allElements = clone.querySelectorAll('*');
      allElements.forEach(node => {
         const child = node as HTMLElement;
         child.style.textRendering = 'optimizeLegibility';
         child.style.fontVariantLigatures = 'none';
      });

      const actualWidth = printWidth;
      const actualHeight = clone.getBoundingClientRect().height || clone.offsetHeight || clone.scrollHeight;

      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        width: actualWidth,
        height: actualHeight
      });
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const margin = 4; // 4mm margins to maximize printable coverage while preventing printer clip
      const finalWidth = pdfWidth - (margin * 2);
      const finalHeight = pdfHeight - (margin * 2);
      
      const xOffset = margin;
      const yOffset = margin;
      
      pdf.addImage(dataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`Haftalik_Plan_${studentName?.replace(/\s+/g, '_') || 'Ogrenci'}.pdf`);
    } catch (error) {
      console.error("PDF Download failed", error);
      alert("PDF oluşturulamadı.");
    } finally {
      document.body.removeChild(exportRoot);
    }
  };

  
  

  

  const toggleTaskComplete = (cellKey: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Don't trigger modal popup
    const items = schedule[cellKey] || [];
    if (items.length > 0) {
      const updated = [{ ...items[0], isCompleted: !items[0].isCompleted }];
      setM4Schedule({ ...schedule, [cellKey]: updated });
    }
  };

  // Dynamic status evaluation for LGS Scoreboard
  const totalNets = Number(
    (
      (v2Nets.TRK || 0) + 
      (v2Nets.MAT || 0) + 
      (v2Nets.FEN || 0) + 
      (v2Nets.INK || 0) + 
      (v2Nets.DIN || 0) + 
      (v2Nets.ING || 0)
    ).toFixed(2)
  );

  // Accurate interpolation formulas based on student reports
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

  return (
    <div className="w-full space-y-6 max-w-[1200px] mx-auto pb-20">
      


      {/* Kontrol Paneli */}
      <div className="bg-white p-4 rounded-2xl   border border-black flex flex-col gap-4 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setIsWizardOpen(true)} className={`flex items-center gap-2 px-5 py-2.5 ${theme.bg} ${theme.hoverBg} text-white rounded-xl font-bold text-xs uppercase transition duration-200`}>
              <Sparkles size={16}/> Akıllı Dağıtım
            </button>
            <button onClick={handleShiftIncompletes} className="flex items-center gap-2 px-3 py-2 bg-white text-black border border-black rounded-lg font-bold text-[10px] uppercase hover:bg-slate-100 transition duration-200">
               <Calendar size={13}/> Eksikleri Kaydır
            </button>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black">
                <Calendar size={14} className="text-black"/>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-black text-black outline-none uppercase" />
            </div>
         </div>
         <div className="flex items-center gap-3">
            <button 
              key="clear" 
              onClick={() => {
                setM4Schedule({});
                if (studentName && studentName !== "ÖĞRENCİ İSMİ GİRİN" && studentName.trim() !== "") {
                  setStudentName("ÖĞRENCİ İSMİ GİRİN");
                }
              }} 
              className="p-2.5 text-black hover:bg-slate-100 rounded-xl transition" 
              title="Temizle"
            >
              <Trash2 size={20}/>
            </button>
            <button key="pdf" onClick={handleDownloadPdf} className={`flex items-center gap-2 px-6 py-2.5 ${theme.bg} ${theme.hoverBg} text-white rounded-xl font-bold text-xs uppercase transition duration-200`}>
               <FileText size={16}/> PDF İNDİR
            </button>
            <button key="download" onClick={handleDownload} className={`flex items-center gap-2 px-6 py-2.5 ${theme.bg} ${theme.hoverBg} text-white rounded-xl font-bold text-xs uppercase transition duration-200`}>
               <Download size={16}/> 4K İNDİR
            </button>
         </div>
        </div>
      </div>

      {/* A4 Planlayıcı Tablosu */}
      <div className="overflow-x-auto rounded-xl border-2 transition-all duration-300" style={{ borderColor: theme.tableBorderColor }}>
        <div id="classic-planner-capture" className="planner-root mx-auto box-border transition-all duration-300" style={{ 
            width: '100%',
            minWidth: '800px',
            padding: '30px', 
            fontFamily: theme.fontFamily,
            backgroundColor: theme.cellBg
        }}>
          {/* Global Planner Styles - Dynamically matching the style configuration */}
          <style>{`
            .planner-root {
                font-family: ${theme.fontFamily} !important;
                background-color: ${theme.cellBg} !important;
            }
            .planner-root * { 
                color: ${theme.tableTextColor} !important; 
                font-family: ${theme.fontFamily} !important;
            }
            .planner-root input {
                color: ${theme.tableTextColor} !important;
            }
            .planner-table { 
                width: 100%; 
                border-collapse: collapse; 
                table-layout: fixed; 
                border: 3px ${theme.tableBorderStyle} ${theme.tableBorderColor};
                background-color: ${theme.cellBg} !important;
                empty-cells: show;
            }
            .planner-table th { 
                border: 2px ${theme.tableBorderStyle} ${theme.tableBorderColor}; 
                background-color: ${theme.tableHeaderBg} !important;
                color: ${theme.tableHeaderTextColor} !important;
                padding: 8px; 
                vertical-align: middle;
            }
            .planner-table td { 
                border: 2px ${theme.tableBorderStyle} ${theme.tableBorderColor}; 
                background-color: ${theme.cellBg} !important;
                padding: 8px; 
                vertical-align: top;
                min-height: 80px;
                height: auto;
                word-wrap: break-word;
                overflow-wrap: break-word;
            }
            .subject-header { 
                width: 125px; 
                font-weight: 900; 
                font-size: 13px; 
                text-align: left; 
                background-color: ${theme.tableHeaderBg} !important; 
                color: ${theme.tableHeaderTextColor} !important;
                padding: 12px !important;
                word-break: break-word;
                text-transform: uppercase;
            }
            .day-header { 
                background-color: ${theme.tableHeaderBg} !important; 
                color: ${theme.tableHeaderTextColor} !important;
                text-align: center; 
                height: auto !important; 
                padding: 8px !important;
            }
            .cell-target { 
                font-weight: 950; 
                font-size: 12px; 
                display: block; 
                margin-bottom: 5px; 
                border-bottom: 2px dashed ${theme.tableBorderColor}; 
                padding-bottom: 3px; 
                line-height: 1.1; 
                background-color: transparent !important;
                color: ${theme.tableTextColor} !important;
            }
            .cell-topic { 
                font-size: 12px; 
                font-weight: 700; 
                line-height: 1.3; 
                white-space: pre-wrap; 
                overflow-wrap: break-word; 
                word-break: break-word;
                color: ${theme.tableTextColor} !important;
            }
            .cell-action { 
                font-size: 10px; 
                font-weight: 850; 
                color: ${theme.tableTextColor} !important; 
                margin-top: 6px; 
                display: block; 
                opacity: 0.85; 
                line-height: 1.1; 
            }
            .print-only { display: none !important; }
            @media print {
              .print-only { display: block !important; }
              .no-print { display: none !important; }
            }
            
            /* Total Row Styles */
            .total-row td {
                background-color: ${theme.tableHeaderBg} !important; 
                border-top: 3px ${theme.tableBorderStyle} ${theme.tableBorderColor};
                height: auto !important;
                min-height: 50px !important;
                vertical-align: middle;
            }
            .total-label {
                font-weight: 950;
                font-size: 14px;
                text-transform: uppercase;
                background-color: ${theme.tableHeaderBg} !important;
                color: ${theme.tableHeaderTextColor} !important;
            }
            .total-value {
                font-weight: 950;
                font-size: 17px;
                text-align: center;
                display: block;
                color: ${theme.tableTextColor} !important;
            }
          `}</style>

          {/* Üst Bilgi Alanı */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-4" style={{ borderBottomColor: theme.tableBorderColor, borderBottomStyle: theme.tableBorderStyle as any }}>
            <div className="flex items-center gap-6">
              <div onClick={() => logoInputRef.current?.click()} className="logo-container w-24 h-24 border-2 flex items-center justify-center cursor-pointer overflow-hidden shrink-0 group relative" style={{ borderColor: theme.tableBorderColor, backgroundColor: theme.cellBg }}>
                {logo ? (
                   <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                   <div className="text-[10px] font-bold uppercase opacity-35 text-center leading-tight" style={{ color: theme.tableTextColor }}>LOGO<br/>YÜKLE</div>
                )}
                <input 
                    ref={logoInputRef} 
                    type="file" 
                    onChange={onLogoUpload} 
                    className="hidden" 
                    style={{ display: 'none' }}
                    accept="image/*" 
                />
              </div>
              <div>
                <h1 className={`text-3xl leading-none mb-2 ${theme.titleStyle}`} style={{ color: theme.tableTextColor }}>HAFTALIK DERS<br/>ÇALIŞMA PLANI</h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-60" style={{ color: theme.tableTextColor }}>{days[0].date} / {days[6].date}</p>
              </div>
            </div>
            
            <div className="text-right flex flex-col items-end min-w-[340px]">
              <div className="w-full border-b-2 mb-1" style={{ borderBottomColor: theme.tableBorderColor, borderBottomStyle: theme.tableBorderStyle as any }}>
                <input 
                  type="text" 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value.toLocaleUpperCase('tr-TR'))} 
                  className="text-2xl font-black bg-transparent outline-none w-full text-right py-4 px-2 uppercase leading-normal" 
                  placeholder="ÖĞRENCİ İSMİ GİRİN" 
                  style={{ color: theme.tableTextColor, fontFamily: theme.fontFamily }}
                />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50" style={{ color: theme.tableTextColor }}>BAŞARI VE DİSİPLİN FORMU</p>
            </div>
          </div>

          {/* Günün Motivasyon Sözü Alanı */}
          {motivationQuote && (
            <div className="mb-6 bg-slate-50/50 dark:bg-slate-900/15 border-2 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 relative group"
                 style={{ borderColor: `${theme.tableBorderColor}20`, backgroundColor: `${theme.cellBg}` }}>
              <div className="flex gap-3.5 items-start">
                <div className="p-2.5 rounded-xl shrink-0 border-2" style={{ borderColor: `${theme.tableBorderColor}10`, backgroundColor: `${theme.tableHeaderBg}` }}>
                  <Sparkles size={18} style={{ color: theme.hex }} className="animate-pulse" />
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-widest opacity-60" style={{ color: theme.tableTextColor }}>HAFTANIN MOTİVASYON SÖZÜ</div>
                  <p className="text-xs sm:text-sm font-bold italic leading-relaxed" style={{ color: theme.tableTextColor, fontFamily: theme.fontFamily }}>
                    "{motivationQuote}"
                  </p>
                </div>
              </div>
              
              {/* Değiştirme Butonu - PDF/PNG çıktılarında no-print/no-pdf sınıfı sayesinde gizlenecektir */}
              <button
                onClick={handleNewQuote}
                className="no-print no-pdf flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-xs cursor-pointer select-none self-end sm:self-auto shrink-0"
                style={{ fontFamily: theme.fontFamily }}
              >
                <RefreshCw size={11} style={{ color: theme.hex }} />
                YENİ SÖZ AL
              </button>
            </div>
          )}

          {/* Ana Program Tablosu */}
          <table className="planner-table">
            <thead>
              <tr>
                <th className="subject-header">DERS / GÖREV</th>
                {days.map(day => (
                  <th key={day.key} className="day-header cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setEditingDay({ dayIdx: day.key, dayName: day.full })}>
                    <div className="text-[14px] md:text-[15px] font-black uppercase" style={{ color: theme.hex }}>{day.full}</div>
                    <div className="text-[11px] font-bold opacity-40">{day.date}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRows.map(subj => {
                // Collect all topics for this subject
                const daysWithItems = days.filter(day => schedule[`${subj}_${day.key}`]?.[0]);
                const topics = Array.from(new Set(
                  daysWithItems
                    .map(day => schedule[`${subj}_${day.key}`]?.[0]?.topic)
                    .filter(Boolean)
                    .map(t => t.trim())
                ));
                const mergedTopicText = topics.length > 0 ? topics.join(" + ") : "";
                
                // Determine which day to use as the edit action for the merged topic cell
                const firstScheduledDay = daysWithItems.length > 0 ? daysWithItems[0].key : 0;
                const firstCellKey = `${subj}_${firstScheduledDay}`;

                return (
                  <React.Fragment key={subj}>
                    {/* TOPIC ROW (Merged colSpan=7) */}
                    <tr key={`${subj}_topic`}>
                      <td rowSpan={2} className="subject-header" style={{ verticalAlign: 'middle', borderBottomWidth: '3px' }}>
                        {subj}
                      </td>
                      <td colSpan={7} className="relative group hover:bg-black/5 transition-colors cursor-pointer" style={{ padding: '8px', verticalAlign: 'middle' }} onClick={() => setEditingCell({ key: firstCellKey, subject: subj, dayIdx: firstScheduledDay })}>
                        {mergedTopicText ? (
                          <div className="flex items-center justify-between px-3 py-1">
                            <div className="cell-topic font-black text-[13px] tracking-wide text-center w-full" style={{ color: theme.tableTextColor }}>
                              {mergedTopicText}
                            </div>
                            <button className="no-print opacity-0 group-hover:opacity-100 transition-opacity ml-2 p-1 rounded hover:bg-slate-100" title="Konuyu Düzenle">
                              <Edit2 size={12} style={{ color: theme.hex }} />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center italic opacity-35 text-[11px] font-bold py-1 w-full" style={{ color: theme.tableTextColor }}>
                            Bu hafta konu çalışması planlanmadı. Eklemek için tıklayın.
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* COUNT / CHECKLIST ROW (7 individual day cells) */}
                    <tr key={`${subj}_count`} style={{ borderBottomWidth: '3px', borderBottomColor: theme.tableBorderColor, borderBottomStyle: theme.tableBorderStyle as any }}>
                      {days.map(day => {
                        const item = schedule[`${subj}_${day.key}`]?.[0];
                        const cellKey = `${subj}_${day.key}`;
                        return (
                          <td key={day.key} className="relative group hover:bg-black/5 transition-colors" style={{ height: 'auto', minHeight: '52px', verticalAlign: 'middle', padding: '6px' }}>
                            {item ? (
                              <div className={`flex flex-col items-center justify-center text-center cursor-pointer min-h-[44px] relative px-4 ${item.isCompleted ? 'opacity-65' : ''}`} onClick={() => setEditingCell({ key: cellKey, subject: subj, dayIdx: day.key })}>
                                <span className="text-[12px] font-black tracking-wider block" style={{ color: theme.tableTextColor }}>
                                  {item.count}
                                </span>
                                {item.action && (
                                  <span className="text-[9px] font-black uppercase tracking-wider block opacity-70 mt-0.5" style={{ color: theme.hex }}>
                                    {item.action}
                                  </span>
                                )}
                                
                                {/* Interactive Completion Box */}
                                <button
                                  onClick={(e) => toggleTaskComplete(cellKey, e)}
                                  className="no-print absolute top-0.5 right-0.5 w-4.5 h-4.5 flex items-center justify-center border rounded transition-all duration-250 z-20 cursor-pointer"
                                  style={{ borderColor: theme.tableBorderColor, backgroundColor: theme.cellBg, color: theme.hex }}
                                  title="Tamamlandı olarak işaretle"
                                >
                                  {item.isCompleted ? <Check size={8} strokeWidth={4} /> : null}
                                </button>
                                <span className="print-only absolute top-0.5 right-1.5 text-[8px] font-black" style={{ display: 'none' }}>
                                  {item.isCompleted ? "✔" : "☐"}
                                </span>
                              </div>
                            ) : (
                              <div className="w-full h-full min-h-[44px] relative flex items-center justify-center">
                                <button 
                                  onClick={() => setEditingCell({ key: cellKey, subject: subj, dayIdx: day.key })}
                                  className="no-print absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-40 transition-all cursor-pointer"
                                  style={{ color: theme.tableBorderColor }}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
              
              {/* TOPLAM SORU SATIRI */}
              <tr className="total-row">
                 <td className="subject-header total-label text-center">GÜNLÜK TOPLAM</td>
                 {days.map(day => {
                    const { totalQuestions, hours, mins } = dailyStatsList[day.key];
                    return (
                      <td key={`total_${day.key}`} className="py-2">
                        <div className="flex flex-col items-center justify-center">
                           <div className="flex flex-col items-center w-full">
                             <span className="total-value">{totalQuestions}</span>
                             <span className="text-[11px] font-black uppercase" style={{ color: theme.tableTextColor }}>{goalUnit}</span>
                           </div>
                        </div>
                      </td>
                    );
                 })}
              </tr>
            </tbody>
          </table>



          {/* Student Feedback Section */}
          <div className="mt-4 border-2 rounded-xl p-3 transition-all duration-300" style={{ borderColor: theme.tableBorderColor, backgroundColor: theme.cellBg }}>
            <div className="text-[10px] font-black uppercase mb-1" style={{ color: theme.tableHeaderTextColor }}>Öğrenci Değerlendirmesi</div>
            <p className="text-[10px] font-bold mb-2" style={{ color: theme.tableTextColor }}>Bu hafta sana verilen görevleri tamamlarken çalışma verimini nasıl değerlendirirsin? Zorlandığın veya eksik hissettiğin konular neler oldu?</p>
            <textarea 
              className="w-full min-h-[50px] bg-transparent border-none outline-none text-xs font-semibold resize-none"
              placeholder="Düşüncelerini buraya yazabilirsin..."
              style={{ color: theme.tableTextColor, fontFamily: theme.fontFamily }}
            ></textarea>
          </div>

          {/* Parent Signature Section */}
          <div className="mt-6 flex justify-end pt-4 border-t" style={{ borderColor: `${theme.tableBorderColor}20` }}>
             <div className="flex flex-col items-center justify-end shrink-0 min-w-[200px]">
                <div className="w-48 border-b-2 mb-1.5" style={{ borderBottomColor: theme.tableBorderColor, borderBottomStyle: theme.tableBorderStyle as any }}></div>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: theme.tableTextColor }}>VELİ İMZA</div>
             </div>
          </div>

        </div>
      </div>

      {/* Gün Düzenleme Modalı */}
      {editingDay && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-slate-900/40 p-4 no-print">
            <div className="bg-white w-full max-w-sm rounded-3xl p-8 space-y-6 border-4 border-black">
                <div className="flex justify-between items-center border-b-2 border-black pb-4">
                    <div>
                        <h3 className="text-xl font-black text-black uppercase tracking-tight">GÜN İŞLEMLERİ</h3>
                        <p className="text-[10px] font-black text-black uppercase tracking-widest mt-1">{editingDay.dayName}</p>
                    </div>
                    <button onClick={() => setEditingDay(null)} className="p-2 hover:bg-slate-300 rounded-xl transition-colors"><X size={20} className="text-black" /></button>
                </div>
                
                <div className="space-y-3">
                    <button 
                        onClick={() => handleDayAction('TRIAL')}
                        className="w-full py-4 bg-black text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em]   hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} />
                        DENEME SINAVI YAP
                    </button>
                    <p className="text-[9px] text-center text-black font-bold px-4">
                        Bu işlem, seçili gündeki tüm ödevleri siler ve yerine "GENEL DENEME PROVASI" atar.
                    </p>
                </div>

                <div className="pt-4 border-t-2 border-black space-y-3">
                    <button 
                        onClick={() => handleDayAction('CLEAR')}
                        className="w-full py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 size={16} />
                        GÜNÜ TEMİZLE
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Düzenleme Modalı */}
      {editingCell && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print overflow-y-auto">
              <div 
                  className="bg-white w-full max-w-xl rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl m-auto max-h-[92vh] overflow-y-auto border-2 transition-all duration-300 transform scale-100"
                  style={{ 
                      borderColor: theme.tableBorderColor, 
                      fontFamily: theme.fontFamily,
                      boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px ${theme.tableBorderColor}50`
                  }}
              >
                  {/* Modal Header */}
                  <div className="flex justify-between items-start border-b pb-4 shrink-0" style={{ borderColor: `${theme.tableBorderColor}50` }}>
                      <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white ${theme.bg}`}>
                                  {editingCell.subject}
                              </span>
                              <span className="text-slate-400 text-xs">•</span>
                              <span className={`text-[10px] font-black uppercase tracking-wider ${theme.textColor}`}>
                                  {days[editingCell.dayIdx].full}
                              </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">
                              GÖREVİ DÜZENLE
                          </h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {grade === 8 ? "8. SINIF (LGS) MÜFREDATI" : `${grade}. SINIF MÜFREDATI`}
                          </p>
                      </div>
                      <button 
                          onClick={() => setEditingCell(null)} 
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                      >
                          <X size={20} />
                      </button>
                  </div>

                  {/* Modal Core Content */}
                  <div className="space-y-6">
                      {/* Konu Seçimi */}
                      <div className="space-y-2.5">
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">
                              ÇALIŞILACAK KONU BAŞLIĞI
                          </label>
                          {(() => {
                              const baseTopics = CURRICULUM_DB[grade]?.[editingCell.subject] || (editingCell.subject === "PARAGRAF" ? ["Paragraf Çözümü", "Hızlı Okuma", "Anlam Bilgisi", "Sözcükte Anlam", "Cümlede Anlam"] : []);
                              const gradeText = grade === 8 ? "8. Sınıf (LGS)" : `${grade}. Sınıf`;
                              const customTopics = [
                                  `${gradeText} Konu Tekrarı`,
                                  "Branş Denemesi"
                              ];
                              const subjectTopics = Array.from(new Set([...customTopics, ...baseTopics]));
                              const currentTopicStr = schedule[editingCell.key]?.[0]?.topic || "";
                              const selectedTopics = currentTopicStr ? currentTopicStr.split(" + ").filter(t => t.trim() !== '') : [];

                              return (
                                  <div className="space-y-3.5">
                                      {/* Beautiful Soft Input Area */}
                                      <div className="relative">
                                          <textarea 
                                              value={currentTopicStr} 
                                              onChange={(e) => handleManualCellUpdate(editingCell.key, { topic: e.target.value })}
                                              placeholder="Konu başlığını kendiniz de özgürce buraya yazabilirsiniz..."
                                              className="w-full p-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-xs font-bold outline-none min-h-[64px] transition-all resize-none shadow-inner leading-relaxed text-slate-700"
                                              style={{ fontFamily: theme.fontFamily }}
                                          />
                                      </div>

                                      {/* Elegant, clear scroll list */}
                                      {subjectTopics.length > 0 && (
                                          <div className="space-y-1.5">
                                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-0.5">Müfredat Önerilerinden Seçin ({subjectTopics.length} Seçenek)</span>
                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-44 overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50/50">
                                                  {subjectTopics.map((topic) => {
                                                      const isSelected = selectedTopics.includes(topic);
                                                      return (
                                                          <button
                                                              key={topic}
                                                              type="button"
                                                              onClick={() => {
                                                                  let newTopics;
                                                                  if (isSelected) {
                                                                      newTopics = selectedTopics.filter(t => t !== topic);
                                                                  } else {
                                                                      newTopics = [...selectedTopics, topic];
                                                                  }
                                                                  handleManualCellUpdate(editingCell.key, { topic: newTopics.join(" + ") });
                                                              }}
                                                              className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-200 text-[11px] font-bold border cursor-pointer ${
                                                                  isSelected 
                                                                      ? `${theme.bg} text-white shadow-sm border-transparent` 
                                                                      : 'bg-white text-slate-700 hover:text-slate-900 border-slate-200/65 hover:bg-slate-50'
                                                              }`}
                                                          >
                                                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${isSelected ? 'border-white bg-white/20 text-white' : 'border-slate-300'}`}>
                                                                  {isSelected && <Check size={10} strokeWidth={4} />}
                                                              </div>
                                                              <span className="flex-1 min-w-0 truncate capitalize leading-tight">{topic.toLowerCase()}</span>
                                                          </button>
                                                      );
                                                  })}
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              );
                          })()}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          {/* Miktar */}
                          <div className="space-y-2.5">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">
                                  HEDEF / MİKTAR ({goalUnit})
                              </label>
                              <div className="space-y-3">
                                  <input 
                                      type="text" 
                                      value={schedule[editingCell.key]?.[0]?.count || `30 ${goalUnit.toUpperCase()}`} 
                                      onChange={(e) => handleManualCellUpdate(editingCell.key, { count: e.target.value })}
                                      className="w-full py-3 px-4 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl text-center font-black text-sm outline-none transition-all text-slate-800 tracking-wide"
                                      placeholder={`Seçilen ${goalUnit}`}
                                      style={{ fontFamily: theme.fontFamily }}
                                  />
                                  <div className="grid grid-cols-4 gap-1">
                                      {["15", "20", "30", "40", "50", "2 Test", "3 Test", "1 Deneme"].map(preset => {
                                          const label = isNaN(Number(preset)) ? preset : `${preset} ${goalUnit.toUpperCase()}`;
                                          const isCurrentPreset = (schedule[editingCell.key]?.[0]?.count || "").toUpperCase() === label.toUpperCase();
                                          return (
                                              <button
                                                  key={preset}
                                                  type="button"
                                                  onClick={() => handleManualCellUpdate(editingCell.key, { count: label })}
                                                  className={`py-1.5 px-1 rounded-lg text-[9px] font-black uppercase transition-all duration-150 border cursor-pointer text-center truncate ${
                                                      isCurrentPreset 
                                                          ? `${theme.bg} text-white border-transparent shadow-xs` 
                                                          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'
                                                  }`}
                                                  title={label}
                                              >
                                                  {preset}
                                              </button>
                                          );
                                      })}
                                  </div>
                              </div>
                          </div>

                          {/* Aktivite Türü */}
                          <div className="space-y-2.5">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 ml-0.5">
                                  AKTİVİTE TÜRÜ (ÇOKLU SEÇİM)
                              </label>
                              <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50/50">
                                  {["KONU ÇALIŞMASI", "KONU TEKRARI", "SORU ÇÖZÜMÜ", "DENEME SINAVI", "ÖZET ÇIKARMA", "PARAGRAF"].map((action) => {
                                      const currentActionStr = schedule[editingCell.key]?.[0]?.action || "SORU ÇÖZÜMÜ";
                                      const selectedActions = currentActionStr.split(" + ");
                                      const isSelected = selectedActions.includes(action);

                                      return (
                                          <button
                                              key={action}
                                              type="button"
                                              onClick={() => {
                                                  let newActions;
                                                  if (isSelected) {
                                                      newActions = selectedActions.filter(a => a !== action);
                                                      if (newActions.length === 0) newActions = ["SORU ÇÖZÜMÜ"]; // Default if empty
                                                  } else {
                                                      if (selectedActions.length === 1 && selectedActions[0] === "SORU ÇÖZÜMÜ" && action !== "SORU ÇÖZÜMÜ") {
                                                          newActions = [...selectedActions, action];
                                                      } else {
                                                          newActions = [...selectedActions, action];
                                                      }
                                                  }
                                                  handleManualCellUpdate(editingCell.key, { action: newActions.join(" + ") });
                                              }}
                                              className={`flex items-center gap-2.5 p-2 rounded-lg text-left transition-all duration-150 text-[10px] font-black border cursor-pointer ${
                                                  isSelected 
                                                      ? `${theme.bg} text-white shadow-xs border-transparent` 
                                                      : 'bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 border-slate-200'
                                              }`}
                                          >
                                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isSelected ? 'border-white bg-white/20 text-white' : 'border-slate-300'}`}>
                                                  {isSelected && <Check size={8} strokeWidth={4} />}
                                              </div>
                                              <span className="flex-1 truncate">{action}</span>
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="flex gap-2.5 pt-4 border-t sticky bottom-0 bg-white z-10" style={{ borderColor: `${theme.tableBorderColor}50` }}>
                     <button 
                        onClick={() => {
                             const newSchedule = { ...schedule };
                             delete newSchedule[editingCell.key];
                             setM4Schedule(newSchedule);
                             setEditingCell(null);
                        }}
                        className="flex-1 py-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer"
                      >
                        SİL
                      </button>
                      <button 
                        onClick={() => setEditingCell(null)}
                        className={`flex-[2] py-3 ${theme.bg} ${theme.hoverBg} text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-slate-200/50`}
                      >
                        KAYDET
                      </button>
                  </div>
              </div>
          </div>
      )}
      
      <DistributionWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
        onDistribute={handleSmartDistribute} 
        grade={grade} 
        setGrade={setGrade} 
        targetModule="module4" 
        goalUnit={goalUnit}
        setGoalUnit={setGoalUnit}
        onNetsParsed={handleNetsParsed}
        accentTheme={accentTheme}
      />
    </div>
  );
}
