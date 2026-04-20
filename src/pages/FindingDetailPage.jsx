import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  FilePlus,
  MessageSquarePlus,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import {
  AnnotationCard,
  ComparisonCards,
  ConsultantValueIndicator,
  ConfidenceBadge,
  DemoTooltip,
  LayerSection,
  MetricCard,
  RecommendationCard,
  ScoreBadge,
  ScoreOverrideDisplay,
  StoryBeatTooltip,
} from '../components/shared'
import { useFindings } from '../context/FindingsContext'
import { useRole } from '../context/RoleContext'
import customFindings from '../data/customFindings.json'
import domains from '../data/domains.json'

const ADD_ANNOTATION_TOOLTIP_TEXT =
  'In production, this opens an annotation editor where the consultant writes observations about this finding, selects an annotation type (context note, validation, risk context, recommendation refinement), and saves it with their name and date.'
const OVERRIDE_SCORE_TOOLTIP_TEXT =
  'In production, this opens the score override dialog. The consultant provides a new score and writes a mandatory justification explaining why their expert judgment differs from the automated assessment. Both the original and override scores are always displayed.'
const ADD_CUSTOM_FINDING_TOOLTIP_TEXT =
  'In production, this opens the custom finding creator with fields for title, domain, severity, and the Observation/Impact/Recommendation structure. Custom findings capture things the automated system cannot detect.'

const FINDING_ORDER = [
  '1.1',
  '1.2',
  '2.1',
  '2.2',
  '2.3',
  '2.4',
  '3.1',
  '3.2',
  '3.3',
  '3.4',
  '3.5',
  '3.6',
  '4.1',
  '4.2',
  '5.1',
  '5.2',
  '6.1',
  '6.2',
  '7.1',
  '7.2',
  'Q.1',
  'Q.2',
]

const METRIC_CARD_CONFIG = {
  '1.1': [
    { label: 'Admin Users', value: '4 of 5 (80%)' },
    { label: 'Permission Groups', value: '0' },
    { label: 'Disabled Users', value: '3' },
  ],
  '1.2': [{ label: 'Configured', value: '4 of 10 (40%)' }],
  '2.1': [
    { label: 'Stale Matters', value: '31 (22%)' },
    { label: 'Missing Practice Areas', value: '45 (32%)' },
    { label: 'Orphaned Matters', value: '7' },
  ],
  '2.2': [
    { label: 'Email Complete', value: '76%' },
    { label: 'Phone Complete', value: '69%' },
    { label: 'Duplicates', value: '12' },
    { label: 'Custom Fields', value: '34%' },
  ],
  '2.3': [
    { label: 'Linked to Matters', value: '47%' },
    { label: 'With Reminders', value: '58%' },
    { label: 'Court Rules', value: 'Not Configured' },
  ],
  '2.4': [
    { label: 'Practice Areas with Stages', value: '2 of 5' },
    { label: 'Stage Progression', value: '38%' },
  ],
  '3.1': [
    { label: 'Firm Average', value: '27%' },
    { label: 'Adjusted Average', value: '22%' },
    { label: 'Industry Average', value: '31%' },
    { label: 'Uncaptured Revenue', value: '$178,000' },
  ],
  '3.2': [
    { label: 'Avg Lag', value: '3.2 days' },
    { label: 'Same-Day', value: '22%' },
    { label: '3+ Days Late', value: '47%' },
    { label: 'Monday Spike', value: '2.4x' },
  ],
  '3.3': [
    { label: 'Time-to-Bill', value: '38 days' },
    { label: 'Draft Aging', value: '12 days' },
    { label: 'Unbilled Inventory', value: '$127,000' },
    { label: 'Draft Invoices', value: '14' },
  ],
  '3.4': [
    { label: 'Firm Rate', value: '71%' },
    { label: 'Industry Benchmark', value: '80%' },
    { label: 'Annual Write-Offs', value: '$43,000' },
  ],
  '3.5': [
    { label: 'Collection Rate', value: '82%' },
    { label: 'Outstanding AR', value: '$89,000' },
    { label: 'Over 60 Days', value: '37%' },
    { label: 'At-Risk Amount', value: '$13,000' },
  ],
  '3.6': [
    { label: 'Trust Accounts', value: '1' },
    { label: 'Transactions (90d)', value: '23' },
    { label: 'Trust Requests', value: '0' },
    { label: 'Retainers Without Trust', value: '14' },
  ],
  '4.1': [
    { label: 'Avg Docs/Matter', value: '3.8' },
    { label: 'Zero-Doc Matters', value: '29%' },
    { label: 'Templates', value: '0' },
    { label: 'Automations', value: '0' },
  ],
  '4.2': [
    { label: 'Active Tasks', value: '67' },
    { label: 'Overdue', value: '19 (28%)' },
    { label: 'Matters with Tasks', value: '34%' },
    { label: 'Template Lists', value: '1' },
  ],
  '5.1': [
    { label: 'Conversion Rate', value: '31%' },
    { label: 'Pipeline Matters', value: '47' },
    { label: 'With Projected Value', value: '40%' },
  ],
  '5.2': [
    { label: 'Linked to Manage', value: '68%' },
    { label: 'Manual Recreation', value: '7' },
    { label: 'Data Discrepancies', value: '3' },
  ],
  '6.1': [
    { label: 'Report Presets', value: '2' },
    { label: 'Reports (90d)', value: '7' },
    { label: 'Scheduled Reports', value: '0' },
    { label: 'Types Used', value: '1 of 5' },
  ],
  '6.2': [{ label: 'Feature Utilization', value: '35%' }],
  '7.1': [
    { label: 'Active Users', value: '4 of 5 (80%)' },
    { label: 'Adoption Gap', value: '50x' },
    { label: 'Avg Feature Breadth', value: '2.8 of 6' },
  ],
  '7.2': [
    { label: 'Matters with Comms', value: '41%' },
    { label: 'Phone', value: '89%' },
    { label: 'Email', value: '11%' },
    { label: 'Time Attached', value: '15%' },
  ],
}

