import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, Tag, Hash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

interface AddAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddAssetModal = ({ open, onOpenChange }: AddAssetModalProps) => {
  const { addAsset } = useStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const type = formData.get('type') as string;
    const totalQuantity = formData.get('totalQuantity') as string;

    if (!name || !type || !totalQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(totalQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      toast.error('Total quantity must be a positive number');
      return;
    }

    const newAsset = {
      id: `asset_${Date.now()}`,
      name,
      type,
      totalQuantity: quantity,
      availableQuantity: quantity,
      assignments: []
    };

    addAsset(newAsset);
    toast.success('Asset added successfully!');
    onOpenChange(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-2xl glass-card border-border/50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Package size={24} className="text-primary" />
                Add New Asset
              </DialogTitle>
              <DialogDescription>
                Enter asset details to add it to your inventory.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Asset Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Package size={16} />
                    Asset Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g., Safety Helmet, Work Gloves"
                    required
                  />
                </div>

                {/* Asset Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <Tag size={16} />
                    Asset Type *
                  </Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Safety">Safety</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Communication">Communication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="totalQuantity" className="flex items-center gap-2">
                    <Hash size={16} />
                    Total Quantity *
                  </Label>
                  <Input
                    id="totalQuantity"
                    name="totalQuantity"
                    type="number"
                    placeholder="e.g., 50"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Available quantity will be set to match total quantity initially.
                  As assets are assigned to drivers, the available quantity will be automatically updated.
                </p>
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
                  Add Asset
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};