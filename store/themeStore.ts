import { create } from 'zustand';

export type ThemeType =
  | 'dark'
  | 'ocean'
  | 'forest'
  | 'dracula'
  | 'nord'
  | 'github'
  | 'tokyo'
  | 'matrix'
  | 'cyberpunk'
  | 'material'
  | 'neon';

interface ThemeColors {
  bg: string;
  bgSub: string;
  text: string;
  sub: string;
  main: string;
  error: string;
  border: string;
}

export const themes: Record<ThemeType, ThemeColors> = {
  dark: {
    bg: '#323437',
    bgSub: '#2c2e31',
    text: '#d1d0c5',
    sub: '#646669',
    main: '#e2b714',
    error: '#ca4754',
    border: '#3d3d3d',
  },

  ocean: {
    bg: '#1a2634',
    bgSub: '#152028',
    text: '#c7d5e0',
    sub: '#5a7a8c',
    main: '#00b4d8',
    error: '#ef476f',
    border: '#2a3f4f',
  },

  forest: {
    bg: '#1e2d24',
    bgSub: '#172119',
    text: '#c9d1c8',
    sub: '#5a7a5a',
    main: '#4ade80',
    error: '#f87171',
    border: '#2d3d2d',
  },

  dracula: {
    bg: '#282a36',
    bgSub: '#21222c',
    text: '#f8f8f2',
    sub: '#6272a4',
    main: '#bd93f9',
    error: '#ff5555',
    border: '#44475a',
  },

  nord: {
    bg: '#2e3440',
    bgSub: '#242933',
    text: '#eceff4',
    sub: '#81a1c1',
    main: '#88c0d0',
    error: '#bf616a',
    border: '#434c5e',
  },

  github: {
    bg: '#0d1117',
    bgSub: '#161b22',
    text: '#c9d1d9',
    sub: '#8b949e',
    main: '#58a6ff',
    error: '#f85149',
    border: '#30363d',
  },

  tokyo: {
    bg: '#1a1b26',
    bgSub: '#16161e',
    text: '#c0caf5',
    sub: '#565f89',
    main: '#7aa2f7',
    error: '#f7768e',
    border: '#2f3549',
  },

  matrix: {
    bg: '#000000',
    bgSub: '#041404',
    text: '#00ff41',
    sub: '#008f11',
    main: '#00ff41',
    error: '#ff0033',
    border: '#0d2b0d',
  },

  cyberpunk: {
    bg: '#0f0f1a',
    bgSub: '#161629',
    text: '#f1f1f1',
    sub: '#7b7be0',
    main: '#ff00ff',
    error: '#ff4d6d',
    border: '#2d2d52',
  },

  material: {
    bg: '#263238',
    bgSub: '#1e272c',
    text: '#eeffff',
    sub: '#546e7a',
    main: '#80cbc4',
    error: '#ff5370',
    border: '#37474f',
  },

  neon: {
    bg: '#0a0a0a',
    bgSub: '#111111',
    text: '#ffffff',
    sub: '#888888',
    main: '#39ff14',
    error: '#ff073a',
    border: '#1f1f1f',
  },
};

interface ThemeState {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  getColors: () => ThemeColors;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: 'dark',

  setTheme: (theme) => {
    set({ currentTheme: theme });

    const colors = themes[theme];

    document.documentElement.style.setProperty('--color-bg', colors.bg);
    document.documentElement.style.setProperty('--color-bg-sub', colors.bgSub);
    document.documentElement.style.setProperty('--color-text', colors.text);
    document.documentElement.style.setProperty('--color-sub', colors.sub);
    document.documentElement.style.setProperty('--color-main', colors.main);
    document.documentElement.style.setProperty('--color-error', colors.error);
    document.documentElement.style.setProperty('--color-border', colors.border);

    if (typeof window !== 'undefined') {
      localStorage.setItem('devtype-theme', theme);
    }
  },

  getColors: () => themes[get().currentTheme],
}));