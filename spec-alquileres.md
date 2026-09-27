# Spec — Módulo de alquileres (Catálogo → Carrito → Contrato → Mi Panel)

> Especificación de la cadena de reservas de AgroRent.
> Documenta qué se implementó, cómo funciona y cómo verificarlo.

**Fecha:** 2026-09-27
**Alcance:** Catálogo, carrito, checkout con pago y contrato, y panel del cliente.
**Estado:** Completo. `npm run lint` y `npm run build` sin errores.

---

## 1. Problema que se resolvió

La cadena de reservas estaba rota en tres puntos, de modo que **una reserva
firmada nunca llegaba al panel**:

| # | Dónde | Qué pasaba |
|---|---|---|
| A | `RentalPage.jsx` | El carrito vivía en `useState` local y se descartaba al navegar. `CartPage` mostraba 2 máquinas fijas, que no eran las elegidas. |
| B | `CartPage.jsx` | "Firmar Contrato" solo hacía `setStep(4)`. No se persistía nada. |
| C | `ClientDashboard.jsx` | `activeRentals` era una constante hardcodeada. Nunca leía de ningún store. |

Bugs colaterales corregidos en el camino:

| # | Dónde | Qué pasaba |
|---|---|---|
| D | `CartPage.jsx` | La firma dibujada a mano ponía `setFirma(true)`, y luego se renderizaba `<img src={true}>` → imagen rota. |
| E | `RentalPage.jsx` | `addToCart` guardaba `days: 3` fijo mientras la UI mostraba los días del filtro. El precio que veía el usuario no era el que se guardaba. |

---

## 2. Arquitectura

Dos módulos puros de datos, sin React, siguiendo la convención de `authStore.js`:

```
machinesStore.js   catálogo de máquinas (fuente única)
rentalsStore.js    alquileres + carrito, persistidos en localStorage
```

### `machinesStore.js`

Antes el catálogo estaba duplicado dentro de los componentes (`RentalPage`,
`CartPage`), que es justamente lo que rompía la cadena: el carrito no podía
recibir máquinas reales.

- `MACHINES` — 9 máquinas con `id`, `name`, `type`, `brand`, `price`, `location`, `owner`, `img`, `available`
- `CATEGORIES`, `LOCATIONS` — opciones de los filtros
- `INSURANCE_RATE` — 5 %, compartido por los cálculos de precio
- `machineById(id)`, `recommendedMachines()`, `filterMachines(filters)`

### `rentalsStore.js`

| Clave de `localStorage` | Contenido |
|---|---|
| `agrorent_rentals` | Lista de alquileres de todos los usuarios |
| `agrorent_cart` | Objeto `{ [userId]: ItemDeCarrito[] }` |

```js
// Item de carrito
{ machineId, name, type, brand, price, location, owner, img, days, dateFrom, dateTo }

// Alquiler
{ id, userId, machine, type, brand, img, location, owner,
  dateFrom, dateTo, days, price, total, paymentMethod,
  reservationCode, createdAt }
```

**API de alquileres**

| Función | Qué hace |
|---|---|
| `allRentals()` | Todos los alquileres, cacheado |
| `rentalsFor(userId)` | Filtra por usuario |
| `rentalStatus(rental, today?)` | Calcula el estado contra la fecha de hoy |
| `createRentalsFromOrder({ cart, user, paymentMethod })` | Crea **un alquiler por máquina** y devuelve el código de reserva |
| `newReservationCode()` | `AGR-<año>-<n correlativo>` |
| `RENTAL_STATUS`, `RATEABLE_STATUS` | Constantes |

**API de carrito**

| Función | Qué hace |
|---|---|
| `readCart(userId)` | Carrito del usuario |
| `addCartItem(userId, machine, { dateFrom, dateTo })` | Agrega; no duplica la misma máquina |
| `removeCartItem(userId, machineId)` | Quita una máquina |
| `clearCart(userId)` | Vacía el carrito (se llama al firmar) |
| `cartTotals(items)` | `{ subtotal, seguro, total }` con 5 % de seguro |

**Utilidades de fecha:** `toISODate`, `addDays`, `parseISODate`, `daysBetween`, `formatRange`.

> `formatRange` arma el texto a mano con `padStart` en vez de usar
> `toLocaleDateString('es-AR')`, porque el formato con ceros a la izquierda
> depende de la build de ICU del runtime y en Node salía `10/3` en vez de `10/03`.

---

## 3. Decisiones

