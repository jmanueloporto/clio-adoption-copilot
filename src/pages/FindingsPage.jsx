import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DemoAnchor from '../components/demoGuide/DemoAnchor'
import {
  ConfidenceBadge,
  DemoTooltip,
} from '../components/shared'
import { useRole } from '../context/RoleContext'
import customFindings from '../data/customFindings.json'
import domains from '../data/domains.json'
import findings from '../data/findings.json'

const FILTER_TOOLTIP_TEXT =
  'In production, filter findings by domain, score, confidence, and keywords.'

const CONSULTANT_SEVERITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
}

function FindingsPage() {
  const navigate = useNavigate()
  const { role } = useRole()
  const [expandedCustomFindingId, setExpandedCustomFindingId] = useState(null)

  useEffect(() => {
    document.title = 'Clio HealthCheck — Findings'
  }, [])

  const findingsById = useMemo(
    () => Object.fromEntries(findings.map((finding) => [finding.id, finding])),
    [],
  )

  const groupedFindings = useMemo(
    () =>
      domains
        .map((domain) => ({
          ...domain,
          findings: domain.findingIds
            .map((findingId) => findingsById[findingId])
            .filter(Boolean),
        }))
        .filter((domain) => domain.findings.length > 0),
    [findingsById],
  )

  const getDomainName = (domainId) =>
    domains.find((domain) => domain.id === domainId)?.name || 'Unknown Domain'

  const toggleCustomFinding = (customFindingId) => {
    setExpandedCustomFindingId((currentId) =>
      currentId === customFindingId ? null : customFindingId,
    )
  }

  return (
    <div>
      <header>
        <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
          Assessment Findings
        </h2>
        <p className="mt-1 text-sm text-gray-500">22 findings across 7 domains</p>
      </header>

      <DemoAnchor placement="score-explanation">
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          {['Domain', 'Score', 'Confidence'].map((label) => (
            <DemoTooltip key={label} tooltipText={FILTER_TOOLTIP_TEXT}>
              <button
                type="button"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-400 transition hover:border-gray-300"
              >
                <span className="flex items-center justify-between">
                  <span>{label}</span>
                  <ChevronDown size={14} />
                </span>
              </button>
            </DemoTooltip>
          ))}
        </div>
      </DemoAnchor>

      <DemoAnchor placement="findings-list">
        <section className="mt-4">
          {groupedFindings.map((domain, index) => (
            <div key={domain.id}>
              <div
                className={`mb-3 flex items-center gap-3 border-b border-gray-100 pb-2 ${
                  index === 0 ? 'mt-6' : 'mt-7'
                }`}
              >
                <h3 className="text-base font-semibold text-[#1a2332]">{domain.name}</h3>
                <span className="text-xs text-gray-400">
                  {domain.findings.length} findings
                </span>
              </div>

              {domain.findings.map((finding) => (
                <article
                  key={finding.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/findings/${finding.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      navigate(`/findings/${finding.id}`)
                    }
                  }}
                  className="mb-2 cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs text-gray-600">
                      {finding.id}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/findings/${finding.id}`}
                        className="text-sm font-medium text-[#0066cc] hover:underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {finding.title}
                      </Link>
                      <p className="line-clamp-1 text-xs text-gray-500">
                        {finding.layer2?.headline}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <ConfidenceBadge level={finding.confidence} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ))}
        </section>
      </DemoAnchor>

      {role === 'consultant' ? (
        <DemoAnchor placement="custom-findings">
          <section className="mt-8">
            <h3 className="text-base font-semibold text-[#1a2332]">
              Consultant-Identified Findings
            </h3>

            <div className="mt-3">
              {customFindings.map((item) => {
                const isExpanded = expandedCustomFindingId === item.id
                const severityClasses =
                  CONSULTANT_SEVERITY_STYLES[item.severity] ||
                  'bg-gray-100 text-gray-700'

                return (
                  <article
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCustomFinding(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        toggleCustomFinding(item.id)
                      }
                    }}
                    className="mb-2 cursor-pointer rounded-lg border border-purple-100 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#7c3aed]">{item.title}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs ${severityClasses}`}
                          >
                            {item.severity}
                          </span>
                          <span className="text-xs text-gray-400">
                            {getDomainName(item.domainId)}
                          </span>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>

                    <p className="mt-2 text-xs text-gray-400">{item.consultant}</p>

                    {isExpanded ? (
                      <div className="mt-3 space-y-2 rounded-lg bg-purple-50 p-3 text-sm text-gray-700">
                        <p>{item.observation}</p>
                        <p>{item.impact}</p>
                        <p>{item.recommendation}</p>
                      </div>
                    ) : null}
                  </article>
                )
              })}
          </div>
          </section>
        </DemoAnchor>
      ) : null}
    </div>
  )
}

export default FindingsPage
