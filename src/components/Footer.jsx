import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__alliances">
        <div className="container">
          <p className="footer__alliances-label">Aliados estratégicos</p>
          <div className="footer__alliances-logos">
            <span className="footer__ally">INTA</span>
            <span className="footer__ally">SAGyP</span>
            <span className="footer__ally">CRA</span>
            <span className="footer__ally">BNA</span>
            <span className="footer__ally">MADR</span>
          </div>
        </div>
      </div>

      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <div className="footer__logo">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#1E6B27"/>
                  <path d="M8 22V14l8-6 8 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2z" fill="#fff" opacity="0.9"/>
                  <circle cx="16" cy="14" r="2" fill="#FF8000"/>
                </svg>
                <span>AgroRent</span>
              </div>
              <p className="footer__brand-desc">
                La plataforma que conecta a arrendadores y productores agrícolas de la región del NOA.
                Alquileres rápidos, transparentes y seguros.
              </p>
              <div className="footer__cta-row">
                <Link to="/arrendador" className="btn btn--primary btn--sm">Publicá tu Máquina</Link>
                <Link to="/catalogo" className="btn btn--orange btn--sm">Alquilá Ahora</Link>
              </div>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Plataforma</h4>
              <Link to="/catalogo" className="footer__link">Catálogo</Link>
              <Link to="/arrendador" className="footer__link">Publicar Máquina</Link>
              <Link className="footer__link" to="/#como-funciona">Cómo Funciona</Link>
              <Link className="footer__link" to="/#faq">Preguntas Frecuentes</Link>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Empresa</h4>
              <a className="footer__link" href="#">Sobre Nosotros</a>
              <a className="footer__link" href="#">Blog</a>
              <a className="footer__link" href="#">Trabaja con Nosotros</a>
              <a className="footer__link" href="#">Contacto</a>
            </div>

            <div className="footer__col">
              <h4 className="footer__col-title">Legal</h4>
              <a className="footer__link" href="#">Términos y Condiciones</a>
              <a className="footer__link" href="#">Política de Privacidad</a>
              <a className="footer__link" href="#">Defensa del Consumidor</a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container">
          <p>&copy; 2026 AgroRent — Tucumán, Argentina. Todos los derechos reservados.</p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="#" aria-label="WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
