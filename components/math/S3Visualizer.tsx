import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generatePolygonVertices, generateDihedralGroup } from '../../services/mathUtils';
import { MathJax } from '../MathJax';
import { Play } from 'lucide-react';

const DihedralVisualizer: React.FC = () => {
  const [n, setN] = useState(3);
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  // Reduced radius and viewbox for a more compact presentation
  const radius = 80;
  // Use useMemo to prevent regeneration on every render
  const vertices = useMemo(() => generatePolygonVertices(n, radius), [n]);
  const groupElements = useMemo(() => generateDihedralGroup(n), [n]);

  const activeElement = useMemo(() => {
    return hoveredElementId ? groupElements.find(e => e.id === hoveredElementId) : null;
  }, [hoveredElementId, groupElements]);

  // Derived state
  const stabilizers = useMemo(() => {
    if (selectedVertex === null) return [];
    return groupElements.filter(el => el.action(selectedVertex, n) === selectedVertex);
  }, [selectedVertex, n, groupElements]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl gap-6">
      {/* Controls for N */}
      <div className="flex items-center gap-4 bg-slate-900/80 p-2 rounded-lg border border-slate-700 backdrop-blur-md z-10 shadow-lg">
        <span className="text-slate-300 font-serif text-sm">Group:</span>
        <select 
          value={n} 
          onChange={(e) => {
            setN(Number(e.target.value));
            setSelectedVertex(null);
            setHoveredElementId(null);
          }}
          className="bg-slate-950 border border-slate-600 text-white text-sm rounded px-2 py-1 outline-none focus:border-cyan-500"
        >
          {[3, 4, 5, 6].map(val => (
            <option key={val} value={val}>D{val} ({val}-gon)</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full items-start">
        {/* Visual Stage - Pure SVG implementation */}
        <div className="relative flex-1 w-full aspect-square md:aspect-auto md:h-[400px] bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden">
          {/* Legend/Status */}
          <div className="absolute top-3 left-3 z-10 text-[10px] text-slate-500 pointer-events-none">
             {activeElement ? (
               <span className="text-cyan-400 font-bold bg-slate-950/80 px-2 py-1 rounded border border-slate-700 shadow-sm">
                 Applying <MathJax latex={activeElement.latex} />
               </span>
             ) : (
               <span className="text-slate-500">Identity State</span>
             )}
          </div>

          <svg className="w-full h-full max-w-[400px] mx-auto" viewBox="-140 -140 280 280" preserveAspectRatio="xMidYMid meet">
             {/* Polygon Background */}
             <polygon 
               points={vertices.map(v => `${v.x},${v.y}`).join(' ')}
               fill="none" 
               stroke="#334155" 
               strokeWidth="2" 
             />
             
             {/* Center Point */}
             <circle cx="0" cy="0" r="2" fill="#475569" />
             
             {/* Dashed Lines to Vertices */}
             {vertices.map((v, idx) => (
                <line key={`dash-${idx}`} x1={0} y1={0} x2={v.x} y2={v.y} stroke="#334155" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
             ))}

             {/* Interactive Vertices */}
             <AnimatePresence>
                {vertices.map((v, index) => {
                   const isSelected = selectedVertex === index;
                   
                   // Determine target position based on active element action
                   // If we are applying an action, we move the vertex VISUALLY to its new location.
                   // The vertex at 'index' moves to the position of 'action(index)'.
                   const targetIndex = activeElement ? activeElement.action(index, n) : index;
                   const targetPos = vertices[targetIndex];

                   return (
                     <motion.g
                       key={`${n}-${index}`}
                       initial={false}
                       animate={{ 
                         x: targetPos.x,
                         y: targetPos.y,
                         scale: isSelected ? 1.1 : 1
                       }}
                       transition={{ type: "spring", stiffness: 200, damping: 20 }}
                       onClick={() => setSelectedVertex(isSelected ? null : index)}
                       style={{ cursor: 'pointer' }}
                     >
                       {/* Circle Body */}
                       <circle 
                         r={16} 
                         fill={isSelected ? "#22d3ee" : "#1e293b"} 
                         stroke={isSelected ? "#fff" : "#475569"} 
                         strokeWidth="2"
                         className="transition-colors duration-300"
                       />
                       {/* Label */}
                       <text 
                         y="4" 
                         textAnchor="middle" 
                         fill={isSelected ? "#000" : "#cbd5e1"} 
                         fontSize="12" 
                         fontWeight="bold" 
                         style={{ pointerEvents: 'none', userSelect: 'none' }}
                       >
                         {index + 1}
                       </text>
                     </motion.g>
                   );
                })}
              </AnimatePresence>
          </svg>
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-80 flex flex-col gap-3 h-[400px]">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col overflow-hidden shadow-lg">
             <div className="flex-shrink-0 mb-3 border-b border-slate-800 pb-2">
               <h4 className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                 {selectedVertex !== null ? `Analysis for Vertex ${selectedVertex + 1}` : 'Group Elements'}
               </h4>
             </div>
             
             {/* Stabilizer / Orbit Info if vertex selected */}
             {selectedVertex !== null && (
               <div className="flex-shrink-0 space-y-3 mb-3">
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Stabilizer</span>
                     <span className="text-[10px] text-slate-500">Fixes v</span>
                   </div>
                   <div className="flex flex-wrap gap-1">
                     {stabilizers.map(el => (
                       <span key={el.id} className="px-2 py-0.5 bg-amber-950 border border-amber-800 rounded text-amber-200 text-xs font-serif">
                         <MathJax latex={el.latex} />
                       </span>
                     ))}
                   </div>
                 </div>
                 
                 <div>
                   <div className="flex justify-between items-center mb-1">
                     <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Orbit</span>
                     <span className="text-[10px] text-slate-500">Reachable</span>
                   </div>
                   <div className="text-xs text-cyan-200/80 italic">
                     Transitive action: All {n} vertices.
                   </div>
                 </div>
               </div>
             )}

             {/* Action List */}
             <div className="flex-1 flex flex-col min-h-0">
                <div className="text-[10px] text-slate-500 mb-2 uppercase flex justify-between">
                  <span>ALL GROUP ELEMENTS</span>
                </div>
                <div className="overflow-y-auto custom-scrollbar space-y-1 pr-1 flex-1">
                  {groupElements.map(el => {
                    const target = selectedVertex !== null ? el.action(selectedVertex, n) + 1 : null;
                    const isStab = selectedVertex !== null && (target === selectedVertex + 1);
                    const isActive = hoveredElementId === el.id;

                    return (
                      <div 
                        key={el.id} 
                        onMouseEnter={() => setHoveredElementId(el.id)}
                        onMouseLeave={() => setHoveredElementId(null)}
                        onClick={() => setHoveredElementId(isActive ? null : el.id)}
                        className={`
                          flex justify-between items-center px-3 py-2 rounded text-xs cursor-pointer border transition-colors
                          ${isActive ? 'bg-slate-800 border-cyan-500/50' : 'bg-slate-900/50 border-transparent hover:bg-slate-800'}
                          ${isStab ? 'border-amber-900/50 bg-amber-900/10' : ''}
                        `}
                      >
                        <div className="flex items-center gap-2">
                           <span className={`w-12 font-serif text-sm ${isStab ? 'text-amber-200' : 'text-slate-200'}`}>
                             <MathJax latex={el.latex} />
                           </span>
                           <span className="text-[10px] text-slate-500 hidden sm:inline">{el.name}</span>
                        </div>
                        
                        {selectedVertex !== null ? (
                          <div className="flex items-center gap-2">
                             <span className="text-slate-600">→</span>
                             <span className={`font-bold w-4 text-center ${isStab ? 'text-amber-400' : 'text-cyan-400'}`}>
                               {target}
                             </span>
                          </div>
                        ) : (
                          isActive && <Play size={10} className="text-cyan-400 fill-cyan-400" />
                        )}
                      </div>
                    )
                  })}
                </div>
             </div>
          </div>
          
          <div className="bg-slate-900 px-4 py-3 rounded-lg border border-slate-800 flex justify-between items-center shadow-lg flex-shrink-0">
             <span className="text-xs text-slate-500 font-bold">Theorem</span>
             <div className="text-sm font-serif text-slate-200">
                <MathJax latex={`|D_${n}| = ${n} \\cdot 2 = ${2*n}`} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DihedralVisualizer;