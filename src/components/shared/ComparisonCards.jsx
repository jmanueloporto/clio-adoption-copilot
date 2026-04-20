function renderLine(line, index) {
  if (!line.trim()) {
    return <div key={`spacer-${index}`} className="h-1" />
  }

  const isAssessmentLine = line.startsWith('Assessment:')
  const separatorIndex = line.indexOf(':')
  const hasLabelValueFormat = separatorIndex > -1

  if (!hasLabelValueFormat) {
    return (
      <p
        key={`${line}-${index}`}
        className={`text-sm leading-relaxed ${
          isAssessmentLine ? 'font-semibold text-gray-900' : 'text-gray-700'
        }`}
      >
        {line}
      </p>
    )
  }

  const label = line.slice(0, separatorIndex + 1)
  const value = line.slice(separatorIndex + 1).trimStart()

  return (
    <p
      key={`${line}-${index}`}
      className={`text-sm leading-relaxed ${
        isAssessmentLine ? 'font-semibold text-gray-900' : 'text-gray-700'
      }`}
    >
      <span>{label}</span>{' '}
      <span className="font-mono">{value}</span>
    </p>
  )
}

function renderContent(content) {
  if (!content) return null

  return content.split('\n').map((line, index) => renderLine(line, index))
}

function Card({ card, isContext }) {
  const cardClasses = isContext
    ? 'bg-[#f0f9ff] border-l-[3px] border-l-[#0066cc] border border-blue-100'
    : 'bg-white border border-gray-200'

  return (
    <article className={`rounded-lg p-5 ${cardClasses}`}>
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {card?.title}
      </h4>
      <div className="space-y-1">{renderContent(card?.content)}</div>
    </article>
  )
}

export function ComparisonCards({ baselineCard, contextCard }) {
  if (!baselineCard) {
    return <Card card={contextCard} isContext />
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card card={baselineCard} isContext={false} />
      <Card card={contextCard} isContext />
    </div>
  )
}

export default ComparisonCards
