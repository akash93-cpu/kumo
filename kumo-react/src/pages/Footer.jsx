import logo from '../assets/kumo-logo.png';
import { CircleHelp } from 'lucide-react';
export default function Footer() {

    return (
        <footer className="footer">
            <a className="footer-brand" href="#top"><img src={logo} alt="KUMO" /></a>
            <span className="footer-tagline">KNOW YOUR NUMBERS. GROW YOUR HUSTLE.</span>
            <div className="footer-links"><a href="#platform">Platform</a><a href="#how-it-works">How it works</a><a href="mailto:hello@kumo.com">Get in touch</a><a href="#start"><CircleHelp size={14} /> Help</a></div>
            <span className="copyright">© 2026 KUMO COMMERCE</span>
        </footer>
    )

}