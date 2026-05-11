import {
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Lightbulb,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DemoAnchor from '../components/demoGuide/DemoAnchor'
import { MetricCard } from '../components/shared'
import engagement from '../data/engagement.json'

const DECISION_TYPE_STYLES = {
  'Score Override': 'bg-purple-50 text-purple-700',
  'Custom Finding': 'bg-amber-50 text-amber-700',
  Recommendation: 'bg-blue-50 text-blue-700',
}

function DecisionIcon({ type }) {
  if (type === 'Score Override') {
    return <ArrowUpDown size={16} className="text-purple-500" />
  }
  if (type === 'Custom Finding') {
    return <Search size={16} className="text-amber-500" />
  }
  return <Lightbulb size={16} className="text-blue-500" />
}

function EngagementPage() {
  const navigate = useNavigate()
  const [showBriefing, setShowBriefing] = useState(false)

  useEffect(() => {
    document.title = 'Clio HealthCheck — Engagement'
  }, [])

  return (
    <div>
      <header>
        <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
          Engagement Record
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Brennan & Clark LLP - Guided Assessment
        </p>
      </header>

      <section className="mb-6 mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Customer
            </p>
            <p className="mt-0.5 text-sm text-gray-800">{engagement.metadata.customer}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Model
            </p>
            <p className="mt-0.5 text-sm text-gray-800">{engagement.metadata.model}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Consultant
            </p>
            <p className="mt-0.5 text-sm text-gray-800">
              {engagement.metadata.consultant}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Duration
            </p>
            <p className="mt-0.5 text-sm text-gray-800">{engagement.metadata.duration}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Status
            </p>
            <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-gray-800">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {engagement.metadata.status}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Interviews
            </p>
            <p className="mt-0.5 text-sm text-gray-800">{engagement.metadata.interviews}</p>
          </div>
        </div>
      </section>

      <section className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <MetricCard label="Questionnaire" value="22/22" />
        <MetricCard label="Interview Notes" value="7" />
        <MetricCard label="Promoted" value="7" />
        <MetricCard label="Annotations" value="6" />
        <MetricCard label="Overrides" value="2" />
        <MetricCard label="Custom Findings" value="3" />
      </section>

      <DemoAnchor placement="key-decisions">
        <section>
          <h3 className="mb-4 font-sans text-lg font-semibold text-[#1a2332]">
            Key Decisions
          </h3>
          <p className="mb-3 text-sm text-gray-500">
            What the consultant saw that the automation missed
          </p>

          {engagement.keyDecisions.map((decision, index) => (
            <article
              key={`${decision.title}-${index}`}
              className="mb-2 flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mt-0.5">
                <DecisionIcon type={decision.type} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#1a2332]">{decision.title}</p>
                <p className="mt-0.5 text-xs text-gray-500">{decision.rationale}</p>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  DECISION_TYPE_STYLES[decision.type] || 'bg-gray-50 text-gray-700'
                }`}
              >
                {decision.type}
              </span>
            </article>
          ))}
        </section>
      </DemoAnchor>

      <DemoAnchor placement="timeline">
        <section>
          <h3 className="mb-4 mt-8 font-sans text-lg font-semibold text-[#1a2332]">
            Timeline
          </h3>

        <div className="relative pl-8">
          <div className="absolute bottom-0 left-[10px] top-0 w-0.5 bg-gray-200" />
          {engagement.timeline.map((day, index) => (
            <div key={`timeline-day-${day.day}`} className={index < 3 ? 'mb-6' : ''}>
              <div className="absolute left-[5px] mt-1 h-3 w-3 rounded-full bg-[#0066cc]" />
              <div>
                <p className="text-sm font-medium text-[#1a2332]">
                  {day.date} - Day {day.day}: {day.title}
                </p>
                <div className="mt-2 space-y-1">
                  {day.activities.map((activity, itemIndex) => (
                    <p key={`${day.day}-activity-${itemIndex}`} className="text-xs text-gray-600">
                      <span className="mr-2 text-gray-300">•</span>
                      {activity}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        </section>
      </DemoAnchor>

      <section>
        <h3 className="mb-4 mt-8 font-sans text-lg font-semibold text-[#1a2332]">
          Interview Log
        </h3>
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stakeholder
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Duration
                </th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Key Topics
                </th>
              </tr>
            </thead>
            <tbody>
              {engagement.interviewLog.map((item, index) => (
                <tr
                  key={`${item.stakeholder}-${index}`}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/interview-guide')}
                >
                  <td className="border-b border-gray-100 p-3 text-sm font-medium text-[#1a2332]">
                    {item.stakeholder}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm text-gray-700">
                    {item.role}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm text-gray-700">
                    {item.date}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-sm text-gray-700">
                    {item.duration}
                  </td>
                  <td className="border-b border-gray-100 p-3 text-xs text-gray-500">
                    {item.keyTopics}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <button
          type="button"
          onClick={() => setShowBriefing((previous) => !previous)}
          className="mb-2 mt-8 flex items-center gap-2"
        >
          <h3 className="font-sans text-lg font-semibold text-[#1a2332]">
            Pre-Engagement Briefing
          </h3>
          {showBriefing ? (
            <ChevronUp size={16} className="text-gray-500" />
          ) : (
            <ChevronDown size={16} className="text-gray-500" />
          )}
        </button>
        {showBriefing ? (
          <article className="rounded-lg border-l-4 border-l-[#1a2332] bg-gray-50 p-5">
            <p className="text-sm leading-relaxed text-gray-700">
              {engagement.preEngagementBriefing}
            </p>
          </article>
        ) : null}
      </section>
    </div>
  )
}

export default EngagementPage
