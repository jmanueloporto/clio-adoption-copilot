import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useDemoGuide } from '../../context/DemoGuideContext'
import { useRole } from '../../context/RoleContext'
import demoGuideData from '../../data/demoGuide.json'
import { SectionCallout } from './SectionCallout'

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function getPageName(pathname) {
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === '/') return 'dashboard'
  if (normalizedPathname === '/findings') return 'findings'
  if (normalizedPathname.startsWith('/findings/')) return 'findings-detail'
  if (normalizedPathname.startsWith('/domains/')) return 'dashboard'
  if (normalizedPathname === '/questionnaire') return 'questionnaire'
  if (normalizedPathname === '/interview-guide') return 'interview-guide'
  if (normalizedPathname === '/report') return 'report'
  if (normalizedPathname === '/engagement') return 'engagement'
  if (normalizedPathname === '/expansion') return 'expansion'
  return ''
}

function isVisibleForRole(overlayVisibility, role) {
  if (!overlayVisibility || overlayVisibility === 'both') return true
  if (overlayVisibility === 'customer') return role === 'customer'
  if (overlayVisibility === 'consultant') return role === 'consultant'
  return false
}

export function DemoGuideManager() {
  const { isActive, dismissedItems, dismissItem } = useDemoGuide()
  const { role } = useRole()
  const location = useLocation()
  const [shouldRender, setShouldRender] = useState(isActive)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let enterTimer
    let exitTimer

    if (isActive) {
      setShouldRender(true)
      enterTimer = setTimeout(() => setIsVisible(true), 10)
    } else {
      setIsVisible(false)
      exitTimer = setTimeout(() => setShouldRender(false), 300)
    }

    return () => {
      if (enterTimer) clearTimeout(enterTimer)
      if (exitTimer) clearTimeout(exitTimer)
    }
  }, [isActive])

  const currentPage = useMemo(() => getPageName(location.pathname), [location.pathname])

  const activeCards = useMemo(
    () =>
      (demoGuideData.callouts ?? []).filter((overlay) => {
        if (overlay.page !== currentPage) return false
        if (dismissedItems.has(overlay.id)) return false
        if (!isVisibleForRole(overlay.visibility, role)) return false
        return true
      }),
    [currentPage, dismissedItems, role],
  )

  if (!shouldRender || !currentPage) return null

  return (
    <>
      {activeCards.length > 0 ? (
        <aside
          className={`demo-guide-panel pointer-events-none fixed right-4 top-[120px] z-40 max-h-[calc(100vh-140px)] w-72 space-y-3 overflow-y-auto pr-1 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {activeCards.map((overlay) => (
            <div key={overlay.id} className="pointer-events-auto">
              <SectionCallout
                data={overlay}
                onDismiss={() => dismissItem(overlay.id)}
                isVisible={isVisible}
              />
            </div>
          ))}
        </aside>
      ) : null}
    </>
  )
}

export default DemoGuideManager
