import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useDemoGuide } from '../../context/DemoGuideContext'
import { useRole } from '../../context/RoleContext'
import demoGuideData from '../../data/demoGuide.json'
import { SectionCallout } from './SectionCallout'

const CALLOUT_PLACEMENTS = {
  'card-1': 'role-toggle',
  'card-2': 'overall-score',
  'card-3': 'consultant-engagement-summary',
  'card-4': 'overall-score',
  'card-5': 'cross-domain-insights',
  'card-6': 'findings-list',
  'card-7': 'score-explanation',
  'card-8': 'findings-list',
  'card-9': 'custom-findings',
  'card-10': 'layer-sections',
  'card-11': 'comparison-cards',
  'card-12': 'cvi-section',
  'card-13': 'layer-sections',
  'card-14': 'score-override',
  'card-15': 'action-buttons',
  'card-16': 'context-explanation',
  'card-17': 'interactive-section',
  'card-18': 'context-explanation',
  'card-19': 'interactive-section',
  'card-20': 'finding-triggered',
  'card-21': 'promote-button',
  'card-22': 'report-header',
  'card-23': 'executive-summary',
  'card-24': 'report-header',
  'card-25': 'roadmap',
  'card-26': 'key-decisions',
  'card-27': 'timeline',
  'card-28': 'service-opportunities',
  'card-29': 'engagement-packaging',
}

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

export function DemoAnchor({ placement, children }) {
  const { isActive, dismissedItems, dismissItem } = useDemoGuide()
  const { role } = useRole()
  const location = useLocation()

  const currentPage = useMemo(() => getPageName(location.pathname), [location.pathname])

  const matchingCards = (demoGuideData.callouts ?? []).filter((card) => {
    const cardPlacement = card.placement || CALLOUT_PLACEMENTS[card.id]
    if (cardPlacement !== placement) return false
    if (card.page !== currentPage) return false
    if (dismissedItems.has(card.id)) return false
    return isVisibleForRole(card.visibility, role)
  })

  return (
    <div className="relative">
      {children}
      {matchingCards.length > 0 ? (
        <div
          className={`absolute right-2 top-2 z-30 w-64 space-y-2 transition-opacity duration-300 ${
            isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          {matchingCards.map((card) => (
            <SectionCallout
              key={card.id}
              data={card}
              onDismiss={() => dismissItem(card.id)}
              isVisible={isActive}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default DemoAnchor
