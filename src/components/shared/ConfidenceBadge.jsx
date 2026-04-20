const CONFIDENCE_STYLES = {
  High: 'bg-green-50 text-green-700 border border-green-200',
  Medium: 'bg-amber-50 text-amber-700 border border-amber-200',
  Low: 'bg-gray-50 text-gray-500 border border-gray-200',
}

export function ConfidenceBadge({ level }) {
  const classes = CONFIDENCE_STYLES[level] ?? CONFIDENCE_STYLES.Low

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${classes}`}
    >
      {level}
    </span>
  )
}

export default ConfidenceBadge
