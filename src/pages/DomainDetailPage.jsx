import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ConfidenceBadge, ScoreBadge } from '../components/shared'
import { useRole } from '../context/RoleContext'
import customFindings from '../data/customFindings.json'
import domains from '../data/domains.json'
import findings from '../data/findings.json'
import report from '../data/report.json'

const CONSULTANT_SEVERITY_STYLES = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
}

function DomainDetailPage() {
  const navigate = useNavigate()
  const { domainId } = useParams()
  const { role } = useRole()
  const [expandedCustomFindingId, setExpandedCustomFindingId] = useState(null)

  const domainNumericId = Number(domainId)
  const domain = useMemo(
    () => domains.find((item) => item.id === domainNumericId),
    [domainNumericId],
  )

  const domainNarrative = useMemo(
    () =>
      report.domainSections.find((section) => section.domainId === domainNumericId) || null,
    [domainNumericId],
  )

  const domainFindings = useMemo(
    () =>
      findings
        .filter((finding) => finding.domainId === domainNumericId)
        .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })),
    [domainNumericId],
  )

  const domainCustomFindings = useMemo(
    () => customFindings.filter((finding) => finding.domainId === domainNumericId),
    [domainNumericId],
  )

  useEffect(() => {
    document.title = domain
      ? `Clio HealthCheck — ${domain.name}`
      : 'Clio HealthCheck — Domain'
  }, [domain])

  const toggleCustomFinding = (customFindingId) => {
    setExpandedCustomFindingId((currentId) =>
      currentId === customFindingId ? null : customFindingId,
    )
  }

  if (!domain) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Domain not found.</p>
        <Link to="/" className="mt-2 inline-block text-sm text-[#0066cc] hover:underline">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const narrativeParagraphs = domainNarrative?.narrative
    ? domainNarrative.narrative.split('\n\n')
    : []

  const baselineWeightPercent = Math.round(domain.baselineWeight * 100)
  const contextWeightPercent = Math.round(domain.contextWeight * 100)

  const narrativeContent = domainNarrative?.narrative ? (
    narrativeParagraphs.map((paragraph, index) => (
      <p key={`paragraph-${index}`} className="mb-3 text-sm leading-relaxed text-gray-700">
        {paragraph}
      </p>
    ))
  ) : (
    <p className="text-sm italic text-gray-600">
      {domainNarrative?.collapsedSummary || 'No narrative available for this domain.'}
    </p>
  )

  return (
    <div>
      <Link to="/" className="mb-5 inline-block text-sm text-[#0066cc] hover:underline">
        ← Back to Dashboard
      </Link>

      <header className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">{domain.name}</h2>
          <ScoreBadge score={domain.finalScore} size="lg" />
        </div>
        <p className="mt-1 text-sm text-gray-500">{domain.question}</p>

        <div className="mb-0 mt-3 flex flex-wrap items-center gap-6 text-xs text-gray-400">
          <span>API Coverage: {domain.apiCoverage}</span>
          <span>Baseline Weight: {baselineWeightPercent}%</span>
          <span>Context Weight: {contextWeightPercent}%</span>
          <span>Findings: {domain.findingIds.length}</span>
        </div>
      </header>

      <section className="mb-8 mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-sans text-lg font-semibold text-[#1a2332]">
          Domain Narrative
        </h3>
        {narrativeContent}
      </section>

      <div className="my-8 border-t border-gray-200" />

      <section>
        <h3 className="mb-4 font-sans text-lg font-semibold text-[#1a2332]">Findings</h3>

        {domainFindings.map((finding) => (
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
            className="mb-2 cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm"
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
                <ScoreBadge score={finding.finalScore} size="sm" />
                <ConfidenceBadge level={finding.confidence} />
              </div>
            </div>
          </article>
        ))}
      </section>

      {role === 'consultant' && domainCustomFindings.length > 0 ? (
        <section className="mt-8">
          <h3 className="text-base font-semibold text-[#1a2332]">
            Consultant-Identified Findings
          </h3>

          <div className="mt-3">
            {domainCustomFindings.map((item) => {
              const isExpanded = expandedCustomFindingId === item.id
              const severityClasses =
                CONSULTANT_SEVERITY_STYLES[item.severity] || 'bg-gray-100 text-gray-700'
              const preview = `${item.observation.slice(0, 150)}...`

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
                  className="mb-2 cursor-pointer rounded-lg border border-purple-100 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-sm"
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
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </div>

                  <p className="mt-2 text-xs text-gray-400">{item.consultant}</p>
                  {!isExpanded ? (
                    <p className="mt-2 text-xs text-gray-500">{preview}</p>
                  ) : (
                    <div className="mt-3 space-y-2 rounded-lg bg-purple-50 p-3 text-sm text-gray-700">
                      <p>{item.observation}</p>
                      <p>{item.impact}</p>
                      <p>{item.recommendation}</p>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      ) : null}
    </div>
  )
}

export default DomainDetailPage
