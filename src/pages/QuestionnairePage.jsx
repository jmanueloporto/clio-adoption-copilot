import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Minus,
  Plus,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFindings } from '../context/FindingsContext'
import findingsSeed from '../data/findings.json'
import questionnaire from '../data/questionnaire.json'

const INTERACTIVE_SECTION_IDS = new Set(['Q3.1', 'Q2.3', 'Q6.2'])

function isEqualValue(a, b) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => item === b[index])
  }
  return a === b
}

function formatPercent(value) {
  const asPercent = value * 100
  const rounded = Math.round(asPercent * 10) / 10
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1)
}

function getInitialResponses() {
  const responses = {}

  questionnaire.forEach((section) => {
    section.questions.forEach((question) => {
      responses[question.qId] = Array.isArray(question.sampleAnswer)
        ? [...question.sampleAnswer]
        : question.sampleAnswer

      if (question.conditional?.followUp) {
        const followUp = question.conditional.followUp
        responses[followUp.qId] = Array.isArray(followUp.sampleAnswer)
          ? [...followUp.sampleAnswer]
          : followUp.sampleAnswer
      }
    })
  })

  return responses
}

function shouldShowFollowUp(question, answer) {
  const conditional = question.conditional
  if (!conditional) return false

  const triggerValues = conditional.triggerValues
    ? conditional.triggerValues
    : conditional.triggerValue
      ? [conditional.triggerValue]
      : []

  return triggerValues.includes(answer)
}

