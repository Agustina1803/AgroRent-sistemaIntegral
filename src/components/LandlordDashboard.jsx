import { useState } from 'react';

const myMachines = [
  { id: 1, name: 'John Deere S780', type: 'Cosechadora', price: 45000, status: 'disponible', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=140&fit=crop' },
  { id: 2, name: 'Case IH Magnum 340', type: 'Tractor', price: 32000, status: 'alquilada', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=140&fit=crop' },
  { id: 3, name: 'Jacto Uniport 3030', type: 'Pulidora', price: 15000, status: 'disponible', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&h=140&fit=crop' },
];

const rentalHistory = [
  { id: 1, machine: 'Case IH Magnum 340', client: 'Juan Pérez', dates: '01/02 - 06/02/2026', status: 'completado', income: 160000, rating: 5 },
  { id: 2, machine: 'John Deere S780', client: 'AgroSur S.R.L.', dates: '15/01 - 20/01/2026', status: 'completado', income: 225000, rating: 4 },
  { id: 3, machine: 'Case IH Magnum 340', client: 'María López', dates: '10/03 - 15/03/2026', status: 'en curso', income: 160000, rating: null },
];

const calendarDays = (() => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    const reserved = [5, 6, 7, 12, 13, 14, 19, 20, 21].includes(i);
    days.push({ day: i, available: !reserved });
  }
  return days;
})();

export default function LandlordDashboard() {
  const [tab, setTab] = useState('machines');
  const [showNewMachine, setShowNewMachine] = useState(false);

  const tabs = [
    { id: 'machines', label: 'Mis Máquinas', icon: '🚜' },
    { id: 'history', label: 'Historial', icon: '📋' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'cert', label: 'Certificaciones', icon: '✅' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'messages', label: 'Mensajes', icon: '💬' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="container">
          <h1>Panel del Arrendador</h1>
          <p>Gestioná tus máquinas, alquileres y ganancias.</p>
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
          {tab === 'machines' && (
            <>
              <div className="dashboard__panel-header">
                <h2>Mis Máquinas ({myMachines.length})</h2>
                <button className="btn btn--primary" onClick={() => setShowNewMachine(!showNewMachine)}>
                  {showNewMachine ? 'Cancelar' : '+ Publicar Nueva Máquina'}
                </button>
              </div>

              {showNewMachine && (
                <div className="dashboard__form">
                  <h3>Publicar Nueva Máquina</h3>
                  <div className="dashboard__form-grid">
                    <div className="dashboard__form-group">
                      <label>Tipo de Máquina</label>
                      <select>
                        <option>Cosechadora</option>
                        <option>Tractor</option>
                        <option>Pulidora</option>
                        <option>Cargadora</option>
                        <option>Otro</option>
                      </select>
                    </div>
                    <div className="dashboard__form-group">
                      <label>Marca</label>
                      <input type="text" placeholder="John Deere, Case IH..." />
                    </div>
                    <div className="dashboard__form-group">
                      <label>Modelo</label>
                      <input type="text" placeholder="S780, Magnum 340..." />
                    </div>
                    <div className="dashboard__form-group">
                      <label>Año</label>
                      <input type="number" placeholder="2020" min="1990" max="2026" />
                    </div>
                    <div className="dashboard__form-group">
                      <label>Precio por Día (ARS)</label>
                      <input type="number" placeholder="45000" />
                    </div>
                    <div className="dashboard__form-group dashboard__form-group--full">
                      <label>Fotos</label>
                      <div className="dashboard__form-upload">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>Arrastrá las fotos o hacé clic para subir</span>
                      </div>
                    </div>
                    <div className="dashboard__form-group dashboard__form-group--full">
                      <label>Descripción</label>
                      <textarea rows="4" placeholder="Describí las características, estado y accesorios incluidos..."></textarea>
                    </div>
                  </div>
                  <button className="btn btn--primary">Publicar Máquina</button>
                </div>
              )}

              <div className="dashboard__machines-grid">
                {myMachines.map(m => (
                  <div className="dashboard__machine-card" key={m.id}>
                    <div className="dashboard__machine-img">
                      <img src={m.img} alt={m.name} />
                      <span className={`dashboard__machine-status dashboard__machine-status--${m.status}`}>
                        {m.status === 'disponible' ? 'Disponible' : 'Alquilada'}
                      </span>
                    </div>
                    <div className="dashboard__machine-body">
                      <h3>{m.name}</h3>
                      <span className="dashboard__machine-type">{m.type}</span>
                      <span className="dashboard__machine-price">${m.price.toLocaleString('es-AR')}/día</span>
                      <div className="dashboard__machine-actions">
                        <button className="btn btn--outline-green btn--sm">Editar</button>
                        <button className="btn btn--outline-red btn--sm">Desactivar</button>
                        {m.status === 'alquilada' && <button className="btn btn--primary btn--sm">Ver Alquiler</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'history' && (
            <>
              <h2>Historial de Alquileres</h2>
              <div className="dashboard__table-wrap">
                <table className="dashboard__table">
                  <thead>
                    <tr>
                      <th>Máquina</th>
                      <th>Cliente</th>
                      <th>Fechas</th>
                      <th>Estado</th>
                      <th>Ingreso</th>
                      <th>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentalHistory.map(r => (
                      <tr key={r.id}>
                        <td><strong>{r.machine}</strong></td>
                        <td>{r.client}</td>
                        <td>{r.dates}</td>
                        <td>
                          <span className={`dashboard__status dashboard__status--${r.status === 'completado' ? 'confirmed' : 'pending'}`}>
                            {r.status}
                          </span>
                        </td>
                        <td><strong>${r.income.toLocaleString('es-AR')}</strong></td>
                        <td>
                          {r.rating ? (
                            <div className="dashboard__stars">
                              {[1, 2, 3, 4, 5].map(i => (
                                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= r.rating ? '#FF8000' : '#ddd'}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                          ) : <span className="gray">Pendiente</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'calendar' && (
            <>
              <h2>Calendario de Disponibilidad — Marzo 2026</h2>
              <div className="dashboard__calendar-legend">
                <span className="dashboard__calendar-legend-item"><span className="dashboard__calendar-dot dashboard__calendar-dot--available"></span> Disponible</span>
                <span className="dashboard__calendar-legend-item"><span className="dashboard__calendar-dot dashboard__calendar-dot--reserved"></span> Reservado</span>
              </div>
              <div className="dashboard__calendar">
                {calendarDays.map(d => (
                  <div
                    key={d.day}
                    className={`dashboard__calendar-day ${d.available ? 'dashboard__calendar-day--available' : 'dashboard__calendar-day--reserved'}`}
                  >
                    {d.day}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'cert' && (
            <>
              <h2>Certificación Técnica</h2>
              <div className="dashboard__cert-card">
                <div className="dashboard__cert-info">
                  <h3>John Deere S780</h3>
                  <span className="dashboard__status dashboard__status--confirmed">Aprobado</span>
                </div>
                <p>Última inspección: 01/02/2026 — Válido hasta: 01/08/2026</p>
              </div>
              <div className="dashboard__cert-card">
                <div className="dashboard__cert-info">
                  <h3>Case IH Magnum 340</h3>
                  <span className="dashboard__status dashboard__status--pending">Pendiente</span>
                </div>
                <p>Documentación enviada el 10/03/2026 — En revisión</p>
              </div>
              <div className="dashboard__cert-upload">
                <h3>Subir Documentación</h3>
                <div className="dashboard__form-upload">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span>Subí libreta técnica, seguro y fotos del equipo</span>
                </div>
                <button className="btn btn--primary" style={{ marginTop: '1rem' }}>Enviar Documentación</button>
              </div>
            </>
          )}

          {tab === 'stats' && (
            <>
              <h2>Estadísticas</h2>
              <div className="dashboard__stats-grid">
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Ocupación Mensual</span>
                  <span className="dashboard__stat-num">72%</span>
                  <div className="dashboard__stat-bar"><div className="dashboard__stat-bar-fill" style={{ width: '72%' }}></div></div>
                </div>
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Ganancias del Mes</span>
                  <span className="dashboard__stat-num">$545.000</span>
                  <span className="dashboard__stat-change dashboard__stat-change--up">+12% vs. mes anterior</span>
                </div>
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Calificación Promedio</span>
                  <span className="dashboard__stat-num">4.8</span>
                  <div className="dashboard__stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i <= 5 ? '#FF8000' : '#ddd'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Alquileres Totales</span>
                  <span className="dashboard__stat-num">47</span>
                  <span className="dashboard__stat-change dashboard__stat-change--up">+8 este mes</span>
                </div>
              </div>
            </>
          )}

          {tab === 'messages' && (
            <>
              <h2>Centro de Mensajes</h2>
              <div className="dashboard__messages">
                {[
                  { from: 'Juan Pérez', msg: 'Hola, ¿la cosechadora está disponible del 15 al 20 de marzo?', time: 'Hace 2h', unread: true },
                  { from: 'AgroSur S.R.L.', msg: 'Confirmamos la recepción del tractor. Todo en orden.', time: 'Ayer', unread: false },
                  { from: 'María López', msg: '¿Se puede extender el alquiler por 2 días más?', time: 'Hace 3 días', unread: false },
                ].map((m, i) => (
                  <div className={`dashboard__message ${m.unread ? 'dashboard__message--unread' : ''}`} key={i}>
                    <div className="dashboard__message-avatar">{m.from.charAt(0)}</div>
                    <div className="dashboard__message-body">
                      <div className="dashboard__message-header">
                        <strong>{m.from}</strong>
                        <span>{m.time}</span>
                      </div>
                      <p>{m.msg}</p>
                    </div>
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
