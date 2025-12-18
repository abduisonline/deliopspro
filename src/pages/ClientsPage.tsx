import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { Building2, Calendar, DollarSign, Users, MoreVertical, UserPlus, ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ClientDetailsModal } from '@/components/modals/ClientDetailsModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ClientsPage = () => {
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [addClientModalOpen, setAddClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const { userRole, sidebarOpen, setSidebarOpen, clients, drivers } = useStore();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Generate comprehensive client report in HTML format
  const generateClientReport = (client: typeof clients[0]) => {
    // Get all drivers assigned to this client (cross-reference both ways for accuracy)
    const assignedDrivers = drivers.filter(driver =>
      driver.assignedClient === client.id || client.assignedDrivers.includes(driver.id)
    );

    const contractDaysRemaining = Math.max(0, Math.ceil((client.contractEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
    const activeDriversCount = assignedDrivers.filter(d => d.status === 'Active').length;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Client Report - ${client.name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
        }
        .company-logo {
            position: absolute;
            top: 20px;
            left: 20px;
            height: 80px;
        }
        .report-icon {
            position: absolute;
            top: 20px;
            right: 20px;
            height: 60px;
        }
        h1 {
            color: #007bff;
            margin: 0;
        }
        h2 {
            color: #0056b3;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
        }
        section {
            margin-bottom: 40px;
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: white;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-active { background-color: #d4edda; color: #155724; }
        .status-idle { background-color: #fff3cd; color: #856404; }
        .status-inactive { background-color: #f8d7da; color: #721c24; }
        footer {
            text-align: center;
            margin-top: 50px;
            font-size: 0.9em;
            color: #666;
        }
        @media print {
            body { background-color: white; }
            section { box-shadow: none; }
        }
    </style>
</head>
<body>
    <header>
        <img src="${window.location.origin}/class.png" alt="Company Logo" class="company-logo">
        <img src="${window.location.origin}/icon.png" alt="Report Icon" class="report-icon">
        <h1>Client Report</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="client-info">
        <h2>Client Information</h2>
        <table>
            <tbody>
                <tr><td><strong>Client ID:</strong></td><td>${client.id}</td></tr>
                <tr><td><strong>Client Name:</strong></td><td>${client.name}</td></tr>
                <tr><td><strong>Contract Start:</strong></td><td>${client.contractStart.toLocaleDateString()}</td></tr>
                <tr><td><strong>Contract End:</strong></td><td>${client.contractEnd.toLocaleDateString()}</td></tr>
                <tr><td><strong>Rate Card:</strong></td><td>د.إ ${client.rateCard.toLocaleString()}</td></tr>
                <tr><td><strong>SLA:</strong></td><td>${client.sla}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="current-status">
        <h2>Current Status</h2>
        <table>
            <tbody>
                <tr><td><strong>Total Assigned Drivers:</strong></td><td>${assignedDrivers.length}</td></tr>
                <tr><td><strong>Active Drivers:</strong></td><td>${activeDriversCount}</td></tr>
                <tr><td><strong>Contract Days Remaining:</strong></td><td>${contractDaysRemaining}</td></tr>
                <tr><td><strong>Contract Value:</strong></td><td>د.إ ${client.rateCard.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="drivers-details">
        <h2>Assigned Drivers Details</h2>
        ${assignedDrivers.length > 0 ? `
        <table>
            <thead>
                <tr>
                    <th>Driver Name</th>
                    <th>Driver ID</th>
                    <th>Status</th>
                    <th>Phone</th>
                    <th>License Expiry</th>
                    <th>Assigned Vehicle</th>
                    <th>Assigned SIM</th>
                </tr>
            </thead>
            <tbody>
                ${assignedDrivers.map((driver, index) => `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.id}</td>
                    <td><span class="status-badge status-${driver.status.toLowerCase().replace(' ', '-')}">${driver.status}</span></td>
                    <td>${driver.phone}</td>
                    <td>${driver.licenseExpiry.toLocaleDateString()}</td>
                    <td>${driver.assignedVehicle || 'None'}</td>
                    <td>${driver.assignedSim || 'None'}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
        ` : '<p>No drivers currently assigned to this client.</p>'}
    </section>

    <section id="driver-summary">
        <h2>Driver Status Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Active:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Active').length}</td></tr>
                <tr><td><strong>Idle:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Idle').length}</td></tr>
                <tr><td><strong>Inactive:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Inactive').length}</td></tr>
                <tr><td><strong>Project Change:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Project Change').length}</td></tr>
                <tr><td><strong>Vacation:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Vacation').length}</td></tr>
                <tr><td><strong>Driving License:</strong></td><td>${assignedDrivers.filter(d => d.status === 'Driving License').length}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="additional-info">
        <h2>Additional Information</h2>
        <table>
            <tbody>
                <tr><td><strong>Report Generated:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                <tr><td><strong>Total Drivers in System:</strong></td><td>${drivers.length}</td></tr>
                <tr><td><strong>Client Registration:</strong></td><td>${client.contractStart.toLocaleDateString()}</td></tr>
            </tbody>
        </table>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Client Report</p>
    </footer>
</body>
</html>`;
    return html;
  };

  // Download report as PDF using browser print functionality
  const downloadReport = (content: string, filename: string) => {
    try {
      // Create a new window with the content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to download PDFs');
        return;
      }

      // Write the content to the new window
      printWindow.document.write(content);
      printWindow.document.close();

      // Add print-specific styles
      const printStyle = printWindow.document.createElement('style');
      printStyle.textContent = `
        @media print {
          body { margin: 0; padding: 20px; }
          @page { margin: 0.5in; }
        }
        @media screen {
          body { display: none; }
        }
      `;
      printWindow.document.head.appendChild(printStyle);

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close the window after printing (user can choose to save as PDF)
          setTimeout(() => {
            printWindow.close();
            toast.success('PDF ready! Use your browser\'s print dialog to save as PDF.');
          }, 1000);
        }, 500);
      };

    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };



  const handleMenuAction = (action: string, client: typeof clients[0]) => {
    if (action === 'Edit Project' && userRole !== 'Admin') {
      toast.error('Access denied', { description: 'Only Admin can edit projects' });
      return;
    }
    if (action === 'Manage Clients' && userRole !== 'Admin') {
      toast.error('Access denied', { description: 'Only Admin can manage clients' });
      return;
    }

    switch (action) {
      case 'View Details':
        setSelectedClient(client);
        setClientDetailsOpen(true);
        break;
      case 'View Drivers':
        navigate(`/drivers?client=${encodeURIComponent(client.name)}`);
        break;
      case 'Export Report': {
        // Generate comprehensive client report
        const reportData = generateClientReport(client);
        downloadReport(reportData, `${client.name.replace(/\s+/g, '_')}_Report.pdf`);
        break;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onAssignReassign={userRole === 'Admin' || userRole === 'Staff' ? () => setChoiceModalOpen(true) : undefined}
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
           {/* Page Title & Actions */}
           <div className="flex items-center justify-between">
             <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
               <h1 className="text-3xl font-bold font-display text-foreground">Clients / Projects</h1>
               <p className="text-muted-foreground mt-1">Manage client profiles and project assignments</p>
             </motion.div>

             <div className="flex items-center gap-3">
               {userRole === 'Admin' && (
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => setAddClientModalOpen(true)}
                   className="btn-primary-glow px-4 py-2 rounded-lg text-primary-foreground font-semibold text-sm"
                 >
                   + Add New Client
                 </motion.button>
               )}
             </div>
           </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 relative"
              >
                <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => {
                          setSelectedClient(client);
                          setClientDetailsOpen(true);
                        }}
                      >
                        <img src={client.logo} alt={`${client.name} logo`} className="w-full h-full object-cover" />
                      </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">Client ID: {client.id}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 hover:bg-muted/50 rounded-lg transition-colors">
                        <MoreVertical size={18} className="text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="glass-card border-border/50">
                       <DropdownMenuItem onClick={() => handleMenuAction('View Details', client)}>
                         View Details
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleMenuAction('View Drivers', client)}>
                         View Drivers
                       </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleMenuAction('Export Report', client)}>
                         Export Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>Contract: {client.contractStart.toLocaleDateString()} - {client.contractEnd.toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users size={16} className="text-muted-foreground" />
                    <span>Drivers Assigned: {client.assignedDrivers.length}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">SLA: </span>
                    <span className="text-success">{client.sla}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      {(userRole === 'Admin' || userRole === 'Staff') && (
        <>
          <AssignDriverModal open={assignModalOpen} onOpenChange={setAssignModalOpen} />
          <ReassignDriverModal open={reassignModalOpen} onOpenChange={setReassignModalOpen} />
        </>
      )}

      <ClientDetailsModal
        client={selectedClient}
        open={clientDetailsOpen}
        onOpenChange={setClientDetailsOpen}
      />

      <AddClientModal
        open={addClientModalOpen}
        onOpenChange={setAddClientModalOpen}
      />

      <AddClientModal
        open={addClientModalOpen}
        onOpenChange={setAddClientModalOpen}
      />

      <Dialog open={choiceModalOpen} onOpenChange={setChoiceModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Assignment Type</DialogTitle>
            <DialogDescription>
              Select whether you want to assign a driver to a new client or reassign an existing assignment.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setChoiceModalOpen(false);
                setAssignModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Assign New
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setChoiceModalOpen(false);
                setReassignModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <ArrowRightLeft size={16} />
              Reassign
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientsPage;