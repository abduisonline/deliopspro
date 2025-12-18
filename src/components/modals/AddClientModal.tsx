import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { Client } from '@/store/useStore';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientModal = ({ open, onOpenChange }: AddClientModalProps) => {
  const { addClient } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    contractStart: '',
    contractEnd: '',
    rateCard: '',
    sla: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Client name is required');
      return;
    }

    if (!formData.contractStart || !formData.contractEnd) {
      toast.error('Contract dates are required');
      return;
    }

    if (!formData.rateCard || isNaN(Number(formData.rateCard))) {
      toast.error('Valid rate card is required');
      return;
    }

    setIsLoading(true);

    try {
      const newClient: Client = {
        id: `client_${Date.now()}`,
        name: formData.name.trim(),
        logo: formData.logo.trim() || '/placeholder.svg', // Default logo if not provided
        contractStart: new Date(formData.contractStart),
        contractEnd: new Date(formData.contractEnd),
        rateCard: Number(formData.rateCard),
        sla: formData.sla.trim() || 'Standard SLA',
        assignedDrivers: []
      };

      addClient(newClient);

      toast.success('Client added successfully!', {
        description: `${newClient.name} has been added to the system.`
      });

      // Reset form
      setFormData({
        name: '',
        logo: '',
        contractStart: '',
        contractEnd: '',
        rateCard: '',
        sla: ''
      });

      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add client', {
        description: 'Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md glass-card border-border/50">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Create a new client profile with contract and billing information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Client Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>

          <div>
            <Label htmlFor="logo">Logo URL</Label>
            <Input
              id="logo"
              value={formData.logo}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png (optional)"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractStart">Contract Start *</Label>
              <Input
                id="contractStart"
                type="date"
                value={formData.contractStart}
                onChange={(e) => handleInputChange('contractStart', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="contractEnd">Contract End *</Label>
              <Input
                id="contractEnd"
                type="date"
                value={formData.contractEnd}
                onChange={(e) => handleInputChange('contractEnd', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rateCard">Rate Card (AED) *</Label>
            <Input
              id="rateCard"
              type="number"
              value={formData.rateCard}
              onChange={(e) => handleInputChange('rateCard', e.target.value)}
              placeholder="5000"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <Label htmlFor="sla">SLA Agreement</Label>
            <Textarea
              id="sla"
              value={formData.sla}
              onChange={(e) => handleInputChange('sla', e.target.value)}
              placeholder="Service Level Agreement details"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};