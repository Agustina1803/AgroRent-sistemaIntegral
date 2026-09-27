import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const [search, setSearch] = useState({ what: '', where: '', dateFrom: '', dateTo: '' });
  const navigate = useNavigate();

  return (
    <section className="hero-section">
      <div className="hero-section__bg">
        <div className="hero-section__grain"></div>
        <div className="hero-section__gradient"></div>
      </div>

      <div className="hero-section__content">
        <div className="hero-section__badge">
          <span className="hero-section__badge-dot"></span>
          Plataforma #1 en Alquiler de Maquinaria Agrícola — NOA
        </div>

        <h1 className="hero-section__title">
          Alquilá Maquinaria Agrícola de Forma
          <span className="hero-section__title-highlight"> Rápida y Segura</span>
        </h1>

        <p className="hero-section__subtitle">
          Conectamos a productores con dueños de equipos certificados.
          Contratos digitales, soporte técnico y pagos seguros en un solo lugar.
        </p>

        <div className="hero-section__search">
          <div className="hero-section__search-row">
            <div className="hero-section__search-field">
              <label>¿Qué necesitás?</label>
              <div className="hero-section__search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Cosechadora, tractor, pulidora..."
                  value={search.what}
                  onChange={e => setSearch({ ...search, what: e.target.value })}
                />
              </div>
            </div>

            <div className="hero-section__search-field">
              <label>Ubicación</label>
              <div className="hero-section__search-input-wrap">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <input
                  type="text"
                  placeholder="Tucumán, Santiago del Estero..."
                  value={search.where}
                  onChange={e => setSearch({ ...search, where: e.target.value })}
                />
              </div>
            </div>

            <div className="hero-section__search-field hero-section__search-field--dates">
              <label>Desde</label>
              <input
                type="date"
                value={search.dateFrom}
                onChange={e => setSearch({ ...search, dateFrom: e.target.value })}
              />
            </div>

            <div className="hero-section__search-field hero-section__search-field--dates">
              <label>Hasta</label>
              <input
                type="date"
                value={search.dateTo}
                onChange={e => setSearch({ ...search, dateTo: e.target.value })}
              />
            </div>

            <button className="hero-section__search-btn" onClick={() => navigate('/catalogo')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              Buscar
            </button>
          </div>
        </div>

        <div className="hero-section__stats">
          <div className="hero-section__stat">
            <span className="hero-section__stat-number">100+</span>
            <span className="hero-section__stat-label">Equipos Certificados</span>
          </div>
          <div className="hero-section__stat-divider"></div>
          <div className="hero-section__stat">
            <span className="hero-section__stat-number">500+</span>
            <span className="hero-section__stat-label">Alquileres Realizados</span>
          </div>
          <div className="hero-section__stat-divider"></div>
          <div className="hero-section__stat">
            <span className="hero-section__stat-number">4.8</span>
            <span className="hero-section__stat-label">Calificación Promedio</span>
          </div>
          <div className="hero-section__stat-divider"></div>
          <div className="hero-section__stat">
            <span className="hero-section__stat-number">&lt;50km</span>
            <span className="hero-section__stat-label">Radio de Cercanía</span>
          </div>
        </div>
      </div>
    </section>
  );
}
