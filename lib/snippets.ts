import snippetsData from '@/data/snippets.json';

export type Language =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'cpp'
  | 'python'
  | 'csharp'
  | 'java'
  | 'rust'
  | 'go';

export const languages: Language[] = [
  'html',
  'css',
  'javascript',
  'typescript',
  'cpp',
  'python',
  'csharp',
  'java',
  'rust',
  'go',
];

const snippets: Record<Language, string[]> =
  snippetsData as Record<Language, string[]>;

// DEFAULT LANGUAGE = HTML
export function getRandomSnippet(
  language: Language = 'html'
): { code: string; language: Language } {
  const langSnippets = snippets[language] ?? snippets['html'];

  if (!langSnippets || langSnippets.length === 0) {
    return {
      code: '<h1>Welcome</h1>',
      language: 'html',
    };
  }

  const code =
    langSnippets[Math.floor(Math.random() * langSnippets.length)];

  return { code, language };
}

export function getAllSnippets(): Record<Language, string[]> {
  return snippets;
}

export function getSnippetCount(): number {
  return Object.values(snippets).reduce((acc, arr) => acc + arr.length, 0);
}