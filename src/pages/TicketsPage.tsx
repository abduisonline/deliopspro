import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';

const TicketsPage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const { userRole, sidebarOpen, setSidebarOpen } = useStore();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAssign={userRole === 'Admin' || userRole === 'Staff' ? () => setAssignModalOpen(true) : undefined}
        onReassign={userRole === 'Admin' || userRole === 'Staff' ? () => setReassignModalOpen(true) : undefined}
      />

       <div
         style={{
           marginLeft: isMobile ? 0 : (sidebarOpen ? 288 : 64),
           transition: 'margin-left 0.3s ease'
         }}
         className="flex-1"
       >
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
        <main className="p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold font-display text-foreground">Tickets</h1>
            <p className="text-muted-foreground mt-1">Manage support tickets and issue tracking</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
            <p className="text-muted-foreground">No open tickets at the moment.</p>
          </motion.div>
        </main>
      </div>

      {(userRole === 'Admin' || userRole === 'Staff') && (
        <>
          <AssignDriverModal open={assignModalOpen} onOpenChange={setAssignModalOpen} />
          <ReassignDriverModal open={reassignModalOpen} onOpenChange={setReassignModalOpen} />
        </>
      )}
    </div>
  );
};

export default TicketsPage;