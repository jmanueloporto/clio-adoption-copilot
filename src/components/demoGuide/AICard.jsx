import { Sparkles, X } from 'lucide-react'

export function AICard({ data, onDismiss, isVisible = true }) {
  return (
    <article
      className={`pointer-events-auto relative max-w-xs rounded-lg border border-indigo-200 bg-indigo-50/95 p-4 shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-2 cursor-pointer text-indigo-400 hover:text-indigo-600"
        aria-label="Dismiss AI card"
      >
        <X size={14} />
      </button>
      <div className="mb-1 flex items-center gap-1.5 pr-4">
        <Sparkles size={14} className="text-indigo-500" />
        <h4 className="text-sm font-semibold text-indigo-900">{data.title}</h4>
      </div>
      <p className="text-xs leading-relaxed text-indigo-700">{data.text}</p>
    </article>
  )
}

export default AICard
