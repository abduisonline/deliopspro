import { useStore } from '@/store/useStore';
import { useTheme } from 'next-themes';

// Utility function to export all application data
export const exportAllData = () => {
  const {
    currentUser,
    userRole,
    drivers,
    vehicles,
    assets,
    sims,
    clients,
    assignments,
    auditLogs
  } = useStore.getState();

  const { theme } = useTheme();

  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    exportedBy: currentUser?.email || 'system',

    // User data
    currentUser,
    userRole,

    // Application settings
    settings: {
      theme: theme || 'dark',
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false
      },
      language: 'en',
      timezone: 'UTC+4'
    },

    // Core data
    drivers,
    vehicles,
    assets,
    simCards: sims, // renamed for clarity
    clients,
    assignments,
    auditLogs,

    // Metadata
    dataCounts: {
      drivers: drivers.length,
      vehicles: vehicles.length,
      assets: assets.length,
      simCards: sims.length,
      clients: clients.length,
      assignments: assignments.length,
      auditLogs: auditLogs.length
    }
  };

  return exportData;
};

// Function to save data to a file (for development/build time)
export const saveAllDataToFile = () => {
  const data = exportAllData();

  // In browser environment, this would trigger a download
  if (typeof window !== 'undefined') {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `deliops-alldata-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  return data;
};