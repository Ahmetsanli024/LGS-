const fs = require('fs');

function stripAIFunction(content, funcName) {
    const startIdx = content.indexOf(`const ${funcName}`);
    if (startIdx === -1) return content;
    
    // find index of "};" that represents end of function
    // assuming it is top level formatting it closes at column 0 or 2. Let's use a bracket counter.
    let count = 0;
    let started = false;
    let endIdx = -1;
    
    for (let i = startIdx; i < content.length; i++) {
        if (content[i] === '{') {
            count++;
            started = true;
        } else if (content[i] === '}') {
            count--;
        }
        
        if (started && count === 0) {
            endIdx = i + 1;
            // check for semicolon
            if (content[endIdx] === ';') endIdx++;
            break;
        }
    }
    
    if (endIdx !== -1) {
        return content.substring(0, startIdx) + content.substring(endIdx);
    }
    
    return content;
}

const modules = [
    './components/Module4.tsx',
    './components/Module10.tsx',
    './components/Module11.tsx',
    './components/Module14.tsx',
    './components/Module16.tsx',
    './components/DistributionWizard.tsx'
];

modules.forEach(file => {
    if (!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');
    
    // Strip imports
    txt = txt.replace(/import \{.*?GoogleGenAI.*?\} from "@google\/genai";\n?/g, '');
    
    // Strip functions manually
    txt = stripAIFunction(txt, 'handleAIOptimize');
    txt = stripAIFunction(txt, 'handleAIParse');
    txt = stripAIFunction(txt, 'handleAnalyzePdf');
    txt = stripAIFunction(txt, 'handlePdfUpload');
    
    // UI cleanups (Regex to catch the common AI button)
    txt = txt.replace(/<button[^>]*onClick=\{handleAIOptimize\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
    txt = txt.replace(/<button[^>]*onClick=\{handleAIParse\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
    txt = txt.replace(/<button[^>]*onClick=\{handleAnalyzePdf\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
    txt = txt.replace(/<button[^>]*onClick=\{handlePdfUpload\}[^>]*>[\s\S]*?<\/button>\n?/g, '');
    
    // Clean up aiInput / pdfInputRef hooks if they exist but fail silently otherwise.
    txt = txt.replace(/const \[aiInput, setAiInput\] = useState.*/g, '');
    txt = txt.replace(/const \[isAiLoading, setIsAiLoading\] = useState.*/g, '');
    
    fs.writeFileSync(file, txt);
});
console.log("Stripped AI components");
