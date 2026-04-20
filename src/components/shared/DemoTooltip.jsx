import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function DemoTooltip({ tooltipText, children }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleTriggerClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsOpen(true)
  }

  return (
    <span ref={containerRef} className="relative inline-flex">
      <span onClick={handleTriggerClick}>{children}</span>

      {isOpen ? (
        <span className="absolute left-0 top-full z-50 mt-2 w-max max-w-sm rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 shadow-lg">
          <span className="mb-2 flex items-start justify-between gap-4">
            <span className="text-xs font-bold text-amber-600">DEMO</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-amber-600 hover:text-amber-700"
            >
              <X size={14} />
            </button>
          </span>
          <span className="block leading-relaxed">{tooltipText}</span>
        </span>
      ) : null}
    </span>
  )
}

export default DemoTooltip
