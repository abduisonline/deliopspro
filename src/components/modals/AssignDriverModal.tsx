import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Building2, Calendar, DollarSign, Smartphone, Car, Package, Plus, Minus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

interface AssignDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableDrivers = [
  { id: '1', name: 'Ahmed Hassan', status: 'Not Assigned' },
  { id: '2', name: 'Mohammed Ali', status: 'Not Assigned' },
  { id: '3', name: 'Khalid Omar', status: 'Not Assigned' },
];

const availableVehicles = [
  { id: '1', plate: 'DXB-4521', model: 'Toyota Hiace' },
  { id: '2', plate: 'ABD-7892', model: 'Nissan Urvan' },
  { id: '3', plate: 'SHJ-1234', model: 'Ford Transit' },
];

const availableSIMs = [
  { id: '1', number: '050-123-4567', carrier: 'Etisalat' },
  { id: '2', number: '055-987-6543', carrier: 'Du' },
];

const assetTypes = [
  { id: 'big-bag', name: 'Big Bag', available: 24 },
  { id: 'helmet', name: 'Helmet', available: 18 },
  { id: 'jacket', name: 'Jacket', available: 32 },
  { id: 'mask', name: 'Mask', available: 50 },
  { id: 'gloves', name: 'Gloves', available: 45 },
];

