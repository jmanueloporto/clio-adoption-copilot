import { TrendingDown, TrendingUp } from 'lucide-react'

function TrendIcon({ trend }) {
  if (trend === 'up') {
    return <TrendingUp size={18} className="text-green-500" />
  }

  if (trend === 'down') {
    return <TrendingDown size={18} className="text-red-500" />
  }

  return null
}

export function MetricCard({ label, value, subtitle, trend }) {
  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <p className="font-mono text-2xl font-bold text-[#1a2332]">{value}</p>
        <TrendIcon trend={trend} />
      </div>
      {subtitle ? <p className="mt-1 text-xs text-gray-400">{subtitle}</p> : null}
    </article>
  )
}

export default MetricCard
