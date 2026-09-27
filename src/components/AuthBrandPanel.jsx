const BENEFICIOS = [
  {
    title: 'Alquileres sin intermediarios',
    text: 'Conectamos directamente al productor con el dueño de la maquinaria.',
  },
  {
    title: 'Maquinaria verificada',
    text: 'Cada equipo pasa por un control de estado y documentación antes de publicarse.',
  },
  {
    title: 'Soporte en la región NOA',
    text: 'Atención cercana para Tucumán, Salta, Jujuy, Catamarca y Santiago del Estero.',
  },
];

export default function AuthBrandPanel({ title, subtitle }) {
  return (
    <aside className="auth__brand">
      <div className="auth__brand-inner">
        <div className="auth__brand-badge">
          <svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.14)" />
            <path d="M8 22V14l8-6 8 6v8a2 2 0 01-2 2H10a2 2 0 01-2-2z" fill="#fff" opacity="0.92" />
            <path d="M13 24v-6h6v6" stroke="#FF8000" strokeWidth="1.5" fill="none" />
            <circle cx="16" cy="14" r="2" fill="#FF8000" />
          </svg>
          <span>AgroRent</span>
        </div>

        <h2 className="auth__brand-title">{title}</h2>
        {subtitle && <p className="auth__brand-subtitle">{subtitle}</p>}

        <ul className="auth__brand-list">
          {BENEFICIOS.map(item => (
            <li key={item.title} className="auth__brand-item">
              <span className="auth__brand-check" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>
                <strong>{item.title}</strong>
                <em>{item.text}</em>
              </span>
            </li>
          ))}
        </ul>

        <figure className="auth__brand-quote">
          <blockquote>
            "Publicar mi cosechadora me tomó diez minutos y el alquiler se resolvió en una semana. Dejé de
            llamar tractoristas uno por uno."
          </blockquote>
          <figcaption>
            <span className="auth__brand-avatar" aria-hidden="true">MG</span>
            <span>
              <strong>María González</strong>
              <em>Productora · Lules, Tucumán</em>
            </span>
          </figcaption>
        </figure>
      </div>
    </aside>
  );
}
