import { useNavigate } from 'react-router-dom';
import { MACHINES } from './machinesStore';

function StarRating({ rating, reviews }) {
  return (
    <div className="machines__stars">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.floor(rating) ? '#FF8000' : '#ddd'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
      <span className="machines__rating-num">{rating}</span>
      <span className="machines__rating-count">({reviews})</span>
    </div>
  );
}

export default function FeaturedMachines() {
  const navigate = useNavigate();
  // Se obtienen las máquinas directamente del store global unificado
  const machines = MACHINES.slice(0, 6);

  return (
    <section className="machines" id="catalogo">
      <div className="container">
        <div className="machines__header">
          <div>
            <span className="machines__label">Catálogo</span>
            <h2 className="machines__title">Máquinas Destacadas</h2>
            <p className="machines__desc">Los equipos mejor calificados por nuestros usuarios en la región.</p>
          </div>
          <button className="btn btn--primary" onClick={() => navigate('/catalogo')}>
            Ver Catálogo Completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        <div className="machines__grid">
          {machines.map((m) => (
            <div className="machines__card" key={m.id}>
              <div className="machines__card-img">
                <img src={m.img} alt={m.name} loading="lazy" />
                <span className="machines__card-type">{m.type}</span>
              </div>
              <div className="machines__card-body">
                <h3 className="machines__card-name">{m.name}</h3>
                <div className="machines__card-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {m.location}
                </div>
                <StarRating rating={m.rating} reviews={m.reviews} />
                <div className="machines__card-footer">
                  <div className="machines__card-price">
                    <span className="machines__card-price-num">${(m.price).toLocaleString('es-AR')}</span>
                    <span className="machines__card-price-unit">/ día</span>
                  </div>
                  <button className="btn btn--primary btn--sm" onClick={() => navigate('/catalogo')}>Alquilar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}