import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const allMachines = [
  { id: 1, name: 'John Deere S780', type: 'Cosechadora', brand: 'John Deere', price: 45000, rating: 4.9, reviews: 23, location: 'Tucumán', available: true, img: 'https://images.unsplash.com/photo-1654187084777-4bfc97840652?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Cosechadora de alta capacidad para granos y cereales. Motor 543 HP.' },
  { id: 2, name: 'Case IH Magnum 340', type: 'Tractor', brand: 'Case IH', price: 32000, rating: 4.8, reviews: 18, location: 'Santiago del Estero', available: true, img: 'https://images.unsplash.com/photo-1773415323680-ef13ebc61d7f?q=80&w=933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Tractor de alta potencia con transmisión CVT. Ideal para laboreo intensivo.' },
  { id: 3, name: 'Massey Ferguson 278', type: 'Tractor', brand: 'Massey Ferguson', price: 18000, rating: 4.7, reviews: 12, location: 'Salta', available: true, img: 'https://images.unsplash.com/photo-1621884615781-6efdf78611dc?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Tractor utilitario ágil y económico. Ideal para labores generales y siembra liviana.' },
  { id: 4, name: 'New Holland CR10', type: 'Cosechadora', brand: 'New Holland', price: 52000, rating: 5.0, reviews: 31, location: 'Tucumán', available: false, img: 'https://images.unsplash.com/photo-1784717098628-ec1c1bfa6872?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'La cosechadora más potente de la gama. Motor de 653 HP.' },
  { id: 5, name: 'Valtra BH194', type: 'Cargadora', brand: 'Valtra', price: 22000, rating: 4.6, reviews: 9, location: 'Catamarca', available: true, img: 'https://images.unsplash.com/photo-1684954215462-cad9f3693b41?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Cargadora frontal con capacidad de 2.5m³. Equipo versátil.' },
  { id: 6, name: 'HORSCH Leeb 6300', type: 'Pulverizadora', brand: 'HORSCH', price: 15000, rating: 4.5, reviews: 14, location: 'Tucumán', available: true, img: 'https://images.unsplash.com/photo-1690986375486-460dc48dd499?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Pulverizadora autopropulsada de precisión para cultivos extensivos.' },
  { id: 7, name: 'Claas Lexion 8700', type: 'Cosechadora', brand: 'Claas', price: 48000, rating: 4.9, reviews: 27, location: 'Tucumán', available: true, img: 'https://images.unsplash.com/photo-1784932314066-2444c0bc61cd?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Cosechadora premium con sistema CEMOS automático. 790 HP.' },
  { id: 8, name: 'Fendt 1050 Vario', type: 'Tractor', brand: 'Fendt', price: 38000, rating: 4.8, reviews: 15, location: 'Salta', available: true, img: 'https://images.unsplash.com/photo-1659021181759-2f987070b6c9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Tractor de alta gama con transmisión Vario. 517 HP.' },
  { id: 9, name: 'Apache Serie AS1010', type: 'Pulverizadora', brand: 'Apache', price: 20000, rating: 4.6, reviews: 11, location: 'Santiago del Estero', available: true, img: 'https://images.unsplash.com/photo-1776880276461-36bbe1354535?q=80&w=1195&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', desc: 'Pulverizadora autopropulsada con tracción mecánica y tanque de 3.800 L.' },
];

const categories = ['Todas', 'Cosechadora', 'Tractor', 'Pulidora de Arroz', 'Pulidora', 'Cargadora'];
const locations = ['Todas', 'Tucumán', 'Santiago del Estero', 'Salta', 'Catamarca'];

export default function RentalPage() {
  const [filters, setFilters] = useState({ category: 'Todas', location: 'Todas', dateFrom: '', dateTo: '', maxPrice: 60000 });
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const navigate = useNavigate();

  const filtered = allMachines.filter(m => {
    if (filters.category !== 'Todas' && m.type !== filters.category) return false;
    if (filters.location !== 'Todas' && m.location !== filters.location) return false;
    if (m.price > filters.maxPrice) return false;
    return true;
  });

  const addToCart = (machine) => {
    if (!cart.find(c => c.id === machine.id)) {
      setCart([...cart, { ...machine, days: 3, subtotal: machine.price * 3 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const daysBetween = (from, to) => {
    if (!from || !to) return 3;
    const diff = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const days = daysBetween(filters.dateFrom, filters.dateTo);

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
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="rental-page__filter">
              <label>Ubicación</label>
              <select value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })}>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
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
                      {cart.find(c => c.id === m.id) ? 'Añadido ✓' : 'Alquilar'}
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
                    <div className="rental-page__cart-item" key={item.id}>
                      <img src={item.img} alt={item.name} />
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.price.toLocaleString('es-AR')}/día × {days} días</p>
                        <strong>${(item.price * days).toLocaleString('es-AR')}</strong>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="rental-page__cart-remove">✕</button>
                    </div>
                  ))}
                </div>
                <div className="rental-page__cart-summary">
                  <div className="rental-page__cart-row"><span>Subtotal</span><span>${(cart.reduce((a, c) => a + c.price * days, 0)).toLocaleString('es-AR')}</span></div>
                  <div className="rental-page__cart-row"><span>Seguro (5%)</span><span>${(cart.reduce((a, c) => a + c.price * days, 0) * 0.05).toLocaleString('es-AR')}</span></div>
                  <div className="rental-page__cart-row rental-page__cart-row--total"><span>Total estimado</span><span>${(cart.reduce((a, c) => a + c.price * days, 0) * 1.05).toLocaleString('es-AR')}</span></div>
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

      {selectedMachine && (
        <div className="rental-page__detail-overlay" onClick={() => setSelectedMachine(null)}>
          <div className="rental-page__detail-panel" onClick={e => e.stopPropagation()}>
            <button className="rental-page__detail-close" onClick={() => setSelectedMachine(null)}>✕</button>
            <img src={selectedMachine.img} alt={selectedMachine.name} className="rental-page__detail-img" />
            <h2>{selectedMachine.name}</h2>
            <p>{selectedMachine.desc}</p>
            <div className="rental-page__detail-specs">
              <div><strong>Tipo:</strong> {selectedMachine.type}</div>
              <div><strong>Marca:</strong> {selectedMachine.brand}</div>
              <div><strong>Ubicación:</strong> {selectedMachine.location}</div>
              <div><strong>Precio:</strong> ${selectedMachine.price.toLocaleString('es-AR')}/día</div>
            </div>
            <button className="btn btn--primary btn--full" onClick={() => { addToCart(selectedMachine); setSelectedMachine(null); }}>Añadir al Carrito</button>
          </div>
        </div>
      )}
    </div>
  );
}
