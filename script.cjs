const fs = require('fs');
const file = './components/Module11.tsx';
let txt = fs.readFileSync(file, 'utf8');

const handleSmartReplacement = `const handleSmartDistribute = (params: DistributeParams) => {
    const commonQuestionCount = params.paragraphCount || 40;
    
    let newSchedule: ScheduleM11 = JSON.parse(JSON.stringify(schedule || {}));
    if (params.clearPrevious) {
        DAYS.forEach(day => {
            newSchedule[day]?.forEach(s => {
                 if(s.activity !== 'KAPALI' && !s.subject?.includes('ETÜT') && !(s as any).teacher) {
                     s.activity = '';
                     s.subject = '';
                     s.topic = '';
                     s.questionCount = 0;
                 }
            });
        });
    }

    const ANA_DERSLER = ["TÜRKÇE", "MATEMATİK", "FEN", "FİZİK", "KİMYA", "BİYOLOJİ", "GEOMETRİ"];
    
    const tasks: {subject: string, topic: string, totalCount: number, limit: number, dayAllowed: string[]}[] = [];
    
    DAYS.forEach(daySelected => {
        if (!params.subjectDays.includes(daySelected)) return; 
        
        params.selectedSubjects.forEach(sub => {
             const subUpper = sub.toUpperCase();
             const isMain = ANA_DERSLER.some(m => subUpper.includes(m));
             const limit = isMain ? 40 : 60;
             
             let allowed = true;
             if (selectedClass && CLASS_PROGRAMS[selectedClass]) {
                  const dayClass = CLASS_PROGRAMS[selectedClass][daySelected] || [];
                  const taughtToday = dayClass.some(c => c.toUpperCase().includes(subUpper.substring(0,3)));
                  if(!taughtToday) allowed = false;
             }
             
             if (!allowed) return;
             
             const subTopics = params.selectedTopics[sub] || [];
             if (subTopics.length === 0) {
                 tasks.push({subject: sub, topic: "Genel Tekrar / Soru Çözümü", totalCount: commonQuestionCount, limit, dayAllowed: [daySelected]});
             } else {
                 let groupText = subTopics.map(t => typeof t === 'string' ? t : t.name).join(', ');
                 tasks.push({subject: sub, topic: groupText, totalCount: commonQuestionCount, limit, dayAllowed: [daySelected]});
             }
        });
    });

    let totalAssigned = 0;

    tasks.forEach(task => {
         let remaining = task.totalCount;
         
         while(remaining > 0) {
              const toAssign = Math.min(remaining, task.limit);
              remaining -= toAssign;
              
              let assigned = false;
              for(const day of task.dayAllowed) {
                   const emptySlot = newSchedule[day]?.find(s => !s.activity && !s.subject && s.activity !== "KAPALI");
                   if(emptySlot) {
                        emptySlot.activity = \`ÖDEV: \${task.subject} - \${task.topic}\`;
                        emptySlot.subject = task.subject;
                        emptySlot.topic = task.topic;
                        emptySlot.questionCount = toAssign;
                        emptySlot.type = ["Soru Çözümü"];
                        assigned = true;
                        totalAssigned++;
                        break;
                   }
              }
              
              if(!assigned) {
                   for(const fallbackDay of DAYS) {
                       const emptySlot = newSchedule[fallbackDay]?.find(s => !s.activity && !s.subject && s.activity !== "KAPALI");
                       if(emptySlot) {
                            emptySlot.activity = \`ÖDEV: \${task.subject} - \${task.topic}\`;
                            emptySlot.subject = task.subject;
                            emptySlot.topic = task.topic;
                            emptySlot.questionCount = toAssign;
                            emptySlot.type = ["Soru Çözümü"];
                            totalAssigned++;
                            break;
                       }
                   }
              }
         }
    });

    setSchedule(newSchedule);
    alert(\`Akıllı Dağıtım: \${totalAssigned} adet ders aktivitesi yerleştirildi.\`);
  };`;

const start = txt.indexOf('const handleSmartDistribute = ');
const end = txt.indexOf('const handleAIOptimize = ', start);
if(start !== -1 && end !== -1) {
    txt = txt.substring(0, start) + handleSmartReplacement + '\n\n  ' + txt.substring(end);
}

// 6. PDF settings 
txt = txt.replace(/orientation: 'landscape'/g, "orientation: 'portrait'");
txt = txt.replace(/const pdfOrientation = 'landscape';/g, "const pdfOrientation = 'portrait';");
txt = txt.replace(/clone\.style\.width = '1400px';/g, "clone.style.width = '1123px';");

fs.writeFileSync(file, txt);
