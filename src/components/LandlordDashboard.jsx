import { useState, useSyncExternalStore } from 'react';
import { useAuth } from './AuthContext';
import { MACHINES } from './machinesStore';
import { allRentals, formatRange, rentalStatus, subscribe } from './rentalsStore';

const calendarDays = (() => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    const reserved = [5, 6, 7, 12, 13, 14, 19, 20, 21].includes(i);
    days.push({ day: i, available: !reserved });
  }
  return days;
})();

export default function LandlordDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('machines');
  const [showNewMachine, setShowNewMachine] = useState(false);

  // Sincronizamos las reservas globales de la plataforma
  const all = useSyncExternalStore(subscribe, allRentals);

  // Filtramos las máquinas de este arrendador (asumimos usr-1 o su id)
  const landlordId = user?.id || 'usr-1';
  const myMachines = MACHINES.filter(m => m.ownerId === landlordId);

  // Historial de alquileres de las máquinas de este arrendador
  const machineNames = myMachines.map(m => m.name);
  const landlordRentals = all.filter(r => machineNames.includes(r.machine));

  const tabs = [
    { id: 'machines', label: 'Mis Máquinas', icon: '🚜' },
    { id: 'history', label: 'Historial de Alquileres', icon: '📋' },
    { id: 'calendar', label: 'Calendario', icon: '📅' },
    { id: 'cert', label: 'Certificaciones', icon: '✅' },
    { id: 'stats', label: 'Estadísticas', icon: '📊' },
    { id: 'messages', label: 'Mensajes', icon: '💬' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="container">
          <h1>Panel del Arrendador ({user?.nombre})</h1>
          <p>Gestioná tus máquinas conectadas al catálogo, alquileres y ganancias.</p>
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
                <h2>Mis Máquinas en Catálogo ({myMachines.length})</h2>
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
                        <option>Pulverizadora</option>
                        <option>Cargadora</option>
                      </select>
                    </div>
                    <div className="dashboard__form-group">
                      <label>Marca</label>
                      <input type="text" placeholder="John Deere, Case IH..." />
                    </div>
                    <div className="dashboard__form-group">
                      <label>Modelo / Nombre</label>
                      <input type="text" placeholder="S780, Magnum 340..." />
                    </div>
                    <div className="dashboard__form-group">
                      <label>Precio por Día (ARS)</label>
                      <input type="number" placeholder="45000" />
                    </div>
                    <div className="dashboard__form-group dashboard__form-group--full">
                      <label>Descripción</label>
                      <textarea rows="3" placeholder="Características y estado..."></textarea>
                    </div>
                  </div>
                  <button className="btn btn--primary" onClick={() => { alert('Máquina registrada con éxito en el sistema.'); setShowNewMachine(false); }}>Guardar y Publicar</button>
                </div>
              )}

              <div className="dashboard__machines-grid">
                {myMachines.map(m => (
                  <div className="dashboard__machine-card" key={m.id}>
                    <div className="dashboard__machine-img">
                      <img src={m.img} alt={m.name} />
                      <span className={`dashboard__machine-status dashboard__machine-status--${m.available ? 'disponible' : 'alquilada'}`}>
                        {m.available ? 'Disponible' : 'Alquilada'}
                      </span>
                    </div>
                    <div className="dashboard__machine-body">
                      <h3>{m.name}</h3>
                      <span className="dashboard__machine-type">{m.type} — {m.location}</span>
                      <span className="dashboard__machine-price">${m.price.toLocaleString('es-AR')}/día</span>
                      <div className="dashboard__machine-actions">
                        <button className="btn btn--outline-green btn--sm">Editar</button>
                        <button className="btn btn--outline-red btn--sm">Desactivar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'history' && (
            <>
              <h2>Historial de Alquileres Recibidos</h2>
              {landlordRentals.length === 0 ? (
                <div className="dashboard__empty">
                  <h3>No hay alquileres registrados aún</h3>
                  <p>Cuando un productor alquile alguna de tus máquinas desde el catálogo, aparecerá reflejado aquí automáticamente.</p>
                </div>
              ) : (
                <div className="dashboard__table-wrap">
                  <table className="dashboard__table">
                    <thead>
                      <tr>
                        <th>Máquina</th>
                        <th>Fechas (Período)</th>
                        <th>Días</th>
                        <th>Total Ingreso</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {landlordRentals.map(r => {
                        const currentStatus = rentalStatus(r);
                        return (
                          <tr key={r.id}>
                            <td><strong>{r.machine}</strong></td>
                            <td>{formatRange(r.dateFrom, r.dateTo)}</td>
                            <td>{r.days} días</td>
                            <td><strong>${r.total.toLocaleString('es-AR')}</strong></td>
                            <td>
                              <span className={`dashboard__status dashboard__status--${currentStatus === 'completado' ? 'done' : 'confirmed'}`}>
                                {currentStatus}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {tab === 'calendar' && (
            <>
              <h2>Calendario de Disponibilidad</h2>
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
                <p>Última inspección técnica oficial — Válido en toda la región NOA.</p>
              </div>
            </>
          )}

          {tab === 'stats' && (
            <>
              <h2>Estadísticas Generales</h2>
              <div className="dashboard__stats-grid">
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Máquinas Activas</span>
                  <span className="dashboard__stat-num">{myMachines.length}</span>
                </div>
                <div className="dashboard__stat-card">
                  <span className="dashboard__stat-label">Alquileres Totales</span>
                  <span className="dashboard__stat-num">{landlordRentals.length}</span>
                </div>
              </div>
            </>
          )}

          {tab === 'messages' && (
            <>
              <h2>Centro de Mensajes</h2>
              <div className="dashboard__messages">
                <div className="dashboard__message">
                  <div className="dashboard__message-avatar">JP</div>
                  <div className="dashboard__message-body">
                    <div className="dashboard__message-header">
                      <strong>Juan Pérez (Cliente)</strong>
                      <span>Reciente</span>
                    </div>
                    <p>Hola, consulta sobre la disponibilidad de la cosechadora para la próxima campaña.</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}