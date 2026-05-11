export function ConsultantValueIndicator({ text }) {
  return (
    <section className="rounded-lg border-l-4 border-l-[#0d9488] bg-[#f0fdfa] p-5 transition-opacity duration-300">
      <p className="mb-2 text-xs font-semibold tracking-wider text-[#0d9488]">
        WHAT A CONSULTANT WOULD DO
      </p>
      <p className="text-sm leading-relaxed text-gray-700">{text}</p>
    </section>
  )
}

export default ConsultantValueIndicator
