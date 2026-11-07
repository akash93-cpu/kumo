import { ArrowRight, Menu, X, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "../assets/kumo-logo.png";
import "../styles/landing-page-style.css";

export default function NavigationBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const navItems = [
        { href: "#about", label: "About" },
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
    ];

    const closeMenu = () => {
        setMenuOpen(false);
    };
const userMenuRef = useRef(null);

useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            userMenuRef.current &&
            !userMenuRef.current.contains(event.target)
        ) {
            setUserOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    return (
        <header className="site-header">
            {/* Logo */}
            <a
                className="brand"
                href="/"
                aria-label="KUMO home"
                data-testid="link-home"
                onClick={closeMenu}
            >
                <img
                    src={logo}
                    alt="KUMO — Know your numbers. Grow your hustle."
                />
            </a>

            {/* Desktop / Mobile Navigation */}
            <nav
                className={`desktop-nav ${menuOpen ? "is-open" : ""}`}
                aria-label="Main navigation"
            >
                {navItems.map((item) => (
                    <a
                        key={item.href}
                        href={item.href}
                        onClick={closeMenu}
                    >
                        {item.label}
                    </a>
                ))}

                <div ref={userMenuRef} className={`user-menu ${userOpen ? "is-open" : ""}`}>

                    <button
                        type="button"
                        className="nav-login"
                        onClick={() => setUserOpen(!userOpen)}
                        aria-label="Account menu"
                        aria-expanded={userOpen}
                    >
                        <User size={22} />
                    </button>

                    {userOpen && (
                        <div className="user-menu-dropdown">
                            <a href="#signin" onClick={closeMenu}>
                                Sign In
                            </a>
                            <a href="/register" onClick={closeMenu}>
                                Register
                            </a>
                        </div>
                    )}
                </div>

                <a
                    className="button button-gold nav-cta"
                    href="#start"
                    onClick={closeMenu}
                >
                    Get early access
                    <ArrowRight size={15} />
                </a>
            </nav>

            {/* Mobile menu button */}
            <button
                className="mobile-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                data-testid="button-menu"
            >
                {menuOpen ? <X /> : <Menu />}
            </button>
        </header>
    );
}
