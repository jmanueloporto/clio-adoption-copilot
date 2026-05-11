import { Info } from 'lucide-react'
import { useEffect } from 'react'
import DemoAnchor from '../components/demoGuide/DemoAnchor'
import { SignalStrengthBadge } from '../components/shared'
import expansion from '../data/expansion.json'

function getServiceBorderClass(strength) {
  if (strength === 'Strong') return 'border-l-4 border-l-green-500'
  return 'border-l-4 border-l-amber-500'
}

function getProductBorderClass(strength) {
  if (strength === 'Strong') return 'border-l-4 border-l-[#0066cc]'
  if (strength === 'Moderate') return 'border-l-4 border-l-amber-500'
  return 'border-l-4 border-l-gray-400'
}

function ExpansionPage() {
  useEffect(() => {
    document.title = 'Clio HealthCheck — Expansion Opportunities'
  }, [])

  const servicesById = Object.fromEntries(
    expansion.attornatoServices.map((service) => [service.id, service]),
  )
  const productsById = Object.fromEntries(
    expansion.clioProducts.map((product) => [product.id, product]),
  )

  return (
    <div>
      <header>
        <h2 className="font-sans text-2xl font-semibold text-[#1a2332]">
          Expansion Opportunities
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Service and product signals from the assessment
        </p>
      </header>

      <section className="mb-8 mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-3 text-sm font-semibold text-[#1a2332]">Current License</h3>

        <div className="flex flex-wrap items-center gap-6">
          <p className="text-sm text-gray-700">
            Plan: <span className="font-medium">{expansion.licenseUtilization.plan}</span>
          </p>
          <p className="text-sm text-gray-700">
            Users: <span className="font-medium">{expansion.licenseUtilization.totalUsers}</span>
          </p>
          <p className="text-sm font-mono text-gray-700">
            Monthly: ${expansion.licenseUtilization.monthlyCost}
          </p>
          <p className="text-sm font-mono font-semibold text-[#ea580c]">
            Feature Utilization:{' '}
            {(expansion.licenseUtilization.featureUtilization * 100).toFixed(0)}%
          </p>
        </div>

        <div className="mt-4">
          {expansion.licenseUtilization.observations.map((observation, index) => (
            <p key={`license-observation-${index}`} className="mb-1 text-xs text-gray-600">
              <Info size={12} className="mr-1 inline text-gray-400" />
              {observation}
            </p>
          ))}
        </div>
      </section>

      <DemoAnchor placement="service-opportunities">
        <section>
          <h3 className="mb-4 mt-2 font-sans text-lg font-semibold text-[#1a2332]">
            Service Opportunities
          </h3>

          {expansion.attornatoServices.map((service) => (
            <article
              key={service.id}
              className={`mb-4 rounded-xl border border-gray-200 bg-white p-5 ${getServiceBorderClass(service.signalStrength)}`}
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-base font-semibold text-[#1a2332]">{service.title}</h4>
                <SignalStrengthBadge strength={service.signalStrength} />
              </div>

              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Assessment Evidence:
              </p>
              <p className="text-sm leading-relaxed text-gray-700">{service.evidence}</p>

              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer Need:
              </p>
              <p className="text-sm leading-relaxed text-gray-700">{service.customerNeed}</p>

              <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Conversation Approach:
              </p>
              <p className="text-sm italic leading-relaxed text-gray-600">
                {service.conversationApproach}
              </p>
            </article>
          ))}
      </section>

      <section>
        <h3 className="mb-4 mt-8 font-sans text-lg font-semibold text-[#1a2332]">
          Product Signals
        </h3>

        {expansion.clioProducts.map((product) => (
          <article
            key={product.id}
            className={`mb-4 rounded-xl border border-gray-200 bg-white p-5 ${getProductBorderClass(product.signalStrength)}`}
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-base font-semibold text-[#1a2332]">{product.title}</h4>
              <SignalStrengthBadge strength={product.signalStrength} />
            </div>

            <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Assessment Evidence:
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{product.evidence}</p>

            <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Customer Need:
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{product.customerNeed}</p>

            <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Conversation Approach:
            </p>
            <p className="text-sm italic leading-relaxed text-gray-600">
              {product.conversationApproach}
            </p>
          </article>
          ))}
        </section>
      </DemoAnchor>

      <DemoAnchor placement="engagement-packaging">
        <section>
          <h3 className="mb-4 mt-8 font-sans text-lg font-semibold text-[#1a2332]">
            Recommended Engagement Phases
          </h3>

          {expansion.engagementPackaging.map((phase) => (
            <article key={`phase-${phase.phase}`} className="mb-3 rounded-lg bg-gray-50 p-5">
              <h4 className="text-sm font-semibold text-[#1a2332]">
                Phase {phase.phase}: {phase.title}
              </h4>
              <p className="mt-0.5 text-xs text-gray-500">{phase.duration}</p>
              <p className="mt-2 text-sm text-gray-700">{phase.focus}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {phase.services.map((serviceId) => (
                  <span
                    key={`${phase.phase}-${serviceId}`}
                    className="rounded-full bg-purple-50 px-2 py-0.5 text-xs text-purple-700"
                  >
                    {servicesById[serviceId]?.title}
                  </span>
                ))}
                {phase.products.map((productId) => (
                  <span
                    key={`${phase.phase}-${productId}`}
                    className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                  >
                    {productsById[productId]?.title}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>
      </DemoAnchor>
    </div>
  )
}

export default ExpansionPage
