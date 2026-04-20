import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ListChecks,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoTooltip } from '../components/shared'
import interview from '../data/interview.json'

const PROMOTE_TOOLTIP_TEXT =
  "In production, clicking Promote lets the consultant select a destination (annotation on a specific finding, score override justification, custom finding, or internal only), then rewrite the raw note into a polished output. The raw note stays here in the interview guide. The polished output appears in the assessment. The 'Used in' link connects them."

function countTextareaRows(content) {
  const lineCount = content.split('\n').length
  return Math.min(8, Math.max(3, lineCount))
}

function getFindingIdFromUsedIn(destination) {
  const match = destination.match(/Finding\s+([A-Z0-9]+\.\d+)/)
  return match ? match[1] : null
}

function DomainGroupSeparator({ label }) {
  return (
    <div className="my-4 flex items-center gap-3">
      <div className="flex-1 border-t border-gray-200" />
      <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <div className="flex-1 border-t border-gray-200" />
    </div>
  )
}

function SectionHeader({ title, countLabel, isExpanded, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 text-left hover:bg-gray-100"
    >
      <div>
        <span className="text-sm font-semibold text-[#1a2332]">{title}</span>
        <span className="ml-2 text-xs text-gray-400">{countLabel}</span>
      </div>
      {isExpanded ? (
        <ChevronUp size={16} className="text-gray-500" />
      ) : (
        <ChevronDown size={16} className="text-gray-500" />
      )}
    </button>
  )
}

