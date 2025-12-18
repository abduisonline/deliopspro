import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

// Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailEntered, setIsEmailEntered] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showOfflineButton, setShowOfflineButton] = useState(false);
  const navigate = useNavigate();
  const { setCurrentUser, getUserByEmail, drivers } = useStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 4000); // 4 seconds for the enhanced animation
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setIsEmailEntered(email.trim() !== '');
  }, [email]);

  useEffect(() => {
    // Check if already logged in
    const role = localStorage.getItem('userRole');
    if (role) {
      // Check Firebase auth state
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Restore user profile
          const profileUser = getUserByEmail(user.email || '');
          if (profileUser) {
            setCurrentUser(profileUser);
          } else {
            // Default profile for authenticated users
            setCurrentUser({
              email: user.email || '',
              name: user.displayName || 'User',
              title: role,
              role: role,
              avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`
            });
          }
          navigate('/dashboard');
        }
      });
    }
  }, [navigate, setCurrentUser, getUserByEmail]);



  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  // Handle login based on role
  const handleLogin = async () => {
    if (!email.trim()) {
      toast.error('Please enter your credentials');
      return;
    }

    setLoginError(null);

    try {
      if (selectedRole === 'Driver') {
        // For drivers, email field contains Emirates ID
        const emiratesId = email.trim();
        const driver = drivers.find(d => d.emiratesId === emiratesId);

        if (driver) {
          // Create driver user session
          const driverUser = {
            email: driver.email,
            name: driver.name,
            title: 'Delivery Driver',
            role: 'Driver' as const,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name.replace(/\s+/g, '')}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`
          };
          setCurrentUser(driverUser);
          localStorage.setItem('userRole', 'Driver');
          navigate('/dashboard');
          toast.success(`Welcome back, ${driver.name}!`);
        } else {
          toast.error('Driver not found. Please check your Emirates ID.');
        }
      } else {
        // For Admin and Staff, use Firebase authentication
        await signInWithEmailAndPassword(auth, email, password);

        // Get user profile
        const user = getUserByEmail(email);
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('userRole', user.role);
        } else {
          // Default profile for authenticated users
          setCurrentUser({
            email,
            name: 'User',
            title: selectedRole,
            role: selectedRole,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`
          });
          localStorage.setItem('userRole', selectedRole);
        }
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setLoginError(message);
      toast.error('Login failed: ' + message);
    }
  };

  const handleOfflineLogin = () => {
    // Proceed with offline login (skip Firebase auth)
    const user = getUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('userRole', user.role);
    } else {
      setCurrentUser({
        email,
        name: 'User (Offline)',
        title: 'Staff',
        role: selectedRole,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&facialHairType=BeardMajestic&facialHairColor=BrownDark&topType=ShortHairShortFlat&topColor=Black&hatColor=Black`
      });
      localStorage.setItem('userRole', selectedRole);
    }
    localStorage.setItem('offlineMode', 'true');
    navigate('/dashboard');
    toast.success('Logged in offline mode - Limited functionality available');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />
      </div>

      <AnimatePresence>
        {showPreloader && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
             className="absolute inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
           >
             <div className="relative">
               {/* Animated background elements */}
               <motion.div
                 className="absolute inset-0"
                 animate={{
                   rotate: 360,
                   scale: [1, 1.2, 1],
                 }}
                 transition={{
                   rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                   scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                 }}
               >
                  <div className="w-80 h-80 rounded-full bg-gradient-to-r from-gray-600/20 to-gray-700/20 blur-3xl" />
               </motion.div>

               <motion.div
                 className="absolute inset-0"
                 animate={{
                   rotate: -360,
                   scale: [1.2, 1, 1.2],
                 }}
                 transition={{
                   rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                   scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                 }}
               >
                  <div className="w-96 h-96 rounded-full bg-gradient-to-r from-gray-500/10 to-gray-800/10 blur-3xl" />
               </motion.div>

               {/* Main logo with 3D tilt and advanced animations */}
               <motion.div
                 className="relative z-10"
                 initial={{ scale: 0, rotateY: -180 }}
                 animate={{
                   scale: [0, 1.2, 1],
                   rotateY: [180, 0, 0],
                   rotateX: [0, 5, -5, 0],
                 }}
                 transition={{
                   duration: 2,
                   ease: "easeOut",
                   rotateY: { duration: 1.5, ease: "easeOut" },
                   rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                 }}
                 style={{
                   transformStyle: "preserve-3d",
                   perspective: "1000px"
                 }}
               >
                 <motion.img
                   src="/icon.png"
                   alt="Loading Deli-Ops"
                    className="h-64 sm:h-80 md:h-96 w-auto relative z-10 drop-shadow-2xl"
                   animate={{
                     scale: [1, 1.1, 1],
                     rotateZ: [0, 2, -2, 0],
                      filter: [
                        'drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)',
                        'drop-shadow(0 0 40px rgba(0,0,0,0.6)) brightness(1.2)',
                        'drop-shadow(0 0 0 rgba(0,0,0,0)) brightness(1)'
                      ],
                   }}
                   transition={{
                     duration: 3,
                     repeat: Infinity,
                     ease: "easeInOut",
                     filter: { duration: 4, repeat: Infinity }
                   }}
                   whileHover={{
                     scale: 1.05,
                     rotateY: 15,
                     rotateX: 10,
                   }}
                   style={{
                     transformStyle: "preserve-3d",
                     transform: "translateZ(20px)"
                   }}
                  />


               </motion.div>


             </div>
           </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showPreloader && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.8, delay: 1.5 }}
            className="w-full max-w-5xl p-4 sm:p-6 md:p-8 lg:p-14"
          >
            {/* Brand */}
            <div className="flex items-center gap-4 mb-6 sm:mb-8 lg:mb-14">
              <img src="/icon.png" alt="Deli-Ops" className="h-11" />
              <h1 className="text-xl sm:text-2xl font-bold">Deli-Ops</h1>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-3xl grid grid-cols-1 lg:grid-cols-2 overflow-hidden shadow-2xl">
               <div className="p-4 sm:p-6 md:p-8 lg:p-14 border-r border-slate-700 lg:col-span-1">
                 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 leading-tight">Operations Dashboard Access</h2>
                <p className="text-slate-400 max-w-lg leading-relaxed text-base mb-8">
                  Authenticate to enter the Deli-Ops operational environment.
                  This system mirrors your live fleet dashboard, providing
                  administrators, staff, and drivers access to their respective
                  control surfaces.
                </p>
                  <div className="flex items-center justify-center gap-4">
                      <img
                        src={isEmailEntered ? "/class.png" : "/icon.png"}
                        alt={isEmailEntered ? "Client Logo" : "Deli-Ops"}
                        className="w-auto h-auto object-contain"
                        style={{ transform: 'translateX(-10px)', maxWidth: isEmailEntered ? '99px' : '396px', maxHeight: isEmailEntered ? '99px' : '396px' }}
                      />
                    {isEmailEntered && (
                      <span className="text-lg font-bold text-white">
                        Class Worldwide Delivery Operations
                      </span>
                    )}
                  </div>
               </div>

                <div className="p-4 sm:p-6 md:p-8 lg:p-14 bg-gradient-to-br from-slate-900 to-slate-800">
                 <h3 className="text-xl font-semibold mb-7">Sign in</h3>



                 {/* Login Form */}


                 <div className="grid grid-cols-3 gap-3 mb-8">
                  {['Admin', 'Staff', 'Driver'].map((role) => (
                    <button
                      key={role}
                      onClick={() => handleRoleSelect(role)}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedRole === role
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/20'
                          : 'bg-slate-800 border border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>

                 <div className="mb-5">
                   <label className="block text-sm text-slate-400 mb-2">
                     {selectedRole === 'Driver' ? 'Emirates ID' : 'Email or Employee ID'}
                   </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'Driver' ? 'Enter your Emirates ID (e.g., 123-4567-8901234-5)' : 'name@company.com or employee ID'}
                      className="w-full py-3.5 px-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-black focus:shadow-lg focus:shadow-black/20 transition-all"
                    />
                </div>

                <div className="mb-5">
                  <label className="block text-sm text-slate-400 mb-2">Password</label>
                   <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••"
                     className="w-full py-3.5 px-4 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-black focus:shadow-lg focus:shadow-black/20 transition-all"
                   />
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl font-bold text-slate-900 hover:from-cyan-400 hover:to-cyan-500 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  Access Dashboard
                </button>

                {showOfflineButton && (
                  <button
                    onClick={handleOfflineLogin}
                    className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-white hover:from-orange-400 hover:to-orange-500 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-orange-500/30"
                  >
                    Continue Offline
                  </button>
                )}

                {loginError && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400">{loginError}</p>
                  </div>
                )}



                <div className="text-center mt-6 text-xs text-slate-500">
                  Authorized personnel only · All activity is logged
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;