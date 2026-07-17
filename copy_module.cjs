const fs = require('fs');
let code = fs.readFileSync('components/Module18.tsx', 'utf-8');

// Replacements
code = code.replace(/export default function Module18/g, 'export default function Module19');
code = code.replace(/import \{ DistributionWizard \} from '\.\/DistributionWizard';/g, "import { DistributionWizard } from './DistributionWizard';\nimport { classSchedules } from './classSchedules';");
code = code.replace(/const activeRows = \['14:30', '15:20', '16:10', '17:00', '17:45', '18:30', '20:00', '21:00', '22:45:00 \\(30 DK\\)', '23:30:00 \\(30 DK\\)'\];/g, 
`  const [selectedClass, setSelectedClass] = useState("7 E1");
  const classKeys = Object.keys(classSchedules);
  
  const activeRows = ['09:00', '09:50', '10:40', '11:30', '12:50', '13:40', '14:30', '15:20', '16:10', '17:00', '17:45', '18:30', '20:00', '21:00', '22:45:00 (30 DK)', '23:30:00 (30 DK)'];

  const loadClassSchedule = () => {
    if (!window.confirm(selectedClass + " sınıf programı yüklenecek. Önceki tüm veriler silinecek. Onaylıyor musunuz?")) return;
    
    let newSchedule = {};
    const classData = classSchedules[selectedClass];
    if (classData) {
      Object.keys(classData).forEach(time => {
        const subjectsForDays = classData[time];
        subjectsForDays.forEach((subject, dayIdx) => {
          if (subject && subject !== "X") {
             const cellKey = \`\${time}_\${dayIdx}\`;
             newSchedule[cellKey] = [{
               id: "class_" + Math.random().toString(36).substr(2, 9),
               topic: subject,
               action: subject === "ETÜT/SORU ÇÖZÜMÜ" ? "ETÜT" : "OKUL DERSİ",
               count: "40 DK",
               source: 'school'
             }];
          }
        });
      });
    }
    setM4Schedule(newSchedule);
  };
`);

code = code.replace(/<div className="flex flex-wrap items-center gap-3">/g, 
`<div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-1 border border-black">
               <select 
                 value={selectedClass} 
                 onChange={(e) => setSelectedClass(e.target.value)}
                 className="bg-transparent text-black text-xs font-bold px-2 py-1 outline-none"
               >
                 {classKeys.map(k => <option key={k} value={k}>{k}</option>)}
               </select>
               <button onClick={loadClassSchedule} className="px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-bold uppercase transition hover:bg-slate-700">Program Yükle</button>
            </div>`);

fs.writeFileSync('components/Module19.tsx', code);
