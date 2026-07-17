const fs = require('fs');
const text = fs.readFileSync('./components/Module11.tsx', 'utf8');
const start = text.indexOf('const handleSmartDistribute = (params: DistributeParams) => {');
const end = text.indexOf('const handleAIOptimize', start);
console.log(text.substring(start, end));
