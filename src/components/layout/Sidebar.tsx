import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Car,
  Package,
  Smartphone,
  Building2,
  ArrowLeftRight,
  Shield,
  Ticket,
  DollarSign,
  FileCheck,
  AlertCircle,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mic,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
  priority?: boolean;
  onClick?: () => void;
  path?: string;
  onToggle?: () => void;
}

const NavItem = ({ icon, label, active, badge, priority, onClick, path, onToggle }: NavItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = path ? location.pathname === path : active;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onToggle?.();
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className={cn("nav-item w-full", isActive && "active")}
    >
      <span className="text-xl">{icon}</span>
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      {badge !== undefined && (
        <span className={cn(
          "px-2 py-0.5 text-xs rounded-full font-semibold",
          priority 
            ? "bg-warning/20 text-warning border border-warning/30 animate-pulse" 
            : "bg-primary/20 text-primary border border-primary/30"
        )}>
          {badge}
        </span>
      )}
    </motion.button>
  );
};

interface SidebarProps {
  onAssignReassign?: () => void;
  onAssign?: () => void;
  onReassign?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ onAssignReassign, onAssign, onReassign, isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { drivers, vehicles, assets, sims, clients, currentUser } = useStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();
  const defaultOpen = isMobile ? false : true;
  const sidebarIsOpen = isOpen !== undefined ? isOpen : defaultOpen;

  // Check if user is logged in
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const hasRole = !!role;
    const hasUser = !!currentUser;
    const isOnDashboard = location.pathname !== '/' && location.pathname !== '/login';

    // User is logged in if they have a role AND are on a protected route
    setIsLoggedIn(hasRole && isOnDashboard);
  }, [currentUser, location.pathname]);

  const handleAIAssistant = () => {
    toast.info('AI Voice Assistant', {
      description: 'Voice assistant activated. Try saying "Assign driver Ahmed to Noon..."',
      duration: 4000,
    });
  };

  const handleComingSoon = (feature: string) => {
    toast.info(`${feature} is now available!`, {
      description: 'Feature activated.',
    });
  };

  const navSections = [
    {
      title: 'Operations',
      items: [
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
        { icon: <Users size={20} />, label: 'Drivers', badge: drivers.length, path: '/drivers' },
        { icon: <Car size={20} />, label: 'Vehicles', badge: vehicles.length, path: '/vehicles' },
        { icon: <Package size={20} />, label: 'Assets', path: '/assets' },
        { icon: <Smartphone size={20} />, label: 'SIM Cards', path: '/sim-cards' },
      ]
    },
    {
      title: 'Management',
      items: [
        { icon: <Building2 size={20} />, label: 'Clients / Projects', path: '/clients' },
        { icon: <ArrowLeftRight size={20} />, label: 'Assign / Re-assign', badge: 0, priority: true, onClick: onAssignReassign || onAssign || onReassign }, // TODO: count pending assignments
        { icon: <Shield size={20} />, label: 'Compliance', path: '/compliance' },
        { icon: <Ticket size={20} />, label: 'Tickets', badge: 0, path: '/tickets' }, // TODO: implement tickets
      ]
    },
    {
      title: 'Finance',
      items: [
        { icon: <DollarSign size={20} />, label: 'Billing & Payments', path: '/finance' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: <User size={20} />, label: 'Profile', path: '/profile' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
      ]
    },

  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarIsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

    <aside
      style={{
        width: isMobile ? (sidebarIsOpen ? 280 : 0) : (sidebarIsOpen ? 288 : 64),
        transition: 'width 0.3s ease'
      }}
        className={cn(
          "sidebar-glass h-screen fixed left-0 top-0 z-50 flex flex-col overflow-hidden",
          isMobile && "md:relative md:z-auto"
        )}
    >
       {/* Logo */}
        <div className="p-4 border-b border-border/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <img
                  src="/class.png"
                  alt="Class Worldwide Operations Control"
                  className="h-8 w-auto"
                />
                <div>
                  <h1 className="text-sm font-bold text-foreground">Class Worldwide</h1>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Operations Control</p>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-lg font-bold font-display text-foreground tracking-tight">
                  DeliOPS<span className="text-primary">-PRO</span>
                </h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Fleet Management</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isMobile && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors md:hidden"
              >
                <X size={18} />
              </button>
            )}
            {!isMobile && (
              <button
                onClick={onToggle}
                className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {sidebarIsOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </button>
            )}
          </div>
       </div>

       {/* Navigation */}
       <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
         {sidebarIsOpen && (
          <>
            {navSections.map((section, sIdx) => (
              <div key={section.title}>
                <h3 className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <NavItem key={item.label} {...item} onToggle={onToggle} />
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {!isOpen && (
          <div className="space-y-4">
            {navSections.flatMap(section => section.items).map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onToggle(); // Expand sidebar
                  setTimeout(() => {
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }, 300); // Wait for expansion animation
                }}
                className="w-full flex justify-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-xl">{item.icon}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* AI Assistant Button */}
      {isLoggedIn && isOpen && (
        <div className="p-4 border-t border-border/30">
          <button
            onClick={handleAIAssistant}
            className="w-full btn-primary-glow text-primary-foreground rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold text-sm"
          >
            <Mic size={18} />
            <span>AI Voice Assistant</span>
          </button>
        </div>
      )}


    </aside>
    </>
  );
};
