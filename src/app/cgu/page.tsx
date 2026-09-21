export default function CguPage() {
  const lastUpdate = "21 septembre 2026";

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

        {/* En-tête */}
        <div className="border-b pb-8">
          <h1 className="text-3xl font-bold">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-sm text-gray-500 mt-2">
            MUAKIL — Plateforme SaaS d&apos;assistants IA pour entreprises marocaines
          </p>
          <p className="text-xs text-gray-400 mt-1">Dernière mise à jour : {lastUpdate}</p>
        </div>

        {/* Art. 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 1 — Objet et champ d&apos;application</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Les présentes Conditions Générales d&apos;Utilisation (ci-après « CGU ») régissent l&apos;accès et l&apos;utilisation
            de la plateforme MUAKIL, éditée par SOCYTAY, société à responsabilité limitée de droit marocain,
            dont le siège social est situé à Casablanca, Maroc (ci-après « l&apos;Éditeur »).
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            MUAKIL est une plateforme SaaS (Software as a Service) mettant à disposition des entreprises marocaines
            des assistants d&apos;intelligence artificielle dédiés à la gestion commerciale, administrative, marketing
            et financière.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;accès à la plateforme implique l&apos;acceptation pleine et entière des présentes CGU, conformément
            aux dispositions de la loi n° 53-05 relative à l&apos;échange électronique de données juridiques,
            et de la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement
            des données à caractère personnel.
          </p>
        </section>

        {/* Art. 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 2 — Définitions</h2>
          <ul className="text-sm text-gray-700 space-y-2 leading-relaxed list-none">
            {[
              ["Plateforme", "Le service en ligne MUAKIL accessible à l'adresse muakil.ma"],
              ["Utilisateur", "Toute personne physique ou morale accédant à la plateforme dans le cadre de son activité professionnelle"],
              ["Organisation", "L'entité juridique (entreprise, cabinet, association) au nom de laquelle l'Utilisateur s'inscrit"],
              ["Contenu généré", "Tout document, texte, facture ou analyse produit par les assistants IA de la plateforme"],
              ["BrandKit", "L'ensemble des données identitaires et préférences de marque renseignées par l'Utilisateur"],
            ].map(([t, d]) => (
              <li key={t} className="flex gap-2">
                <span className="font-semibold text-gray-900 shrink-0">« {t} » :</span>
                <span>{d}.</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Art. 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 3 — Accès au service et inscription</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;accès à MUAKIL est réservé aux professionnels. L&apos;inscription requiert la création d&apos;un compte
            via le système d&apos;authentification Clerk et la configuration d&apos;une Organisation.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Utilisateur garantit que les informations fournies lors de l&apos;inscription (dénomination sociale,
            ICE, IF, RC, coordonnées bancaires) sont exactes et à jour. Toute fausse déclaration engage
            la seule responsabilité de l&apos;Utilisateur.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Éditeur se réserve le droit de suspendre ou de résilier tout compte dont les informations
            s&apos;avèrent inexactes ou frauduleuses, sans préavis ni indemnité.
          </p>
        </section>

        {/* Art. 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 4 — Offres et tarification</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            MUAKIL propose trois formules d&apos;abonnement :
          </p>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Plan</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Tarif HT/mois</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Agents inclus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr><td className="px-4 py-3">Starter</td><td className="px-4 py-3">Gratuit</td><td className="px-4 py-3">2 agents, 20 générations/mois</td></tr>
                <tr><td className="px-4 py-3">Pro</td><td className="px-4 py-3">490 MAD HT</td><td className="px-4 py-3">7 agents, générations illimitées</td></tr>
                <tr><td className="px-4 py-3">Agence</td><td className="px-4 py-3">990 MAD HT</td><td className="px-4 py-3">15 agents, multi-organisations</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Les prix sont exprimés hors taxes. La TVA applicable est celle en vigueur au Maroc (20 %).
            L&apos;Éditeur se réserve le droit de modifier ses tarifs avec un préavis de 30 jours.
          </p>
        </section>

        {/* Art. 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 5 — Obligations de l&apos;Utilisateur</h2>
          <p className="text-sm text-gray-700 leading-relaxed">L&apos;Utilisateur s&apos;engage à :</p>
          <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed list-disc list-inside">
            <li>Utiliser la plateforme exclusivement à des fins professionnelles licites</li>
            <li>Ne pas tenter de contourner les mécanismes de sécurité ou d&apos;accès</li>
            <li>Ne pas reproduire, revendre ou distribuer les fonctionnalités de la plateforme</li>
            <li>Vérifier l&apos;exactitude des contenus générés avant tout usage commercial ou légal</li>
            <li>S&apos;assurer que les factures générées par Karima sont conformes à la réglementation fiscale en vigueur</li>
            <li>Respecter la confidentialité des données de ses propres clients saisies dans la plateforme</li>
          </ul>
        </section>

        {/* Art. 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 6 — Responsabilité de l&apos;Éditeur</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            MUAKIL est un outil d&apos;aide à la décision. Les contenus générés par les assistants IA ont valeur
            indicative et ne constituent pas un conseil juridique, fiscal, comptable ou financier.
            L&apos;Éditeur décline toute responsabilité quant à l&apos;usage fait des contenus générés.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Éditeur ne saurait être tenu responsable des dommages directs ou indirects résultant de
            l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la plateforme, d&apos;une interruption de service,
            ou d&apos;une inexactitude des données générées par intelligence artificielle.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            En cas de force majeure au sens de l&apos;article 269 du Dahir des Obligations et Contrats (D.O.C.),
            l&apos;Éditeur est dégagé de toute obligation.
          </p>
        </section>

        {/* Art. 7 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 7 — Protection des données personnelles</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard
            du traitement des données à caractère personnel et aux attributions de la Commission Nationale
            de contrôle de la protection des Données à caractère Personnel (CNDP), l&apos;Éditeur s&apos;engage à :
          </p>
          <ul className="text-sm text-gray-700 space-y-1.5 leading-relaxed list-disc list-inside">
            <li>Collecter uniquement les données nécessaires au fonctionnement du service</li>
            <li>Ne pas céder les données personnelles à des tiers sans consentement explicite</li>
            <li>Mettre en œuvre les mesures techniques et organisationnelles appropriées pour sécuriser les données</li>
            <li>Permettre à tout Utilisateur d&apos;exercer ses droits d&apos;accès, de rectification et d&apos;opposition</li>
          </ul>
          <p className="text-sm text-gray-700 leading-relaxed">
            Pour exercer vos droits, contactez : <span className="font-medium">contact@muakil.ma</span>
          </p>
        </section>

        {/* Art. 8 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 8 — Propriété intellectuelle</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            La plateforme MUAKIL, son code source, ses interfaces, ses marques et ses contenus sont
            la propriété exclusive de SOCYTAY et sont protégés par les dispositions de la loi n° 2-00
            relative aux droits d&apos;auteur et droits voisins.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Les contenus générés par les assistants IA à partir des données de l&apos;Utilisateur appartiennent
            à l&apos;Utilisateur. L&apos;Éditeur se réserve le droit d&apos;utiliser de manière anonymisée et agrégée
            les données d&apos;usage à des fins d&apos;amélioration du service.
          </p>
        </section>

        {/* Art. 9 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 9 — Résiliation</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Utilisateur peut résilier son abonnement à tout moment depuis son espace compte.
            La résiliation prend effet à la fin de la période d&apos;abonnement en cours. Aucun remboursement
            partiel n&apos;est accordé pour la période restante.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Éditeur peut résilier un compte en cas de violation des présentes CGU, avec un préavis
            de 48 heures sauf en cas de manquement grave justifiant une résiliation immédiate.
          </p>
        </section>

        {/* Art. 10 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 10 — Droit applicable et juridiction compétente</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Les présentes CGU sont soumises au droit marocain. En cas de litige, les parties s&apos;engagent
            à rechercher une solution amiable avant tout recours judiciaire.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            À défaut d&apos;accord amiable, le litige sera soumis à la juridiction compétente du Tribunal
            de Commerce de Casablanca, conformément aux dispositions du Code de procédure civile marocain.
          </p>
        </section>

        {/* Art. 11 */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Article 11 — Modification des CGU</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            L&apos;Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
            entrent en vigueur dès leur publication sur la plateforme. L&apos;Utilisateur sera notifié par
            email au moins 15 jours avant toute modification substantielle.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            La poursuite de l&apos;utilisation de la plateforme après notification vaut acceptation des
            nouvelles CGU.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t pt-8 space-y-2">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="text-sm text-gray-700">
            SOCYTAY — Éditeur de MUAKIL<br />
            Casablanca, Maroc<br />
            Email : <span className="font-medium">contact@muakil.ma</span>
          </p>
        </section>

      </div>
    </div>
  )
}