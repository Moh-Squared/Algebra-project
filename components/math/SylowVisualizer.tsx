import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MathJax } from '../MathJax';

type Tab = 'proof' | 'counting';

const EXAMPLES = [
  { order: 6, p: 3, m: 2, candidates: [1] }, // n3 | 2, n3 = 1 mod 3 => 1.
  { order: 12, p: 3, m: 4, candidates: [1, 4] }, // n3 | 4, n3 = 1 mod 3 => 1, 4.
  { order: 15, p: 3, m: 5, candidates: [1] }, // n3 | 5, n3 = 1 mod 3 => 1. (5 is 2 mod 3)
  { order: 15, p: 5, m: 3, candidates: [1] }, // n5 | 3, n5 = 1 mod 5 => 1.
  { order: 20, p: 5, m: 4, candidates: [1] }, // n5 | 4, n5 = 1 mod 5 => 1.
  { order: 24, p: 2, m: 3, candidates: [1, 3] }, // n2 | 3, n2 = 1 mod 2 => 1, 3.
];

const SylowVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('proof');

  return (
    <div className="w-full max-w-4xl flex flex-col bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('proof')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'proof' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Theorem 1: Existence
        </button>
        <button
          onClick={() => setActiveTab('counting')}
          className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${
            activeTab === 'counting' ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Theorems 2 & 3: Counting
        </button>
      </div>

      <div className="p-6 min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'proof' ? <ProofMap key="proof" /> : <CountingAnalyzer key="counting" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Tab 1: Proof Map ---

const ProofMap: React.FC = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = [
    { id: 'start', label: 'Start: Induct on |G|', x: 250, y: 30, color: '#e2e8f0', desc: 'Base case is trivial. Assume theorem holds for all groups smaller than G.' },
    { id: 'center', label: 'Check Z(G)', x: 250, y: 100, color: '#94a3b8', desc: 'We look at the center of the group to split into two cases.' },
    { id: 'case1', label: 'Case 1: p divides |Z(G)|', x: 120, y: 180, color: '#22d3ee', desc: 'Abelian-ish case. Since Z(G) is abelian, we can easily find an element of order p.' },
    { id: 'case2', label: 'Case 2: p ∤ |Z(G)|', x: 380, y: 180, color: '#f43f5e', desc: 'Non-Abelian case. We must look elsewhere in the group.' },
    { id: 'cauchy', label: 'Cauchy\'s Thm on Z(G)', x: 60, y: 260, color: '#0ea5e9', desc: 'Find normal subgroup N of order p in Z(G).' },
    { id: 'quotient', label: 'Consider G/N', x: 180, y: 260, color: '#0ea5e9', desc: 'G/N is smaller than G, so Inductive Hypothesis applies!' },
    { id: 'classEq', label: 'Class Equation', x: 380, y: 260, color: '#e11d48', desc: '|G| = |Z| + Sum(|Orb|). Analyze modulo p.' },
    { id: 'index', label: 'Find p ∤ [G:H]', x: 380, y: 340, color: '#e11d48', desc: 'There exists a proper subgroup H where p does not divide index. Thus p^alpha divides |H|.' },
  ];

  const edges = [
    { from: 'start', to: 'center' },
    { from: 'center', to: 'case1' },
    { from: 'center', to: 'case2' },
    { from: 'case1', to: 'cauchy' },
    { from: 'case1', to: 'quotient' },
    { from: 'case2', to: 'classEq' },
    { from: 'classEq', to: 'index' },
  ];

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6">
      <div className="relative flex-1 h-[400px] border border-slate-700/50 rounded-xl bg-slate-950/30 overflow-hidden">
        <svg viewBox="0 0 500 400" className="w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
            </marker>
          </defs>
          
          {edges.map((edge, i) => {
            const start = nodes.find(n => n.id === edge.from)!;
            const end = nodes.find(n => n.id === edge.to)!;
            return (
              <line 
                key={i} 
                x1={start.x} y1={start.y + 20} 
                x2={end.x} y2={end.y - 20} 
                stroke="#475569" 
                strokeWidth="2" 
                markerEnd="url(#arrowhead)" 
              />
            );
          })}

          {nodes.map(node => {
            const isActive = activeNode === node.id;
            return (
              <g 
                key={node.id} 
                onClick={() => setActiveNode(node.id)}
                className="cursor-pointer transition-all hover:opacity-80"
              >
                <rect 
                  x={node.x - 60} 
                  y={node.y - 20} 
                  width="120" 
                  height="40" 
                  rx="20" 
                  fill={isActive ? node.color : '#1e293b'} 
                  stroke={node.color}
                  strokeWidth={isActive ? 3 : 1}
                />
                <foreignObject x={node.x - 60} y={node.y - 20} width="120" height="40" style={{pointerEvents: 'none'}}>
                  <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold text-center leading-tight px-2 ${isActive ? 'text-black' : 'text-slate-200'}`}>
                    {node.label}
                  </div>
                </foreignObject>
              </g>
            )
          })}
        </svg>
      </div>
      
      <div className="md:w-64 flex flex-col justify-center">
        <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 min-h-[150px]">
          <h4 className="text-sm font-bold text-white mb-2">
            {activeNode ? nodes.find(n => n.id === activeNode)?.label : "Interactive Proof"}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {activeNode ? nodes.find(n => n.id === activeNode)?.desc : "Click on a node in the diagram to explore the logic of Sylow's First Theorem."}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Tab 2: Counting & Conjugacy ---

const CountingAnalyzer: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const data = EXAMPLES[selectedIndex];

  // Calculate Divisors
  const divisors = Array.from({ length: data.m }, (_, i) => i + 1).filter(d => data.m % d === 0);
  
  // Logic for visual
  // Theorem 3 says np = 1 mod p.
  // We visualize the set of Sylow subgroups being acted on by conjugation.
  // There is always at least one fixed point P1 (acting on itself).
  // The size of orbits must divide |P| = p^alpha, so orbit sizes are 1, p, p^2...
  // Usually we depict this as 1 (center) + k*p (orbits).

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-center bg-slate-800/50 p-3 rounded-lg border border-slate-700">
        <span className="text-xs font-bold text-slate-400 uppercase">Scenario:</span>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`px-3 py-1 text-xs rounded border transition-all ${
              selectedIndex === i 
                ? 'bg-amber-500/20 border-amber-500 text-amber-200' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
            }`}
          >
            |G|={ex.order}, p={ex.p}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Analysis Panel */}
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-3 rounded border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase">Analysis</div>
              <div className="text-lg font-serif">
                <MathJax latex={`|G| = ${data.order} = ${data.p}^\\alpha \\cdot ${data.m}`} />
              </div>
            </div>
            <div className="bg-slate-900 p-3 rounded border border-slate-700">
               <div className="text-[10px] text-slate-500 uppercase">Sylow Order</div>
               <div className="text-lg font-serif">
                <MathJax latex={`|P| = ${Math.pow(data.p, Math.round(Math.log(data.order/data.m)/Math.log(data.p)))}`} />
               </div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold text-amber-400 uppercase">Applying Theorem 3</h5>
            
            <div className="flex items-center justify-between text-sm border-b border-slate-800 pb-1">
              <span>Condition 1: <MathJax latex={`n_${data.p} \\mid m`} /></span>
              <span className="font-mono text-slate-400">Divisors of {data.m}: {divisors.join(', ')}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm border-b border-slate-800 pb-1">
              <span>Condition 2: <MathJax latex={`n_${data.p} \\equiv 1 \\pmod{${data.p}}`} /></span>
              <span className="font-mono text-slate-400">
                {divisors.map(d => (
                  <span key={d} className={d % data.p === 1 ? 'text-green-400 font-bold ml-2' : 'text-rose-900 line-through ml-2'}>
                    {d}
                  </span>
                ))}
              </span>
            </div>

            <div className="p-3 bg-amber-900/10 border border-amber-900/30 rounded text-center mt-2">
              <span className="text-sm text-amber-200">
                Possible Number of Subgroups: <span className="font-bold text-lg">{data.candidates.join(' or ')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Visual Panel - Orbits */}
        <div className="flex-1 aspect-square md:aspect-auto md:h-64 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
           <div className="absolute top-2 left-2 text-[10px] text-slate-500 uppercase tracking-wider">
             Orbit Structure of Conjugation
           </div>
           
           {/* If there is only 1 candidate and it is 1, show Normal Subgroup */}
           {data.candidates.length === 1 && data.candidates[0] === 1 ? (
             <div className="flex flex-col items-center">
               <motion.div 
                 initial={{ scale: 0 }} animate={{ scale: 1 }}
                 className="w-16 h-16 rounded-full border-4 border-emerald-500 bg-emerald-500/20 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
               >
                 <span className="font-serif font-bold text-emerald-100">P</span>
               </motion.div>
               <span className="text-xs text-emerald-400 font-bold">Unique & Normal</span>
             </div>
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               {/* Show the largest candidate for visualization purposes if multiple exist, or just the first */}
               {/* For visualization, let's show the non-trivial case if possible. e.g. for Order 12, show 4 */}
               <OrbitVisual n={data.candidates.includes(4) ? 4 : data.candidates[data.candidates.length-1]} p={data.p} />
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const OrbitVisual: React.FC<{ n: number, p: number }> = ({ n, p }) => {
  // Visualize 1 central node + (n-1) nodes in orbit
  // This is a schematic representation of "1 + kp"
  const orbitSize = n - 1;
  const radius = 60;
  
  return (
    <div className="relative w-48 h-48">
      {/* Central Node P1 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-200">
           <span className="text-amber-900 font-bold text-xs">P₁</span>
        </div>
      </div>

      {/* Orbit Ring */}
      <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r={radius} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" fill="none" />
      </svg>

      {/* Orbit Nodes */}
      {orbitSize > 0 && Array.from({ length: orbitSize }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / orbitSize;
        const x = 96 + radius * Math.cos(angle) - 12; // 96 is roughly center (192/2) minus half width
        const y = 96 + radius * Math.sin(angle) - 12;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="absolute w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center border border-cyan-400 shadow-lg"
            style={{ left: x, top: y }}
          >
          </motion.div>
        );
      })}
      
      <div className="absolute bottom-2 w-full text-center text-xs text-slate-500">
         <MathJax latex={`n_${p} = 1 + ${n-1} = ${n}`} />
      </div>
    </div>
  );
}

export default SylowVisualizer;
