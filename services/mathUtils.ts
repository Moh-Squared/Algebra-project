import { Complex } from '../types';

// --- Complex Number Logic ---

export const add = (a: Complex, b: Complex): Complex => ({
  r: a.r + b.r,
  i: a.i + b.i,
});

export const subtract = (a: Complex, b: Complex): Complex => ({
  r: a.r - b.r,
  i: a.i - b.i,
});

export const multiply = (a: Complex, b: Complex): Complex => ({
  r: a.r * b.r - a.i * b.i,
  i: a.r * b.i + a.i * b.r,
});

export const divide = (a: Complex, b: Complex): Complex => {
  const denom = b.r * b.r + b.i * b.i;
  return {
    r: (a.r * b.r + a.i * b.i) / denom,
    i: (a.i * b.r - a.r * b.i) / denom,
  };
};

export const fromAngle = (theta: number): Complex => ({
  r: Math.cos(theta),
  i: Math.sin(theta),
});

export const cube = (z: Complex): Complex => {
  const z2 = multiply(z, z);
  return multiply(z2, z);
};

export const magnitude = (z: Complex): number => Math.sqrt(z.r * z.r + z.i * z.i);

// Omega roots of unity
export const OMEGA = fromAngle((2 * Math.PI) / 3);
export const OMEGA_SQ = fromAngle((4 * Math.PI) / 3);

// --- Polynomial Solver (Durand-Kerner Method) ---
// Solves x^3 + ax^2 + bx + c = 0
export const solveCubicEquation = (a: number, b: number, c: number): [Complex, Complex, Complex] => {
  let p: Complex = { r: 0.4, i: 0.9 };
  let q: Complex = { r: -0.9, i: 0.4 };
  let r: Complex = { r: 0.5, i: -0.8 };

  const f = (x: Complex): Complex => {
    const x2 = multiply(x, x);
    const x3 = multiply(x2, x);
    const ax2 = multiply({ r: a, i: 0 }, x2);
    const bx = multiply({ r: b, i: 0 }, x);
    const constant = { r: c, i: 0 };
    
    let res = add(x3, ax2);
    res = add(res, bx);
    res = add(res, constant);
    return res;
  };

  for (let i = 0; i < 20; i++) {
    const p_min_q = subtract(p, q);
    const p_min_r = subtract(p, r);
    const denomP = multiply(p_min_q, p_min_r);
    const numP = f(p);
    const diffP = divide(numP, denomP);
    p = subtract(p, diffP);

    const q_min_p = subtract(q, p);
    const q_min_r = subtract(q, r);
    const denomQ = multiply(q_min_p, q_min_r);
    const numQ = f(q);
    const diffQ = divide(numQ, denomQ);
    q = subtract(q, diffQ);

    const r_min_p = subtract(r, p);
    const r_min_q = subtract(r, q);
    const denomR = multiply(r_min_p, r_min_q);
    const numR = f(r);
    const diffR = divide(numR, denomR);
    r = subtract(r, diffR);
  }

  return [p, q, r];
};

// --- Group Logic ---

export const S3_ELEMENTS = [
  { id: 'e', label: 'e', latex: 'e', perm: [0, 1, 2] },
  { id: '12', label: '(1 2)', latex: '(1\\,2)', perm: [1, 0, 2] },
  { id: '13', label: '(1 3)', latex: '(1\\,3)', perm: [2, 1, 0] },
  { id: '23', label: '(2 3)', latex: '(2\\,3)', perm: [0, 2, 1] },
  { id: '123', label: '(1 2 3)', latex: '(1\\,2\\,3)', perm: [1, 2, 0] },
  { id: '132', label: '(1 3 2)', latex: '(1\\,3\\,2)', perm: [2, 0, 1] },
];

export const applyPermutation = (start: number[], perm: number[]): number[] => {
  return [start[perm[0]], start[perm[1]], start[perm[2]]];
};

// Generate vertices for a regular N-gon
export const generatePolygonVertices = (n: number, radius: number) => {
  const vertices = [];
  // Standard alignment: Vertex 1 (index 0) at Top (-PI/2).
  const offset = -Math.PI / 2;

  for (let i = 0; i < n; i++) {
    // Clockwise direction
    const theta = offset + (i * 2 * Math.PI) / n;
    vertices.push({
      x: radius * Math.cos(theta),
      y: radius * Math.sin(theta),
      label: i + 1 
    });
  }
  return vertices;
};

// Helper types for Dihedral group
export interface DihedralElement {
  id: string;
  latex: string;
  name: string;
  type: 'rotation' | 'reflection';
  action: (index: number, n: number) => number;
}

export const generateDihedralGroup = (n: number): DihedralElement[] => {
  const elements: DihedralElement[] = [];
  
  // Rotations: r^k
  for (let k = 0; k < n; k++) {
    elements.push({
      id: `r${k}`,
      latex: k === 0 ? 'e' : (k === 1 ? 'r' : `r^${k}`),
      name: k === 0 ? 'Identity' : `Rotation ${k}`,
      type: 'rotation',
      action: (i, n) => (i + k) % n
    });
  }

  // Reflections: sr^k
  // Convention: s is reflection across axis through vertex 0 (Top).
  // s(0) = 0.
  // s(i) = -i mod n.
  // sr^k(i) = s( (i+k) ) = -(i+k) mod n
  for (let k = 0; k < n; k++) {
    elements.push({
      id: `s${k}`,
      latex: k === 0 ? 's' : `sr^${k}`,
      name: `Reflection ${k}`,
      type: 'reflection',
      action: (i, n) => {
        const rotated = (i + k) % n;
        const reflected = (n - rotated) % n;
        return reflected;
      }
    });
  }
  return elements;
};

export const calculateDihedralOrbit = (vertexIndex: number, n: number) => {
  return Array.from({ length: n }, (_, i) => i);
};