| Tema | Decisión | Por qué |
|---|---|---|
| Persistencia | `localStorage` por `userId` | El carrito tiene que sobrevivir a la navegación y al reload; los alquileres son datos del usuario. |
| Estado del alquiler | **Calculado** contra la fecha de hoy | Un estado fijo se vuelve mentira: un alquiler de marzo seguía diciendo "en curso" meses después. |
| Fechas de ejemplo | Relativas a `new Date()` | Los seeds se arman al primer acceso con `hoy - 3 días` y `hoy + 8 días`, así la demo muestra "en curso" y "próximo" sin importar cuándo se presente. |
| Un alquiler por máquina | Firma en bloque, alquileres separados | El contrato firma un único período y un código de reserva, pero el panel muestra una tarjeta por máquina. |
| `/carrito` protegida | `RequireAuth` | Firma un contrato con datos del usuario; sin sesión no tiene sentido. |
| Snapshot del store | `useSyncExternalStore` | El store es la única fuente de verdad. El catálogo y el panel leen directo, sin estado duplicado. |

### Estados posibles

| Estado | Condición |
|---|---|
| `próximo` | hoy < `dateFrom` |
| `en curso` | `dateFrom` ≤ hoy ≤ `dateTo` (rango inclusivo) |
| `completado` | hoy > `dateTo` |

Mapeo a CSS: `próximo` → `--confirmed`, `en curso` → `--pending`,
`completado` → `--done` (agregada en esta implementación).

Solo `en curso` y `completado` son calificables (`RATEABLE_STATUS`).

---

## 4. Alquileres de ejemplo

Se generan la primera vez que se lee `agrorent_rentals`, etiquetados a
`usr-2` (`cliente@agrorent.com`):

| Máquina | Período | Estado |
|---|---|---|
| Case IH Magnum 340 | hace 3 días → +2 días | `en curso` |
| John Deere S780 | +8 días → +13 días | `próximo` |

Para regenerarlos: borrar `agrorent_rentals` de `localStorage`.

---

## 5. Flujo verificado

1. `/carrito` sin sesión → redirige a `/login`; al entrar vuelve con el carrito intacto.
2. En `/catalogo` se eligen 2 máquinas con un rango de 5 días → el carrito guarda esas máquinas con sus fechas.
3. `/carrito` lista esas 2 máquinas, no las fijas, con el total y el 5 % de seguro calculados.
4. El contrato muestra el período real, el total real, el método de pago y la lista de equipos.
5. "Firmar Contrato" crea los alquileres, vacía el carrito y muestra el código de reserva generado.
6. "Ir a Mi Panel" → los alquileres firmados aparecen en "Mis Alquileres" con su estado.
7. Recargar → los alquileres siguen ahí.
8. El carrito quedó vacío tras firmar.
9. Entrar como `arrendador@agrorent.com` → no ve los alquileres del cliente.
10. La firma dibujada a mano se ve como imagen.
11. Un usuario recién registrado ve el estado vacío con CTA al catálogo.
12. Un alquiler `próximo` no se puede calificar; uno `en curso` o `completado` sí.

---

## 6. Deuda técnica conocida

| # | Tema | Impacto |
|---|---|---|
| 1 | `LandlordDashboard` sigue hardcodeado | El alquiler nuevo no aparece en el Historial del arrendador ni su máquina cambia a "alquilada". La otra punta del negocio quedó desconectada. |
| 2 | Reportes y calificaciones hardcodeados | La pestaña "Reportes" y el envío de calificaciones no persisten. |
| 3 | Un alquiler por máquina sin relación entre sí | No hay un concepto de "reserva" agrupando varios alquileres; comparten `reservationCode`. |
| 4 | Rango de fechas único por carrito | Todo el carrito se alquila por el mismo período. |
| 5 | Fechas en `<input type="date">` sin validar | Se puede elegir `dateTo` anterior a `dateFrom`; `daysBetween` cae al default de 3 días. |
| 6 | Sin tests en el repo | `rentalsStore.js` es puro y testeable (54 casos verificados con un harness temporal), pero no hay runner. `useSyncExternalStore` impide renderizar los componentes con `react-dom/server` sin un shim. |
| 7 | Sin backend | Los alquileres son por navegador; se pierden al borrar `localStorage`. |
| 8 | La firma no es obligatoria ni se persiste | Se dibuja y se previsualiza bien, pero el botón "Firmar Contrato" solo exige marcar el checkbox de aceptación, y el data URL no se guarda con el alquiler. |
