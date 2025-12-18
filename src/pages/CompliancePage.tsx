import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

const CompliancePage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const { userRole, sidebarOpen, setSidebarOpen, drivers, vehicles } = useStore();
  const isMobile = useIsMobile();

  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringLicenses = drivers.filter(d => d.licenseExpiry <= thirtyDaysFromNow && d.licenseExpiry > now);
  const expiredLicenses = drivers.filter(d => d.licenseExpiry <= now);

  const expiringInsurance = vehicles.filter(v => v.insuranceExpiry <= thirtyDaysFromNow && v.insuranceExpiry > now);
  const expiredInsurance = vehicles.filter(v => v.insuranceExpiry <= now);

  const expiringRegistration = vehicles.filter(v => v.registrationExpiry <= thirtyDaysFromNow && v.registrationExpiry > now);
  const expiredRegistration = vehicles.filter(v => v.registrationExpiry <= now);

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
            <h1 className="text-3xl font-bold font-display text-foreground">Compliance</h1>
            <p className="text-muted-foreground mt-1">Monitor expiries and compliance requirements</p>
          </motion.div>
          <div className="space-y-6">
            {/* Expiring Soon */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-warning" />
                Expiring Within 30 Days
              </h2>
              <div className="space-y-4">
                {expiringLicenses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-warning mb-2">Driver Licenses</h3>
                    <div className="space-y-2">
                      {expiringLicenses.map(driver => (
                        <div key={driver.id} className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                          <span>{driver.name}</span>
                          <span className="text-sm text-muted-foreground">{driver.licenseExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiringInsurance.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-warning mb-2">Vehicle Insurance</h3>
                    <div className="space-y-2">
                      {expiringInsurance.map(vehicle => (
                        <div key={vehicle.id} className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                          <span>{vehicle.plate} ({vehicle.make} {vehicle.model})</span>
                          <span className="text-sm text-muted-foreground">{vehicle.insuranceExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiringRegistration.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-warning mb-2">Vehicle Registration</h3>
                    <div className="space-y-2">
                      {expiringRegistration.map(vehicle => (
                        <div key={vehicle.id} className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                          <span>{vehicle.plate} ({vehicle.make} {vehicle.model})</span>
                          <span className="text-sm text-muted-foreground">{vehicle.registrationExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiringLicenses.length === 0 && expiringInsurance.length === 0 && expiringRegistration.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No items expiring soon</p>
                )}
              </div>
            </motion.div>

            {/* Expired */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-destructive" />
                Already Expired
              </h2>
              <div className="space-y-4">
                {expiredLicenses.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">Driver Licenses</h3>
                    <div className="space-y-2">
                      {expiredLicenses.map(driver => (
                        <div key={driver.id} className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                          <span>{driver.name}</span>
                          <span className="text-sm text-muted-foreground">{driver.licenseExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiredInsurance.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">Vehicle Insurance</h3>
                    <div className="space-y-2">
                      {expiredInsurance.map(vehicle => (
                        <div key={vehicle.id} className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                          <span>{vehicle.plate} ({vehicle.make} {vehicle.model})</span>
                          <span className="text-sm text-muted-foreground">{vehicle.insuranceExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiredRegistration.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-destructive mb-2">Vehicle Registration</h3>
                    <div className="space-y-2">
                      {expiredRegistration.map(vehicle => (
                        <div key={vehicle.id} className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                          <span>{vehicle.plate} ({vehicle.make} {vehicle.model})</span>
                          <span className="text-sm text-muted-foreground">{vehicle.registrationExpiry.toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {expiredLicenses.length === 0 && expiredInsurance.length === 0 && expiredRegistration.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No expired items</p>
                )}
              </div>
            </motion.div>
          </div>
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

export default CompliancePage;