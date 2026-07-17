const fs = require('fs');

function stripAI(filePath) {
    if (!fs.existsSync(filePath)) return;
    let txt = fs.readFileSync(filePath, 'utf8');

    // 1. Remove import
    txt = txt.replace(/import \{ GoogleGenAI([^}]*)\} from "@google\/genai";\n?/g, '');

    // 2. We can just replace the body of the functions with empty to avoid curly brace mismatch in regex!
    // Or we simply replace "const ai = new GoogleGenAI" and return early!
    // "remove the parts that create programs using AI" -> we can just remove the buttons from UI.
    
    // For Module 4, 10, 11, 14, 16 the AI buttons are gone, or wait! I'll wipe the UI entirely!
    // Since I don't know the exact UI containers, replacing the function with "const handleAIOptimize = () => {};" is safest.
    
    txt = txt.replace(/const handleAIOptimize = async \(\) => \{[\s\S]*?alert\(".*?"\);\n\s*\}\n\s*\};\n?/g, 'const handleAIOptimize = () => {};\n');

    txt = txt.replace(/const handleAIParse = async \(\) => \{[\s\S]*?setIsAiLoading\(false\);\n\s*\}\n\s*\};\n?/g, 'const handleAIParse = () => {};\n');
    txt = txt.replace(/const handleAnalyzePdf = async \(e: any\) => \{[\s\S]*?setIsAiLoading\(false\);\n\s*\}\n\s*\};\n?/g, 'const handleAnalyzePdf = () => {};\n');
    txt = txt.replace(/const handlePdfUpload = async \(.*?\) => \{[\s\S]*?setIsAiLoading\(false\);\n\s*\}\n\s*\};\n?/g, 'const handlePdfUpload = () => {};\n');

    fs.writeFileSync(filePath, txt);
}

['./components/Module4.tsx', './components/Module10.tsx', './components/Module11.tsx', './components/Module14.tsx', './components/Module16.tsx'].forEach(stripAI);
console.log("Done");
