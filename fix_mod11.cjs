const fs = require('fs');

const f = './components/Module11.tsx';
let txt = fs.readFileSync(f, 'utf8');

// remove generatePlannerHtml entirely
txt = txt.replace(/const generatePlannerHtml = \(\) => \{[\s\S]*?\n  \};\n\n/g, "");

const replacement = `const handleDownloadPdf = async () => {
    if (!captureRef.current) return;
    
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '-10000px';
    container.style.left = '-10000px';
    container.style.width = '1400px';
    container.style.zIndex = '-1';
    document.body.appendChild(container);

    const inputs = captureRef.current.querySelectorAll('input, textarea');
    inputs.forEach((input) => input.setAttribute('data-capture-value', input.value));

    const clone = captureRef.current.cloneNode(true);
    clone.style.width = '1400px';
    clone.style.height = 'auto';
    clone.style.transform = 'none';
    clone.style.borderRadius = '0';
    clone.style.boxShadow = 'none';
    container.appendChild(clone);

    // Replace inputs 
    const clonedInputs = clone.querySelectorAll('input, textarea');
    clonedInputs.forEach((input) => {
        const val = input.getAttribute('data-capture-value') || '';
        const div = document.createElement('div');
        div.textContent = val;
        div.className = input.className;
        div.style.border = 'none';
        div.style.outline = 'none';
        div.style.background = 'transparent';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.whiteSpace = 'pre-wrap';
        if(input.tagName === 'TEXTAREA') {
            div.style.whiteSpace = 'pre-wrap';
            div.style.wordBreak = 'break-word';
        }
        if (input.placeholder === "ÖĞRENCİ ADI SOYADI" || input.placeholder === "ÖĞRENCİ İSMİ GİRİN") {
            div.style.fontSize = '24px';
            div.style.fontWeight = '900';
        }
        const computed = window.getComputedStyle(input);
        div.style.color = computed.color;
        div.style.fontSize = computed.fontSize;
        div.style.fontWeight = computed.fontWeight;
        
        if (input.parentNode) {
            input.parentNode.replaceChild(div, input);
        }
    });

    try {
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            windowWidth: 1400,
            windowHeight: clone.scrollHeight
        });
        
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgRatio = canvas.width / canvas.height;
        let finalWidth = pdfWidth;
        let finalHeight = finalWidth / imgRatio;
        
        if (finalHeight > pdfHeight) {
            finalHeight = pdfHeight;
            finalWidth = finalHeight * imgRatio;
        }
        
        const xOffset = (pdfWidth - finalWidth) / 2;
        const yOffset = (pdfHeight - finalHeight) / 2;
        
        pdf.addImage(imgData, 'JPEG', xOffset, yOffset, finalWidth, finalHeight);
        pdf.save(\`Zaman_Planli_Tablo_\${studentName.replace(/\\s+/g, '_') || 'Ogrenci'}.pdf\`);
    } catch (err) {
        console.error("PDF Download failed", err);
        alert("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
        document.body.removeChild(container);
    }
  };`;

txt = txt.replace(/const handleDownloadPdf = async \(\) => \{[\s\S]*?\}\n  \};\n/g, replacement + "\n");

fs.writeFileSync(f, txt);
console.log("Fixed module 11");
