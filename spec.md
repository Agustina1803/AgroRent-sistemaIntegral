# Spec — Módulo de autenticación (Login / Registro / Recuperación)

> Especificación de la funcionalidad de autenticación agregada a AgroRent.
> Documenta qué se implementó, cómo funciona y cómo verificarlo.

**Fecha:** 2026-09-27
**Alcance:** Sistema de ingreso con dos tipos de usuario (`arrendador` / `cliente`),
protección de rutas y gestión de sesión en el navegador.
**Estado:** Completo. `npm run lint` y `npm run build` sin errores.

---

## 1. Objetivo

El proyecto tenía dos paneles — `/arrendador` y `/cliente` — accesibles sin
autenticación. Esta implementación agrega:

- Inicio de sesión, alta de cuenta y recuperación de contraseña.
- Dos tipos de usuario diferenciados, cada uno con su panel.
- Protección de rutas: sin sesión no se entra; con el rol incorrecto se rebota.
- Persistencia de la sesión entre recargas.

Todo del lado del cliente, sin backend, consistente con el resto del proyecto
(los datos están hardcodeados en los componentes).

---

## 2. Cuentas de prueba

Definidas en `src/components/authStore.js` (`SEED_USERS`) y expuestas en la UI
como `DEMO_ACCOUNTS`, con un botón de autofill en el pie del login.

| Email | Contraseña | Nombre | Rol | Redirige a |
|---|---|---|---|---|
| `arrendador@agrorent.com` | `123456` | Carlos García | `arrendador` | `/arrendador` |
| `cliente@agrorent.com` | `123456` | Juan Pérez | `cliente` | `/cliente` |

Datos completos de los usuarios semilla:

| Campo | Arrendador | Cliente |
|---|---|---|
| `id` | `usr-1` | `usr-2` |
| `telefono` | +54 9 381 412-8890 | +54 9 384 555-2134 |
| `ciudad` | San Miguel de Tucumán | Santiago del Estero |
| `createdAt` | 2026-01-12T09:00:00.000Z | 2026-02-03T14:30:00.000Z |

**Importante:** las contraseñas son texto plano en el código. Esto es aceptable
para una demo, pero **no** debe replicarse cuando exista un backend real.

### Limpiar los datos de prueba
Borrar las claves del almacenamiento del navegador y recargar:
```js
localStorage.clear();
sessionStorage.clear();
```
Las cuentas semilla se vuelven a escribir solas en la próxima carga.

---

## 3. Rutas

| Ruta | Componente | Protegida | Notas |
|---|---|---|---|
| `/` | `LandingPage` | No | — |
| `/catalogo` | `RentalPage` | No | — |
| `/carrito` | `CartPage` | No | — |
| `/arrendador` | `LandlordDashboard` | `RequireRole rol="arrendador"` | — |
| `/cliente` | `ClientDashboard` | `RequireRole rol="cliente"` | — |
| `/login` | `LoginPage` | — | Fuera de `Layout`, pantalla completa |
| `/registro` | `RegisterPage` | — | Fuera de `Layout`, pantalla completa |
| `/recuperar-clave` | `ForgotPasswordPage` | — | Fuera de `Layout`, pantalla completa |
| `*` | `NotFoundPage` | — | 404 dentro de `Layout` |

Las tres pantallas de auth quedan **fuera de `<Layout>`** a propósito: son
full-screen y un header sticky más un footer arruinan el split screen.

---

## 4. Archivos creados

| Archivo | Líneas | Responsabilidad |
|---|---|---|
| `src/components/authStore.js` | 258 | Capa de datos pura, sin React. Seed, login, registro, logout, restauración de sesión, recuperación de clave, constantes de rol. |
| `src/components/AuthContext.jsx` | 59 | Binding a React. `AuthProvider` + hook `useAuth()`. |
| `src/components/RequireAuth.jsx` | 13 | Guarda de sesión. |
| `src/components/RequireRole.jsx` | 23 | Guarda de rol. |
| `src/components/LoginPage.jsx` | 208 | Inicio de sesión. |
| `src/components/RegisterPage.jsx` | 244 | Alta de cuenta. |
| `src/components/ForgotPasswordPage.jsx` | 198 | Recuperación de contraseña (2 pasos). |
| `src/components/NotFoundPage.jsx` | 25 | Ruta 404. |
| `src/components/AuthBrandPanel.jsx` | 65 | Panel verde de marca, reutilizado por las 3 pantallas. |
| `src/components/AuthField.jsx` | 88 | Campo de formulario con label, error, hint y toggle de contraseña. |
| `src/components/RoleSelector.jsx` | 30 | Selector de tipo de usuario. |

