import { useMemo, useState, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { CATEGORIES, LOCATIONS, filterMachines } from './machinesStore';
import { addCartItem, addDays, cartTotals, daysBetween, readCart, removeCartItem, subscribe, toISODate } from './rentalsStore';

export default function RentalPage() {
  const [filters, setFilters] = useState({ category: 'Todas', location: 'Todas', dateFrom: '', dateTo: '', maxPrice: 60000 });
  const { user } = useAuth();
  const [showCart, setShowCart] = useState(false);
  const navigate = useNavigate();

  const userId = user?.id;
  const cart = useSyncExternalStore(subscribe, () => readCart(userId));

  const filtered = filterMachines(filters);

  const rentalWindow = useMemo(() => {
    const from = filters.dateFrom || toISODate(new Date());
    const to = filters.dateTo || toISODate(addDays(new Date(), 3));
    return { dateFrom: from, dateTo: to, days: daysBetween(from, to) };
  }, [filters.dateFrom, filters.dateTo]);

  const addToCart = machine => {
    if (!userId) {
      navigate('/login', { state: { from: { pathname: '/catalogo' } } });
      return;
    }
    addCartItem(userId, machine, rentalWindow);
  };

  const removeFromCart = machineId => {
    removeCartItem(userId, machineId);
  };

  const days = rentalWindow.days;
  const totals = cartTotals(cart);

  return (
    <div className="rental-page">
      <div className="rental-page__inner">
        <aside className="rental-page__sidebar">
          <div className="rental-page__filters">
            <h3 className="rental-page__filters-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
              Filtros
            </h3>

            <div className="rental-page__filter">
              <label>Categoría</label>
              <select value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="rental-page__filter">
              <label>Ubicación</label>
              <select value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="rental-page__filter">
              <label>Fecha desde</label>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} />
            </div>

            <div className="rental-page__filter">
              <label>Fecha hasta</label>
              <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} />
            </div>

            <div className="rental-page__filter">
              <label>Precio máximo: <strong>${(filters.maxPrice).toLocaleString('es-AR')}/día</strong></label>
              <input
                type="range"
                min="5000"
                max="60000"
                step="1000"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="rental-page__range"
              />
            </div>
          </div>

          <button className="rental-page__cart-toggle btn btn--primary btn--full" onClick={() => setShowCart(!showCart)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
            Ver Carrito ({cart.length})
          </button>
        </aside>

        <div className="rental-page__content">
          <div className="rental-page__listings-header">
            <h2>{filtered.length} equipos disponibles</h2>
            <span className="rental-page__listing-count">ordenar por: <strong>Mejor valorados</strong></span>
          </div>

          <div className="rental-page__grid">
            {filtered.map(m => (
              <div className="rental-page__card" key={m.id}>
                <div className="rental-page__card-img">
                  <img src={m.img} alt={m.name} loading="lazy" />
                  <span className="rental-page__card-type">{m.type}</span>
                  {!m.available && <span className="rental-page__card-badge">No disponible</span>}
                </div>
                <div className="rental-page__card-body">
                  <h3>{m.name}</h3>
                  <p className="rental-page__card-desc">{m.desc}</p>
                  <div className="rental-page__card-location">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {m.location}
                  </div>
                  <div className="rental-page__card-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= Math.floor(m.rating) ? '#FF8000' : '#ddd'}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                    <span>{m.rating} ({m.reviews})</span>
                  </div>
                  <div className="rental-page__card-footer">
                    <div className="rental-page__card-price">
                      <span className="rental-page__card-price-num">${(m.price * days).toLocaleString('es-AR')}</span>
                      <span className="rental-page__card-price-unit">/{days} días (${(m.price).toLocaleString('es-AR')}/día)</span>
                    </div>
                    <button
                      className={`btn ${m.available ? 'btn--primary' : 'btn--disabled'} btn--sm`}
                      disabled={!m.available}
                      onClick={() => m.available && addToCart(m)}
                    >
                      {cart.find(c => c.machineId === m.id) ? 'Añadido ✓' : 'Alquilar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCart && (
        <div className="rental-page__cart-overlay" onClick={() => setShowCart(false)}>
          <div className="rental-page__cart-panel" onClick={e => e.stopPropagation()}>
            <div className="rental-page__cart-header">
              <h3>Mi Carrito</h3>
              <button onClick={() => setShowCart(false)} className="rental-page__cart-close">✕</button>
            </div>
            {cart.length === 0 ? (
              <div className="rental-page__cart-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                <p>Tu carrito está vacío</p>
              </div>
            ) : (
              <>
                <div className="rental-page__cart-items">
                  {cart.map(item => (
                      <div className="rental-page__cart-item" key={item.machineId}>
                      <img src={item.img} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.price.toLocaleString('es-AR')}/día × {item.days} días</p>
                        <strong>${(item.price * item.days).toLocaleString('es-AR')}</strong>
                      </div>
                      <button onClick={() => removeFromCart(item.machineId)} className="rental-page__cart-remove" aria-label={`Quitar ${item.name} del carrito`}>✕</button>
                    </div>
                  ))}
                </div>
                <div className="rental-page__cart-summary">
                  <div className="rental-page__cart-row"><span>Subtotal</span><span>${totals.subtotal.toLocaleString('es-AR')}</span></div>
                  <div className="rental-page__cart-row"><span>Seguro (5%)</span><span>${totals.seguro.toLocaleString('es-AR')}</span></div>
                  <div className="rental-page__cart-row rental-page__cart-row--total"><span>Total estimado</span><span>${totals.total.toLocaleString('es-AR')}</span></div>
                </div>
                <button className="btn btn--orange btn--full" onClick={() => navigate('/carrito')}>
                  Finalizar Reserva
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