function InterviewNotesField({
  itemId,
  value,
  initialValue,
  isPromoted,
  usedIn,
  onChange,
  showPromote,
}) {
  const isInitiallyPopulated = initialValue != null

  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Interview Notes
      </p>
      <div className="relative">
        {isInitiallyPopulated && isPromoted ? (
          <span className="absolute right-2 top-2 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            Promoted
          </span>
        ) : null}
        <textarea
          value={value || ''}
          onChange={(event) => onChange(itemId, event.target.value)}
          rows={isInitiallyPopulated ? countTextareaRows(value || '') : 3}
          placeholder={isInitiallyPopulated ? '' : 'Capture interview notes here...'}
          className={`w-full rounded-lg border p-3 text-sm leading-relaxed ${
            isInitiallyPopulated
              ? 'border-gray-200 bg-gray-50 font-mono text-gray-700'
              : 'border-gray-200 bg-white text-gray-700 placeholder:text-gray-300'
          }`}
        />
      </div>

      {isInitiallyPopulated && isPromoted && usedIn ? (
        <p className="mt-1 text-xs text-gray-400">
          Used in:{' '}
          {usedIn.split(', ').map((destination, index) => {
            const findingId = getFindingIdFromUsedIn(destination)
            return (
              <span key={`${destination}-${index}`}>
                {index > 0 ? ', ' : ''}
                {findingId ? (
                  <Link to={`/findings/${findingId}`} className="text-[#0066cc] hover:underline">
                    {destination}
                  </Link>
                ) : (
                  destination
                )}
              </span>
            )
          })}
        </p>
      ) : null}

      {!isInitiallyPopulated ? (
        <div
          className={`mt-2 transition-opacity duration-300 ${
            showPromote ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <DemoTooltip tooltipText={PROMOTE_TOOLTIP_TEXT}>
            <button
              type="button"
              className="flex cursor-pointer items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800"
            >
              Promote ↗
            </button>
          </DemoTooltip>
        </div>
      ) : null}
    </div>
  )
}

function InterviewGuidePage() {
  useEffect(() => {
    document.title = 'Clio HealthCheck — Interview Guide'
  }, [])

  const [expandedSections, setExpandedSections] = useState({
    opening: true,
    finding: true,
    pattern: false,
    observation: false,
    closing: false,
  })
  const [expandedLookFor, setExpandedLookFor] = useState({})

  const allItems = useMemo(
    () => [
      ...interview.findingTriggered,
      ...interview.patternTriggered,
      ...interview.observationPrompts,
      ...interview.closingPrompts,
    ],
    [],
  )

  const initialNotesMap = useMemo(
    () => Object.fromEntries(allItems.map((item) => [item.id, item.notes])),
    [allItems],
  )

  const [notesById, setNotesById] = useState(
    Object.fromEntries(allItems.map((item) => [item.id, item.notes || ''])),
  )
  const [showPromoteById, setShowPromoteById] = useState({})
  const debounceRefs = useRef({})

  const groupedFindingTriggered = useMemo(() => {
    const groups = []
    interview.findingTriggered.forEach((item) => {
      const lastGroup = groups[groups.length - 1]
      if (!lastGroup || lastGroup.domainGroup !== item.domainGroup) {
        groups.push({ domainGroup: item.domainGroup, items: [item] })
      } else {
        lastGroup.items.push(item)
      }
    })
    return groups
  }, [])

  const toggleSection = (sectionKey) => {
    setExpandedSections((previous) => ({
      ...previous,
      [sectionKey]: !previous[sectionKey],
    }))
  }

  const toggleLookFor = (promptId) => {
    setExpandedLookFor((previous) => ({
      ...previous,
      [promptId]: !previous[promptId],
    }))
  }

  const handleNotesChange = (itemId, value) => {
    setNotesById((previous) => ({ ...previous, [itemId]: value }))

    if (initialNotesMap[itemId] != null) return

    if (debounceRefs.current[itemId]) {
      clearTimeout(debounceRefs.current[itemId])
    }

    if (!value.trim()) {
      setShowPromoteById((previous) => ({ ...previous, [itemId]: false }))
      return
    }

    debounceRefs.current[itemId] = setTimeout(() => {
      setShowPromoteById((previous) => ({ ...previous, [itemId]: true }))
    }, 3000)
  }

  return (
    <div>
      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-sans text-xl font-semibold text-[#1a2332]">
          {interview.stakeholder.name}
        </h2>
        <p className="text-sm text-gray-500">{interview.stakeholder.role}</p>
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Clock size={14} />
            {interview.stakeholder.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <ListChecks size={14} />
            {interview.stakeholder.elementCount} elements
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            March 12, 2026
          </span>
        </div>
      </section>

      <section className="mb-5">
        <SectionHeader
          title="Opening Context"
          countLabel="1 briefing"
          isExpanded={expandedSections.opening}
          onClick={() => toggleSection('opening')}
        />
        {expandedSections.opening ? (
          <article className="rounded-lg border-l-4 border-l-[#1a2332] bg-[#1a2332]/5 p-5">
            <p className="max-w-prose text-sm leading-relaxed text-gray-700">
              {interview.openingContext}
            </p>
          </article>
        ) : null}
      </section>

      <section className="mb-5">
        <SectionHeader
          title="Finding-Triggered Questions"
          countLabel={`${interview.findingTriggered.length} questions`}
          isExpanded={expandedSections.finding}
          onClick={() => toggleSection('finding')}
        />
        {expandedSections.finding ? (
          <div>
            {groupedFindingTriggered.map((group) => (
              <div key={group.domainGroup}>
                <DomainGroupSeparator label={group.domainGroup} />
                {group.items.map((item) => (
                  <article
                    key={item.id}
                    className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <Link
                      to={`/findings/${item.findingRef}`}
                      className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#0066cc]"
                    >
                      Finding {item.findingRef}
                    </Link>
                    <p className="mb-2 mt-1 text-xs italic text-gray-500">
                      {item.triggerMetric}
                    </p>
                    <p className="mb-3 text-sm font-medium text-gray-800">
                      {item.question}
                    </p>
                    <InterviewNotesField
                      itemId={item.id}
                      value={notesById[item.id]}
                      initialValue={initialNotesMap[item.id]}
                      isPromoted={item.promoted === true}
                      usedIn={item.usedIn}
                      onChange={handleNotesChange}
                      showPromote={!!showPromoteById[item.id]}
                    />
                  </article>
                ))}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mb-5">
        <SectionHeader
          title="Pattern-Triggered Questions"
          countLabel={`${interview.patternTriggered.length} patterns`}
          isExpanded={expandedSections.pattern}
          onClick={() => toggleSection('pattern')}
        />
        {expandedSections.pattern ? (
          <div>
            {interview.patternTriggered.map((item) => (
              <article
                key={item.id}
                className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
              >
                <p className="text-sm font-semibold text-[#1a2332]">{item.patternName}</p>
                <p className="mt-1 text-xs font-semibold text-gray-500">Pattern detected:</p>
                <p className="mb-3 mt-1 text-xs italic text-gray-500">
                  {item.patternDetected}
                </p>
                <p className="mb-3 text-sm font-medium text-gray-800">{item.question}</p>
                <InterviewNotesField
                  itemId={item.id}
                  value={notesById[item.id]}
                  initialValue={initialNotesMap[item.id]}
                  isPromoted={item.promoted === true}
                  usedIn={item.usedIn}
                  onChange={handleNotesChange}
                  showPromote={!!showPromoteById[item.id]}
                />
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mb-5">
        <SectionHeader
          title="Observation Prompts"
          countLabel={`${interview.observationPrompts.length} prompts`}
          isExpanded={expandedSections.observation}
          onClick={() => toggleSection('observation')}
        />
        {expandedSections.observation ? (
          <div>
            <p className="mb-4 text-sm italic text-gray-500">
              Things to ask to see during the interview. Direct observation reveals
              the gap between stated and actual practice.
            </p>
            {interview.observationPrompts.map((item) => (
              <article
                key={item.id}
                className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
              >
                <Link
                  to={`/findings/${item.findingRef}`}
                  className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#0066cc]"
                >
                  Finding {item.findingRef}
                </Link>
                <p className="mb-2 mt-2 text-sm font-medium text-gray-800">{item.prompt}</p>
                <button
                  type="button"
                  onClick={() => toggleLookFor(item.id)}
                  className="text-xs text-[#0066cc]"
                >
                  Look for →
                </button>
                {expandedLookFor[item.id] ? (
                  <p className="mt-2 rounded bg-gray-50 p-3 text-xs text-gray-600">
                    {item.lookFor}
                  </p>
                ) : null}
                <div className="mt-3">
                  <InterviewNotesField
                    itemId={item.id}
                    value={notesById[item.id]}
                    initialValue={initialNotesMap[item.id]}
                    isPromoted={item.promoted === true}
                    usedIn={item.usedIn}
                    onChange={handleNotesChange}
                    showPromote={!!showPromoteById[item.id]}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeader
          title="Closing Prompts"
          countLabel={`${interview.closingPrompts.length} prompts`}
          isExpanded={expandedSections.closing}
          onClick={() => toggleSection('closing')}
        />
        {expandedSections.closing ? (
          <div>
            <p className="mb-4 text-sm italic text-gray-500">
              Select 2-3 based on how the conversation has gone. These are not meant
              to be asked sequentially.
            </p>
            {interview.closingPrompts.map((item) => (
              <article
                key={item.id}
                className="mb-3 rounded-lg border border-gray-200 bg-white p-4"
              >
                <p className="mb-2 text-sm font-medium text-gray-800">{item.question}</p>
                <p className="text-xs font-semibold text-gray-500">Purpose:</p>
                <p className="mb-3 text-xs text-gray-500">{item.purpose}</p>
                <InterviewNotesField
                  itemId={item.id}
                  value={notesById[item.id]}
                  initialValue={initialNotesMap[item.id]}
                  isPromoted={item.promoted === true}
                  usedIn={item.usedIn}
                  onChange={handleNotesChange}
                  showPromote={!!showPromoteById[item.id]}
                />
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default InterviewGuidePage
