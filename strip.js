const fs = require('fs');
const path = './components/Module4.tsx';
let txt = fs.readFileSync(path, 'utf8');

// remove import
txt = txt.replace(/import \{ GoogleGenAI.*?\} from "@google\/genai";\n/g, '');

// remove handleAIParse
txt = txt.replace(/const handleAIParse = async \(\) => \{[\s\S]*?\n  \};\n/g, '');

// remove handlePdfUpload
txt = txt.replace(/const handlePdfUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\n  \};\n/g, '');

// remove references to pdfInputRef and aiInput
txt = txt.replace(/const \[aiInput, setAiInput\] = useState\(\"\"\);\n/g, '');
txt = txt.replace(/const \[isAiLoading, setIsAiLoading\] = useState\(false\);\n/g, '');
txt = txt.replace(/const pdfInputRef = useRef<HTMLInputElement>\(null\);\n/g, '');

// wait, the previous ones didn't match fully because they use nested blocks!
fs.writeFileSync(path, txt);
console.log("M4 prepared for full ast parsing if needed, but going regex.");
