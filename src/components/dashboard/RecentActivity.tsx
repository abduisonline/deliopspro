import { motion } from 'framer-motion';
import { UserPlus, RefreshCw, FileText, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useMemo } from 'react';

interface ActivityItemProps {
  type: 'assign' | 'reassign' | 'document' | 'alert';
  title: string;
  description: string;
  time: string;
  user: string;
  delay?: number;
}

const iconMap = {
  assign: { icon: UserPlus, color: 'text-success', bg: 'bg-success/15' },
  reassign: { icon: RefreshCw, color: 'text-warning', bg: 'bg-warning/15' },
  document: { icon: FileText, color: 'text-primary', bg: 'bg-primary/15' },
  alert: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/15' },
};

const ActivityItem = ({ type, title, description, time, user, delay = 0 }: ActivityItemProps) => {
  const { icon: Icon, color, bg } = iconMap[type];
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.08 }}
      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group"
    >
      <div className={cn("p-2 rounded-lg", bg)}>
        <Icon size={16} className={color} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-muted-foreground">{user}</span>
          <span className="text-[10px] text-muted-foreground/50">•</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock size={10} />
            {time}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RecentActivity = () => {
  const { auditLogs, drivers, vehicles, clients } = useStore();

  const activities = useMemo(() => {
    // Transform audit logs into activity format
    const transformedActivities = auditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Most recent first
      .slice(0, 10) // Limit to 10 most recent activities
      .map(log => {
        let type: 'assign' | 'reassign' | 'document' | 'alert' = 'assign';
        let title = '';
        let description = '';

        // Determine activity type and details based on action
        switch (log.action) {
          case 'assign_driver': {
            type = 'assign';
            title = 'Driver Assigned';
            if (log.after?.driver?.assignedClient) {
              const client = clients.find(c => c.id === log.after.driver.assignedClient);
              description = `${log.after.driver.name} assigned to ${client?.name || log.after.driver.assignedClient}`;
            }
            break;
          }
          case 'update_driver': {
            type = 'document';
            title = 'Driver Updated';
            description = `${log.after?.name || 'Driver'} profile updated`;
            break;
          }
          case 'update_vehicle': {
            type = 'document';
            title = 'Vehicle Updated';
            const vehicle = vehicles.find(v => v.id === log.after?.id);
            description = `${vehicle?.plate || 'Vehicle'} status changed to ${log.after?.status || 'Updated'}`;
            break;
          }
          case 'add_driver': {
            type = 'assign';
            title = 'New Driver Added';
            description = `${log.after?.name || 'New driver'} added to system`;
            break;
          }
          case 'add_vehicle': {
            type = 'assign';
            title = 'New Vehicle Added';
            description = `${log.after?.plate || 'New vehicle'} added to fleet`;
            break;
          }
          default: {
            type = 'alert';
            title = log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            description = 'System activity recorded';
          }
        }

        // Calculate relative time
        const now = new Date();
        const logTime = new Date(log.timestamp);
        const diffMs = now.getTime() - logTime.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        let time = '';
        if (diffMins < 1) time = 'Just now';
        else if (diffMins < 60) time = `${diffMins} min ago`;
        else if (diffHours < 24) time = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        else time = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

        return {
          type,
          title,
          description,
          time,
          user: log.userId === 'admin' ? 'Admin' : log.userId,
          delay: 0
        };
      });

    // If no audit logs, show a default message
    if (transformedActivities.length === 0) {
      return [{
        type: 'alert' as const,
        title: 'System Ready',
        description: 'Fleet management system initialized and ready for operations',
        time: 'Just now',
        user: 'System',
        delay: 0
      }];
    }

    return transformedActivities;
  }, [auditLogs, vehicles, clients]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
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
        transform: 'translateZ(0)',
        height: '100%'
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
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold font-display text-foreground">Recent Activity</h2>
        <span className="text-xs text-muted-foreground px-2 py-1 bg-muted/50 rounded-full">
          Live
          <span className="inline-block w-1.5 h-1.5 bg-success rounded-full ml-2 animate-pulse" />
        </span>
      </div>
      
       <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
         {activities.length > 0 ? (
           activities.map((activity, idx) => (
             <ActivityItem key={activity.title + idx} {...activity} delay={idx} />
           ))
         ) : (
           <div className="p-4 text-center text-muted-foreground">
             <p className="text-sm">No recent activities</p>
           </div>
         )}
        </div>
      </div>
    </motion.div>
  );
};
