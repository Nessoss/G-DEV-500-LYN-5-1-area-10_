import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Choisissez votre plan AREA
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Automatisez vos services préférés avec notre plateforme AREA
          </p>
        </div>

        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {/* Plan Gratuit */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">Gratuit</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Parfait pour découvrir AREA
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">0€</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/mois</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <span>✓ 5 Areas actives</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Services de base</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Support communauté</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Plan Pro */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 lg:z-10 lg:rounded-b-none">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-indigo-600">Pro</h3>
                <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                  Populaire
                </p>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Pour les utilisateurs avancés
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">9€</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/mois</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <span>✓ Areas illimitées</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Tous les services</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Webhooks personnalisés</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Support prioritaire</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Choisir Pro
            </Link>
          </div>

          {/* Plan Enterprise */}
          <div className="flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
            <div>
              <div className="flex items-center justify-between gap-x-4">
                <h3 className="text-lg font-semibold leading-8 text-gray-900">Enterprise</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600">
                Pour les équipes et entreprises
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900">49€</span>
                <span className="text-sm font-semibold leading-6 text-gray-600">/mois</span>
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                <li className="flex gap-x-3">
                  <span>✓ Tout du plan Pro</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Équipes multiples</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ SSO & sécurité avancée</span>
                </li>
                <li className="flex gap-x-3">
                  <span>✓ Support dédié</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
