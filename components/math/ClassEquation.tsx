import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MathJax } from '../MathJax';

type GroupData = {
  id: string;
  label: string;
  total: number;
  classes: { name: string; value: number; latex: string; color: string }[];
  equation: string;
  desc: string;
};

const GROUPS: Record<string, GroupData> = {
  S3: {
    id: 'S3',
    label: 'S_3',
    total: 6,
    classes: [
      { name: 'Identity {e}', value: 1, latex: '\\{e\\}', color: '#94a3b8' }, // Slate
      { name: 'Transpositions (2-cycles)', value: 3, latex: '\\{(12), (13), (23)\\}', color: '#fbbf24' }, // Amber
      { name: '3-Cycles', value: 2, latex: '\\{(123), (132)\\}', color: '#f43f5e' }, // Rose
    ],
    equation: '6 = 1 + 2 + 3',
    desc: 'Center is trivial Z(G) = {e}.'
  },
  D4: {
    id: 'D4',
    label: 'D_4',
    total: 8,
    classes: [
      { name: 'Center {e, r^2}', value: 2, latex: '\\{e, r^2\\}', color: '#94a3b8' }, 
      { name: 'Rotations r, r^3', value: 2, latex: '\\{r, r^3\\}', color: '#fbbf24' },
      { name: 'Reflections (axes)', value: 2, latex: '\\{s, sr^2\\}', color: '#f43f5e' },
      { name: 'Reflections (diag)', value: 2, latex: '\\{sr, sr^3\\}', color: '#22d3ee' },
    ],
    equation: '8 = 2 + 2 + 2 + 2',
    desc: 'Non-trivial Center! |Z(G)| = 2. Abelian groups have size 1 classes.'
  },
  Q8: {
    id: 'Q8',
    label: 'Q_8',
    total: 8,
    classes: [
      { name: 'Center {1, -1}', value: 2, latex: '\\{1, -1\\}', color: '#94a3b8' },
      { name: '{i, -i}', value: 2, latex: '\\{i, -i\\}', color: '#fbbf24' },
      { name: '{j, -j}', value: 2, latex: '\\{j, -j\\}', color: '#f43f5e' },
      { name: '{k, -k}', value: 2, latex: '\\{k, -k\\}', color: '#22d3ee' },
    ],
    equation: '8 = 2 + 2 + 2 + 2',
    desc: 'Quaternion group. Distinct structure but same class equation sizes as D4.'
  }
};

const ClassEquation: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('S3');
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const data = GROUPS[selectedGroup];

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 z-10">
        <span className="text-slate-300 font-serif">Group:</span>
        <select 
          value={selectedGroup} 
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="bg-slate-950 border border-slate-600 text-white rounded px-3 py-1 outline-none focus:border-cyan-500"
        >
          <option value="S3">S3 (Permutations)</option>
          <option value="D4">D4 (Square Symmetries)</option>
          <option value="Q8">Q8 (Quaternions)</option>
        </select>
      </div>

      <div className="w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.classes}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(undefined)}
              stroke="none"
            >
              {data.classes.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  opacity={activeIndex === undefined || activeIndex === index ? 1 : 0.3}
                  className="transition-all duration-300 outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              <MathJax latex={`|${data.label}| = ${data.total}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Legend / Interactive details */}
      <div className="grid grid-cols-1 gap-2 w-full max-w-sm">
        {data.classes.map((item, idx) => (
          <div 
            key={idx}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${activeIndex === idx ? 'bg-slate-800 border-slate-600 scale-105' : 'bg-slate-900/50 border-transparent opacity-60'}`}
            onMouseEnter={() => setActiveIndex(idx)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
              <span className="text-sm text-slate-200 font-medium"><MathJax latex={item.name}/></span>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Size: {item.value}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-slate-900 border border-indigo-900/50 rounded-lg text-sm text-slate-400 text-center mt-4 w-full">
        <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">Class Equation</div>
        <MathJax latex={data.equation} block className="text-xl text-indigo-300 mb-2" />
        <span className="text-xs opacity-70 italic block">{data.desc}</span>
      </div>
    </div>
  );
};

export default ClassEquation;