import { INSURANCE_RATE, machineById } from './machinesStore';

const RENTALS_KEY = 'agrorent_rentals';
const CART_KEY = 'agrorent_cart';

export const RENTAL_STATUS = {
  EN_CURSO: 'en curso',
  PROXIMO: 'próximo',
  COMPLETADO: 'completado',
};

export const RATEABLE_STATUS = [RENTAL_STATUS.EN_CURSO, RENTAL_STATUS.COMPLETADO];

const DEFAULT_DAYS = 3;
const EMPTY_CART = Object.freeze([]);

/* ---------- fechas ---------- */

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODate(date) {
  const d = startOfDay(date);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function addDays(date, days) {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function parseISODate(value) {
  if (!value) return null;
  const [y, m, d] = String(value).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function daysBetween(dateFrom, dateTo) {
  const from = parseISODate(dateFrom);
  const to = parseISODate(dateTo);
  if (!from || !to) return DEFAULT_DAYS;
  const diff = Math.round((to - from) / 86400000);
  return diff > 0 ? diff : DEFAULT_DAYS;
}

export function formatRange(dateFrom, dateTo) {
  const from = parseISODate(dateFrom);
  const to = parseISODate(dateTo);
  if (!from || !to) return '';
  const dd = d => String(d.getDate()).padStart(2, '0');
  const mm = d => String(d.getMonth() + 1).padStart(2, '0');
  return `${dd(from)}/${mm(from)} - ${dd(to)}/${mm(to)}/${to.getFullYear()}`;
}

export function rentalStatus(rental, today = new Date()) {
  const now = startOfDay(today);
  const from = parseISODate(rental.dateFrom);
  const to = parseISODate(rental.dateTo);
  if (!from || !to) return RENTAL_STATUS.PROXIMO;
  if (now > to) return RENTAL_STATUS.COMPLETADO;
  if (now < from) return RENTAL_STATUS.PROXIMO;
  return RENTAL_STATUS.EN_CURSO;
}

/* ---------- almacenamiento + caché ---------- */

let rentalsCache = null;
let cartCache = null;
const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function invalidate() {
  rentalsCache = null;
  cartCache = null;
  listeners.forEach(l => l());
}

function readJson(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key));
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin persistencia: los datos quedan solo en memoria */
  }
}

function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/* ---------- seeds ---------- */

function buildSeedRentals() {
  const today = new Date();
  const rows = [
    { machineId: 2, startOffset: -3, days: 5, paymentMethod: 'transferencia' },
    { machineId: 1, startOffset: 8, days: 5, paymentMethod: 'tarjeta' },
  ];

  return rows.map((row, index) => {
    const machine = machineById(row.machineId);
    const dateFrom = toISODate(addDays(today, row.startOffset));
    const dateTo = toISODate(addDays(today, row.startOffset + row.days));
    const subtotal = machine.price * row.days;

    return {
      id: `rent-seed-${index + 1}`,
      userId: 'usr-2',
      machine: machine.name,
      type: machine.type,
      brand: machine.brand,
      img: machine.img,
      location: machine.location,
      owner: machine.owner,
      dateFrom,
      dateTo,
      days: row.days,
      price: machine.price,
      total: Math.round(subtotal * (1 + INSURANCE_RATE)),
      paymentMethod: row.paymentMethod,
      reservationCode: `AGR-2026-${100 + index}`,
      createdAt: new Date().toISOString(),
    };
  });
}

export function allRentals() {
  if (rentalsCache) return rentalsCache;

  const stored = readJson(RENTALS_KEY);
  if (Array.isArray(stored) && stored.length > 0) {
    rentalsCache = stored;
  } else {
    rentalsCache = buildSeedRentals();
    writeJson(RENTALS_KEY, rentalsCache);
  }
  return rentalsCache;
}

function allCarts() {
  if (cartCache) return cartCache;
  const stored = readJson(CART_KEY);
  cartCache = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  return cartCache;
}

function saveCart(userId, items) {
  allCarts()[userId] = items;
  writeJson(CART_KEY, cartCache);
  invalidate();
}

/* ---------- alquileres ---------- */

export function rentalsFor(userId) {
  if (!userId) return EMPTY_CART;
  return allRentals().filter(r => r.userId === userId);
}

function newReservationCode(list) {
  const year = new Date().getFullYear();
  return `AGR-${year}-${900 + list.length + 1}`;
}

export function createRentalsFromOrder({ cart, user, paymentMethod }) {
  if (!user?.id || !cart?.length) return { ok: false, error: 'El carrito está vacío.' };

  const list = allRentals();
  const reservationCode = newReservationCode(list);

  const nuevos = cart.map(item => ({
    id: newId('rent'),
    userId: user.id,
    machine: item.name,
    type: item.type,
    brand: item.brand,
    img: item.img,
    location: item.location,
    owner: item.owner,
    dateFrom: item.dateFrom,
    dateTo: item.dateTo,
    days: item.days,
    price: item.price,
    total: Math.round(item.price * item.days * (1 + INSURANCE_RATE)),
    paymentMethod,
    reservationCode,
    createdAt: new Date().toISOString(),
  }));

  writeJson(RENTALS_KEY, [...list, ...nuevos]);
  rentalsCache = [...list, ...nuevos];
  invalidate();

  return { ok: true, reservationCode, rentals: nuevos };
}

/* ---------- carrito ---------- */

export function readCart(userId) {
  if (!userId) return EMPTY_CART;
  const items = allCarts()[userId];
  return Array.isArray(items) ? items : EMPTY_CART;
}

export function addCartItem(userId, machine, { dateFrom, dateTo }) {
  if (!userId || !machine) return;

  const items = readCart(userId);
  if (items.some(i => i.machineId === machine.id)) return;

  const from = dateFrom || toISODate(new Date());
  const to = dateTo || toISODate(addDays(new Date(), DEFAULT_DAYS));

  saveCart(userId, [
    ...items,
    {
      machineId: machine.id,
      name: machine.name,
      type: machine.type,
      brand: machine.brand,
      price: machine.price,
      location: machine.location,
      owner: machine.owner,
      img: machine.img,
      days: daysBetween(from, to),
      dateFrom: from,
      dateTo: to,
    },
  ]);
}

export function removeCartItem(userId, machineId) {
  saveCart(userId, readCart(userId).filter(i => i.machineId !== machineId));
}

export function clearCart(userId) {
  saveCart(userId, []);
}

export function cartTotals(items) {
  const subtotal = items.reduce((acc, i) => acc + i.price * i.days, 0);
  const seguro = Math.round(subtotal * INSURANCE_RATE);
  return { subtotal, seguro, total: subtotal + seguro };
}
