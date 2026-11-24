import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react';
import logo from '../assets/kumo-logo.png';
import '../styles/about-styles.css';

const sectors = [
  'Spaza', 'Food', 'Clothing', 'Salon / barber',
  'Car wash', 'Catering', 'Vehicle services',
];

const phases = [
  {
    number: '01',
    label: 'Market entry',
    title: 'Start close to the work.',
    text: 'A focused first step: useful commerce software for selected township businesses, grounded in their day-to-day operations.',
    status: 'THE STARTING POINT',
  },
  {
    number: '02',
    label: 'Product expansion',
    title: 'Deepen the picture.',
    text: 'Over time, the vision is to extend into richer operational context, forecasting, and decision support across more business types.',
    status: 'A FUTURE DIRECTION',
  },
  {
    number: '03',
    label: 'Infrastructure',
    title: 'Build for the wider economy.',
    text: 'The longer-term ambition is broader business infrastructure and ecosystem partnerships — built in stages, not assumed today.',
    status: 'LONG-TERM VISION',
  },
];

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const previousOgTitle = ogTitle?.content;
    const ogDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const previousOgDescription = ogDescription?.content;
    const twitterTitle = document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
    const previousTwitterTitle = twitterTitle?.content;
    const twitterDescription = document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
    const previousTwitterDescription = twitterDescription?.content;
    const pageDescription = 'Why KUMO is being built: clear financial visibility and better business decisions for independent township businesses in South Africa.';
    document.title = 'About KUMO — Commerce built around the whole business';
    if (description) description.content = pageDescription;
    if (ogTitle) ogTitle.content = document.title;
    if (ogDescription) ogDescription.content = pageDescription;
    if (twitterTitle) twitterTitle.content = document.title;
    if (twitterDescription) twitterDescription.content = pageDescription;
    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
      if (ogTitle && previousOgTitle !== undefined) ogTitle.content = previousOgTitle;
      if (ogDescription && previousOgDescription !== undefined) ogDescription.content = previousOgDescription;
      if (twitterTitle && previousTwitterTitle !== undefined) twitterTitle.content = previousTwitterTitle;
      if (twitterDescription && previousTwitterDescription !== undefined) twitterDescription.content = previousTwitterDescription;
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="about-page">
      <a className="about-skip" href="#about-main">Skip to content</a>
      <header className="about-header">
        <a className="about-brand" href="/" aria-label="KUMO home" data-testid="link-about-home"><img src={logo} alt="KUMO — Know your numbers. Grow your hustle." /></a>
        <nav className={`about-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="/#platform" onClick={closeMenu} data-testid="link-about-nav-platform">Platform</a>
          <a href="/#how-it-works" onClick={closeMenu} data-testid="link-about-nav-how-it-works">How it works</a>
          <a href="/#for-sellers" onClick={closeMenu} data-testid="link-about-nav-for-sellers">For sellers</a>
          <a href="/about" aria-current="page" onClick={closeMenu} data-testid="link-about-nav-about">About</a>
          <a className="about-nav-cta" href="/register" onClick={closeMenu} data-testid="link-about-register">Create your account <ArrowUpRight size={14} /></a>
        </nav>
        <button className="about-menu" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} data-testid="button-about-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <div id="about-main">
        <section className="about-hero">
          <div className="about-hero-grid" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="about-hero-inner">
            <p className="about-eyebrow"><span /> OUR POINT OF VIEW / SOUTH AFRICA</p>
            <h1>Commerce is more<br />than a <em>transaction.</em></h1>
            <p className="about-lede">KUMO is being built for the independent businesses that keep township economies moving — so owners can move from recording what happened to understanding what to do next.</p>
        <a className="about-scroll" href="#why-kumo" data-testid="link-about-story">THE STORY <ArrowDown size={14} /></a>
          </div>
          <div className="about-hero-note"><span>BUILT AROUND</span><strong>The whole business.</strong><small>Not just the sale.</small></div>
          <div className="about-hero-foot"><span>KUMO COMMERCE</span><span>KNOW YOUR NUMBERS. GROW YOUR HUSTLE.</span><span>01 — 05</span></div>
        </section>

        <section className="about-why" id="why-kumo">
          <div className="about-section-head">
            <p className="about-index">01 <span>WHY KUMO</span></p>
            <div className="about-why-copy">
              <p className="about-eyebrow about-eyebrow-dark">THE GAP IS IN THE CONTEXT</p>
              <h2>A sale tells you<br />what happened.<br /><em>Not what it means.</em></h2>
              <p className="about-body">A till can record a transaction. A notebook can track a cost. But owners still need a clear way to connect sales, stock, expenses and the rhythms of their trade — and make a sound decision from the picture.</p>
              <p className="about-body">That is the space KUMO is here to work on: financial visibility with the operational context that gives the numbers meaning.</p>
            </div>
          </div>
          <div className="about-principles">
            <div className="about-principle"><span>01 / VISIBILITY</span><h3>See the real picture.</h3><p>Bring the important business numbers into view, beyond a daily sales total.</p></div>
            <div className="about-principle"><span>02 / CONTEXT</span><h3>Make it relevant.</h3><p>Connect financial signals to the stock, costs and working patterns behind them.</p></div>
            <div className="about-principle"><span>03 / DECISIONS</span><h3>Choose the next move.</h3><p>Use a clearer view to spot what deserves attention and act with more confidence.</p></div>
          </div>
          <div className="about-mantra"><span>RECORD</span><b>→</b><span>UNDERSTAND</span><b>→</b><span>IMPROVE</span><b>→</b><span className="is-last">GROW</span></div>
        </section>

        <section className="about-businesses">
          <div className="about-business-title">
            <p className="about-index">02 <span>WHO IT'S FOR</span></p>
            <div><p className="about-eyebrow about-eyebrow-dark">INDEPENDENT BY DESIGN</p><h2>Different trades.<br /><em>One clear need.</em></h2></div>
            <p className="about-body">A township business is never one-size-fits-all. KUMO’s ambition is to meet each kind of work on its own terms, with tools shaped around how the business actually runs.</p>
          </div>
          <div className="about-sector-board">
            <div className="about-sector-top"><span>THE BUSINESSES IN THE PICTURE</span><span>01—07</span></div>
            <div className="about-sector-list">
              {sectors.map((sector, index) => <div className="about-sector" key={sector}><span>0{index + 1}</span><strong>{sector}</strong><ArrowUpRight size={15} aria-hidden="true" /></div>)}
            </div>
            <p className="about-sector-foot">A starting point for industry relevance — not a limit on who can build.</p>
          </div>
        </section>

        <section className="about-field">
          <div className="about-field-top">
            <p className="about-index">03 <span>HOW WE MEET THE MARKET</span></p>
            <p className="about-eyebrow">PEOPLE FIRST. WHERE THEY ARE.</p>
          </div>
          <h2>Good software starts<br />by <em>showing up.</em></h2>
          <p className="about-field-intro">The route into township commerce should feel practical and familiar. KUMO’s intended approach pairs direct, in-person onboarding with the channels and relationships business owners already use.</p>
          <div className="about-channel-layout">
            <div className="about-channel-feature">
              <span className="about-channel-number">01 / IN PERSON</span>
              <div className="about-field-mark" aria-hidden="true"><span className="mark-roof" /><span className="mark-body" /><span className="mark-door" /></div>
              <h3>Start on the ground.</h3>
              <p>Direct onboarding in selected township areas can help make the first steps clear, personal and rooted in the realities of the shop.</p>
            </div>
            <div className="about-channels">
              <article><span>02</span><div><h3>Social & WhatsApp</h3><p>Share useful guidance through TikTok, Facebook and WhatsApp — familiar places for discovery and conversation.</p></div><ArrowUpRight size={15} /></article>
              <article><span>03</span><div><h3>Community referrals</h3><p>Let business owners introduce KUMO to other owners when it earns a place in their working lives.</p></div><ArrowUpRight size={15} /></article>
              <article><span>04</span><div><h3>Local partnerships</h3><p>Build relationships with business networks, suppliers and associations who understand the market.</p></div><ArrowUpRight size={15} /></article>
            </div>
          </div>
          <p className="about-intent-note">These are the channels KUMO intends to build through — not a claim of established reach or results.</p>
        </section>

        <section className="about-roadmap">
          <div className="about-roadmap-head">
            <p className="about-index">04 <span>THE ROAD AHEAD</span></p>
            <div><p className="about-eyebrow">A STAGED BUILD, NOT A PROMISE OF TODAY</p><h2>Earn the next<br /><em>chapter.</em></h2></div>
            <p className="about-roadmap-aside">KUMO’s direction is to start with useful software, learn from the work, then expand carefully. The later stages below are a vision, not a description of current features.</p>
          </div>
          <div className="about-phase-line" aria-hidden="true"><i /><i /><i /></div>
          <div className="about-phases">
            {phases.map((phase) => <article className="about-phase" key={phase.number}>
              <div className="about-phase-meta"><span>{phase.number} / {phase.label}</span><span>{phase.status}</span></div>
              <h3>{phase.title}</h3><p>{phase.text}</p>
            </article>)}
          </div>
          <div className="about-vision">
            <span className="about-vision-label">LONG-TERM VISION</span>
            <p>From software, toward business intelligence and — one day — broader infrastructure for township commerce.</p>
            <small>Payment hardware and expanded infrastructure are future vision, not existing KUMO products.</small>
          </div>
        </section>

        <section className="about-close">
          <div className="about-close-orbit" aria-hidden="true" />
          <p className="about-eyebrow">A CLEARER VIEW CHANGES THE NEXT MOVE</p>
          <h2>Know the numbers.<br /><em>Know where to go.</em></h2>
          <p>KUMO is building toward a more informed way to run an independent business. The work starts with understanding what is already there.</p>
          <a href="/register" className="about-close-link" data-testid="link-about-cta">Explore KUMO <ArrowRight size={16} /></a>
        </section>
      </div>
    </main>
  );

}
