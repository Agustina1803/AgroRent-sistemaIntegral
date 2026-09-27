import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNav = (to) => {
    setMenuOpen(false);
    navigate(to);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          <div className="header__logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1E6B27"/>
              <path d="M8 22V14l8-6 8 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2z" fill="#fff" opacity="0.9"/>
              <path d="M13 24v-6h6v6" stroke="#FF8000" strokeWidth="1.5" fill="none"/>
              <circle cx="16" cy="14" r="2" fill="#FF8000"/>
            </svg>
          </div>
          <span className="header__logo-text">AgroRent</span>
        </Link>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <Link to="/" className="header__link" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/catalogo" className="header__link" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          <a className="header__link" href="#como-funciona">Cómo Funciona</a>
          <a className="header__link" href="#faq">Preguntas Frecuentes</a>
        </nav>

        <div className="header__actions">
          <button className="btn btn--outline-green" onClick={() => handleNav('/arrendador')}>
            Publicá tu Máquina
          </button>
          <button className="btn btn--primary" onClick={() => handleNav('/cliente')}>
            Ingresar
          </button>
        </div>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="header__mobile">
          <Link className="header__mobile-link" to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link className="header__mobile-link" to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</Link>
          <a className="header__mobile-link" href="#como-funciona" onClick={() => setMenuOpen(false)}>Cómo Funciona</a>
          <a className="header__mobile-link" href="#faq" onClick={() => setMenuOpen(false)}>Preguntas Frecuentes</a>
          <div className="header__mobile-actions">
            <button className="btn btn--outline-green btn--full" onClick={() => handleNav('/arrendador')}>Publicá tu Máquina</button>
            <button className="btn btn--primary btn--full" onClick={() => handleNav('/cliente')}>Ingresar</button>
          </div>
        </div>
      )}
    </header>
  );
}
