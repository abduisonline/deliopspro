import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Calendar, Users, TrendingUp, Edit, Trash2, Save, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ClientDetailsModalProps {
  client: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClientDetailsModal = ({ client, open, onOpenChange }: ClientDetailsModalProps) => {
  const { userRole, updateClient, deleteClient, drivers } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(client?.name || '');

  if (!client) return null;

  const handleSave = () => {
    updateClient(client.id, {
      name: editedName
    });
    setIsEditing(false);
    toast.success('Client updated successfully');
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      deleteClient(client.id);
      onOpenChange(false);
      toast.success('Client deleted successfully');
    }
  };

  const handleShowMore = () => {
    onOpenChange(false);
    navigate(`/drivers?client=${encodeURIComponent(client.name)}`);
  };

  const isAdmin = userRole === 'Admin';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-card border-border/50 max-h-[90vh] overflow-hidden">
        <div className="relative overflow-y-auto p-6">
          {/* Background Logo */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <img
              src={client.logo}
              alt={`${client.name} background`}
              className="w-full h-full object-cover"
            />
          </div>
          <DialogHeader>
            <DialogTitle className="sr-only">{client.name} Details</DialogTitle>
            <DialogDescription className="sr-only">
              View and manage client details, including assignments and contract information.
            </DialogDescription>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center overflow-hidden border border-border/50">
                  <img src={client.logo} alt={`${client.name} logo`} className="w-full h-full object-cover" />
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name</Label>
                      <Input
                        id="name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-display"
                      />
                    </div>
                  ) : (
                    <h2 className="text-2xl font-display">{client.name}</h2>
                  )}
                  <p className="text-sm text-muted-foreground">Client ID: {client.id}</p>
                </div>
              </div>
              {isAdmin && !isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 relative z-10"
        >
          {/* Contract Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>Contract Start</span>
              </div>
              <p className="font-medium">{client.contractStart.toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={16} />
                <span>Contract End</span>
              </div>
              <p className="font-medium">{client.contractEnd.toLocaleDateString()}</p>
            </div>
          </div>

          {/* Driver Assignment */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>Assigned Drivers ({client.assignedDrivers.length})</span>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {client.assignedDrivers.length > 0 ? (
                  client.assignedDrivers.slice(0, 4).map((driverId: string) => {
                    const driver = drivers.find(d => d.id === driverId);
                    return (
                      <Badge key={driverId} variant="outline">
                        {driver ? driver.name : `Driver ${driverId}`}
                      </Badge>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">No drivers assigned</p>
                )}
              </div>
              {client.assignedDrivers.length > 4 && (
                <Button variant="ghost" size="sm" onClick={handleShowMore} className="text-primary hover:text-primary/80">
                  <ChevronRight size={14} className="mr-1" />
                  Show More ({client.assignedDrivers.length - 4} more)
                </Button>
              )}
            </div>
          </div>

          {/* Contract Status */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div>
              <p className="font-medium">Contract Status</p>
              <p className="text-sm text-muted-foreground">Active and in good standing</p>
            </div>
            <Badge className="bg-success/20 text-success border-success/30">
              <TrendingUp size={14} className="mr-1" />
              Active
            </Badge>
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