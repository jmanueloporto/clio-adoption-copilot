import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import demoGuideData from '../../data/demoGuide.json'
import { useDemoGuide } from '../../context/DemoGuideContext'
import { useRole } from '../../context/RoleContext'
import company from '../../data/company.json'
import { SectionCallout } from '../demoGuide/SectionCallout'

function Layout() {
  const location = useLocation()
  const { role, toggleRole } = useRole()
  const { isActive, dismissedItems, dismissItem, toggleGuide } = useDemoGuide()
  const aboutCard = (demoGuideData.callouts ?? []).find((card) => card.id === 'card-about')

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const isDashboardRoute =
    location.pathname === '/' || location.pathname.startsWith('/domains/')

  const navItemClass = (isRouteActive) =>
    `whitespace-nowrap px-3 py-1 text-sm transition-colors ${
      isRouteActive
        ? 'rounded bg-white/15 font-medium text-white'
        : 'text-gray-300 hover:text-white'
    }`

  const consultantNavClass = `flex items-center gap-1 whitespace-nowrap overflow-hidden transition-all duration-300 ${
    role === 'consultant'
      ? 'max-w-[420px] translate-y-0 opacity-100'
      : 'pointer-events-none max-w-0 -translate-y-1 opacity-0'
  }`

  const roleSegmentClass = (targetRole) =>
    `cursor-pointer rounded-md px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
      role === targetRole
        ? 'bg-white text-[#1a2332] shadow-sm'
        : 'bg-transparent text-white hover:bg-white/10'
    }`

  const renderPrimaryNav = () => (
    <>
      <NavLink to="/" className={() => navItemClass(isDashboardRoute)} end>
        Dashboard
      </NavLink>
      <NavLink to="/findings" className={({ isActive }) => navItemClass(isActive)}>
        Findings
      </NavLink>
      <NavLink to="/questionnaire" className={({ isActive }) => navItemClass(isActive)}>
        Questionnaire
      </NavLink>
      <NavLink to="/report" className={({ isActive }) => navItemClass(isActive)}>
        Report
      </NavLink>
    </>
  )

  return (
    <div>
      <header className="sticky top-0 z-50 min-w-[900px] bg-[#1a2332] text-white shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between overflow-hidden whitespace-nowrap px-6 py-2.5">
            <div className="flex flex-shrink-0 items-center gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} />
                <span className="whitespace-nowrap font-sans text-lg font-semibold">
                  Clio HealthCheck
                </span>
              </div>
              <div className="h-5 w-px bg-white/20" />
              <span className="whitespace-nowrap text-sm text-gray-400">
                {company.name}
              </span>
            </div>

            <div className="flex justify-center px-4">
              <span className="demo-banner inline-flex items-center whitespace-nowrap rounded-full bg-amber-500/20 px-3 py-1 text-xs text-amber-200">
                Demo Environment — Sample Data
              </span>
            </div>

            <div className="flex flex-shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={toggleGuide}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white transition-colors hover:bg-white/10 ${
                  isActive ? 'ring-1 ring-purple-400' : ''
                }`}
              >
                {isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                Guide
              </button>

              <div className="inline-flex items-center whitespace-nowrap rounded-lg bg-white/10 p-0.5">
                <button
                  type="button"
                  className={roleSegmentClass('customer')}
                  onClick={() => {
                    if (role !== 'customer') toggleRole()
                  }}
                >
                  Customer
                </button>
                <button
                  type="button"
                  className={roleSegmentClass('consultant')}
                  onClick={() => {
                    if (role !== 'consultant') toggleRole()
                  }}
                >
                  Consultant
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between whitespace-nowrap border-t border-white/10 px-6 py-1.5">
            <nav className="flex items-center gap-1 whitespace-nowrap">
              {renderPrimaryNav()}
            </nav>
            <div className={consultantNavClass}>
              <NavLink
                to="/interview-guide"
                className={({ isActive }) => navItemClass(isActive)}
              >
                Interview
              </NavLink>
              <NavLink to="/engagement" className={({ isActive }) => navItemClass(isActive)}>
                Engagement
              </NavLink>
              <NavLink to="/expansion" className={({ isActive }) => navItemClass(isActive)}>
                Expansion
              </NavLink>
            </div>
          </div>
        </div>
      </header>
      <section className="min-h-screen bg-[#f8fafc]">
        {isActive && aboutCard && !dismissedItems.has('card-about') ? (
          <div className="fixed right-4 top-[110px] z-40 w-64">
            <SectionCallout data={aboutCard} onDismiss={() => dismissItem('card-about')} />
          </div>
        ) : null}
        <main className="mx-auto max-w-7xl px-6 py-8 md:px-8">
          <div key={location.pathname} className="animate-[fadeIn_200ms_ease-out]">
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  )
}

export default Layout
