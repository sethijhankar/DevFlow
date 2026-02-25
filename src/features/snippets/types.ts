export const SNIPPET_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'markdown',
  'bash',
  'sql',
  'java',
  'c',
  'cpp',
  'csharp',
  'go',
  'rust',
  'ruby',
  'php',
  'yaml',
  'plaintext',
] as const

export type SnippetLanguage = (typeof SNIPPET_LANGUAGES)[number]

export interface Snippet {
  id: string
  title: string
  language: SnippetLanguage
  code: string
  tags: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface SnippetInput {
  title: string
  language: SnippetLanguage
  code: string
  tags: string[]
  favorite: boolean
}
