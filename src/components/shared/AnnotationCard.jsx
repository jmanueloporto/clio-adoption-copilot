export function AnnotationCard({ text, consultant, date, type }) {
  return (
    <article className="rounded-lg border border-purple-100 bg-purple-50/50 p-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-800">{consultant}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-700">
          {type}
        </span>
      </header>
      <p className="mt-3 text-sm leading-[1.6] text-gray-700">{text}</p>
    </article>
  )
}

export default AnnotationCard
