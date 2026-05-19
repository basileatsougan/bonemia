import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../contexts/AuthContext";
import "./Navbar.css";

const getGravatarUrl = (email, size = 80) => {
  const clean = email?.trim().toLowerCase() || "user";
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clean)}&size=${size}`;
};

const Navbar = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const prefix = `/${lang || "fr"}`;

  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const lastScrollY = useRef(0);
  const profileRef = useRef(null);
  const navLinksRef = useRef(null);
  const pillRef = useRef(null);

  const isActive = (path) => {
    if (path === prefix) {
      return location.pathname === prefix || location.pathname === `${prefix}/`;
    }
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const nav = navLinksRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const activeLink = nav.querySelector(".navbar-link--active");
    if (activeLink) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      pill.style.left = `${linkRect.left - navRect.left}px`;
      pill.style.width = `${linkRect.width}px`;
      pill.style.opacity = "1";
    }
  }, [location.pathname]);

  const handleLinkMouseEnter = (e) => {
    const nav = navLinksRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = e.currentTarget.getBoundingClientRect();
    pill.style.left = `${linkRect.left - navRect.left}px`;
    pill.style.width = `${linkRect.width}px`;
  };

  const handleNavMouseLeave = () => {
    const nav = navLinksRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const activeLink = nav.querySelector(".navbar-link--active");
    if (activeLink) {
      const navRect = nav.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      pill.style.left = `${linkRect.left - navRect.left}px`;
      pill.style.width = `${linkRect.width}px`;
      pill.style.opacity = "1";
    } else {
      pill.style.opacity = "0";
    }
  };

  const handleHowItWorks = (e) => {
    e.preventDefault();
    const isHome = location.pathname === `/${lang || "fr"}` || location.pathname === `/${lang || "fr"}/`;
    if (isHome) {
      const element = document.getElementById("comment-ca-marche");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/${lang || "fr"}/#comment-ca-marche`);
    }
  };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    logout();
    setLogoutModal(false);
    setProfileOpen(false);
    navigate(`/${lang || "fr"}`);
  };

  const firstName = user?.name?.split(" ")[0] || user?.email?.split("@")[0] || "Utilisateur";
  const lastName = user?.name?.split(" ")[1] || "";
  const userEmail = user?.email || "";

  return (
    <>
      <header className={`navbar-header${visible ? "" : " navbar-header--hidden"}`}>
        <nav className="navbar-inner container">
          <Link to={prefix} className="navbar-logo">
            <img src="/bonemialogo.png" alt="Bonemia" className="navbar-logo__img" />
          </Link>
          <ul className="navbar-links" ref={navLinksRef} onMouseLeave={handleNavMouseLeave}>
            <div className="navbar-links__pill" ref={pillRef} aria-hidden="true" />
            <li>
              <Link to={`${prefix}/abonnements`} className={`navbar-link${isActive(`${prefix}/abonnements`) ? " navbar-link--active" : ""}`} onMouseEnter={handleLinkMouseEnter}>
                {t("navbar.abonnements")}
              </Link>
            </li>
            <li>
              <a href="#comment-ca-marche" className="navbar-link" onClick={handleHowItWorks} onMouseEnter={handleLinkMouseEnter}>
                {t("navbar.comment_ca_marche")}
              </a>
            </li>
            <li>
              <Link to={`${prefix}/aide`} className={`navbar-link${isActive(`${prefix}/aide`) ? " navbar-link--active" : ""}`} onMouseEnter={handleLinkMouseEnter}>
                {t("navbar.aide_faq")}
              </Link>
            </li>
          </ul>
          <div className="navbar-actions">
            {isAuthenticated ? (
              <div className="navbar-profile" ref={profileRef}>
                <button className="navbar-profile__btn" onClick={() => setProfileOpen(!profileOpen)} aria-label="Mon profil">
                  <img src={getGravatarUrl(userEmail)} alt={firstName} className="navbar-profile__avatar" />
                </button>
                {profileOpen && (
                  <div className="navbar-profile__dropdown">
                    <div className="navbar-profile__header">
                      <img src={getGravatarUrl(userEmail)} alt={firstName} className="navbar-profile__avatar-lg" />
                      <div className="navbar-profile__info">
                        <span className="navbar-profile__name">{firstName} {lastName}</span>
                        <span className="navbar-profile__email">{userEmail}</span>
                      </div>
                    </div>
                    <div className="navbar-profile__divider" />
                    <button className="navbar-profile__logout" onClick={() => { setLogoutModal(true); setProfileOpen(false); }}>
                      {t("navbar.logout")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to={`${prefix}/auth/login`} className="navbar-btn-connexion">{t("navbar.connexion")}</Link>
                <Link to={`${prefix}/auth/register`} className="navbar-btn-register btn-primary">{t("navbar.creer_compte")}</Link>
              </>
            )}
          </div>
          <button className={`navbar-burger${menuOpen ? " navbar-burger--open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <span className="navbar-burger__line" />
            <span className="navbar-burger__line" />
            <span className="navbar-burger__line" />
          </button>
        </nav>
        <div className={`navbar-mobile${menuOpen ? " navbar-mobile--open" : ""}`}>
          <ul className="navbar-mobile__links">
            <li><Link to={`${prefix}/abonnements`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>{t("navbar.abonnements")}</Link></li>
            <li><a href="#comment-ca-marche" className="navbar-mobile__link" onClick={(e) => { handleHowItWorks(e); setMenuOpen(false); }}>{t("navbar.comment_ca_marche")}</a></li>
            <li><Link to={`${prefix}/aide`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>{t("navbar.aide_faq")}</Link></li>
          </ul>
          <div className="navbar-mobile__actions">
            {isAuthenticated ? (
              <div className="navbar-mobile__profile">
                <img src={getGravatarUrl(userEmail)} alt={firstName} className="navbar-profile__avatar-lg" />
                <div className="navbar-profile__info">
                  <span className="navbar-profile__name">{firstName} {lastName}</span>
                  <span className="navbar-profile__email">{userEmail}</span>
                </div>
                <button className="navbar-mobile__logout" onClick={() => { setLogoutModal(true); setMenuOpen(false); }}>{t("navbar.logout")}</button>
              </div>
            ) : (
              <>
                <Link to={`${prefix}/auth/login`} className="btn-outline" onClick={() => setMenuOpen(false)}>{t("navbar.connexion")}</Link>
                <Link to={`${prefix}/auth/register`} className="btn-primary" onClick={() => setMenuOpen(false)}>{t("navbar.creer_compte")}</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {logoutModal && (
        <div className="navbar-modal__overlay" onClick={() => setLogoutModal(false)}>
          <div className="navbar-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="navbar-modal__title">{t("navbar.logout_title")}</h3>
            <p className="navbar-modal__text">{t("navbar.logout_text")}</p>
            <div className="navbar-modal__actions">
              <button className="navbar-modal__cancel" onClick={() => setLogoutModal(false)}>{t("navbar.logout_cancel")}</button>
              <button className="navbar-modal__confirm" onClick={handleLogoutConfirm}>{t("navbar.logout_confirm")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;