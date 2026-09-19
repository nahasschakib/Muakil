import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MUAKIL — Ton équipe IA, taillée pour le Maroc",
  description:
    "15 agents IA spécialisés pour les PME marocaines — facturation, prospection, contenu social, réunions et propositions commerciales.",
};

export default function HomePage() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700;800&family=Inter:wght@400;500;600&family=Cairo:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div dangerouslySetInnerHTML={{ __html: landingHTML }} />
    </>
  );
}

const landingHTML = `
<style>
     :root {
    --bg:          #0F1117;
    --surface:     #1C1F2E;
    --surface2:    #151720;
    --border:      rgba(255,255,255,0.06);
    --violet:      #00D5BE;
    --violet-dim:  #00AF9C;
    --violet-soft: rgba(0,213,190,0.12);
    --violet-glow: rgba(0,213,190,0.20);
    --lavender:    #00D5BE;
    --white:       #ffffff;
    --cream:       #E8E6F0;
    --muted:       rgba(255,255,255,0.35);
    --muted2:      rgba(255,255,255,0.18);
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body, #muakil-landing {
    background: var(--bg);
    color: var(--cream);
    font-family: 'Inter', sans-serif;
    overflow-x: hidden;
  }
  .ar { font-family: 'Cairo', sans-serif; direction: rtl; }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 0 2rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(15,17,23,0.85); backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
  }
  .logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.4rem; font-weight: 800; color: #fff; text-decoration: none; letter-spacing: -0.04em; }
  .logo span { color: var(--lavender); }
  .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
  .nav-links a { color: var(--muted); text-decoration: none; font-size: 0.875rem; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover { color: var(--cream); }
  .nav-cta { background: var(--violet) !important; color: #fff !important; padding: 0.5rem 1.25rem; border-radius: 10px; font-weight: 700 !important; transition: background 0.2s !important; }
  .nav-cta:hover { background: var(--violet-dim) !important; }

  .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 8rem 2rem 5rem; position: relative; overflow: hidden; text-align: center; }
  .hero::before { content: ''; position: absolute; top: 15%; left: 50%; transform: translateX(-50%); width: 800px; height: 600px; background: radial-gradient(ellipse, rgba(124,92,252,0.18) 0%, rgba(124,92,252,0.06) 45%, transparent 70%); pointer-events: none; z-index: 0; }
  .hero > * { position: relative; z-index: 1; }
  .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--violet-soft); border: 1px solid rgba(124,92,252,0.3); border-radius: 100px; padding: 0.4rem 1.1rem; font-size: 0.72rem; font-weight: 600; color: var(--lavender); margin-bottom: 2rem; letter-spacing: 0.05em; text-transform: uppercase; animation: fadeUp 0.5s ease forwards; }
  .hero-title-fr { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(2.75rem, 6.5vw, 5rem); font-weight: 800; color: #fff; line-height: 1.1; letter-spacing: -0.03em; margin-bottom: 1.25rem; animation: fadeUp 0.6s ease 0.1s both; }
  .hero-title-fr span { color: var(--lavender); }
  .hero-lang-sep { display: flex; align-items: center; gap: 1rem; justify-content: center; margin-bottom: 1.25rem; animation: fadeUp 0.6s ease 0.2s both; }
  .hero-lang-sep::before, .hero-lang-sep::after { content: ''; flex: 1; max-width: 80px; height: 1px; background: var(--border); }
  .hero-lang-sep span { font-size: 0.7rem; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.12em; }
  .hero-title-ar { font-family: 'Cairo', sans-serif; font-size: clamp(1.4rem, 3vw, 2.25rem); font-weight: 700; color: var(--muted); direction: rtl; line-height: 1.4; margin-bottom: 1.75rem; animation: fadeUp 0.6s ease 0.25s both; }
  .hero-title-ar .hl { color: var(--lavender); }
  .hero-sub { font-size: 1rem; color: var(--muted); line-height: 1.8; max-width: 560px; margin: 0 auto 2.5rem; animation: fadeUp 0.6s ease 0.3s both; }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 4rem; animation: fadeUp 0.6s ease 0.4s both; }
  .btn-primary { background: var(--violet); color: #fff; padding: 0.9rem 2.25rem; border-radius: 12px; font-weight: 700; font-size: 1rem; text-decoration: none; display: inline-block; box-shadow: 0 0 30px var(--violet-glow); transition: background 0.2s, box-shadow 0.2s; }
  .btn-primary:hover { background: var(--violet-dim); }
  .btn-secondary { border: 1px solid var(--border); color: var(--cream); padding: 0.9rem 2.25rem; border-radius: 12px; font-weight: 500; font-size: 1rem; text-decoration: none; display: inline-block; transition: border-color 0.2s; }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.2); }

  .dashboard { width: 100%; max-width: 880px; margin: 0 auto; background: var(--surface2); border: 1px solid rgba(124,92,252,0.2); border-radius: 20px; overflow: hidden; box-shadow: 0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(124,92,252,0.08); animation: fadeUp 0.7s ease 0.5s both; }
  .dash-bar { background: var(--surface); border-bottom: 1px solid var(--border); padding: 0.875rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dash-url { flex: 1; background: var(--bg); border-radius: 6px; padding: 0.3rem 0.875rem; font-size: 0.72rem; color: var(--muted2); font-family: monospace; margin: 0 0.75rem; }
  .dash-body { display: grid; grid-template-columns: 210px 1fr; min-height: 360px; }
  .dash-sidebar { background: var(--surface); border-right: 1px solid var(--border); padding: 1.25rem 0; }
  .dash-logo { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 1.05rem; color: #fff; padding: 0 1.25rem 1.25rem; border-bottom: 1px solid var(--border); margin-bottom: 0.75rem; }
  .dash-logo span { color: var(--lavender) !important; }
  .dash-nav-item { display: flex; align-items: center; gap: 0.625rem; padding: 0.6rem 1.25rem; font-size: 0.78rem; color: var(--muted); }
  .dash-nav-item.active { background: var(--violet-soft); color: var(--lavender); border-right: 2px solid var(--violet); }
  .dash-content { padding: 1.5rem; }
  .dash-greeting { font-size: 0.8rem; color: var(--muted); margin-bottom: 1rem; }
  .dash-greeting strong { color: var(--cream); }
  .agents-mini-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 0.625rem; margin-bottom: 1.25rem; }
  .agent-mini { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem; }
  .agent-mini-emoji { font-size: 1.2rem; margin-bottom: 0.3rem; display: block; }
  .agent-mini-name { font-size: 0.75rem; font-weight: 700; color: #fff; }
  .agent-mini-role { font-size: 0.65rem; color: var(--lavender); margin-top: 0.1rem; }
  .recent-livrable { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.875rem; }
  .livrable-icon { width: 30px; height: 30px; border-radius: 8px; background: var(--violet-soft); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0; }
  .livrable-text { flex: 1; }
  .livrable-title { font-size: 0.75rem; font-weight: 600; color: #fff; }
  .livrable-meta { font-size: 0.65rem; color: var(--muted); margin-top: 0.1rem; }
  .livrable-badge { font-size: 0.62rem; font-weight: 700; color: #22c55e; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); padding: 0.2rem 0.5rem; border-radius: 100px; }

  .stats-strip { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 2.5rem 2rem; }
  .stats-inner { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 2rem; text-align: center; }
  .stat-number { font-family: 'Bricolage Grotesque', sans-serif; font-size: 2.75rem; font-weight: 800; color: var(--lavender); display: block; line-height: 1; }
  .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 0.4rem; display: block; }
  .stat-label-ar { font-family: 'Cairo', sans-serif; font-size: 0.72rem; font-weight: 600; color: var(--muted2); direction: rtl; display: block; margin-top: 0.15rem; }

  section { padding: 6rem 2rem; }
  .section-inner { max-width: 1100px; margin: 0 auto; }
  .section-label { font-size: 0.7rem; font-weight: 700; color: var(--lavender); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 0.75rem; display: block; }
  .section-title { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -0.03em; color: #fff; margin-bottom: 0.875rem; line-height: 1.15; }
  .section-sub { font-size: 0.9rem; color: var(--muted); line-height: 1.8; max-width: 520px; }
  .section-header { margin-bottom: 3.5rem; }

  .agents-section { background: var(--surface); position: relative; overflow: hidden; }
  .agents-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; }
  .agent-card { background: var(--bg); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; transition: border-color 0.25s, transform 0.2s, box-shadow 0.2s; }
  .agent-card:hover { border-color: rgba(124,92,252,0.4); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(124,92,252,0.1); }
  .ac-top { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1rem; }
  .ac-avatar { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0; }
  .ac-name { font-weight: 700; font-size: 1rem; color: #fff; }
  .ac-studio { font-size: 0.7rem; color: var(--lavender); margin-top: 0.15rem; }
  .ac-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.65; margin-bottom: 1rem; }
  .ac-tags { display: flex; flex-wrap: wrap; gap: 0.375rem; }
  .tag { font-size: 0.65rem; padding: 0.22rem 0.6rem; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); color: var(--muted); }

  .steps-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; }
  .step-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 2rem; }
  .step-num { font-family: 'Bricolage Grotesque', sans-serif; font-size: 4rem; font-weight: 800; color: var(--violet-soft); line-height: 1; margin-bottom: 1.25rem; display: block; }
  .step-title { font-weight: 700; font-size: 1.05rem; color: #fff; margin-bottom: 0.25rem; }
  .step-title-ar { font-family: 'Cairo', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--lavender); direction: rtl; margin-bottom: 0.625rem; }
  .step-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.7; }

  .pricing-section { background: var(--surface); }
  .pricing-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; align-items: start; }
  .pricing-card { background: var(--bg); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
  .pricing-card.featured { border-color: var(--violet); box-shadow: 0 0 60px rgba(124,92,252,0.15); }
  .pricing-top { padding: 2rem 2rem 1.5rem; border-bottom: 1px solid var(--border); }
  .pricing-rec { font-size: 0.65rem; font-weight: 700; color: var(--lavender); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.875rem; }
  .pricing-plan { font-weight: 800; font-size: 1.2rem; color: #fff; }
  .pricing-plan-ar { font-family: 'Cairo', sans-serif; font-size: 0.88rem; font-weight: 600; color: var(--muted); direction: rtl; margin-bottom: 1rem; }
  .pricing-price { font-family: 'Bricolage Grotesque', sans-serif; font-size: 2.5rem; font-weight: 800; color: #fff; line-height: 1; }
  .pricing-price span { font-size: 0.85rem; font-weight: 500; color: var(--muted); }
  .pricing-desc { font-size: 0.78rem; color: var(--muted); margin-top: 0.625rem; line-height: 1.55; }
  .pricing-body { padding: 1.5rem 2rem 2rem; }
  .pricing-features { list-style: none; }
  .pricing-features li { display: flex; align-items: start; gap: 0.625rem; font-size: 0.83rem; color: var(--muted); padding: 0.45rem 0; border-bottom: 1px solid var(--border); }
  .pricing-features li:last-child { border-bottom: none; }
  .check { color: var(--lavender); flex-shrink: 0; margin-top: 1px; }
  .pricing-cta { display: block; text-align: center; padding: 0.875rem; border-radius: 10px; font-weight: 700; font-size: 0.875rem; text-decoration: none; margin-top: 1.5rem; transition: all 0.2s; }
  .cta-violet { background: var(--violet); color: #fff; box-shadow: 0 0 25px var(--violet-glow); }
  .cta-violet:hover { background: var(--violet-dim); }
  .cta-outline { border: 1px solid var(--border); color: var(--cream); }
  .cta-outline:hover { border-color: rgba(255,255,255,0.2); }

  .testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; }
  .testi-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 1.75rem; }
  .testi-quote-ar { font-family: 'Cairo', sans-serif; font-size: 0.95rem; font-weight: 600; color: var(--cream); direction: rtl; line-height: 1.8; margin-bottom: 0.625rem; }
  .testi-quote { font-size: 0.8rem; color: var(--muted); line-height: 1.7; margin-bottom: 1.25rem; font-style: italic; }
  .testi-author { display: flex; align-items: center; gap: 0.75rem; }
  .testi-avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.78rem; color: #fff; flex-shrink: 0; }
  .testi-name { font-weight: 600; font-size: 0.8rem; color: #fff; }
  .testi-role { font-size: 0.68rem; color: var(--muted); }

  .cta-section { text-align: center; padding: 7rem 2rem; position: relative; overflow: hidden; background: var(--bg); }
  .cta-section::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 700px; height: 500px; background: radial-gradient(ellipse, rgba(124,92,252,0.15) 0%, rgba(124,92,252,0.05) 45%, transparent 70%); pointer-events: none; }
  .cta-section > * { position: relative; z-index: 1; }
  .cta-title-fr { font-family: 'Bricolage Grotesque', sans-serif; font-size: clamp(2rem, 4.5vw, 3.5rem); font-weight: 800; color: #fff; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 0.875rem; }
  .cta-title-fr .hl { color: var(--lavender); }
  .cta-title-ar { font-family: 'Cairo', sans-serif; font-size: clamp(1.2rem, 2.5vw, 1.9rem); font-weight: 700; color: var(--muted); direction: rtl; line-height: 1.4; margin-bottom: 1.5rem; }
  .cta-title-ar .hl { color: var(--lavender); }
  .cta-sub { font-size: 0.95rem; color: var(--muted); max-width: 500px; margin: 0 auto 2.5rem; line-height: 1.75; }
  .cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

  footer { padding: 2.5rem 2rem; border-top: 1px solid var(--border); background: var(--surface); }
  .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
  .footer-logo { font-family: 'Bricolage Grotesque', sans-serif; font-size: 1.2rem; font-weight: 800; color: #fff; }
  .footer-logo span { color: var(--lavender); }
  .footer-copy { font-size: 0.72rem; color: var(--muted); }
  .footer-links { display: flex; gap: 1.5rem; }
  .footer-links a { font-size: 0.72rem; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--cream); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 900px) {
    .agents-grid, .steps-grid, .pricing-grid, .testi-grid { grid-template-columns: 1fr; }
    .stats-inner { grid-template-columns: repeat(2,1fr); }
    .dash-body { grid-template-columns: 1fr; }
    .dash-sidebar { display: none; }
    .agents-mini-grid { grid-template-columns: repeat(2,1fr); }
    .nav-links li:not(:last-child) { display: none; }
  }
</style>

<div id="muakil-landing">

<nav>
  <a href="/" class="logo">MU<span>A</span>KIL</a>
  <ul class="nav-links">
    <li><a href="#agents">Agents</a></li>
    <li><a href="#comment">Comment</a></li>
    <li><a href="#tarifs">Tarifs</a></li>
    <li><a href="/sign-in" class="nav-cta">Commencer gratuitement</a></li>
  </ul>
</nav>

<section class="hero">
  <div class="hero-badge">✦ مدعوم بالذكاء الاصطناعي · Propulsé par l'IA</div>
  <h1 class="hero-title-fr">Ton équipe IA,<br><span>taillée pour le Maroc</span></h1>
  <div class="hero-lang-sep"><span>AR</span></div>
  <p class="hero-title-ar">فريقك الذكي، <span class="hl">صُنع للمغرب</span></p>
  <p class="hero-sub">15 agents spécialisés qui génèrent tes factures, tes posts sociaux, tes propositions commerciales et préparent tes réunions — en français, en arabe, selon les codes du marché marocain.</p>
  <div class="hero-actions">
    <a href="/sign-up" class="btn-primary">ابدأ مجاناً — Essai gratuit</a>
    <a href="#agents" class="btn-secondary">Voir les agents ↓</a>
  </div>
  <div class="dashboard">
    <div class="dash-bar">
      <div class="dot" style="background:#FF5F57"></div>
      <div class="dot" style="background:#FFBD2E"></div>
      <div class="dot" style="background:#28CA42"></div>
      <div class="dash-url">muakil.ma/agents</div>
    </div>
    <div class="dash-body">
      <div class="dash-sidebar">
        <div class="dash-logo">MU<span>A</span>KIL</div>
        <div class="dash-nav-item active">🤖 Agents</div>
        <div class="dash-nav-item">🔗 Workflows</div>
        <div class="dash-nav-item">📦 Livrables</div>
        <div class="dash-nav-item">🎨 Brand Kit</div>
      </div>
      <div class="dash-content">
        <div class="dash-greeting">Bonjour, <strong>Cabinet Al Farouk</strong> 👋 — Que génère-t-on aujourd'hui ?</div>
        <div class="agents-mini-grid">
          <div class="agent-mini"><span class="agent-mini-emoji">✍️</span><div class="agent-mini-name">Salma</div><div class="agent-mini-role">ContentStudio</div></div>
          <div class="agent-mini"><span class="agent-mini-emoji">🎯</span><div class="agent-mini-name">Youssef</div><div class="agent-mini-role">ProspectStudio</div></div>
          <div class="agent-mini"><span class="agent-mini-emoji">🧾</span><div class="agent-mini-name">Karima</div><div class="agent-mini-role">InvoiceStudio</div></div>
          <div class="agent-mini"><span class="agent-mini-emoji">📋</span><div class="agent-mini-name">Mehdi</div><div class="agent-mini-role">MeetingStudio</div></div>
          <div class="agent-mini"><span class="agent-mini-emoji">📄</span><div class="agent-mini-name">Karim</div><div class="agent-mini-role">ProposalStudio</div></div>
          <div class="agent-mini" style="opacity:0.35;border-style:dashed"><span class="agent-mini-emoji">✦</span><div class="agent-mini-name">+10 agents</div><div class="agent-mini-role">Pro / Agence</div></div>
        </div>
        <div class="recent-livrable">
          <div class="livrable-icon">✍️</div>
          <div class="livrable-text">
            <div class="livrable-title">Post Instagram — Lancement service comptabilité digitale</div>
            <div class="livrable-meta">Salma · ContentStudio · Il y a 3 min</div>
          </div>
          <div class="livrable-badge">✓ Généré</div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="stats-strip">
  <div class="stats-inner">
    <div><span class="stat-number">15</span><span class="stat-label">Agents spécialisés</span><span class="stat-label-ar">وكيل متخصص</span></div>
    <div><span class="stat-number">3×</span><span class="stat-label">Plus vite qu'un assistant</span><span class="stat-label-ar">أسرع من المساعد</span></div>
    <div><span class="stat-number">100%</span><span class="stat-label">Contexte marocain</span><span class="stat-label-ar">سياق مغربي</span></div>
    <div><span class="stat-number">∞</span><span class="stat-label">Livrables générés</span><span class="stat-label-ar">مخرجات بلا حدود</span></div>
  </div>
</div>

<section class="agents-section" id="agents">
  <div class="section-inner">
    <div class="section-header">
      <span class="section-label">وكلاؤك الأذكياء · Tes agents IA</span>
      <h2 class="section-title">Une équipe complète, disponible 24h/24</h2>
      <p class="section-sub">Chaque agent connaît la législation marocaine, les codes culturels business et génère des livrables prêts à l'emploi.</p>
    </div>
    <div class="agents-grid">
      <div class="agent-card"><div class="ac-top"><div class="ac-avatar" style="background:linear-gradient(135deg,#7C5CFC,#A78BFA)">✍️</div><div><div class="ac-name">Salma</div><div class="ac-studio">ContentStudio</div></div></div><p class="ac-desc">Posts Instagram, LinkedIn et Facebook avec aperçu visuel, hashtags marocains et légendes adaptées à ta marque.</p><div class="ac-tags"><span class="tag">Instagram</span><span class="tag">LinkedIn</span><span class="tag">Facebook</span></div></div>
      <div class="agent-card"><div class="ac-top"><div class="ac-avatar" style="background:linear-gradient(135deg,#10B981,#059669)">🎯</div><div><div class="ac-name">Youssef</div><div class="ac-studio">ProspectStudio</div></div></div><p class="ac-desc">Séquences de prospection B2B sur WhatsApp, LinkedIn, Email et SMS — 3 messages prêts, ton marocain, relances incluses.</p><div class="ac-tags"><span class="tag">WhatsApp</span><span class="tag">LinkedIn</span><span class="tag">Email</span></div></div>
      <div class="agent-card"><div class="ac-top"><div class="ac-avatar" style="background:linear-gradient(135deg,#F43F5E,#E11D48)">🧾</div><div><div class="ac-name">Karima</div><div class="ac-studio">InvoiceStudio</div></div></div><p class="ac-desc">Factures conformes à la législation marocaine — ICE, IF, RC, TVA, retenue à la source. Export PDF en un clic.</p><div class="ac-tags"><span class="tag">ICE / IF / RC</span><span class="tag">TVA 20%</span><span class="tag">PDF</span></div></div>
      <div class="agent-card"><div class="ac-top"><div class="ac-avatar" style="background:linear-gradient(135deg,#6366F1,#4F46E5)">📋</div><div><div class="ac-name">Mehdi</div><div class="ac-studio">MeetingStudio</div></div></div><p class="ac-desc">Fiche de réunion complète — qualification BANT, questions clés, objections probables et conseils culturels marocains.</p><div class="ac-tags"><span class="tag">BANT</span><span class="tag">Questions</span><span class="tag">Objections</span></div></div>
      <div class="agent-card"><div class="ac-top"><div class="ac-avatar" style="background:linear-gradient(135deg,#F59E0B,#D97706)">📄</div><div><div class="ac-name">Karim</div><div class="ac-studio">ProposalStudio</div></div></div><p class="ac-desc">Propositions commerciales SCR avec 3 options tarifaires adaptées au marché marocain. Format PDF professionnel.</p><div class="ac-tags"><span class="tag">SCR</span><span class="tag">3 options</span><span class="tag">PDF</span></div></div>
      <div class="agent-card" style="border-style:dashed;opacity:0.45"><div class="ac-top"><div class="ac-avatar" style="background:var(--surface)">✦</div><div><div class="ac-name">+10 agents</div><div class="ac-studio">Nour · Tariq · Amine · Reda…</div></div></div><p class="ac-desc">Veille, RH, analyse financière et bien plus — disponibles en Plan Pro et Agence.</p><div class="ac-tags"><span class="tag">Plan Pro</span><span class="tag">Plan Agence</span></div></div>
    </div>
  </div>
</section>

<section id="comment">
  <div class="section-inner">
    <div class="section-header">
      <span class="section-label">بسيط · Simple</span>
      <h2 class="section-title">Prêt en 3 minutes</h2>
      <p class="section-sub">Pas de formation, pas de configuration complexe. Tu remplis un brief, l'agent fait le reste.</p>
    </div>
    <div class="steps-grid">
      <div class="step-card"><span class="step-num">01</span><div class="step-title">Configure ta marque</div><div class="step-title-ar">أدخل معلومات شركتك</div><p class="step-desc">BrandKit en 5 minutes — nom, secteur, ICE, ton de communication. Tous tes agents s'y adaptent automatiquement.</p></div>
      <div class="step-card"><span class="step-num">02</span><div class="step-title">Choisis ton agent</div><div class="step-title-ar">اختر وكيلك الذكي</div><p class="step-desc">Sélectionne le studio adapté — contenu, prospection, facturation, réunion ou proposition commerciale.</p></div>
      <div class="step-card"><span class="step-num">03</span><div class="step-title">Génère et utilise</div><div class="step-title-ar">اصنع وانشر فوراً</div><p class="step-desc">En 30 secondes, un livrable professionnel prêt — texte, PDF ou aperçu visuel. Enregistré automatiquement.</p></div>
    </div>
  </div>
</section>

<section class="pricing-section" id="tarifs">
  <div class="section-inner">
    <div class="section-header">
      <span class="section-label">الأسعار · Tarifs</span>
      <h2 class="section-title">Investissement clair, valeur immédiate</h2>
      <p class="section-sub">Tous les plans incluent le BrandKit, les livrables et le support. Sans engagement.</p>
    </div>
    <div class="pricing-grid">
      <div class="pricing-card"><div class="pricing-top"><div class="pricing-plan">Starter</div><div class="pricing-plan-ar">المبتدئ</div><div class="pricing-price">Gratuit <span>/ toujours</span></div><p class="pricing-desc">Pour découvrir MUAKIL et tester les agents essentiels.</p></div><div class="pricing-body"><ul class="pricing-features"><li><span class="check">✓</span>5 agents (Salma, Youssef, Karima, Mehdi, Karim)</li><li><span class="check">✓</span>20 générations / mois</li><li><span class="check">✓</span>BrandKit complet</li><li><span class="check">✓</span>Export PDF factures</li></ul><a href="/sign-up" class="pricing-cta cta-outline">Commencer gratuitement</a></div></div>
      <div class="pricing-card featured"><div class="pricing-top"><div class="pricing-rec">✦ Le plus populaire</div><div class="pricing-plan">Pro</div><div class="pricing-plan-ar">الاحترافي</div><div class="pricing-price">490 <span>MAD HT / mois</span></div><p class="pricing-desc">Pour les PME qui veulent gagner du temps chaque semaine.</p></div><div class="pricing-body"><ul class="pricing-features"><li><span class="check">✓</span>10 agents inclus</li><li><span class="check">✓</span>Générations illimitées</li><li><span class="check">✓</span>BrandKit avancé</li><li><span class="check">✓</span>Export PDF premium</li><li><span class="check">✓</span>Support WhatsApp prioritaire</li></ul><a href="/sign-up" class="pricing-cta cta-violet">Démarrer en Pro</a></div></div>
      <div class="pricing-card"><div class="pricing-top"><div class="pricing-plan">Agence</div><div class="pricing-plan-ar">وكالة</div><div class="pricing-price">990 <span>MAD HT / mois</span></div><p class="pricing-desc">Pour les cabinets et agences multi-clients.</p></div><div class="pricing-body"><ul class="pricing-features"><li><span class="check">✓</span>15 agents — accès complet</li><li><span class="check">✓</span>Multi-organisation</li><li><span class="check">✓</span>BrandKit par client</li><li><span class="check">✓</span>Accès API</li><li><span class="check">✓</span>Support dédié</li></ul><a href="/sign-up" class="pricing-cta cta-outline">Contacter l'équipe</a></div></div>
    </div>
  </div>
</section>

<section>
  <div class="section-inner">
    <div class="section-header">
      <span class="section-label">آراء عملائنا · Témoignages</span>
      <h2 class="section-title">Ils l'utilisent déjà</h2>
    </div>
    <div class="testi-grid">
      <div class="testi-card"><p class="testi-quote-ar">"كنت أقضي ساعات في كتابة العروض التجارية. الآن كريم يصنعها في دقيقتين."</p><p class="testi-quote">"Je passais des heures sur mes propositions. Maintenant Karim les génère en 2 minutes avec les prix adaptés au marché."</p><div class="testi-author"><div class="testi-avatar" style="background:linear-gradient(135deg,#7C5CFC,#A78BFA)">KA</div><div><div class="testi-name">Khalid Amrani</div><div class="testi-role">DG · Agence immobilière, Casablanca</div></div></div></div>
      <div class="testi-card"><p class="testi-quote-ar">"سلمى تكتب منشوراتي على إنستغرام بأسلوب يعرف المغرب — لهجة صحيحة وهاشتاقات مناسبة."</p><p class="testi-quote">"Salma génère mes posts Instagram avec les hashtags marocains et le bon ton. Mes clients s'y retrouvent immédiatement."</p><div class="testi-author"><div class="testi-avatar" style="background:linear-gradient(135deg,#10B981,#059669)">SB</div><div><div class="testi-name">Sanae Benkiran</div><div class="testi-role">Fondatrice · Boutique mode, Marrakech</div></div></div></div>
      <div class="testi-card"><p class="testi-quote-ar">"كريمة تولد الفواتير مع ICE وTVA بشكل صحيح — أرسل PDF مباشرة للعميل."</p><p class="testi-quote">"Karima génère mes factures avec ICE, IF et TVA correctement calculée. J'envoie le PDF directement au client."</p><div class="testi-author"><div class="testi-avatar" style="background:linear-gradient(135deg,#F43F5E,#E11D48)">YE</div><div><div class="testi-name">Yassine El Fassi</div><div class="testi-role">Expert-comptable · Cabinet, Fès</div></div></div></div>
    </div>
  </div>
</section>

<div class="cta-section">
  <h2 class="cta-title-fr">Ton équipe IA t'attend.<br><span class="hl">Commence aujourd'hui.</span></h2>
  <p class="cta-title-ar">فريقك الذكي جاهز — <span class="hl">ابدأ اليوم مجاناً</span></p>
  <p class="cta-sub">Gratuit, sans carte bancaire, sans engagement. Configure ton BrandKit en 5 minutes et génère ton premier livrable.</p>
  <div class="cta-actions">
    <a href="/sign-up" class="btn-primary">Créer mon compte gratuit</a>
    <a href="#agents" class="btn-secondary">Voir les agents</a>
  </div>
</div>

<footer>
  <div class="footer-inner">
    <div class="footer-logo">MU<span>A</span>KIL</div>
    <div class="footer-copy">© 2026 MUAKIL — Produit par SOCYTAY, Casablanca, Maroc</div>
    <div class="footer-links"><a href="#">Mentions légales</a><a href="#">CGU</a><a href="#">Contact</a></div>
  </div>
</footer>

</div>
`;