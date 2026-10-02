import { useState } from 'react';
import { ArrowDown, ArrowRight, BarChart3, Check, ChevronDown, CircleHelp, Menu, MoveUpRight, Sparkles, X } from 'lucide-react';
import logo from '../src/assets/kumo-logo.png';
import '../src/styles/landing-page-style.css';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'For sellers', href: '#for-sellers' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // const submitEmail = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   if (email.trim()) setSubmitted(true);
  // };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="KUMO home" data-testid="link-home">
          <img src={logo} alt="KUMO — Know your numbers. Grow your hustle." />
        </a>
        <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          {navItems.map((item) => <a key={item.href} href={item.href} onClick={closeMenu}>{item.label}</a>)}
          <a className="nav-login" href="#start" onClick={closeMenu}>Register or Log in <MoveUpRight size={14} /></a>
          <a className="button button-gold nav-cta" href="#start" onClick={closeMenu}>Get early access <ArrowRight size={15} /></a>
        </nav>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} data-testid="button-menu">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <section className="hero banner" id="top">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> COMMERCE, MADE CLEAR</div>
            <h1>Your hustle<br />has <em>numbers.</em><br />Know them.</h1>
            <p className="hero-lede">The business behind your business, finally in focus. KUMO turns scattered store data into a clear next move.</p>
            <div className="hero-actions">
              <a href="#start" className="button button-gold">Get early access <ArrowRight size={16} /></a>
              <a href="#platform" className="text-link">See what KUMO does <ArrowDown size={15} /></a>
            </div>
            <div className="hero-proof">
              <div className="proof-avatars"><span>J</span><span>M</span><span>A</span><span>+</span></div>
              <div><strong>Made for the ones building.</strong><small>Independent sellers, first and always.</small></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="KUMO commerce analytics dashboard preview">
            <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
            <div className="dashboard-card">
              <div className="dash-top"><div className="dash-brand"><span className="dash-mark">K</span><span>Overview</span></div><span className="period">Last 30 days <ChevronDown size={13} /></span></div>
              <div className="dash-welcome"><div><span className="micro-label">YOUR STORE, AT A GLANCE</span><h3>Looking good, Maya.</h3></div><span className="status-pill"><i /> Live</span></div>
              <div className="metric-row">
                <div className="metric"><span>Net sales</span><strong>R24,680<span className="up">↑ 18.4%</span></strong><small>vs. previous 30 days</small></div>
                <div className="metric"><span>Profit margin</span><strong>32.8%<span className="up">↑ 4.2%</span></strong><small>after all your costs</small></div>
              </div>
              <div className="chart-heading"><span>Sales over time</span><strong>$24,680 <small>+18.4%</small></strong></div>
              <div className="chart">
                <div className="chart-y"><span>R8k</span><span>R6k</span><span>R4k</span><span>R2k</span></div>
                <svg viewBox="0 0 540 154" role="img" aria-label="Sales trending upward across the month" preserveAspectRatio="none">
                  <defs><linearGradient id="fillGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8b957" stopOpacity=".25" /><stop offset="100%" stopColor="#e8b957" stopOpacity="0" /></linearGradient></defs>
                  <path d="M0 118 C30 108 35 100 63 108 S96 91 117 99 S142 82 165 88 S193 62 219 76 S251 70 274 79 S303 50 330 65 S356 42 381 55 S414 31 438 46 S464 25 489 32 S517 12 540 17 V154 H0Z" fill="url(#fillGold)" />
                  <path d="M0 118 C30 108 35 100 63 108 S96 91 117 99 S142 82 165 88 S193 62 219 76 S251 70 274 79 S303 50 330 65 S356 42 381 55 S414 31 438 46 S464 25 489 32 S517 12 540 17" fill="none" stroke="#dbaa4c" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  <circle cx="540" cy="17" r="5" fill="#dbaa4c" />
                </svg>
              </div>
              <div className="chart-x"><span>May 01</span><span>May 08</span><span>May 15</span><span>May 22</span><span>May 30</span></div>
              <div className="dash-insight"><Sparkles size={15} /><span><b>A useful signal:</b> Your best-selling product has a 41% margin. There’s room to grow.</span><ArrowRight size={14} /></div>
            </div>
            <div className="floating-note"><span className="note-icon"><BarChart3 size={17} /></span><span><b>Profit, not just sales.</b><small>See the whole picture.</small></span></div>
            <div className="visual-caption">THE VIEW FROM YOUR CORNER OFFICE <span>01 / 04</span></div>
          </div>
        </div>
        <div className="hero-bottom"><span>FOR THE INDEPENDENTLY MINDED</span><div className="ticker"><span>KNOW YOUR MARGINS</span><i /> <span>FIND YOUR WINNERS</span><i /> <span>GROW ON PURPOSE</span><i /> <span>KNOW YOUR MARGINS</span></div><span>SCROLL TO EXPLORE ↓</span></div>
      </section>

      <section className="clarity banner" id="platform">
        <div className="section-label"><span>02</span><span>LESS GUESSING. MORE GROWING.</span></div>
        <div className="clarity-content">
          <div className="clarity-head">
            <p className="eyebrow dark-eyebrow">YOUR BUSINESS IS MORE THAN REVENUE</p>
            <h2>Sales are the headline.<br /><em>Profit is the story.</em></h2>
            <p className="body-copy">KUMO brings your store, costs, and momentum into one honest view. No spreadsheet archaeology. No flying blind.</p>
          </div>
          <div className="signal-board">
            <div className="signal-main">
              <div className="signal-heading"><span>THE REAL SCORE</span><span className="signal-date">MAY 01 — MAY 30</span></div>
              <div className="signal-number">$8,094 <span>net profit</span></div>
              <div className="waterfall">
                <div className="waterfall-bar sales"><span style={{height:'100%'}} /><label>Sales<strong>$24,680</strong></label></div>
                <div className="waterfall-minus">−</div>
                <div className="waterfall-bar"><span style={{height:'59%'}} /><label>Costs<strong>$10,140</strong></label></div>
                <div className="waterfall-minus">−</div>
                <div className="waterfall-bar"><span style={{height:'34%'}} /><label>Fees<strong>$2,446</strong></label></div>
                <div className="waterfall-eq">=</div>
                <div className="waterfall-bar profit"><span style={{height:'45%'}} /><label>Profit<strong>$8,094</strong></label></div>
              </div>
              <div className="signal-foot"><span><i className="tiny-gold" /> After products, shipping, and fees</span><span>Net margin <b>32.8%</b></span></div>
            </div>
            <div className="signal-side">
              <div className="side-top"><span className="side-kicker">ONE CLEAR SIGNAL</span><span className="insight-spark"><Sparkles size={16} /></span></div>
              <h3>One product is carrying your month.</h3>
              <p>The Studio Tote brings in 38% of profit, while making up only 21% of orders.</p>
              <div className="product-mini"><div className="tote-art"><span /></div><div><b>Studio Tote</b><small>Top profit driver</small></div><strong>38%</strong></div>
              <a href="#how-it-works" className="side-link">See the signal <ArrowRight size={15} /></a>
            </div>
          </div>
        </div>
        <div className="clarity-statement"><span>NO FINANCE DEGREE REQUIRED.</span><span>JUST A BETTER VIEW OF WHAT YOU’RE BUILDING.</span></div>
      </section>

      <section className="method banner" id="how-it-works">
        <div className="section-label light-label"><span>03</span><span>BUILT FOR THE WAY YOU WORK</span></div>
        <div className="method-top">
          <div><p className="eyebrow">YOUR NUMBERS, ON YOUR SIDE</p><h2>Less digging.<br /><em>More doing.</em></h2></div>
          <p className="method-intro">You didn’t start a business to spend Sunday night in spreadsheets. KUMO gets you from “what happened?” to “here’s what’s next.”</p>
        </div>
        <div className="method-steps">
          <article className="method-step">
            <div className="step-meta"><span>01 / CONNECT</span><span className="step-arrow"><ArrowRight size={17} /></span></div>
            <div className="step-illustration connect-visual"><div className="store-tile"><div className="store-bag">S</div><span>YOUR STORE</span></div><div className="connect-line"><span /></div><div className="kumo-node"><img src={logo} alt="" /></div><span className="connect-caption">A few clicks. That’s it.</span></div>
            <h3>Bring it together.</h3><p>Connect your store and let KUMO gather the numbers you already have — from sales to fees to costs.</p>
          </article>
          <article className="method-step">
            <div className="step-meta"><span>02 / UNDERSTAND</span><span className="step-arrow"><ArrowRight size={17} /></span></div>
            <div className="step-illustration pulse-visual"><div className="pulse-ring ring-a" /><div className="pulse-ring ring-b" /><div className="pulse-center"><BarChart3 size={22} /></div><div className="pulse-tag tag-margin">MARGIN <b>32.8%</b></div><div className="pulse-tag tag-orders">ORDERS <b>+18%</b></div><span className="pulse-axis">A CLEARER PICTURE, EVERY DAY</span></div>
            <h3>See what matters.</h3><p>Watch sales, margins, and product performance make sense at a glance. Your business, without the fog.</p>
          </article>
          <article className="method-step">
            <div className="step-meta"><span>03 / MAKE YOUR MOVE</span><span className="step-arrow"><ArrowRight size={17} /></span></div>
            <div className="step-illustration move-visual"><div className="move-card"><span className="move-icon"><MoveUpRight size={21} /></span><span className="move-label">NEXT BEST MOVE</span><strong>Put more behind your bestseller.</strong><small>Studio Tote · 38% of net profit</small><div className="move-progress"><i /></div><span className="move-foot">FOLLOW THE SIGNAL <ArrowRight size={12} /></span></div><div className="move-scribble">↗</div></div>
            <h3>Grow on purpose.</h3><p>Turn the numbers into decisions. Back your winners, spot a leak, and make the next move with confidence.</p>
          </article>
        </div>
        <div className="method-bottom"><span>01—03</span><div className="method-track"><i /></div><span>BUILT TO KEEP UP WITH YOU</span></div>
      </section>

      <section className="audience banner" id="for-sellers">
        <div className="section-label dark-label"><span>04</span><span>FOR THE ONES BUILDING SOMETHING</span></div>
        <div className="audience-grid">
          <div className="audience-copy">
            <p className="eyebrow dark-eyebrow">YOUR SHOP. YOUR RULES.</p>
            <h2>Big business<br />energy. <em>Your own<br />kind of hustle.</em></h2>
            <p className="body-copy">KUMO is for the people who built a real thing out of an idea — and are ready to understand where it can go.</p>
            <a href="#start" className="button button-dark">Meet your new numbers person <ArrowRight size={16} /></a>
          </div>
          <div className="audience-art">
            <div className="art-frame">
              <div className="art-topline"><span>THE INDEPENDENT INDEX</span><span>EST. RIGHT NOW</span></div>
              <div className="art-bigtype">MAKE<br /><span>YOUR</span><br />MOVE<span className="art-period">.</span></div>
              <div className="art-bottom"><span>01 — KNOW YOUR NUMBERS</span><span>02 — TRUST YOUR GUT</span><span>03 — BUILD WHAT’S NEXT</span></div>
              <div className="art-stamp"><span>INDEPENDENT<br />BY DESIGN</span></div>
              <div className="art-lines"><i /><i /><i /><i /><i /></div>
            </div>
            <div className="audience-quote"><span className="quote-mark">“</span><p>Built for your kind of ambition. Clear-eyed, independent, and always moving.</p><span>THE KUMO POINT OF VIEW</span></div>
          </div>
        </div>
        <div className="audience-numbers"><div><strong>One</strong><span>place for the whole picture</span></div><div><strong>Zero</strong><span>spreadsheet rabbit holes</span></div><div><strong>Your</strong><span>business, understood</span></div></div>
      </section>

      <section className="finale" id="start">
        <div className="finale-grid">
          <div className="finale-kicker"><span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span><span className="finale-index">K / 2025</span></div>
          <div className="finale-main">
            <div><h2>Know your<br /><em>numbers.</em><br />Grow your hustle.</h2><p>Get on the list. Be first to see what KUMO can do for your business.</p></div>
            <form className="signup-form">
              <label htmlFor="email">Your email address</label>
              <div className="signup-control"><input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@yourstore.com" required aria-label="Email address" data-testid="input-email" /><button type="submit" aria-label="Join early access" data-testid="button-join">{submitted ? <Check size={20} /> : <ArrowRight size={20} />}</button></div>
              <span className={`signup-feedback ${submitted ? 'visible' : ''}`} role="status">{submitted ? 'You’re on the list. We’ll be in touch.' : 'No noise. Just your early invite when it’s ready.'}</span>
              <div className="signup-perks"><span><Check size={13} /> First look at KUMO</span><span><Check size={13} /> Early access updates</span></div>
            </form>
          </div>
          <div className="finale-stamp">THE FUTURE<br />LOOKS CLEARER</div>
          <div className="finale-bottom"><span>GOOD THINGS GROW WITH GOOD NUMBERS.</span><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </section>
      <footer className="footer">
        <a className="footer-brand" href="#top"><img src={logo} alt="KUMO" /></a>
        <span className="footer-tagline">KNOW YOUR NUMBERS. GROW YOUR HUSTLE.</span>
        <div className="footer-links"><a href="#platform">Platform</a><a href="#how-it-works">How it works</a><a href="mailto:hello@kumo.com">Get in touch</a><a href="#start"><CircleHelp size={14} /> Help</a></div>
        <span className="copyright">© 2025 KUMO COMMERCE</span>
      </footer>
    </main>
  );
}

export default App;
