export const ROLES = {
  ARRENDADOR: 'arrendador',
  CLIENTE: 'cliente',
};

export const ROLE_OPTIONS = [
  {
    id: ROLES.ARRENDADOR,
    label: 'Arrendador',
    description: 'Publico y administro mis máquinas',
    icon: '🚜',
  },
  {
    id: ROLES.CLIENTE,
    label: 'Cliente',
    description: 'Alquilo maquinaria para mi producción',
    icon: '🌾',
  },
];

export const ROLE_LABEL = {
  [ROLES.ARRENDADOR]: 'Arrendador',
  [ROLES.CLIENTE]: 'Cliente',
};

const PANEL_FOR_ROLE = {
  [ROLES.ARRENDADOR]: '/arrendador',
  [ROLES.CLIENTE]: '/cliente',
};

export function panelFor(rol) {
  return PANEL_FOR_ROLE[rol] || '/';
}

const SEED_USERS = [
  {
    id: 'usr-1',
    nombre: 'Carlos García',
    email: 'arrendador@agrorent.com',
    password: '123456',
    telefono: '+54 9 381 412-8890',
    ciudad: 'San Miguel de Tucumán',
    rol: ROLES.ARRENDADOR,
    createdAt: '2026-01-12T09:00:00.000Z',
  },
  {
    id: 'usr-2',
    nombre: 'Juan Pérez',
    email: 'cliente@agrorent.com',
    password: '123456',
    telefono: '+54 9 384 555-2134',
    ciudad: 'Santiago del Estero',
    rol: ROLES.CLIENTE,
    createdAt: '2026-02-03T14:30:00.000Z',
  },
];

export const DEMO_ACCOUNTS = SEED_USERS.map(({ email, password, nombre, rol }) => ({
  email,
  password,
  nombre,
  rol,
}));

const USERS_KEY = 'agrorent_users';
const SESSION_KEY = 'agrorent_session';
const REMEMBER_KEY = 'agrorent_remember';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || '').trim());
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function readItem(storage, key) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeItem(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    /* almacenamiento no disponible: la sesión queda solo en memoria */
  }
}

function removeItem(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    /* sin efecto */
  }
}

function readJson(storage, key, fallback) {
  const raw = readItem(storage, key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function store() {
  return {
    local: window.localStorage,
    session: window.sessionStorage,
  };
}

function readUsers() {
  const { local } = store();
  const stored = readJson(local, USERS_KEY, null);

  if (Array.isArray(stored) && stored.length > 0) return stored;
  writeItem(local, USERS_KEY, JSON.stringify(SEED_USERS));
  return SEED_USERS;
}

function saveUsers(users) {
  writeItem(store().local, USERS_KEY, JSON.stringify(users));
}

function toPublicUser(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    telefono: usuario.telefono || '',
    ciudad: usuario.ciudad || '',
    rol: usuario.rol,
    createdAt: usuario.createdAt,
  };
}

function newId() {
  return `usr-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function activeStorage(remember) {
  const { local, session } = store();
  return remember ? local : session;
}

export function login({ email, password, rol, remember = true }) {
  const found = readUsers().find(u => u.email === normalizeEmail(email));

  if (!found || found.password !== password) {
    return { ok: false, error: 'El email o la contraseña son incorrectos.' };
  }
  if (rol && found.rol !== rol) {
    return {
      ok: false,
      error: `Esta cuenta está registrada como ${ROLE_LABEL[found.rol]}. Elegí el tipo de usuario correcto.`,
    };
  }

  const { local, session } = store();
  writeItem(
    activeStorage(remember),
    SESSION_KEY,
    JSON.stringify({
      userId: found.id,
      email: found.email,
      rol: found.rol,
      remember,
      loggedAt: new Date().toISOString(),
    }),
  );
  writeItem(local, REMEMBER_KEY, String(remember));
  removeItem(remember ? session : local, SESSION_KEY);

  return { ok: true, user: toPublicUser(found) };
}

export function register({ nombre, email, password, confirmPassword, telefono, ciudad, rol }, remember = true) {
  const target = normalizeEmail(email);
  const users = readUsers();

  if (users.some(u => u.email === target)) {
    return { ok: false, error: 'Ya existe una cuenta con ese email. Intentá iniciar sesión.' };
  }
  if (String(password || '').length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: 'Las contraseñas no coinciden.' };
  }

  const nuevo = {
    id: newId(),
    nombre: String(nombre || '').trim(),
    email: target,
    password,
    telefono: String(telefono || '').trim(),
    ciudad: String(ciudad || '').trim(),
    rol,
    createdAt: new Date().toISOString(),
  };

  saveUsers([...users, nuevo]);
  return login({ email: target, password, remember });
}

export function logout() {
  const { local, session } = store();
  removeItem(local, SESSION_KEY);
  removeItem(session, SESSION_KEY);
}

export function restoreUser() {
  const { local } = store();
  const remember = readItem(local, REMEMBER_KEY) === 'true';
  const session = readJson(activeStorage(remember), SESSION_KEY, null);

  if (!session?.userId) return null;
  const found = readUsers().find(u => u.id === session.userId);
  return found ? toPublicUser(found) : null;
}

export function requestPasswordReset(email) {
  const target = normalizeEmail(email);
  const exists = readUsers().some(u => u.email === target);

  return {
    ok: true,
    exists,
    message: exists
      ? `Encontramos tu cuenta. Definí una nueva contraseña para ${target}.`
      : 'Si el email está registrado, vas a poder restablecer tu contraseña.',
  };
}

export function resetPassword({ email, password, confirmPassword }) {
  const target = normalizeEmail(email);
  const users = readUsers();
  const found = users.find(u => u.email === target);

  if (!found) return { ok: false, error: 'No encontramos una cuenta con ese email.' };
  if (String(password || '').length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  }
  if (password !== confirmPassword) {
    return { ok: false, error: 'Las contraseñas no coinciden.' };
  }

  saveUsers(users.map(u => (u.id === found.id ? { ...u, password } : u)));
  return { ok: true };
}