function QuestionnairePage() {
  const { findings, updateFinding } = useFindings()

  const [responses, setResponses] = useState(() => getInitialResponses())
  const [expandedSections, setExpandedSections] = useState(() =>
    Object.fromEntries(
      questionnaire.map((section) => [section.id, section.isInteractive]),
    ),
  )
  const [highlightedSectionId, setHighlightedSectionId] = useState(null)
  const [toast, setToast] = useState(null)
  const [toastVisible, setToastVisible] = useState(false)

  useEffect(() => {
    document.title = 'Clio HealthCheck — Questionnaire'
  }, [])

  const hideToastTimeoutRef = useRef(null)
  const removeToastTimeoutRef = useRef(null)
  const highlightTimeoutRef = useRef(null)

  const originalFindingsById = useMemo(
    () => Object.fromEntries(findingsSeed.map((finding) => [finding.id, finding])),
    [],
  )

  const triggerToast = (findingId) => {
    if (hideToastTimeoutRef.current) clearTimeout(hideToastTimeoutRef.current)
    if (removeToastTimeoutRef.current) clearTimeout(removeToastTimeoutRef.current)

    setToast({ findingId })
    setToastVisible(true)

    hideToastTimeoutRef.current = setTimeout(() => setToastVisible(false), 3700)
    removeToastTimeoutRef.current = setTimeout(() => setToast(null), 4000)
  }

  const triggerSectionHighlight = (sectionId) => {
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current)
    setHighlightedSectionId(sectionId)
    highlightTimeoutRef.current = setTimeout(
      () => setHighlightedSectionId(null),
      500,
    )
  }

  const updateFindingById = (findingId, updater) => {
    const target = findings.find((finding) => finding.id === findingId)
    if (!target) return
    const updates = updater(target)
    updateFinding(findingId, updates)
  }

  const recalculateForChange = (sectionId, questionId, value) => {
    if (sectionId === 'Q3.1' && questionId === 'Q3.1.1') {
      const numericHours = Number(value) || 1
      const newUtilization = Math.round((0.22 * (50 / numericHours)) * 100) / 100
      const percentText = formatPercent(newUtilization)

      let headline = `Revenue leakage is severe — actual utilization drops to ${percentText}% against reported hours, well below the 27% baseline.`
      if (newUtilization >= 0.27) {
        headline = `Utilization rate is ${percentText}% — below industry average but within striking distance of improvement.`
      } else if (newUtilization >= 0.22) {
        headline = `Revenue leakage is worse than it appeared — actual utilization is ${percentText}%, not 27%.`
      }

      updateFindingById('3.1', (target) => ({
        metrics: {
          ...target.metrics,
          adjustedAverage: newUtilization,
        },
        layer2: {
          ...target.layer2,
          headline,
        },
      }))
      triggerSectionHighlight(sectionId)
      triggerToast('3.1')
      return
    }

    if (sectionId === 'Q2.3' && questionId === 'Q2.3.4') {
      const highRiskHeadline =
        'A missed deadline in the past year confirms the risk — manual deadline calculation with inconsistent reminders is a malpractice exposure.'
      const lowerRiskHeadline =
        'Manual deadline calculation with inconsistent reminders creates avoidable risk — but no recent incidents.'

      const headline =
        value === 'Yes within the last year' ? highRiskHeadline : lowerRiskHeadline

      updateFindingById('2.3', (target) => ({
        layer2: {
          ...target.layer2,
          headline,
        },
      }))
      triggerSectionHighlight(sectionId)
      triggerToast('2.3')
      return
    }

    if (sectionId === 'Q6.2' && questionId === 'Q6.2.1') {
      const featureCounts = {
        EasyStart: 20,
        Essentials: 35,
        Advanced: 50,
        Complete: 65,
      }

      const selectedPlan = value
      const totalFeatures = featureCounts[selectedPlan]
      if (!totalFeatures) return

      const utilization = Math.round((12 / totalFeatures) * 100) / 100
      const utilizationText = formatPercent(utilization)
      const originalHeadline = originalFindingsById['6.2']?.layer2?.headline || ''

      let headline = originalHeadline
      if (selectedPlan === 'EasyStart') {
        headline = `The firm is on ${selectedPlan} — fewer features available, but current utilization rate is higher at ${utilizationText}%.`
      } else if (selectedPlan === 'Advanced' || selectedPlan === 'Complete') {
        headline = `An upgrade to ${selectedPlan} would drop feature utilization to ${utilizationText}% — activate current capabilities before expanding.`
      }

      updateFindingById('6.2', (target) => ({
        metrics: {
          ...target.metrics,
          subscription: selectedPlan,
          featureUtilization: utilization,
        },
        layer2: {
          ...target.layer2,
          headline,
        },
      }))
      triggerSectionHighlight(sectionId)
      triggerToast('6.2')
    }
  }

  const setResponseValue = (sectionId, question, value) => {
    const currentValue = responses[question.qId]
    if (isEqualValue(currentValue, value)) return

    setResponses((previous) => ({ ...previous, [question.qId]: value }))
    if (INTERACTIVE_SECTION_IDS.has(sectionId)) {
      recalculateForChange(sectionId, question.qId, value)
    }
  }

  const toggleSection = (sectionId) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionId]: !previous[sectionId],
    }))
  }

  const renderReadOnlyOptionPills = (question, answer, isMulti = false) => {
    const selectedValues = isMulti ? (answer || []) : [answer]
    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = selectedValues.includes(option)
          return (
            <span
              key={option}
              className={`rounded-full border px-3 py-1 text-xs ${
                isSelected
                  ? 'border-blue-200 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-gray-50 text-gray-400'
              }`}
            >
              {option}
            </span>
          )
        })}
      </div>
    )
  }

  const renderInteractiveOptionPills = (sectionId, question, answer, isMulti = false) => {
    const selectedValues = isMulti ? (answer || []) : [answer]

    const toggleValue = (option) => {
      if (!isMulti) {
        setResponseValue(sectionId, question, option)
        return
      }

      const currentValues = Array.isArray(answer) ? answer : []
      const nextValues = currentValues.includes(option)
        ? currentValues.filter((value) => value !== option)
        : [...currentValues, option]
      setResponseValue(sectionId, question, nextValues)
    }

    return (
      <div className="flex flex-wrap gap-2">
        {question.options.map((option) => {
          const isSelected = selectedValues.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleValue(option)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                isSelected
                  ? 'bg-[#0066cc] text-white'
                  : 'cursor-pointer border border-gray-200 bg-white text-gray-700 hover:border-[#0066cc]'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    )
  }

  const renderQuestion = (section, question, isInteractive, isFollowUp = false) => {
    const answer = responses[question.qId]

    return (
      <div
        key={question.qId}
        className={`${isFollowUp ? 'mt-3 border-l border-blue-100 pl-4' : 'mb-5'}`}
      >
        <p className="mb-2 text-sm font-medium text-gray-700">{question.text}</p>

        {question.type === 'single-select'
          ? isInteractive
            ? renderInteractiveOptionPills(section.id, question, answer, false)
            : renderReadOnlyOptionPills(question, answer, false)
          : null}

        {question.type === 'multi-select'
          ? isInteractive
            ? renderInteractiveOptionPills(section.id, question, answer, true)
            : renderReadOnlyOptionPills(question, answer, true)
          : null}

        {question.type === 'numeric' ? (
          isInteractive ? (
            <div className="flex items-center gap-0">
              <button
                type="button"
                onClick={() =>
                  setResponseValue(section.id, question, Math.max(1, (Number(answer) || 1) - 1))
                }
                className="rounded-l-lg border bg-gray-50 px-3 py-1.5 hover:bg-gray-100"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                value={Number(answer) || 0}
                onChange={(event) =>
                  setResponseValue(section.id, question, Math.max(1, Number(event.target.value) || 1))
                }
                className="w-20 border-b border-t py-1.5 text-center font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setResponseValue(section.id, question, (Number(answer) || 0) + 1)}
                className="rounded-r-lg border bg-gray-50 px-3 py-1.5 hover:bg-gray-100"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <div className="inline-flex rounded border bg-gray-50 px-3 py-1.5 font-mono text-sm">
              {answer}
            </div>
          )
        ) : null}

        {question.type === 'free-text' ? (
          isInteractive ? (
            <textarea
              value={answer || ''}
              onChange={(event) => setResponseValue(section.id, question, event.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm"
            />
          ) : (
            <div className="rounded border bg-gray-50 p-3 text-sm text-gray-600">{answer}</div>
          )
        ) : null}

        {question.conditional && shouldShowFollowUp(question, answer)
          ? renderQuestion(
              section,
              question.conditional.followUp,
              isInteractive,
              true,
            )
          : null}
      </div>
    )
  }

  return (
    <div className="relative">
      {toast ? (
        <div
          className={`fixed right-6 top-20 z-40 flex max-w-sm items-start gap-3 rounded-lg border border-blue-200 bg-white p-4 shadow-lg transition-all duration-300 ${
            toastVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
          }`}
        >
          <Info size={18} className="mt-0.5 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-gray-800">
              Finding {toast.findingId} updated
            </p>
            <Link
              to={`/findings/${toast.findingId}`}
              className="text-xs text-[#0066cc] hover:underline"
            >
              View finding →
            </Link>
          </div>
        </div>
      ) : null}

      <header>
        <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
          Organizational Context Questionnaire
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Estimated completion time: 35–45 minutes. All sections are optional.
        </p>
        <div className="mt-4 inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">
          <CheckCircle size={14} className="mr-1.5 text-green-500" />
          22 of 22 sections completed
        </div>
      </header>

      <section className="mt-6">
        {questionnaire.map((section) => {
          const isExpanded = !!expandedSections[section.id]
          const isInteractive = section.isInteractive
          const isHighlighted = highlightedSectionId === section.id

          return (
            <article
              key={section.id}
              className={`mb-2 overflow-hidden rounded-lg border bg-white transition ${
                isHighlighted
                  ? 'border-blue-300 ring-2 ring-blue-100'
                  : 'border-gray-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex w-full cursor-pointer items-center justify-between p-4 text-left hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <span className="font-mono text-xs text-gray-400">{section.id}</span>
                  <span className="ml-3 text-sm font-medium text-[#1a2332]">
                    {section.title}
                  </span>
                  {isInteractive ? (
                    <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                      Interactive
                    </span>
                  ) : null}
                  <span className="ml-2 text-xs text-gray-400">
                    → Finding {section.enrichesFinding}
                  </span>
                </div>

                <span className="ml-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  {isExpanded ? (
                    <ChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-400" />
                  )}
                </span>
              </button>

              {isExpanded ? (
                <div className="border-t border-gray-100 px-4 pb-4 pt-3">
                  {isInteractive ? (
                    <p className="mb-4 inline-flex rounded bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600">
                      Try changing values to see findings update in real time
                    </p>
                  ) : (
                    <p className="mb-3 text-xs italic text-gray-400">
                      Pre-populated with sample data
                    </p>
                  )}

                  {section.questions.map((question) =>
                    renderQuestion(section, question, isInteractive),
                  )}
                </div>
              ) : null}
            </article>
          )
        })}
      </section>
    </div>
  )
}

export default QuestionnairePage
