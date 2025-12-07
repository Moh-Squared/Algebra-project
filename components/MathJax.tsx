import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathProps {
  latex: string;
  block?: boolean;
  className?: string;
}

export const MathJax: React.FC<MathProps> = ({ latex, block = false, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // We use renderToString and set innerHTML to bypass the "quirks mode" check
        // that katex.render enforces. This is more robust for embedded environments.
        const html = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: block,
        });
        containerRef.current.innerHTML = html;
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        containerRef.current.textContent = latex;
      }
    }
  }, [latex, block]);

  return <span ref={containerRef} className={`${block ? 'block my-4 text-center' : 'inline'} ${className}`} />;
};