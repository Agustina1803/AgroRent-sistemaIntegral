const PREGUNTAS = [
  {
    q: '¿Qué cubre el seguro incluido en el alquiler?',
    a: 'Todo alquiler incluye una cobertura del 5 % sobre el total, que cubre daños accidentales durante el período contratado. Quedan excluidos los daños por uso indebido, negligencia comprobada o por no seguir las indicaciones del fabricante. El contrato que firmás detalla el alcance exacto.',
  },
  {
    q: '¿Qué pasa si la máquina se rompe durante el trabajo?',
    a: 'Tenés que reportar la avería apenas ocurra desde tu panel, en la pestaña Reportes. AgroRent garantiza asistencia técnica en campo dentro de las primeras 24 horas de notificación. Los días que no puedas usar la máquina se descuentan del total.',
  },
  {
    q: '¿Cómo se cobran los días de alquiler?',
    a: 'Elegís las fechas en el catálogo y el precio se calcula por día. El período es completo: el día de inicio y el de devolución son ambos facturados. El total se calcula al agregar al carrito, sumando el subtotal y el seguro.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Transferencia bancaria, tarjeta de crédito o débito, y billeteras virtuales como Mercado Pago, Ualá y Naranja X. El método elegido queda registrado en tu alquiler y en el contrato firmado.',
  },
  {
    q: '¿Necesito registrarme para reservar?',
    a: 'Sí. Podés ver todo el catálogo sin sesión, pero para agregar máquinas al carrito, firmar el contrato y ver tus alquileres necesitás una cuenta. Te lleva menos de un minuto y podés elegir entre rol de productor o de arrendador.',
  },
  {
    q: '¿Cómo sé si una máquina está libre?',
    a: 'Cada ficha del catálogo muestra su estado de disponibilidad. Al filtrar por ubicación y fechas, solo te aparecen los equipos que están disponibles para el período que elegiste, así que podés reservar sin confirmar nada por teléfono.',
  },
];

export default function Faq() {
  return (
    <section className="faq" id="faq">
      <div className="container">
        <div className="faq__header">
          <span className="faq__label">Preguntas Frecuentes</span>
          <h2 className="faq__title">Lo que suelen preguntarnos</h2>
          <p className="faq__desc">
            Si no encontrás tu respuesta, escribinos y te ayudamos directo.
          </p>
        </div>

        <div className="faq__list">
          {PREGUNTAS.map(p => (
            <details className="faq__item" key={p.q}>
              <summary className="faq__question">
                <span>{p.q}</span>
                <svg
                  className="faq__icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="faq__answer">{p.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
