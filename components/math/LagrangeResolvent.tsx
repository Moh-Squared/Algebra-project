import React, { useState, useEffect, useRef } from 'react';
import { MathJax } from '../MathJax';
import { add, multiply, cube, OMEGA, OMEGA_SQ, magnitude, solveCubicEquation, S3_ELEMENTS } from '../../services/mathUtils';

const LagrangeResolvent: React.FC = () => {
  // Polynomial coefficients for x^3 + ax^2 + bx + c = 0
  const [coeffs, setCoeffs] = useState({ a: 0, b: 0, c: -1 });
  const [roots, setRoots] = useState<any[]>([]); // {r, i}
  const [permOrder, setPermOrder] = useState([0, 1, 2]); // Current permutation of roots indices
  const [yVal, setYVal] = useState(0);

  const svgRef = useRef<SVGSVGElement>(null);
  const width = 400;
  const height = 400;
  const scale = 80; // pixels per unit
  const center = { x: width / 2, y: height / 2 };

  // Solve roots when coefficients change
  useEffect(() => {
    const calculatedRoots = solveCubicEquation(coeffs.a, coeffs.b, coeffs.c);
    setRoots(calculatedRoots);
    setPermOrder([0, 1, 2]); // Reset permutation on new equation
  }, [coeffs]);

  // Calculate Resolvent Y based on current roots and permutation
  useEffect(() => {
    if (roots.length !== 3) return;
    
    // Apply permutation to roots
    const r1 = roots[permOrder[0]];
    const r2 = roots[permOrder[1]];
    const r3 = roots[permOrder[2]];

    // y = (x1 + w*x2 + w^2*x3)^3
    const term2 = multiply(r2, OMEGA);
    const term3 = multiply(r3, OMEGA_SQ);
    const sum = add(add(r1, term2), term3);
    const y = cube(sum);
    
    setYVal(magnitude(y));
  }, [roots, permOrder]);

  const handlePermute = (perm: number[]) => {
    setPermOrder(perm);
  };

  const toScreen = (r: number, i: number) => ({
    cx: center.x + r * scale,
    cy: center.y - i * scale, // SVG y is down
  });

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
      {/* Input Section */}
      <div className="w-full bg-slate-900/80 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-widest">Cubic Equation Input</h4>
        <div className="flex items-center justify-center gap-2 text-lg font-serif mb-2">
          <MathJax latex="x^3 +" />
          <input 
            type="number" value={coeffs.a} 
            onChange={e => setCoeffs({...coeffs, a: Number(e.target.value)})}
            className="w-12 bg-slate-950 border border-slate-700 rounded p-1 text-center focus:border-cyan-500 outline-none text-white"
          />
          <MathJax latex="x^2 +" />
          <input 
            type="number" value={coeffs.b} 
            onChange={e => setCoeffs({...coeffs, b: Number(e.target.value)})}
            className="w-12 bg-slate-950 border border-slate-700 rounded p-1 text-center focus:border-cyan-500 outline-none text-white"
          />
          <MathJax latex="x +" />
          <input 
            type="number" value={coeffs.c} 
            onChange={e => setCoeffs({...coeffs, c: Number(e.target.value)})}
            className="w-12 bg-slate-950 border border-slate-700 rounded p-1 text-center focus:border-cyan-500 outline-none text-white"
          />
          <MathJax latex="= 0" />
        </div>
      </div>

      <div className="relative bg-slate-950 rounded-2xl border border-slate-700 p-4 shadow-2xl w-full aspect-square">
        <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Axes */}
          <line x1={0} y1={center.y} x2={width} y2={center.y} stroke="#1e293b" strokeWidth="2" />
          <line x1={center.x} y1={0} x2={center.x} y2={height} stroke="#1e293b" strokeWidth="2" />
          
          {/* Unit Grid Circle (for reference) */}
          <circle cx={center.x} cy={center.y} r={scale} stroke="#1e293b" fill="none" strokeDasharray="4 4" />

          {/* Roots */}
          {roots.map((root, i) => {
            // Apply permutation visual logic: The color/label stays with the INDEX of the root in the formula,
            // but the POSITION on screen is determined by the root value.
            // Actually, usually x1 is always x1. The permutation is in the formula.
            // Let's draw the roots at their fixed positions in space, but label them based on the permutation assignment?
            // No, the prompt says "permute them".
            // Let's just draw the 3 roots calculated.
            const pos = toScreen(root.r, root.i);
            // Identify which root is currently in the x1 slot, x2 slot, etc?
            // Let's keep it simple: Draw the 3 roots.
            // The permutation affects Y. We can highlight which root is contributing to the "x1" term.
            
            // Let's color code the POSITIONS in the formula:
            // x1 (Rose), x2 (Amber), x3 (Cyan).
            // We map these colors to the roots based on `permOrder`.
            
            // Reverse lookup: Where is root `i` being used?
            const roleIndex = permOrder.indexOf(i); // 0 means this root is x1
            const colors = ["#f43f5e", "#fbbf24", "#22d3ee"]; 
            const labels = ["x₁", "x₂", "x₃"]; // Roles

            return (
              <g key={i} className="transition-all duration-500 ease-in-out">
                <circle cx={pos.cx} cy={pos.cy} r={6} fill={colors[roleIndex]} stroke="#fff" strokeWidth="2" />
                <text x={pos.cx + 10} y={pos.cy - 10} fill={colors[roleIndex]} fontSize="14" fontWeight="bold">
                   Root {i+1}
                </text>
                <text x={pos.cx + 10} y={pos.cy + 15} fill="#64748b" fontSize="10">
                   (Acting as {labels[roleIndex]})
                </text>
              </g>
            );
          })}
        </svg>

        {/* HUD */}
        <div className="absolute top-4 right-4 bg-slate-900/90 p-3 rounded-lg border border-slate-700 text-sm backdrop-blur">
          <div className="flex flex-col gap-1">
             <span className="text-slate-400 text-xs uppercase">Resolvent Value |y|</span>
             <span className="text-2xl font-mono text-emerald-400 transition-all duration-300">{yVal.toFixed(3)}</span>
          </div>
        </div>
      </div>

      {/* Permutation Buttons */}
      <div className="w-full">
        <h4 className="text-xs text-center text-slate-500 mb-2">Permute Roots in <MathJax latex="S_3" /></h4>
        <div className="grid grid-cols-3 gap-2">
          {S3_ELEMENTS.map((el) => (
            <button 
              key={el.id}
              onClick={() => handlePermute(el.perm)}
              className={`p-2 rounded border text-sm transition-all
                ${JSON.stringify(permOrder) === JSON.stringify(el.perm)
                  ? 'bg-cyan-900/50 border-cyan-500 text-cyan-200'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                }
              `}
            >
              <MathJax latex={el.latex} />
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-xs text-slate-500 text-center italic">
        Note: We use a cubic so <MathJax latex="S_3" /> acts on 3 roots. Quadratic equations only have 2 roots.
      </p>
    </div>
  );
};

export default LagrangeResolvent;