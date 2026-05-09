import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Navbar.css";

const Navbar = () => {
  const { t } = useTranslation();
  const { lang } = useParams();
  const prefix = `/${lang || "fr"}`;

  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 0) {
        setVisible(true);
      } else if (currentY < lastScrollY.current) {
        setVisible(true);
      } else if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false);
        setMenuOpen(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
            <Link to={`${prefix}/comment-ca-marche`} className="navbar-link">
              {t("navbar.comment_ca_marche")}
            </Link>
          </li>
          <li>
            <Link to={`${prefix}/aide`} className="navbar-link">
              {t("navbar.aide_faq")}
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          <Link to={`${prefix}/login`} className="navbar-btn-connexion">
            {t("navbar.connexion")}
          </Link>
          <Link to={`${prefix}/register`} className="navbar-btn-register btn-primary">
            {t("navbar.creer_compte")}
          </Link>
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

      <div className={`navbar-mobile${menuOpen ? " navbar-mobile--open" : ""}`}>
        <ul className="navbar-mobile__links">
          <li>
            <Link to={`${prefix}/abonnements`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>
              {t("navbar.abonnements")}
            </Link>
          </li>
          <li>
            <Link to={`${prefix}/comment-ca-marche`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>
              {t("navbar.comment_ca_marche")}
            </Link>
          </li>
          <li>
            <Link to={`${prefix}/aide`} className="navbar-mobile__link" onClick={() => setMenuOpen(false)}>
              {t("navbar.aide_faq")}
            </Link>
          </li>
        </ul>
        <div className="navbar-mobile__actions">
          <Link to={`${prefix}/login`} className="btn-outline" onClick={() => setMenuOpen(false)}>
            {t("navbar.connexion")}
          </Link>
          <Link to={`${prefix}/register`} className="btn-primary" onClick={() => setMenuOpen(false)}>
            {t("navbar.creer_compte")}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;