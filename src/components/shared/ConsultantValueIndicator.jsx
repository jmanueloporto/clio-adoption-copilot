import { useEffect, useState } from 'react'
import { useRole } from '../../context/RoleContext'

export function ConsultantValueIndicator({ text }) {
  const { role } = useRole()
  const [shouldRender, setShouldRender] = useState(role === 'customer')
  const [isVisible, setIsVisible] = useState(role === 'customer')

  useEffect(() => {
    let showTimer
    let revealTimer
    let hideTimer
    let unmountTimer

    if (role === 'customer') {
      showTimer = setTimeout(() => {
        setShouldRender(true)
        revealTimer = setTimeout(() => setIsVisible(true), 20)
      }, 0)
    } else {
      hideTimer = setTimeout(() => setIsVisible(false), 0)
      unmountTimer = setTimeout(() => setShouldRender(false), 300)
    }

    return () => {
      if (showTimer) {
        clearTimeout(showTimer)
      }
      if (revealTimer) {
        clearTimeout(revealTimer)
      }
      if (hideTimer) {
        clearTimeout(hideTimer)
      }
      if (unmountTimer) {
        clearTimeout(unmountTimer)
      }
    }
  }, [role])

  if (!shouldRender) return null

  return (
    <section
      className={`rounded-lg border-l-4 border-l-[#0d9488] bg-[#f0fdfa] p-5 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <p className="mb-2 text-xs font-semibold tracking-wider text-[#0d9488]">
        WHAT A CONSULTANT WOULD DO
      </p>
      <p className="text-sm leading-relaxed text-gray-700">{text}</p>
    </section>
  )
}

export default ConsultantValueIndicator
