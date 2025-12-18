import { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, ChevronDown, Shield, LogOut, User, Settings, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

const notifications = [
  { id: 1, title: 'License Expiring', message: 'Ahmad Hassan license expires in 3 days', time: '2m ago', type: 'warning' },
  { id: 2, title: 'New Assignment', message: 'Driver assigned to Noon successfully', time: '15m ago', type: 'success' },
  { id: 3, title: 'Missing Asset', message: 'Helmet not returned by Omar S.', time: '1h ago', type: 'error' },
];

interface HeaderProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

const Header = ({ onSearch, onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  console.log('Header render');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [userRole, setUserRole] = useState('Admin');
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useStore();

  useEffect(() => {
    const role = localStorage.getItem('userRole') || 'Admin';
    setUserRole(role);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to drivers page with search query
      navigate(`/drivers?search=${encodeURIComponent(searchQuery.trim())}`);
      toast.success(`Searching for "${searchQuery}"`, {
        description: 'Redirected to drivers page with search results'
      });
      onSearch?.(searchQuery);
    }
  };

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    toast.info(notif.title, { description: notif.message });
    setNotifOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 glass-card rounded-none border-x-0 border-t-0 flex items-center justify-between px-6"
    >
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
      >
        <Menu size={20} className="text-muted-foreground" />
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 ml-4 md:ml-0 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          placeholder="Search drivers, vehicles, assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-glass w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
        />
      </form>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30">
          <Shield size={14} className="text-primary" />
          <span className="text-xs font-semibold text-primary">{userRole}</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 glass-card border-border/50" align="end">
            <div className="p-3 border-b border-border/30">
              <h4 className="font-semibold text-foreground">Notifications</h4>
              <p className="text-xs text-muted-foreground">{notifications.length} new alerts</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className="w-full p-3 text-left hover:bg-muted/30 transition-colors border-b border-border/20 last:border-0"
                >
                  <p className="text-sm font-medium text-foreground">{notif.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">{notif.time}</p>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 pr-3 rounded-xl hover:bg-muted/30 transition-colors">
              <Avatar className="h-8 w-8 border-2 border-primary/30">
                <AvatarImage src={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=executive&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black"} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                  {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-muted-foreground">{currentUser?.title || userRole}</p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 glass-card border-border/50" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
               <DropdownMenuItem onClick={() => {
                localStorage.removeItem('userRole');
                setCurrentUser(null);
                toast.success('Logged out successfully');
                navigate('/');
              }} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default memo(Header);