import { motion } from 'framer-motion';
import { AlertTriangle, CreditCard, Shield, Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useMemo } from 'react';

interface AlertItemProps {
  type: 'license' | 'registration' | 'insurance';
  driverName: string;
  expiryDate: string;
  daysLeft: number;
  delay?: number;
}

const alertConfig = {
  license: { icon: CreditCard, label: 'Driving License' },
  registration: { icon: Shield, label: 'Registration' },
  insurance: { icon: Shield, label: 'Insurance' },
};

const AlertItem = ({ type, driverName, expiryDate, daysLeft, delay = 0 }: AlertItemProps) => {
  const { icon: Icon, label } = alertConfig[type];
  const urgency = daysLeft < 0 ? 'critical' : daysLeft <= 7 ? 'critical' : daysLeft <= 14 ? 'warning' : 'info';
  
  const urgencyStyles = {
    critical: 'border-destructive/50 bg-destructive/5',
    warning: 'border-warning/50 bg-warning/5',
    info: 'border-primary/50 bg-primary/5',
  };
  
  const badgeStyles = {
    critical: 'bg-destructive/20 text-destructive',
    warning: 'bg-warning/20 text-warning',
    info: 'bg-primary/20 text-primary',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:scale-[1.02] transition-transform",
        urgencyStyles[urgency]
      )}
    >
      <Icon size={18} className={urgency === 'critical' ? 'text-destructive' : urgency === 'warning' ? 'text-warning' : 'text-primary'} />
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{driverName}</p>
        <p className="text-xs text-muted-foreground">{label} • {expiryDate}</p>
      </div>
      
       <span className={cn("text-xs font-bold px-2 py-1 rounded-full", badgeStyles[urgency])}>
         {daysLeft < 0 ? 'Expired' : `${daysLeft}d`}
       </span>
    </motion.div>
  );
};

export const ExpiryAlerts = () => {
  const navigate = useNavigate();
  const { drivers, vehicles } = useStore();

  const alerts = useMemo(() => {
    const today = new Date();
    const allAlerts = [];

    // Driver license expiry alerts
    drivers.forEach(driver => {
      const daysLeft = Math.ceil((driver.licenseExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) { // Show alerts for next 30 days and expired items
        allAlerts.push({
          type: 'license' as const,
          driverName: driver.name,
          expiryDate: driver.licenseExpiry.toLocaleDateString(),
          daysLeft: Math.max(daysLeft, -999) // Cap negative values for sorting
        });
      }
    });

    // Vehicle insurance expiry alerts
    vehicles.forEach(vehicle => {
      const daysLeft = Math.ceil((vehicle.insuranceExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) { // Show alerts for next 30 days and expired items
        allAlerts.push({
          type: 'insurance' as const,
          driverName: `Vehicle ${vehicle.plate}`,
          expiryDate: vehicle.insuranceExpiry.toLocaleDateString(),
          daysLeft: Math.max(daysLeft, -999) // Cap negative values for sorting
        });
      }
    });

    // Vehicle registration expiry alerts
    vehicles.forEach(vehicle => {
      const daysLeft = Math.ceil((vehicle.registrationExpiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) { // Show alerts for next 30 days and expired items
        allAlerts.push({
          type: 'registration' as const,
          driverName: `Vehicle ${vehicle.plate}`,
          expiryDate: vehicle.registrationExpiry.toLocaleDateString(),
          daysLeft: Math.max(daysLeft, -999) // Cap negative values for sorting
        });
      }
    });

    // Sort by urgency (days left, ascending - most urgent first) and return top 5
    return allAlerts
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [drivers, vehicles]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" />
          <h2 className="text-lg font-bold font-display text-foreground">Expiry Alerts</h2>
        </div>
        <span className="text-xs text-muted-foreground px-2 py-1 bg-warning/10 text-warning rounded-full font-semibold">
          {alerts.length} Pending
        </span>
      </div>
      
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <AlertItem key={idx} {...alert} delay={idx} />
        ))}
      </div>
      
       <motion.button
         whileHover={{ x: 4 }}
         onClick={() => navigate('/compliance')}
         className="flex items-center gap-2 mt-4 text-sm text-primary font-medium hover:underline"
       >
         View All Alerts <ChevronRight size={16} />
       </motion.button>
      </div>
    </motion.div>
  );
};
