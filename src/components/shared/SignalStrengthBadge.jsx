const SIGNAL_STYLES = {
  Strong: 'bg-green-100 text-green-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Exploratory: 'bg-gray-100 text-gray-600',
}

export function SignalStrengthBadge({ strength }) {
  const classes = SIGNAL_STYLES[strength] ?? SIGNAL_STYLES.Exploratory

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {strength}
    </span>
  )
}

export default SignalStrengthBadge
