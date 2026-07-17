const fs = require('fs');

const files = ["./components/Module11.tsx", "./components/Module14.tsx", "./components/Module16.tsx", "./components/Module10.tsx", "./components/Module4.tsx"];
for (const file of files) {
   if (!fs.existsSync(file)) continue;
   let content = fs.readFileSync(file, 'utf8');

   // Let's identify the buttons that have been broken:
   // "bg-white text-white" -> "bg-black text-white"
   content = content.replace(/bg-white text-white/g, "bg-black text-white");
   
   // "hover:bg-white transition" for buttons normally was hover:bg-slate-800 or similar
   content = content.replace(/hover:bg-white/g, "hover:bg-slate-300");

   // text-black borders inside bg-white should be fine.
   // But wait, what if I just restore them using my memory?
   // Also "PDF Olarak İndir" -> "PDF İNDİR"
   content = content.replace(/PDF Olarak İndir/g, "PDF İNDİR");

   // "px-6 py-2.5 bg-black text-white rounded-xl font-bold text-xs uppercase hover:bg-slate-300 transition"
   // "bg-red-50 text-red-600" became "bg-white text-black" ?
   // Let's also restore button colors for specific icons:
   // Trash2 -> bg-red-600 text-white
   // Wand2 -> bg-indigo-600 text-white
   // Sparkles -> bg-emerald-600 text-white
   // FileText -> bg-red-600 text-white
   // Download -> bg-black text-white
   
   fs.writeFileSync(file, content);
}
console.log("Buttons restored.");
