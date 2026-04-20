import { ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const LAYER_DEFAULTS = {
  1: 'Automated Baseline',
  2: 'Organizational Context',
  3: 'Advanced Analysis',
  cvi: 'What a Consultant Would Do',
}

const LAYER_STYLES = {
  1: 'bg-white',
  2: 'bg-[#f0f9ff] border-l-4 border-l-[#0066cc]',
  3: 'bg-[#faf5ff] border-l-4 border-l-[#7c3aed]',
  cvi: 'bg-[#f0fdfa] border-l-4 border-l-[#0d9488]',
}

export function LayerSection({
  layer,
  title,
  subtitle,
  children,
  defaultExpanded = true,
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const resolvedTitle = title || LAYER_DEFAULTS[layer] || 'Layer'
  const layerStyles = LAYER_STYLES[layer] || LAYER_STYLES[1]

  return (
    <section className={`rounded-lg p-5 md:p-6 ${layerStyles}`}>
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <h3 className="text-lg font-semibold text-[#1a2332]">{resolvedTitle}</h3>
          {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
        </div>
        <span className="mt-0.5 text-gray-500 transition-transform duration-300">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'mt-4 max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </section>
  )
}

export default LayerSection
