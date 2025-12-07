import React from 'react';

export interface Complex {
  r: number;
  i: number;
}

export interface GroupElement {
  id: string;
  label: string;
  latex: string;
  perm: number[]; // Permutation array e.g. [0,1,2] -> [1,0,2]
}

export interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  visual: React.ReactNode;
}