**Total nuevo: 1211 líneas.**

### Por qué `authStore.js` está separado de `AuthContext.jsx`

La regla de ESLint `react-refresh/only-export-components` no permite exportar
constantes ni funciones desde un archivo que exporta componentes. Mezclarlas
habría exigido 8 líneas `eslint-disable`. Además, separar la capa de datos de la
capa de React permite testear la lógica de autenticación de forma aislada.

`AuthContext.jsx` conserva un único `eslint-disable` a nivel de archivo para el
hook `useAuth`, que es la convención estándar de React.

---

## 5. Archivos modificados

| Archivo | Cambios |
|---|---|
| `src/App.jsx` | +44 líneas. Envuelve las rutas en `<AuthProvider>`, agrega las 3 rutas de auth, protege los 2 paneles con `RequireRole`, agrega la ruta `*`. |
| `src/components/Header.jsx` | +155 líneas. Menú de usuario con sesión, dropdown, logout, avatar con iniciales. |
| `src/components/Layout.jsx` | +25 líneas. Banner de acceso denegado. |
| `src/App.css` | +993 líneas. Bloques `header__*` de usuario, `auth` completo, `notfound` y `access-alert`. |

**Total: 1194 inserciones, 23 eliminaciones.** CSS final: 3543 líneas.

---

## 6. Modelo de datos

```js
{
  id:        'usr-1',
  nombre:    'Carlos García',
  email:     'arrendador@agrorent.com',   // normalizado a minúsculas
  password:  '123456',                     // texto plano (solo demo)
  telefono:  '+54 9 381 412-8890',
  ciudad:    'San Miguel de Tucumán',
  rol:       'arrendador' | 'cliente',
  createdAt: '2026-01-12T09:00:00.000Z',
}
```

### Persistencia en el navegador

| Clave | Almacenamiento | Contenido |
|---|---|---|
| `agrorent_users` | `localStorage` | Array de usuarios (semilla + registrados) |
| `agrorent_session` | `localStorage` o `sessionStorage` | `{ userId, email, rol, remember, loggedAt }` |
| `agrorent_remember` | `localStorage` | `"true"` / `"false"` |

`agrorent_session` **nunca** guarda el password.

---

## 7. API del contexto

```js
const { user, isAuthenticated, panelFor, login, register, logout,
        requestPasswordReset, resetPassword } = useAuth();
```

| Miembro | Tipo | Descripción |
|---|---|---|
| `user` | `object \| null` | Usuario público (sin password). `null` si no hay sesión. |
| `isAuthenticated` | `boolean` | `Boolean(user)`. |
| `panelFor` | `string` | Ruta del panel según el rol. `'/'` si no hay sesión. |
| `login(email, password, rol, remember)` | `{ ok, user } \| { ok: false, error }` | Valida credenciales y, si se pasa `rol`, que coincida. |
| `register(data, remember)` | `{ ok, user } \| { ok: false, error }` | Alta + login automático. |
| `logout()` | `void` | Limpia la sesión de ambos almacenamientos. |
| `requestPasswordReset(email)` | `{ ok, exists, message }` | Siempre `ok: true`, no revela si el email existe. |
| `resetPassword({ email, password, confirmPassword })` | `{ ok } \| { ok: false, error }` | Cambia la contraseña. |

### Reglas de validación

