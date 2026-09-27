import { useMemo, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { RATEABLE_STATUS, RENTAL_STATUS, allRentals, formatRange, rentalStatus, subscribe } from './rentalsStore';

const STATUS_CLASS = {
  [RENTAL_STATUS.EN_CURSO]: 'pending',
  [RENTAL_STATUS.PROXIMO]: 'confirmed',
  [RENTAL_STATUS.COMPLETADO]: 'done',
};

export default function ClientDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('rentals');
  const [machineStars, setMachineStars] = useState(0);
  const [serviceStars, setServiceStars] = useState(0);
  const [comment, setComment] = useState('');
  const [reportType, setReportType] = useState('');
  const [reportSent, setReportSent] = useState(false);

  const userId = user?.id;
  const all = useSyncExternalStore(subscribe, allRentals);

  const rentals = useMemo(
    () =>
      all
        .filter(r => r.userId === userId)
        .map(r => ({ ...r, status: rentalStatus(r), dates: formatRange(r.dateFrom, r.dateTo) }))
        .sort((a, b) => a.dateFrom.localeCompare(b.dateFrom)),
    [all, userId]
  );

  const rateableRentals = rentals.filter(r => RATEABLE_STATUS.includes(r.status));

  const tabs = [
    { id: 'rentals', label: 'Mis Alquileres', icon: '🚜' },
    { id: 'rate', label: 'Calificar', icon: '⭐' },
    { id: 'reports', label: 'Reportes', icon: '⚠️' },
  ];

  const reports = [
    { id: 1, machine: 'Case IH Magnum 340', type: 'Avería mecánica', date: '12/03/2026', status: 'resuelto', desc: 'Fallo en el sistema hidráulico durante la operación.' },
    { id: 2, machine: 'John Deere S780', type: 'Retraso en entrega', date: '20/02/2026', status: 'pendiente', desc: 'El equipo llegó 3 horas después del horario acordado.' },
  ];

  const StarInput = ({ label, value, onChange }) => (
    <div className="dashboard__star-input">
      <label>{label}</label>
      <div className="dashboard__star-buttons">
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} className={`dashboard__star-btn ${i <= value ? 'dashboard__star-btn--active' : ''}`} onClick={() => onChange(i)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= value ? '#FF8000' : '#ddd'}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="container">
          <h1>Mi Panel</h1>
          <p>Gestioná tus alquileres, calificaciones y reportes.</p>
        </div>
      </div>

      <div className="dashboard__content container">
        <nav className="dashboard__nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`dashboard__nav-btn ${tab === t.id ? 'dashboard__nav-btn--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="dashboard__nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="dashboard__panel">
          {tab === 'rentals' && (
            <>
              <h2>Mis Alquileres</h2>
              {rentals.length === 0 ? (
                <div className="dashboard__empty">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gray-border)" strokeWidth="1.5">
                    <path d="M3 17h18M5 17l1.5-7h11L19 17M5 17v2M19 17v2M9 10V7a3 3 0 016 0v3"/>
                  </svg>
                  <h3>Todavía no tenés alquileres</h3>
                  <p>Cuando firmes un contrato, tus reservas van a aparecer acá con su estado y las fechas.</p>
                  <button className="btn btn--orange" onClick={() => navigate('/catalogo')}>Ver catálogo</button>
                </div>
              ) : (
              <div className="dashboard__rental-cards">
                {rentals.map(r => (
                  <div className="dashboard__rental-card" key={r.id}>
                    <div className="dashboard__rental-img">
                      <img src={r.img} alt={r.machine} />
                      <span className={`dashboard__status dashboard__status--${STATUS_CLASS[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="dashboard__rental-body">
                      <h3>{r.machine}</h3>
                      <span className="dashboard__machine-type">{r.type}</span>
                      <div className="dashboard__rental-detail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {r.dates}
                      </div>
                      <div className="dashboard__rental-detail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {r.location}
                      </div>
                      <div className="dashboard__rental-detail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                        {r.owner}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </>
          )}

          {tab === 'rate' && (
            <>
              <h2>Calificá Tu Experiencia</h2>
              <div className="dashboard__rate-section">
                {rateableRentals.length === 0 && (
                  <div className="dashboard__empty">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gray-border)" strokeWidth="1.5">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <h3>No hay alquileres para calificar</h3>
                    <p>Podés calificar una máquina cuando el alquiler está en curso o ya terminó.</p>
                  </div>
                )}
                {rateableRentals.map(r => (
                  <div className="dashboard__rate-card" key={r.id}>
                    <div className="dashboard__rate-header">
                      <img src={r.img} alt={r.machine} />
                      <div>
                        <h3>{r.machine}</h3>
                        <span>{r.dates} — {r.location}</span>
                      </div>
                    </div>
                    <div className="dashboard__rate-form">
                      <StarInput label="Estado de la máquina" value={machineStars} onChange={setMachineStars} />
                      <StarInput label="Servicio del arrendador" value={serviceStars} onChange={setServiceStars} />
                      <div className="dashboard__form-group">
                        <label>Comentarios</label>
                        <textarea
                          rows="3"
                          placeholder="Contanos sobre tu experiencia..."
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      <button className="btn btn--primary" onClick={() => alert('¡Calificación enviada!')}>Enviar Calificación</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'reports' && (
            <>
              <h2>Reportar Incidente</h2>

              <div className="dashboard__report-form">
                <div className="dashboard__form-group">
                  <label>Tipo de Incidente</label>
                  <div className="dashboard__report-types">
                    {['Avería mecánica', 'Daño', 'Retraso', 'Otro'].map(type => (
                      <button
                        key={type}
                        className={`dashboard__report-type ${reportType === type ? 'dashboard__report-type--active' : ''}`}
                        onClick={() => setReportType(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dashboard__form-group">
                  <label>Descripción</label>
                  <textarea rows="4" placeholder="Describí el incidente con el mayor detalle posible..."></textarea>
                </div>
                <div className="dashboard__form-group">
                  <label>Adjuntar Fotos</label>
                  <div className="dashboard__form-upload">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>Arrastrá fotos o hacé clic para subir</span>
                  </div>
                </div>
                <button className="btn btn--primary" onClick={() => setReportSent(true)}>
                  Enviar Reporte
                </button>
                {reportSent && (
                  <div className="dashboard__report-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    Reporte enviado correctamente. Te notificaremos cuando sea revisado.
                  </div>
                )}
              </div>

              <h3 style={{ marginTop: '2rem' }}>Reportes Anteriores</h3>
              <div className="dashboard__reports-list">
                {reports.map(r => (
                  <div className="dashboard__report-item" key={r.id}>
                    <div className="dashboard__report-item-header">
                      <strong>{r.machine}</strong>
                      <span className={`dashboard__status dashboard__status--${r.status === 'resuelto' ? 'confirmed' : 'pending'}`}>
                        {r.status}
                      </span>
                    </div>
                    <span className="dashboard__report-item-type">{r.type} — {r.date}</span>
                    <p>{r.desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
