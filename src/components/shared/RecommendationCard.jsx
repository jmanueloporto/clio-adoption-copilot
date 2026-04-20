export function RecommendationCard({ body, whyRelevant, howToImplement, index }) {
  return (
    <article className="rounded-lg border-l-[3px] border-l-[#0066cc] bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0066cc] text-xs text-white">
          {index}
        </span>
        <p className="text-sm leading-relaxed text-gray-800">{body}</p>
      </div>

      <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Why relevant:
      </p>
      <p className="text-sm text-gray-600">{whyRelevant}</p>

      <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        How to implement:
      </p>
      <p className="text-sm text-gray-600">{howToImplement}</p>
    </article>
  )
}

export default RecommendationCard
