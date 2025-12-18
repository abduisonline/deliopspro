import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { DriverDetailsModal } from '@/components/modals/DriverDetailsModal';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Car, User } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DonutChart } from '@/components/charts/DonutChart';

const statusColors: Record<string, string> = {
  'Total': 'bg-gray-500/15 text-gray-400 border border-gray-500/30',
  'Active': 'status-active',
  'Idle': 'status-idle',
  'Inactive': 'status-inactive',
  'Project Change': 'status-project-change',
  'Vacation': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  'Driving License': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
};

const DriversPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [driverDetailsModalOpen, setDriverDetailsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchParams, setSearchParams] = useSearchParams();
  const { drivers, userRole, sidebarOpen, setSidebarOpen, currentUser } = useStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    const status = searchParams.get('status');
    const client = searchParams.get('client');
    if (status && !client) {
      // Only set status filter if no client filter is active
      setStatusFilter(status);
    } else if (client) {
      // When client filter is active, set status to 'All'
      setStatusFilter('All');
    }
  }, [searchParams]);

  const clientFilter = searchParams.get('client');

  const filteredDrivers = useMemo(() => {
    // First, apply role-based filtering
    let roleFilteredDrivers = [...drivers];

    // Driver role users can only see their own record
    if (userRole === 'Driver' && currentUser?.email) {
      // Try to find the driver in the existing drivers array
      const userDriver = drivers.find(driver =>
        driver.id === currentUser.email ||
        driver.name.toLowerCase() === currentUser.name?.toLowerCase()
      );

      if (userDriver) {
        // If driver exists in the system, show only their record
        roleFilteredDrivers = [userDriver];
      } else {
        // If driver doesn't exist in system (like sample login), create a temporary record
        const tempDriver = {
          id: currentUser.email || 'temp-driver',
          name: currentUser.name || 'Driver',
          email: currentUser.email || 'driver@example.com',
          phone: '+971-XXX-XXXX',
          status: 'Active' as const,
          emiratesId: 'XXX-XXXX-XXXXXXX-X',
          licenseNumber: 'DL-XXXXXXX',
          licenseExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          documents: [],
          assignedClient: 'Not Assigned',
          assignedVehicle: 'Not Assigned',
          assignedAssets: [],
          assignedSim: 'Not Assigned',
          lastActivity: new Date(),
          idleStartDate: undefined,
          notes: [],
          baseSalary: 5000,
          advancePaid: 0,
          incentivesEarned: 0,
          deductions: 0,
          totalEarnings: 5000,
          netPayable: 5000
        };
        roleFilteredDrivers = [tempDriver];
      }
    }

    // Then apply search and filter criteria (for Admin/Staff users)
    return roleFilteredDrivers.filter(driver => {
      const matchesSearch = !searchQuery ||
        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (driver.assignedClient && driver.assignedClient.toLowerCase().includes(searchQuery.toLowerCase())) ||
        driver.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        driver.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter;
      const matchesClient = !clientFilter || driver.assignedClient === clientFilter;
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [drivers, searchQuery, statusFilter, clientFilter, userRole, currentUser]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    // Use filteredDrivers instead of all drivers for role-appropriate statistics
    filteredDrivers.forEach(driver => {
      counts[driver.status] = (counts[driver.status] || 0) + 1;
    });
    return counts;
  }, [filteredDrivers]);

  const chartData = useMemo(() => {
    const allStatuses = ['Active', 'Inactive', 'Vacation', 'Project Change', 'Driving License', 'Idle'];

    return allStatuses.map((status) => ({
      status,
      count: filteredDrivers.filter(d => d.status === status).length,
      name: status,
      value: statusCounts[status] || 0,
      color: status === 'Active' ? '#10b981' :
             status === 'Inactive' ? '#ef4444' :
             status === 'Vacation' ? '#06b6d4' :
             status === 'Project Change' ? '#8b5cf6' :
             status === 'Driving License' ? '#eab308' :
              status === 'Idle' ? '#f59e0b' : '#6b7280'
     })).filter(item => item.value > 0);
   }, [filteredDrivers, statusCounts]);

  const allStatusLegend = useMemo(() => {
    const allStatuses = ['Active', 'Inactive', 'Vacation', 'Project Change', 'Driving License', 'Idle'];

    return allStatuses.map((status) => ({
      name: status,
      count: statusCounts[status] || 0,
      color: status === 'Active' ? '#10b981' :
             status === 'Inactive' ? '#ef4444' :
             status === 'Vacation' ? '#06b6d4' :
             status === 'Project Change' ? '#8b5cf6' :
             status === 'Driving License' ? '#eab308' :
             status === 'Idle' ? '#f59e0b' : '#6b7280'
    }));
  }, [statusCounts]);

  const handleDriverAction = (action: string, driver: typeof drivers[0]) => {
    if (action === 'Delete Driver') {
      // Trigger reassign modal for deletion
      setReassignModalOpen(true);
    } else if (action === 'View Profile') {
      setSelectedDriver(driver);
      setDriverDetailsModalOpen(true);
    } else if (action === 'Edit Driver') {
      setSelectedDriver(driver);
      setDriverDetailsModalOpen(true);
    } else {
      toast.info(`${action}: ${driver.name}`, {
        description: `${action} functionality is now active!`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>
      
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAssignReassign={userRole === 'Admin' || userRole === 'Staff' ? () => {
          // For drivers page, perhaps navigate to clients or open choice
          // For now, do nothing or open assign
          setAssignModalOpen(true);
        } : undefined}
      />
      
      {/* Main Content */}
      <div
        style={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? 288 : 64),
          transition: 'margin-left 0.3s ease'
        }}
        className="flex-1"
      >
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        
        <main className="p-6 space-y-6">
          {/* Page Title & Actions */}
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold font-display text-foreground">
                  Drivers {clientFilter ? `for ${clientFilter}` : ''}
                </h1>
                {clientFilter && (
                  <button
                    onClick={() => {
                      const newSearchParams = new URLSearchParams(searchParams);
                      newSearchParams.delete('client');
                      setSearchParams(newSearchParams);
                    }}
                    className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-full transition-colors"
                  >
                    ✕ Clear Filter
                  </button>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {clientFilter ? `Showing ${filteredDrivers.length} drivers assigned to ${clientFilter}` : `Manage all ${drivers.length} drivers in your fleet`}
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              {(userRole === 'Admin' || userRole === 'Staff') && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setAssignModalOpen(true)}
                    className="btn-primary-glow px-4 py-2 rounded-lg text-primary-foreground font-semibold text-sm"
                  >
                    Assign Driver
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setReassignModalOpen(true)}
                    className="px-4 py-2 rounded-lg border border-primary/30 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
                  >
                    Reassign Driver
                  </motion.button>
                </>
              )}
            </div>
           </div>

          {/* Driver Status Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
            style={{
              background: `
                radial-gradient(1200px 500px at 50% -20%, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 55%),
                linear-gradient(180deg, rgba(11,18,36,.78), rgba(11,18,36,.58))
              `,
              boxShadow: '0 30px 80px rgba(0,0,0,.55)',
              border: '1px solid rgba(255,255,255,.08)',
              borderRadius: '26px',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            <div style={{
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
            }}></div>
            <div style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateRows: 'auto 1fr auto',
               gap: isMobile ? '10px' : '14px',
               minHeight: isMobile ? '320px' : '420px',
              alignItems: 'center'
            }}>
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  gap: '10px',
                  paddingTop: '6px'
                }}>
                   <div style={{
                     fontSize: isMobile ? 'clamp(18px, 4vw, 22px)' : 'clamp(22px, 2.3vw, 30px)',
                     fontWeight: 800,
                     letterSpacing: '.3px',
                     textShadow: '0 10px 30px rgba(0,0,0,.35)',
                     textAlign: isMobile ? 'center' : 'left'
                   }}>
                     Driver Status Distribution
                   </div>
                </div>

              </div>

              <DonutChart data={chartData} onStatusClick={setStatusFilter} selectedStatus={statusFilter === 'All' ? null : statusFilter} />

                <div style={{
                  display: 'flex',
                  gap: isMobile ? '12px' : '18px',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: isMobile ? '8px 0 4px' : '12px 0 4px'
                }}>
                 {allStatusLegend.map((item) => (
                  <div
                    key={item.name}
                     style={{
                       display: 'flex',
                       alignItems: 'center',
                       gap: isMobile ? '8px' : '10px',
                       padding: isMobile ? '8px 12px' : '10px 14px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.08)',
                      color: '#eaf0ff',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.02)',
                      transition: 'transform .25s cubic-bezier(.2,.9,.2,1), background .25s cubic-bezier(.2,.9,.2,1), border-color .25s cubic-bezier(.2,.9,.2,1)',
                      cursor: 'pointer',
                      userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                      e.currentTarget.style.background = 'rgba(255,255,255,.08)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.14)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.background = 'rgba(255,255,255,.06)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,.08)';
                    }}
                    onClick={() => setStatusFilter(item.name)}
                  >
                     <span style={{
                       width: isMobile ? '10px' : '12px',
                       height: isMobile ? '10px' : '12px',
                       borderRadius: '50%',
                       boxShadow: '0 0 0 3px rgba(255,255,255,.06)',
                       background: item.color
                     }}></span>
                      <span style={{
                        fontSize: isMobile ? '12px' : '14px'
                      }}>{item.name} ({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search by name, client, or status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                // Clear client filter when status is changed
                if (clientFilter) {
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.delete('client');
                  setSearchParams(newSearchParams);
                }
              }}
              disabled={!!clientFilter}
            >
              <SelectTrigger className={`w-48 ${clientFilter ? 'opacity-50' : ''}`}>
                <Filter size={16} className="mr-2" />
                <SelectValue placeholder={clientFilter ? "Status filtered by client" : "Filter by status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Idle">Idle</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Project Change">Project Change</SelectItem>
                <SelectItem value="Vacation">On Vacation</SelectItem>
                <SelectItem value="Driving License">License in Process</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Drivers Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Driver</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vehicle</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">DOJ</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver, idx) => (
                    <motion.tr
                      key={driver.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3 min-h-[40px]">
                            <div
                              className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/30 cursor-pointer transition-all duration-200 hover:shadow-lg"
                              onClick={() => {
                                setSelectedDriver(driver);
                                setDriverDetailsModalOpen(true);
                              }}
                              style={{
                                minWidth: '40px',
                                minHeight: '40px',
                                maxWidth: '40px',
                                maxHeight: '40px',
                              }}
                            >
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name.replace(/\s+/g, '')}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`}
                                alt={`${driver.name} avatar`}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{
                                  width: '40px',
                                  height: '40px',
                                }}
                                onError={(e) => {
                                  // Fallback to User icon if image fails to load
                                  const target = e.target as HTMLElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"><svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                                  }
                                }}
                              />
                           </div>
                           <span className="font-medium text-foreground">{driver.name}</span>
                         </div>
                       </td>
                       <td className="p-4 text-foreground">{driver.assignedClient || '-'}</td>
                        <td className="p-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium", statusColors[driver.status])}>
                              {driver.status}
                            </span>
                            {driver.status === 'Idle' && driver.idleStartDate && (
                              <span className="text-xs text-muted-foreground">
                                {(() => {
                                  const now = new Date();
                                  const idleStart = new Date(driver.idleStartDate);
                                  const daysIdle = Math.floor((now.getTime() - idleStart.getTime()) / (1000 * 60 * 60 * 24));
                                  const daysLeft = Math.max(0, 15 - daysIdle);
                                  return daysLeft > 0 ? `${daysLeft} days until inactive` : 'Will become inactive soon';
                                })()}
                              </span>
                            )}
                          </div>
                        </td>
                       <td className="p-4 text-muted-foreground">{driver.phone}</td>
                       <td className="p-4 text-muted-foreground">{driver.assignedVehicle || '-'}</td>
                       <td className="p-4 text-muted-foreground">-</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-border/50">
                            <DropdownMenuItem onClick={() => handleDriverAction('View Profile', driver)}>
                              <Eye className="mr-2 h-4 w-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDriverAction('Edit Driver', driver)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDriverAction('Delete Driver', driver)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDrivers.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No drivers found matching your search.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      {(userRole === 'Admin' || userRole === 'Staff') && (
        <>
          <AssignDriverModal
            open={assignModalOpen}
            onOpenChange={setAssignModalOpen}
          />
           <ReassignDriverModal
             open={reassignModalOpen}
             onOpenChange={setReassignModalOpen}
           />
         </>
       )}

       <DriverDetailsModal
         driver={selectedDriver}
         open={driverDetailsModalOpen}
         onOpenChange={setDriverDetailsModalOpen}
       />
     </div>
  );
};

export default DriversPage;
