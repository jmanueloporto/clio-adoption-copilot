import { Check, DollarSign, Minus, ShieldAlert, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link, useNavigate } from 'react-router-dom'
import DemoAnchor from '../components/demoGuide/DemoAnchor'
import { ScoreBadge } from '../components/shared'
import { useRole } from '../context/RoleContext'
import company from '../data/company.json'
import domains from '../data/domains.json'
import findings from '../data/findings.json'

function DashboardPage() {
  const navigate = useNavigate()
  const { role } = useRole()

  const [cardsVisible, setCardsVisible] = useState(false)
  const [showConsultantSummary, setShowConsultantSummary] = useState(
    role === 'customer',
  )
  const [consultantSummaryVisible, setConsultantSummaryVisible] = useState(
    role === 'customer',
  )

  useEffect(() => {
    document.title = 'Clio HealthCheck — Dashboard'
  }, [])

  const findingsById = useMemo(
    () => Object.fromEntries(findings.map((finding) => [finding.id, finding])),
    [],
  )
  const sortedDomains = useMemo(
    () =>
      [...domains].sort((a, b) => {
        if (a.finalScore !== b.finalScore) {
          return a.finalScore - b.finalScore
        }
        return a.id - b.id
      }),
    [],
  )

  useEffect(() => {
    const timer = setTimeout(() => setCardsVisible(true), 20)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let showTimer
    let revealTimer
    let hideTimer
    let unmountTimer

    if (role === 'customer') {
      showTimer = setTimeout(() => {
        setShowConsultantSummary(true)
        revealTimer = setTimeout(() => setConsultantSummaryVisible(true), 20)
      }, 0)
    } else {
      hideTimer = setTimeout(() => setConsultantSummaryVisible(false), 0)
      unmountTimer = setTimeout(() => setShowConsultantSummary(false), 300)
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(revealTimer)
      clearTimeout(hideTimer)
      clearTimeout(unmountTimer)
    }
  }, [role])

  const utilizationData = [
    { name: 'J. Okafor', value: 0.41 },
    { name: 'R. Brennan', value: 0.34 },
    { name: 'S. Vega', value: 0.28 },
    { name: 'K. Clark', value: 0.08 },
  ]

  const utilizationBarColor = (value) => {
    if (value > 0.4) return '#059669'
    if (value >= 0.3) return '#ca8a04'
    if (value >= 0.2) return '#ea580c'
    return '#dc2626'
  }

  const criticalFindings = [
    {
      id: '2.3',
      score: 1,
      impact:
        'Active malpractice exposure — missed deadline with no process change',
      borderColor: 'border-l-[#dc2626]',
    },
    {
      id: '3.1',
      score: 2,
      impact: '$178,000 in uncaptured annual revenue',
      borderColor: 'border-l-[#ea580c]',
    },
    {
      id: '3.3',
      score: 2,
      impact: '$127,000 unbilled inventory, 38-day billing cycle',
      borderColor: 'border-l-[#ea580c]',
    },
    {
      id: '3.5',
      score: 2,
      impact: '$89,000 outstanding with no collections process',
      borderColor: 'border-l-[#ea580c]',
    },
    {
      id: '1.1',
      score: 2,
      impact: '80% admin access, partial 2FA, no security policy',
      borderColor: 'border-l-[#ea580c]',
    },
  ]

  const featureHeaders = ['Time', 'Tasks', 'Calendar', 'Docs', 'Comms', 'Notes']
  const featureRows = [
    { name: 'J. Okafor', values: [true, true, true, true, true, false] },
    { name: 'R. Brennan', values: [true, true, true, false, true, false] },
    { name: 'S. Vega', values: [true, true, true, false, false, false] },
    { name: 'K. Clark', values: [true, false, false, false, false, false] },
    { name: 'A. Torres', values: [false, true, true, true, false, false] },
    { name: 'M. Santos', values: [true, true, false, false, true, false] },
  ]

  const getScoreColor = (score) => {
    const roundedScore = Math.round(score)
    if (roundedScore <= 1) return '#dc2626'
    if (roundedScore === 2) return '#ea580c'
    if (roundedScore === 3) return '#ca8a04'
    if (roundedScore === 4) return '#4ade80'
    return '#059669'
  }

  return (
    <div className="space-y-8">
      <DemoAnchor placement="role-toggle">
        <section className="flex items-center gap-6">
          <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
            Overall Maturity Score
          </h2>
          <span
            className="font-mono text-4xl font-bold"
            style={{ color: getScoreColor(2.3) }}
          >
            {2.3.toFixed(1)}
          </span>
        </section>
      </DemoAnchor>

      <DemoAnchor placement="overall-score">
        <section className="mt-6">
        <header className="mb-4">
          <h3 className="font-sans text-xl font-semibold text-[#1a2332]">
            Domain Scores
          </h3>
          <p className="text-sm text-gray-500">7 evaluation domains</p>
        </header>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDomains.map((domain, index) => (
              <article
                key={domain.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/domains/${domain.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    navigate(`/domains/${domain.id}`)
                  }
                }}
                className={`cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  cardsVisible ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <h4 className="text-sm font-semibold leading-tight text-[#1a2332]">
                  {domain.name}
                </h4>
                <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                  {domain.question}
                </p>

                <p
                  className="mt-4 text-lg font-bold font-mono"
                  style={{ color: getScoreColor(domain.finalScore) }}
                >
                  {domain.finalScore}
                </p>

                <div className="mt-3 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${(domain.finalScore / 5) * 100}%`,
                      backgroundColor: getScoreColor(domain.finalScore),
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <span>{domain.findingIds.length} findings</span>
                  <span>{domain.apiCoverage}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </DemoAnchor>

      <section>
        <header className="mb-4">
          <h3 className="font-sans text-xl font-semibold text-[#1a2332]">
            Critical Findings
          </h3>
          <p className="text-sm text-gray-500">
            Top 5 findings requiring immediate attention
          </p>
        </header>

        <div className="space-y-3">
          {criticalFindings.map((item) => {
            const findingTitle = findingsById[item.id]?.title || `Finding ${item.id}`
            return (
              <article
                key={item.id}
                className={`flex items-center gap-4 rounded-lg border border-gray-200 border-l-[3px] ${item.borderColor} bg-white p-4 transition hover:shadow-sm`}
              >
                <ScoreBadge score={item.score} size="sm" />
                <div className="min-w-0">
                  <Link
                    to={`/findings/${item.id}`}
                    className="text-sm font-medium text-[#0066cc] hover:underline"
                  >
                    {findingTitle}
                  </Link>
                  <p className="text-xs text-gray-500">{item.impact}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <DemoAnchor placement="cross-domain-insights">
        <section>
        <header className="mb-4">
          <h3 className="font-sans text-xl font-semibold text-[#1a2332]">
            Cross-Domain Insights
          </h3>
          <p className="text-sm text-gray-500">Patterns across multiple findings</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h4 className="mb-4 text-sm font-semibold text-[#1a2332]">
              Utilization by Attorney
            </h4>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={utilizationData}>
                  <XAxis
                    type="number"
                    domain={[0, 0.5]}
                    tickFormatter={(value) => `${Math.round(value * 100)}%`}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    width={70}
                  />
                  <Tooltip
                    formatter={(value) => [`${Math.round(value * 100)}%`, 'Utilization']}
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                    }}
                    labelStyle={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#1a2332',
                    }}
                    itemStyle={{
                      fontSize: '12px',
                      fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                      color: '#1a2332',
                    }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <ReferenceLine
                    x={0.31}
                    stroke="#64748b"
                    strokeDasharray="4 4"
                    label={{
                      value: 'Industry Avg (31%)',
                      position: 'insideTopRight',
                      fill: '#64748b',
                      fontSize: 10,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                    {utilizationData.map((entry) => (
                      <Cell key={entry.name} fill={utilizationBarColor(entry.value)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h4 className="mb-4 text-sm font-semibold text-[#1a2332]">Revenue Cycle</h4>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="h-8 rounded bg-gray-100 p-1">
                  <div
                    className="flex h-full items-center rounded bg-blue-500 px-2"
                    style={{ width: '100%' }}
                  />
                </div>
                <p className="text-xs font-medium text-[#1a2332]">
                  Total Revenue — $610K
                </p>
              </div>
              <p className="text-xs text-gray-500">→ $476K uncaptured</p>

              <div className="space-y-1">
                <div className="h-8 rounded bg-gray-100 p-1">
                  <div
                    className="flex h-full items-center rounded bg-orange-500 px-2"
                    style={{ width: '22%' }}
                  />
                </div>
                <p className="text-xs font-medium text-[#1a2332]">
                  Captured (22%) — $134K
                </p>
              </div>
              <p className="text-xs text-gray-500">→ $39K written off</p>

              <div className="space-y-1">
                <div className="h-8 rounded bg-gray-100 p-1">
                  <div
                    className="flex h-full items-center rounded bg-amber-500 px-2"
                    style={{ width: '15.5%' }}
                  />
                </div>
                <p className="text-xs font-medium text-[#1a2332]">
                  Realized (71%) — $95K
                </p>
              </div>
              <p className="text-xs text-gray-500">→ $17K uncollected</p>

              <div className="space-y-1">
                <div className="h-8 rounded bg-gray-100 p-1">
                  <div
                    className="flex h-full items-center rounded bg-red-500 px-2"
                    style={{ width: '12.8%' }}
                  />
                </div>
                <p className="text-xs font-medium text-[#1a2332]">
                  Collected (82%) — $78K
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-gray-200 bg-white p-5">
            <h4 className="mb-4 text-sm font-semibold text-[#1a2332]">
              Feature Adoption
            </h4>
            <div>
              <table className="w-full table-fixed border-separate border-spacing-1">
                <colgroup>
                  <col className="w-16" />
                  {featureHeaders.map((header) => (
                    <col key={`col-${header}`} className="w-8" />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-left text-[10px] font-medium uppercase text-gray-500" />
                    {featureHeaders.map((header) => (
                      <th
                        key={header}
                        className="text-center text-[10px] font-medium uppercase text-gray-500"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row) => (
                    <tr key={row.name}>
                      <td className="whitespace-nowrap pr-1 text-[10px] font-medium text-gray-700">
                        {row.name}
                      </td>
                      {row.values.map((isActive, index) => (
                        <td key={`${row.name}-${featureHeaders[index]}`}>
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded ${
                              isActive ? 'bg-green-100' : 'bg-gray-50'
                            }`}
                          >
                            {isActive ? (
                              <Check size={14} className="text-green-600" />
                            ) : (
                              <Minus size={14} className="text-gray-300" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
          </div>
        </section>
      </DemoAnchor>

      {showConsultantSummary ? (
        <DemoAnchor placement="consultant-engagement-summary">
          <section
            className={`mt-8 rounded-xl border border-teal-100 border-t border-t-teal-200 bg-[#f0fdfa] p-6 pt-6 transition-opacity duration-300 ${
              consultantSummaryVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h3 className="font-sans text-xl font-semibold text-[#0d9488]">
              How a Consultant Would Help
            </h3>
            <p className="text-sm text-gray-500">Based on your assessment data</p>
            <p className="mb-4 mt-3 text-sm text-gray-700">
              17 of 22 findings would benefit from consultant depth for {company.name}
            </p>
            <p className="mb-4 text-xl font-bold text-[#0d9488]">
              $120,000 in combined recoverable annual revenue
            </p>

          <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-3">
            <article className="h-full rounded-lg border border-teal-50 bg-white p-4">
              <DollarSign size={18} className="mb-2 text-[#0d9488]" />
              <h4 className="text-sm font-semibold text-[#1a2332]">Revenue Recovery</h4>
              <p className="mt-1 text-xs text-gray-600">
                $120,000 in combined recoverable annual revenue identified across
                utilization, realization, and collection gaps
              </p>
            </article>
            <article className="h-full rounded-lg border border-teal-50 bg-white p-4">
              <ShieldAlert size={18} className="mb-2 text-[#0d9488]" />
              <h4 className="text-sm font-semibold text-[#1a2332]">
                Risk Remediation
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                Confirmed deadline miss, undetected conflict, and security gaps
                require structured intervention
              </p>
            </article>
            <article className="h-full rounded-lg border border-teal-50 bg-white p-4">
              <Zap size={18} className="mb-2 text-[#0d9488]" />
              <h4 className="text-sm font-semibold text-[#1a2332]">
                Workflow Automation
              </h4>
              <p className="mt-1 text-xs text-gray-600">
                200–300 hours/year in document drafting savings available through
                template migration
              </p>
            </article>
          </div>

            <p className="mt-4 text-base font-semibold text-[#0d9488]">
              Recommended engagement: Guided Assessment (3–5 days)
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Based on your assessment data, a structured engagement would address the
              gaps identified above with measurable outcomes.
            </p>
          </section>
        </DemoAnchor>
      ) : null}
    </div>
  )
}

export default DashboardPage