export const AssignDriverModal = ({ open, onOpenChange }: AssignDriverModalProps) => {
  const { drivers, vehicles, sims, assets: storeAssets, clients, createAssignment, updateDriver, updateVehicle, updateSim, updateAsset, logAction } = useStore();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [clientId, setClientId] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [payModel, setPayModel] = useState('');
  const [selectedSIM, setSelectedSIM] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [assetQuantities, setAssetQuantities] = useState<Record<string, number>>({});
  const [selectOpen, setSelectOpen] = useState(false);

  const unassignedDrivers = useMemo(() => drivers.filter(d => !d.assignedClient), [drivers]);
  const availableVehicles = vehicles.filter(v => v.status === 'Available');
  const availableSIMs = sims.filter(s => s.status === 'Available');
  const availableAssets = storeAssets.map(a => ({ ...a, available: a.availableQuantity }));

  useEffect(() => {
    if (!open) {
      // Reset form
      setSelectedDriver('');
      setClientId('');
      setDateOfJoining('');
      setPayModel('');
      setSelectedSIM('');
      setSelectedVehicle('');
      setAssetQuantities({});
      setSelectOpen(false);
    }
  }, [open]);

  const handleAssetQuantity = (assetId: string, delta: number) => {
    setAssetQuantities(prev => {
      const current = prev[assetId] || 0;
      const asset = availableAssets.find(a => a.id === assetId);
      const maxAvailable = asset ? asset.available : 0;
      const newValue = Math.max(0, Math.min(maxAvailable, current + delta));
      if (newValue === 0) {
        const { [assetId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [assetId]: newValue };
    });
  };

  const handleSubmit = () => {
    if (!selectedDriver || !clientId || !dateOfJoining || !payModel) {
      toast.error('Please fill in all required fields');
      return;
    }

    const driver = drivers.find(d => d.id === selectedDriver);
    if (!driver) return;

    const vehicle = selectedVehicle ? vehicles.find(v => v.id === selectedVehicle) : null;
    const sim = selectedSIM ? sims.find(s => s.id === selectedSIM) : null;
    const assetAssignments = Object.entries(assetQuantities).map(([assetId, qty]) => ({
      assetId,
      driverId: selectedDriver,
      quantity: qty,
      condition: 'Good' as const
    }));

    // Create assignment
    const assignment = {
      id: Date.now().toString(),
      driverId: selectedDriver,
      clientId,
      dateOfJoining: new Date(dateOfJoining),
      payModel: payModel as 'Fixed' | 'Based on Orders',
      vehicleId: selectedVehicle || undefined,
      simId: selectedSIM || undefined,
      assets: assetAssignments,
      status: 'Active'
    };
    createAssignment(assignment);

    // Update driver
    updateDriver(selectedDriver, {
      status: 'Active',
      assignedClient: clientId,
      assignedVehicle: vehicle?.plate,
      assignedSim: sim?.number,
      assignedAssets: assetAssignments
    });

    // Update vehicle
    if (vehicle) {
      updateVehicle(selectedVehicle, { status: 'Assigned', assignedDriver: selectedDriver });
    }

    // Update SIM
    if (sim) {
      updateSim(selectedSIM, { status: 'Assigned', assignedDriver: selectedDriver });
    }

    // Update assets
    assetAssignments.forEach(aa => {
      const asset = storeAssets.find(a => a.id === aa.assetId);
      if (asset) {
        updateAsset(aa.assetId, {
          availableQuantity: asset.availableQuantity - aa.quantity,
          assignments: [...asset.assignments, aa]
        });
      }
    });

    // Log action
    logAction({
      userId: 'admin', // In real app, get current user
      action: 'assign_driver',
      before: { driver: { ...driver, assignedClient: null } },
      after: { driver: { ...driver, assignedClient: clientId } },
      ip: '127.0.0.1', // Mock
      device: 'Web App'
    });

    toast.success('Driver assigned successfully!', {
      description: `${driver.name} has been assigned to ${clientId}.`
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-card border-border/50 p-0 overflow-visible">
        <DialogHeader className="p-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <div className="p-2 rounded-lg bg-success/15 border border-success/30">
              <User size={20} className="text-success" />
            </div>
            Assign New Driver
          </DialogTitle>
          <DialogDescription>
            Assign a driver to a client with vehicle, SIM, and assets.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
           {/* Driver Selection */}
           <div className="space-y-2">
             <Label className="text-sm text-muted-foreground">Select Driver *</Label>
             <Popover open={selectOpen} onOpenChange={setSelectOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   role="combobox"
                   aria-expanded={selectOpen}
                   className="w-full justify-between input-glass"
                 >
                   {selectedDriver
                     ? unassignedDrivers.find(driver => driver.id === selectedDriver)?.name
                     : "Select driver..."}
                   <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-full p-0" side="bottom" align="start" avoidCollisions={false}>
                 <Command>
                   <CommandInput placeholder="Search unassigned drivers..." />
                   <CommandEmpty>No driver found.</CommandEmpty>
                   <CommandGroup className="max-h-48 overflow-y-auto">
                     {unassignedDrivers.map(driver => (
                       <CommandItem
                         key={driver.id}
                         onSelect={() => {
                           setSelectedDriver(driver.id === selectedDriver ? "" : driver.id);
                           setSelectOpen(false);
                         }}
                       >
                         <span className="flex items-center gap-2">
                           {driver.name}
                           <span className="text-xs text-muted-foreground">(Not Assigned)</span>
                         </span>
                       </CommandItem>
                     ))}
                   </CommandGroup>
                 </Command>
               </PopoverContent>
             </Popover>
           </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Client ID */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 size={14} /> Client ID *
              </Label>
              <Input 
                className="input-glass" 
                placeholder="Enter client ID"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>

            {/* Date of Joining */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar size={14} /> Date of Joining *
              </Label>
              <Input 
                type="date" 
                className="input-glass"
                value={dateOfJoining}
                onChange={(e) => setDateOfJoining(e.target.value)}
              />
            </div>
          </div>

          {/* Pay Model */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <DollarSign size={14} /> Pay Model *
            </Label>
            <Select value={payModel} onValueChange={setPayModel}>
              <SelectTrigger className="input-glass">
                <SelectValue placeholder="Select pay model..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Salary</SelectItem>
                <SelectItem value="orders">Based on Orders</SelectItem>
                <SelectItem value="hybrid">Hybrid (Base + Orders)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SIM Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Smartphone size={14} /> Assign SIM
              </Label>
              <Select value={selectedSIM} onValueChange={setSelectedSIM}>
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select SIM..." />
                </SelectTrigger>
                <SelectContent>
                  {availableSIMs.map(sim => (
                    <SelectItem key={sim.id} value={sim.id}>
                      {sim.number} ({sim.carrier})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-2">
                <Car size={14} /> Assign Vehicle
              </Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger className="input-glass">
                  <SelectValue placeholder="Select vehicle..." />
                </SelectTrigger>
               <SelectContent>
                   {availableVehicles.map(vehicle => (
                     <SelectItem key={vehicle.id} value={vehicle.id}>
                       {vehicle.plate} - {vehicle.make} {vehicle.model}
                     </SelectItem>
                   ))}
               </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assets Selection */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Package size={14} /> Assign Assets
            </Label>
             <div className="grid grid-cols-2 gap-3">
               {availableAssets.map(asset => (
                 <motion.div
                   key={asset.id}
                   whileHover={{ scale: 1.02 }}
                   className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                 >
                   <div>
                     <p className="text-sm font-medium text-foreground">{asset.name}</p>
                     <p className="text-xs text-muted-foreground">{asset.available} available</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <Button
                       variant="ghost"
                       size="icon"
                       className="h-7 w-7"
                       onClick={() => handleAssetQuantity(asset.id, -1)}
                     >
                       <Minus size={14} />
                     </Button>
                     <span className="w-6 text-center font-medium">{assetQuantities[asset.id] || 0}</span>
                     <Button
                       variant="ghost"
                       size="icon"
                       className="h-7 w-7"
                       onClick={() => handleAssetQuantity(asset.id, 1)}
                     >
                       <Plus size={14} />
                     </Button>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="btn-primary-glow px-6 py-2 rounded-lg text-primary-foreground font-semibold"
          >
            Assign Driver
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
