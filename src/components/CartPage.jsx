import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const cartItems = [
  { id: 1, name: 'John Deere S780', type: 'Cosechadora', price: 45000, days: 5, location: 'Tucumán', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=200&h=140&fit=crop' },
  { id: 2, name: 'Case IH Magnum 340', type: 'Tractor', price: 32000, days: 5, location: 'Santiago del Estero', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&h=140&fit=crop' },
];

const recommended = [
  { id: 3, name: 'Massey Ferguson 278', type: 'Pulidora de Arroz', price: 18000, location: 'Salta', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=140&fit=crop' },
  { id: 6, name: 'Jacto Uniport 3030', type: 'Pulidora', price: 15000, location: 'Tucumán', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=200&h=140&fit=crop' },
];

export default function CartPage() {
  const [paymentMethod, setPaymentMethod] = useState('transferencia');
  const [contractAccepted, setContractAccepted] = useState(false);
  const [firma, setFirma] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((a, c) => a + c.price * c.days, 0);
  const seguro = subtotal * 0.05;
  const total = subtotal + seguro;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-page__header">
          <button className="cart-page__back" onClick={() => navigate('/catalogo')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Volver al catálogo
          </button>
          <h1>Carrito y Contrato</h1>
          <div className="cart-page__steps">
            <div className={`cart-page__step ${step >= 1 ? 'cart-page__step--active' : ''}`}>1. Carrito</div>
            <div className={`cart-page__step ${step >= 2 ? 'cart-page__step--active' : ''}`}>2. Pago</div>
            <div className={`cart-page__step ${step >= 3 ? 'cart-page__step--active' : ''}`}>3. Contrato</div>
            <div className={`cart-page__step ${step >= 4 ? 'cart-page__step--active' : ''}`}>4. Confirmación</div>
          </div>
        </div>

        {step === 1 && (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              <h2>Equipos en tu carrito</h2>
              {cartItems.map(item => (
                <div className="cart-page__item" key={item.id}>
                  <img src={item.img} alt={item.name} />
                  <div className="cart-page__item-info">
                    <h3>{item.name}</h3>
                    <span className="cart-page__item-type">{item.type}</span>
                    <div className="cart-page__item-location">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      {item.location}
                    </div>
                    <div className="cart-page__item-dates">
                      <span>15/03/2026 — 20/03/2026 ({item.days} días)</span>
                    </div>
                  </div>
                  <div className="cart-page__item-price">
                    <span className="cart-page__item-unit">${item.price.toLocaleString('es-AR')}/día</span>
                    <span className="cart-page__item-total">${(item.price * item.days).toLocaleString('es-AR')}</span>
                  </div>
                </div>
              ))}

              <h3 style={{ marginTop: '2rem' }}>Recomendaciones</h3>
              <div className="cart-page__recommended">
                {recommended.map(r => (
                  <div className="cart-page__rec-card" key={r.id}>
                    <img src={r.img} alt={r.name} />
                    <div>
                      <h4>{r.name}</h4>
                      <span>{r.type} — {r.location}</span>
                      <span className="cart-page__rec-price">${r.price.toLocaleString('es-AR')}/día</span>
                    </div>
                    <button className="btn btn--outline-green btn--sm">Alquilar</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="cart-page__summary">
              <h3>Resumen</h3>
              {cartItems.map(item => (
                <div className="cart-page__summary-row" key={item.id}>
                  <span>{item.name} ({item.days}d)</span>
                  <span>${(item.price * item.days).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="cart-page__summary-row"><span>Subtotal</span><span>${subtotal.toLocaleString('es-AR')}</span></div>
              <div className="cart-page__summary-row"><span>Seguro (5%)</span><span>${seguro.toLocaleString('es-AR')}</span></div>
              <div className="cart-page__summary-divider"></div>
              <div className="cart-page__summary-row cart-page__summary-row--total"><span>Total a pagar</span><span>${total.toLocaleString('es-AR')}</span></div>
              <button className="btn btn--orange btn--full" onClick={() => setStep(2)}>
                Continuar al Pago
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="cart-page__payment">
            <div className="cart-page__payment-form">
              <h2>Método de Pago</h2>
              <div className="cart-page__payment-options">
                {[
                  { id: 'transferencia', label: 'Transferencia Bancaria', icon: '🏦' },
                  { id: 'tarjeta', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
                  { id: 'billetera', label: 'Billetera Virtual', icon: '📱' },
                ].map(opt => (
                  <label key={opt.id} className={`cart-page__payment-opt ${paymentMethod === opt.id ? 'cart-page__payment-opt--active' : ''}`}>
                    <input type="radio" name="payment" value={opt.id} checked={paymentMethod === opt.id} onChange={e => setPaymentMethod(e.target.value)} />
                    <span className="cart-page__payment-opt-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              {paymentMethod === 'transferencia' && (
                <div className="cart-page__payment-info">
                  <p>Datos para transferencia:</p>
                  <div className="cart-page__payment-data">
                    <span><strong>Banco:</strong> Banco de la Nación Argentina</span>
                    <span><strong>Cuenta:</strong> Ahorro en Pesos N° 12345678</span>
                    <span><strong>CBU:</strong> 0110123456789012345678</span>
                    <span><strong>Alias:</strong> AGRORENT.PAGOS</span>
                    <span><strong>Titular:</strong> AgroRent S.A.</span>
                  </div>
                </div>
              )}
              {paymentMethod === 'tarjeta' && (
                <div className="cart-page__payment-info">
                  <div className="cart-page__form-group">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength="19" />
                  </div>
                  <div className="cart-page__form-row">
                    <div className="cart-page__form-group">
                      <label>Vencimiento</label>
                      <input type="text" placeholder="MM/AA" maxLength="5" />
                    </div>
                    <div className="cart-page__form-group">
                      <label>CVV</label>
                      <input type="text" placeholder="XXX" maxLength="4" />
                    </div>
                  </div>
                  <div className="cart-page__form-group">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="Como aparece en la tarjeta" />
                  </div>
                </div>
              )}
              {paymentMethod === 'billetera' && (
                <div className="cart-page__payment-info">
                  <p>Se redirigirá a la plataforma de pago seleccionada.</p>
                  <div className="cart-page__wallet-options">
                    <span className="cart-page__wallet">Mercado Pago</span>
                    <span className="cart-page__wallet">Ualá</span>
                    <span className="cart-page__wallet">Naranja X</span>
                  </div>
                </div>
              )}
              <div className="cart-page__payment-actions">
                <button className="btn btn--outline-green" onClick={() => setStep(1)}>Volver</button>
                <button className="btn btn--primary" onClick={() => setStep(3)}>
                  Continuar al Contrato
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            <div className="cart-page__summary cart-page__summary--sticky">
              <h3>Resumen del Pedido</h3>
              {cartItems.map(item => (
                <div className="cart-page__summary-row" key={item.id}>
                  <span>{item.name}</span>
                  <span>${(item.price * item.days).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="cart-page__summary-divider"></div>
              <div className="cart-page__summary-row cart-page__summary-row--total"><span>Total</span><span>${total.toLocaleString('es-AR')}</span></div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="cart-page__contract">
            <div className="cart-page__contract-doc">
              <h2>Contrato de Alquiler de Maquinaria Agrícola</h2>
              <div className="cart-page__contract-content">
                <p><strong>Entre:</strong> AgroRent S.A. (representando al arrendador) y el arrendatario identificado.</p>
                <h4>1. Objeto del Contrato</h4>
                <p>El presente contrato tiene por objeto el alquiler temporal de maquinaria agrícola detallada en el presente documento, para su uso exclusivo en actividades agropecuarias.</p>
                <h4>2. Duración</h4>
                <p>El período de alquiler se extiende desde el 15/03/2026 hasta el 20/03/2026 (5 días hábiles). La devolución deberá realizarse en la misma condición en que fue recibida.</p>
                <h4>3. Precio y Forma de Pago</h4>
                <p>El monto total a abonar es de ${total.toLocaleString('es-AR')}, que incluye el alquiler de los equipos y un seguro de protección contra daños.</p>
                <h4>4. Obligaciones del Arrendatario</h4>
                <ul>
                  <li>Utilizar la maquinaria conforme a las especificaciones técnicas del fabricante.</li>
                  <li>Reportar inmediatamente cualquier avería o mal funcionamiento.</li>
                  <li>No subarrendar ni transferir la maquinaria a terceros.</li>
                  <li>Devolver la maquinaria en las condiciones acordadas.</li>
                </ul>
                <h4>5. Seguro y Responsabilidad</h4>
                <p>AgroRent proporciona cobertura contra daños accidentales. El arrendatario será responsable por daños causados por uso indebido o negligencia comprobada.</p>
                <h4>6. Soporte Técnico</h4>
                <p>En caso de falla mecánica, AgroRent garantiza asistencia técnica en campo dentro de las primeras 24 horas de notificación.</p>
              </div>
              <label className="cart-page__contract-check">
                <input type="checkbox" checked={contractAccepted} onChange={e => setContractAccepted(e.target.checked)} />
                <span>He leído y acepto los términos y condiciones del contrato de alquiler.</span>
              </label>
            </div>

            <div className="cart-page__signature">
              <h3>Firma Digital</h3>
              <p>Dibujá tu firma en el recuadro o cargá una imagen.</p>
              <div className="cart-page__signature-box">
                <canvas
                  width="400"
                  height="150"
                  onMouseDown={(e) => {
                    const canvas = e.target;
                    const ctx = canvas.getContext('2d');
                    ctx.beginPath();
                    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                    setFirma(true);
                    const draw = (ev) => {
                      ctx.lineTo(ev.offsetX, ev.offsetY);
                      ctx.stroke();
                    };
                    canvas.addEventListener('mousemove', draw);
                    canvas.addEventListener('mouseup', () => canvas.removeEventListener('mousemove', draw));
                  }}
                ></canvas>
              </div>
              <div className="cart-page__signature-actions">
                <button className="btn btn--outline-green btn--sm" onClick={() => setFirma(null)}>Limpiar</button>
                <label className="btn btn--outline-green btn--sm cart-page__upload-btn">
                  Cargar Imagen
                  <input type="file" accept="image/*" hidden onChange={(e) => { if (e.target.files[0]) setFirma(URL.createObjectURL(e.target.files[0])); }} />
                </label>
              </div>
              {firma && <img src={firma} alt="Firma cargada" className="cart-page__signature-preview" />}
            </div>

            <div className="cart-page__contract-actions">
              <button className="btn btn--outline-green" onClick={() => setStep(2)}>Volver</button>
              <button
                className="btn btn--primary"
                disabled={!contractAccepted}
                onClick={() => setStep(4)}
              >
                Firmar Contrato
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="cart-page__confirmation">
            <div className="cart-page__confirmation-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#1E6B27" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="#2A8038" strokeWidth="2.5"/>
              </svg>
            </div>
            <h2>¡Contrato Enviado y Validado!</h2>
            <p>Tu reserva ha sido confirmada exitosamente. Recibirás un email con los detalles de la transacción y el contrato firmado.</p>
            <div className="cart-page__confirmation-details">
              <div className="cart-page__confirmation-row">
                <span>Número de reserva:</span><strong>AGR-2026-0847</strong>
              </div>
              <div className="cart-page__confirmation-row">
                <span>Equipos:</span><strong>{cartItems.length} unidades</strong>
              </div>
              <div className="cart-page__confirmation-row">
                <span>Total abonado:</span><strong>${total.toLocaleString('es-AR')}</strong>
              </div>
              <div className="cart-page__confirmation-row">
                <span>Estado:</span><span className="cart-page__status cart-page__status--confirmed">Confirmado</span>
              </div>
            </div>
            <div className="cart-page__confirmation-actions">
              <button className="btn btn--primary" onClick={() => navigate('/cliente')}>Ir a Mi Panel</button>
              <button className="btn btn--outline-green" onClick={() => navigate('/')}>Volver al Inicio</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
