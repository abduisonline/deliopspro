import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus } from 'lucide-react';

interface FabProps {
  onAssign: () => void;
  onReassign: () => void;
  visible: boolean;
}

export const Fab: React.FC<FabProps> = ({ onAssign, onReassign, visible }) => {
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="mb-2">
          <DropdownMenuItem onClick={() => { onAssign(); setOpen(false); }}>
            Assign Driver
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { onReassign(); setOpen(false); }}>
            Reassign Driver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};