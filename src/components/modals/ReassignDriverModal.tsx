import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X, AlertTriangle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface ReassignDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ItemStatus = 'pending' | 'returned' | 'missing';

export const ReassignDriverModal = ({ open, onOpenChange }: ReassignDriverModalProps) => {
  const { drivers } = useStore();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>({});
  const [missingNotes, setMissingNotes] = useState<Record<string, string>>({});
  const [reason, setReason] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  // Filter assigned drivers
  const assignedDrivers = useMemo(() => {
    return drivers.filter(driver => driver.status === 'Active');
  }, [drivers]);

  const driver = drivers.find(d => d.id === selectedDriver);

  const handleItemStatus = (itemKey: string, status: ItemStatus) => {
    setItemStatuses(prev => ({ ...prev, [itemKey]: status }));
    if (status !== 'missing') {
      setMissingNotes(prev => {
        const { [itemKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleMissingNote = (itemKey: string, note: string) => {
    setMissingNotes(prev => ({ ...prev, [itemKey]: note }));
  };

  const allItemsHandled = () => {
    if (!driver) return false;
    const items = ['sim', 'vehicle', ...(driver.assignedAssets || []).map((_, i) => `asset-${i}`)];
    return items.every(item => {
      const status = itemStatuses[item];
      if (status === 'missing') return !!missingNotes[item];
      return status === 'returned';
    });
  };

  const canSubmit = selectedDriver && reason && newStatus && allItemsHandled();

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error('Please complete all required fields');
      return;
    }
    
    const missingCount = Object.values(itemStatuses).filter(s => s === 'missing').length;
    
    toast.success('Driver re-assigned successfully!', {
      description: missingCount > 0 
        ? `${driver?.name} moved to ${newStatus}. ${missingCount} missing item(s) logged.`
        : `${driver?.name} moved to ${newStatus}.`
    });
    
    onOpenChange(false);
    setSelectedDriver('');
    setItemStatuses({});
    setMissingNotes({});
    setReason('');
    setNewStatus('');
  };

  const StatusButton = ({ 
    itemKey, 
    status 
  }: { 
    itemKey: string; 
    status: ItemStatus;
  }) => {
    const currentStatus = itemStatuses[itemKey];
    
    return (
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleItemStatus(itemKey, 'returned')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all",
            currentStatus === 'returned'
              ? "bg-success/20 text-success border border-success/50"
              : "bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50"
          )}
        >
          <Check size={12} /> Returned
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleItemStatus(itemKey, 'missing')}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all",
            currentStatus === 'missing'
              ? "bg-destructive/20 text-destructive border border-destructive/50"
              : "bg-muted/30 text-muted-foreground border border-border/50 hover:bg-muted/50"
          )}
        >
          <X size={12} /> Missing
        </motion.button>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-card border-border/50 p-0 overflow-visible">
        <DialogHeader className="p-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-display flex items-center gap-2">
            <div className="p-2 rounded-lg bg-warning/15 border border-warning/30">
              <RefreshCw size={20} className="text-warning" />
            </div>
            Re-assign Driver
          </DialogTitle>
          <DialogDescription>
            Re-assign a driver and handle asset returns or missing items.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
           {/* Driver Selection */}
           <div className="space-y-2">
             <Label className="text-sm text-muted-foreground">Select Assigned Driver *</Label>
             <Popover open={selectOpen} onOpenChange={setSelectOpen}>
               <PopoverTrigger asChild>
                 <Button
                   variant="outline"
                   role="combobox"
                   aria-expanded={selectOpen}
                   className="w-full justify-between input-glass"
                 >
                   {selectedDriver
                     ? assignedDrivers.find(driver => driver.id === selectedDriver)?.name
                     : "Select driver..."}
                   <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-full p-0" side="bottom" align="start" avoidCollisions={false}>
                 <Command>
                   <CommandInput placeholder="Search drivers..." />
                   <CommandEmpty>No driver found.</CommandEmpty>
                   <CommandGroup className="max-h-48 overflow-y-auto">
                     {assignedDrivers.map(driver => (
                       <CommandItem
                         key={driver.id}
                         onSelect={() => {
                           setSelectedDriver(driver.id === selectedDriver ? "" : driver.id);
                           setSelectOpen(false);
                         }}
                       >
                         <span className="flex items-center gap-2">
                           {driver.name}
                           <span className="text-xs text-muted-foreground">({driver.assignedClient || 'No Client'})</span>
                         </span>
                       </CommandItem>
                     ))}
                   </CommandGroup>
                 </Command>
               </PopoverContent>
             </Popover>
           </div>

          {driver && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Current Assignment Info */}
               <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                 <h4 className="font-semibold text-foreground mb-3">Current Assignment</h4>
                 <div className="grid grid-cols-2 gap-3 text-sm">
                   <div><span className="text-muted-foreground">Client:</span> <span className="text-foreground">{driver.assignedClient || 'N/A'}</span></div>
                   <div><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{driver.phone || 'N/A'}</span></div>
                   <div><span className="text-muted-foreground">Emirates ID:</span> <span className="text-foreground">{driver.emiratesId || 'N/A'}</span></div>
                 </div>
               </div>

              {/* Items Status */}
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Return Status</h4>
                
                 {/* SIM */}
                 {driver.assignedSim && (
                   <div className="p-3 rounded-lg bg-muted/10 border border-border/30 space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium">SIM: {driver.assignedSim}</span>
                       <StatusButton itemKey="sim" status={itemStatuses['sim'] || 'pending'} />
                     </div>
                     <AnimatePresence>
                       {itemStatuses['sim'] === 'missing' && (
                         <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                         >
                           <Textarea
                             placeholder="Reason for missing SIM (required)..."
                             className="input-glass text-xs"
                             value={missingNotes['sim'] || ''}
                             onChange={(e) => handleMissingNote('sim', e.target.value)}
                           />
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 )}

                 {/* Vehicle */}
                 {driver.assignedVehicle && (
                   <div className="p-3 rounded-lg bg-muted/10 border border-border/30 space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium">Vehicle: {driver.assignedVehicle}</span>
                       <StatusButton itemKey="vehicle" status={itemStatuses['vehicle'] || 'pending'} />
                     </div>
                     <AnimatePresence>
                       {itemStatuses['vehicle'] === 'missing' && (
                         <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                         >
                           <Textarea
                             placeholder="Reason for missing vehicle (required)..."
                             className="input-glass text-xs"
                             value={missingNotes['vehicle'] || ''}
                             onChange={(e) => handleMissingNote('vehicle', e.target.value)}
                           />
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 )}

                 {/* Assets */}
                 {(driver.assignedAssets || []).map((asset, idx) => (
                   <div key={idx} className="p-3 rounded-lg bg-muted/10 border border-border/30 space-y-2">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium">{asset.assetId} (x{asset.quantity})</span>
                       <StatusButton itemKey={`asset-${idx}`} status={itemStatuses[`asset-${idx}`] || 'pending'} />
                     </div>
                     <AnimatePresence>
                       {itemStatuses[`asset-${idx}`] === 'missing' && (
                         <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: 'auto' }}
                           exit={{ opacity: 0, height: 0 }}
                         >
                           <Textarea
                             placeholder={`Reason for missing ${asset.assetId} (required)...`}
                             className="input-glass text-xs"
                             value={missingNotes[`asset-${idx}`] || ''}
                             onChange={(e) => handleMissingNote(`asset-${idx}`, e.target.value)}
                           />
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 ))}
              </div>

              {/* Reason for Re-assignment */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Reason for Re-assignment *</Label>
                <Textarea
                  placeholder="Enter the reason for this re-assignment..."
                  className="input-glass"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* New Status */}
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">New Driver Status *</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="input-glass">
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="project-change">Project Change</SelectItem>
                    <SelectItem value="cancellation">Cancellation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-border/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <motion.button
            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "px-6 py-2 rounded-lg font-semibold transition-all",
              canSubmit
                ? "btn-primary-glow text-primary-foreground"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            Confirm Re-assignment
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
