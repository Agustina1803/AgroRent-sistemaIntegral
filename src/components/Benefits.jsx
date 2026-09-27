export default function Benefits() {
  const benefits = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4" stroke="#FF8000" strokeWidth="2"/>
        </svg>
      ),
      title: '100+ Equipos Certificados',
      desc: 'Cada máquina pasa por una revisión técnica antes de ser publicada. Calidad garantizada.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <path d="m8 21 4-4 4 4"/>
          <circle cx="12" cy="10" r="3" stroke="#FF8000" strokeWidth="2"/>
        </svg>
      ),
      title: 'Contratación 100% Online',
      desc: 'Desde la búsqueda hasta la firma del contrato, todo se resuelve desde tu celular o computadora.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          <circle cx="18" cy="18" r="3" fill="#FF8000" stroke="none"/>
        </svg>
      ),
      title: 'Asistencia Técnica en el Campo',
      desc: 'Si la máquina falla, un mecánico va hasta tu ubicación. Soporte de emergencia incluido.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5" stroke="#FF8000" strokeWidth="2"/>
        </svg>
      ),
      title: 'Geolocalización Inteligente',
      desc: 'Encontrá el equipo más cercano a tu campo. Algoritmo de emparejamiento por distancia.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2"/>
          <path d="M1 10h22" stroke="#FF8000" strokeWidth="2"/>
          <path d="M6 16h4" strokeWidth="2"/>
        </svg>
      ),
      title: 'Pagos Seguros',
      desc: 'Transferencia, tarjeta o billetera virtual. Tu dinero está protegido hasta la entrega.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75" stroke="#FF8000" strokeWidth="2"/>
        </svg>
      ),
      title: 'Calificación Mutua',
      desc: 'Tanto arrendadores como arrendatarios califican la experiencia. Transparencia total.',
    },
  ];

  return (
    <section className="benefits" id="benefits">
      <div className="container">
        <div className="benefits__header">
          <span className="benefits__label">Beneficios</span>
          <h2 className="benefits__title">¿Por qué elegir AgroRent?</h2>
          <p className="benefits__desc">
            La plataforma que simplifica el alquiler de maquinaria agrícola en toda la región del NOA.
          </p>
        </div>
        <div className="benefits__grid">
          {benefits.map((b, i) => (
            <div className="benefits__card" key={i}>
              <div className="benefits__card-icon">{b.icon}</div>
              <h3 className="benefits__card-title">{b.title}</h3>
              <p className="benefits__card-desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
