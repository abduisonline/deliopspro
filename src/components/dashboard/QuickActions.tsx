import { motion } from 'framer-motion';
import { UserPlus, RefreshCw } from 'lucide-react';

interface QuickActionsProps {
  onAssign?: () => void;
  onReassign?: () => void;
}

export const QuickActions = ({ onAssign, onReassign }: QuickActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
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
      <h2 className="text-xl font-bold font-display text-foreground mb-4">Quick Actions</h2>
      
       <div className="grid grid-cols-2 gap-3">
         <motion.button
           whileHover={{ scale: 1.02, y: -2 }}
           whileTap={{ scale: 0.98 }}
           onClick={onAssign}
           className="flex flex-col items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/30 hover:bg-success/20 transition-all group"
         >
           <div className="p-3 rounded-full bg-success/20 group-hover:bg-success/30 transition-colors">
             <UserPlus size={22} className="text-success" />
           </div>
           <span className="text-sm font-semibold text-success">Assign</span>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.02, y: -2 }}
           whileTap={{ scale: 0.98 }}
           onClick={onReassign}
           className="flex flex-col items-center gap-3 p-4 rounded-xl bg-warning/10 border border-warning/30 hover:bg-warning/20 transition-all group"
         >
           <div className="p-3 rounded-full bg-warning/20 group-hover:bg-warning/30 transition-colors">
             <RefreshCw size={22} className="text-warning" />
           </div>
           <span className="text-sm font-semibold text-warning">Re-assign</span>
         </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
