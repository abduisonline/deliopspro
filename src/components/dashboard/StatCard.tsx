import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'destructive';
  delay?: number;
  onClick?: () => void;
}

const AnimatedCounter = ({ value, delay = 0 }: { value: number; delay?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1500;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return <span>{count.toLocaleString()}</span>;
};

const colorStyles = {
  primary: {
    icon: 'text-primary bg-primary/15 border-primary/30',
    glow: 'group-hover:shadow-[0_0_30px_hsl(185_85%_50%/0.3)]'
  },
  success: {
    icon: 'text-success bg-success/15 border-success/30',
    glow: 'group-hover:shadow-[0_0_30px_hsl(145_65%_45%/0.3)]'
  },
  warning: {
    icon: 'text-warning bg-warning/15 border-warning/30',
    glow: 'group-hover:shadow-[0_0_30px_hsl(38_92%_55%/0.3)]'
  },
  destructive: {
    icon: 'text-destructive bg-destructive/15 border-destructive/30',
    glow: 'group-hover:shadow-[0_0_30px_hsl(0_72%_55%/0.3)]'
  }
};

export const StatCard = ({ title, value, icon: Icon, trend, color = 'primary', delay = 0, onClick }: StatCardProps) => {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: delay * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={cn("group cursor-pointer")}
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
        <div className="flex items-start justify-between mb-4">
          <div className={cn("p-3 rounded-xl border", styles.icon)}>
            <Icon size={22} />
          </div>
          {trend && (
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay * 0.1 + 0.3 }}
              className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                trend.positive
                  ? "bg-success/15 text-success"
                  : "bg-destructive/15 text-destructive"
              )}
            >
              {trend.positive ? '+' : ''}{trend.value}%
            </motion.span>
          )}
        </div>

        <h3 className="text-muted-foreground text-sm mb-1">{title}</h3>
        <p className="text-3xl font-bold font-display text-foreground">
          <AnimatedCounter value={value} delay={delay * 100} />
        </p>

        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};
