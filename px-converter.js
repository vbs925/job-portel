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
      
      // 1. Text sizes to Px
      content = content.replace(/\btext-xs\b/g, 'text-[12px]');
      content = content.replace(/\btext-sm\b/g, 'text-[14px]');
      content = content.replace(/\btext-base\b/g, 'text-[16px]');
      content = content.replace(/\btext-lg\b/g, 'text-[18px]');
      content = content.replace(/\btext-xl\b/g, 'text-[20px]');
      content = content.replace(/\btext-2xl\b/g, 'text-[24px]');
      content = content.replace(/\btext-3xl\b/g, 'text-[30px]');
      content = content.replace(/\btext-4xl\b/g, 'text-[36px]');
      content = content.replace(/\btext-5xl\b/g, 'text-[48px]');
      content = content.replace(/\btext-6xl\b/g, 'text-[60px]');
      content = content.replace(/\btext-7xl\b/g, 'text-[72px]');

      // 2. Standardize Buttons
      // We will look for <button ... className="..."> and try to standardize common button patterns.
      // Since buttons have highly variable classes, we will aggressively replace primary button clusters.
      
      // Replace Apply Now / Main Call to Action buttons
      content = content.replace(/bg-slate-900 text-white font-medium px-5 py-2 rounded-full hover:bg-black transition-colors text-\[14px\]/g, 'bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-colors');
      
      content = content.replace(/bg-slate-900 text-white font-bold px-5 py-2\.5 rounded-xl hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-slate-900\/30/g, 'bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-all disabled:opacity-40 disabled:cursor-not-allowed');

      content = content.replace(/px-8 py-3\.5 font-black text-white rounded-xl shadow-2xl shadow-slate-500\/30 hover:-translate-y-0\.5 hover:shadow-slate-500\/50 transition-all/g, 'font-bold text-[16px] text-white px-[32px] py-[16px] rounded-[12px] shadow-2xl hover:-translate-y-0.5 transition-all bg-slate-900 hover:bg-black');

      content = content.replace(/px-5 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-black transition-colors/g, 'bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-colors');
      
      content = content.replace(/px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black transition-colors/g, 'bg-slate-900 text-white font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-black transition-colors');

      content = content.replace(/w-full flex items-center justify-center gap-2\.5 py-4 rounded-2xl font-black text-\[16px\] text-white shadow-2xl shadow-slate-500\/30 hover:-translate-y-0\.5 hover:shadow-slate-500\/50 transition-all/g, 'w-full flex items-center justify-center gap-2.5 py-[16px] rounded-[12px] font-bold text-[16px] text-white hover:-translate-y-0.5 transition-all bg-slate-900 hover:bg-black');

      // Common secondary buttons
      content = content.replace(/px-3\.5 py-2\.5 bg-slate-100 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-colors border-2 border-transparent hover:border-slate-200/g, 'bg-white text-slate-800 border border-slate-200 font-bold text-[14px] px-[24px] py-[12px] rounded-[12px] hover:bg-slate-50 transition-colors');

      content = content.replace(/w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-slate-300 hover:text-slate-600 text-\[14px\] font-semibold transition-all/g, 'w-full flex items-center justify-center gap-2 px-[24px] py-[12px] border border-dashed border-slate-300 rounded-[12px] text-slate-500 hover:border-slate-400 hover:text-slate-700 text-[14px] font-bold transition-all');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated Typography & Buttons: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'frontend/src'));
console.log('Global Px conversion complete.');
