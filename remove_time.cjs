const fs = require('fs');

function removeTimeFromModule4() {
    let f = './components/Module4.tsx';
    if(fs.existsSync(f)) {
        let txt = fs.readFileSync(f, 'utf8');
        txt = txt.replace(/GÜNLÜK TOPLAM & SÜRE/g, "GÜNLÜK TOPLAM");
        txt = txt.replace(/\{\s*\(hours > 0 \|\| mins > 0\)\s*&&\s*\([\s\S]*?<div className="mt-1 pt-1 border-t border-black\/20 w-full text-center">[\s\S]*?<span className="text-\[10px\] font-black text-black">⏱ \{hours\}sa \{mins\}dk<\/span>[\s\S]*?<\/div>\s*\)\s*\}/g, "");
        fs.writeFileSync(f, txt);
    }
}

function removeTimeFromModule16() {
    let f = './components/Module16.tsx';
    if(fs.existsSync(f)) {
        let txt = fs.readFileSync(f, 'utf8');
        txt = txt.replace(/GÜNLÜK TOPLAM & SÜRE/g, "GÜNLÜK TOPLAM");
        txt = txt.replace(/<div className="mt-1 pt-1 border-t border-black\/50 w-full text-center">\s*<span className="text-\[11px\] font-black text-black">⏱ \{hours\}sa \{mins\}dk<\/span>\s*<\/div>/g, "");
        fs.writeFileSync(f, txt);
    }
}

function removeTimeFromModule14() {
    let f = './components/Module14.tsx';
    if(fs.existsSync(f)) {
        let txt = fs.readFileSync(f, 'utf8');
        txt = txt.replace(/GÜNLÜK TOPLAM & SÜRE/g, "GÜNLÜK TOPLAM");
        txt = txt.replace(/\{\s*\(hours > 0 \|\| mins > 0\)\s*&&\s*\(\s*<div className="text-\[9px\] font-black text-black mt-1 pt-1 border-t border-black\/10 w-full text-center">⏱ \{hours\}sa \{mins\}dk<\/div>\s*\)\s*\}/g, "");
        fs.writeFileSync(f, txt);
    }
}

function removeTimeFromModule11() {
    let f = './components/Module11.tsx';
    if(fs.existsSync(f)) {
        let txt = fs.readFileSync(f, 'utf8');
        txt = txt.replace(/<div className="text-\[10px\] font-black text-black mt-1 pt-1 border-t border-black\/10 w-full text-center">⏱ \{h\}sa \{m\}dk<\/div>/g, "");
        fs.writeFileSync(f, txt);
    }
}

function removeTimeFromDistributionWizard() {
    let f = './components/DistributionWizard.tsx';
    if(fs.existsSync(f)) {
        let txt = fs.readFileSync(f, 'utf8');
        txt = txt.replace(/<div className="w-px h-8 bg-slate-200 hidden sm:block" \/>[\s\S]*?<div className="flex flex-col">[\s\S]*?<span className="text-\[10px\] font-bold text-slate-400 uppercase tracking-widest">Tahmini Günlük Süre<\/span>[\s\S]*?<span className="text-xl font-black text-indigo-600 leading-tight">[\s\S]*?\{hrs > 0 \? `\$\{hrs\}sa ` : ''\}\{mns\}dk[\s\S]*?<\/span>[\s\S]*?<\/div>/g, "");
        fs.writeFileSync(f, txt);
    }
}

removeTimeFromModule4();
removeTimeFromModule16();
removeTimeFromModule14();
removeTimeFromModule11();
removeTimeFromDistributionWizard();
console.log("Times removed.");
