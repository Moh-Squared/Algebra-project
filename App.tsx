import React from 'react';
import Hero from './components/Hero';
import Section from './components/Section';
import LagrangeResolvent from './components/math/LagrangeResolvent';
import S3Visualizer from './components/math/S3Visualizer';
import ClassEquation from './components/math/ClassEquation';
import CorrespondenceLattice from './components/math/CorrespondenceLattice';
import SylowVisualizer from './components/math/SylowVisualizer';
import { MathJax } from './components/MathJax';

const App: React.FC = () => {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-200 selection:bg-cyan-500/30">
      <Hero />

      {/* 1. Lagrange & The Resolvent */}
      <Section 
        title="Lagrange's Insight"
        visual={<LagrangeResolvent />}
        videoSrc="resources/videos/LagrangeMethodRefined.mp4"
      >
        <p>
          In 1766, Joseph-Louis Lagrange started working on quintic equations. His main question was: 
          <em className="text-slate-100 font-serif italic mx-1">"Why did the quadratic and cubic formulas work?"</em>
        </p>
        <p>
          Lagrange considered a cubic equation with roots <MathJax latex="x_1, x_2, x_3" />. He constructed a seemingly more complicated function called the <strong>Resolvent</strong>:
        </p>
        <div className="bg-slate-900/50 p-6 rounded-lg border-l-4 border-rose-500 my-6">
          <MathJax latex="y = (x_1 + \omega x_2 + \omega^2 x_3)^3" block />
          <div className="text-center text-sm text-slate-500 mt-2">
            where <MathJax latex="\omega" /> is a cube root of unity (<MathJax latex="\omega \ne 1" />).
          </div>
        </div>
        <p>
          He discovered that if you <strong>permute</strong> the order of the roots (e.g., swap <MathJax latex="x_1" /> and <MathJax latex="x_2" />), the value of <MathJax latex="y" /> changes, but it only takes on <strong>2 possible values</strong>.
        </p>
        <p>
          This reduction from 6 possible permutations to just 2 values was the key to solving the cubic. The "symmetry" of the roots collapsed the problem.
        </p>
      </Section>

      {/* 2. Orbit-Stabilizer */}
      <Section
        title="The Orbit-Stabilizer Theorem"
        visual={<S3Visualizer />}
        videoSrc="resources/videos/OrbitStabilizerTheorem.mp4"
      >
        <p>
          To formalize this, Lagrange laid the groundwork for Group Theory. We define an <strong>Action</strong> of a group <MathJax latex="G" /> on a set <MathJax latex="X" />.
        </p>
        <p>
          Consider the symmetries of a regular polygon (Group <MathJax latex="D_n" />) acting on its vertices.
        </p>
        <ul className="space-y-4 my-6 list-disc pl-5 marker:text-cyan-500">
          <li>
            <strong className="text-cyan-400">Orbit</strong>: The set of all places a vertex can go.
            <MathJax latex="\text{Orb}_G(x) = \{ g \cdot x \mid g \in G \}" block className="text-sm text-slate-400" />
          </li>
          <li>
            <strong className="text-amber-400">Stabilizer</strong>: The set of symmetries that keep a vertex fixed.
            <MathJax latex="\text{Stab}_G(x) = \{ g \in G \mid g \cdot x = x \}" block className="text-sm text-slate-400" />
          </li>
        </ul>
        <p>
          Lagrange proved a fundamental relationship: The size of the group equals the size of the orbit times the size of the stabilizer.
        </p>
        <div className="text-center text-xl font-serif text-white py-4">
          <MathJax latex="|G| = |\text{Orb}_G(x)| \cdot |\text{Stab}_G(x)|" />
        </div>
      </Section>

      {/* 3. Class Equation */}
      <Section
        title="The Class Equation"
        visual={<ClassEquation />}
        videoSrc="resources/videos/ConjugacyAndClassEq.mp4"
      >
        <p>
          We can generalize this. Let a group act <em>on itself</em> by conjugation:
          <MathJax latex="g \cdot a = gag^{-1}" block />
        </p>
        <p>
          The orbits of this action are called <strong>Conjugacy Classes</strong>. Since orbits partition a set, the sum of the sizes of these classes must equal the total size of the group.
        </p>
        <p>
          This gives us the <strong>Class Equation</strong>:
        </p>
        <MathJax latex="|G| = |Z(G)| + \sum |Cl(a_i)|" block className="text-xl text-indigo-300" />
        <p>
          Augustin-Louis Cauchy used this to prove that if a prime <MathJax latex="p" /> divides the order of a group, the group <em>must</em> have an element of order <MathJax latex="p" />.
        </p>
        <div className="bg-slate-900 p-4 rounded text-sm italic text-slate-400 border border-slate-700 mt-4">
          "If <MathJax latex="p" /> divides <MathJax latex="|G|" />, we analyze the equation modulo <MathJax latex="p" />. Since the sum is divisible by <MathJax latex="p" />, and <MathJax latex="|Z(G)|" /> contributes to the count..."
        </div>
      </Section>

      {/* 4. Correspondence Theorem */}
      <Section
        title="The Correspondence Theorem"
        visual={<CorrespondenceLattice />}
        videoSrc="resources/videos/CorrespondenceTheorem.mp4"
      >
        <p>
          Finally, we arrive at the structure of subgroups. Emmy Noether formulated the <strong>Correspondence Theorem</strong>, which links subgroups of a large group <MathJax latex="G" /> to a smaller quotient group <MathJax latex="G/N" />.
        </p>
        <p>
          Let <MathJax latex="N" /> be a normal subgroup. There is a <strong>bijection</strong> between:
        </p>
        <ol className="list-decimal pl-5 space-y-2 marker:text-slate-500">
          <li>Subgroups of <MathJax latex="G" /> that contain <MathJax latex="N" /></li>
          <li>Subgroups of the quotient <MathJax latex="G/N" /></li>
        </ol>
        <p className="mt-4">
          In the visualization, see how <MathJax latex="N=\{0,4,8\}" /> in <MathJax latex="\mathbb{Z}_{12}" /> maps to the identity in the quotient. This structure allows us to project complex problems into simpler groups, solve them, and lift the solution back up.
        </p>
      </Section>

      {/* 5. Sylow Theorems */}
      <Section
        title="The Sylow Theorems"
        visual={<SylowVisualizer />}
        videoSrc="resources/videos/SylowMasterScene.mp4"
      >
        <p>
          Building on Cauchy's work, the Norwegian mathematician Ludvig Sylow asked a deeper question: <em>"If <MathJax latex="p^\alpha" /> divides <MathJax latex="|G|" />, is there a subgroup of that size?"</em>
        </p>
        <p>
          The answer is yes. The <strong>Sylow Theorems</strong> (1872) are the crown jewels of finite group theory, giving us profound information about the structure of a group just from its size.
        </p>
        
        <div className="grid gap-4 my-6">
           <div className="p-4 bg-cyan-900/20 border-l-4 border-cyan-500 rounded-r">
             <h4 className="font-bold text-cyan-400">Theorem 1 (Existence)</h4>
             <p className="text-sm text-slate-300">Sylow <MathJax latex="p" />-subgroups always exist.</p>
           </div>
           <div className="p-4 bg-amber-900/20 border-l-4 border-amber-500 rounded-r">
             <h4 className="font-bold text-amber-400">Theorems 2 & 3 (Conjugacy & Counting)</h4>
             <p className="text-sm text-slate-300">
               Any two Sylow <MathJax latex="p" />-subgroups are conjugate. The number of them, <MathJax latex="n_p" />, satisfies:
             </p>
             <div className="text-center py-2 font-serif text-amber-200">
               <MathJax latex="n_p \equiv 1 \pmod p \quad \text{and} \quad n_p \mid m" />
             </div>
           </div>
        </div>
        <p>
          Use the interactive tool to walk through the inductive proof of existence, or explore the "counting" restrictions for groups of order 6, 12, and 15.
        </p>
      </Section>

      {/* Footer / Future Content */}
      <div className="min-h-[30vh] flex items-center justify-center border-t border-slate-900 bg-black relative overflow-hidden">
         <div className="relative z-10 text-center space-y-4 p-8">
            <h3 className="text-xl font-serif text-slate-600">The Journey Continues...</h3>
            <p className="text-slate-500 max-w-md mx-auto text-sm">
              With these tools, mathematicians classified all Finite Simple Groups, a project spanning over 10,000 pages of proofs.
            </p>
         </div>
      </div>
    </div>
  );
};

export default App;