- Email: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`, normalizado a minúsculas y sin espacios.
- Contraseña: mínimo 6 caracteres.
- El registro requiere confirmación de contraseña coincidente.
- Email duplicado: rechazado.
- El `password` nunca sale del store: `toPublicUser()` lo filtra.

---

## 8. Protección de rutas

### Sin sesión
`RequireAuth` redirige a `/login` guardando la ruta pretendida:
```js
<Navigate to="/login" state={{ from: location }} replace />
```
`LoginPage` lee `state.from` y vuelve a esa ruta tras el ingreso. Así, si un
usuario deslogueado abre `/arrendador`, aterriza en su panel y no en el home.

### Rol incorrecto
`RequireRole` rebota al panel propio pasando el motivo por `state.denied`:
```js
<Navigate to={panelFor(user.rol)} state={{ denied: { attempted, required } }} replace />
```
`Layout.jsx` lee ese estado y muestra un banner: *"Tu cuenta es de tipo Cliente,
por eso no podés ver el panel de Arrendador"*, con botón "Entendido" que limpia
el estado.

> **Nota de implementación:** el aviso se muestra en `Layout` y no en `LoginPage`
> como estaba planeado. El camino original era inalcanzable: el guard rebota
> directo al panel del usuario, así que nunca pasa por el login.

### Casos borde cubiertos
- `state.from` apunta a un panel del rol contrario → doble redirección, pero el
  resultado final es el panel correcto con el banner de aviso.
- Visitante a `/login` con sesión activa → `Navigate` al panel, sin parpadeo.

---

## 9. Comportamiento de "Recordarme"

| Checkbox | Almacenamiento | Al cerrar la pestaña | Al recargar (F5) |
|---|---|---|---|
| Marcado | `localStorage` | Sesión activa | Sesión activa |
| Desmarcado | `sessionStorage` | **Sesión cerrada** | Sesión activa |

Es el comportamiento estándar de los navegadores: `sessionStorage` sobrevive al
F5 y se limpia al cerrar la pestaña.

> **Nota:** en el plan original se había descripto que el F5 cerraba la sesión.
> Se implementó con `sessionStorage` por ser el estándar de la industria y
> mejor experiencia de uso.

Al cambiar de modo, el store borra la sesión del almacenamiento contrario, así
que no quedan sesiones huérfanas.

---

## 10. Accesibilidad (WCAG 2.2 AA)

- Cada input tiene `<label htmlFor>` con `id` generado por `useId()`.
- `aria-invalid` + `aria-describedby` apuntan al mensaje de error o al hint.
- Un solo `role="alert"` por formulario; los avisos de éxito usan `role="status"`.
- Toggle de contraseña: `<button type="button">` con `aria-label` dinámico y
  `aria-pressed`. No envía el formulario y **es alcanzable con teclado**.
- Selector de rol: `<fieldset>` + `<legend>`, botones con `aria-pressed`.
- `autocomplete` correcto por campo: `email`, `current-password`,
  `new-password`, `name`, `tel`, `address-level2`.
- `:focus-visible` con `outline` de 2px en todos los controles nuevos.
- El cierre del dropdown del header responde a `Escape` y a click fuera.
- Iconos decorativos con `aria-hidden="true"`.

### Pendiente conocido
`index.html:2` declara `lang="en"` con toda la UI en español. Afecta la
pronunciación de los lectores de pantalla. Fix de una palabra, no aplicado.

---

## 11. Verificación

### Automatizada
Se ejecutó un harness temporal contra `authStore.js` con un stub de `Storage`:
**22 casos, 22 OK.** El archivo se borró después (el proyecto no tiene
infraestructura de tests).

Cobertura: seed y `panelFor`, login correcto, email con mayúsculas y espacios,
password incorrecto, email inexistente, rol incorrecto, persistencia con y sin
"recordarme", limpieza de sesión previa, logout, `userId` inexistente, JSON
corrupto, registro (éxito, duplicado, contraseña corta, confirmación distinta),
login posterior al registro, recuperación de contraseña, y `isValidEmail`.

### Manual
```bash
npm run lint     # sin errores
npm run build    # sin errores
npm run dev
```

Checklist funcional:

1. Abrir `/arrendador` sin sesión → redirige a `/login`.
2. Ingresar como `arrendador@agrorent.com` → vuelve a `/arrendador`.
3. Con sesión de cliente, navegar a `/arrendador` → rebota a `/cliente` con banner.
4. Registrarse con un email nuevo → login automático y panel del rol elegido.
5. Desmarcar "Recordarme", cerrar y reabrir la pestaña → sesión cerrada.
6. Marcar "Recordarme", recargar → sesión activa.
7. "Cerrar sesión" desde el dropdown → `/arrendador` vuelve a estar protegida.
8. `/ruta-inexistente` → 404 con enlaces.
9. Login social (Google / Apple) → mensaje de "no disponible en esta versión".

---

## 12. Deuda técnica conocida

| # | Tema | Impacto |
|---|---|---|
| 1 | Passwords en texto plano en el código | Crítico al integrar un backend. Debe migrarse a hashing en el servidor. |
| 2 | Sin backend ni API | Todo es local. Multi-dispositivo no funciona. |
| 3 | Recuperación de contraseña simulada | Muestra el paso 2 directo; en realidad debería ir por email con token. |
| 4 | Login social decorativo | Los botones solo muestran un aviso. |
| 5 | `index.html` con `lang="en"` | Pronunciación incorrecta en lectores de pantalla. |
| 6 | `submitting` no se ve nunca | El login es síncrono; el estado dura un render. Queda listo para un backend real. |
| 7 | Sin tests en el repo | La lógica de `authStore.js` se puede testear sin React, pero no hay runner. |
