const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/app/job/[id]/page.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Replace teal classes with slate/black equivalents
content = content.replace(/text-teal-600/g, 'text-slate-900');
content = content.replace(/hover:text-teal-600/g, 'hover:text-slate-900');
content = content.replace(/bg-teal-600/g, 'bg-slate-900');
content = content.replace(/hover:bg-teal-700/g, 'hover:bg-black');
content = content.replace(/shadow-teal-600\/30/g, 'shadow-slate-900/30');
content = content.replace(/from-teal-400 to-teal-600/g, 'from-slate-600 to-slate-900');
content = content.replace(/text-teal-500/g, 'text-slate-500');
content = content.replace(/bg-teal-500/g, 'bg-slate-700');
content = content.replace(/hover:bg-teal-600/g, 'hover:bg-slate-800');
content = content.replace(/shadow-teal-500\/20/g, 'shadow-slate-700/20');
content = content.replace(/bg-teal-400/g, 'bg-slate-400');
content = content.replace(/bg-teal-50/g, 'bg-slate-50');
content = content.replace(/border-teal-200\/60/g, 'border-slate-200/60');
content = content.replace(/shadow-\[0_20px_50px_rgb\(20,184,166,0\.15\)\]/g, 'shadow-[0_20px_50px_rgb(15,23,42,0.1)]');
content = content.replace(/text-teal-900/g, 'text-slate-900');
content = content.replace(/text-teal-700/g, 'text-slate-700');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully replaced teal colors with slate in JD page.');
