import { motion } from 'framer-motion';
import {
  Users,
  CheckCircle,
  ArrowRightLeft,
  Palmtree,
  CreditCard,
  Clock,
  XCircle,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';

interface StatusCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  priority?: boolean;
  delay?: number;
  onClick?: () => void;
}

const StatusCard = ({ title, count, icon, color, bgColor, borderColor, priority, delay = 0, onClick }: StatusCardProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: delay * 0.08, type: "spring", stiffness: 100 }}
    whileHover={{ scale: 1.02, x: 8 }}
    onClick={onClick}
    className={cn(
      "glass-card p-4 cursor-pointer group relative overflow-hidden",
      priority && "ring-2 ring-warning/50"
    )}
  >
    {priority && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-2 right-2"
      >
        <AlertTriangle size={16} className="text-warning animate-pulse" />
      </motion.div>
    )}
    
    <div className="flex items-center gap-4">
      <div className={cn("p-3 rounded-xl border", bgColor, borderColor)}>
        <span className={color}>{icon}</span>
      </div>
      
      <div className="flex-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="text-2xl font-bold font-display text-foreground">{count}</p>
      </div>
      
      <ChevronRight size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
    
    {/* Hover effect line */}
    <motion.div 
      initial={{ scaleX: 0 }}
      whileHover={{ scaleX: 1 }}
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent origin-left"
    />
  </motion.div>
);

interface DriverStatusBoardProps {
  onViewAll?: () => void;
}

export const DriverStatusBoard = ({ onViewAll }: DriverStatusBoardProps) => {
  const { drivers } = useStore();
  const navigate = useNavigate();

  const handleStatusClick = (status: string) => {
    const statusMap: Record<string, string> = {
      'Project Change': 'Project Change',
      'Total Drivers': 'All',
      'Active': 'Active',
      'On Vacation': 'Vacation',
      'License in Process': 'Driving License',
      'Idle': 'Idle',
      'Inactive': 'Inactive'
    };
    const filterValue = statusMap[status] || 'All';
    navigate(`/drivers?status=${encodeURIComponent(filterValue)}`);
  };

  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'Active').length;
  const projectChangeDrivers = drivers.filter(d => d.status === 'Project Change').length;
  const vacationDrivers = drivers.filter(d => d.status === 'Vacation').length;
  const licenseDrivers = drivers.filter(d => d.status === 'Driving License').length;
  const idleDrivers = drivers.filter(d => d.status === 'Idle').length;
  const inactiveDrivers = drivers.filter(d => d.status === 'Inactive').length;

  const driverStatuses = [
    {
      title: 'Project Change',
      count: projectChangeDrivers,
      icon: <ArrowRightLeft size={20} />,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/15',
      borderColor: 'border-purple-500/30',
      priority: projectChangeDrivers > 0
    },
    {
      title: 'Active',
      count: activeDrivers,
      icon: <CheckCircle size={20} />,
      color: 'text-success',
      bgColor: 'bg-success/15',
      borderColor: 'border-success/30'
    },
    {
      title: 'On Vacation',
      count: vacationDrivers,
      icon: <Palmtree size={20} />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/15',
      borderColor: 'border-blue-500/30'
    },
    {
      title: 'License in Process',
      count: licenseDrivers,
      icon: <CreditCard size={20} />,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/15',
      borderColor: 'border-amber-500/30'
    },
    {
      title: 'Idle',
      count: idleDrivers,
      icon: <Clock size={20} />,
      color: 'text-warning',
      bgColor: 'bg-warning/15',
      borderColor: 'border-warning/30'
    },
    {
      title: 'Inactive',
      count: inactiveDrivers,
      icon: <XCircle size={20} />,
      color: 'text-destructive',
      bgColor: 'bg-destructive/15',
      borderColor: 'border-destructive/30'
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-foreground">Driver Status Board</h2>
          <p className="text-sm text-muted-foreground">Real-time driver availability</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors"
        >
          View All
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {driverStatuses.map((status, idx) => (
          <StatusCard 
            key={status.title} 
            {...status} 
            delay={idx}
             onClick={() => handleStatusClick(status.title)}
          />
        ))}
      </div>
    </motion.div>
  );
};
