const SCORE_CONFIG = {
  1: { color: 'bg-red-100 text-red-700', label: 'Initial' },
  2: { color: 'bg-orange-100 text-orange-700', label: 'Developing' },
  3: { color: 'bg-amber-100 text-amber-700', label: 'Defined' },
  4: { color: 'bg-green-200 text-green-700', label: 'Managed' },
  5: { color: 'bg-green-100 text-green-700', label: 'Optimizing' },
}

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
}

export function ScoreBadge({ score, size = 'md', showLabel = true }) {
  const classes = SIZE_CLASSES[size] ?? SIZE_CLASSES.md

  if (score == null) {
    return (
      <span
        className={`inline-flex items-center rounded-full bg-gray-100 text-gray-600 ${classes}`}
      >
        N/A
      </span>
    )
  }

  const roundedScore = Math.round(score)

  const config = SCORE_CONFIG[roundedScore] ?? {
    color: 'bg-gray-100 text-gray-600',
    label: 'Unknown',
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${config.color} ${classes}`}
    >
      <span className="font-semibold">{score}</span>
      {showLabel ? <span>{config.label}</span> : null}
    </span>
  )
}

export default ScoreBadge
