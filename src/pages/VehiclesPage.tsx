import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { AddVehicleModal } from '@/components/modals/AddVehicleModal';
import { EditVehicleModal } from '@/components/modals/EditVehicleModal';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Car } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const statusColors: Record<string, string> = {
  'Available': 'bg-green-500/15 text-green-400 border border-green-500/30',
  'Assigned': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  'Maintenance': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  'Out of service': 'bg-red-500/15 text-red-400 border border-red-500/30',
};

const VehiclesPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [editVehicleModalOpen, setEditVehicleModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<typeof vehicles[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    make: '',
    model: '',
    assignedDriver: '',
    insuranceExpiryBefore: '',
    insuranceExpiryAfter: '',
    registrationExpiryBefore: '',
    registrationExpiryAfter: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { vehicles, userRole, updateVehicle, sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Initialize with mock data if empty
    if (vehicles.length === 0) {
      // Data already initialized in App
    }
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      // Search query filter
      const matchesSearch = !searchQuery ||
        vehicle.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vehicle.assignedDriver && vehicle.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = !filters.status || vehicle.status === filters.status;

      // Make filter
      const matchesMake = !filters.make || vehicle.make.toLowerCase().includes(filters.make.toLowerCase());

      // Model filter
      const matchesModel = !filters.model || vehicle.model.toLowerCase().includes(filters.model.toLowerCase());

      // Assigned driver filter
      const matchesDriver = !filters.assignedDriver ||
        (vehicle.assignedDriver && vehicle.assignedDriver.toLowerCase().includes(filters.assignedDriver.toLowerCase()));

      // Insurance expiry filters
      const matchesInsuranceExpiry = (
        (!filters.insuranceExpiryBefore || vehicle.insuranceExpiry <= new Date(filters.insuranceExpiryBefore)) &&
        (!filters.insuranceExpiryAfter || vehicle.insuranceExpiry >= new Date(filters.insuranceExpiryAfter))
      );

      // Registration expiry filters
      const matchesRegistrationExpiry = (
        (!filters.registrationExpiryBefore || vehicle.registrationExpiry <= new Date(filters.registrationExpiryBefore)) &&
        (!filters.registrationExpiryAfter || vehicle.registrationExpiry >= new Date(filters.registrationExpiryAfter))
      );

      return matchesSearch && matchesStatus && matchesMake && matchesModel &&
             matchesDriver && matchesInsuranceExpiry && matchesRegistrationExpiry;
    });
  }, [vehicles, searchQuery, filters]);

  const { deleteVehicle } = useStore();

  const handleVehicleAction = (action: string, vehicle: typeof vehicles[0]) => {
    switch (action) {
      case 'View Details':
        toast.info(`Vehicle Details: ${vehicle.plate}`, {
          description: `${vehicle.make} ${vehicle.model}${vehicle.makeYear ? ` (${vehicle.makeYear})` : ''} | Chassis: ${vehicle.chassisNumber || 'N/A'} | Status: ${vehicle.status} | Insurance: ${vehicle.insuranceExpiry.toLocaleDateString()} | Registration: ${vehicle.registrationExpiry.toLocaleDateString()}`
        });
        break;
      case 'Edit Vehicle':
        setSelectedVehicle(vehicle);
        setEditVehicleModalOpen(true);
        break;
      case 'Delete Vehicle':
        if (window.confirm(`Are you sure you want to delete vehicle ${vehicle.plate}? This action cannot be undone.`)) {
          deleteVehicle(vehicle.id);
          toast.success(`Vehicle ${vehicle.plate} deleted successfully`);
        }
        break;
      default:
        toast.info(`${action}: ${vehicle.plate}`);
    }
  };

  const handleStatusChange = (vehicleId: string, newStatus: string) => {
    updateVehicle(vehicleId, { status: newStatus as 'Available' | 'Assigned' | 'Maintenance' | 'Out of service' });
    toast.success(`Vehicle status updated to ${newStatus}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAssign={userRole === 'Admin' || userRole === 'Staff' ? () => setAssignModalOpen(true) : undefined}
        onReassign={userRole === 'Admin' || userRole === 'Staff' ? () => setReassignModalOpen(true) : undefined}
      />

      {/* Main Content */}
      <div
        style={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? 288 : 64),
          transition: 'margin-left 0.3s ease'
        }}
        className="flex-1"
      >
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        <main className="p-6 space-y-6">
          {/* Page Title & Actions */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold font-display text-foreground">
                Vehicles
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all {vehicles.length} vehicles in your fleet
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              {(userRole === 'Admin' || userRole === 'Staff') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddVehicleModalOpen(true)}
                  className="btn-primary-glow px-4 py-2 rounded-lg text-primary-foreground font-semibold text-sm"
                >
                  + Add Vehicle
                </motion.button>
              )}
            </div>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by plate, make, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-lg transition-colors",
                showFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground hover:bg-muted/30"
              )}
            >
              <Filter size={16} />
              Filters
              {Object.values(filters).some(filter => filter !== '') && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </motion.div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
                <button
                  onClick={() => setFilters({
                    status: '',
                    make: '',
                    model: '',
                    assignedDriver: '',
                    insuranceExpiryBefore: '',
                    insuranceExpiryAfter: '',
                    registrationExpiryBefore: '',
                    registrationExpiryAfter: ''
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  >
                    <option value="">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of service">Out of service</option>
                  </select>
                </div>

                {/* Make Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Make</label>
                  <input
                    type="text"
                    placeholder="e.g., Toyota, Honda"
                    value={filters.make}
                    onChange={(e) => setFilters(prev => ({ ...prev, make: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Model Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g., Camry, Civic"
                    value={filters.model}
                    onChange={(e) => setFilters(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Assigned Driver Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    placeholder="Driver name or ID"
                    value={filters.assignedDriver}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedDriver: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Insurance Expiry Filters */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Insurance Expiry Before</label>
                  <input
                    type="date"
                    value={filters.insuranceExpiryBefore}
                    onChange={(e) => setFilters(prev => ({ ...prev, insuranceExpiryBefore: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Insurance Expiry After</label>
                  <input
                    type="date"
                    value={filters.insuranceExpiryAfter}
                    onChange={(e) => setFilters(prev => ({ ...prev, insuranceExpiryAfter: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Registration Expiry Filters */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Registration Expiry Before</label>
                  <input
                    type="date"
                    value={filters.registrationExpiryBefore}
                    onChange={(e) => setFilters(prev => ({ ...prev, registrationExpiryBefore: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Registration Expiry After</label>
                  <input
                    type="date"
                    value={filters.registrationExpiryAfter}
                    onChange={(e) => setFilters(prev => ({ ...prev, registrationExpiryAfter: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Vehicles Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Make/Model</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Driver</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Insurance Expiry</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle, idx) => (
                    <motion.tr
                      key={vehicle.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                       <td className="p-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
                             {vehicle.logo ? (
                               <img
                                 src={vehicle.logo}
                                 alt={`${vehicle.make} logo`}
                                 className="w-8 h-8 object-contain"
                               />
                             ) : (
                               <Car size={16} />
                             )}
                           </div>
                           <span className="font-medium text-foreground">{vehicle.plate}</span>
                         </div>
                       </td>
                      <td className="p-4 text-foreground">
                        {vehicle.make} {vehicle.model}
                        {vehicle.makeYear && <span className="text-muted-foreground text-sm ml-1">({vehicle.makeYear})</span>}
                      </td>
                      <td className="p-4">
                        <select
                          value={vehicle.status}
                          onChange={(e) => handleStatusChange(vehicle.id, e.target.value)}
                          className="px-3 py-1 rounded-full text-xs font-medium border-0 bg-transparent"
                          style={{ color: statusColors[vehicle.status]?.match(/text-([a-z]+-400)/)?.[1] }}
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Out of service">Out of service</option>
                        </select>
                      </td>
                      <td className="p-4 text-muted-foreground">{vehicle.assignedDriver ? `Driver ${vehicle.assignedDriver}` : '-'}</td>
                      <td className="p-4 text-muted-foreground">{vehicle.insuranceExpiry.toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-border/50">
                            <DropdownMenuItem onClick={() => handleVehicleAction('View Details', vehicle)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleVehicleAction('Edit Vehicle', vehicle)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleVehicleAction('Delete Vehicle', vehicle)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVehicles.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No vehicles found matching your search.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      {(userRole === 'Admin' || userRole === 'Staff') && (
        <>
          <AssignDriverModal
            open={assignModalOpen}
            onOpenChange={setAssignModalOpen}
          />
          <ReassignDriverModal
            open={reassignModalOpen}
            onOpenChange={setReassignModalOpen}
          />
          <AddVehicleModal
            open={addVehicleModalOpen}
            onOpenChange={setAddVehicleModalOpen}
          />
          <EditVehicleModal
            open={editVehicleModalOpen}
            onOpenChange={setEditVehicleModalOpen}
            vehicle={selectedVehicle}
          />
        </>
      )}
    </div>
  );
};

export default VehiclesPage;