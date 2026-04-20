import { X } from 'lucide-react'

export function SectionCallout({ data, onDismiss, isVisible = true }) {
  return (
    <article
      className={`pointer-events-auto relative max-w-xs rounded-lg border border-purple-200 bg-purple-50/95 p-4 shadow-lg transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-2 cursor-pointer text-purple-400 hover:text-purple-600"
        aria-label="Dismiss callout"
      >
        <X size={14} />
      </button>
      <h4 className="mb-1 pr-4 text-sm font-semibold text-purple-900">{data.title}</h4>
      <p className="text-xs leading-relaxed text-purple-700">{data.text}</p>
    </article>
  )
}

export default SectionCallout