function UtilizationBarChart({ data, referenceValue }) {
  const getBarColor = (value) => {
    if (value > 0.4) return '#059669'
    if (value >= 0.3) return '#ca8a04'
    if (value >= 0.2) return '#ea580c'
    return '#dc2626'
  }

  return (
    <div className="mt-4 h-[250px] rounded-lg border border-gray-200 bg-white p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data}>
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
            width={120}
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
            x={referenceValue}
            stroke="#64748b"
            strokeDasharray="4 4"
            label={{
              value: `Industry Avg (${Math.round(referenceValue * 100)}%)`,
              position: 'insideTopRight',
              fill: '#64748b',
              fontSize: 10,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 4, 4]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={getBarColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function FindingMetrics({ finding }) {
  const cards = METRIC_CARD_CONFIG[finding.id] || []

  return (
    <div className="mt-5">
      {cards.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <MetricCard key={card.label} label={card.label} value={card.value} />
          ))}
        </div>
      ) : null}

      {finding.id === '1.1' ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            Access Distribution
          </p>
          <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="flex h-full w-full">
              <div className="h-full w-4/5 bg-red-500" />
              <div className="h-full w-1/5 bg-green-500" />
            </div>
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>4 Admin</span>
            <span>1 Non-Admin</span>
          </div>
        </div>
      ) : null}

      {finding.id === '1.2' ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Configuration Checklist
          </p>
          <div className="space-y-2">
            {finding.metrics.areas.map((area) => (
              <div
                key={area.name}
                className="flex items-center justify-between gap-3 rounded-md border border-gray-100 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  {area.configured ? (
                    <Check size={14} className="text-green-600" />
                  ) : (
                    <X size={14} className="text-red-500" />
                  )}
                  <span className="text-sm text-[#1a2332]">{area.name}</span>
                </div>
                <span className="text-xs text-gray-500">{area.depth}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {finding.id === '3.1' ? (
        <UtilizationBarChart data={finding.metrics.byAttorney} referenceValue={0.31} />
      ) : null}

      {finding.id === '3.4' ? (
        <UtilizationBarChart data={finding.metrics.byAttorney} referenceValue={0.8} />
      ) : null}

      {finding.id === '6.2' ? (
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
            Unused Features
          </p>
          <div className="flex flex-wrap gap-2">
            {finding.metrics.unusedFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ConsultantActionButtons() {
  return (
    <div className="mt-6 flex gap-3">
      <DemoTooltip tooltipText={ADD_ANNOTATION_TOOLTIP_TEXT}>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <MessageSquarePlus size={16} />
          Add Annotation
        </button>
      </DemoTooltip>

      <DemoTooltip tooltipText={OVERRIDE_SCORE_TOOLTIP_TEXT}>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <ArrowUpDown size={16} />
          Override Score
        </button>
      </DemoTooltip>

      <DemoTooltip tooltipText={ADD_CUSTOM_FINDING_TOOLTIP_TEXT}>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <FilePlus size={16} />
          Add Custom Finding
        </button>
      </DemoTooltip>
    </div>
  )
}

function FindingDetailPage() {
  const { id } = useParams()
  const { role } = useRole()
  const { findings } = useFindings()
  const [showConfidenceHelp, setShowConfidenceHelp] = useState(false)
  const [expandedCustomFindingIds, setExpandedCustomFindingIds] = useState({})
  const [expandedEvidenceIds, setExpandedEvidenceIds] = useState({})

  const finding = useMemo(
    () => findings.find((item) => item.id === id),
    [findings, id],
  )

  useEffect(() => {
    if (finding) {
      document.title = `Clio HealthCheck — Finding ${finding.id}: ${finding.title}`
      return
    }
    document.title = 'Clio HealthCheck — Findings'
  }, [finding])
  const findingOrderIndex = FINDING_ORDER.indexOf(id)

  const previousFindingId =
    findingOrderIndex >= 0
      ? FINDING_ORDER[
          (findingOrderIndex - 1 + FINDING_ORDER.length) % FINDING_ORDER.length
        ]
      : FINDING_ORDER[FINDING_ORDER.length - 1]
  const nextFindingId =
    findingOrderIndex >= 0
      ? FINDING_ORDER[(findingOrderIndex + 1) % FINDING_ORDER.length]
      : FINDING_ORDER[0]

  const previousFinding = findings.find((item) => item.id === previousFindingId)
  const nextFinding = findings.find((item) => item.id === nextFindingId)

  if (!finding) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-sm text-gray-600">Finding not found.</p>
        <Link to="/findings" className="mt-2 inline-block text-sm text-[#0066cc] hover:underline">
          Back to findings
        </Link>
      </div>
    )
  }

  const domainName =
    domains.find((domain) => domain.id === finding.domainId)?.name || 'Unknown Domain'
  const customFindingsById = useMemo(
    () => Object.fromEntries(customFindings.map((item) => [item.id, item])),
    [],
  )

  const layer3 = finding.layer3 || {
    annotations: [],
    override: null,
    customFindings: [],
    interviewEvidence: [],
  }

  const hasLayer3Content =
    (layer3.annotations?.length || 0) > 0 ||
    layer3.override !== null ||
    (layer3.customFindings?.length || 0) > 0 ||
    (layer3.interviewEvidence?.length || 0) > 0

  const shouldRenderLayer3 = hasLayer3Content || role === 'consultant'

  const toggleCustomFinding = (customFindingId) => {
    setExpandedCustomFindingIds((previousState) => ({
      ...previousState,
      [customFindingId]: !previousState[customFindingId],
    }))
  }

  const toggleInterviewEvidence = (evidenceId) => {
    setExpandedEvidenceIds((previousState) => ({
      ...previousState,
      [evidenceId]: !previousState[evidenceId],
    }))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link to={`/findings/${previousFindingId}`} className="text-sm text-[#0066cc] hover:underline">
          ← {previousFinding?.title || 'Previous Finding'}
        </Link>
        <Link to={`/findings/${nextFindingId}`} className="text-sm text-[#0066cc] hover:underline">
          {nextFinding?.title || 'Next Finding'} →
        </Link>
      </div>

      <header className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-start gap-3">
          <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
            {finding.title}
          </h2>
          <ScoreBadge score={finding.finalScore} size="lg" />
          <ConfidenceBadge level={finding.confidence} />
          <StoryBeatTooltip text={finding.storyBeat} />
        </div>
        <p className="mt-3 text-sm text-gray-500">
          Domain: {domainName}
          <span className="mx-2 text-gray-300">|</span>
          Enrichment: {finding.enrichmentSource}
        </p>
      </header>

      <section className="mt-6">
        <h3 className="font-sans text-lg font-semibold text-[#1a2332]">
          Layer 1 — Automated Baseline
        </h3>

        {finding.isQuestionnaireOnly ? (
          <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm italic text-gray-600">
            This finding is derived entirely from the organizational context
            questionnaire — no automated baseline data is available.
          </div>
        ) : (
          <FindingMetrics finding={finding} />
        )}

        <h3 className="mb-4 mt-8 font-sans text-lg font-semibold text-[#1a2332]">
          Recommendations
        </h3>
        <div className="space-y-3">
          {finding.recommendations.map((recommendation, index) => (
            <RecommendationCard
              key={`${finding.id}-recommendation-${index + 1}`}
              index={index + 1}
              body={recommendation.body}
              whyRelevant={recommendation.whyRelevant}
              howToImplement={recommendation.howToImplement}
            />
          ))}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setShowConfidenceHelp((prev) => !prev)}
            className="flex items-center gap-1 text-sm text-[#0066cc]"
          >
            How to increase confidence →
            {showConfidenceHelp ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showConfidenceHelp ? (
            <div className="mt-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              Complete the organizational context questionnaire (Section{' '}
              {finding.enrichmentSource}) to provide additional context the API
              cannot capture.
            </div>
          ) : null}
        </div>

        <div className="mt-8">
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {finding.isQuestionnaireOnly
                ? 'Organizational context assessment'
                : 'How organizational context changes this finding'}
            </span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <LayerSection layer={2} defaultExpanded>
            <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              Source: {finding.enrichmentSource}
            </span>

            <h4 className="mb-3 mt-3 font-sans text-lg font-semibold text-[#1a2332]">
              {finding.layer2?.headline}
            </h4>

            <p className="mb-6 max-w-prose text-sm leading-relaxed text-gray-700">
              {finding.layer2?.detail}
            </p>

            <ComparisonCards
              baselineCard={finding.layer2?.baselineCard}
              contextCard={finding.layer2?.contextCard}
            />
          </LayerSection>

          {shouldRenderLayer3 ? (
            <div className="mt-8">
              <LayerSection layer={3} defaultExpanded>
                {(layer3.annotations?.length || 0) > 0 ? (
                  <div className="space-y-3">
                    {layer3.annotations.map((annotation) => (
                      <AnnotationCard
                        key={annotation.id}
                        text={annotation.text}
                        consultant={annotation.consultant}
                        date={annotation.date}
                        type={annotation.type}
                      />
                    ))}
                  </div>
                ) : null}

                {layer3.override ? (
                  <div className="mt-4">
                    <ScoreOverrideDisplay
                      originalScore={layer3.override.originalScore}
                      overrideScore={layer3.override.overrideScore}
                      justification={layer3.override.justification}
                      consultant={layer3.override.consultant}
                      date={layer3.override.date}
                    />
                  </div>
                ) : null}

                {(layer3.customFindings?.length || 0) > 0 ? (
                  <div className="mt-6">
                    <h4 className="mb-3 text-sm font-semibold text-[#1a2332]">
                      Related Consultant Findings
                    </h4>

                    {layer3.customFindings
                      .map((customFindingId) => customFindingsById[customFindingId])
                      .filter(Boolean)
                      .map((customFinding) => {
                        const isExpanded = !!expandedCustomFindingIds[customFinding.id]
                        const severityStyles =
                          customFinding.severity === 'High'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                        const preview = `${customFinding.observation.slice(0, 150)}...`

                        return (
                          <article
                            key={customFinding.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => toggleCustomFinding(customFinding.id)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                toggleCustomFinding(customFinding.id)
                              }
                            }}
                            className="mb-2 rounded-lg border border-purple-100 bg-white p-4"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium text-[#7c3aed]">
                                {customFinding.title}
                              </p>
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs ${severityStyles}`}
                              >
                                {customFinding.severity}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{preview}</p>

                            {isExpanded ? (
                              <div className="mt-3 space-y-3">
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Observation
                                  </p>
                                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
                                    {customFinding.observation}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Impact
                                  </p>
                                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
                                    {customFinding.impact}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Recommendation
                                  </p>
                                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
                                    {customFinding.recommendation}
                                  </p>
                                </div>
                              </div>
                            ) : null}
                          </article>
                        )
                      })}
                  </div>
                ) : null}

                {(layer3.interviewEvidence?.length || 0) > 0 ? (
                  <div className="mb-2 mt-6">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Supporting Interview Evidence
                    </p>
                    {layer3.interviewEvidence.map((evidence) => {
                      const isExpanded = !!expandedEvidenceIds[evidence.id]
                      const answerPreview = `${evidence.answer.slice(0, 100)}...`
                      return (
                        <article
                          key={evidence.id}
                          className="mb-2 rounded-lg border border-purple-100 bg-purple-50/30 p-4"
                        >
                          {!isExpanded ? (
                            <p className="text-sm leading-relaxed text-gray-700">
                              {answerPreview}
                            </p>
                          ) : (
                            <div>
                              <p className="mb-2 text-sm italic text-gray-500">
                                {evidence.question}
                              </p>
                              <p className="text-sm leading-relaxed text-gray-700">
                                {evidence.answer}
                              </p>
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => toggleInterviewEvidence(evidence.id)}
                            className="mt-2 text-xs font-medium text-[#7c3aed] hover:underline"
                          >
                            {isExpanded ? 'Show less' : 'Show more'}
                          </button>
                        </article>
                      )
                    })}
                  </div>
                ) : null}

                {role === 'consultant' ? <ConsultantActionButtons /> : null}
              </LayerSection>
            </div>
          ) : null}

          {role === 'customer' ? <div className="my-6 border-t border-teal-100" /> : null}
          <ConsultantValueIndicator text={finding.cvi} />
        </div>
      </section>
    </div>
  )
}

export default FindingDetailPage
