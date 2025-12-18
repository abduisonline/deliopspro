import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { DriverStatusBoard } from '@/components/dashboard/DriverStatusBoard';
import { ClientsOverview } from '@/components/dashboard/ClientsOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ExpiryAlerts } from '@/components/dashboard/ExpiryAlerts';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, Car, Package, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || 'Admin';
  const { drivers, vehicles, assets, sims, sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useIsMobile();

  // Calculate stats
  const totalDrivers = drivers.length;
  const activeDrivers = drivers.filter(d => d.status === 'Active').length;
  const activeVehicles = vehicles.filter(v => v.status === 'Assigned').length;
  const totalAssets = assets.reduce((sum, a) => sum + a.totalQuantity, 0);
  const activeSims = sims.filter(s => s.status === 'Assigned').length;



  const handleViewAllDrivers = () => {
    navigate('/drivers');
  };

  const handleManageClients = () => {
    navigate('/clients');
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
        onAssignReassign={userRole === 'Admin' || userRole === 'Staff' ? () => setChoiceDialogOpen(true) : undefined}
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
           {/* Page Title */}
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-2"
           >
             <h1 className="text-3xl font-bold font-display text-foreground">
               {userRole === 'Driver' ? 'Driver Dashboard' : 'Operations Dashboard'}
             </h1>
             <p className="text-muted-foreground mt-1">
               {userRole === 'Driver'
                 ? 'Welcome back! Here are your delivery details.'
                 : 'Welcome back! Here\'s an overview of your fleet operations.'
               }
             </p>
           </motion.div>

           {/* Top Stats Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Drivers"
                value={totalDrivers}
                icon={Users}
                trend={{ value: Math.round((activeDrivers / totalDrivers) * 100), positive: true }}
                color="primary"
                delay={0}
                onClick={() => navigate('/drivers')}
              />
              <StatCard
                title="Active Vehicles"
                value={activeVehicles}
                icon={Car}
                trend={{ value: vehicles.length ? Math.round((activeVehicles / vehicles.length) * 100) : 0, positive: true }}
                color="success"
                delay={1}
                onClick={() => navigate('/vehicles')}
              />
              <StatCard
                title="Assets in Use"
                value={totalAssets - assets.reduce((sum, a) => sum + a.availableQuantity, 0)}
                icon={Package}
                trend={{ value: 3, positive: false }}
                color="warning"
                delay={2}
                onClick={() => navigate('/assets')}
              />
              <StatCard
                title="Active SIMs"
                value={activeSims}
                icon={Smartphone}
                trend={{ value: sims.length ? Math.round((activeSims / sims.length) * 100) : 0, positive: true }}
                color="primary"
                delay={3}
                onClick={() => navigate('/sim-cards')}
              />
           </div>

           {userRole !== 'Driver' && (
             <>
               {/* Main Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Left Column - Driver Status Board */}
                 <div className="lg:col-span-2 space-y-6">
                   <DriverStatusBoard onViewAll={handleViewAllDrivers} />
                   <ClientsOverview onManageClients={handleManageClients} />
                 </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {isMobile && (
                      <QuickActions
                        onAssign={userRole === 'Admin' ? () => setChoiceDialogOpen(true) : undefined}
                        onReassign={userRole === 'Admin' ? () => setReassignModalOpen(true) : undefined}
                      />
                    )}
                    <ExpiryAlerts />
                    <RecentActivity />
                  </div>
               </div>
             </>
           )}

           {userRole === 'Driver' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <RecentActivity />
               <div className="space-y-6">
                 {/* Driver specific content */}
                 <div className="bg-card p-6 rounded-lg border">
                   <h3 className="text-lg font-semibold mb-4">Your Schedule</h3>
                   <p className="text-muted-foreground">Today's deliveries: 12</p>
                   <p className="text-muted-foreground">Next delivery: 2:00 PM</p>
                 </div>
               </div>
             </div>
           )}
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

      {/* Choice Dialog */}
      <Dialog open={choiceDialogOpen} onOpenChange={setChoiceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Action</DialogTitle>
            <DialogDescription>
              Select whether to assign a new driver or reassign an existing one.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => { setChoiceDialogOpen(false); setAssignModalOpen(true); }}>
              Assign Driver
            </Button>
            <Button variant="outline" onClick={() => { setChoiceDialogOpen(false); setReassignModalOpen(true); }}>
              Re-assign Driver
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
