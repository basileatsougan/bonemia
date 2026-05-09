import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

// ---- Gravatar helper ----
const getGravatarUrl = (email, size = 80) => {
  const clean = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    const char = clean.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  // Utilise l'API DiceBear comme fallback universel (pas besoin de MD5)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clean)}&size=${size}`;
};

// ---- Simulation auth (à remplacer par vrai context/store) ----
const mockUser = {
  email: "kofi.atta@gmail.com",
  firstName: "Kofi",
  lastName: "Atta",
};
const IS_LOGGED_IN = false; 

const Navbar = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const prefix = `/${lang || "fr"}`;

  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);

  // Handle "Comment ça marche" link click
  const handleHowItWorks = (e) => {
    e.preventDefault();
    const isHome = location.pathname === `/${lang || "fr"}` || location.pathname === `/${lang || "fr"}/`;
    
    if (isHome) {
      // On est sur la page d'accueil, scroll vers la section
      const element = document.getElementById("comment-ca-marche");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // On est sur une autre page, naviguer vers l'accueil avec l'ancre
      navigate(`/${lang || "fr"}/#comment-ca-marche`);
    }
  };

  // Hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 0) setVisible(true);
      else if (currentY < lastScrollY.current) setVisible(true);
      else if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false);
        setMenuOpen(false);
        setProfileOpen(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle hash navigation after initial load
  useEffect(() => {
    if (location.hash === "#comment-ca-marche") {
      const element = document.getElementById("comment-ca-marche");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  const handleLogoutConfirm = () => {
    // TODO: appel API logout + clear token
    setLogoutModal(false);
    setProfileOpen(false);
  };

  return (
    <>
      <header className={`navbar-header${visible ? "" : " navbar-header--hidden"}`}>
        <nav className="navbar-inner container">

          <Link to={prefix} className="navbar-logo">
            <img src="/bonemialogo.png" alt="Bonemia" className="navbar-logo__img" />
          </Link>

          <ul className="navbar-links">
            <li>
              <Link to={`${prefix}/abonnements`} className="navbar-link">
                {t("navbar.abonnements")}
              </Link>
            </li>
            <li>
              <a href="#comment-ca-marche" className="navbar-link" onClick={handleHowItWorks}>
                {t("navbar.comment_ca_marche")}
              </a>
            </li>
            <li>
              <Link to={`${prefix}/aide`} className="navbar-link">
                {t("navbar.aide_faq")}
              </Link>
            </li>
          </ul>

          <div className="navbar-actions">
            {IS_LOGGED_IN ? (
              <div className="navbar-profile" ref={profileRef}>
                <button
                  className="navbar-profile__btn"
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-label="Mon profil"
                >
                  <img
                    src={getGravatarUrl(mockUser.email)}
                    alt={mockUser.firstName}
                    className="navbar-profile__avatar"
                  />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="navbar-profile__dropdown">
                    <div className="navbar-profile__header">
                      <img
                        src={getGravatarUrl(mockUser.email)}
                        alt={mockUser.firstName}
                        className="navbar-profile__avatar-lg"
                      />
                      <div className="navbar-profile__info">
                        <span className="navbar-profile__name">
                          {mockUser.firstName} {mockUser.lastName}
                        </span>
                        <span className="navbar-profile__email">{mockUser.email}</span>
                      </div>
                    </div>
                    <div className="navbar-profile__divider" />
                    <button
                      className="navbar-profile__logout"
                      onClick={() => { setLogoutModal(true); setProfileOpen(false); }}
                    >
                      {t("navbar.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to={`${prefix}/auth/login`} className="navbar-btn-connexion">
                  {t("navbar.connexion")}
                </Link>
                <Link to={`${prefix}/auth/register`} className="navbar-btn-register btn-primary">
                  {t("navbar.creer_compte")}
                </Link>
              </>
            )}
          </div>

          <button
            className={`navbar-burger${menuOpen ? " navbar-burger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="navbar-burger__line" />
            <span className="navbar-burger__line" />
            <span className="navbar-burger__line" />
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={`navbar-mobile${menuOpen ? " navbar-mobile--open" : ""}`}>
          <ul className="navbar-mobile__links">
            <li>
              <Link to={`${prefix}/abonnements`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>
                {t("navbar.abonnements")}
              </Link>
            </li>
            <li>
              <a 
                href="#comment-ca-marche" 
                className="navbar-mobile__link" 
                onClick={(e) => { 
                  handleHowItWorks(e); 
                  setMenuOpen(false); 
                }}
              >
                {t("navbar.comment_ca_marche")}
              </a>
            </li>
            <li>
              <Link to={`${prefix}/aide`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>
                {t("navbar.aide_faq")}
              </Link>
            </li>
          </ul>
          <div className="navbar-mobile__actions">
            {IS_LOGGED_IN ? (
              <div className="navbar-mobile__profile">
                <img
                  src={getGravatarUrl(mockUser.email)}
                  alt={mockUser.firstName}
                  className="navbar-profile__avatar-lg"
                />
                <div className="navbar-profile__info">
                  <span className="navbar-profile__name">{mockUser.firstName} {mockUser.lastName}</span>
                  <span className="navbar-profile__email">{mockUser.email}</span>
                </div>
                <button
                  className="navbar-mobile__logout"
                  onClick={() => { setLogoutModal(true); setMenuOpen(false); }}
                >
                  {t("navbar.logout")}
                </button>
              </div>
            ) : (
              <>
                <Link to={`${prefix}/auth/login`} className="btn-outline" onClick={() => setMenuOpen(false)}>
                  {t("navbar.connexion")}
                </Link>
                <Link to={`${prefix}/auth/register`} className="btn-primary" onClick={() => setMenuOpen(false)}>
                  {t("navbar.creer_compte")}
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Modal déconnexion */}
      {logoutModal && (
        <div className="navbar-modal__overlay" onClick={() => setLogoutModal(false)}>
          <div className="navbar-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="navbar-modal__title">{t("navbar.logout_title")}</h3>
            <p className="navbar-modal__text">{t("navbar.logout_text")}</p>
            <div className="navbar-modal__actions">
              <button className="navbar-modal__cancel" onClick={() => setLogoutModal(false)}>
                {t("navbar.logout_cancel")}
              </button>
              <button className="navbar-modal__confirm" onClick={handleLogoutConfirm}>
                {t("navbar.logout_confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;