const fs = require('fs');
let txt = fs.readFileSync('./components/Module4.tsx', 'utf8');

// remove import
txt = txt.replace(/import \{ GoogleGenAI.*?\} from "@google\/genai";\n/g, '');

// remove handleAIParse
txt = txt.replace(/const handleAIParse = async \(\) => \{[\s\S]*?\n  \};\n/, '');

// remove handlePdfUpload
txt = txt.replace(/const handlePdfUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\n  \};\n/, '');

// remove references to pdfInputRef and aiInput
txt = txt.replace(/const \[aiInput, setAiInput\] = useState\(\"\"\);\n/g, '');
txt = txt.replace(/const \[isAiLoading, setIsAiLoading\] = useState\(false\);\n/g, '');
txt = txt.replace(/const pdfInputRef = useRef<HTMLInputElement>\(null\);\n/g, '');

// in case there are multiple
txt = txt.replace(/const handleAIParse = async \(\) => \{[\s\S]*?\n  \};\n/g, '');
txt = txt.replace(/const handlePdfUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\n  \};\n/g, '');

fs.writeFileSync('./components/Module4.tsx', txt);
console.log("M4 done");
