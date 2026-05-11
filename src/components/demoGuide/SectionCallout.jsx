import { X } from 'lucide-react'

export function SectionCallout({
  data,
  onDismiss,
  isVisible = true,
  dismissible = true,
  className = '',
}) {
  return (
    <article
      className={`pointer-events-auto relative max-w-xs rounded-lg border border-purple-200 bg-white p-3 shadow-xl transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
    >
      {dismissible ? (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-1.5 top-1.5 cursor-pointer text-purple-400 hover:text-purple-600"
          aria-label="Dismiss callout"
        >
          <X size={14} />
        </button>
      ) : null}
      <h4 className="mb-1 pr-6 text-sm font-semibold text-purple-900">{data.title}</h4>
      <p className="text-xs leading-relaxed text-purple-700">{data.text}</p>
    </article>
  )
}

export default SectionCallout
