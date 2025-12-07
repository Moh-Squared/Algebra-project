import React, { useState } from 'react';
import { Download, FileText, Film, Code, ChevronDown, PenTool, FolderOpen } from 'lucide-react';
import { MathJax } from './MathJax';

const RESOURCE_FILES = [
  'resources/pdfs/LectureNotes.pdf',
  'resources/pdfs/HandwrittenDrafts.pdf',
  'resources/pdfs/OriginalPapers.pdf',
  'resources/videos/CauchyModernProof.mp4',
  'resources/videos/CauchyProof.mp4',
  'resources/videos/ConjugacyAndClassEq.mp4',
  'resources/videos/CorrespondenceTheorem.mp4',
  'resources/videos/DoubleCosetsAndCauchy.mp4',
  'resources/videos/GroupActionsDetailed.mp4',
  'resources/videos/LagrangeMethodRefined.mp4',
  'resources/videos/OrbitStabilizerTheorem.mp4',
  'resources/videos/QuinticFailure.mp4',
  'resources/videos/SylowMasterScene.mp4'
];

const Hero: React.FC = () => {
  const [showDownloads, setShowDownloads] = useState(false);

  const handleDownloadAll = () => {
    if (!confirm(`This will download ${RESOURCE_FILES.length} files. Continue?`)) return;
    
    RESOURCE_FILES.forEach((file, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = file;
        link.download = file.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300); // Stagger to avoid browser blocking
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-center px-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-chalk.png')] opacity-20 pointer-events-none"></div>
      
      <div className="z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        <div className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
          Modern Algebra Project
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 serif">
          The Road to Sylow
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          From the unsolvability of the Quintic to the structural beauty of <MathJax latex="p" />-groups.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 flex-wrap">
          <button 
            onClick={() => setShowDownloads(true)}
            className="flex items-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-cyan-900/20"
          >
            <FolderOpen size={20} />
            Browse Resources
          </button>
          <button 
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-all border border-slate-700"
          >
            <Download size={18} />
            Download All
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
        <ChevronDown size={32} />
      </div>

      {showDownloads && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowDownloads(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-slate-700 pb-4">
               <h3 className="text-2xl font-bold text-white serif">Project Resources</h3>
               <button onClick={handleDownloadAll} className="text-xs text-cyan-400 hover:underline">Download All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DownloadItem icon={<PenTool className="text-pink-400"/>} label="Handwritten Drafts" desc="resources/pdfs/HandwrittenDrafts.pdf" />
              <DownloadItem icon={<FileText className="text-rose-400"/>} label="Lecture Notes" desc="resources/pdfs/LectureNotes.pdf" />
              <DownloadItem icon={<FileText className="text-amber-400"/>} label="Original Papers" desc="resources/pdfs/OriginalPapers.pdf" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Orbit Stabilizer" desc="resources/videos/OrbitStabilizerTheorem.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Correspondence" desc="resources/videos/CorrespondenceTheorem.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Class Equation" desc="resources/videos/ConjugacyAndClassEq.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Lagrange" desc="resources/videos/LagrangeMethodRefined.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Cauchy Proof" desc="resources/videos/CauchyProof.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Quintic Failure" desc="resources/videos/QuinticFailure.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Group Actions" desc="resources/videos/GroupActionsDetailed.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Cauchy Modern" desc="resources/videos/CauchyModernProof.mp4" />
              <DownloadItem icon={<Film className="text-cyan-400"/>} label="Sylow Theorems" desc="resources/videos/SylowMasterScene.mp4" />
            </div>
            <button 
              onClick={() => setShowDownloads(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DownloadItem = ({ icon, label, desc }: { icon: React.ReactNode, label: string, desc: string }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/30 transition-all cursor-pointer group"
       onClick={() => {
         const link = document.createElement('a');
         link.href = desc;
         link.download = desc.split('/').pop() || 'file';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       }}>
    <div className="p-3 bg-slate-950 rounded-lg group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="text-left overflow-hidden">
      <div className="font-semibold text-slate-200 truncate">{label}</div>
      <div className="text-xs text-slate-400 truncate">{desc}</div>
    </div>
    <Download size={16} className="ml-auto text-slate-500 group-hover:text-white shrink-0" />
  </div>
);

export default Hero;
