/* 10 paletas para escolher. Cada uma define o acento (claro e escuro) e as
   duas cores da orbe. Pré-visualização: abra o site com ?paletas e use o
   seletor no canto da tela. */
export type Palette = {
  id: string;
  name: string;
  light: string; // acento no tema claro
  dark: string; // acento no tema escuro
  orb: [string, string]; // borda da orbe: entrada e saída da luz
};

export const palettes: Palette[] = [
  { id: 'esmeralda', name: 'Esmeralda', light: '#0b8a5e', dark: '#34d399', orb: ['#10b981', '#06b6d4'] },
  { id: 'violeta', name: 'Violeta', light: '#6d28d9', dark: '#a78bfa', orb: ['#8b5cf6', '#ec4899'] },
  { id: 'solar', name: 'Laranja solar', light: '#c2410c', dark: '#fb923c', orb: ['#f97316', '#facc15'] },
  { id: 'coral', name: 'Coral', light: '#e11d48', dark: '#fb7185', orb: ['#f43f5e', '#f59e0b'] },
  { id: 'lima', name: 'Lima ácido', light: '#4d7c0f', dark: '#bef264', orb: ['#a3e635', '#22d3ee'] },
  { id: 'ambar', name: 'Âmbar', light: '#b45309', dark: '#fbbf24', orb: ['#f59e0b', '#ef4444'] },
  { id: 'magenta', name: 'Magenta', light: '#a21caf', dark: '#e879f9', orb: ['#d946ef', '#6366f1'] },
  { id: 'turquesa', name: 'Turquesa', light: '#0f766e', dark: '#2dd4bf', orb: ['#14b8a6', '#a3e635'] },
  { id: 'grafite', name: 'Grafite (sem cor)', light: '#27272a', dark: '#e4e4e7', orb: ['#a1a1aa', '#f4f4f5'] },
  { id: 'rubi', name: 'Rubi', light: '#b91c1c', dark: '#f87171', orb: ['#ef4444', '#f97316'] },
];

export const defaultPalette = palettes[0];
