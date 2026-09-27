import { useNavigate } from 'react-router-dom';

export default function InfoBlocks() {
  const navigate = useNavigate();

  return (
    <section className="info-blocks" id="como-funciona">
      <div className="container">
        <div className="info-blocks__header">
          <span className="info-blocks__label">Cómo Funciona</span>
          <h2 className="info-blocks__title">AgroRent es para todos</h2>
        </div>

        <div className="info-blocks__grid">
          <div className="info-blocks__card info-blocks__card--owner">
            <div className="info-blocks__card-icon-wrap info-blocks__card-icon-wrap--green">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 className="info-blocks__card-title">Para Dueños</h3>
            <p className="info-blocks__card-desc">
              ¿Tenés maquinaria ociosa? Publicala en minutos, establecé tu precio y recibí solicitudes
              de productores de tu zona. Nosotros nos encargamos de la certificación técnica y el contrato.
            </p>
            <ul className="info-blocks__card-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Publicación gratuita
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Pago seguro y a tiempo
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Seguro de daños incluido
              </li>
            </ul>
            <button className="btn btn--primary" onClick={() => navigate('/arrendador')}>
              Publicá tu Máquina
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="info-blocks__card info-blocks__card--producer">
            <div className="info-blocks__card-icon-wrap info-blocks__card-icon-wrap--orange">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF8000" strokeWidth="2">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <path d="M2 12h20"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
            </div>
            <h3 className="info-blocks__card-title">Para Productores</h3>
            <p className="info-blocks__card-desc">
              Buscá el equipo que necesitás, filtrá por ubicación y fecha, y alquilá con un solo clic.
              Contrato digital, pago protegido y asistencia técnica garantizada.
            </p>
            <ul className="info-blocks__card-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Equipos cercanos (&lt;50km)
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Contrato digital firmado
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Soporte técnico en campo
              </li>
            </ul>
            <button className="btn btn--orange" onClick={() => navigate('/catalogo')}>
              Explorar Catálogo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <div className="info-blocks__card info-blocks__card--security">
            <div className="info-blocks__card-icon-wrap info-blocks__card-icon-wrap--dark">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4" stroke="#FF8000" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="info-blocks__card-title">Seguridad Garantizada</h3>
            <p className="info-blocks__card-desc">
              Cada transacción está protegida. Verificamos la identidad de ambas partes,
              certificamos las máquinas y ofrecemos mediación en caso de conflictos.
            </p>
            <ul className="info-blocks__card-list">
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Verificación de identidad
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Pago retenido hasta entrega
              </li>
              <li>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#2A8038"><path d="M20 6L9 17l-5-5"/></svg>
                Mediación de conflictos
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
