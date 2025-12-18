import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';
import { DollarSign, TrendingUp, TrendingDown, User, CreditCard, ArrowUpRight, FileText, Wallet, Award, MinusCircle, Calculator, Download, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyDisplay } from '@/components/ui/currency-display';

const FinancePage = () => {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [driverSearchQuery, setDriverSearchQuery] = useState('');
  const { userRole, sidebarOpen, setSidebarOpen, drivers } = useStore();
  const isMobile = useIsMobile();

  // Filter drivers based on search query
  const filteredDrivers = useMemo(() =>
    drivers.filter(driver =>
      driverSearchQuery === '' ||
      driver.name.toLowerCase().includes(driverSearchQuery.toLowerCase()) ||
      driver.id.toLowerCase().includes(driverSearchQuery.toLowerCase())
    ), [drivers, driverSearchQuery]
  );

  // Generate individual driver financial report in HTML format
  const generateDriverReport = (driver: typeof drivers[0]) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Financial Report - ${driver.name}</title>
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
            font-size: 24px;
        }
        h2 {
            color: #0056b3;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
            font-size: 18px;
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
        <h1>Driver Financial Report</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="driver-info">
        <h2>Driver Information</h2>
        <table>
            <tbody>
                <tr><td><strong>Driver ID:</strong></td><td>${driver.id}</td></tr>
                <tr><td><strong>Name:</strong></td><td>${driver.name}</td></tr>
                <tr><td><strong>Phone:</strong></td><td>${driver.phone}</td></tr>
                <tr><td><strong>Emirates ID:</strong></td><td>${driver.emiratesId}</td></tr>
                <tr><td><strong>License Number:</strong></td><td>${driver.licenseNumber}</td></tr>
                <tr><td><strong>License Expiry:</strong></td><td>${driver.licenseExpiry.toLocaleDateString()}</td></tr>
                <tr><td><strong>Current Status:</strong></td><td><span class="status-badge status-${driver.status.toLowerCase()}">${driver.status}</span></td></tr>
                <tr><td><strong>Last Activity:</strong></td><td>${driver.lastActivity.toLocaleDateString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="financial-summary">
        <h2>Financial Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Base Salary:</strong></td><td>د.إ ${driver.baseSalary.toLocaleString()}</td></tr>
                <tr><td><strong>Advance Paid:</strong></td><td>د.إ ${driver.advancePaid.toLocaleString()}</td></tr>
                <tr><td><strong>Incentives Earned:</strong></td><td>د.إ ${driver.incentivesEarned.toLocaleString()}</td></tr>
                <tr><td><strong>Net Payable:</strong></td><td>د.إ ${driver.netPayable.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="calculations">
        <h2>Calculations</h2>
        <table>
            <tbody>
                <tr><td><strong>Gross Earnings:</strong></td><td>د.إ ${(driver.baseSalary + driver.incentivesEarned).toLocaleString()}</td></tr>
                <tr><td><strong>Total Deductions:</strong></td><td>د.إ ${driver.advancePaid.toLocaleString()}</td></tr>
                <tr><td><strong>Net Amount:</strong></td><td>د.إ ${driver.netPayable.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="payment-status">
        <h2>Payment Status</h2>
        <ul>
            <li>${driver.advancePaid > 0 ? '✓ Advance payment recorded' : '✗ No advance payments'}</li>
            <li>${driver.incentivesEarned > 0 ? '✓ Incentives earned and pending' : '✗ No incentives recorded'}</li>
            <li>${driver.netPayable > 0 ? '✓ Payment due' : '✗ No outstanding payments'}</li>
        </ul>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Financial Report | Generated on ${new Date().toLocaleString()}</p>
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

  // Generate comprehensive financial reports in HTML format
  const generateMonthlyPayrollSummary = () => {
    const totalBaseSalary = drivers.reduce((sum, d) => sum + d.baseSalary, 0);
    const totalAdvances = drivers.reduce((sum, d) => sum + d.advancePaid, 0);
    const totalIncentives = drivers.reduce((sum, d) => sum + d.incentivesEarned, 0);
    const totalNetPayable = drivers.reduce((sum, d) => sum + d.netPayable, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monthly Payroll Summary</title>
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
        <h1>Monthly Payroll Summary</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="payroll-overview">
        <h2>Payroll Overview</h2>
        <table>
            <tbody>
                <tr><td><strong>Report Period:</strong></td><td>${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</td></tr>
                <tr><td><strong>Total Drivers:</strong></td><td>${drivers.length}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="payroll-breakdown">
        <h2>Payroll Breakdown</h2>
        <table>
            <tbody>
                <tr><td><strong>Total Base Salary:</strong></td><td>د.إ ${totalBaseSalary.toLocaleString()}</td></tr>
                <tr><td><strong>Total Advances Paid:</strong></td><td>د.إ ${totalAdvances.toLocaleString()}</td></tr>
                <tr><td><strong>Total Incentives Earned:</strong></td><td>د.إ ${totalIncentives.toLocaleString()}</td></tr>
                <tr><td><strong>Total Net Payable:</strong></td><td>د.إ ${totalNetPayable.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="averages">
        <h2>Averages</h2>
        <table>
            <tbody>
                <tr><td><strong>Average Base Salary:</strong></td><td>د.إ ${(totalBaseSalary / drivers.length).toFixed(2)}</td></tr>
                <tr><td><strong>Average Net Payable:</strong></td><td>د.إ ${(totalNetPayable / drivers.length).toFixed(2)}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="status-summary">
        <h2>Status Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Active Drivers:</strong></td><td>${drivers.filter(d => d.status === 'Active').length}</td></tr>
                <tr><td><strong>Drivers with Advances:</strong></td><td>${drivers.filter(d => d.advancePaid > 0).length}</td></tr>
                <tr><td><strong>Drivers with Incentives:</strong></td><td>${drivers.filter(d => d.incentivesEarned > 0).length}</td></tr>
            </tbody>
        </table>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Payroll Report</p>
    </footer>
</body>
</html>`;
    return html;
  };

  const generateAdvancePaymentHistory = () => {
    const driversWithAdvances = drivers.filter(d => d.advancePaid > 0);
    const totalAdvanceAmount = driversWithAdvances.reduce((sum, d) => sum + d.advancePaid, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advance Payment History</title>
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
        <h1>Advance Payment History</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="advance-summary">
        <h2>Advance Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Total Drivers with Advances:</strong></td><td>${driversWithAdvances.length}</td></tr>
                <tr><td><strong>Total Advance Amount:</strong></td><td>د.إ ${totalAdvanceAmount.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="advance-details">
        <h2>Advance Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Driver Name</th>
                    <th>Driver ID</th>
                    <th>Advance Amount</th>
                    <th>Status</th>
                    <th>Last Activity</th>
                </tr>
            </thead>
            <tbody>
                ${driversWithAdvances.map((driver, index) => `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.id}</td>
                    <td>د.إ ${driver.advancePaid.toLocaleString()}</td>
                    <td>${driver.status}</td>
                    <td>${driver.lastActivity.toLocaleDateString()}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Advance Payment Report</p>
    </footer>
</body>
</html>`;
    return html;
  };

  const generateIncentiveDistributionReport = () => {
    const driversWithIncentives = drivers.filter(d => d.incentivesEarned > 0);
    const totalIncentives = driversWithIncentives.reduce((sum, d) => sum + d.incentivesEarned, 0);
    const averageIncentive = driversWithIncentives.length > 0 ? (totalIncentives / driversWithIncentives.length) : 0;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Incentive Distribution Report</title>
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
        <h1>Incentive Distribution Report</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="incentive-summary">
        <h2>Incentive Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Drivers with Incentives:</strong></td><td>${driversWithIncentives.length}</td></tr>
                <tr><td><strong>Total Incentives Distributed:</strong></td><td>د.إ ${totalIncentives.toLocaleString()}</td></tr>
                <tr><td><strong>Average Incentive per Driver:</strong></td><td>د.إ ${averageIncentive.toFixed(2)}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="incentive-details">
        <h2>Incentive Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Driver Name</th>
                    <th>Driver ID</th>
                    <th>Incentives Earned</th>
                    <th>Base Salary</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${driversWithIncentives
                  .sort((a, b) => b.incentivesEarned - a.incentivesEarned)
                  .map((driver, index) => `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.id}</td>
                    <td>د.إ ${driver.incentivesEarned.toLocaleString()}</td>
                    <td>د.إ ${driver.baseSalary.toLocaleString()}</td>
                    <td>${driver.status}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Incentive Report</p>
    </footer>
</body>
</html>`;
    return html;
  };

  const generateDriverSalaryLedger = () => {
    const totalBaseSalary = drivers.reduce((sum, d) => sum + d.baseSalary, 0);
    const totalAdvances = drivers.reduce((sum, d) => sum + d.advancePaid, 0);
    const totalIncentives = drivers.reduce((sum, d) => sum + d.incentivesEarned, 0);
    const totalNetPayable = drivers.reduce((sum, d) => sum + d.netPayable, 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Salary Ledger</title>
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
        <h1>Driver Salary Ledger</h1>
        <p>Class Worldwide Operations Control | Prepared on ${new Date().toLocaleDateString()}</p>
    </header>

    <section id="ledger-overview">
        <h2>Ledger Overview</h2>
        <table>
            <tbody>
                <tr><td><strong>Total Drivers:</strong></td><td>${drivers.length}</td></tr>
                <tr><td><strong>Report Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
            </tbody>
        </table>
    </section>

    <section id="salary-details">
        <h2>Salary Details</h2>
        <table>
            <thead>
                <tr>
                    <th>Driver Name</th>
                    <th>Driver ID</th>
                    <th>Base Salary</th>
                    <th>Advances Paid</th>
                    <th>Incentives Earned</th>
                    <th>Net Payable</th>
                    <th>Status</th>
                    <th>Last Activity</th>
                </tr>
            </thead>
            <tbody>
                ${drivers.map((driver, index) => `
                <tr>
                    <td>${driver.name}</td>
                    <td>${driver.id}</td>
                    <td>AED ${driver.baseSalary.toLocaleString()}</td>
                    <td>د.إ ${driver.advancePaid.toLocaleString()}</td>
                    <td>AED ${driver.incentivesEarned.toLocaleString()}</td>
                    <td>AED ${driver.netPayable.toLocaleString()}</td>
                    <td>${driver.status}</td>
                    <td>${driver.lastActivity.toLocaleDateString()}</td>
                </tr>
                `).join('')}
            </tbody>
        </table>
    </section>

    <section id="summary">
        <h2>Summary</h2>
        <table>
            <tbody>
                <tr><td><strong>Total Base Salary:</strong></td><td>AED ${totalBaseSalary.toLocaleString()}</td></tr>
                <tr><td><strong>Total Advances:</strong></td><td>AED ${totalAdvances.toLocaleString()}</td></tr>
                <tr><td><strong>Total Incentives:</strong></td><td>AED ${totalIncentives.toLocaleString()}</td></tr>
                <tr><td><strong>Total Net Payable:</strong></td><td>AED ${totalNetPayable.toLocaleString()}</td></tr>
            </tbody>
        </table>
    </section>

    <footer>
        <p>&copy; 2025 Class Worldwide Operations Control. All rights reserved.</p>
        <p>Confidential Salary Ledger</p>
    </footer>
</body>
</html>`;
    return html;
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
        onAssignReassign={userRole === 'Admin' || userRole === 'Staff' ? () => {
          setAssignModalOpen(true);
        } : undefined}
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
             <h1 className="text-3xl font-bold font-display text-foreground">HR Finance</h1>
             <p className="text-muted-foreground mt-1">Driver salary management, advances, incentives, and payroll</p>
           </motion.div>

           <Tabs defaultValue="overview" className="space-y-6">
             <TabsList className="grid w-full grid-cols-5">
               <TabsTrigger value="overview">Overview</TabsTrigger>
               <TabsTrigger value="advances">Advances</TabsTrigger>
               <TabsTrigger value="incentives">Incentives</TabsTrigger>
               <TabsTrigger value="payroll">Payroll</TabsTrigger>
               <TabsTrigger value="reports">Reports</TabsTrigger>
             </TabsList>

             <TabsContent value="overview" className="space-y-6">
               {/* Financial Summary Cards */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="glass-card p-6"
                 >
                   <div className="flex items-center gap-3 mb-2">
                     <Wallet className="text-primary" size={24} />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Advances Paid</p>
                        <p className="text-2xl font-bold"><CurrencyDisplay amount={drivers.reduce((sum, d) => sum + d.advancePaid, 0)} size={20} /></p>
                      </div>
                   </div>
                   <div className="flex items-center text-success text-sm">
                     <TrendingUp size={16} />
                     <span className="ml-1">Active drivers</span>
                   </div>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.1 }}
                   className="glass-card p-6"
                 >
                   <div className="flex items-center gap-3 mb-2">
                      <Award className="text-warning" size={24} />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Incentives</p>
                        <p className="text-2xl font-bold"><CurrencyDisplay amount={drivers.reduce((sum, d) => sum + d.incentivesEarned, 0)} size={20} /></p>
                      </div>
                   </div>
                   <div className="flex items-center text-warning text-sm">
                     <TrendingUp size={16} />
                     <span className="ml-1">This month</span>
                   </div>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 }}
                   className="glass-card p-6"
                 >
                   <div className="flex items-center gap-3 mb-2">
                      <MinusCircle className="text-destructive" size={24} />
                      <div>
                        <p className="text-sm text-muted-foreground">Total Deductions</p>
                        <p className="text-2xl font-bold"><CurrencyDisplay amount={drivers.reduce((sum, d) => sum + d.deductions, 0)} size={20} /></p>
                      </div>
                   </div>
                   <div className="flex items-center text-destructive text-sm">
                     <TrendingDown size={16} />
                     <span className="ml-1">Pending</span>
                   </div>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.3 }}
                   className="glass-card p-6"
                 >
                   <div className="flex items-center gap-3 mb-2">
                      <Calculator className="text-success" size={24} />
                      <div>
                        <p className="text-sm text-muted-foreground">Net Payable</p>
                        <p className="text-2xl font-bold"><CurrencyDisplay amount={drivers.reduce((sum, d) => sum + d.netPayable, 0)} size={20} /></p>
                      </div>
                   </div>
                   <div className="flex items-center text-success text-sm">
                     <TrendingUp size={16} />
                     <span className="ml-1">Ready to pay</span>
                   </div>
                 </motion.div>
               </div>

                {/* Driver Search */}
                <div className="glass-card p-4 mb-6">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      placeholder="Search drivers by name or ID..."
                      value={driverSearchQuery}
                      onChange={(e) => setDriverSearchQuery(e.target.value)}
                      className="input-glass w-full h-10 pl-10 pr-4 rounded-lg bg-muted/30 border border-border/50 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Showing {filteredDrivers.length} of {drivers.length} drivers
                  </p>
                </div>

                {/* Driver Financial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDrivers.map((driver, index) => (
                   <motion.div
                     key={driver.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1 }}
                     className="glass-card p-6"
                   >
                      <div className="flex items-center gap-3 mb-4 min-h-[44px]">
                        <div
                          className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg flex-shrink-0"
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
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{driver.name}</h3>
                          <p className="text-sm text-muted-foreground">ID: {driver.id}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Salary:</span>
                          <CurrencyDisplay amount={driver.baseSalary} />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Advance Paid:</span>
                          <span className="text-destructive font-semibold"><CurrencyDisplay amount={driver.advancePaid} /></span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Incentives:</span>
                          <span className="text-success font-semibold"><CurrencyDisplay amount={driver.incentivesEarned} /></span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Net Payable:</span>
                          <span className="text-primary font-semibold"><CurrencyDisplay amount={driver.netPayable} /></span>
                        </div>
                      </div>

                      {/* Individual Driver Report Button */}
                      <div className="mt-4 pt-3 border-t border-border/30">
                        <button
                          onClick={() => {
                            const reportData = generateDriverReport(driver);
                            downloadReport(reportData, `${driver.name.replace(/\s+/g, '_')}_Financial_Report.pdf`);
                          }}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                        >
                          <Download size={16} />
                          Download Report
                        </button>
                      </div>
                   </motion.div>
                 ))}
               </div>
             </TabsContent>

             <TabsContent value="advances" className="space-y-6">
               <div className="glass-card p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Wallet size={24} className="text-primary" />
                   <h3 className="text-xl font-semibold">Advance Payments</h3>
                 </div>
                 <p className="text-muted-foreground">Track and manage driver advance payments.</p>
                 <div className="mt-4 space-y-2">
                   {drivers.filter(d => d.advancePaid > 0).map((driver, index) => (
                     <div key={driver.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                       <div>
                         <span className="font-semibold">{driver.name}</span>
                         <span className="text-sm text-muted-foreground ml-2">ID: {driver.id}</span>
                       </div>
                        <span className="text-primary font-semibold"><CurrencyDisplay amount={driver.advancePaid} /></span>
                     </div>
                   ))}
                   {drivers.filter(d => d.advancePaid === 0).length > 0 && (
                     <p className="text-sm text-muted-foreground mt-4">No advances recorded for {drivers.filter(d => d.advancePaid === 0).length} drivers.</p>
                   )}
                 </div>
               </div>
             </TabsContent>

             <TabsContent value="incentives" className="space-y-6">
               <div className="glass-card p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Award size={24} className="text-warning" />
                   <h3 className="text-xl font-semibold">Performance Incentives</h3>
                 </div>
                 <p className="text-muted-foreground">Monitor driver incentives and performance bonuses.</p>
                 <div className="mt-4 space-y-2">
                   {drivers.filter(d => d.incentivesEarned > 0).map((driver, index) => (
                     <div key={driver.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                       <div>
                         <span className="font-semibold">{driver.name}</span>
                         <span className="text-sm text-muted-foreground ml-2">ID: {driver.id}</span>
                       </div>
                        <span className="text-success font-semibold"><CurrencyDisplay amount={driver.incentivesEarned} /></span>
                     </div>
                   ))}
                   {drivers.filter(d => d.incentivesEarned === 0).length > 0 && (
                     <p className="text-sm text-muted-foreground mt-4">No incentives earned for {drivers.filter(d => d.incentivesEarned === 0).length} drivers.</p>
                   )}
                 </div>
               </div>
             </TabsContent>

             <TabsContent value="payroll" className="space-y-6">
               <div className="glass-card p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <Calculator size={24} className="text-success" />
                   <h3 className="text-xl font-semibold">Payroll Management</h3>
                 </div>
                 <p className="text-muted-foreground">Calculate and process driver salaries and deductions.</p>
                 <div className="mt-4 space-y-2">
                   {drivers.map((driver, index) => (
                     <div key={driver.id} className="p-4 bg-muted/50 rounded-lg">
                       <div className="flex justify-between items-center mb-2">
                         <span className="font-semibold">{driver.name}</span>
                          <span className="text-primary font-bold"><CurrencyDisplay amount={driver.netPayable} /></span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Base: </span>
                            <CurrencyDisplay amount={driver.baseSalary} />
                          </div>
                          <div>
                            <span className="text-muted-foreground">Incentives: </span>
                            <span className="text-success"><CurrencyDisplay amount={driver.incentivesEarned} /></span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Advances: </span>
                            <span className="text-destructive"><CurrencyDisplay amount={driver.advancePaid} /></span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deductions: </span>
                            <span className="text-destructive"><CurrencyDisplay amount={driver.deductions} /></span>
                          </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             </TabsContent>

             <TabsContent value="reports" className="space-y-6">
               <div className="glass-card p-6">
                 <div className="flex items-center gap-3 mb-4">
                   <FileText size={24} className="text-primary" />
                   <h3 className="text-xl font-semibold">Financial Reports</h3>
                 </div>
                 <p className="text-muted-foreground">Generate comprehensive HR financial reports.</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Monthly Payroll Summary</span>
                      <button
                      onClick={() => {
                        const reportData = generateMonthlyPayrollSummary();
                        downloadReport(reportData, `Monthly_Payroll_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
                      }}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Download Report
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Advance Payment History</span>
                      <button
                        onClick={() => {
                          const reportData = generateAdvancePaymentHistory();
                          downloadReport(reportData, `Advance_Payment_History_${new Date().toISOString().split('T')[0]}.pdf`);
                        }}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Download Report
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Incentive Distribution Report</span>
                      <button
                        onClick={() => {
                          const reportData = generateIncentiveDistributionReport();
                          downloadReport(reportData, `Incentive_Distribution_Report_${new Date().toISOString().split('T')[0]}.pdf`);
                        }}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Download Report
                      </button>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Driver Salary Ledger</span>
                      <button
                        onClick={() => {
                          const reportData = generateDriverSalaryLedger();
                          downloadReport(reportData, `Driver_Salary_Ledger_${new Date().toISOString().split('T')[0]}.pdf`);
                        }}
                        className="text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Download Report
                      </button>
                    </div>
                  </div>
               </div>
             </TabsContent>
           </Tabs>
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

export default FinancePage;