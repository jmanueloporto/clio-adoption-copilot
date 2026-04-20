import { ArrowDown, ArrowUp } from 'lucide-react'

const SCORE_COLORS = {
  1: 'text-[#dc2626]',
  2: 'text-[#ea580c]',
  3: 'text-[#ca8a04]',
  4: 'text-[#2563eb]',
  5: 'text-[#059669]',
}

const SCORE_LABELS = {
  1: 'Initial',
  2: 'Developing',
  3: 'Defined',
  4: 'Managed',
  5: 'Optimizing',
}

export function ScoreOverrideDisplay({
  originalScore,
  overrideScore,
  justification,
  consultant,
  date,
  compact = false,
}) {
  const originalColor = SCORE_COLORS[originalScore] || 'text-gray-500'
  const overrideColor = SCORE_COLORS[overrideScore] || 'text-gray-500'
  const directionDown = overrideScore < originalScore
  const numberSizeClass = compact ? 'text-3xl' : 'text-5xl'
  const arrowSize = compact ? 22 : 28

  return (
    <article className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-center gap-6">
        <span className={`${numberSizeClass} font-bold ${originalColor} opacity-40`}>
          {originalScore}
        </span>
        <span className={directionDown ? 'text-red-500' : 'text-green-500'}>
          {directionDown ? <ArrowDown size={arrowSize} /> : <ArrowUp size={arrowSize} />}
        </span>
        <span className={`${numberSizeClass} font-bold ${overrideColor}`}>
          {overrideScore}
        </span>
      </div>

      <p className="mt-3 text-center text-sm font-medium text-gray-700">
        {SCORE_LABELS[originalScore]} -&gt; {SCORE_LABELS[overrideScore]}
      </p>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Justification:
      </p>
      <p className="text-sm leading-relaxed text-gray-700">{justification}</p>

      <p className="mt-3 text-xs text-gray-400">
        {consultant} - {date}
      </p>
    </article>
  )
}

export default ScoreOverrideDisplay
