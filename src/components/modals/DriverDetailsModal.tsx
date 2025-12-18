import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Phone, CreditCard, Shield, FileText, MapPin, Edit, Save, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';

interface DriverDetailsModalProps {
  driver: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing?: boolean;
}

export const DriverDetailsModal = ({ driver, open, onOpenChange, isEditing: initialIsEditing = false }: DriverDetailsModalProps) => {
  const { userRole, updateDriver, deleteDriver, clients, vehicles } = useStore();
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [editedDriver, setEditedDriver] = useState({
    name: driver?.name || '',
    phone: driver?.phone || '',
    email: driver?.email || '',
    status: driver?.status || 'Active',
    licenseExpiry: driver?.licenseExpiry || new Date(),
  });

  useEffect(() => {
    if (driver) {
      setEditedDriver({
        name: driver.name || '',
        phone: driver.phone || '',
        email: driver.email || '',
        status: driver.status || 'Active',
        licenseExpiry: driver.licenseExpiry || new Date(),
      });
    }
  }, [driver]);

  if (!driver) return null;

  const handleSave = () => {
    updateDriver(driver.id, editedDriver);
    setIsEditing(false);
    toast.success('Driver updated successfully');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this driver? This action cannot be undone.')) {
      deleteDriver(driver.id);
      onOpenChange(false);
      toast.success('Driver deleted successfully');
    }
  };

  const isAdmin = userRole === 'Admin';

  // Find assigned client for background logo
  const assignedClient = driver?.assignedClient ? clients.find(client => client.name === driver.assignedClient) : null;

  // Find assigned vehicle details
  const assignedVehicle = driver?.assignedVehicle ? vehicles.find(vehicle => vehicle.id === driver.assignedVehicle) : null;

  const statusColors = {
    'Active': 'bg-success/20 text-success border-success/30',
    'Inactive': 'bg-destructive/20 text-destructive border-destructive/30',
    'Vacation': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Project Change': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Driving License': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Idle': 'bg-warning/20 text-warning border-warning/30',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl glass-card border-border/50 max-h-[90vh] overflow-hidden">
        {/* Background Logo for assigned drivers */}
        {assignedClient && (
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img
              src={assignedClient.logo}
              alt={`${assignedClient.name} background`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="sr-only">{driver.name} Details</DialogTitle>
            <DialogDescription className="sr-only">
              View and manage driver details, including personal information and assignments.
            </DialogDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name.replace(/\s+/g, '')}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`}
                    alt={`${driver.name} avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to User icon if image fails to load
                      const target = e.target as HTMLElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"><svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                      }
                    }}
                  />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">Driver Name</Label>
                      <Input
                        id="name"
                        value={editedDriver.name}
                        onChange={(e) => setEditedDriver(prev => ({ ...prev, name: e.target.value }))}
                        className="text-2xl font-display"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-display">{driver.name}</h2>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={statusColors[driver.status] || 'bg-muted'}>
                      {driver.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">ID: {driver.id}</span>
                  </div>
                </div>
              </div>
              {isAdmin && (
                <div className="flex gap-2">
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                  )}
                  {!isEditing && (
                    <Button variant="destructive" size="sm" onClick={handleDelete}>
                      <X size={16} className="mr-2" />
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
          >
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User size={18} />
                  Personal Information
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Full Name</span>
                    <span className="font-medium">{driver.name}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone size={14} />
                      Phone
                    </span>
                    {isEditing ? (
                      <Input
                        value={editedDriver.phone}
                        onChange={(e) => setEditedDriver(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-48"
                      />
                    ) : (
                      <span className="font-medium">{driver.phone || 'Not provided'}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Email</span>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedDriver.email}
                        onChange={(e) => setEditedDriver(prev => ({ ...prev, email: e.target.value }))}
                        className="w-48"
                      />
                    ) : (
                      <span className="font-medium">{driver.email || 'Not provided'}</span>
                    )}
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <MapPin size={14} />
                      Nationality
                    </span>
                    <span className="font-medium">Pakistan</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard size={18} />
                  Documents & IDs
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">EID Number</span>
                    <span className="font-medium font-mono">784-1998-2107240-4</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Shield size={14} />
                      Passport No
                    </span>
                    <span className="font-medium font-mono">DA3841512</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <FileText size={14} />
                      License No
                    </span>
                    <span className="font-medium font-mono">4240944.0</span>
                  </div>

                  <div className="flex justify-between items-center p-3 rounded-lg bg-muted/20">
                    <span className="text-sm text-muted-foreground">Traffic File No</span>
                    <span className="font-medium font-mono">15416517.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expiry Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>Visa Expiry</span>
                </div>
                <p className="font-medium">2026-11-02</p>
                <Badge variant="outline" className="text-xs">
                  245 days remaining
                </Badge>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield size={16} />
                  <span>Passport Expiry</span>
                </div>
                <p className="font-medium">2032-07-10</p>
                <Badge variant="outline" className="text-xs">
                  2085 days remaining
                </Badge>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText size={16} />
                  <span>License Expiry</span>
                </div>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedDriver.licenseExpiry.toISOString().split('T')[0]}
                    onChange={(e) => setEditedDriver(prev => ({
                      ...prev,
                      licenseExpiry: new Date(e.target.value)
                    }))}
                  />
                ) : (
                  <>
                    <p className="font-medium">{driver.licenseExpiry.toLocaleDateString()}</p>
                    <Badge variant="outline" className="text-xs">
                      Expired
                    </Badge>
                  </>
                )}
              </div>
            </div>

            {/* Assignment Information */}
            <div className="p-4 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold mb-3">Current Assignments</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{driver.assignedClient || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <div className="flex items-center gap-2">
                    {assignedVehicle?.logo && (
                      <img
                        src={assignedVehicle.logo}
                        alt={`${assignedVehicle.make} logo`}
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <p className="font-medium">
                      {assignedVehicle
                        ? `${assignedVehicle.plate} (${assignedVehicle.make} ${assignedVehicle.model}${assignedVehicle.makeYear ? ` ${assignedVehicle.makeYear}` : ''})`
                        : driver.assignedVehicle || 'Not assigned'
                      }
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SIM Card</p>
                  <p className="font-medium">{driver.assignedSim || 'Not assigned'}</p>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="p-4 rounded-lg bg-muted/20">
              <h3 className="text-lg font-semibold mb-3">Activity Status</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Activity</p>
                  <p className="font-medium">{driver.lastActivity.toLocaleString()}</p>
                </div>
                <Badge className={statusColors[driver.status] || 'bg-muted'}>
                  {driver.status}
                </Badge>
              </div>
            </div>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X size={16} className="mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
   );
};