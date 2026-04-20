import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  DemoTooltip,
  ScoreBadge,
  ScoreOverrideDisplay,
} from '../components/shared'
import customFindings from '../data/customFindings.json'
import domains from '../data/domains.json'
import findings from '../data/findings.json'
import report from '../data/report.json'

const GENERATE_REPORT_TOOLTIP =
  'In production, this generates a formatted PDF report from all assessment data, ready for delivery to firm leadership.'
const DOWNLOAD_PDF_TOOLTIP =
  'In production, this downloads the report as a professionally formatted PDF document.'

function getFirstSentence(text) {
  if (!text) return ''
  const sentenceEnd = text.indexOf('. ')
  if (sentenceEnd === -1) return text
  return text.slice(0, sentenceEnd + 1)
}

function ReportPreviewPage() {
  useEffect(() => {
    document.title = 'Clio HealthCheck — Report Preview'
  }, [])

  const [expandedDomainSections, setExpandedDomainSections] = useState(
    Object.fromEntries(
      report.domainSections.map((section) => [section.domainId, section.isExpanded]),
    ),
  )
  const [expandedRoadmap, setExpandedRoadmap] = useState(
    Object.fromEntries(report.roadmap.map((phase) => [phase.phase, true])),
  )

  const annotationSourceIds = ['3.1', '3.3', '2.3', '1.1']
  const annotationCards = useMemo(
    () =>
      annotationSourceIds
        .map((id) => findings.find((finding) => finding.id === id))
        .filter(Boolean)
        .map((finding) => ({
          id: finding.id,
          annotation: finding.layer3?.annotations?.[0] || null,
        }))
        .filter((item) => item.annotation),
    [],
  )

  const overrideSourceIds = ['2.3', '6.2']
  const overrideCards = useMemo(
    () =>
      overrideSourceIds
        .map((id) => findings.find((finding) => finding.id === id))
        .filter((finding) => finding?.layer3?.override)
        .map((finding) => ({ id: finding.id, override: finding.layer3.override })),
    [],
  )

  const toggleDomainSection = (domainId) => {
    setExpandedDomainSections((previous) => ({
      ...previous,
      [domainId]: !previous[domainId],
    }))
  }

  const toggleRoadmapPhase = (phase) => {
    setExpandedRoadmap((previous) => ({
      ...previous,
      [phase]: !previous[phase],
    }))
  }

  return (
    <div className="report-container mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
      <div className="mb-6 flex justify-end gap-3">
        <DemoTooltip tooltipText={GENERATE_REPORT_TOOLTIP}>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Generate Report
          </button>
        </DemoTooltip>
        <DemoTooltip tooltipText={DOWNLOAD_PDF_TOOLTIP}>
          <button
            type="button"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Download PDF
          </button>
        </DemoTooltip>
      </div>

      <header>
        <h2 className="font-sans text-3xl font-bold text-[#1a2332]">
          Clio HealthCheck Assessment
        </h2>
        <p className="mt-1 font-sans text-xl text-gray-600">Brennan & Clark LLP</p>
        <p className="mt-2 text-sm text-gray-500">
          Prepared by Daniela Reyes, Senior Legal Technology Consultant
        </p>
        <p className="text-sm text-gray-500">Engagement Period: March 11-14, 2026</p>
        <div className="mb-8 mt-6 border-t border-gray-200" />
      </header>

      <section>
        <h3 className="mb-4 font-sans text-xl font-semibold text-[#1a2332]">
          Executive Summary
        </h3>
        {report.executiveSummary.split('\n\n').map((paragraph, index) => (
          <p key={`summary-${index}`} className="mb-4 text-sm leading-relaxed text-gray-700">
            {paragraph}
          </p>
        ))}
      </section>

      <section>
        <h3 className="mb-6 mt-10 font-sans text-xl font-semibold text-[#1a2332]">
          Assessment Scores
        </h3>

        <div className="text-center">
          <p className="font-mono text-4xl font-bold text-[#ea580c]">
            {report.scoreOverview.finalScore.toFixed(1)}
          </p>
          <p className="text-sm font-medium text-[#ea580c]">{report.scoreOverview.rating}</p>
          <p className="text-xs text-gray-500">
            Baseline: {report.scoreOverview.baselineScore.toFixed(2)}
            <span className="mx-2 text-gray-300">|</span>
            With Context: {report.scoreOverview.contextScore.toFixed(2)}
          </p>
          <p className="mt-2 text-sm italic text-gray-600">
            {report.scoreOverview.ratingDescription}
          </p>
        </div>

        <table className="mt-6 w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Domain
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Score
              </th>
              <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain, index) => (
              <tr key={domain.id} className={index % 2 === 1 ? 'bg-gray-50/50' : ''}>
                <td className="border-b border-gray-100 p-3 text-sm font-medium text-[#1a2332]">
                  {domain.name}
                </td>
                <td className="border-b border-gray-100 p-3">
                  <ScoreBadge score={domain.finalScore} size="sm" />
                </td>
                <td className="border-b border-gray-100 p-3 text-sm text-gray-600">
                  {Math.round(domain.finalScore) <= 2
                    ? 'Developing'
                    : Math.round(domain.finalScore) === 3
                      ? 'Defined'
                      : 'Managed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h3 className="mb-6 mt-10 font-sans text-xl font-semibold text-[#1a2332]">
          Domain Analysis
        </h3>
        {report.domainSections.map((section) => {
          const isExpanded = !!expandedDomainSections[section.domainId]

          return (
            <div key={section.domainId}>
              <button
                type="button"
                onClick={() => toggleDomainSection(section.domainId)}
                className="flex w-full cursor-pointer items-center justify-between rounded px-2 py-3 hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-[#1a2332]">
                    {section.title}
                  </span>
                  <span className="ml-3">
                    <ScoreBadge score={section.score} size="sm" />
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
              <div className="border-b border-gray-100" />

              {isExpanded ? (
                <div className="px-2 py-3">
                  {(section.narrative || section.collapsedSummary)
                    .split('\n\n')
                    .map((paragraph, index) => (
                      <p
                        key={`${section.domainId}-narrative-${index}`}
                        className="mb-3 text-sm leading-relaxed text-gray-700"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              ) : (
                <p className="px-2 py-2 text-sm text-gray-600">{section.collapsedSummary}</p>
              )}
            </div>
          )
        })}
      </section>

      <section>
        <h3 className="mb-6 mt-10 font-sans text-xl font-semibold text-[#1a2332]">
          Consultant Observations
        </h3>

        {annotationCards.map(({ id, annotation }) => (
          <article key={id} className="mb-3 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
              <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 font-medium text-[#0066cc]">
                Finding {id}
              </span>
              <span>{annotation.consultant}</span>
              <span>{annotation.date}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">
              {annotation.text.slice(0, 200)}...{' '}
              <Link to={`/findings/${id}`} className="text-xs text-[#0066cc] hover:underline">
                Read more →
              </Link>
            </p>
          </article>
        ))}

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {overrideCards.map(({ id, override }) => (
            <div key={`override-${id}`}>
              <ScoreOverrideDisplay
                originalScore={override.originalScore}
                overrideScore={override.overrideScore}
                justification={`${getFirstSentence(override.justification)}...`}
                consultant={override.consultant}
                date={override.date}
                compact
              />
              <p className="mt-2 text-xs">
                <Link to={`/findings/${id}`} className="text-[#0066cc] hover:underline">
                  Full justification →
                </Link>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-6 mt-10 font-sans text-xl font-semibold text-[#1a2332]">
          Consultant-Identified Findings
        </h3>

        {customFindings.map((item) => (
          <article
            key={item.id}
            className="mb-4 rounded-lg border border-gray-200 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#1a2332]">{item.title}</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  item.severity === 'High'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.severity}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              {item.consultant} - {item.date}
            </p>

            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Observation
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{item.observation}</p>

            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Impact
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{item.impact}</p>

            <p className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Recommendation
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{item.recommendation}</p>
          </article>
        ))}
      </section>

      <section>
        <h3 className="mb-6 mt-10 font-sans text-xl font-semibold text-[#1a2332]">
          Improvement Roadmap
        </h3>

        {report.roadmap.map((phase) => {
          const isExpanded = !!expandedRoadmap[phase.phase]
          return (
            <div key={`phase-${phase.phase}`} className="mb-4">
              <button
                type="button"
                onClick={() => toggleRoadmapPhase(phase.phase)}
                className="mb-3 w-full cursor-pointer rounded-lg bg-gray-50 p-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#1a2332]">
                    Phase {phase.phase}: {phase.title}
                  </p>
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-gray-500">{phase.focus}</p>
                <p className="mt-1 text-xs font-medium text-[#0066cc]">
                  Target: {phase.keyMetric}
                </p>
              </button>

              {isExpanded ? (
                <div>
                  {phase.items.map((item) => (
                    <article
                      key={`phase-item-${item.number}`}
                      className="flex gap-3 border-b border-gray-50 py-3"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#0066cc] text-xs text-white">
                        {item.number}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-[#1a2332]">{item.title}</p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">
                          {item.description}
                        </p>
                        <p className="mt-1 text-xs">
                          <span className="text-gray-400">{item.findingRef}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          <span className="font-medium text-[#0066cc]">{item.target}</span>
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default ReportPreviewPage
