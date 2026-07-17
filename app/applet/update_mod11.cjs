const fs = require('fs');

let f = './components/Module11.tsx';
let txt = fs.readFileSync(f, 'utf8');

// 1. ADD 23 TO HOURS
txt = txt.replace(/const HOURS = \[9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22\];/g, "const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];");

// 2. ADD 23 TO HOUR_LABELS
txt = txt.replace(/22: "20.10"/g, "22: \"20.10\",\n    23: \"21.00\"");

// 3. FIX handleClassChange to parse subject and teacher
txt = txt.replace(/const lessonName = lessons\[offset\];/g, `const lessonMatch = lessons[offset].match(/^(.*?) (Matematik|Türkçe|Fen|İnk\\.Tar|İngilizce|Fen Bilg\\.|Din Kültürü|Sosyal Bilgiler|Fizik|Kimya|Biyoloji|Coğrafya|Tarih)$/i);
                        let subName = lessons[offset];
                        let teacherName = "";
                        if(lessonMatch) {
                             teacherName = lessonMatch[1].trim();
                             subName = lessonMatch[2].trim();
                        } else if(lessons[offset] === 'ETÜT/SORU ÇÖZÜMÜ') {
                             subName = "ETÜT/SORU ÇÖZÜMÜ";
                        }`);

txt = txt.replace(/subject: lessonName,/g, "subject: subName,\n                                teacher: teacherName,");

// 4. Update the render
txt = txt.replace(
/<div className="font-black text-\[10px\] uppercase leading-tight border-b border-current pb-1 mb-1 truncate w-full">\s*\{item\?\.subject\}\s*<\/div>/g, 
`{(item as any)?.teacher && (
                                                <div className="text-[10px] font-medium text-black uppercase tracking-wider text-center leading-tight mb-0.5">
                                                    {(item as any).teacher}
                                                </div>
                                            )}
                                            <div className={\`font-black \${(item as any)?.teacher ? 'text-[14px] text-center border-none' : 'text-[10px] border-b pb-1'} uppercase leading-tight border-current mb-1 truncate w-full\`}>
                                                {item?.subject}
                                            </div>`
);


// 5. Replace handleSmartDistribute
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

    const ANA_DERSLER = ["TÜRKÇE", "MATEMATİK", "FEN", "FİZİK", "KİMYA", "BİYOLOJİ"];
    
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

fs.writeFileSync(f, txt);
console.log('Finished mod 11 update.');
