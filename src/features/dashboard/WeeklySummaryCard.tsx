import { useWeeklySummary, useGenerateWeeklySummary } from './useWeeklySummary'

export function WeeklySummaryCard() {
  const { data: summary, isLoading, error } = useWeeklySummary()
  const generate = useGenerateWeeklySummary()

  if (isLoading && !summary) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-24 animate-pulse rounded bg-gray-100" />
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Weekly summary</h3>
        <button
          type="button"
          onClick={() => generate.mutate()}
          disabled={generate.isPending}
          className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {generate.isPending ? 'Generating…' : summary ? 'Regenerate' : 'Generate'}
        </button>
      </div>
      <div className="p-4">
        {error && (
          <p className="text-sm text-red-600">
            Could not load summary. Try generating one.
          </p>
        )}
        {generate.isError && (
          <p className="mb-2 text-sm text-amber-700">
            {generate.error instanceof Error
              ? generate.error.message
              : 'Failed to generate. Check VITE_OPENROUTER_API_KEY in .env'}
          </p>
        )}
        {summary ? (
          <>
            <p className="mb-2 text-xs text-gray-500">{summary.weekLabel}</p>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {summary.summary}
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Generated {summary.generatedAt ? new Date(summary.generatedAt).toLocaleString() : ''}
            </p>
          </>
        ) : !generate.isPending && !generate.isError ? (
          <p className="text-sm text-gray-500">
            Generate a short AI summary of your activity this week (projects, notes, snippets).
          </p>
        ) : null}
      </div>
    </div>
  )
}
