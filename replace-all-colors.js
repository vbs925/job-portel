const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Replace specific combinations to maintain styling consistency
      content = content.replace(/bg-teal-600/g, 'bg-slate-900');
      content = content.replace(/hover:bg-teal-700/g, 'hover:bg-black');
      content = content.replace(/text-teal-600/g, 'text-slate-900');
      content = content.replace(/hover:text-teal-600/g, 'hover:text-black');
      content = content.replace(/text-teal-700/g, 'text-slate-800');
      content = content.replace(/text-teal-500/g, 'text-slate-600');
      content = content.replace(/text-teal-400/g, 'text-slate-500');
      content = content.replace(/text-teal-300/g, 'text-slate-400');
      content = content.replace(/bg-teal-500/g, 'bg-slate-800');
      content = content.replace(/bg-teal-400/g, 'bg-slate-500');
      content = content.replace(/bg-teal-300/g, 'bg-slate-300');
      content = content.replace(/bg-teal-200/g, 'bg-slate-200');
      content = content.replace(/bg-teal-100/g, 'bg-slate-100');
      content = content.replace(/bg-teal-50/g, 'bg-slate-50');
      content = content.replace(/border-teal-600/g, 'border-slate-900');
      content = content.replace(/border-teal-500/g, 'border-slate-800');
      content = content.replace(/border-teal-400/g, 'border-slate-400');
      content = content.replace(/border-teal-300/g, 'border-slate-300');
      content = content.replace(/border-teal-200/g, 'border-slate-200');
      content = content.replace(/border-teal-100/g, 'border-slate-100');
      content = content.replace(/ring-teal-400/g, 'ring-slate-400');
      content = content.replace(/shadow-teal-100/g, 'shadow-slate-100');
      content = content.replace(/shadow-teal-200/g, 'shadow-slate-200');
      content = content.replace(/shadow-teal-300/g, 'shadow-slate-300');
      content = content.replace(/shadow-teal-500/g, 'shadow-slate-500');
      content = content.replace(/shadow-teal-600/g, 'shadow-slate-900');
      content = content.replace(/from-teal-600/g, 'from-slate-900');
      content = content.replace(/to-emerald-500/g, 'to-slate-700');
      content = content.replace(/from-teal-500/g, 'from-slate-800');
      content = content.replace(/border-t-teal-600/g, 'border-t-slate-900');
      
      // Also replace blue occurrences
      content = content.replace(/blue-500/g, 'slate-600');
      content = content.replace(/blue-600/g, 'slate-800');
      content = content.replace(/blue-700/g, 'black');
      content = content.replace(/blue-50/g, 'slate-50');
      content = content.replace(/blue-200/g, 'slate-200');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'frontend/src'));
console.log('Global replacement complete.');
