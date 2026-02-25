import { useState } from 'react'
import type { SnippetLanguage } from './types'

interface CodeBlockProps {
  code: string
  language: SnippetLanguage
  showCopy?: boolean
  className?: string
  maxHeight?: string
}

export function CodeBlock({
  code,
  language,
  showCopy = true,
  className = '',
  maxHeight = '12rem',
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-gray-50 ${className}`}
      data-language={language}
    >
      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute right-2 top-2 z-10 rounded bg-white px-2 py-1 text-xs font-medium text-gray-600 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
      <div
        style={{ maxHeight }}
        className="overflow-auto rounded-lg p-4 font-mono text-[0.8125rem] leading-relaxed text-gray-800"
      >
        <pre className="m-0 whitespace-pre">
          <code>{code || '// No code'}</code>
        </pre>
      </div>
    </div>
  )
}
