import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function StoryBeatTooltip({ text }) {
  const [isOpen, setIsOpen] = useState(false)
  const hoverTimer = useRef(null)

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => {
      setIsOpen(true)
    }, 200)
  }

  const handleMouseLeave = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current)
      hoverTimer.current = null
    }
    setIsOpen(false)
  }

  useEffect(
    () => () => {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current)
      }
    },
    [],
  )

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Info
        size={16}
        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
      />
      {isOpen ? (
        <span className="absolute left-6 top-6 z-50 w-max max-w-md rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-600 shadow-lg">
          {text}
        </span>
      ) : null}
    </span>
  )
}

export default StoryBeatTooltip
