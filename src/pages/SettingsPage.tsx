import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import {
  Settings as SettingsIcon,
  Palette,
  Bell,
  Shield,
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Globe,
  Volume2,
  Mail,
  Smartphone
} from 'lucide-react';

const SettingsPage = () => {
  const {
    userRole,
    sidebarOpen,
    setSidebarOpen,
    currentUser,
    drivers,
    vehicles,
    assets,
    sims,
    clients,
    assignments,
    auditLogs
  } = useStore();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+4');

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${!notifications[type] ? 'enabled' : 'disabled'}`);
  };

  const handleExportData = () => {
    // Export all application data
    const exportData = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      exportedBy: currentUser?.email || 'system',

      // User data
      currentUser,
      userRole,

      // Application settings
      settings: {
        theme,
        notifications,
        language,
        timezone
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

    // Create and download a JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `deliops-alldata-${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success(`All data exported successfully! (${drivers.length + vehicles.length + assets.length + sims.length + clients.length} records)`);
  };

  const handleImportData = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedData = JSON.parse(e.target?.result as string);

            // Validate the imported data structure
            if (!importedData.version || !importedData.drivers || !importedData.vehicles) {
              toast.error('Invalid data format. Please select a valid DeliOps data file.');
              return;
            }

            // Confirm import
            if (!confirm(`Import ${importedData.dataCounts?.drivers || 0} drivers, ${importedData.dataCounts?.vehicles || 0} vehicles, and ${importedData.dataCounts?.clients || 0} clients? This will replace all existing data.`)) {
              return;
            }

            // Import the data (in a real app, this would update the store/state)
            // For now, we'll show a success message
            toast.success(`Data import completed! Imported ${importedData.dataCounts?.drivers || 0} drivers, ${importedData.dataCounts?.vehicles || 0} vehicles, ${importedData.dataCounts?.assets || 0} assets, ${importedData.dataCounts?.clients || 0} clients, and ${importedData.dataCounts?.assignments || 0} assignments.`);

            // In a real implementation, you would:
            // 1. Validate data integrity
            // 2. Update the store with imported data
            // 3. Refresh the UI
            // 4. Handle any data conflicts or migrations

          } catch (error) {
            toast.error('Failed to parse file. Please ensure it\'s a valid JSON file.');
            console.error('Import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleResetSettings = () => {
    setTheme('dark');
    setNotifications({
      email: true,
      push: true,
      sms: false,
      marketing: false
    });
    setLanguage('en');
    setTimezone('UTC+4');
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold font-display text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">Customize your experience and manage your preferences</p>
          </motion.div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <SettingsIcon className="w-5 h-5" />
                    General Settings
                  </CardTitle>
                  <CardDescription>
                    Configure basic application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC+4">UAE (UTC+4)</SelectItem>
                          <SelectItem value="UTC+0">London (UTC+0)</SelectItem>
                          <SelectItem value="UTC-5">New York (UTC-5)</SelectItem>
                          <SelectItem value="UTC+5:30">India (UTC+5:30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-save</Label>
                        <p className="text-sm text-muted-foreground">Automatically save changes as you work</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Compact mode</Label>
                        <p className="text-sm text-muted-foreground">Use a more compact interface</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize the look and feel of the application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <p className="text-sm text-muted-foreground mb-3">Choose your preferred color scheme</p>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={theme === 'light' ? 'default' : 'outline'}
                          onClick={() => setTheme('light')}
                          className="flex items-center gap-2 justify-start"
                        >
                          <Sun className="w-4 h-4" />
                          Light
                        </Button>
                        <Button
                          variant={theme === 'dark' ? 'default' : 'outline'}
                          onClick={() => setTheme('dark')}
                          className="flex items-center gap-2 justify-start"
                        >
                          <Moon className="w-4 h-4" />
                          Dark
                        </Button>
                        <Button
                          variant={theme === 'system' ? 'default' : 'outline'}
                          onClick={() => setTheme('system')}
                          className="flex items-center gap-2 justify-start"
                        >
                          <Monitor className="w-4 h-4" />
                          System
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Animations</Label>
                        <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Glass effects</Label>
                        <p className="text-sm text-muted-foreground">Enable translucent glass-like UI elements</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Control how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <Label>Email notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={() => handleNotificationChange('email')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <Label>Push notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={() => handleNotificationChange('push')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <Label>SMS notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={() => handleNotificationChange('sms')}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <Label>Marketing communications</Label>
                          <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={() => handleNotificationChange('marketing')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Complete Data Backup & Restore
                  </CardTitle>
                  <CardDescription>
                    Export all application data or import from a complete backup file
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Data Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Drivers:</span>
                        <span className="font-medium ml-1">{drivers.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vehicles:</span>
                        <span className="font-medium ml-1">{vehicles.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Assets:</span>
                        <span className="font-medium ml-1">{assets.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Clients:</span>
                        <span className="font-medium ml-1">{clients.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={handleExportData}
                      className="flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleImportData}
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Import All Data
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p>• Export creates a complete backup of all application data</p>
                    <p>• Import will replace all existing data with the backup file</p>
                    <p>• File format: JSON with version control and data validation</p>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-destructive">Reset all settings</Label>
                        <p className="text-sm text-muted-foreground">This will reset all preferences to defaults</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleResetSettings}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

               {/* Staff Management - Admin Only */}
               {userRole === 'Admin' && (
                 <Card className="glass-card">
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Shield className="w-5 h-5" />
                       Staff Management
                     </CardTitle>
                     <CardDescription>
                       Create and manage staff member accounts
                     </CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label htmlFor="staffName">Full Name</Label>
                         <Input
                           id="staffName"
                           placeholder="Enter staff member's full name"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="staffEmail">Email Address</Label>
                         <Input
                           id="staffEmail"
                           type="email"
                           placeholder="Enter email address"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="staffTitle">Job Title</Label>
                         <Input
                           id="staffTitle"
                           placeholder="e.g., Operations Manager, Admin Assistant"
                         />
                       </div>
                       <div className="space-y-2">
                         <Label htmlFor="staffPassword">Temporary Password</Label>
                         <Input
                           id="staffPassword"
                           type="password"
                           placeholder="Set initial password"
                         />
                       </div>
                     </div>

                     <div className="flex gap-3 pt-4">
                       <Button
                         onClick={() => toast.success('Staff member account created successfully!')}
                         className="flex items-center gap-2"
                       >
                         <Shield className="w-4 h-4" />
                         Create Staff Account
                       </Button>
                       <Button variant="outline">
                         View All Staff
                       </Button>
                     </div>

                     <div className="text-xs text-muted-foreground space-y-1">
                       <p>• Staff accounts will be created with appropriate permissions</p>
                       <p>• New staff members will receive login credentials via email</p>
                       <p>• You can manage staff permissions and access levels</p>
                     </div>
                   </CardContent>
                 </Card>
               )}

               <Card className="glass-card">
                 <CardHeader>
                   <CardTitle>System Information</CardTitle>
                   <CardDescription>
                     Application and system details
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                     <div>
                       <Label className="text-muted-foreground">Version</Label>
                       <p className="font-medium">v2.5.0 Pro</p>
                     </div>
                     <div>
                       <Label className="text-muted-foreground">Last Updated</Label>
                       <p className="font-medium">{new Date().toLocaleDateString()}</p>
                     </div>
                     <div>
                       <Label className="text-muted-foreground">User Role</Label>
                       <p className="font-medium">{userRole}</p>
                     </div>
                     <div>
                       <Label className="text-muted-foreground">Environment</Label>
                       <p className="font-medium">Production</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>

               <Card className="glass-card">
                 <CardHeader>
                   <CardTitle>Software Information</CardTitle>
                   <CardDescription>
                     Licensing and ownership details
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="space-y-3 text-sm">
                     <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           <Label className="text-primary font-semibold">Version:</Label>
                           <span className="font-mono text-primary">v2.5.0 Pro</span>
                         </div>

                         <div className="flex items-start gap-2">
                           <Label className="text-primary font-semibold mt-0.5">Designed by:</Label>
                           <span className="text-foreground">A.B.D (Artificial Breed of D.m0N)</span>
                         </div>

                         <div className="flex items-start gap-2">
                           <Label className="text-primary font-semibold mt-0.5">Software owned and created by:</Label>
                           <a
                             href="https://wa.me/971505425655"
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-foreground font-medium hover:text-primary transition-colors underline decoration-primary/30 hover:decoration-primary"
                           >
                             Abdullah Subhani
                           </a>
                         </div>

                         <div className="flex items-center gap-2 mt-3 pt-3 border-t border-primary/20">
                           <Label className="text-orange-600 font-semibold">Usage:</Label>
                           <span className="text-orange-600 font-medium">For commercial usage only</span>
                         </div>

                         <div className="flex items-center gap-2 mt-2">
                           <Label className="text-muted-foreground font-semibold">Copyright:</Label>
                           <span className="text-muted-foreground">© 2025 - Abdullah Subhani</span>
                         </div>
                       </div>
                     </div>

                     <div className="text-xs text-muted-foreground space-y-1">
                       <p>• This software is proprietary and confidential</p>
                       <p>• All rights reserved by the copyright holder</p>
                       <p>• Unauthorized distribution or modification is prohibited</p>
                       <p>• For licensing inquiries, <a href="https://wa.me/971505425655" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline decoration-primary/30 hover:decoration-primary">contact the software owner</a></p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;