import React, { useState } from 'react';
import { MathJax } from '../MathJax';

type Node = { id: string; label: string; y: number; size: number; xOffset?: number };
type Scenario = {
  id: string;
  name: string;
  groupLabel: string;
  quotientLabel: string;
  leftNodes: Node[];
  rightNodes: Node[];
  leftEdges: number[][]; 
  rightEdges: number[][];
  connections: number[][];
};

const SCENARIOS: Record<string, Scenario> = {
  Z12: {
    id: 'Z12',
    name: 'Cyclic Z12 / <4>',
    groupLabel: '\\mathbb{Z}_{12}',
    quotientLabel: '\\mathbb{Z}_4',
    leftNodes: [
      { id: 'G', label: '\\mathbb{Z}_{12}', y: 50, size: 12 },
      { id: 'H', label: '\\langle 2 \\rangle', y: 150, size: 6 },
      { id: 'N', label: 'N = \\langle 4 \\rangle', y: 250, size: 3 },
    ],
    rightNodes: [
      { id: 'G_N', label: '\\bar{G}', y: 50, size: 4 },
      { id: 'H_N', label: '\\bar{H}', y: 150, size: 2 },
      { id: 'e', label: '\\{e\\}', y: 250, size: 1 },
    ],
    leftEdges: [[0, 1], [1, 2]],
    rightEdges: [[0, 1], [1, 2]],
    connections: [[0,0], [1,1], [2,2]]
  },
  D4: {
    id: 'D4',
    name: 'Dihedral D4 / Z(D4)',
    groupLabel: 'D_4',
    quotientLabel: 'V_4 \\cong Z_2 \\times Z_2',
    leftNodes: [
      { id: 'G', label: 'D_4', y: 40, size: 8, xOffset: 0 },
      { id: 'H1', label: '\\langle r \\rangle', y: 130, size: 4, xOffset: -80 },
      { id: 'H2', label: '\\langle r^2, s \\rangle', y: 130, size: 4, xOffset: 0 },
      { id: 'H3', label: '\\langle r^2, sr \\rangle', y: 130, size: 4, xOffset: 80 },
      { id: 'N', label: 'N = \\langle r^2 \\rangle', y: 240, size: 2, xOffset: 0 },
    ],
    rightNodes: [
      { id: 'Q', label: 'D_4/N', y: 40, size: 4, xOffset: 0 },
      { id: 'Q1', label: '\\bar{H}_1', y: 130, size: 2, xOffset: -80 },
      { id: 'Q2', label: '\\bar{H}_2', y: 130, size: 2, xOffset: 0 },
      { id: 'Q3', label: '\\bar{H}_3', y: 130, size: 2, xOffset: 80 },
      { id: 'e', label: '\\{e\\}', y: 240, size: 1, xOffset: 0 },
    ],
    leftEdges: [[0,1], [0,2], [0,3], [1,4], [2,4], [3,4]],
    rightEdges: [[0,1], [0,2], [0,3], [1,4], [2,4], [3,4]],
    connections: [[0,0], [1,1], [2,2], [3,3], [4,4]]
  },
  Z2Z4: {
    id: 'Z2Z4',
    name: 'Z2 x Z4 / <(0,2)>',
    groupLabel: 'Z_2 \\times Z_4',
    quotientLabel: 'Z_2 \\times Z_2',
    leftNodes: [
      { id: 'G', label: 'G', y: 40, size: 8 },
      { id: 'Ha', label: 'H_a', y: 130, size: 4, xOffset: -50 },
      { id: 'Hb', label: 'H_b', y: 130, size: 4, xOffset: 50 },
      { id: 'N', label: 'N', y: 240, size: 2 },
    ],
    rightNodes: [
      { id: 'Q', label: 'G/N', y: 40, size: 4 },
      { id: 'Qa', label: '\\bar{H}_a', y: 130, size: 2, xOffset: -50 },
      { id: 'Qb', label: '\\bar{H}_b', y: 130, size: 2, xOffset: 50 },
      { id: 'e', label: '\\{e\\}', y: 240, size: 1 },
    ],
    leftEdges: [[0,1], [0,2], [1,3], [2,3]],
    rightEdges: [[0,1], [0,2], [1,3], [2,3]],
    connections: [[0,0], [1,1], [2,2], [3,3]]
  }
};

