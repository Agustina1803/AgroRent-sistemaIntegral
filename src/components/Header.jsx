import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROLE_LABEL } from './authStore';

function initials(nombre) {
  return String(nombre || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() || '')
    .join('');
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const { user, isAuthenticated, logout, panelFor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = e => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    const onKeyDown = e => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [userMenuOpen]);

  const handleNav = (to) => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate(to);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setMenuOpen(false)}>
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
          <Link className="header__link" to="/#como-funciona" onClick={() => setMenuOpen(false)}>Cómo Funciona</Link>
          <Link className="header__link" to="/#faq" onClick={() => setMenuOpen(false)}>Preguntas Frecuentes</Link>
        </nav>

        <div className="header__actions">
          {isAuthenticated ? (
            <>
              <Link to={panelFor} className="btn btn--outline-green" onClick={() => setUserMenuOpen(false)}>
                Mi Panel
              </Link>
              <div className="header__user" ref={userMenuRef}>
                <button
                  type="button"
                  className="header__user-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                >
                  <span className="header__avatar" aria-hidden="true">{initials(user.nombre)}</span>
                  <span className="header__user-meta">
                    <span className="header__user-name">{user.nombre}</span>
                    <span className="header__user-role">{ROLE_LABEL[user.rol]}</span>
                  </span>
                  <svg
                    className={`header__caret ${userMenuOpen ? 'header__caret--open' : ''}`}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="header__dropdown" role="menu">
                    <div className="header__dropdown-head">
                      <strong>{user.nombre}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to={panelFor} className="header__dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" />
                        <rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" />
                      </svg>
                      Mi panel
                    </Link>
                    <Link to="/catalogo" className="header__dropdown-item" role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3 9l1.5-5h15L21 9" /><path d="M4 9v11h16V9" /><path d="M9 20v-6h6v6" />
                      </svg>
                      Catálogo
                    </Link>
                    <button type="button" className="header__dropdown-item header__dropdown-item--danger" role="menuitem" onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className="btn btn--outline-green" onClick={() => handleNav('/registro')}>
                Publicá tu Máquina
              </button>
              <button className="btn btn--primary" onClick={() => handleNav('/login')}>
                Ingresar
              </button>
            </>
          )}
        </div>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => {
            setMenuOpen(!menuOpen);
            setUserMenuOpen(false);
          }}
          aria-label="Menú"
          aria-expanded={menuOpen}
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
          <Link className="header__mobile-link" to="/#como-funciona" onClick={() => setMenuOpen(false)}>Cómo Funciona</Link>
          <Link className="header__mobile-link" to="/#faq" onClick={() => setMenuOpen(false)}>Preguntas Frecuentes</Link>

          {isAuthenticated ? (
            <div className="header__mobile-user">
              <div className="header__mobile-user-card">
                <span className="header__avatar" aria-hidden="true">{initials(user.nombre)}</span>
                <span className="header__user-meta">
                  <span className="header__user-name">{user.nombre}</span>
                  <span className="header__user-role">{ROLE_LABEL[user.rol]}</span>
                </span>
              </div>
              <Link className="btn btn--outline-green btn--full" to={panelFor} onClick={() => setMenuOpen(false)}>
                Mi Panel
              </Link>
              <button className="btn btn--outline-red btn--full" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="header__mobile-actions">
              <button className="btn btn--outline-green btn--full" onClick={() => handleNav('/registro')}>Publicá tu Máquina</button>
              <button className="btn btn--primary btn--full" onClick={() => handleNav('/login')}>Ingresar</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
