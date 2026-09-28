export const INSURANCE_RATE = 0.05;

export const CATEGORIES = [
  'Todas',
  'Cosechadora',
  'Tractor',
  'Pulidora de Arroz',
  'Pulidora',
  'Cargadora',
  'Pulverizadora',
];

export const LOCATIONS = ['Todas', 'Tucumán', 'Santiago del Estero', 'Salta', 'Catamarca'];

export const MACHINES = [
  {
    id: 1,
    name: 'John Deere S780',
    type: 'Cosechadora',
    brand: 'John Deere',
    price: 45000,
    rating: 4.9,
    reviews: 23,
    location: 'Tucumán',
    available: true,
    ownerId: 'usr-1',
    owner: 'Carlos García',
    img: 'https://images.unsplash.com/photo-1654187084777-4bfc97840652?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Cosechadora de alta capacidad para granos y cereales. Motor 543 HP.',
  },
  {
    id: 2,
    name: 'Case IH Magnum 340',
    type: 'Tractor',
    brand: 'Case IH',
    price: 32000,
    rating: 4.8,
    reviews: 18,
    location: 'Santiago del Estero',
    available: false,
    ownerId: 'usr-1',
    owner: 'Carlos García',
    img: 'https://images.unsplash.com/photo-1773415323680-ef13ebc61d7f?q=80&w=933&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Tractor de alta potencia con transmisión CVT. Ideal para laboreo intensivo.',
  },
  {
    id: 3,
    name: 'Massey Ferguson 278',
    type: 'Tractor',
    brand: 'Massey Ferguson',
    price: 18000,
    rating: 4.7,
    reviews: 12,
    location: 'Salta',
    available: true,
    ownerId: 'usr-3',
    owner: 'AgroNoa S.A.',
    img: 'https://images.unsplash.com/photo-1621884615781-6efdf78611dc?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Tractor utilitario ágil y económico. Ideal para labores generales y siembra liviana.',
  },
  {
    id: 4,
    name: 'New Holland CR10',
    type: 'Cosechadora',
    brand: 'New Holland',
    price: 52000,
    rating: 5.0,
    reviews: 31,
    location: 'Tucumán',
    available: false,
    ownerId: 'usr-1',
    owner: 'Carlos García',
    img: 'https://images.unsplash.com/photo-1784717098628-ec1c1bfa6872?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'La cosechadora más potente de la gama. Motor de 653 HP.',
  },
  {
    id: 5,
    name: 'Valtra BH194',
    type: 'Cargadora',
    brand: 'Valtra',
    price: 22000,
    rating: 4.6,
    reviews: 9,
    location: 'Catamarca',
    available: true,
    ownerId: 'usr-4',
    owner: 'Norte Maquinarias',
    img: 'https://images.unsplash.com/photo-1684954215462-cad9f3693b41?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Cargadora frontal con capacidad de 2.5m³. Equipo versátil.',
  },
  {
    id: 6,
    name: 'HORSCH Leeb 6300',
    type: 'Pulverizadora',
    brand: 'HORSCH',
    price: 15000,
    rating: 4.5,
    reviews: 14,
    location: 'Tucumán',
    available: true,
    ownerId: 'usr-1',
    owner: 'Carlos García',
    img: 'https://images.unsplash.com/photo-1690986375486-460dc48dd499?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    desc: 'Pulverizadora autopropulsada de precisión para cultivos extensivos.',
  },
];

const RECOMMENDED_IDS = [3, 6];

export function machineById(id) {
  return MACHINES.find(m => m.id === Number(id)) || null;
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