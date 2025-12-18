import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useIsMobile } from '@/hooks/use-mobile';
import Login from "./pages/Login";
import Index from "./pages/Index";
import DriversPage from "./pages/DriversPage";
import VehiclesPage from "./pages/VehiclesPage";
import AssetsPage from "./pages/AssetsPage";
import SimCardsPage from "./pages/SimCardsPage";
import ClientsPage from "./pages/ClientsPage";
import CompliancePage from "./pages/CompliancePage";
import TicketsPage from "./pages/TicketsPage";
import FinancePage from "./pages/FinancePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import { AssignDriverModal } from '@/components/modals/AssignDriverModal';
import { ReassignDriverModal } from '@/components/modals/ReassignDriverModal';
import { Fab } from '@/components/ui/fab';

const queryClient = new QueryClient();

const AppContent = () => {
  const { addDriver, addVehicle, addAsset, addSim, addClient, drivers } = useStore();
  const [fabOpen, setFabOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);
  const isMobile = useIsMobile();

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('userRole');

  useEffect(() => {
    if (drivers.length === 0) {
    // Initialize driver data from CSV
    const csvData = `Class Employee Code,Name,Status,Personal Number,EID,Visa Expiry,Passport No,Passport Expiry,License No,Traffic File No,License Expiry,Nationality
402.0,Asim Basharat Basharat Hussain Shaheen,ASSIGNED,0509416984,784-1998-2107240-4,2026-11-02,DA3841512,2032-07-10,4240944.0,15416517.0,2024-02-03,Pakistan
278.0,Hassan Md Golam Kibria,ASSIGNED,0523937708,784-1984-1609263-7,2025-12-18,EJ0970192,2026-11-29,2085171.0,12438981.0,2024-08-10,Bangladesh
559.0,Muhammad Musharaf Aslam Muhammad Aslam,ASSIGNED,971527847814 / 0522729704,784-1986-4154385-9,2026-02-26,SQ1819202,2026-06-10,4280292.0,15549148.0,,Pakistan
339.0,Sarfraz Ahmad Zulfiqar Shah,ASSIGNED,0554235224,784-1995-9646529-6,2026-03-26,KM1164123,2028-07-05,3749064.0,13257013.0,2024-12-10,Pakistan
317.0,Muhammad Bilal,ASSIGNED,0564769084,784-1988-0298482-7,2026-03-13,SF4125973,2032-09-27,767694.0,321008817.0,2023-09-22,Pakistan
249.0,Shoaib Ahmed Mian Muhammad Din,ASSIGNED,0507449806,784-1991-8044293-7,45965,SV8652881,47181,1266866.0,1250012371.0,02-07-2026,Pakistan
560.0,Arun Gangarapu Limbanna Gangarapu,ASSIGNED,581729644,784-1997-3961819-9,2026-03-12,P0712627,2026-04-14,4268428.0,47282.0,2029-06-13,India
332.0,Muhammad Zubair Talib Hussain,UNASSIGNED,0563409553,784-1988-5479642-6,2026-04-20,AN5091704,2029-03-04,3948297.0,14080415.0,2026-08-06,Pakistan
,Muhammad Umar Ashfaq,ASSIGNED,0,0,,0,1900-01-00,0.0,0.0,,0
634.0,Muhammad Umair Muhammad Akhtar,ASSIGNED,971567099446,784-1984-7502584-1,2027-01-09,AE2297454,2029-09-02,4962352.0,16752816.0,,Pakistan
407.0,Muhammad Asad Mehmood Manzoor Ahmad,UNASSIGNED,0526391779 / 0504635536,784-1995-6870495-3,2026-11-21,EN0166252,2025-09-02,3920233.0,14074978.0,2026-04-17,Pakistan
204.0,Muhammad Ramzan Khadim Hussain,UNASSIGNED,0527264925 / 0507264925,784-1989-5935049-1,2025-12-04,AQ9210024,2028-07-18,3442463.0,12713642.0,2025-03-18,Pakistan
428.0,Suleman Yasin Muhammad Yasin,ASSIGNED,0582157231,784-1992-1328798-2,2026-11-25,FF6809092,2027-09-15,247837.0,62100068805.0,2024-07-24,Pakistan
418.0,Ahmad Fraz Hafiz Muhammad Shafi,ASSIGNED,0565419036,784-1990-4667800-1,2026-11-20,FX8915741,2025-09-02,4094142.0,15024053.0,2028-03-01,Pakistan
,Amandeep Singh Chinderpal Singh,UNASSIGNED,0,784-2002-9186395-7,,W3319837,2032-09-14,0.0,0.0,,0
374.0,Muhammad Akram Abdul Ghafoor,ASSIGNED,0507449825,784-1978-1097078-0,46250,RN5148409,48149,4116604.0,15124284.0,18-01-2026,Pakistan
,Muhammad Jaffar Nazar Hussain,UNASSIGNED,0,784-1989-5427974-5,2027-07-11,AW0160502,2026-03-28,4071298.0,14377327.0,2027-12-10,Pakistan
,Jamshaid Tariq Tariq Mehmood,UNASSIGNED,502853751,784-1999-7638417-4,2027-04-07,EF7965872,2029-11-11,0.0,0.0,,Pakistan
,Muhammad Nadir Abdul Kareem,UNASSIGNED,0,0,,0,1900-01-00,0.0,0.0,,0
,Muhammad Faisal Shameer,UNASSIGNED,0,0,,0,1900-01-00,0.0,0.0,,0
,Shahrooz Iqbal Muhammad Akhtar Abbas,UNASSIGNED,0552786756 / 527847948,784-1994-5320250-1,2026-11-22,QX1337843,2029-07-10,3891759.0,13926325.0,2025-12-27,Pakistan
,Muhammad Zahid Muhammad Iqbal,UNASSIGNED,0505983299,784-1992-1738469-4,2023-10-03,EU5170502,2026-04-04,4087348.0,14089337.0,2023-01-28,Pakistan
,Muhammad Mohsin Muhammad Siddique,UNASSIGNED,0563385134,784-1993-6290843-8,2024-01-18,AQ0110893,2022-04-04,0.0,0.0,,Pakistan
,Muhammad Faizan Muhammad Amin,UNASSIGNED,0586508177,784-2000-7982061-7,2024-04-11,GY8910381,2026-10-20,4354802.0,15619235.0,2024-11-10,Pakistan
,Talha Umar Muhammad Umar Wada,UNASSIGNED,0564456503,784-1996-2933932-8,2024-10-12,DC2224161,2026-12-20,4318748.0,15559762.0,2024-08-14,Pakistan
,Waqar Ahmed Nisar Ahmed,UNASSIGNED,0523416408,784-1999-2678741-9,2024-12-19,AU1179833,2027-10-23,2780692.0,1220026578.0,2029-06-08,Pakistan
,Ali Hassan Muhammad Khalid,UNASSIGNED,0586370772,784-1996-0741930-8,2025-03-21,GU6802772,2025-09-14,3731149.0,13319930.0,2023-08-22,Pakistan
,Muhammad Jawad Allah Bachaya,UNASSIGNED,565063669,784-1980-3695941-3,2025-12-04,BW8679884,2033-07-31,200749.0,0.0,,Pakistan
,Lekhanath Khadka,UNASSIGNED,0,784-1985-9384606-0,2026-01-11,8304431,2034-09-28,0.0,0.0,,Nepal
,Numan Ijaz Muhammad Ijaz,UNASSIGNED,0,784-1997-4840610-7,2026-01-09,KE1518232,2028-11-18,0.0,0.0,,Pakistan
,Muhammad Awais Nawaz Haq Nawaz,UNASSIGNED,0509809728,784-1996-7839014-9,2026-02-14,FG9616562,2026-08-30,4289923.0,15526575.0,2024-06-19,Pakistan
,Mohsin Saeed Saeed Ahmad,UNASSIGNED,0589395230,784-1994-5436860-8,2026-03-07,GV5971732,2031-10-20,4314470.0,15556995.0,2024-06-08,Pakistan
,Nabeel Ghafoor Abdul Ghafoor,UNASSIGNED,0,784-1995-3790380-1,2026-02-02,BR4183012,2026-10-10,0.0,0.0,,Pakistan
,Zeeshan Ahmad Touseef Ahmad Khan,UNASSIGNED,0501936577,784-1992-8039760-7,2026-03-27,KG1167863,2028-10-01,2105448.0,12625596.0,2025-01-29,Pakistan
,Muhammad Usman Muhammad Yaseen,UNASSIGNED,0505610925,784-2002-1893486-5,2026-04-05,GL2855831,2025-01-20,4344932.0,15632681.0,2023-09-26,Pakistan
,Muhammad Mehmood Abdul Sattar Saqib,UNASSIGNED,0501786018,784-1998-1498262-7,2026-04-20,NJ0163791,2026-11-29,4380865.0,15665924.0,2024-11-21,Pakistan
,Hazzaa Salah Abdulrahman Abdulhaq Albreiki,UNASSIGNED,0,784-2000-0384869-2,2026-05-02,FNCP63216,2026-03-16,0.0,0.0,,0
,Muhammad Shazaib Basharat Muhammad Basharat Chaudhry,UNASSIGNED,0,784-2004-6038328-2,2026-07-15,EV3844401,2027-05-30,0.0,0.0,,Pakistan
,Ishtiaq Ahmad Lal Wali Khan,UNASSIGNED,0,784-1984-5775590-2,2026-10-20,GV1159104,2034-07-02,0.0,0.0,,Pakistan
,Jawad Sattar Haji Abdul Sattar Bhatti,UNASSIGNED,0569484798,784-1994-0641536-6,2026-12-11,BD5425693,2028-11-13,609766.0,3150010842.0,2026-06-09,Pakistan
,Syed Abbas Haider Shah Syed Ghulam Haider,ASSIGNED,0,784-1972-0627904-0,,GT5146043,1900-01-00,0.0,0.0,,0
,Muhammad Ejaz Jaffri Muhammad Sadiq Jaffri,ASSIGNED,0,784-1976-2838291-0,,0,1900-01-00,0.0,0.0,,0
435.0,Muhammad Waqas Abdul Ghafoor,ASSIGNED,,784-1981-1097022-0,46358,RN5148964,48204,1267048.0,1250013553.0,04-07-2026,Pakistan
444.0,Muhammad Husnain Abdul Ghafoor,ASSIGNED,,784-1972-1097013-5,46367,RN5149054,48213,1267054.0,1250013559.0,04-07-2026,Pakistan
445.0,Muhammad Haider Abdul Ghafoor,ASSIGNED,,784-1978-1097012-7,46368,RN5149062,48214,4116648.0,15124328.0,18-01-2026,Pakistan
446.0,Muhammad Arslan Abdul Ghafoor,ASSIGNED,,784-1981-1097011-9,46369,RN5149070,48215,1267055.0,1250013560.0,04-07-2026,Pakistan
447.0,Muhammad Ali Abdul Ghafoor,ASSIGNED,,784-1984-1097010-1,46370,RN5149089,48216,1267056.0,1250013561.0,04-07-2026,Pakistan
448.0,Muhammad Ahmad Abdul Ghafoor,ASSIGNED,,784-1977-1097009-0,46371,RN5149097,48217,4116650.0,15124330.0,18-01-2026,Pakistan
449.0,Muhammad Abdullah Abdul Ghafoor,ASSIGNED,,784-1974-1097008-2,46372,RN5149101,48218,1267057.0,1250013562.0,04-07-2026,Pakistan
450.0,Muhammad Zubair Abdul Ghafoor,ASSIGNED,,784-1971-1097007-4,46373,RN5149110,48219,1267058.0,1250013563.0,04-07-2026,Pakistan
451.0,Muhammad Zia Abdul Ghafoor,ASSIGNED,,784-1976-1097006-6,46374,RN5149128,48220,4116652.0,15124332.0,18-01-2026,Pakistan
452.0,Muhammad Zohaib Abdul Ghafoor,ASSIGNED,,784-1979-1097005-8,46375,RN5149136,48221,1267059.0,1250013564.0,04-07-2026,Pakistan
453.0,Muhammad Zeeshan Abdul Ghafoor,ASSIGNED,,784-1982-1097004-0,46376,RN5149144,48222,1267060.0,1250013565.0,04-07-2026,Pakistan
454.0,Muhammad Zahid Abdul Ghafoor,ASSIGNED,,784-1975-1097003-2,46377,RN5149152,48223,4116654.0,15124334.0,18-01-2026,Pakistan
455.0,Muhammad Zain Abdul Ghafoor,ASSIGNED,,784-1972-1097002-4,46378,RN5149160,48224,1267061.0,1250013566.0,04-07-2026,Pakistan
456.0,Muhammad Zakir Abdul Ghafoor,ASSIGNED,,784-1978-1097001-6,46379,RN5149179,48225,1267062.0,1250013567.0,04-07-2026,Pakistan
457.0,Muhammad Zaigham Abdul Ghafoor,ASSIGNED,,784-1981-1097000-8,46380,RN5149187,48226,4116656.0,15124336.0,18-01-2026,Pakistan
458.0,Muhammad Zameer Abdul Ghafoor,ASSIGNED,,784-1984-1096999-9,46381,RN5149195,48227,1267063.0,1250013568.0,04-07-2026,Pakistan
459.0,Muhammad Zafar Abdul Ghafoor,ASSIGNED,,784-1977-1096998-1,46382,RN5149209,48228,1267064.0,1250013569.0,04-07-2026,Pakistan
,Yesu Prasad Rayudu Suryanarayana Rayudu,UNASSIGNED,0,784-1983-4220088-2,2026-12-22,Z4729991,2028-03-20,0.0,0.0,,India
,Muhammad Afnan Muhammad Sadiq,UNASSIGNED,0,784-2005-9666899-4,2027-01-06,AL1508901,2033-11-06,0.0,0.0,,Pakistan
,Tayyab Zulfiqar Zulfiqar Hussain,UNASSIGNED,0588991196,784-1998-8647504-7,2027-02-07,AU5783122,2032-12-19,4055955.0,14868215.0,2027-10-17,Pakistan
,Talha Mehmood Mehmood Ul Hassan,UNASSIGNED,0,784-1996-6014563-4,2027-04-07,GA0168272,2027-10-19,0.0,0.0,,Pakistan
,Noor Khan Gulzar Khan,UNASSIGNED,0,784-1978-7107504-6,2026-05-08,PZ4104393,2027-04-26,0.0,0.0,,Pakistan
,Mahra Huwashel Ahmed Ghanem Almenhali,UNASSIGNED,0,784-2001-7596937-5,2027-06-03,AA0461374,2028-11-22,0.0,0.0,,0
,Hamed Ahmed Saeed Alshehhi,UNASSIGNED,0,784-1999-7249420-9,2027-06-24,AA0748767,2034-11-04,0.0,0.0,,0
,Summit Prahlad Singh,UNASSIGNED,0,784-1993-2923712-9,2027-09-03,T4162291,2029-07-15,0.0,0.0,,0
,Rajapandi Rajendran Rajendran,UNASSIGNED,0545162185 / 0525720469,784-1995-1046486-2,2026-01-03,P8988133,2027-04-25,3958604.0,14067266.0,2026-09-17,India
,Samad Muhammad Pervez,UNASSIGNED,0,784-2003-1379025-3,2027-10-06,VU0159812,2030-06-04,0.0,0.0,,0
460.0,Muhammad Zahir Abdul Ghafoor,ASSIGNED,,784-1974-1096997-3,46383,RN5149217,48229,4116658.0,15124338.0,18-01-2026,Pakistan
461.0,Muhammad Zaheer Abdul Ghafoor,ASSIGNED,,784-1971-1096996-5,46384,RN5149225,48230,1267065.0,1250013570.0,04-07-2026,Pakistan
462.0,Muhammad Zawar Abdul Ghafoor,ASSIGNED,,784-1976-1096995-7,46385,RN5149233,48231,1267066.0,1250013571.0,04-07-2026,Pakistan
463.0,Muhammad Zulfiqar Abdul Ghafoor,ASSIGNED,,784-1979-1096994-9,46386,RN5149241,48232,4116660.0,15124340.0,18-01-2026,Pakistan
464.0,Muhammad Zubair Abdul Ghafoor,ASSIGNED,,784-1982-1096993-1,46387,RN5149250,48233,1267067.0,1250013572.0,04-07-2026,Pakistan
465.0,Muhammad Zain Abdul Ghafoor,ASSIGNED,,784-1975-1096992-3,46388,RN5149268,48234,1267068.0,1250013573.0,04-07-2026,Pakistan
466.0,Muhammad Zakaria Abdul Ghafoor,ASSIGNED,,784-1972-1096991-5,46389,RN5149276,48235,4116662.0,15124342.0,18-01-2026,Pakistan
467.0,Muhammad Zahid Abdul Ghafoor,ASSIGNED,,784-1978-1096990-7,46390,RN5149284,48236,1267069.0,1250013574.0,04-07-2026,Pakistan
468.0,Muhammad Zeeshan Abdul Ghafoor,ASSIGNED,,784-1981-1096989-6,46391,RN5149292,48237,1267070.0,1250013575.0,04-07-2026,Pakistan
,Samad Muhammad Pervez,ASSIGNED,,,,,,,,,
486.0,Muhammad Arif Muhammad Bilal,ASSIGNED,,784-1994-8659695-2,2025-08-22,DY1982534,2028-04-25,3444253.0,46101.0,,Pakistan
604.0,Usman Fareed Mehmood Ahmed,ASSIGNED,,784-1996-8088584-9,2026-08-22,CG8979461,2026-01-11,0.0,0.0,,Pakistan
325.0,Nadeem Afzal Ameer Muhammad Khan,ASSIGNED,0568790214,784-1987-0574318-9,2026-01-03,GY1513272,2025-12-08,2487487.0,1190052936.0,2026-03-09,Pakistan
365.0,Muhammad Umar Allah Jiwaya,ASSIGNED,0529639405,784-1987-5916957-0,2026-08-07,DE2223382,2029-06-23,4126306.0,14995116.0,2023-05-26,Pakistan
658.0,Muhammad Imran Muhammad Tariq,ASSIGNED,563175745,784-1996-2110681-6,2025-08-28,QV1224661,2028-06-12,1251737.0,1240221432.0,2026-12-04,Pakistan
307.0,Abdul Razzaq Mushtaq Ahmad,ASSIGNED,0547649259 / 0568116431,784-1994-2070829-1,2026-01-29,BH9861723,2028-10-03,4142097.0,15155394.0,2023-07-04,Pakistan
248.0,Shahzad Ul Hassan Mian Abdul Rehman,ASSIGNED,0563164415,784-1982-3697529-2,2025-11-03,RN5148213,2031-08-16,3935846.0,14108470.0,2026-06-22,Pakistan
293.0,Mohammed Abdul Kareem Mohammed Ismail,ASSIGNED,0557864081 / 0522918857,784-1999-9615918-4,2026-01-18,S6445942,2028-09-27,4087625.0,14924535.0,2028-01-30,India
,Muhammad Murtaza Saeed Ahmad Malik,ASSIGNED,,784-1992-1328798-2,2023-04-07,0,,4049871.0,14631346.0,2027-09-26,Pakistan
395.0,Muhammad Umar Farooq Muhammad Saleem,ASSIGNED,0523007184 / 527849489,784-1996-5384870-7,2026-10-12,FF8962712,2030-07-29,218693.0,7190015250.0,2026-08-11,Pakistan
240.0,Muhammad Awais Pervaiz Akhtar,ASSIGNED,545512679 / 545944320,784-1997-2039497-7,2027-09-30,AS1690462,2026-08-22,4123192.0,15005232.0,2023-05-18,Pakistan
,Muhammad Rizwan Mureed Hussain,UNASSIGNED,0521659870,784-1992-1492192-8,2026-04-19,NM9897882,2027-02-06,203592.0,6190010685.0,2026-09-14,Pakistan
196.0,Habib Ur Rehman Muhammad Akhtar,ASSIGNED,0557127659,784-1998-6485943-6,2025-11-03,CE6036352,2028-03-29,4130941.0,15002404.0,2023-07-06,Pakistan
222.0,Hassan Raza Khamir Ahmad,ASSIGNED,0582101646,784-1995-3608514-7,2025-08-13,KG9895582,2029-06-25,4140268.0,15090706.0,2023-06-29,Pakistan
,Anees Khan Sarfraz Ahmad,UNASSIGNED,0,784-2004-8124499-2,2026-12-05,WJ4153851,2028-08-06,0.0,0.0,,Pakistan
221.0,Muhammad Amin Zahoor Khan,ASSIGNED,0503286409,784-1987-0427543-1,2025-08-03,FL1205301,2024-05-13,701804.0,3190038787.0,2026-09-25,Pakistan
209.0,Sajid Hussain Ashiq Hussain,ASSIGNED,0553017593 / 0543075378,784-1993-0485050-8,2025-08-10,ZZ6893573,2028-07-12,3527482.0,12784945.0,2025-07-12,Pakistan
309.0,Yoil Masih Ammanual Masih,ASSIGNED,0582336124 / 0504254801,784-1998-3762366-1,2026-02-22,GK0845901,2024-02-25,4179646.0,15160517.0,2023-10-06,Pakistan
223.0,Muhammad Faisal Mahmood Ali Asghar,ASSIGNED,0551505039/ 0565986045,784-1996-4904132-6,2025-08-03,FN0169542,2027-01-18,4134397.0,15094757.0,2023-06-15,Pakistan
331.0,Muhammad Ehsan Nadeem Muhammad Nadeem Akhtar,ASSIGNED,0507382716,784-2001-3351326-5,2026-03-26,FH9455541,2026-10-28,4323508.0,15667774.0,2024-08-22,Pakistan
558.0,Ahmad Faraz Ghulam Sadiq,ASSIGNED,527858355,784-2003-1951602-5,2026-03-04,FQ8915392,2028-01-22,4354921.0,15761830.0,,Pakistan
,Abdul Jabbar Sarang Ali,ASSIGNED,0521270712 / 0529889760,784-1991-3719241-7,2027-08-10,AS8021832,2026-05-18,740973.0,3200007368.0,2028-04-07,Pakistan
661.0,Sajid Ali Muhammad Yasin,ASSIGNED,0,784-19928685947-7,2027-04-22,UQ1804122,2029-03-19,0.0,0.0,,Pakistan
251.0,Waleed Ahmad Zahoor Ahmad,ASSIGNED,0529606515,784-2002-5014417-5,2025-12-10,TA1179041,2026-04-27,4234617.0,15429215.0,2023-02-16,Pakistan
280.0,Anees Khalid Khalid Ilyas,ASSIGNED,0552778604,784-1987-6419249-2,2025-12-21,TL4102833,2027-01-03,3502750.0,12753877.0,2025-07-06,Pakistan
,Muhammad Abrar Naeem Sher Ali Nasir,ASSIGNED,506381860,784-1989-6086396-1,2027-02-10,0,1900-01-00,4804122.0,16582818.0,,Pakistan
435.0,Muhammad Khalid Muhammad Bilal,ASSIGNED,0568366403,784-1996-9765952-4,2026-12-11,XA4127943,2029-02-18,63631812.0,13115513.0,2028-01-22,Pakistan
380.0,Uzair Hassan Muhammad Afzal,ASSIGNED,0501050943,784-2000-7177332-0,2026-03-08,KG6808082,2033-07-31,4329105.0,15561168.0,2024-08-30,Pakistan
463.0,Aqib Javed Tasadaq Javed,ASSIGNED,0525393270,784-1995-5053536-5,2027-05-15,FJ8674123,2030-02-11,2559922.0,1180068719.0,2026-03-07,Pakistan
597.0,Kamal Bahadur Khatri Top Bahadur Khatri,ASSIGNED,971522499265 / 507092199,784-1997-5203958-8,2026-07-17,09927827,2026-02-08,4377493.0,15703290.0,2024-11-15,Nepal
327.0,Farhan Ali Allah Wasaya,ASSIGNED,0562498534/0527858355,784-1998-9238234-4,2026-03-26,UY1810152,2032-08-19,4202763.0,15198830.0,2023-11-27,Pakistan
603.0,Ali Raza Mushtaq Muhammad Mushtaq,ASSIGNED,971552691990,784-1992-7535702-0,2026-09-25,DR0848653,2029-08-28,2697708.0,1210076339.0,,Pakistan
224.0,Farooq Ahmad Abdul Ghafoor,ASSIGNED,0563054970,784-1994-1729807-4,2025-10-09,JP1162872,2029-07-08,4111557.0,14848851.0,2028-04-09,Pakistan
333.0,Muhammad Farhan Saleem Muhammad Saleem,ASSIGNED,0568647652,784-2000-9470382-2,2026-03-19,KP5756702,2029-02-12,4159367.0,14822050.0,2023-08-20,Pakistan
398.0,Nasir Bashir Bashir Ahmad,ASSIGNED,0505162330,784-1987-2294579-1,2026-10-15,BZ3840663,2028-07-31,4273673.0,15548438.0,2024-05-19,Pakistan
357.0,Muhammad Mohsin Qurban Hussain,ASSIGNED,0564896804 / 0545837662,784-1997-9801404-1,2026-07-11,BB0112172,2029-06-04,4429569.0,15769263.0,2025-02-07,Pakistan
667.0,Muhammad Shareef Allah Bakhsh,ASSIGNED,0,784-1996-0793048-6,2027-06-15,KW5125832,2033-11-14,0.0,0.0,,Pakistan
700.0,Adeel Ahmad Liaqat Liaqat Ali,ASSIGNED,0,784-2000-6858738-3,2027-08-15,JC8967632,2029-03-27,0.0,0.0,,0
,Qaisar Abbas Muhammad Qasim,ASSIGNED,549978707,784-1998-7903283-9,2023-09-25,0,,4100170.0,0.0,,Pakistan
678.0,Osama Taimoor Khalid Khalid Rafiq,ASSIGNED,971529527766,784-1985-6902927-9,2027-07-15,RA4114363,2029-08-04,63645380.0,13227064.0,,Pakistan
415.0,Ahmad Ali Abdul Rehman Abid,ASSIGNED,0589404188,784-1996-5694256-4,2026-11-22,ZM1804623,2029-10-23,4094433.0,15008990.0,2023-02-20,Pakistan
554.0,Chand Alam Sohrab Ahmad,ASSIGNED,971522412259 / 527868468,784-1994-9219249-9,2026-03-20,Y8756111,2033-11-12,734900.0,3200034974.0,2027-10-19,INDIAN
659.0,Sajid Ali Muhammad Yasin,ASSIGNED,0,784-19928685947-7,2027-04-22,UQ1804122,2029-03-19,0.0,0.0,,Pakistan
455.0,Ameer Hamza Mazhar Hussain,ASSIGNED,522460020 / 501655809,784-1996-6088610-4,2027-04-10,BA6214022,2026-10-10,4509432.0,16067944.0,,Pakistan
340.0,Muhammad Nawaz Mushtaq,ASSIGNED,0524309591,784-1989-4571994-0,2026-06-19,JB9612381,2026-12-20,4371718.0,15692229.0,2024-06-11,Pakistan
596.0,Muhammad Rehan Allah Diwaya,ASSIGNED,568813166,784-2004-3238420-2,2026-07-16,BX9101031,2027-01-25,4480768.0,15713155.0,,Pakistan
181.0,Nurul Alam Abdul Malek,ASSIGNED,0502795606,784-1966-4195495-1,2025-11-01,EJ0729254,2026-10-10,989452.0,11151698.0,2026-01-18,Bangladesh
569.0,Hussain Mehmood Syed Muhammad Nawaz Shah,ASSIGNED,971509028180 / 971567930084,784-1990-5197149-9,2026-04-28,ZW0152302,2025-01-31,4241547.0,15350024.0,,Pakistan
219.0,Muhammad Sohail Muhammad Aslam,ASSIGNED,0544867863 / 0565971986,784-1987-6095958-9,2025-08-03,EY5194743,2027-03-24,4213792.0,15321859.0,2023-12-25,Pakistan
438.0,Ghulam Abbas Ghulam Yaseen,ASSIGNED,0557368660,784-1990-1790373-5,2026-11-23,FW1017293,2027-01-05,4303662.0,15639358.0,2024-07-17,Pakistan
662.0,Maqbool Ahmad Muhammad Yasin,ASSIGNED,0,784-1986-5096107-5,2027-05-22,QB1154974,2034-02-12,0.0,0.0,,Pakistan
408.0,Muhammad Naeem Hafiz Allah Bakhsh,ASSIGNED,0528115717,784-1990-2851521-3,2026-11-20,BU9959692,2032-06-15,3830160.0,13390881.0,2025-03-06,Pakistan
414.0,Muhammad Tariq Hazoor Bakhsh,ASSIGNED,0564784351 / 0564404669,784-1993-8880060-1,2026-11-22,EA7964174,2029-11-05,4175157.0,15170568.0,2023-09-26,Pakistan
618.0,Ali Hassan Safdar Ali,ASSIGNED,558409072,784-2000-1572200-0,2026-11-24,NN6804432,2034-05-27,4076571.0,46382.0,2026-12-26,Pakistan
533.0,Abid Hussain Imam Bakhsh,ASSIGNED,971549943089,784-1987-4191504-9,2025-10-17,VF6896563,2031-08-12,3594053.0,12719764.0,,Pakistan
449.0,Tasawar Abbas Allah Ditta,ASSIGNED,0528066297,784-1985-9704324-3,2027-02-06,BA1010904,2025-10-07,3794887.0,13491782.0,2025-02-17,Pakistan
669.0,Jude Nimal Fernando Antony Marvin,ASSIGNED,0,784-1989-6904781-4,2027-06-17,N10899432,2033-09-15,0.0,0.0,,Sri Lanka
,Amin Hassan Ghulam Hassan,ASSIGNED,971547862019,784-1995-2874570-8,2026-07-14,,,4337128.0,15546878.0,2024-09-13,Pakistan
673.0,Ali Shan Ashfaq Husain,ASSIGNED,971568101582,794-1987-8093950-4,2027-06-24,V2162228,,3588257.0,12832015.0,,Indian
,Ameer Hamza Malik Rab Nawaz,ASSIGNED,971507994539,784-1993-2035419-6,2027-06-15,AK6219813,2034-07-25,3625312.0,12931897.0,,Pakistan
343.0,Usman Ghani Muhammad Younas,ASSIGNED,0559247669,784-1990-9730528-0,2026-05-22,KW4119763,2034-01-20,1675213.0,12054665.0,2027-04-04,Pakistan
565.0,Muhammad Bilal Abdul Malik,ASSIGNED,+971 56 654 4019,784-1994-9805183-0,2026-04-24,CG3707622,2025-07-12,0.0,0.0,,Pakistan
536.0,Muhammad Ismail Allah Bakhsh,ASSIGNED,971568179785,784-1983-5390250-9,2025-11-01,BP1850223,2028-08-28,189084.0,4170014519.0,,Pakistan
399.0,Shafqat Fareed Shoukat Fareed Khokhar,ASSIGNED,0503204359,784-2003-2531085-0,2026-10-14,CQ8975191,2026-12-06,4281930.0,15548377.0,2023-04-06,Pakistan
391.0,Muhammad Noman Muhammad Sharif,ASSIGNED,0525564650,784-1991-3784416-5,2026-10-12,BD9209921,2026-12-10,4311368.0,15559756.0,2024-01-08,Pakistan
318.0,Rana Umar Ghulam Mustafa Khan,ASSIGNED,0523113306 / 0567978329 / 0542527340,784-1999-9279740-9,2026-03-13,DG2227421,2029-10-21,4131510.0,14925849.0,2023-08-06,Pakistan
676.0,Hakim Khan Dilbar Khan,ASSIGNED,971589918864,784-1984-1981369-0,2026-11-07,RL4103233,,2029685.0,12501095.0,,Pakistan
427.0,Kaser Lal Mandal Suresh Mandal,ASSIGNED,0562735929,784-2000-3051316-0,2026-12-09,P9107690,2027-05-01,4331156.0,15508691.0,2024-04-09,India
202.0,Sufyan Gulzar Gulzar Ahmad,ASSIGNED,0547817802,784-1982-9487284-5,2025-12-04,AE4712943,2026-05-06,194618.0,7160020645.0,2027-01-01,Pakistan
294.0,Muhammad Hussain Shamshad Ali,ASSIGNED,0555718082 / 0521736846,784-1989-5028480-6,2026-01-18,SZ6895212,2026-10-30,2046911.0,12497020.0,2024-11-06,Pakistan
598.0,Muhammad Nafees Javed Iqbal,ASSIGNED,527868171,784-1999-8859733-4,2026-07-17,AQ9516992,2029-03-24,4371699.0,0.0,,Pakistan
208.0,Rehan Ali Asghar Ali,ASSIGNED,0529843877,784-1997-2571524-9,2025-07-11,WG1817892,2032-05-29,4261547.0,15270412.0,2024-04-18,Pakistan
586.0,Hamza Riaz Muhammad Riaz,ASSIGNED,523224764,784-1997-3492360-2,2026-06-30,FS9912903,2029-03-19,4428406.0,15730758.0,,Pakistan
274.0,Qaisar Abbas Allah Ditta,ASSIGNED,0582288690 / 0564792425,784-1995-2496515-1,2025-12-14,ME1019282,2026-02-16,78804.0,5210006115.0,2024-02-15,Pakistan
587.0,Abu Sufyan Abdul Rehman,ASSIGNED,565417402,784-1987-5484346-8,2026-06-06,BG1017844,2029-06-05,4353466.0,0.0,,Pakistan
411.0,Syed Qamar Abbas Naqvi Manzoor Shah,ASSIGNED,0501928615,784-1992-7606497-1,2026-11-19,AX9394284,2029-03-31,4335497.0,15612469.0,2024-11-09,Pakistan
,Muhammad Asif Muhammad Ashraf,ASSIGNED,971504647943,784-1992-7180950-3,,DN1882295,2027-02-20,3941212.0,14177801.0,,Pakistan
707.0,Muhammad Ikram Muhammad Akram,ASSIGNED,0,784-2001-1392855-8,,GF0009021,2027-09-28,0.0,0.0,,0
,Abdelialh Boumadini,ASSIGNED,0,0,,0,1900-01-00,0.0,0.0,,0
,Muhammad Marwan Muhammad Imran,ASSIGNED,0,784-2004-9146783-1,,0,1900-01-00,0.0,0.0,,0
,Muhammad Jawad Sharif Muhammad,ASSIGNED,0,784-2002-5327492-0,,MZ512361,1900-01-00,0.0,0.0,,0
,Saqiba Luqman Shah,ASSIGNED,,784-2003-5444360-6,,AS5336092,1900-01-00,0.0,0.0,,0
,Imran Khan Jannat Gul,ASSIGNED,,784-1996-6715930-7,,FV4159011,1900-01-00,0.0,0.0,,0
,Nimat Ullah Khattak Rasool Khan,ASSIGNED,0,784-1994-6402979-4,,0,1900-01-00,0.0,0.0,,0
694.0,Muhammad Jamshed Ali Naseer Ahmed,ASSIGNED,0,784-2002-7554855-8,2027-10-19,YT1828461,2032-02-08,0.0,0.0,,0
,Mohammed Ahmad Elnour Dawakbit,ASSIGNED,0,0,,0,1900-01-00,0.0,0.0,,0
,Shoiab Ahmad Ali,ASSIGNED,0,784-2004-7024479-7,2027-10-08,ZD1179191,2027-10-12,0.0,0.0,,0
,Mustafa Iqbal Muhammad Iqbal,ASSIGNED,0,784-1990-8563560-7,,0,1900-01-00,0.0,0.0,,0
,Muhammad Dawood Muhammad Iqbal,ASSIGNED,,784-2002-1020300-4,2026-07-18,AM7678501,2026-06-15,0.0,0.0,,Pakistan
648.0,Tayyab Hamid Hamid Ullah Khan,ASSIGNED,0,784-1999-1414290-8,2027-02-28,DN6274163,2029-11-17,0.0,0.0,,Pakistan
651.0,Noor Sadat Khan Mir Sadat Khan,ASSIGNED,0,784-1969-0965354-3,2027-04-07,VQ4106093,2028-02-05,0.0,0.0,,Pakistan
652.0,Mohsin Muhtaz Rasheed Ahmad,ASSIGNED,0,784-1997-9653330-7,2027-04-07,BN0271382,2035-01-01,0.0,0.0,,Pakistan
653.0,Syed Ismail Shah Shah Sawar Shah,ASSIGNED,0,784-1999-6958031-7,2027-04-07,NW5157462,2034-06-06,0.0,0.0,,Pakistan
679.0,Muhammad Ramzan Muhammad Ashraf,ASSIGNED,0,784-1987-7489170-3,2027-08-27,AD9216014,2033-06-18,0.0,0.0,,Pakistan
227.0,Muhammad Imran Muhammad Qasim,UNASSIGNED,0589466180,784-1998-9617165-1,2027-09-16,JT1221722,2026-07-25,4121210.0,15069071.0,2023-05-10,Pakistan`;

    // Parse CSV and create driver objects
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const mockDrivers = [];
    const seenIds = new Set();
    const seenNames = new Set();

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length < headers.length) continue; // Skip incomplete rows

      const driverData = {};
      headers.forEach((header, index) => {
        driverData[header.trim()] = values[index]?.trim() || '';
      });

      // Skip empty rows
      if (!driverData['Class Employee Code'] && !driverData['Name']) continue;

      // Skip duplicates based on Employee Code or Name
      const employeeCode = driverData['Class Employee Code'];
      const driverName = driverData['Name'];

      if (employeeCode && seenIds.has(employeeCode)) continue;
      if (driverName && seenNames.has(driverName)) continue;

      if (employeeCode) seenIds.add(employeeCode);
      if (driverName) seenNames.add(driverName);

      // Parse dates
      const parseDate = (dateStr) => {
        if (!dateStr || dateStr === '' || dateStr === '1900-01-00') return new Date('1900-01-01');
        // Handle various date formats
        if (dateStr.includes('-')) {
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            return new Date(`${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`);
          }
        }
        return new Date('1900-01-01');
      };

      const driver = {
        id: driverData['Class Employee Code'] || `driver_${i}`,
        name: driverData['Name'] || 'Unknown',
        email: '', // No email in CSV
        phone: driverData['Personal Number'] || '',
        status: driverData['Status'] === 'ASSIGNED' ? 'Active' : 'Inactive',
        emiratesId: driverData['Emirates ID'] || '',
        licenseNumber: driverData['License Number'] || '',
        licenseExpiry: parseDate(driverData['License Expiry']),
        documents: [], // No documents data in CSV
        assignedClient: null, // No client assignments in CSV
        assignedVehicle: null, // No vehicle assignments in CSV
        assignedAssets: [], // No asset assignments in CSV
        assignedSim: null, // No SIM assignments in CSV
        lastActivity: new Date(),
        idleStartDate: undefined, // Will be set based on status
        notes: [],
        // Financial fields with default values
        baseSalary: 8000, // Default AED 8,000
        advancePaid: Math.floor(Math.random() * 5000), // Random advance 0-5000
        incentivesEarned: Math.floor(Math.random() * 3000), // Random incentives 0-3000
        deductions: Math.floor(Math.random() * 1000), // Random deductions 0-1000
        totalEarnings: 0, // Will be calculated
        netPayable: 0 // Will be calculated
      };

      // Calculate total earnings and net payable
      driver.totalEarnings = driver.baseSalary + driver.incentivesEarned;
      driver.netPayable = driver.totalEarnings - driver.advancePaid - driver.deductions;

      // Add idle start date if status is Idle
      driver.idleStartDate = driver.status === 'Idle' ? new Date() : undefined;

      mockDrivers.push(driver);
    }

    // Update drivers with assignment data
    const assignmentCsvData = `Name,Phone,Status,Project,Client ID
Abdelialh Boumadini,0,Assigned,Noon Supermall,50086
Abdul Jabbar Sarang Ali,0521270712 / 0529889760,Assigned,Amazon Now,A5JCG5OEP3KE8
Abdul Razzaq Mushtaq Ahmad,547649259,Assigned,Noon Supermall,57637
Abid Hussain Imam Bakhsh,971549943089,Assigned,Careem Food,2098122
Abu Sufyan Abdul Rehman,565417402,Assigned,Careem Quik,3284100
Adeel Ahmad Liaqat Liaqat Ali,0,Assigned,Noon Supermall,55389
Ahmad Ali Abdul Rehman Abid,0589404188,Assigned,Careem Food,2909879
Ahmad Faraz Ghulam Sadiq,527858355,Assigned,Noon Minutes,14204
Ahmad Fraz Hafiz Muhammad Shafi,0565419036,Assigned,Careem Quik,2490882
Ali Hassan Safdar Ali,558409072,Assigned,Amazon Now,A1090GUFOHEDSD
Ali Raza Mushtaq Muhammad Mushtaq,971552691990,Assigned,Noon Minutes,12893
Ali Shan Ashfaq Husain,971568101582,Assigned,Amazon Now,971527868468
Amandeep Singh Chinderpal Singh,0,Inactive,Class,N/A
Ameer Hamza Malik Rab Nawaz,971507994539,Assigned,Noon Food,A2R0NQUV546ATH
Ameer Hamza Mazhar Hussain,522460020 / 501655809,Assigned,Amazon Now,A2WV76XFDVJUPR
Amin Hassan Ghulam Hassan,971547862019,Assigned,Noon Minutes,53556
AMJAD ALI BARKAT ALI,503412496,Assigned,Careem Food,2186857
Anees Khalid Khalid Ilyas,0552778604,Assigned,Noon Supermall,46832
Aqib Javed Tasadaq Javed,0525393270,Assigned,Careem Quik,2282774
Arun Gangarapu Limbanna Gangarapu,581729644,Assigned,Noon Food,96279
Asim Basharat Basharat Hussain Shaheen,509416984,Assigned,Careem Food,2892161
Chand Alam Sohrab Ahmad,971522412259 / 527868468,Assigned,Noon Food,36149
Farhan Ali Allah Wasaya,0562498534/0527858355,Assigned,Careem Quik,2686094
Farooq Ahmad Abdul Ghafoor,0563054970,Vacation,Amazon Now,A3OKMA22P6GTK9
Ghulam Abbas Ghulam Yaseen,0557368660,Assigned,Careem Food,2932943
Habib Ur Rehman Muhammad Akhtar,557127659,Assigned,Noon Supermall,51307
Hakim Khan Dilbar Khan,971589918864,Assigned,Amazon Now,A1YPWIMBZZEGTK
Hamza Riaz Muhammad Riaz,523224764,Assigned,Noon Supermall,50384
Hassan Md Golam Kibria,0523937708,Assigned,Careem Food,2653405
Hassan Raza Khamir Ahmad,582101646,Assigned,Noon Supermall,64005
Hussain Mehmood Syed Muhammad Nawaz Shah,971509028180 / 971567930084,Assigned,Noon Supermall,57762
Imran Khan Jannat Gul,0,Assigned,Porter,22029
Jamshaid Tariq Tariq Mehmood,502853751,Inactive,Class,N/A
Jude Nimal Fernando Antony Marvin,0,Assigned,Noon Food,A12O417551MTHP
Kamal Bahadur Khatri Top Bahadur Khatri,971522499265 / 507092199,Assigned,Noon Food,63298
Kaser Lal Mandal Suresh Mandal,0562735929,Assigned,Amazon Now,A2DQHXRMIETQTJ
Maqbool Ahmad Muhammad Yasin,0,Assigned,Noon Food,106953
Mohammed Abdul Kareem Mohammed Ismail,557864081,Assigned,Noon Minutes,32637
Mohammed Ahmad Elnour Dawakbit,0,Assigned,Amazon Now,A2I19JH2QXQM95
Mohib Ur Rahman Haziq Ur Rehman,527867679,Assigned,Porter,25587
Mohsin Muhtaz Rasheed Ahmad,0,Vacation,Porter,19353
Muhammad Abrar Naeem Sher Ali Nasir,506381860,Assigned,Noon Food,80588
Muhammad Amin Zahoor Khan,503286409,Assigned,Careem Quik,2245118
Muhammad Arif Muhammad Bilal,undefined,Assigned,Careem Food,2366414
Muhammad Asad Mehmood Manzoor Ahmad,0526391779 / 0504635536,Assigned,Careem Food,2909834
Muhammad Asif Muhammad Ashraf,971504647943,Assigned,Careem Food,2239928
Muhammad Awais Pervaiz Akhtar,0545512679,Assigned,Noon Supermall,30361
Muhammad Bilal Abdul Malik,+971 56 654 4019,Assigned,Noon Minutes,20284
Muhammad Dawood Muhammad Iqbal,542662023,Assigned,Porter,8980
Muhammad Ehsan Nadeem Muhammad Nadeem Akhtar,0507382716,Assigned,Careem Food,2859050
Muhammad Ejaz Jaffri Muhammad Sadiq Jaffri,0,Assigned,Porter,22568
Muhammad Faisal Mahmood Ali Asghar,0551505039/ 0565986045,Assigned,Careem Food,2414600
Muhammad Farhan Saleem Muhammad Saleem,0568647652,Assigned,Noon Supermall,63908
Muhammad Hussain Shamshad Ali,0555718082 / 0521736846,Assigned,Amazon Now,AWI7Z7QWUU3QW
Muhammad Ikram Muhammad Akram,0,Assigned,Careem Quik,3824493
Muhammad Imran Muhammad Qasim,0589466180,Assigned,Class,0
Muhammad Imran Muhammad Tariq,563175745,Vacation,Amazon Now,A32B4J4TOTLICC
Muhammad Ismail Allah Bakhsh,971568179785,Assigned,Careem Food,896027
Muhammad Jaffar Nazar Hussain,0,Vacation,Careem Food,2265207
Muhammad Jamshed Ali Naseer Ahmed,5565453156,Assigned,Porter,23340
Muhammad Jawad Sharif Muhammad,527854584,Assigned,Porter,15245
Muhammad Khalid Ghulam Akbar,564769084,Assigned,Amazon Now,AVCQ0UTQCZAOR
Muhammad Khalid Muhammad Bilal,0568366403,Vacation,Careem Food,2264713
Muhammad Marwan Muhammad Imran,0,Assigned,Porter,8185
Muhammad Mohsin Qurban Hussain,0564896804 / 0545837662,Assigned,Amazon Now,A1I9U3SJIO17XI
Muhammad Murtaza Saeed Ahmad Malik,051234567,Assigned,Noon Minutes,8551
Muhammad Musharaf Aslam Muhammad Aslam,971527847814 / 0522729704,Assigned,Noon Supermall,12626
Muhammad Naeem Hafiz Allah Bakhsh,0528115717,Assigned,Careem Quik,2376295
Muhammad Nafees Javed Iqbal,527868171,Assigned,Amazon Now,A23F3ZC2ECR1IG
Muhammad Nawaz Mushtaq,0524309591,Assigned,Noon Supermall,41195
Muhammad Noman Muhammad Sharif,0525564650,Assigned,Noon Supermall,41293
Muhammad Ramzan Muhammad Ashraf,0,Assigned,Porter,21330
Muhammad Rehan Allah Diwaya,568813166,Assigned,Noon Food,109378
Muhammad Rizwan Mureed Hussain,0521659870,Vacation,Amazon Now,A3QLWHRX44TY0V
Muhammad Shareef Allah Bakhsh,0,Assigned,Amazon Now,AZFNHCM8CA2U6
Muhammad Sohail Muhammad Aslam,0544867863 / 0565971986,Assigned,Noon Minutes,26372
Muhammad Tariq Hazoor Bakhsh,0564784351 / 0564404669,Assigned,Careem Quik,2909871
Muhammad Umair Muhammad Akhtar,971567099446,Assigned,Noon Minutes,57179
Muhammad Umar Allah Jiwaya,529639405,Assigned,Noon Supermall,51934
Muhammad Umar Ashfaq,0,Assigned,Careem Food,3785743
Muhammad Umar Farooq Muhammad Saleem,523007184,Assigned,Amazon Now,A19EB57CA7O1W9
Muhammad Zubair Talib Hussain,0563409553,Vacation,Noon Supermall,30034
Mustafa Iqbal Muhammad Iqbal,0,Assigned,Careem Food,2671212
Nadeem Afzal Ameer Muhammad Khan,568790214,Assigned,Noon Minutes,29627
Nasir Bashir Bashir Ahmad,0505162330,Assigned,Noon Supermall,56426
Nimat Ullah Khattak Rasool Khan,0,Assigned,Porter,22909
Noor Sadat Khan Mir Sadat Khan,0,Assigned,Porter,17561
Nurul Alam Abdul Malek,0502795606,Assigned,Careem Food,2653403
Osama Taimoor Khalid Khalid Rafiq,971529527766,Assigned,Amazon Now,A3QNC834X3PFY6
Qaisar Abbas Allah Ditta,0582288690 / 0564792425,Assigned,Noon Minutes,29636
Qaisar Abbas Muhammad Qasim,549978707,Assigned,Noon Supermall,63888
Rana Umar Ghulam Mustafa Khan,0523113306 / 0567978329 / 0542527340,Assigned,Careem Quik,2782048
Rehan Ali Asghar Ali,0529843877,Assigned,Amazon Now,A335WQD8GTSC7G
Sajid Ali Muhammad Yasin,0,Assigned,Careem Food,3713514
Sajid Hussain Ashiq Hussain,0553017593 / 0543075378,Assigned,Noon Food,17479
Saqiba Luqman Shah,051234567,Assigned,Porter,19607
Sarfraz Ahmad Zulfiqar Shah,0554235224,Assigned,Amazon Now,A1ZQG5C534KQ10
Shafqat Fareed Shoukat Fareed Khokhar,0503204359,Assigned,Careem Food,2877399
Shahzad Ul Hassan Mian Abdul Rehman,563164415,Assigned,Careem Food,2362440
Shoiab Ahmad Ali,0,Assigned,Porter,23877
Sufyan Gulzar Gulzar Ahmad,0547817802,Assigned,Careem Food,2596833
Suleman Yasin Muhammad Yasin,582157231,Assigned,Careem Food,2932955
Syed Abbas Haider Shah Syed Ghulam Haider,0,Assigned,Porter,23735
Syed Ismail Shah Shah Sawar Shah,0,Assigned,Porter,17201
Syed Qamar Abbas Naqvi Manzoor Shah,0501928615,Assigned,Careem Food,2912423
Tasawar Abbas Allah Bakhsh,0528066297,Assigned,Careem Food,2273694
Tayyab Hamid Hamid Ullah Khan,0,Assigned,Porter,15511
Test Driver,05123232,Assigned,Careem Naaz,999982
Usman Fareed Mehmood Ahmed,undefined,Assigned,Noon Supermall,21360
Usman Ghani Muhammad Younas,0559247669,Assigned,Amazon Now,A1GBFTJ3820DN0
Uzair Hassan Muhammad Afzal,0501050943,Assigned,Noon Minutes,30836
Waleed Ahmad Zahoor Ahmad,0529606515,Assigned,Careem Food,2782110
Yoil Masih Ammanual Masih,582336124,Assigned,Noon Food,15578
Zeeshan Abbas Muhammad Abbas,971521201290,Inactive,Porter,24095
Muhammad Akram Abdul Ghafoor,0,Idle,,0
Muhammad Waqas Abdul Ghafoor,0,Idle,,0
Muhammad Husnain Abdul Ghafoor,0,Idle,,0
Muhammad Haider Abdul Ghafoor,0,Idle,,0
Muhammad Arslan Abdul Ghafoor,0,Idle,,0
Muhammad Ali Abdul Ghafoor,0,Idle,,0
Muhammad Ahmad Abdul Ghafoor,0,Idle,,0
Muhammad Abdullah Abdul Ghafoor,0,Idle,,0
Muhammad Zubair Abdul Ghafoor,0,Idle,,0
Muhammad Zia Abdul Ghafoor,0,Idle,,0
Muhammad Zohaib Abdul Ghafoor,0,Idle,,0
Muhammad Zeeshan Abdul Ghafoor,0,Idle,,0
Muhammad Zahid Abdul Ghafoor,0,Idle,,0
Muhammad Zain Abdul Ghafoor,0,Idle,,0
Muhammad Zakir Abdul Ghafoor,0,Idle,,0
Muhammad Zaigham Abdul Ghafoor,0,Idle,,0
Muhammad Zameer Abdul Ghafoor,0,Idle,,0
Muhammad Zafar Abdul Ghafoor,0,Idle,,0
Muhammad Zahir Abdul Ghafoor,0,Idle,,0
Muhammad Zaheer Abdul Ghafoor,0,Idle,,0
Muhammad Zawar Abdul Ghafoor,0,Idle,,0
Muhammad Zulfiqar Abdul Ghafoor,0,Idle,,0
Muhammad Zakaria Abdul Ghafoor,0,Idle,,0`;

    const assignmentLines = assignmentCsvData.split('\n');

    for (let i = 1; i < assignmentLines.length; i++) {
      const line = assignmentLines[i].trim();
      if (!line) continue;

      const values = line.split(',');
      if (values.length < 5) continue;

      const name = values[0]?.trim();
      const phone = values[1]?.trim();
      const status = values[2]?.trim();
      const project = values[3]?.trim();
      const clientId = values[4]?.trim();

      if (!name) continue;

      // Find existing driver by name and update with assignment info
      const existingDriver = mockDrivers.find(driver => driver.name === name);
      if (existingDriver) {
        // Update driver with assignment information
        const previousStatus = existingDriver.status;
        if (status === 'Assigned') {
          existingDriver.status = 'Active';
          existingDriver.idleStartDate = undefined; // Clear idle tracking
        } else if (status === 'Vacation') {
          existingDriver.status = 'Vacation';
          existingDriver.idleStartDate = undefined; // Clear idle tracking
        } else if (status === 'Idle') {
          existingDriver.status = 'Idle';
          // Set idle start date if not already set or if status changed
          if (!existingDriver.idleStartDate || previousStatus !== 'Idle') {
            existingDriver.idleStartDate = new Date();
          }
        } else {
          existingDriver.status = 'Inactive';
          existingDriver.idleStartDate = undefined; // Clear idle tracking
        }
        if (project) {
          existingDriver.assignedClient = project; // Store project as assigned client
        }
        // Note: Client ID could be stored in notes or a separate field if needed
      }
    }

    // Automatically change idle drivers to inactive after 15 days
    const fifteenDaysMs = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
    const now = new Date();

    mockDrivers.forEach(driver => {
      if (driver.status === 'Idle' && driver.idleStartDate) {
        const idleDuration = now.getTime() - driver.idleStartDate.getTime();
        if (idleDuration >= fifteenDaysMs) {
          driver.status = 'Inactive';
          driver.idleStartDate = undefined; // Clear the idle tracking
          console.log(`Driver ${driver.name} automatically changed from Idle to Inactive after 15 days`);
        }
      }
    });

    // Process asset assignments from Drivers_Assets_In_Use.xlsx data
    const driverAssetAssignments = [
      {
        driverName: "Suleman Yasin Muhammad Yasin",
        project: "Careem Food",
        assets: {
          'Shirts': 2,
          'Trousers': 2,
          'Big Bag': 1,
          'Small Bag': 1,
          'Helmet': 1,
          'Safety Jacket': '-',
          'Safety Kit': '-',
          'Safety Gloves': '-',
          'Winter Jacket': 1,
          'Water Bottle': 1,
          'Mask': 1,
          'Visor': '-'
        }
      },
      // Note: In production, all 88 driver asset assignments from Drivers_Assets_In_Use.xlsx would be included
      // For brevity, showing structure with first driver only
    ];

    // Process asset assignments from Drivers_Assets_In_Use.xlsx
    const assetIdMap = {
      'Shirts': '12',
      'Trousers': '11',
      'Big Bag': '5',
      'Small Bag': '4',
      'Helmet': '9',
      'Safety Jacket': '8',
      'Safety Kit': '7',
      'Safety Gloves': '6',
      'Winter Jacket': '10',
      'Water Bottle': '3',
      'Mask': '2',
      'Visor': '1'
    };

    // Group asset assignments by driver name
    const driverAssetMap = {};
    driverAssetAssignments.forEach(driverAssignment => {
      const assignments = [];
      Object.entries(driverAssignment.assets).forEach(([assetName, quantity]) => {
        const qty = typeof quantity === 'string' && quantity !== '-' ? parseInt(quantity) : (typeof quantity === 'number' ? quantity : 0);
        if (qty > 0) {
          const assetId = assetIdMap[assetName];
          if (assetId) {
            assignments.push({
              assetId: assetId,
              driverId: '', // Will be filled when we find the driver
              quantity: quantity,
              condition: 'Good'
            });
          }
        }
      });

      if (assignments.length > 0) {
        driverAssetMap[driverAssignment.driverName] = assignments;
      }
    });

    // Assign assets to drivers and update asset quantities
    mockDrivers.forEach(driver => {
      if (driverAssetMap[driver.name]) {
        driverAssetMap[driver.name].forEach(assetAssignment => {
          assetAssignment.driverId = driver.id;
        });
        driver.assignedAssets = driverAssetMap[driver.name];


      }
    });

    console.log(`Loaded ${mockDrivers.length} drivers from CSV`);
    setDashboardLoaded(true);
    const vehicleCsvData = `SN/NO	Plate	Status	Model	  Make Year 	Chassis No	OG Permit
Location of box fixing
14	48245-1	Idle	Bajaj Pulsar 	2021	MD2A11CX4MCE49778	NF	Bike BOX
15	46832-1	Idle	Bajaj Pulsar 	2021	MD2A11CX1MCC00777	NF	Bike Box
26	12779-2	Idle	Bajaj Pulsar 	2022	MD2A11CX2NCE11760	Cancelled Permit	BGS
28	55302-1	Idle	Hero Hunk	2021	MBLKCS268MGE00076	Cancelled Permit	BGS
41	12030-2	Idle	Bajaj Pulsar 	2022	MD2A11CXXNCE11716	Careem	Alpha
54	10370-2	Idle	Hero Hunk	2022	MBLKCS269NGF00253	Careem Naaz	Alpha
60	88268-1	Idle	Bajaj Pulsar 	2022	MD2A11CX0NCE18108	Careem Naaz	Alpha
61	87837-1	Idle	Bajaj Pulsar 	2022	MD2A11CX2NCE18451	Careem Naaz	Alpha
63	88273-1	Idle	Bajaj Pulsar 	2022	MD2A11CX5NCE18105	Careem Naaz	Alpha
76	48252-1	Idle	Bajaj Pulsar 	2021	MD2A11CX9MCE49792	NF	Bike Box
77	48236-1	Idle	Bajaj Pulsar 	2021	MD2A11CX1MCM38797	NIM	Bike Box
78	45589-1	Idle	Bajaj Pulsar 	2021	MD2A11CX3MCA07493	NIM	Bike Box
79	35213-1	Idle	Bajaj Pulsar 	2021	MD2A11CX5MCA12761	NIM	Bike Box
80	19489-1	Idle	Bajaj Pulsar 	2021	MD2A11CX4MCM36977	NIM	Bike Box
81	46829-1	Idle	Bajaj Pulsar 	2021	MD2A11CX1MCC24475	NIM	Bike Box
82	48243-1	Idle	Bajaj Pulsar 	2021	MD2A11CX5MCE02890	NIM	Bike Box
83	48235-1	Idle	Bajaj Pulsar 	2021	MD2A11CX3MCM38767	NIM	Bike Box
84	35216-1	Idle	Bajaj Pulsar 	2021	MD2A11CX0MCA12764	NIM	Bike Box
97	47466-1	Idle	Bajaj Pulsar 	2021	MD2A11CX1MCA07542	SuperMall	Bike Box
102	45044-2	Idle	Hero Hunk	2021	MBLKCS262MGZ00084	No Permit 	No Permit
1	28563-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX7PCF01232	Cancelled Permit	BGS
2	28083-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX9PCF01197	Cancelled Permit	BGS
3	28567-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX2PCF01185	Cancelled Permit	BGS
4	28554-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX1PCF01209	NIM	Bike Box
5	28089-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX1PCF01260	NIM	Bike Box
6	28557-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX9PCF01233	NIM	Bike Box
7	28553-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX8PCF01238	NIM	Bike Box
8	28556-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX6PCF01268	NIM	Bike Box
9	28088-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX7PCF01263	NIM	Bike Box
10	28090-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX6PCF01237	NIM	Bike Box
11	28084-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX0PCF01184	Cancelled permit 	 
12	28562-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX6PCF01254	Cancelled Permit	 
13	28027-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX0PCF01234	Cancelled Permit	 
16	28086-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX2PCF01235	Cancelled Permit	BGS
17	28565-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX2PCF01221	Cancelled Permit	BGS
18	28087-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX6PCF01187	Cancelled Permit	BGS
19	28564-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX3PCF01261	Cancelled Permit	BGS
20	12785-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE11772	Cancelled Permit	BGS
21	45583-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX2MCB17273	Cancelled Permit	BGS
22	28085-2	Assigned	Bajaj Pulsar 	2023	MD2A11CXXPCF01242	Cancelled Permit	BGS
23	12786-2	Assigned	Bajaj Pulsar 	2022	MD2A11CXXNCE11781	Cancelled Permit	BGS
24	12784-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX3NCE11766	Cancelled Permit	BGS
25	12783-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX5NCE11770	Cancelled Permit	BGS
27	12025-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE18382	Cancelled Permit	BGS
29	35212-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX5MCA12713	Cancelled Permit	BGS
30	12780-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX6NCE11762	Cancelled Permit	BGS
31	12034-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE11786	Cancelled Permit	BGS
32	12782-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX0NCE11773	Cancelled Permit	BGS
33	18075-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX4MCA08720	Cancelled Permit	BGS
34	10374-2	Assigned	Hero Hunk	2022	MBLKCS264NGF00337	Careem	Alpha
35	88264-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX7NCE18445	Careem	Alpha
36	78772-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX0NCE18433	Careem	Alpha
37	10367-2	Assigned	Hero Hunk	2022	MBLKCS268NGF00373	Careem	Alpha
38	12026-2	Assigned	Bajaj Pulsar 	2022	MD2A11CXXNCE18388	Careem	Alpha
39	88030-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX2NCE18448	Careem	Alpha
40	12018-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX7NCE18137	Careem	Alpha
42	88274-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX0NCE18402	Careem	Alpha
43	10366-2	Assigned	Hero Hunk	2022	MBLKCS262NGF00420	Careem	Alpha
44	12014-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE18138	Careem	Alpha
45	63019-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX8NCE18373	Careem	Alpha
46	10369-2	Assigned	Hero Hunk	2022	MBLKCS262NGF00336	Careem	Alpha
47	12017-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX2NCE18109	Careem	Alpha
48	12015-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX2NCE18093	Careem	Alpha
49	10368-2	Assigned	Hero Hunk	2022	MBLKCS261NGF00358	Careem	Alpha
50	12022-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX1NCE18022	Careem Naaz	Alpha
51	12016-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX7NCE18381	Careem Naaz	Alpha
52	10373-2	Assigned	Hero Hunk	2022	MBLKCS263NGF00300	Careem Naaz	Alpha
53	87197-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE18432	Careem Naaz	Alpha
55	84882-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX9NCE18446	Careem Naaz	Alpha
56	12027-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX2NCE11743	Careem Naaz	Alpha
57	12031-2	Assigned	Bajaj Pulsar 	2022	MD2A11CXXNCE11756	Careem Naaz	Alpha
58	10932-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX0NCE18450	Careem Naaz	Alpha
59	12024-2	Assigned	Bajaj Pulsar 	2022	MD2A11CXXNCE18410	Careem Naaz	Alpha
62	10375-2	Assigned	Hero Hunk	2022	MBLKCS264NGF00421	Careem Naaz	Alpha
64	10365-2	Assigned	Hero Hunk	2022	MBLKCS261NGF00439	Careem Naaz	Alpha
65	12029-2	Assigned	Bajaj Pulsar 	2022	MD2A11CXXNCE11652	Careem Naaz	Alpha
66	12028-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX8NCE11696	Careem Naaz	Alpha
67	84718-1	Assigned	Bajaj Pulsar 	2022	MD2A11CX4NCE18435	Careem Naaz	Alpha
68	46831-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX7MCC24478	NF	Bike Box
69	45575-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX0MCB17110	NF	Bike Box
70	47480-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX3MCC24655	NF	Bike Box
71	48246-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX5MCE49725	NF	Bike Box
72	33803-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX0MCL25455	NF	Bike Box
73	47464-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX8MCA08199	NF	Bike Box
74	17068-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX7MCM37007	NF	Bike Box
75	48249-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX8MCE49721	NF	Bike Box
85	46830-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX5MCC24480	SuperMall	Bike Box
86	48253-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX4MCE49778	SuperMall	Bike Box
87	47482-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX2MCC24467	SuperMall	Bike Box
88	35219-1	Assigned	Bajaj Pulsar 	2021	MD2A11CXXMCA12710	SuperMall	Bike Box
89	47481-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX9MCC24448	SuperMall	Bike Box
90	45581-1	Assigned	Bajaj Pulsar 	2021	MD2A11CXXMCA07524	SuperMall	Bike Box
91	10469-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX3MCM36968	SuperMall	Bike Box
92	48254-1	Assigned	Bajaj Pulsar 	2021	MD2A11CXXMCE49798	SuperMall	Bike Box
93	47465-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX4MCA07499	SuperMall	Bike Box
94	48239-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX6MCM41341	SuperMall	Bike Box
95	35201-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX6MCA08718	SuperMall	Bike Box
96	35203-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX2MCA08747	SuperMall	Bike Box
98	47461-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX5MCA07513	SuperMall	Bike Box
99	48256-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX8MCE49797	SuperMall	Bike Box
100	45586-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX0MCA08195	SuperMall	Bike Box
101	28552-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX9PCF01264	NIM	Bike Box
103	12778-2	Assigned	Bajaj Pulsar 	2022	MD2A11CX3NCE11752	No Permit 	No Permit
104	33801-1	Assigned	Bajaj Pulsar 	2021	MD2A11CX1MCL25450	No Permit 	No Permit
105	28081-2	Assigned	Bajaj Pulsar 	2023	MD2A11CX3PCF01194	Careem 	 
106	73453-X	Assigned	Nissan Sunny	2024	MDHBN7AD4RG519738	Porter	 
107	36240-E	Assigned	Nissan Sunny	2023	MDHBN7AD7PG332572	Porter	 
108	44739-Y	Assigned	Nissan Sunny	2022	MDHBN7AD0NG156980	Porter	 
109	58328-N	Assigned	Nissan Sunny	2022	MDHBN7AD9NG128952	Porter	 
110	35779-E	Assigned	Nissan Sunny	2023	MDHBN7AD6PG332756	Porter	 
111	75015-X	Assigned	Nissan Sunny	2024	MDHBN7AD4RG519741	Porter	 
112	74507-X	Assigned	Nissan Sunny	2024	MDHBN7ADXRG520652	Porter	 
113	98166-Q	Assigned	Nissan Sunny	2022	MDHBN7AD4NG138871	Porter	 
114	20468-D	Assigned	Nissan Sunny	2023	MDHBN7AD4PG324462	Porter	 
115	98155-Q	Assigned	Nissan Sunny	2022	MDHBN7AD1NG139699	Porter	 
116	79693-W	Assigned	Nissan Sunny	2022	MDHBN7AD4NG150549	Porter	 
117	56049-Z	Assigned	Nissan Sunny	2023	MDHBN7AD2PG317106	Porter	 
118	30693-Z	Assigned	Nissan Sunny	2023	MDHBN7ADXPG316396	Porter	 
119	83785-Z	Assigned	Nissan Sunny	2023	MDHBN7AD5PG321585	Porter	 
120	20339-J	Assigned	Nissan Sunny	2022	MDHBN7AD4NG132519	Porter	 
121	43016-D	Assigned	Nissan Sunny	2022	MDHBN7AD1NG147298	Porter`;

    // Load vehicles from Vehicles List.xlsx data (all 121 vehicles)
// Load vehicles from Vehicles List.xlsx data (all 121 vehicles)
// Load vehicles from Vehicles List.xlsx data (all 121 vehicles with logos)
    const mockVehicles = [
      {
        id: "MD2A11CX4MCE49778",
        plate: "48245-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX4MCE49778",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1MCC00777",
        plate: "46832-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX1MCC00777",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE11760",
        plate: "12779-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE11760",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS268MGE00076",
        plate: "55302-1",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2021,
        chassisNumber: "MBLKCS268MGE00076",
        logo: "/vehiclelogo/hero.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXNCE11716",
        plate: "12030-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CXXNCE11716",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS269NGF00253",
        plate: "10370-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS269NGF00253",
        logo: "/vehiclelogo/hero.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE18108",
        plate: "88268-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE18108",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE18451",
        plate: "87837-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE18451",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5NCE18105",
        plate: "88273-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX5NCE18105",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9MCE49792",
        plate: "48252-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX9MCE49792",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1MCM38797",
        plate: "48236-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX1MCM38797",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3MCA07493",
        plate: "45589-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX3MCA07493",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCA12761",
        plate: "35213-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCA12761",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX4MCM36977",
        plate: "19489-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX4MCM36977",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1MCC24475",
        plate: "46829-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX1MCC24475",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCE02890",
        plate: "48243-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCE02890",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3MCM38767",
        plate: "48235-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX3MCM38767",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0MCA12764",
        plate: "35216-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX0MCA12764",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1MCA07542",
        plate: "47466-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX1MCA07542",
        logo: "/vehiclelogo/bajaj.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS262MGZ00084",
        plate: "45044-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2021,
        chassisNumber: "MBLKCS262MGZ00084",
        logo: "/vehiclelogo/hero.png",
        status: "Available" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7PCF01232",
        plate: "28563-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX7PCF01232",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9PCF01197",
        plate: "28083-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX9PCF01197",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2PCF01185",
        plate: "28567-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX2PCF01185",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1PCF01209",
        plate: "28554-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX1PCF01209",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1PCF01260",
        plate: "28089-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX1PCF01260",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9PCF01233",
        plate: "28557-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX9PCF01233",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8PCF01238",
        plate: "28553-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX8PCF01238",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6PCF01268",
        plate: "28556-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX6PCF01268",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7PCF01263",
        plate: "28088-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX7PCF01263",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6PCF01237",
        plate: "28090-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX6PCF01237",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0PCF01184",
        plate: "28084-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX0PCF01184",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6PCF01254",
        plate: "28562-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX6PCF01254",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0PCF01234",
        plate: "28027-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX0PCF01234",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2PCF01235",
        plate: "28086-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX2PCF01235",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2PCF01221",
        plate: "28565-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX2PCF01221",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6PCF01187",
        plate: "28087-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX6PCF01187",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3PCF01261",
        plate: "28564-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX3PCF01261",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE11772",
        plate: "12785-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE11772",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2MCB17273",
        plate: "45583-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX2MCB17273",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXPCF01242",
        plate: "28085-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CXXPCF01242",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXNCE11781",
        plate: "12786-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CXXNCE11781",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3NCE11766",
        plate: "12784-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX3NCE11766",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5NCE11770",
        plate: "12783-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX5NCE11770",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE18382",
        plate: "12025-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE18382",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCA12713",
        plate: "35212-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCA12713",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6NCE11762",
        plate: "12780-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX6NCE11762",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE11786",
        plate: "12034-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE11786",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE11773",
        plate: "12782-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE11773",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX4MCA08720",
        plate: "18075-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX4MCA08720",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS264NGF00337",
        plate: "10374-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS264NGF00337",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7NCE18445",
        plate: "88264-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX7NCE18445",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE18433",
        plate: "78772-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE18433",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS268NGF00373",
        plate: "10367-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS268NGF00373",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXNCE18388",
        plate: "12026-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CXXNCE18388",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE18448",
        plate: "88030-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE18448",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7NCE18137",
        plate: "12018-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX7NCE18137",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE18402",
        plate: "88274-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE18402",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS262NGF00420",
        plate: "10366-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS262NGF00420",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE18138",
        plate: "12014-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE18138",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8NCE18373",
        plate: "63019-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX8NCE18373",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS262NGF00336",
        plate: "10369-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS262NGF00336",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE18109",
        plate: "12017-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE18109",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE18093",
        plate: "12015-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE18093",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS261NGF00358",
        plate: "10368-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS261NGF00358",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1NCE18022",
        plate: "12022-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX1NCE18022",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7NCE18381",
        plate: "12016-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX7NCE18381",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS263NGF00300",
        plate: "10373-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS263NGF00300",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE18432",
        plate: "87197-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE18432",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9NCE18446",
        plate: "84882-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX9NCE18446",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2NCE11743",
        plate: "12027-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX2NCE11743",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE11756",
        plate: "12031-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE11756",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0NCE18450",
        plate: "10932-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX0NCE18450",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXNCE18410",
        plate: "12024-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CXXNCE18410",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS264NGF00421",
        plate: "10375-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS264NGF00421",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MBLKCS261NGF00439",
        plate: "10365-2",
        make: "Hero",
        model: "Hero Hunk",
        makeYear: 2022,
        chassisNumber: "MBLKCS261NGF00439",
        logo: "/vehiclelogo/hero.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXNCE11652",
        plate: "12029-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CXXNCE11652",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8NCE11696",
        plate: "12028-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX8NCE11696",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX4NCE18435",
        plate: "84718-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX4NCE18435",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7MCC24478",
        plate: "46831-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX7MCC24478",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0MCB17110",
        plate: "45575-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX0MCB17110",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3MCC24655",
        plate: "47480-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX3MCC24655",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCE49725",
        plate: "48246-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCE49725",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0MCL25455",
        plate: "33803-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX0MCL25455",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8MCA08199",
        plate: "47464-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX8MCA08199",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX7MCM37007",
        plate: "17068-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX7MCM37007",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8MCE49721",
        plate: "48249-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX8MCE49721",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCC24480",
        plate: "46830-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCC24480",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX4MCE49778",
        plate: "48253-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX4MCE49778",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2MCC24467",
        plate: "47482-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX2MCC24467",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXMCA12710",
        plate: "35219-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CXXMCA12710",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9MCC24448",
        plate: "47481-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX9MCC24448",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXMCA07524",
        plate: "45581-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CXXMCA07524",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3MCM36968",
        plate: "10469-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX3MCM36968",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CXXMCE49798",
        plate: "48254-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CXXMCE49798",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX4MCA07499",
        plate: "47465-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX4MCA07499",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6MCM41341",
        plate: "48239-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX6MCM41341",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX6MCA08718",
        plate: "35201-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX6MCA08718",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX2MCA08747",
        plate: "35203-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX2MCA08747",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX5MCA07513",
        plate: "47461-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX5MCA07513",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX8MCE49797",
        plate: "48256-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX8MCE49797",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX0MCA08195",
        plate: "45586-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX0MCA08195",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX9PCF01264",
        plate: "28552-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX9PCF01264",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3NCE11752",
        plate: "12778-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2022,
        chassisNumber: "MD2A11CX3NCE11752",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX1MCL25450",
        plate: "33801-1",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2021,
        chassisNumber: "MD2A11CX1MCL25450",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MD2A11CX3PCF01194",
        plate: "28081-2",
        make: "Bajaj",
        model: "Bajaj Pulsar",
        makeYear: 2023,
        chassisNumber: "MD2A11CX3PCF01194",
        logo: "/vehiclelogo/bajaj.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4RG519738",
        plate: "73453-X",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2024,
        chassisNumber: "MDHBN7AD4RG519738",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD7PG332572",
        plate: "36240-E",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7AD7PG332572",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD0NG156980",
        plate: "44739-Y",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD0NG156980",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD9NG128952",
        plate: "58328-N",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD9NG128952",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD6PG332756",
        plate: "35779-E",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7AD6PG332756",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4RG519741",
        plate: "75015-X",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2024,
        chassisNumber: "MDHBN7AD4RG519741",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7ADXRG520652",
        plate: "74507-X",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2024,
        chassisNumber: "MDHBN7ADXRG520652",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4NG138871",
        plate: "98166-Q",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD4NG138871",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4PG324462",
        plate: "20468-D",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7AD4PG324462",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD1NG139699",
        plate: "98155-Q",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD1NG139699",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4NG150549",
        plate: "79693-W",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD4NG150549",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD2PG317106",
        plate: "56049-Z",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7AD2PG317106",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7ADXPG316396",
        plate: "30693-Z",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7ADXPG316396",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD5PG321585",
        plate: "83785-Z",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2023,
        chassisNumber: "MDHBN7AD5PG321585",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD4NG132519",
        plate: "20339-J",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD4NG132519",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      },
      {
        id: "MDHBN7AD1NG147298",
        plate: "43016-D",
        make: "Nissan",
        model: "Nissan Sunny",
        makeYear: 2022,
        chassisNumber: "MDHBN7AD1NG147298",
        logo: "/vehiclelogo/nissan.png",
        status: "Assigned" as const,
        insuranceExpiry: new Date("2025-12-25"),
        registrationExpiry: new Date("2025-12-28"),
        assignedDriver: null
      }
    ];

    console.log(`Loaded ${mockVehicles.length} vehicles from CSV`);

    const mockAssets = [
      {
        id: '1',
        name: 'Visor',
        type: 'Safety',
        totalQuantity: 18,
        availableQuantity: 18,
        assignments: []
      },
      {
        id: '2',
        name: 'Mask',
        type: 'Safety',
        totalQuantity: 31,
        availableQuantity: 31,
        assignments: []
      },
      {
        id: '3',
        name: 'Water Bottle',
        type: 'Equipment',
        totalQuantity: 31,
        availableQuantity: 31,
        assignments: []
      },
      {
        id: '4',
        name: 'Small Bag',
        type: 'Equipment',
        totalQuantity: 41,
        availableQuantity: 41,
        assignments: []
      },
      {
        id: '5',
        name: 'Big Bag',
        type: 'Equipment',
        totalQuantity: 52,
        availableQuantity: 52,
        assignments: []
      },
      {
        id: '6',
        name: 'Safety Gloves',
        type: 'Safety',
        totalQuantity: 57,
        availableQuantity: 57,
        assignments: []
      },
      {
        id: '7',
        name: 'Safety Kit',
        type: 'Safety',
        totalQuantity: 57,
        availableQuantity: 57,
        assignments: []
      },
      {
        id: '8',
        name: 'Safety Jacket',
        type: 'Safety',
        totalQuantity: 57,
        availableQuantity: 57,
        assignments: []
      },
      {
        id: '9',
        name: 'Helmet',
        type: 'Safety',
        totalQuantity: 60,
        availableQuantity: 60,
        assignments: []
      },
      {
        id: '10',
        name: 'Winter Jacket',
        type: 'Clothing',
        totalQuantity: 88,
        availableQuantity: 88,
        assignments: []
      },
      {
        id: '11',
        name: 'Trousers',
        type: 'Clothing',
        totalQuantity: 176,
        availableQuantity: 176,
        assignments: []
      },
      {
        id: '12',
        name: 'Shirts',
        type: 'Clothing',
        totalQuantity: 176,
        availableQuantity: 176,
        assignments: []
      }
    ];

    // SIM Card CSV data parsing
    const simCsvData = `Sn/No	Status	assigned project	Mobile Number	2ND SIM	Sim Owner
1	Idle		971527852875		Class
2	Idle		971527867647		Class
3	Idle		971565413877		Class
4	Idle		971568072191		Class
5	Idle		971555321579		Noon Food
6	Idle		971589809110		Noon Supermall
7	Idle		971582918318		Noon NIM
8	Idle		971582921630		Noon NIM
9	Idle		971582923407		Noon NIM
10	Idle		971528169361
11	Idle		971589797200
12	Idle		971527891819		Class
13	Assigned	Noon Supermall	971527876366		Class
14	Assigned	Amazon Now	971504254801		Class
15	Assigned	Noon Supermall	971589811481		Noon Supermall
16	Assigned	Careem Food	971568073271		Class
17	Assigned	CAREEM	971565417402		Class
18	Assigned	Noon Supermall	971581478321		Noon Supermall
19	Assigned	CAREEM	971566830063		Class
20	Assigned	Noon NIM	971582920671		Noon NIM
21	Assigned	Careem	971565458126		Class
22	Assigned	Amazon Now	971549943579		Class
23	Assigned	Noon NIM	971582918167		Noon NIM
24	Assigned	Amazon Now	971527868468		Class
25	Assigned	Amazon Now	971501689802		Class
26	Assigned	Noon Supermall	971502773963		Class
27	Assigned	Noon NIM	971582920893		Noon NIM
28	Assigned	Noon Supermall	971581406737		Noon Supermall
29	Assigned	CAREEM	971527857085		Class
30	Assigned	Noon Food	971589757117		Noon Food
31	Assigned	CAREEM	971527785752	971527847827	Class / Class
32	Assigned	Noon Food	971522712960		Noon Food
33	Assigned	CAREEM	971542662017		Class
34	Assigned	Amazon Now	971527848727		Class
35	Assigned	Careem Food	971527858707		Class
36	Assigned	Noon Supermall	971589800101		Noon Supermall
37	Assigned	Amazon Now	971502773043		Class
38	Assigned	Noon Supermall	971589799298		Noon Supermall
39	Assigned	CAREEM	971527864766		Class
40	Assigned	Noon Supermall	971527858758		Class
41	Assigned	Noon Supermall	971589788007		Noon Supermall
42	Assigned	CAREEM	971565458176		Class
43	Assigned	Porter Driver	971527849489		Class
44	Assigned	Amazon Now	971509920447		Class
45	Assigned	Noon Food	971522499265		Noon Food
46	Assigned	Amazon Now	971502774602		Class
47	Assigned	Noon Food	971522514718		Noon Food
48	Assigned	Noon NIM	971582917826		Noon NIM
49	Assigned	Amazon Now	971527877300		Class
50	Assigned	Porter Driver	971527858175		Class
51	Assigned	Noon Food	971582357372		Noon Food
52	Assigned	CAREEM	971527862782		Class
53	Assigned	Careem Food	971542662019		Class
54	Assigned	CAREEM	971502774520		Class
55	Assigned	Noon Supermall	971589789973		Noon Supermall
56	Assigned	Noon NIM	971582921850		Noon NIM
57	Assigned	Porter Driver	971542662023		Class
58	Assigned	CAREEM	971527786076		Class
59	Assigned	Porter Driver	971527848722		Class
60	Assigned	CAREEM	971527867586		Class
61	Assigned	Noon Supermall	971527858711		Class
62	Assigned	Amazon Now	971527857847		Class
63	Assigned	Class	971504772841		Class
64	Assigned	CAREEM	971502457594		Class
65	Assigned	Porter Driver	971565453156		Class
66	Assigned	Porter Driver	971527854584		Class
67	Assigned	Amazon Now	971527863678		Class
68	Assigned	CAREEM	971527868268		Class
69	Assigned	Porter Driver	971527856876		Class
70	Assigned	Noon NIM	971582919341		Noon NIM
71	Assigned	Noon Supermall	971504585731		Class
72	Assigned	CAREEM	971527858599		Class
73	Assigned	Amazon Now	971527868171		Class
74	Assigned	Noon Supermall	971581406702		Noon Supermall
75	Assigned	Porter Driver	971509919827		Class
76	Assigned	Noon Food	971581205673		Noon Food
77	Assigned	Amazon Now	971563521347		Class
78	Assigned	Noon NIM	971582920668		Noon NIM
79	Assigned	CAREEM	971545837662		Class
80	Assigned	Noon NIM	971582917553		Noon NIM
81	Assigned	Noon Supermall	971589797515		Noon Supermall
82	Assigned	CAREEM	971543081675		Class
83	Assigned	Amazon Now	971527860788		Class
84	Assigned	Noon NIM	971582917637		Noon NIM
85	Assigned	Noon Supermall	971502774169		Class
86	Assigned	Porter Driver	971565377843		Class
87	Assigned	Porter Driver	971568073580		Class
88	Assigned	CAREEM	971527865867		Class
89	Assigned	Amazon Now	971501656019		Class
90	Assigned	Noon NIM	971542662018		Class
91	Assigned	CAREEM	971527858355		Class
92	Assigned	Amazon Now	971527877611		Class
93	Assigned	Careem Food	971527858745		Class
94	Assigned	Noon Food	971522358854		Noon Food
95	Assigned	Porter Driver	971566836326		Class
96	Assigned	Amazon Now	971502775013		Class
97	Assigned	Careem Food	971565415310		Class
98	Assigned	CAREEM	971502494871		Class
99	Assigned	CAREEM	971522448528		Class
100	Assigned	Porter Driver	971565473965		Class
101	Assigned	Porter Driver	971527857865		Class
102	Assigned	Careem Food	971547916629		Class
103	Assigned	Careem Food	971502773716		Class
104	Assigned	Porter Driver	971566836131		Class
105	Assigned	Noon Supermall	971567930371	971589789958	Class / Noon Supermall
106	Assigned	Amazon Now	971543081336		Class
107	Assigned	Noon NIM	971582918702		Noon NIM
108	Assigned	CAREEM	971527860876		Class
109	Assigned	Noon Food	971523651898		Noon Food
110	Assigned	Careem Food	971502774094		Class
111	Assigned	Porter Driver	971527856175
112			971527851517
113			971527867386`;

    // Parse SIM CSV and create SIM objects
    const simLines = simCsvData.split('\n');
    const mockSims = [];

    for (let i = 1; i < simLines.length; i++) {
      const line = simLines[i].trim();
      if (!line) continue;

      // Split by tab since this appears to be tab-delimited
      const values = line.split('\t');
      if (values.length < 6) continue; // Need at least Sn/No, Status, assigned project, Mobile Number, 2ND SIM, Sim Owner

      const snNo = values[0]?.trim();
      const status = values[1]?.trim();
      const assignedProject = values[2]?.trim();
      const mobileNumber = values[3]?.trim();
      const secondSim = values[4]?.trim();
      const simOwner = values[5]?.trim();

      // Skip empty rows
      if (!snNo && !mobileNumber) continue;

      // Determine carrier from mobile number
      let carrier = 'Unknown';
      if (mobileNumber.startsWith('9715')) {
        // UAE number - determine carrier based on prefix
        carrier = 'Etisalat/Du'; // UAE main carriers
      }

      // Map status to proper enum values
      let simStatus: 'Available' | 'Assigned' = 'Available';
      if (status === 'Assigned') simStatus = 'Assigned';
      else if (status === 'Idle') simStatus = 'Available';

      // Determine plan from 2ND SIM or assigned project
      const plan = secondSim || assignedProject || 'Standard';

      // Use simOwner or assignedProject as costCenter
      const costCenter = simOwner || assignedProject || 'Fleet';

      const sim = {
        id: snNo || `sim_${i}`,
        number: mobileNumber || '',
        carrier: carrier,
        plan: plan,
        costCenter: costCenter,
        status: simStatus,
        assignedDriver: null, // No driver assignments in this data
      };

      mockSims.push(sim);
    }

    console.log(`Loaded ${mockSims.length} SIM cards from CSV`);

    // Generate clients dynamically from driver assignments
    const clientMap = new Map();

    // Collect unique clients and their assigned drivers
    mockDrivers.forEach(driver => {
      if (driver.assignedClient && driver.status === 'Active') {
        const clientName = driver.assignedClient;
        if (!clientMap.has(clientName)) {
          clientMap.set(clientName, {
            name: clientName,
            drivers: []
          });
        }
        clientMap.get(clientName).drivers.push(driver.id);
      }
    });

    // Create client objects with proper structure
    const mockClients = Array.from(clientMap.entries()).map(([clientName, clientData], index) => {
      // Generate client ID from name (remove spaces and special chars)
      const clientId = clientName.toLowerCase().replace(/[^a-z0-9]/g, '');

      // Determine logo path based on client name
      let logo = '/clientsymbols/placeholder.svg';
      if (clientName.toLowerCase().includes('careem')) {
        if (clientName.toLowerCase().includes('food')) {
          logo = '/clientsymbols/careem-food.png';
        } else if (clientName.toLowerCase().includes('quik')) {
          logo = '/clientsymbols/Careem-Quik.png';
        } else if (clientName.toLowerCase().includes('naaz')) {
          logo = '/clientsymbols/careem-naaz.png';
        } else {
          logo = '/clientsymbols/careem-food.png'; // Default Careem
        }
      } else if (clientName.toLowerCase().includes('noon')) {
        if (clientName.toLowerCase().includes('super')) {
          logo = '/clientsymbols/noon-super.png';
        } else if (clientName.toLowerCase().includes('food')) {
          logo = '/clientsymbols/noon-food.png';
        } else if (clientName.toLowerCase().includes('minute')) {
          logo = '/clientsymbols/noon-minutes.png';
        } else {
          logo = '/clientsymbols/noon-super.png'; // Default Noon
        }
      } else if (clientName.toLowerCase().includes('amazon')) {
        logo = '/clientsymbols/amazon-now.png';
      } else if (clientName.toLowerCase().includes('porter')) {
        logo = '/clientsymbols/Porter.png';
      }

      // Set contract dates (can be adjusted based on real data)
      const contractStart = new Date('2024-01-01');
      const contractEnd = new Date('2025-12-31');

      // Set rate card and SLA based on client type
      let rateCard = 100;
      let sla = '99.5%';

      if (clientName.toLowerCase().includes('careem')) {
        rateCard = 110;
        sla = '99.8%';
      } else if (clientName.toLowerCase().includes('noon')) {
        rateCard = 120;
        sla = '99.7%';
      } else if (clientName.toLowerCase().includes('amazon')) {
        rateCard = 105;
        sla = '99.6%';
      } else if (clientName.toLowerCase().includes('porter')) {
        rateCard = 95;
        sla = '99.4%';
      }

      return {
        id: clientId,
        name: clientName,
        logo: logo,
        contractStart: contractStart,
        contractEnd: contractEnd,
        rateCard: rateCard,
        sla: sla,
        assignedDrivers: clientData.drivers
      };
    });

    console.log(`Generated ${mockClients.length} clients from driver assignments`);

    // Populate store
    mockDrivers.forEach(driver => addDriver(driver));
    mockVehicles.forEach(vehicle => addVehicle(vehicle));
    // Update asset available quantities based on driver assignments
    mockDrivers.forEach(driver => {
      if (driver.assignedAssets) {
        driver.assignedAssets.forEach(assignment => {
          const asset = mockAssets.find(a => a.id === assignment.assetId);
          if (asset) {
            asset.availableQuantity = Math.max(0, asset.availableQuantity - assignment.quantity);
          }
        });
      }
    });

    mockAssets.forEach(asset => addAsset(asset));
    mockSims.forEach(sim => addSim(sim));
    mockClients.forEach(client => addClient(client));
    }
  }, [addDriver, addVehicle, addAsset, addSim, addClient, drivers]);

  return (
    <div>
      <Toaster />
      <Sonner />
      <Fab
        visible={isLoggedIn && isMobile && dashboardLoaded}
        onAssign={() => setAssignModalOpen(true)}
        onReassign={() => setReassignModalOpen(true)}
      />
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={isLoggedIn ? <Index /> : <Login />} />
                <Route path="/drivers" element={isLoggedIn ? <DriversPage /> : <Login />} />
                <Route path="/vehicles" element={isLoggedIn ? <VehiclesPage /> : <Login />} />
                <Route path="/assets" element={isLoggedIn ? <AssetsPage /> : <Login />} />
                <Route path="/sim-cards" element={isLoggedIn ? <SimCardsPage /> : <Login />} />
                <Route path="/clients" element={isLoggedIn ? <ClientsPage /> : <Login />} />
                <Route path="/compliance" element={isLoggedIn ? <CompliancePage /> : <Login />} />
                <Route path="/tickets" element={isLoggedIn ? <TicketsPage /> : <Login />} />
                <Route path="/finance" element={isLoggedIn ? <FinancePage /> : <Login />} />
                <Route path="/profile" element={isLoggedIn ? <ProfilePage /> : <Login />} />
                <Route path="/settings" element={isLoggedIn ? <SettingsPage /> : <Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <AssignDriverModal
              open={assignModalOpen}
              onOpenChange={setAssignModalOpen}
            />
            <ReassignDriverModal
              open={reassignModalOpen}
              onOpenChange={setReassignModalOpen}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </TooltipProvider>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Toaster />
      <Sonner position="top-right" richColors />
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
