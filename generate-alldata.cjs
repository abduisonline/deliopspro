#!/usr/bin/env node

/**
 * Script to generate alldata.json file containing all application data
 * Run with: node generate-alldata.js
 */

const fs = require('fs');
const path = require('path');

// Mock data structure (simulating the app's data)
const mockData = {
  version: "1.0",
  exportDate: new Date().toISOString(),
  exportedBy: "system",

  // User data
  currentUser: {
    email: "saleeq@classworldwide.com",
    name: "Saleeq Siraj",
    title: "Head of Operations",
    role: "Admin",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=saleeq"
  },
  userRole: "Admin",

  // Application settings
  settings: {
    theme: "dark",
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    language: "en",
    timezone: "UTC+4"
  },

  // Sample drivers data
  drivers: [
    {
      id: "679.0",
      name: "Muhammad Ramzan Muhammad Ashraf",
      phone: "",
      email: "",
      status: "Inactive",
      emiratesId: "784-1987-7489170-3",
      licenseNumber: "",
      licenseExpiry: new Date("2027-08-27"),
      documents: [],
      assignedClient: null,
      assignedVehicle: null,
      assignedAssets: [],
      assignedSim: null,
      lastActivity: new Date(),
      notes: [],
      baseSalary: 8000,
      advancePaid: 1250,
      incentivesEarned: 850,
      deductions: 300,
      totalEarnings: 8850,
      netPayable: 7300
    },
    {
      id: "227.0",
      name: "Muhammad Imran Muhammad Qasim",
      phone: "",
      email: "",
      status: "Inactive",
      emiratesId: "784-1998-9617165-1",
      licenseNumber: "",
      licenseExpiry: new Date("2027-09-16"),
      documents: [],
      assignedClient: null,
      assignedVehicle: null,
      assignedAssets: [],
      assignedSim: null,
      lastActivity: new Date(),
      notes: [],
      baseSalary: 8000,
      advancePaid: 2100,
      incentivesEarned: 1200,
      deductions: 450,
      totalEarnings: 9200,
      netPayable: 6750
    }
  ],

  // Sample vehicles data
  vehicles: [
    {
      id: "48245-1",
      plate: "48245-1",
      make: "Bajaj",
      model: "Pulsar",
      makeYear: 2021,
      status: "Idle",
      insuranceExpiry: new Date("2025-12-31"),
      registrationExpiry: new Date("2025-12-31"),
      assignedDriver: null
    },
    {
      id: "46832-1",
      plate: "46832-1",
      make: "Bajaj",
      model: "Pulsar",
      makeYear: 2021,
      status: "Idle",
      insuranceExpiry: new Date("2025-12-31"),
      registrationExpiry: new Date("2025-12-31"),
      assignedDriver: null
    }
  ],

  // Sample assets data
  assets: [
    {
      id: "helmet-001",
      name: "Safety Helmet",
      type: "Safety Equipment",
      totalQuantity: 50,
      availableQuantity: 45,
      assignments: []
    },
    {
      id: "jacket-001",
      name: "Reflective Jacket",
      type: "Safety Equipment",
      totalQuantity: 30,
      availableQuantity: 28,
      assignments: []
    }
  ],

  // Sample SIM cards data
  simCards: [
    {
      id: "sim-001",
      number: "+971501234567",
      carrier: "Etisalat",
      plan: "Unlimited",
      costCenter: "Operations",
      status: "Available",
      assignedDriver: null
    }
  ],

  // Sample clients data
  clients: [
    {
      id: "50086",
      name: "Noon Supermall",
      logo: "/placeholder.svg",
      contractStart: new Date("2023-01-01"),
      contractEnd: new Date("2024-12-31"),
      rateCard: 5000,
      sla: "24/7 Support",
      assignedDrivers: []
    }
  ],

  // Sample assignments data
  assignments: [],

  // Sample audit logs
  auditLogs: [
    {
      id: "1",
      userId: "saleeq@classworldwide.com",
      action: "Login",
      before: null,
      after: { userRole: "Admin" },
      timestamp: new Date(),
      ip: "192.168.1.1",
      device: "Chrome on Windows",
      reason: "User authentication"
    }
  ],

  // Metadata
  dataCounts: {
    drivers: 2,
    vehicles: 2,
    assets: 2,
    simCards: 1,
    clients: 1,
    assignments: 0,
    auditLogs: 1
  }
};

// Write to file
const filePath = path.join(__dirname, 'alldata.json');
fs.writeFileSync(filePath, JSON.stringify(mockData, null, 2));

console.log('✅ alldata.json generated successfully!');
console.log(`📁 File saved to: ${filePath}`);
console.log(`📊 Data summary: ${mockData.dataCounts.drivers} drivers, ${mockData.dataCounts.vehicles} vehicles, ${mockData.dataCounts.assets} assets, ${mockData.dataCounts.clients} clients`);