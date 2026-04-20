import { Lightbulb, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function FeatureHint({
  hint,
  pageName,
  visitedPages,
  markPageVisited,
  dismissItem,
  isVisible = true,
}) {
  const isFirstVisitRef = useRef(!visitedPages.has(pageName))

  useEffect(() => {
    if (!isFirstVisitRef.current) return
    markPageVisited(pageName)
  }, [markPageVisited, pageName])

  if (!isFirstVisitRef.current) {
    return null
  }

  return (
    <div
      className={`mb-4 mx-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-2.5 transition-all duration-300 md:mx-8 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <Lightbulb size={16} className="text-blue-500" />
          <p className="ml-2 text-sm text-blue-700">{hint.text}</p>
        </div>
        <button
          type="button"
          onClick={() => dismissItem(hint.id)}
          className="cursor-pointer text-blue-400 hover:text-blue-600"
          aria-label="Dismiss hint"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default FeatureHint
