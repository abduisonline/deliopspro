import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Smartphone } from 'lucide-react';
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

const statusColors: Record<string, string> = {
  'Available': 'bg-green-500/15 text-green-400 border border-green-500/30',
  'Assigned': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
};

const SimCardsPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    carrier: '',
    plan: '',
    costCenter: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { sims, userRole, updateSim, sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Data initialized in App
  }, [sims]);

  const filteredSims = useMemo(() => {
    return sims.filter(sim => {
      // Search query filter
      const matchesSearch = !searchQuery ||
        sim.number.includes(searchQuery) ||
        sim.carrier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sim.costCenter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sim.assignedDriver && sim.assignedDriver.toLowerCase().includes(searchQuery.toLowerCase()));

      // Status filter
      const matchesStatus = !filters.status || sim.status === filters.status;

      // Carrier filter
      const matchesCarrier = !filters.carrier || sim.carrier.toLowerCase().includes(filters.carrier.toLowerCase());

      // Plan filter
      const matchesPlan = !filters.plan || sim.plan.toLowerCase().includes(filters.plan.toLowerCase());

      // Cost Center filter
      const matchesCostCenter = !filters.costCenter || sim.costCenter.toLowerCase().includes(filters.costCenter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCarrier && matchesPlan && matchesCostCenter;
    });
  }, [sims, searchQuery, filters]);

  const handleSimAction = (action: string, sim: typeof sims[0]) => {
    toast.info(`${action}: ${sim.number}`, {
      description: `${action} functionality coming soon!`
    });
  };

  const handleStatusChange = (simId: string, newStatus: string) => {
    updateSim(simId, { status: newStatus as 'Available' | 'Assigned' });
    toast.success(`SIM status updated to ${newStatus}`);
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
        onAssign={userRole === 'Admin' || userRole === 'Staff' ? () => setAssignModalOpen(true) : undefined}
        onReassign={userRole === 'Admin' || userRole === 'Staff' ? () => setReassignModalOpen(true) : undefined}
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
              <h1 className="text-3xl font-bold font-display text-foreground">
                SIM Cards
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all {sims.length} SIM cards in your inventory
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              {(userRole === 'Admin' || userRole === 'Staff') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.info('Add SIM Card coming soon!')}
                  className="btn-primary-glow px-4 py-2 rounded-lg text-primary-foreground font-semibold text-sm"
                >
                  + Add SIM Card
                </motion.button>
              )}
            </div>
          </div>

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
                placeholder="Search by number, carrier, plan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-glass w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border/50 rounded-lg transition-colors",
                showFilters
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "text-muted-foreground hover:bg-muted/30"
              )}
            >
              <Filter size={16} />
              Filters
              {Object.values(filters).some(filter => filter !== '') && (
                <span className="ml-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </motion.div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="glass-card p-4 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Advanced Filters</h3>
                <button
                  onClick={() => setFilters({
                    status: '',
                    carrier: '',
                    plan: '',
                    costCenter: ''
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  >
                    <option value="">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="Assigned">Assigned</option>
                  </select>
                </div>

                {/* Carrier Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Carrier</label>
                  <input
                    type="text"
                    placeholder="e.g., Etisalat, Du"
                    value={filters.carrier}
                    onChange={(e) => setFilters(prev => ({ ...prev, carrier: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Plan Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Plan</label>
                  <input
                    type="text"
                    placeholder="e.g., Unlimited, 10GB"
                    value={filters.plan}
                    onChange={(e) => setFilters(prev => ({ ...prev, plan: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Cost Center Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Cost Center</label>
                  <input
                    type="text"
                    placeholder="e.g., Operations, Sales"
                    value={filters.costCenter}
                    onChange={(e) => setFilters(prev => ({ ...prev, costCenter: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* SIM Cards Table */}
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
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SIM Card</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Carrier</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Plan</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned Driver</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cost Center</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSims.map((sim, idx) => (
                    <motion.tr
                      key={sim.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            <Smartphone size={16} />
                          </div>
                          <span className="font-medium text-foreground">{sim.number}</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{sim.carrier}</td>
                      <td className="p-4 text-muted-foreground">{sim.plan}</td>
                      <td className="p-4">
                        <select
                          value={sim.status}
                          onChange={(e) => handleStatusChange(sim.id, e.target.value)}
                          className="px-3 py-1 rounded-full text-xs font-medium border-0 bg-transparent"
                          style={{ color: statusColors[sim.status]?.match(/text-([a-z]+-400)/)?.[1] }}
                        >
                          <option value="Available">Available</option>
                          <option value="Assigned">Assigned</option>
                        </select>
                      </td>
                      <td className="p-4 text-muted-foreground">{sim.assignedDriver ? `Driver ${sim.assignedDriver}` : '-'}</td>
                      <td className="p-4 text-muted-foreground">{sim.costCenter}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-border/50">
                            <DropdownMenuItem onClick={() => handleSimAction('View Details', sim)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSimAction('Edit SIM', sim)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleSimAction('Delete SIM', sim)}
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

            {filteredSims.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No SIM cards found matching your search.</p>
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
    </div>
  );
};

export default SimCardsPage;