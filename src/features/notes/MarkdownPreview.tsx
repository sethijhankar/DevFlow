interface MarkdownPreviewProps {
  content: string
  className?: string
}

/** Simple markdown-to-HTML (no external deps). Run `npm install react-markdown` for full markdown support. */
function simpleMarkdownToHtml(text: string): string {
  if (!text.trim()) return '<p><em>No content yet</em></p>'
  const escape = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')

  let html = escape(text)
    .replace(/^### (.+)$/gm, '<h3 class="font-semibold text-gray-900 mt-4 mb-1">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-semibold text-gray-900 mt-4 mb-1">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-semibold text-gray-900 mt-4 mb-1">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code class="rounded bg-gray-100 px-1 py-0.5 text-sm">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n\n/g, '</p><p class="text-gray-700 my-2">')
    .replace(/\n/g, '<br />')
  html = '<p class="text-gray-700 my-2">' + html + '</p>'
  return html
}

export function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const html = simpleMarkdownToHtml(content || '*No content yet*')
  return (
    <div
      className={`text-sm ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