const CorrespondenceLattice: React.FC = () => {
  const [scenarioKey, setScenarioKey] = useState('D4');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const scenario = SCENARIOS[scenarioKey];
  const LEFT_CX = 200;
  const RIGHT_CX = 600;
  const WIDTH = 800;
  const HEIGHT = 320;

  const renderEdges = (nodes: Node[], edges: number[][], cx: number) => {
    return edges.map(([start, end], i) => {
      const sNode = nodes[start];
      const eNode = nodes[end];
      return (
        <line 
          key={`edge-${i}`} 
          x1={cx + (sNode.xOffset || 0)} 
          y1={sNode.y + 20} 
          x2={cx + (eNode.xOffset || 0)} 
          y2={eNode.y - 20} 
          stroke="#334155" 
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 mb-6 z-10 backdrop-blur">
        <span className="text-slate-300 font-serif">Example:</span>
        <select 
          value={scenarioKey} 
          onChange={(e) => setScenarioKey(e.target.value)}
          className="bg-slate-950 border border-slate-600 text-white rounded px-3 py-1 outline-none focus:border-cyan-500"
        >
          {Object.values(SCENARIOS).map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="relative w-full overflow-visible bg-slate-900/30 rounded-xl border border-slate-800">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto overflow-visible">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
               <path d="M0,0 L0,6 L9,3 z" fill="#fbbf24" />
            </marker>
          </defs>

          {/* Group Labels */}
          <text x={LEFT_CX} y="25" fill="#94a3b8" textAnchor="middle" fontSize="14" fontWeight="bold" letterSpacing="1px">SUBGROUPS OF G</text>
          <text x={RIGHT_CX} y="25" fill="#94a3b8" textAnchor="middle" fontSize="14" fontWeight="bold" letterSpacing="1px">SUBGROUPS OF G/N</text>
          
          {/* Background divider */}
          <line x1={WIDTH/2} y1={20} x2={WIDTH/2} y2={HEIGHT-20} stroke="#334155" strokeDasharray="5 5" />

          {/* Internal Lattice Edges */}
          {renderEdges(scenario.leftNodes, scenario.leftEdges, LEFT_CX)}
          {renderEdges(scenario.rightNodes, scenario.rightEdges, RIGHT_CX)}

          {/* Mapping Arrows (Horizontal) */}
          <g opacity="0.8">
            {scenario.connections.map(([l, r], i) => {
              const left = scenario.leftNodes[l];
              const right = scenario.rightNodes[r];
              const lx = LEFT_CX + (left.xOffset || 0);
              const rx = RIGHT_CX + (right.xOffset || 0);
              const isActive = hoveredIndex === l;
              return (
                 <path 
                   key={`map-${i}`} 
                   d={`M ${lx + 30} ${left.y} C ${lx + 100} ${left.y}, ${rx - 100} ${right.y}, ${rx - 30} ${right.y}`}
                   stroke={isActive ? "#fbbf24" : "#475569"} 
                   strokeWidth={isActive ? 2 : 1} 
                   strokeDasharray={isActive ? "none" : "4 4"}
                   fill="none"
                   markerEnd={isActive ? "url(#arrow)" : undefined}
                   opacity={hoveredIndex === null || isActive ? 1 : 0.1}
                   className="transition-all duration-300"
                 />
              );
            })}
          </g>

          {/* Left Nodes (G) */}
          {scenario.leftNodes.map((node, i) => {
            const isHovered = hoveredIndex === i;
            const x = LEFT_CX + (node.xOffset || 0);
            return (
              <g key={`L-${i}`} 
                 onMouseEnter={() => setHoveredIndex(i)} 
                 onMouseLeave={() => setHoveredIndex(null)}
                 className="cursor-pointer">
                
                <circle cx={x} cy={node.y} r={24} 
                  fill={isHovered ? "#0f172a" : "#1e293b"} 
                  stroke={isHovered ? "#22d3ee" : "#64748b"} 
                  strokeWidth={isHovered ? 3 : 2} 
                  className="transition-all duration-300"
                />
                <foreignObject x={x - 50} y={node.y - 12} width="100" height="24" style={{pointerEvents: 'none'}}>
                   <div className={`flex justify-center items-center h-full text-xs font-bold ${isHovered ? 'text-cyan-400' : 'text-slate-200'}`}>
                      <MathJax latex={node.label} />
                   </div>
                </foreignObject>
              </g>
            );
          })}

          {/* Right Nodes (G/N) */}
          {scenario.rightNodes.map((node, i) => {
             const isHovered = hoveredIndex === i; 
             const x = RIGHT_CX + (node.xOffset || 0);
             return (
              <g key={`R-${i}`}
                 className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
                <circle cx={x} cy={node.y} r={24} 
                  fill={isHovered ? "#0f172a" : "#1e293b"} 
                  stroke={isHovered ? "#fbbf24" : "#64748b"} 
                  strokeWidth={isHovered ? 3 : 2}
                />
                 <foreignObject x={x - 50} y={node.y - 12} width="100" height="24" style={{pointerEvents: 'none'}}>
                   <div className={`flex justify-center items-center h-full text-xs font-bold ${isHovered ? 'text-amber-400' : 'text-slate-200'}`}>
                      <MathJax latex={node.label} />
                   </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 p-4 bg-slate-900/50 border border-slate-800 rounded-lg text-center backdrop-blur w-full">
         <div className="text-slate-400 text-sm h-6">
           {hoveredIndex !== null ? (
             <span className="animate-pulse">
               Bijection: <span className="text-cyan-400 font-bold"><MathJax latex={scenario.leftNodes[hoveredIndex].label} /></span> <span className="mx-2">⟷</span> <span className="text-amber-400 font-bold"><MathJax latex={scenario.rightNodes[hoveredIndex].label} /></span>
             </span>
           ) : (
             "Hover over a subgroup in the left lattice to see its image in the quotient group."
           )}
         </div>
      </div>
    </div>
  );
};

export default CorrespondenceLattice;