import { ArrowRight, Menu, X, User, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import logo from "../assets/kumo-logo.png";
import LoginModal from "./LoginModal";
import CreateStoreModal from "./CreateStoreModal";
import ViewStoreModal from "./ViewStore";
import "../styles/landing-page-style.css";

export default function NavigationBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [userName, setUserName] = useState(null); // null = not logged in
    const [storeOpen, setStoreOpen] = useState(false);
    const [storeModalOpen, setStoreModalOpen] = useState(false);
    const userMenuRef = useRef(null);
    const [viewStoreOpen, setViewStoreOpen] = useState(false);

    const navItems = [
        { href: "/about", label: "About" },
        { href: "#features", label: "Features" },
        { href: "#pricing", label: "Pricing" },
    ];
    const closeUserMenu = () => {
        setUserOpen(false);
        setStoreOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                closeUserMenu();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const closeMenu = () => setMenuOpen(false);
    const baseUrl = 'http://localhost:8080';
    // Fetch the logged-in user's name from GET /user-name
    const fetchUserName = useCallback(async () => {
        try {
            const res = await fetch(`${baseUrl}/user-name`, {
                credentials: "include",
                headers: { Accept: "application/json, text/plain" },
            });

            const contentType = res.headers.get("content-type") || "";
            if (!res.ok || contentType.includes("text/html")) {
                throw new Error("Not authenticated");
            }

            const name = (await res.text()).trim();
            if (!name || name.startsWith("<")) throw new Error("Invalid response");

            setUserName(name);
        } catch {
            setUserName(null);
        }
    }, []);

    // Check on first load (so a refresh keeps the user "logged in" in the UI)
    useEffect(() => {
        fetchUserName();
    }, [fetchUserName]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch(`${baseUrl}/logout`, {
                method: "DELETE",
                credentials: "include",
            });
        } finally {
            setUserName(null);
            setUserOpen(false);
            closeMenu();
        }
    };
    const firstName = userName ? userName.split(" ")[0] : "";

    return (
        <header className="site-header">
            <a className="brand" href="/" aria-label="KUMO home" data-testid="link-home" onClick={closeMenu}>
                <img src={logo} alt="KUMO — Know your numbers. Grow your hustle." />
            </a>

            <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
                {navItems.map((item) => (
                    <a key={item.href} href={item.href} onClick={closeMenu}>
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
                        aria-haspopup="menu"
                    >
                        {userName ? (
                            <span className="user-greeting">
                                Hi, {firstName}
                                <ChevronDown size={14} className="user-chevron" />
                            </span>
                        ) : (
                            <User size={22} />
                        )}
                    </button>

                    {userOpen && (
                        <div className="user-menu-dropdown" role="menu">
                            {userName ? (
                                <>
                                    <div className={`user-submenu ${storeOpen ? "is-open" : ""}`}>
                                        <button
                                            type="button"
                                            role="menuitem"
                                            className="user-menu-item user-submenu-toggle"
                                            aria-haspopup="menu"
                                            aria-expanded={storeOpen}
                                            onClick={() => setStoreOpen(!storeOpen)}
                                        >
                                            Manage store
                                            <ChevronDown size={14} className="submenu-chevron" />
                                        </button>

                                        {storeOpen && (
                                            <div className="user-submenu-list" role="menu">
                                                <a
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        closeUserMenu();
                                                        closeMenu();
                                                        setStoreModalOpen(true);
                                                    }}
                                                >
                                                    Add Store
                                                </a>
                                                <a
                                                    type="button"
                                                    role="menuitem"
                                                    onClick={() => {
                                                        closeUserMenu();
                                                        closeMenu();
                                                        setViewStoreOpen(true);
                                                    }}

                                                >
                                                    View Store/Products
                                                </a>
                                            </div>
                                        )}
                                    </div> <a href="/products" role="menuitem" onClick={() => { setUserOpen(false); closeMenu(); }}>
                                        {"+"} Add products
                                    </a>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="user-menu-item user-menu-logout"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="user-menu-item"
                                        onClick={() => {
                                            setUserOpen(false);
                                            closeMenu();
                                            setLoginOpen(true);
                                        }}
                                    >
                                        Sign In
                                    </button>
                                    <a href="/register" onClick={closeMenu}>
                                        Register
                                    </a>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <a className="button button-gold nav-cta" href="#start" onClick={closeMenu}>
                    Get early access
                    <ArrowRight size={15} />
                </a>
            </nav>

            <button
                className="mobile-menu"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                data-testid="button-menu"
            >
                {menuOpen ? <X /> : <Menu />}
            </button>

            <LoginModal
                open={loginOpen}
                onOpenChange={setLoginOpen}
                onSuccess={() => {
                    setLoginOpen(false);
                    fetchUserName(); // refresh the name right after login
                }}
            />
            <CreateStoreModal
                open={storeModalOpen}
                onOpenChange={setStoreModalOpen}
                onSuccess={(store) => {
                    console.log("Store created", store);
                }}
            />
            <ViewStoreModal
                open={viewStoreOpen}
                onOpenChange={setViewStoreOpen}
            />
        </header>
    );
}