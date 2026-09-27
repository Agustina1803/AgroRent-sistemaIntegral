export const INSURANCE_RATE = 0.05;

export const CATEGORIES = [
  'Todas',
  'Cosechadora',
  'Tractor',
  'Pulidora de Arroz',
  'Pulidora',
  'Cargadora',
];

export const LOCATIONS = ['Todas', 'Tucumán', 'Santiago del Estero', 'Salta', 'Catamarca'];

export const MACHINES = [
  { id: 1, name: 'John Deere S780', type: 'Cosechadora', brand: 'John Deere', price: 45000, rating: 4.9, reviews: 23, location: 'Tucumán', available: true, owner: 'AgroRent S.A.', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=280&fit=crop', desc: 'Cosechadora de alta capacidad para granos y cereales. Motor 543 HP.' },
  { id: 2, name: 'Case IH Magnum 340', type: 'Tractor', brand: 'Case IH', price: 32000, rating: 4.8, reviews: 18, location: 'Santiago del Estero', available: true, owner: 'Carlos García', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=280&fit=crop', desc: 'Tractor de alta potencia con transmisión CVT. Ideal para laboreo intensivo.' },
  { id: 3, name: 'Massey Ferguson 278', type: 'Pulidora de Arroz', brand: 'Massey Ferguson', price: 18000, rating: 4.7, reviews: 12, location: 'Salta', available: true, owner: 'AgroSur S.R.L.', img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=280&fit=crop', desc: 'Pulidora de arroz de alta eficiencia. Capacidad: 8 ton/h.' },
  { id: 4, name: 'New Holland CR10.90', type: 'Cosechadora', brand: 'New Holland', price: 52000, rating: 5.0, reviews: 31, location: 'Tucumán', available: false, owner: 'AgroRent S.A.', img: 'https://images.unsplash.com/photo-1605338195758-f8e50b670e65?w=400&h=280&fit=crop', desc: 'La cosechadora más potente de la gama. Torque de 653 HP.' },
  { id: 5, name: 'Valtra BH 194', type: 'Cargadora', brand: 'Valtra', price: 22000, rating: 4.6, reviews: 9, location: 'Catamarca', available: true, owner: 'AgroSur S.R.L.', img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=280&fit=crop', desc: 'Cargadora frontal con capacidad de 2.5m³. Equipo versátil.' },
  { id: 6, name: 'Jacto Uniport 3030', type: 'Pulidora', brand: 'Jacto', price: 15000, rating: 4.5, reviews: 14, location: 'Tucumán', available: true, owner: 'Carlos García', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=280&fit=crop', desc: 'Pulidora autopropulsada de precisión para cultivos extensivos.' },
  { id: 7, name: 'Claas Lexion 8700', type: 'Cosechadora', brand: 'Claas', price: 48000, rating: 4.9, reviews: 27, location: 'Tucumán', available: true, owner: 'AgroRent S.A.', img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=280&fit=crop', desc: 'Cosechadora premium con sistema CEMOS automático. 790 HP.' },
  { id: 8, name: 'Fendt 1050 Vario', type: 'Tractor', brand: 'Fendt', price: 38000, rating: 4.8, reviews: 15, location: 'Salta', available: true, owner: 'AgroSur S.R.L.', img: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=280&fit=crop', desc: 'Tractor de alta gama con transmisión Vario. 517 HP.' },
  { id: 9, name: 'AMAZONE Pantera 453', type: 'Pulidora', brand: 'Amazone', price: 20000, rating: 4.6, reviews: 11, location: 'Santiago del Estero', available: true, owner: 'Carlos García', img: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=400&h=280&fit=crop', desc: 'Pulidora autopropulsada con sistema SmartCenter.' },
];

const RECOMMENDED_IDS = [3, 6];

export function machineById(id) {
  return MACHINES.find(m => m.id === id) || null;
}

export function recommendedMachines() {
  return RECOMMENDED_IDS.map(machineById).filter(Boolean);
}

export function filterMachines(filters) {
  return MACHINES.filter(m => {
    if (filters.category && filters.category !== 'Todas' && m.type !== filters.category) return false;
    if (filters.location && filters.location !== 'Todas' && m.location !== filters.location) return false;
    if (typeof filters.maxPrice === 'number' && m.price > filters.maxPrice) return false;
    return true;
  });
}
