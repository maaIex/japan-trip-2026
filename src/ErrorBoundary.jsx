import { Component } from "react";

// ─── ErrorBoundary ───────────────────────────────────────────────────
// Filet de securite React : si un composant plante (donnee malformee,
// bug non prevu), au lieu d'un ecran blanc catastrophique on affiche
// un fallback lisible avec un bouton "Recharger".
//
// Les donnees locales (reservations, notes, items faits) restent
// sauvegardees dans localStorage et sont restaurees au rechargement.
//
// En voyage sans support technique, ce filet peut litteralement
// sauver la journee.

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console so it remains debuggable even without external tooling.
    console.error("[ErrorBoundary]", error, info);
  }

  handleReload = () => {
    // Hard reload: bypass the memory cache so a new deploy is picked up
    // in case the crash was caused by stale code.
    window.location.reload();
  };

  handleReset = () => {
    // Last-resort: clear localStorage if the error keeps recurring because
    // of corrupted saved state. The user is warned before we do this.
    if (window.confirm(
      "Reinitialiser les donnees locales (reservations, items cochés, notes) ?\n\n" +
      "Ceci supprime uniquement les donnees sauvegardees dans ce navigateur. " +
      "L'itineraire lui-meme n'est pas affecte."
    )) {
      try {
        // Preserve only the dark-mode preference, reset everything else.
        const dark = localStorage.getItem("japan-dark");
        localStorage.clear();
        if (dark != null) localStorage.setItem("japan-dark", dark);
      } catch {}
      window.location.reload();
    }
  };

  render() {
    if (!this.state.error) return this.props.children;

    const msg = String(this.state.error?.message || this.state.error || "Erreur inconnue");

    return (
      <div style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        boxSizing: "border-box",
        background: "linear-gradient(135deg, #7B0000 0%, #B0000A 60%, #CC2020 100%)",
        color: "white",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
        textAlign: "center",
      }}>
        <div style={{ maxWidth: "420px", width: "100%" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "0.75rem" }}>😵</div>
          <h1 style={{ fontSize: "1.35rem", margin: "0 0 0.75rem", fontWeight: 600 }}>
            Oups, quelque chose a plante
          </h1>
          <p style={{ fontSize: "0.9rem", lineHeight: 1.5, opacity: 0.92, margin: "0 0 1rem" }}>
            L'application a rencontre une erreur inattendue. Vos donnees
            (reservations, items coches) sont sauvegardees, rien n'est perdu.
            Essayez de recharger.
          </p>

          <details style={{
            margin: "0 0 1.25rem",
            background: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
            padding: "0.6rem 0.8rem",
            textAlign: "left",
            fontSize: "0.72rem",
            opacity: 0.85,
          }}>
            <summary style={{ cursor: "pointer", fontWeight: 600 }}>Details technique</summary>
            <div style={{
              marginTop: "0.5rem",
              fontFamily: "monospace",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
              maxHeight: "8rem",
              overflowY: "auto",
            }}>{msg}</div>
          </details>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <button
              onClick={this.handleReload}
              style={{
                background: "white",
                color: "#7B0000",
                border: "none",
                borderRadius: "10px",
                padding: "0.85rem 1.25rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              🔄 Recharger l'application
            </button>
            <button
              onClick={this.handleReset}
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "10px",
                padding: "0.7rem 1.25rem",
                fontSize: "0.82rem",
                fontFamily: "inherit",
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              Reinitialiser les donnees locales
            </button>
          </div>
        </div>
      </div>
    );
  }
}
