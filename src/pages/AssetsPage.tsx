import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { AddAssetModal } from '@/components/modals/AddAssetModal';
import { Search, Filter, MoreVertical, Eye, Edit, Trash2, Package } from 'lucide-react';
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

const AssetsPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [addAssetModalOpen, setAddAssetModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    availability: 'All', // All, Available, Low Stock, Out of Stock
    minQuantity: '',
    maxQuantity: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const { assets, userRole, updateAsset, sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Data initialized in App
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Search query filter
      const matchesSearch = !searchQuery ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = !filters.type || asset.type.toLowerCase().includes(filters.type.toLowerCase());

      // Availability filter
      let matchesAvailability = true;
      if (filters.availability !== 'All') {
        switch (filters.availability) {
          case 'Available':
            matchesAvailability = asset.availableQuantity > 0;
            break;
          case 'Low Stock':
            matchesAvailability = asset.availableQuantity > 0 && asset.availableQuantity <= 5;
            break;
          case 'Out of Stock':
            matchesAvailability = asset.availableQuantity === 0;
            break;
        }
      }

      // Quantity range filters
      const matchesMinQuantity = !filters.minQuantity || asset.totalQuantity >= parseInt(filters.minQuantity);
      const matchesMaxQuantity = !filters.maxQuantity || asset.totalQuantity <= parseInt(filters.maxQuantity);

      return matchesSearch && matchesType && matchesAvailability && matchesMinQuantity && matchesMaxQuantity;
    });
  }, [assets, searchQuery, filters]);

  const { deleteAsset } = useStore();

  const handleAssetAction = (action: string, asset: typeof assets[0]) => {
    switch (action) {
      case 'View Details':
        toast.info(`Asset Details: ${asset.name}`, {
          description: `Type: ${asset.type} | Total: ${asset.totalQuantity} | Available: ${asset.availableQuantity}`
        });
        break;
      case 'Edit Asset':
        toast.info('Edit Asset', {
          description: 'Edit functionality coming soon!'
        });
        break;
      case 'Delete Asset':
        if (window.confirm(`Are you sure you want to delete asset "${asset.name}"? This action cannot be undone.`)) {
          deleteAsset(asset.id);
          toast.success(`Asset "${asset.name}" deleted successfully`);
        }
        break;
      default:
        toast.info(`${action}: ${asset.name}`);
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
                Assets
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage all {assets.length} asset types in your inventory
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              {(userRole === 'Admin' || userRole === 'Staff') && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setAddAssetModalOpen(true)}
                  className="btn-primary-glow px-4 py-2 rounded-lg text-primary-foreground font-semibold text-sm"
                >
                  + Add Asset
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
                placeholder="Search by name, type..."
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
              {Object.values(filters).some(filter => filter !== '' && filter !== 'All') && (
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
                    type: '',
                    availability: 'All',
                    minQuantity: '',
                    maxQuantity: ''
                  })}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Asset Type</label>
                  <input
                    type="text"
                    placeholder="e.g., Helmet, Phone"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Availability</label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  >
                    <option value="All">All Assets</option>
                    <option value="Available">Available</option>
                    <option value="Low Stock">Low Stock (≤5)</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                {/* Min Quantity Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Min Total Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minQuantity}
                    onChange={(e) => setFilters(prev => ({ ...prev, minQuantity: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>

                {/* Max Quantity Filter */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Max Total Quantity</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={filters.maxQuantity}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxQuantity: e.target.value }))}
                    className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Assets Table */}
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
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Asset</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Quantity</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available</th>
                    <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned</th>
                    <th className="text-right p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map((asset, idx) => (
                    <motion.tr
                      key={asset.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border/20 hover:bg-muted/20 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            <Package size={16} />
                          </div>
                          <span className="font-medium text-foreground">{asset.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-foreground">{asset.type}</td>
                      <td className="p-4 text-muted-foreground">{asset.totalQuantity}</td>
                      <td className="p-4 text-green-400">{asset.availableQuantity}</td>
                      <td className="p-4 text-blue-400">{asset.totalQuantity - asset.availableQuantity}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors">
                              <MoreVertical size={16} className="text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="glass-card border-border/50">
                            <DropdownMenuItem onClick={() => handleAssetAction('View Details', asset)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssetAction('Edit Asset', asset)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAssetAction('Delete Asset', asset)}
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

            {filteredAssets.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">No assets found matching your search.</p>
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
          <AddAssetModal
            open={addAssetModalOpen}
            onOpenChange={setAddAssetModalOpen}
          />
        </>
      )}
    </div>
  );
};

export default AssetsPage;