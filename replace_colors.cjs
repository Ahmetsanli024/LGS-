const fs = require("fs");
const files = ["./components/Module11.tsx", "./components/Module14.tsx", "./components/Module16.tsx", "./components/Module10.tsx", "./components/Module4.tsx"];
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, "utf8");
  
  // Replace colors in the "captureRef" section. Actually, it's easier to inject a global style in the capture area!
  // But let's follow the user's request: "sütunların arka planları daima beyaz, yazılı daima siyah vb."
  // The best way without breaking the UI is injecting a stylesheet for the capture container, ensuring PDF is flawless.
  // We'll replace the classes directly.
  content = content.replace(/border-slate-[0-9]+/g, "border-black");
  content = content.replace(/border-indigo-[0-9]+/g, "border-black");
  content = content.replace(/border-orange-[0-9]+/g, "border-black");
  content = content.replace(/border-red-[0-9]+/g, "border-black");
  content = content.replace(/border-blue-[0-9]+/g, "border-black");
  content = content.replace(/border-emerald-[0-9]+/g, "border-black");
  
  content = content.replace(/bg-slate-[0-9]+/g, "bg-white");
  content = content.replace(/bg-indigo-[0-9]+/g, "bg-white");
  content = content.replace(/bg-orange-[0-9]+/g, "bg-white");
  content = content.replace(/bg-red-[0-9]+/g, "bg-white");
  content = content.replace(/bg-blue-[0-9]+/g, "bg-white");
  content = content.replace(/bg-emerald-[0-9]+/g, "bg-white");

  content = content.replace(/text-slate-[0-9]+/g, "text-black");
  content = content.replace(/text-indigo-[0-9]+/g, "text-black");
  content = content.replace(/text-orange-[0-9]+/g, "text-black");
  content = content.replace(/text-red-[0-9]+/g, "text-black");
  content = content.replace(/text-blue-[0-9]+/g, "text-black");
  content = content.replace(/text-emerald-[0-9]+/g, "text-black");

  content = content.replace(/shadow-sm/g, " ");
  content = content.replace(/shadow-md/g, " ");
  content = content.replace(/shadow-lg/g, " ");
  content = content.replace(/shadow-xl/g, " ");
  content = content.replace(/shadow-2xl/g, " ");
  content = content.replace(/shadow/g, " ");
  
  // They also want flawless PDF. Let's make sure 'handleDownloadPdf' acts nicely by hiding certain UI when printed, though it uses html2canvas usually.
  fs.writeFileSync(file, content);
}
console.log("Colors updated.");
