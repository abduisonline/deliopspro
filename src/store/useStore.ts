import { create } from 'zustand';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'Total' | 'Active' | 'Project Change' | 'Vacation' | 'Driving License' | 'Idle' | 'Inactive';
  emiratesId: string;
  licenseNumber: string;
  licenseExpiry: Date;
  documents: Document[];
  assignedClient?: string;
  assignedVehicle?: string;
  assignedAssets: AssetAssignment[];
  assignedSim?: string;
  lastActivity: Date;
  idleStartDate?: Date;
  notes: string[];
  // Financial fields
  baseSalary: number;
  advancePaid: number;
  incentivesEarned: number;
  deductions: number;
  totalEarnings: number;
  netPayable: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  makeYear?: number;
  chassisNumber?: string;
  logo?: string;
  status: 'Available' | 'Assigned' | 'Maintenance' | 'Out of service';
  insuranceExpiry: Date;
  registrationExpiry: Date;
  assignedDriver?: string;
}

export interface Asset {
  id: string;
  name: string;
  type: string;
  totalQuantity: number;
  availableQuantity: number;
  assignments: AssetAssignment[];
}

export interface AssetAssignment {
  assetId: string;
  driverId: string;
  quantity: number;
  condition: 'Good' | 'Damaged' | 'Missing';
  note?: string;
}

export interface SimCard {
  id: string;
  number: string;
  carrier: string;
  plan: string;
  costCenter: string;
  status: 'Available' | 'Assigned';
  assignedDriver?: string;
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  contractStart: Date;
  contractEnd: Date;
  rateCard: number;
  sla: string;
  assignedDrivers: string[];
}

export interface Document {
  id: string;
  type: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  expiryDate?: Date;
  fileUrl?: string;
}

export interface Assignment {
  id: string;
  driverId: string;
  clientId: string;
  dateOfJoining: Date;
  payModel: 'Fixed' | 'Based on Orders';
  vehicleId?: string;
  simId?: string;
  assets: AssetAssignment[];
  status: string;
}

export interface User {
  email: string;
  name: string;
  title: string;
  avatar?: string;
  role: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  before: any;
  after: any;
  timestamp: Date;
  ip: string;
  device: string;
  reason?: string;
}

interface AppState {
  drivers: Driver[];
  vehicles: Vehicle[];
  assets: Asset[];
  sims: SimCard[];
  clients: Client[];
  assignments: Assignment[];
  auditLogs: AuditLog[];
  userRole: string;
  sidebarOpen: boolean;
  currentUser: User | null;

  // Actions
  setUserRole: (role: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null) => void;
  getUserByEmail: (email: string) => User | null;
  addDriver: (driver: Driver) => void;
  updateDriver: (id: string, updates: Partial<Driver>) => void;
  deleteDriver: (id: string) => void;
  addVehicle: (vehicle: Vehicle) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addAsset: (asset: Asset) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addSim: (sim: SimCard) => void;
  updateSim: (id: string, updates: Partial<SimCard>) => void;
   addClient: (client: Client) => void;
   updateClient: (id: string, updates: Partial<Client>) => void;
   deleteClient: (id: string) => void;
  createAssignment: (assignment: Assignment) => void;
  logAction: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

// User database
const usersDatabase: User[] = [
  // Staff members will be added by admin through the interface
  // No sample users - all accounts managed by admin
];

export const useStore = create<AppState>((set, get) => ({
  drivers: [],
  vehicles: [],
  assets: [],
  sims: [],
  clients: [],
  assignments: [],
  auditLogs: [],
  userRole: 'Admin',
  sidebarOpen: true,
  currentUser: null,

  setUserRole: (role) => set({ userRole: role }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentUser: (user) => set({ currentUser: user }),
  getUserByEmail: (email: string) => usersDatabase.find(user => user.email === email) || null,

  addDriver: (driver) => set((state) => ({ drivers: [...state.drivers, driver] })),

  updateDriver: (id, updates) => set((state) => ({
    drivers: state.drivers.map(d => d.id === id ? { ...d, ...updates } : d)
  })),

  deleteDriver: (id) => set((state) => ({
    drivers: state.drivers.filter(d => d.id !== id)
  })),

  addVehicle: (vehicle) => set((state) => ({ vehicles: [...state.vehicles, vehicle] })),

  updateVehicle: (id, updates) => set((state) => ({
    vehicles: state.vehicles.map(v => v.id === id ? { ...v, ...updates } : v)
  })),

  deleteVehicle: (id) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== id)
  })),

  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),

  updateAsset: (id, updates) => set((state) => ({
    assets: state.assets.map(a => a.id === id ? { ...a, ...updates } : a)
  })),

  deleteAsset: (id) => set((state) => ({
    assets: state.assets.filter(a => a.id !== id)
  })),

  addSim: (sim) => set((state) => ({ sims: [...state.sims, sim] })),

  updateSim: (id, updates) => set((state) => ({
    sims: state.sims.map(s => s.id === id ? { ...s, ...updates } : s)
  })),

   addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),

   updateClient: (id, updates) => set((state) => ({
     clients: state.clients.map(c => c.id === id ? { ...c, ...updates } : c)
   })),

   deleteClient: (id) => set((state) => ({
     clients: state.clients.filter(c => c.id !== id)
   })),

  createAssignment: (assignment) => set((state) => ({
    assignments: [...state.assignments, assignment]
  })),

  logAction: (log) => set((state) => ({
    auditLogs: [...state.auditLogs, {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),
}));