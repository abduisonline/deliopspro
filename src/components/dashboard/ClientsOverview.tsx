import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, TrendingUp, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStore, Client } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { ClientDetailsModal } from '@/components/modals/ClientDetailsModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ClientCardProps {
  client: Client;
  delay?: number;
  onClick?: () => void;
  onMenuAction?: (action: string, client: Client) => void;
  userRole: string;
  navigate: (path: string) => void;
}

const ClientCard = ({ client, delay = 0, onClick, userRole, onMenuAction, navigate }: ClientCardProps) => {
  const driversAssigned = client.assignedDrivers.length;
  const driverCapacity = 10; // Mock capacity
  const compliance = 95; // Mock compliance
  const trend = 10; // Mock trend
  const logo = client.logo;
  const fillPercentage = (driversAssigned / driverCapacity) * 100;

  const handleMenuAction = (action: string) => {
    onMenuAction(action, client);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="glass-card-hover p-5 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-xl font-bold overflow-hidden">
            <img src={logo} alt={`${client.name} logo`} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{client.name}</h3>
            <p className="text-xs text-muted-foreground">Active Project</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical size={18} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card border-border/50">
            <DropdownMenuItem onClick={() => handleMenuAction('View Details')}>
              View Details
            </DropdownMenuItem>
            {userRole === 'Admin' && (
              <DropdownMenuItem onClick={() => handleMenuAction('Edit Project')}>
                Edit Project
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleMenuAction('View Drivers')}>
              View Drivers
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuAction('Export Report')}>
              Export Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Driver Capacity Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Driver Capacity</span>
          <span className="text-sm font-semibold text-foreground">{driversAssigned}/{driverCapacity}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${fillPercentage}%` }}
            transition={{ delay: delay * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              fillPercentage >= 90 ? "bg-success" : fillPercentage >= 70 ? "bg-primary" : "bg-warning"
            )}
          />
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-xs font-semibold px-2 py-0.5 rounded-full",
            compliance >= 95 ? "bg-success/15 text-success" : compliance >= 80 ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive"
          )}>
            {compliance}% Compliant
          </span>
        </div>
        <div className="flex items-center gap-1 text-success text-sm">
          <TrendingUp size={14} />
          <span className="font-semibold">+{trend}%</span>
        </div>
      </div>
    </motion.div>
  );
};

interface ClientsOverviewProps {
  onManageClients?: () => void;
}

export const ClientsOverview = ({ onManageClients }: ClientsOverviewProps) => {
  const { clients, userRole } = useStore();
  const navigate = useNavigate();
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);

  const handleClientClick = (client: Client) => {
    navigate('/clients');
  };

  const handleMenuAction = (action: string, client: Client) => {
    if (action === 'Edit Project' && userRole !== 'Admin') {
      toast.error('Access denied', { description: 'Only Admin can edit projects' });
      return;
    }

    switch (action) {
      case 'View Details':
        setSelectedClient(client);
        setClientDetailsOpen(true);
        break;
      case 'Edit Project':
        toast.info('Edit Project', { description: 'Edit functionality is now available' });
        break;
      case 'View Drivers':
        navigate(`/drivers?client=${encodeURIComponent(client.id)}`);
        break;
      case 'Export Report':
        toast.success('Report exported successfully');
        break;
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          position: 'relative',
          borderRadius: '26px',
          padding: '26px',
          background: `
            radial-gradient(1200px 500px at 50% -20%, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 55%),
            linear-gradient(180deg, rgba(11,18,36,.78), rgba(11,18,36,.58))
          `,
          boxShadow: '0 30px 80px rgba(0,0,0,.55)',
          border: '1px solid rgba(255,255,255,.08)',
          overflow: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        <div
          style={{
            content: '""',
            position: 'absolute',
            inset: '-2px',
            background: `
              radial-gradient(700px 380px at 65% 35%, rgba(22,199,132,.22), transparent 55%),
              radial-gradient(650px 360px at 40% 60%, rgba(20,184,255,.18), transparent 58%),
              radial-gradient(520px 360px at 35% 40%, rgba(255,77,79,.12), transparent 60%)
            `,
            opacity: '.55',
            filter: 'blur(10px)',
            zIndex: 0,
            animation: 'pulseGlow 6.5s cubic-bezier(.2,.9,.2,1) infinite alternate'
          }}
        ></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold font-display text-foreground">Clients Overview</h2>
            <p className="text-sm text-muted-foreground">Active project assignments</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onManageClients}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/30 rounded-lg hover:bg-primary/20 transition-colors"
          >
            <Building2 size={16} />
            Manage Clients
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client, idx) => (
          <ClientCard
            key={client.id}
            client={client}
            delay={idx}
            onClick={() => handleClientClick(client)}
            userRole={userRole}
            onMenuAction={handleMenuAction}
            navigate={navigate}
          />
        ))}
        </div>
        </div>
      </motion.div>

      <ClientDetailsModal
        client={selectedClient}
        open={clientDetailsOpen}
        onOpenChange={setClientDetailsOpen}
      />
    </div>
  );
};
