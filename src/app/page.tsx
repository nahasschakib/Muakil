import Link from "next/link";

export default function LandingPage() {
  const agents = [
    { slug: 'salma',   nom: 'Salma',   role: 'Création de contenu',        desc: 'Rédige tes posts, articles et newsletters en français, arabe ou darija.',      grad: 'linear-gradient(135deg,#7C3AED,#C026D3)', icon: 'M4 20h16M6 16l4-8 4 5 4-9' },
    { slug: 'youssef', nom: 'Youssef', role: 'Prospection B2B',             desc: 'Identifie des prospects via OMPIC et Pages Jaunes Maroc, rédige tes messages WhatsApp.', grad: 'linear-gradient(135deg,#059669,#10B981)', icon: 'M22 3H2l8 9.5V19l4 2v-8.5z' },
    { slug: 'karima',  nom: 'Karima',  role: 'Administration & facturation',desc: 'Génère tes factures, devis et bons de commande conformes au droit marocain.',  grad: 'linear-gradient(135deg,#E11D48,#F43F5E)', icon: 'M9 12h6M9 16h6M9 8h3M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z' },
    { slug: 'mehdi',   nom: 'Mehdi',   role: 'Suivi prospects & réunions',  desc: 'Analyse tes calls, génère les comptes-rendus et suit le pipeline BANT en MAD.',  grad: 'linear-gradient(135deg,#2563EB,#7C3AED)', icon: 'M8 2v4M16 2v4M3 10h18M5 6h14v15H5z' },
    { slug: 'karim',   nom: 'Karim',   role: 'Propositions Commerciales',   desc: 'Propositions SCR 3 options (Essentiel / Pro / Premium) en quelques minutes.',   grad: 'linear-gradient(135deg,#D97706,#F59E0B)', icon: 'M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
    { slug: 'nour',    nom: 'Nour',    role: 'Veille & Prospection web',    desc: 'Recherche en temps réel : prospects, concurrents, actualités, données marché.',  grad: 'linear-gradient(135deg,#0891B2,#06B6D4)', icon: 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM21 21l-4.5-4.5' },
    { slug: 'yasmine', nom: 'Yasmine', role: 'E-commerce & Produit',        desc: 'Fiches produit optimisées et scripts vidéo pour Jumia, Hmizate et Instagram.',  grad: 'linear-gradient(135deg,#BE185D,#EC4899)', icon: 'M3 6h18l-2 12H5zM9 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2M17 22a1 1 0 1 0 0-2 1 1 0 0 0 0 2' },
    { slug: 'amine',   nom: 'Amine',   role: 'Analyse Financière',          desc: 'Importe tes exports Excel/CSV et génère tableaux de bord CGNC et ratios clés.',  grad: 'linear-gradient(135deg,#065F46,#10B981)', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
    { slug: 'nadia',   nom: 'Nadia',   role: 'RH & Recrutement',            desc: 'Offres d\'emploi, grilles d\'entretien et lettres d\'embauche en un clic.',      grad: 'linear-gradient(135deg,#9333EA,#A855F7)', icon: 'M16 21v-2a4 4 0 0 0-8 0v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z' },
    { slug: 'tariq',   nom: 'Tariq',   role: 'Stratégie & SWOT',            desc: 'SWOT, plan 90 jours et positionnement marché pour ta prochaine décision.',        grad: 'linear-gradient(135deg,#1D4ED8,#3B82F6)', icon: 'M12 3 2 8l10 5 10-5zM5 11v5c0 1 3 3 7 3s7-2 7-3v-5' },
    { slug: 'reda',    nom: 'Reda',    role: 'Présentations & Pitchs',      desc: 'Slides pitch, présentation client et rapport — méthode PEP, notes orateur.',     grad: 'linear-gradient(135deg,#0F766E,#14B8A6)', icon: 'M4 5h16v14H4zM4 10h16M9 14h7' },
    { slug: 'fatima',  nom: 'Fatima',  role: 'Support Client',              desc: 'Réponses réclamations, FAQ et scripts support en FR, Darija et Arabe.',          grad: 'linear-gradient(135deg,#B45309,#F59E0B)', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' },
    { slug: 'imane',   nom: 'Imane',   role: 'Créativité & Publicité',      desc: 'Slogans, briefs créatifs et textes pub avec variantes A/B.',                     grad: 'linear-gradient(135deg,#831843,#EC4899)', icon: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z' },
    { slug: 'kamal',   nom: 'Kamal',   role: 'Analytics & KPIs',            desc: 'Analyse vos données commerciales et génère rapports KPI commentés par domaine.',  grad: 'linear-gradient(135deg,#1E40AF,#6366F1)', icon: 'M3 12h4l3 7 4-14 3 7h4' },
    { slug: 'samia',   nom: 'Samia',   role: 'Email Marketing',             desc: 'Emails, relances J+3/J+7/J+14 et newsletters adaptés à votre ton.',              grad: 'linear-gradient(135deg,#7C2D12,#EA580C)', icon: 'M4 4h16v16H4zM22 7l-10 7L2 7' },
  ];

  const plans = [
    {
      nom: 'Starter',
      prix: 'Gratuit',
      detail: '5 agents · 20 générations/mois',
      highlight: false,
      badge: null,
      features: ['5 agents IA inclus', '20 générations par mois', 'Studios dédiés par agent', 'BrandKit personnalisé'],
      cta: 'Commencer gratuitement',
      href: '/sign-up',
    },
    {
      nom: 'Pro',
      prix: '490 MAD',
      detail: 'HT / mois · 10 agents · illimité',
      highlight: true,
      badge: 'LE PLUS CHOISI',
      features: ['10 agents IA inclus', 'Générations illimitées', 'Workflows connectés', 'Web Search (Nour)', 'Support prioritaire'],
      cta: 'Démarrer le plan Pro',
      href: '/sign-up',
    },
    {
      nom: 'Agence',
      prix: '990 MAD',
      detail: 'HT / mois · 15 agents · multi-org',
      highlight: false,
      badge: null,
      features: ['15 agents spécialisés', 'Multi-organisation', 'Accès API complet', 'E-facture XML + QR Code DGI', 'Équipe dédiée & SLA'],
      cta: 'Parler à un expert',
      href: 'mailto:cnahass@gmail.com',
    },
  ];

  const faqs = [
    { q: 'Combien de temps pour avoir mes premiers résultats ?', r: 'Dès votre inscription, vous accédez aux studios. Les premières générations (facture, post, séquence prospect) sont disponibles en moins de 2 minutes.' },
    { q: 'Dois-je remplacer mes outils actuels ?', r: 'Non. MUAKIL s\'intègre à votre flux existant : vous copiez les outputs dans votre CRM, email ou WhatsApp, ou utilisez notre API (plan Agence).' },
    { q: 'Mes données sont-elles sécurisées ?', r: 'Oui. Chaque organisation est isolée. Vos données BrandKit et livrables ne sont jamais partagées entre clients. Hébergement EU.' },
    { q: 'Puis-je annuler à tout moment ?', r: 'Oui, sans engagement ni frais cachés. Vous résiliez depuis votre espace client.' },
    { q: 'Les agents parlent-ils en Darija ?', r: 'Fatima (Support Client) gère le Darija, l\'Arabe classique, le Français et un mix. Les autres agents sont en Français, avec des contenus adaptés au contexte marocain.' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #0B0D11; color: #E2E8F0; font-family: "Inter", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
        a { color: inherit; text-decoration: none; }

        /* ── Keyframes ── */
        @keyframes rise       { from { opacity:0; transform:translateY(22px);  } to { opacity:1; transform:translateY(0);  } }
        @keyframes rise-slow  { from { opacity:0; transform:translateY(32px);  } to { opacity:1; transform:translateY(0);  } }
        @keyframes fade-in    { from { opacity:0; }                              to { opacity:1; }                            }
        @keyframes blink      { 0%,100% { opacity:.2; } 50% { opacity:1; }      }
        @keyframes marquee    { from { transform:translateX(0); } to { transform:translateX(-50%); } }
        @keyframes pulse-glow { 0%,100% { opacity:.55; } 50% { opacity:.85; }   }
        @keyframes float      { 0%,100% { transform:translateY(0);  }  50% { transform:translateY(-6px); } }
        @keyframes shimmer    { from { background-position:-200% 0; } to { background-position:200% 0; } }
        @keyframes badge-pop  { 0% { transform:scale(.8); opacity:0; } 80% { transform:scale(1.06); } 100% { transform:scale(1); opacity:1; } }
        @keyframes stat-in    { from { opacity:0; transform:translateY(18px) scale(.97); } to { opacity:1; transform:none; } }
        @keyframes step-in    { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:none; } }

        /* ── Animations d'entrée staggered (CSS pur, pas de JS) ── */
        .anim-in   { animation: rise .5s ease both; }
        .anim-in-1 { animation: rise .5s .07s ease both; }
        .anim-in-2 { animation: rise .5s .14s ease both; }
        .anim-in-3 { animation: rise .5s .21s ease both; }
        .anim-in-4 { animation: rise .5s .28s ease both; }

        /* ── Navbar links ── */
        .nav-link { color:#94A3B8; padding:6px 12px; border-radius:8px; font-size:14px;
                    transition: color .15s ease, background .15s ease; }
        .nav-link:hover { color:#E2E8F0; background:rgba(255,255,255,.06); }

        /* ── Boutons principaux ── */
        .btn-primary { display:inline-flex; align-items:center; gap:8px;
          background:#6366F1; color:#fff; padding:13px 24px; border-radius:10px;
          font-size:15px; font-weight:600; box-shadow:0 8px 28px rgba(99,102,241,.35);
          transition: background .2s, transform .15s, box-shadow .2s; }
        .btn-primary:hover { background:#4F46E5; transform:translateY(-1px); box-shadow:0 12px 36px rgba(99,102,241,.50); }
        .btn-primary:active { transform:translateY(0); }

        .btn-ghost { display:inline-flex; align-items:center; padding:13px 22px; border-radius:10px;
          font-size:15px; font-weight:500; border:1px solid rgba(255,255,255,.12);
          color:#CBD5E1; background:rgba(255,255,255,.04);
          transition: border-color .2s, background .2s, color .2s, transform .15s; }
        .btn-ghost:hover { border-color:rgba(255,255,255,.22); background:rgba(255,255,255,.08); color:#F1F5F9; transform:translateY(-1px); }

        .btn-nav { color:#94A3B8; font-size:14px; padding:8px 14px; border-radius:8px;
          border:1px solid rgba(255,255,255,.10); font-weight:500;
          transition: color .15s, border-color .15s, background .15s; }
        .btn-nav:hover { color:#E2E8F0; border-color:rgba(255,255,255,.20); background:rgba(255,255,255,.06); }

        .btn-cta-main { display:inline-flex; align-items:center; gap:8px;
          background:#6366F1; color:#fff; padding:9px 18px; border-radius:8px;
          font-size:14px; font-weight:600; letter-spacing:-.01em;
          transition: background .2s, transform .15s, box-shadow .2s;
          box-shadow:0 4px 16px rgba(99,102,241,.30); }
        .btn-cta-main:hover { background:#4F46E5; transform:translateY(-1px); box-shadow:0 8px 24px rgba(99,102,241,.45); }

        /* ── Agent cards ── */
        .agent-card { transition: background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease; }
        .agent-card:hover { background:#161922 !important; border-color:rgba(99,102,241,.30) !important;
          transform:translateY(-3px); box-shadow:0 8px 32px rgba(0,0,0,.35); }
        .agent-card:hover .agent-open { color:#818CF8 !important; border-color:rgba(99,102,241,.40) !important; background:rgba(99,102,241,.10) !important; }
        .agent-open { transition: color .15s, border-color .15s, background .15s; }

        /* ── Stat cards ── */
        .stat-card { transition: background .18s, border-color .18s, transform .2s; }
        .stat-card:hover { background:#161922 !important; border-color:rgba(99,102,241,.20) !important; transform:translateY(-2px); }

        /* ── Plan cards ── */
        .plan-card { transition: transform .2s ease, border-color .22s ease, box-shadow .22s ease; }
        .plan-card:hover { transform:translateY(-4px); }
        .plan-card:not(.plan-highlight):hover { border-color:rgba(255,255,255,.18) !important; box-shadow:0 12px 40px rgba(0,0,0,.30); }
        .plan-highlight:hover { box-shadow:0 16px 48px rgba(99,102,241,.28) !important; }
        .plan-btn { display:inline-flex; align-items:center; gap:8px; border-radius:9px;
          padding:12px 20px; font-size:14.5px; font-weight:600; white-space:nowrap;
          transition: background .18s, box-shadow .18s, transform .15s; }
        .plan-btn:hover { transform:translateY(-1px); }
        .plan-btn-accent { background:#6366F1; color:#fff; border:none; box-shadow:0 6px 24px rgba(99,102,241,.30); }
        .plan-btn-accent:hover { background:#4F46E5; box-shadow:0 10px 32px rgba(99,102,241,.45); }
        .plan-btn-ghost { background:rgba(255,255,255,.07); color:#fff; border:1px solid rgba(255,255,255,.10); }
        .plan-btn-ghost:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.20); }

        /* ── Témoignages ── */
        .testi-card { transition: background .18s, border-color .18s, transform .2s; }
        .testi-card:hover { background:#161922 !important; border-color:rgba(255,255,255,.12) !important; transform:translateY(-3px); }

        /* ── Steps (comment ça marche) ── */
        .step-card { transition: background .18s, border-color .18s, transform .2s; }
        .step-card:hover { background:rgba(255,255,255,.07) !important; border-color:rgba(99,102,241,.25) !important; transform:translateY(-2px); }

        /* ── FAQ details ── */
        .faq-item { transition: background .15s, border-color .15s; }
        .faq-item:hover { border-color:rgba(255,255,255,.12) !important; }
        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-icon { transform:rotate(45deg); color:#818CF8; }
        details[open] { border-color:rgba(99,102,241,.25) !important; background:#13151E !important; }
        .faq-icon { transition: transform .22s ease, color .15s; display:inline-block; }
        summary { transition: color .15s; }
        summary:hover { color:#F1F5F9 !important; }

        /* ── Glow ambiant qui pulse ── */
        .glow-pulse { animation: pulse-glow 4s ease-in-out infinite; }

        /* ── Mockup flotte légèrement ── */
        .float-mock { animation: float 5s ease-in-out infinite; }

        /* ── Badge hero pop ── */
        .hero-badge { animation: badge-pop .5s .2s ease both; }

        /* ── Hero text rise ── */
        .hero-title { animation: rise .65s .1s ease both; }
        .hero-sub   { animation: rise .65s .22s ease both; }
        .hero-btns  { animation: rise .65s .34s ease both; }
      `}</style>


      <div style={{ background: '#0B0D11', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── NAVBAR ── */}
        <header style={{ position: 'sticky', top: 0, zIndex: 60, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', background: 'rgba(11,13,17,.85)', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 24, height: 64 }}>
            <a href="#top" style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9', letterSpacing: '-.01em' }}>MUAKIL</span>
            </a>
            <nav style={{ display: 'flex', gap: 2, marginLeft: 20 }}>
              <a href="#agents" className="nav-link">Agents</a>
              <a href="#comment" className="nav-link">Comment</a>
              <a href="#tarifs" className="nav-link">Tarifs</a>
              <a href="#faq" className="nav-link">FAQ</a>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              <Link href="/sign-in" className="btn-nav">Se connecter</Link>
              <Link href="/sign-up" className="btn-cta-main">
                Essayer gratuitement <span style={{ opacity: .8 }}>→</span>
              </Link>
            </div>
          </div>
        </header>

        {/* ── HERO ── */}
        <section id="top" style={{ padding: '0 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 10px', position: 'relative', background: 'linear-gradient(180deg,#111318 0%,#0B0D11 100%)', borderRadius: '0 0 24px 24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)', borderTop: 'none' }}>
            {/* Glow violet-indigo */}
            <div className="glow-pulse" style={{ position: 'absolute', top: -240, left: '50%', transform: 'translateX(-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse at center,rgba(99,102,241,.22),rgba(139,92,246,.08) 48%,transparent 72%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', padding: '40px 28px 0', textAlign: 'center' }}>
              <span className="hero-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,.12)', border: '1px solid rgba(99,102,241,.30)', borderRadius: 20, padding: '5px 14px', fontSize: 12.5, fontWeight: 500, color: '#A5B4FC', letterSpacing: '.04em' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'block', animation: 'blink 2s ease infinite' }} />
                Studio IA — PME Marocaines
              </span>
              <h1 className="hero-title" style={{ fontSize: 'clamp(44px,3.8vw,78px)', lineHeight: 1.1, letterSpacing: '-.03em', margin: '24px auto 0', maxWidth: 900, fontWeight: 600, color: '#F1F5F9' }}>
                Arrêtez de payer vos équipes <br />
                <span style={{ background: 'linear-gradient(135deg,#818CF8,#A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>de répéter les mêmes tâches.</span>
              </h1>
              <p className="hero-sub" style={{ fontSize: 17, lineHeight: 1.7, color: '#94A3B8', maxWidth: 560, margin: '22px auto 0' }}>
                15 agents IA spécialisés pour le contexte marocain — factures DGI, prospection WhatsApp, contenu bilingue, reporting CGNC. Opérationnels en 2 minutes.
              </p>
              <div className="hero-btns" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                <Link href="/sign-up" className="btn-primary">
                  Essayer le studio gratuitement →
                </Link>
                <a href="#tarifs" className="btn-ghost">
                  Voir les tarifs
                </a>
              </div>
            </div>

            {/* Dashboard mockup — cohérent avec l'app */}
            <div className="float-mock" style={{ position: 'relative', margin: '52px 32px 0', animation: 'rise .9s .45s ease both', opacity: 0, animationFillMode: 'both' }}>
              <div style={{ background: '#0F1117', border: '1px solid rgba(255,255,255,.08)', borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 60px rgba(0,0,0,.5)', overflow: 'hidden' }}>
                {/* Barre de titre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,.07)', background: '#161921' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A2020', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3A3010', display: 'block' }} />
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#103A18', display: 'block' }} />
                  <span style={{ marginLeft: 12, fontSize: 11.5, color: '#475569', fontFamily: 'monospace' }}>localhost:3000/agents</span>
                </div>
                {/* Layout app */}
                <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0,1fr)', minHeight: 300 }}>
                  {/* Sidebar */}
                  <div style={{ borderRight: '1px solid rgba(255,255,255,.06)', padding: '16px 12px', background: '#0F1117', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 10, letterSpacing: '.1em', color: '#475569', marginBottom: 8, padding: '0 8px', fontWeight: 600, textTransform: 'uppercase' }}>Tes agents</div>
                    {[
                      { nom: 'Salma', role: 'Création de contenu', grad: 'linear-gradient(135deg,#7C3AED,#C026D3)', active: false },
                      { nom: 'Karima', role: 'Administration', grad: 'linear-gradient(135deg,#E11D48,#F43F5E)', active: true },
                      { nom: 'Youssef', role: 'Prospection B2B', grad: 'linear-gradient(135deg,#059669,#10B981)', active: false },
                      { nom: 'Mehdi', role: 'Suivi prospects', grad: 'linear-gradient(135deg,#2563EB,#7C3AED)', active: false },
                    ].map(a => (
                      <div key={a.nom} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px', borderRadius: 9, background: a.active ? 'rgba(99,102,241,.12)' : 'transparent', border: a.active ? '1px solid rgba(99,102,241,.20)' : '1px solid transparent' }}>
                        <span style={{ width: 28, height: 28, borderRadius: 8, background: a.grad, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" /></svg>
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 500, color: a.active ? '#E2E8F0' : '#94A3B8', whiteSpace: 'nowrap' }}>{a.nom}</div>
                          <div style={{ fontSize: 10.5, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.role}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ marginTop: 'auto', padding: '9px', fontSize: 12, color: '#475569', borderTop: '1px solid rgba(255,255,255,.06)', paddingTop: 10 }}>+ 11 autres agents</div>
                  </div>
                  {/* Chat */}
                  <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, background: '#0B0D11' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ maxWidth: '72%', background: 'rgba(255,255,255,.06)', color: '#CBD5E1', border: '1px solid rgba(255,255,255,.08)', padding: '11px 14px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.55 }}>
                        Génère une facture pour Al Farouk SARL, 3 lignes, TVA 20%
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#E11D48,#F43F5E)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" /></svg>
                      </span>
                      <div style={{ maxWidth: '72%', background: 'rgba(99,102,241,.10)', color: '#C7D2FE', border: '1px solid rgba(99,102,241,.18)', padding: '11px 14px', borderRadius: 12, fontSize: 13.5, lineHeight: 1.6 }}>
                        Facture F-2026-0042 générée ✓<br />ICE, IF, RC intégrés — TVA 20% — Retenue source 10%<br />E-facture XML + QR Code DGI disponibles.
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 5, paddingLeft: 38 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', animation: 'blink 1.1s infinite', display: 'block' }} />
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', animation: 'blink 1.1s .2s infinite', display: 'block' }} />
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', animation: 'blink 1.1s .4s infinite', display: 'block' }} />
                    </div>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '10px 14px', background: 'rgba(255,255,255,.03)' }}>
                      <span style={{ color: '#475569', fontSize: 13 }}>Posez une question à Karima…</span>
                      <span style={{ marginLeft: 'auto', width: 26, height: 26, borderRadius: 7, background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,.06)', background: '#0B0D11', padding: '20px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
            <span style={{ fontSize: 11, letterSpacing: '.1em', color: '#475569', whiteSpace: 'nowrap', textTransform: 'uppercase', fontWeight: 600 }}>Utilisé par</span>
            <div style={{ flex: 1, overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}>
              <div style={{ display: 'flex', gap: 52, width: 'max-content', animation: 'marquee 30s linear infinite', fontSize: 11.5, letterSpacing: '.12em', color: '#9d9fa1', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}>
                <span>Cabinets Comptables</span><span>E-commerce</span><span>Agences Marketing</span><span>Cabinets Conseil</span><span>Immobilier</span><span>Logistique</span><span>Santé</span><span>Formation</span>
                <span>Cabinets Comptables</span><span>E-commerce</span><span>Agences Marketing</span><span>Cabinets Conseil</span><span>Immobilier</span><span>Logistique</span><span>Santé</span><span>Formation</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── STATS ── */}
        <section style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>Le vrai coût</span>
              <h2 style={{ fontSize: 'clamp(30px,3.8vw,50px)', lineHeight: 1.18, letterSpacing: '-.025em', margin: '16px 0 0', fontWeight: 700, color: '#F1F5F9' }}>
                Ce qui vous manque, ce n&apos;est pas l&apos;IA.<br />
                <span style={{ color: '#94A3B8', fontWeight: 400 }}>Ce sont les heures perdues à répéter.</span>
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
              {[
                { num: '70%', label: 'des demandes sont les cinq mêmes questions', detail: 'Traitées à la main, chaque jour, par des collaborateurs payés pour réfléchir.', color: '#818CF8', n: '01', delay: 0 },
                { num: '4', label: 'outils qui stockent la même donnée', detail: 'Excel, WhatsApp, boîte mail, ERP — personne n\'a la vision complète en temps réel.', color: '#A78BFA', n: '02', delay: 1 },
                { num: '11h', label: 'perdues par collaborateur, par mois', detail: 'Devis, factures, reporting, onboarding : saisis deux fois, vérifiés trois fois.', color: '#7C3AED', n: '03', delay: 2 },
                { num: '0', label: 'de ROI sur l\'outil IA déjà acheté', detail: 'Des licences payées, personne de formé, aucun process derrière.', color: '#6366F1', n: '04', delay: 3 },
              ].map(s => (
                <div key={s.n} className={`stat-card anim-in-${s.delay}`} style={{ background: '#111318', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 26 }}>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#475569', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>{s.n}</div>
                  <div style={{ fontSize: 44, lineHeight: 1.1, margin: '0 0 8px', color: s.color, fontWeight: 700, letterSpacing: '-.02em' }}>{s.num}</div>
                  <h3 style={{ fontSize: 15.5, margin: '0 0 8px', lineHeight: 1.4, color: '#E2E8F0', fontWeight: 500 }}>{s.label}</h3>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: '#64748B', margin: 0 }}>{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AGENTS CATALOGUE ── */}
        <section id="agents" style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 660, margin: '0 auto 36px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>Le catalogue</span>
              <h2 style={{ fontSize: 'clamp(30px,3.8vw,50px)', lineHeight: 1.18, letterSpacing: '-.025em', margin: '16px 0 10px', fontWeight: 700, color: '#F1F5F9' }}>
                Quinze agents. <span style={{ color: '#818CF8' }}>Une équipe, la vôtre.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, color: '#64748B', margin: 0 }}>
                Chaque agent a son propre studio dédié — interface pensée pour son métier.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 10 }}>
              {agents.map((a, i) => (
                <a key={a.slug} href={`/agents/${a.slug}`} className={`agent-card anim-in-${i % 4 + 1}`} style={{ textDecoration: 'none', background: '#111318', border: '1px solid rgba(255,255,255,.07)', borderRadius: 14, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 38, height: 38, borderRadius: 10, background: a.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon} /></svg>
                      </span>
                      <span style={{ fontSize: 10.5, color: '#475569', fontWeight: 600, letterSpacing: '.06em' }}>{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <span className="agent-open" style={{ fontSize: 11.5, color: '#6366F1', fontWeight: 500, border: '1px solid rgba(99,102,241,.22)', borderRadius: 6, padding: '3px 8px' }}>Ouvrir →</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#E2E8F0', lineHeight: 1.3 }}>{a.nom}</div>
                    <div style={{ fontSize: 12.5, color: '#6366F1', fontWeight: 500, marginTop: 1 }}>{a.role}</div>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: '#64748B', margin: 0 }}>{a.desc}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ── */}
        <section id="comment" style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', background: 'linear-gradient(170deg,#13151E 0%,#0F1117 100%)', borderRadius: 20, padding: '60px 32px 52px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)' }}>
            <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 780, height: 500, background: 'radial-gradient(ellipse at center,rgba(99,102,241,.18),transparent 68%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', textAlign: 'center', maxWidth: 680, margin: '0 auto 40px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>Comment ça marche</span>
              <h2 style={{ fontSize: 'clamp(30px,3.8vw,50px)', lineHeight: 1.18, letterSpacing: '-.025em', margin: '16px 0 10px', fontWeight: 700, color: '#F1F5F9' }}>
                De l&apos;inscription à vos premiers livrables,{' '}
                <span style={{ color: '#818CF8' }}>en moins de 5 minutes.</span>
              </h2>
            </div>
            <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12 }}>
              {[
                { n: '01', titre: 'Inscription', detail: 'Créez votre organisation Muakil et renseignez votre BrandKit (nom, secteur, ICE, ICP, ton de voix).', delay: 1 },
                { n: '02', titre: 'Choisissez un agent', detail: 'Accédez à la grille des 15 agents. Chaque agent ouvre son studio dédié — formulaire pensé pour son métier.', delay: 2 },
                { n: '03', titre: 'Générez', detail: 'Remplissez le formulaire, lancez. En quelques secondes, l\'agent produit un output structuré et prêt à l\'emploi.', delay: 3 },
                { n: '04', titre: 'Enregistrez & utilisez', detail: 'Chaque livrable est sauvegardé dans votre espace. Copiez, imprimez, exportez ou intégrez via l\'API.', delay: 4 },
              ].map(s => (
                <div key={s.n} className={`step-card anim-in-${s.delay}`} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.09)', borderRadius: 16, padding: 26 }}>
                  <div style={{ fontSize: 11, letterSpacing: '.1em', color: '#6366F1', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>{s.n}</div>
                  <h3 style={{ fontSize: 24, margin: '0 0 10px', fontWeight: 600, color: '#F1F5F9' }}>{s.titre}</h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: '#64748B', margin: 0 }}>{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ── */}
        <section style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 36px' }}>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.2, letterSpacing: '-.02em', margin: 0, fontWeight: 700, color: '#F1F5F9' }}>Ce qu&apos;en disent nos clients</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 12 }}>
              {[
                { stars: '★★★★★', quote: '« Karima génère nos factures conformes DGI en 30 secondes. On a supprimé 2h de saisie par jour. »', name: 'Rachid B.', role: 'Gérant, cabinet comptable Casablanca', grad: 'linear-gradient(135deg,#E11D48,#F43F5E)', delay: 1 },
                { stars: '★★★★★', quote: '« Youssef nous a construit une séquence WhatsApp B2B qui convertit mieux que notre équipe commerciale. »', name: 'Imane K.', role: 'Directrice commerciale, agence marketing', grad: 'linear-gradient(135deg,#059669,#10B981)', delay: 2 },
                { stars: '★★★★☆', quote: '« Le studio Amine analyse nos exports Excel CGNC en 10 secondes et sort des ratios que notre expert-comptable valide. »', name: 'Omar T.', role: 'Fondateur, PME industrie Casablanca', grad: 'linear-gradient(135deg,#065F46,#10B981)', delay: 3 },
              ].map((t, i) => (
                <div key={i} className={`testi-card anim-in-${t.delay}`} style={{ background: '#111318', border: '1px solid rgba(255,255,255,.07)', borderRadius: 16, padding: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: t.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-8 0v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" /></svg>
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#E2E8F0' }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: '#475569' }}>{t.role}</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 12, color: '#F59E0B', letterSpacing: '.05em' }}>{t.stars}</span>
                  </div>
                  <p style={{ fontSize: 15.5, lineHeight: 1.55, margin: 0, color: '#94A3B8', fontStyle: 'italic' }}>{t.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TARIFS ── */}
        <section id="tarifs" style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto 40px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>Tarifs</span>
              <h2 style={{ fontSize: 'clamp(30px,3.8vw,50px)', lineHeight: 1.18, letterSpacing: '-.025em', margin: '16px 0 10px', fontWeight: 700, color: '#F1F5F9' }}>
                Simple, transparent. <span style={{ color: '#818CF8' }}>Rien de caché.</span>
              </h2>
              <p style={{ fontSize: 15.5, lineHeight: 1.6, color: '#64748B', margin: 0 }}>Résiliable à tout moment. Aucun engagement.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(272px,1fr))', gap: 14, alignItems: 'start' }}>
              {plans.map((p, pi) => (
                <div key={p.nom} className={`plan-card anim-in-${pi + 1} ${p.highlight ? 'plan-highlight' : ''}`} style={{
                  background: p.highlight ? 'linear-gradient(170deg,#1a1c2e 0%,#111318 100%)' : '#111318',
                  border: p.highlight ? '1.5px solid #6366F1' : '1px solid rgba(255,255,255,.07)',
                  borderRadius: 18, padding: '30px 26px 34px', position: 'relative',
                  boxShadow: p.highlight ? '0 0 40px rgba(99,102,241,.16)' : 'none'
                }}>
                  {p.badge && <span style={{ position: 'absolute', top: -10, left: 24, background: '#6366F1', color: '#fff', fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', borderRadius: 6, padding: '3px 10px', animation: 'badge-pop .4s ease both' }}>{p.badge}</span>}
                  <h3 style={{ fontSize: 15, margin: 0, fontWeight: 600, color: '#94A3B8' }}>{p.nom}</h3>
                  <div style={{ fontSize: 42, lineHeight: 1.15, margin: '10px 0 2px', letterSpacing: '-.02em', fontWeight: 700, color: '#F1F5F9' }}>{p.prix}</div>
                  <div style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>{p.detail}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 26 }}>
                    {p.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
                        <span style={{ width: 18, height: 18, borderRadius: 5, background: p.highlight ? 'rgba(99,102,241,.20)' : 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke={p.highlight ? '#818CF8' : '#6B7280'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </span>
                        <span style={{ fontSize: 14, color: '#94A3B8' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <a href={p.href} className={`plan-btn ${p.highlight ? 'plan-btn-accent' : 'plan-btn-ghost'}`}>
                    {p.cta} <span style={{ opacity: .8 }}>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 48 }}>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>FAQ</span>
              <h2 style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.2, letterSpacing: '-.02em', margin: '16px 0 12px', fontWeight: 700, color: '#F1F5F9' }}>Les questions qu&apos;on nous pose chaque semaine.</h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#64748B', margin: '0 0 16px' }}>Une autre question ? Écrivez-nous, nous répondons sous 24h.</p>
              <a href="mailto:cnahass@gmail.com" style={{ color: '#6366F1', fontSize: 15, fontWeight: 500 }}>cnahass@gmail.com</a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {faqs.map((f, i) => (
                <details key={i} className={`faq-item anim-in-${i % 4 + 1}`} style={{ background: '#111318', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, overflow: 'hidden' }}>
                  <summary style={{ padding: '18px 20px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', fontSize: 15, fontWeight: 500, color: '#E2E8F0', listStyle: 'none' }}>
                    <span style={{ flex: 1, lineHeight: 1.45, paddingRight: 14 }}>{f.q}</span>
                    <span className="faq-icon" style={{ fontSize: 18, color: '#6366F1', lineHeight: 1.3, flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ margin: 0, padding: '0 20px 18px', fontSize: 14, lineHeight: 1.7, color: '#64748B' }}>{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ padding: '96px 24px 0' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', background: 'linear-gradient(170deg,#13151E 0%,#0F1117 100%)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 20, padding: '60px 32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse at center,rgba(99,102,241,.18),transparent 68%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', textAlign: 'center', maxWidth: 660, margin: '0 auto' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,.10)', border: '1px solid rgba(99,102,241,.22)', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500, color: '#818CF8', letterSpacing: '.04em' }}>Commencer maintenant</span>
              <h2 style={{ fontSize: 'clamp(32px,4.2vw,56px)', lineHeight: 1.15, letterSpacing: '-.025em', margin: '18px 0 14px', fontWeight: 700, color: '#F1F5F9' }}>
                Gratuit, immédiat.<br />
                <span style={{ color: '#818CF8' }}>Vos agents sont prêts.</span>
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: '#64748B', margin: '0 0 34px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
                Créez votre espace, ajoutez votre BrandKit et lancez votre premier agent en moins de 5 minutes.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
                <Link href="/sign-up" className="btn-primary" style={{ padding: '14px 28px', fontSize: 15.5 }}>
                  Créer mon compte gratuitement →
                </Link>
                <a href="mailto:cnahass@gmail.com" className="btn-ghost" style={{ padding: '14px 24px', fontSize: 15.5 }}>
                  Contacter l&apos;équipe
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ marginTop: 80, borderTop: '1px solid rgba(255,255,255,.06)', padding: '28px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#E2E8F0' }}>MUAKIL</span>
            </div>
            <span style={{ color: '#475569' }}>Studio IA pour les PME marocaines — Casablanca</span>
                        <div style={{ display: 'flex', gap: 20 }}>
              <Link href="/sign-in" style={{ color: '#475569' }}>Connexion</Link>
              <Link href="/sign-up" style={{ color: '#475569' }}>S&apos;inscrire</Link>
              <Link href="/cgu" style={{ color: '#475569' }}>CGU</Link>
              <Link href="mailto:contact@muakil.ma" style={{ color: '#475569' }}>Contact</Link>
            </div>
            <span style={{ color: '#334155' }}>© 2026 Muakil — SOCYTAY</span>
          </div>
        </footer>

      </div>
    </>
  );
}