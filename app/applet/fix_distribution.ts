import fs from 'fs';

const m11 = './components/Module11.tsx';
let txt = fs.readFileSync(m11, 'utf8');

const start = txt.indexOf('const handleSmartDistribute = ');
const end = txt.indexOf('const handleAIOptimize = ', start);

if (start !== -1 && end !== -1) {
    const replacement = `const handleSmartDistribute = (params: DistributeParams) => {
    let newSchedule: ScheduleM11 = JSON.parse(JSON.stringify(schedule || {}));
    if (params.clearPrevious) {
        DAYS.forEach(day => {
            newSchedule[day]?.forEach(s => {
                 if(s.activity !== 'KAPALI' && !s.subject?.includes('ETÜT') && !(s as any).teacher) {
                     s.activity = '';
                     s.subject = '';
                     s.topic = '';
                     s.questionCount = 0;
                     s.type = [];
                 }
            });
        });
    }

    let totalAssigned = 0;

    params.selectedSubjects.forEach(sub => {
        const wizardTopics = params.selectedTopics[sub] || [];
        let topics = wizardTopics.length > 0 ? wizardTopics : ["Genel Tekrar"];
        const wizardDays = params.subjectDays[sub] || [];
        
        const targetDays = DAYS.filter(d => wizardDays.includes(d));
        if (targetDays.length === 0) return;

        const totalSlots = targetDays.length;

        targetDays.forEach((targetDay, i) => {
             // Divide topics evenly among selected days
             let topicsForThisDay: string[] = [];
             if (topics.length <= totalSlots) {
                 topicsForThisDay = [typeof topics[i % topics.length] === 'string' ? topics[i % topics.length] as string : (topics[i % topics.length] as any).name];
             } else {
                 const startIdx = Math.floor(i * topics.length / totalSlots);
                 const endIdx = Math.floor((i + 1) * topics.length / totalSlots);
                 topicsForThisDay = topics.slice(startIdx, endIdx).map(t => typeof t === 'string' ? t : (t as any).name);
             }

             if (topicsForThisDay.length === 0) return;
             const combinedTopic = topicsForThisDay.join(', ');
             const qCount = params.subjectQuestionCounts[sub] || 40;

             // Find empty slot on this day (or a slot that only has ETUT but no assignment)
             let emptySlot = newSchedule[targetDay]?.find(s => !s.activity && !s.subject && s.activity !== "KAPALI");
             
             // If no completely empty slot, try finding an ETUT slot that isn't fully utilized ideally. For now strict empty:
             if (emptySlot) {
                 emptySlot.activity = \`ÖDEV: \${sub} - \${combinedTopic}\`;
                 emptySlot.subject = sub;
                 emptySlot.topic = combinedTopic;
                 emptySlot.questionCount = qCount;
                 emptySlot.type = ["Soru Çözümü"];
                 totalAssigned++;
             } else {
                  // Fallback: any day
                  for (const fallbackDay of DAYS) {
                       const fallbackSlot = newSchedule[fallbackDay]?.find(s => !s.activity && !s.subject && s.activity !== "KAPALI");
                       if (fallbackSlot) {
                           fallbackSlot.activity = \`ÖDEV: \${sub} - \${combinedTopic}\`;
                           fallbackSlot.subject = sub;
                           fallbackSlot.topic = combinedTopic;
                           fallbackSlot.questionCount = qCount;
                           fallbackSlot.type = ["Soru Çözümü"];
                           totalAssigned++;
                           break;
                       }
                  }
             }
        });
    });

    setSchedule(newSchedule);
    alert(\`Akıllı Dağıtım: \${totalAssigned} adet ders aktivitesi başarıyla yerleştirildi.\`);
  };

  `;
    txt = txt.substring(0, start) + replacement + txt.substring(end);
    fs.writeFileSync(m11, txt);
    console.log("Module 11 updated!");
} else {
    console.log("Could not find boundaries in Module 11.");
}
