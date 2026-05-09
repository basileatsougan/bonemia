import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Aide.css";

const FAQ_CATEGORIES = [
  {
    id: "general",
    icon: null,
    labelKey: "aide.cat_general",
    items: [
      { q: "aide.q_what_is_bonemia", a: "aide.a_what_is_bonemia" },
      { q: "aide.q_how_safe",        a: "aide.a_how_safe" },
      { q: "aide.q_who_can_join",    a: "aide.a_who_can_join" },
    ],
  },
  {
    id: "abonnements",
    icon: null,
    labelKey: "aide.cat_abonnements",
    items: [
      { q: "aide.q_which_services",  a: "aide.a_which_services" },
      { q: "aide.q_how_to_access",   a: "aide.a_how_to_access" },
      { q: "aide.q_cancel_anytime",  a: "aide.a_cancel_anytime" },
      { q: "aide.q_share_account",   a: "aide.a_share_account" },
    ],
  },
  {
    id: "paiement",
    icon: null,
    labelKey: "aide.cat_paiement",
    items: [
      { q: "aide.q_payment_methods", a: "aide.a_payment_methods" },
      { q: "aide.q_refund",          a: "aide.a_refund" },
      { q: "aide.q_billing_cycle",   a: "aide.a_billing_cycle" },
    ],
  },
  {
    id: "compte",
    icon: null,
    labelKey: "aide.cat_compte",
    items: [
      { q: "aide.q_change_password", a: "aide.a_change_password" },
      { q: "aide.q_delete_account",  a: "aide.a_delete_account" },
      { q: "aide.q_multiple_devices",a: "aide.a_multiple_devices" },
    ],
  },
];

const Aide = () => {
  const { t } = useTranslation();

  const [activeCategory, setActiveCategory] = useState("general");
  const [openItem, setOpenItem]             = useState(null);

  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleContactSubmit = async () => {
    if (!message.trim() || !email.trim()) return;
    setSending(true);
    // TODO: appel API réel
    await new Promise((r) => setTimeout(r, 1800));
    setSending(false);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setName(""); setEmail(""); setMessage("");
    }, 3000);
  };

  const activeSection = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <main className="faq-page">

      {/* Hero */}
      <section className="faq-hero">
        <div className="container">
          <p className="faq-hero__eyebrow">{t("aide.hero_eyebrow")}</p>
          <h1 className="faq-hero__title">{t("aide.hero_title")}</h1>
          <p className="faq-hero__sub">{t("aide.hero_sub")}</p>
        </div>
      </section>

      {/* Body */}
      <section className="faq-body">
        <div className="container">
          <div className="faq-layout">

            {/* Sidebar */}
            <nav className="faq-sidebar">
              <span className="faq-sidebar__title">{t("aide.sidebar_title")}</span>
              {FAQ_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`faq-cat-btn ${activeCategory === cat.id ? "faq-cat-btn--active" : ""}`}
                  onClick={() => { setActiveCategory(cat.id); setOpenItem(null); }}
                >
                  
                  {t(cat.labelKey)}
                </button>
              ))}
            </nav>

            {/* Accordéon */}
            <div className="faq-content">
              {activeSection && (
                <div className="faq-section">
                  <div className="faq-section__head">
                    
                    <h2 className="faq-section__title">{t(activeSection.labelKey)}</h2>
                  </div>

                  {activeSection.items.map((item, idx) => {
                    const isOpen = openItem === `${activeCategory}-${idx}`;
                    return (
                      <div
                        key={idx}
                        className={`faq-item ${isOpen ? "faq-item--open" : ""}`}
                      >
                        <button
                          className="faq-item__trigger"
                          onClick={() => setOpenItem(isOpen ? null : `${activeCategory}-${idx}`)}
                          aria-expanded={isOpen}
                        >
                          <span className="faq-item__question">{t(item.q)}</span>
                          <span className="faq-item__chevron">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </span>
                        </button>
                        <div className="faq-item__body">
                          <div className="faq-item__inner">
                            <p className="faq-item__answer">{t(item.a)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Formulaire de contact */}
              <div className="faq-contact">
                <p className="faq-contact__eyebrow">{t("aide.contact_eyebrow")}</p>
                <h3 className="faq-contact__title">{t("aide.contact_title")}</h3>
                <p className="faq-contact__sub">{t("aide.contact_sub")}</p>

                {sent ? (
                  <div className="faq-contact__sent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {t("aide.contact_sent")}
                  </div>
                ) : (
                  <div className="faq-contact__form">
                    <div className="faq-contact__row">
                      <div className="faq-contact__field">
                        <label className="faq-contact__label">{t("aide.contact_name")}</label>
                        <input
                          className="faq-contact__input"
                          type="text"
                          placeholder={t("aide.contact_ph_name")}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={sending}
                        />
                      </div>
                      <div className="faq-contact__field">
                        <label className="faq-contact__label">{t("aide.contact_email")}</label>
                        <input
                          className="faq-contact__input"
                          type="email"
                          placeholder={t("aide.contact_ph_email")}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={sending}
                        />
                      </div>
                    </div>
                    <div className="faq-contact__field">
                      <label className="faq-contact__label">{t("aide.contact_message")}</label>
                      <textarea
                        className="faq-contact__textarea"
                        placeholder={t("aide.contact_ph_message")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        disabled={sending}
                      />
                    </div>
                    <button
                      className="faq-contact__submit"
                      onClick={handleContactSubmit}
                      disabled={sending || !message.trim() || !email.trim()}
                    >
                      {sending ? <span className="faq-spinner" /> : t("aide.contact_submit")}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Aide;