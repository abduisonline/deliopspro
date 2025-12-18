import { motion, AnimatePresence } from 'framer-motion';
import { X, Car, Calendar, Shield, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { Vehicle } from '@/store/useStore';

interface EditVehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle | null;
}

export const EditVehicleModal = ({ open, onOpenChange, vehicle }: EditVehicleModalProps) => {
  const { updateVehicle } = useStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vehicle) return;

    const formData = new FormData(e.currentTarget);

    const plate = formData.get('plate') as string;
    const make = formData.get('make') as string;
    const model = formData.get('model') as string;
    const makeYear = formData.get('makeYear') as string;
    const chassisNumber = formData.get('chassisNumber') as string;
    const status = formData.get('status') as string;
    const insuranceExpiry = formData.get('insuranceExpiry') as string;
    const registrationExpiry = formData.get('registrationExpiry') as string;

    if (!plate || !make || !model || !status) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updates = {
      plate: plate.toUpperCase(),
      make,
      model,
      makeYear: makeYear ? parseInt(makeYear) : undefined,
      chassisNumber: chassisNumber || undefined,
      status: status as 'Available' | 'Assigned' | 'Maintenance' | 'Out of service',
      insuranceExpiry: new Date(insuranceExpiry),
      registrationExpiry: new Date(registrationExpiry),
    };

    updateVehicle(vehicle.id, updates);
    toast.success('Vehicle updated successfully!');
    onOpenChange(false);
  };

  if (!vehicle) return null;

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Car size={24} className="text-primary" />
                Edit Vehicle
              </DialogTitle>
              <DialogDescription>
                Update vehicle information and settings.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* License Plate */}
                <div className="space-y-2">
                  <Label htmlFor="plate" className="flex items-center gap-2">
                    <Car size={16} />
                    License Plate *
                  </Label>
                  <Input
                    id="plate"
                    name="plate"
                    defaultValue={vehicle.plate}
                    placeholder="e.g., D-12345-A"
                    className="uppercase"
                    required
                  />
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <Label htmlFor="make" className="flex items-center gap-2">
                    <Car size={16} />
                    Make *
                  </Label>
                  <Select name="make" defaultValue={vehicle.make} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bajaj">Bajaj</SelectItem>
                      <SelectItem value="Hero">Hero</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Suzuki">Suzuki</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div className="space-y-2">
                  <Label htmlFor="model" className="flex items-center gap-2">
                    <Car size={16} />
                    Model *
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    defaultValue={vehicle.model}
                    placeholder="e.g., Pulsar, Hiace, Sunny"
                    required
                  />
                </div>

                {/* Make Year */}
                <div className="space-y-2">
                  <Label htmlFor="makeYear" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Make Year
                  </Label>
                  <Input
                    id="makeYear"
                    name="makeYear"
                    type="number"
                    defaultValue={vehicle.makeYear || ''}
                    placeholder="e.g., 2022"
                    min="2000"
                    max="2025"
                  />
                </div>

                {/* Chassis Number */}
                <div className="space-y-2">
                  <Label htmlFor="chassisNumber" className="flex items-center gap-2">
                    <FileText size={16} />
                    Chassis Number
                  </Label>
                  <Input
                    id="chassisNumber"
                    name="chassisNumber"
                    defaultValue={vehicle.chassisNumber || ''}
                    placeholder="e.g., MD2A11CX4MCE49778"
                  />
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Shield size={16} />
                    Status *
                  </Label>
                  <Select name="status" defaultValue={vehicle.status} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Assigned">Assigned</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Out of service">Out of service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Insurance Expiry */}
                <div className="space-y-2">
                  <Label htmlFor="insuranceExpiry" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Insurance Expiry *
                  </Label>
                  <Input
                    id="insuranceExpiry"
                    name="insuranceExpiry"
                    type="date"
                    defaultValue={vehicle.insuranceExpiry.toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Registration Expiry */}
                <div className="space-y-2">
                  <Label htmlFor="registrationExpiry" className="flex items-center gap-2">
                    <Calendar size={16} />
                    Registration Expiry *
                  </Label>
                  <Input
                    id="registrationExpiry"
                    name="registrationExpiry"
                    type="date"
                    defaultValue={vehicle.registrationExpiry.toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button type="submit" className="px-6">
                  Update Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};