import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Documentation AREA
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Apprenez à utiliser notre plateforme d&apos;automatisation pour connecter vos services préférés.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Guide de démarrage */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🚀 Guide de démarrage</h3>
              <p className="text-gray-600 text-sm mb-4">
                Découvrez comment créer votre première AREA en quelques minutes.
              </p>
              <Link href="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Lire le guide →
              </Link>
            </div>

            {/* Services disponibles */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔗 Services disponibles</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Spotify</li>
                <li>• GitHub</li>
                <li>• Letterboxd</li>
                <li>• Discord</li>
                <li>• OpenWeather</li>
              </ul>
            </div>

            {/* API Reference */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">📚 API Reference</h3>
              <p className="text-gray-600 text-sm mb-4">
                Documentation complète de notre API REST pour les développeurs.
              </p>
              <Link href="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Consulter l&apos;API →
              </Link>
            </div>

            {/* Webhooks */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🔔 Webhooks</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configurez des webhooks pour recevoir des notifications en temps réel.
              </p>
              <Link href="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Configuration →
              </Link>
            </div>

            {/* Exemples */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Exemples</h3>
              <p className="text-gray-600 text-sm mb-4">
                Découvrez des cas d&apos;usage populaires et des exemples concrets.
              </p>
              <Link href="#" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Voir les exemples →
              </Link>
            </div>

            {/* Support */}
            <div className="rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💬 Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Besoin d&apos;aide ? Contactez notre équipe de support.
              </p>
              <Link href="/support" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                Contactez-nous →
              </Link>
            </div>
          </div>

          {/* Section Actions et Réactions */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Actions et Réactions disponibles</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚡ Actions (Déclencheurs)</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium text-gray-900">Spotify</h4>
                    <p className="text-sm text-gray-600">Nouvelle chanson likée, playlist mise à jour, changement de lecture...</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-gray-900">GitHub</h4>
                    <p className="text-sm text-gray-600">Nouvelle issue, pull request, release...</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-medium text-gray-900">Letterboxd</h4>
                    <p className="text-sm text-gray-600">Nouveau film regardé, critique ajoutée...</p>
                  </div>
                </div>
              </div>

              {/* Réactions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Réactions</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h4 className="font-medium text-gray-900">Webhooks</h4>
                    <p className="text-sm text-gray-600">Envoyer des données vers vos propres services</p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-gray-900">Discord</h4>
                    <p className="text-sm text-gray-600">Envoyer des messages, embedds, réactions...</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-medium text-gray-900">Spotify</h4>
                    <p className="text-sm text-gray-600">Ajouter à playlist, liker des chansons...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
