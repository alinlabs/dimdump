import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "/gambar/logo.png"
  });
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    if (localStorage.getItem('admin_email')) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.info_web) setInfoWeb(data.info_web);
        if (data?.akses_admin) {
          const emails: string[] = data.akses_admin;
          setAllowedEmails(emails);
          
          // Auto-login check
          const searchParams = new URLSearchParams(window.location.search);
          let emailFromUrl = searchParams.get('email');
          if (!emailFromUrl && window.location.search.startsWith('?=')) {
            emailFromUrl = decodeURIComponent(window.location.search.substring(2));
          }
          
          if (emailFromUrl === 'auto') {
             sessionStorage.setItem('admin_email_temp', 'auto_admin');
             navigate('/admin/dashboard', { replace: true });
          } else if (emailFromUrl) {
            if (emails.map(e => e.toLowerCase()).includes(emailFromUrl.toLowerCase().trim())) {
              localStorage.setItem('admin_email', emailFromUrl.toLowerCase().trim());
              navigate('/admin/dashboard', { replace: true });
            } else {
              showToast('Email tidak valid.');
            }
          }
        }
      })
      .catch(err => console.error("Failed to load info_web:", err));
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      // Validasi dari daftar yang ditarik dari data.json
      if (allowedEmails.map(e => e.toLowerCase()).includes(email.toLowerCase().trim())) {
        localStorage.setItem('admin_email', email.toLowerCase().trim());
        navigate('/admin/dashboard');
      } else {
        showToast('Email tidak dikenali sebagai Admin.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-brand-red lg:bg-white flex flex-col lg:flex-row selection:bg-brand-yellow selection:text-brand-red-dark">
      {/* Mobile Hero View */}
      <div className="lg:hidden relative pt-12 pb-20 px-6 flex flex-col items-center text-center justify-center bg-gradient-to-br from-brand-red to-brand-red-dark overflow-hidden min-h-[35vh]">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-brand-yellow/20 rounded-full blur-3xl"></div>
        
        <h1 className="text-3xl font-display font-black text-white tracking-tight mb-2 relative z-10 mt-8">
          Admin Panel
        </h1>
        <p className="text-white/80 text-sm font-medium relative z-10 max-w-[250px] mx-auto">
          Sistem manajemen terpadu
        </p>
      </div>

      {/* Left Panel - Visual (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-brand-red to-brand-red-dark overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <img src={infoWeb.logo} alt="Logo" className="h-10 w-auto object-contain drop-shadow-md" />
          <span className="font-display font-black text-2xl tracking-tight text-white pt-1">{infoWeb.nama}</span>
        </div>

        <div className="relative z-10">
          <div className="bg-white/20 backdrop-blur-md p-5 rounded-3xl mb-6 inline-block border border-white/20 shadow-xl">
            <ShieldCheck className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-tight mb-6 max-w-lg">
            Sistem Admin Terpadu
          </h1>
          <p className="text-white/80 text-xl max-w-md leading-relaxed font-medium">
            Kelola pesanan, pantau analitik, dan kontrol preferensi sistem dengan panel admin yang responsif dan aman.
          </p>
        </div>

        <div className="relative z-10 text-white/50 text-sm font-medium">
          &copy; {new Date().getFullYear()} {infoWeb.nama}. Hak Cipta Dilindungi.
        </div>
      </div>

      {/* Right Panel - Login Form (Bottom sheet style on Mobile) */}
      <div className="w-full lg:w-1/2 flex-1 lg:flex-none flex items-start lg:items-center justify-center p-0 lg:p-24 relative z-20">
        
        {/* Mobile bottom sheet container, regular full height on desktop */}
        <div className="w-full bg-white rounded-t-[2.5rem] lg:rounded-none px-6 pt-8 pb-12 lg:p-0 shadow-[0_-20px_40px_rgba(0,0,0,0.15)] lg:shadow-none -mt-8 lg:mt-0 relative flex-1 min-h-[65vh] lg:min-h-0 z-30 flex flex-col justify-start lg:justify-center">
          
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 lg:hidden"></div>

          <div className="w-full max-w-md mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-10 lg:mb-12 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-display font-black text-gray-900 tracking-tight mb-3">Selamat Datang</h2>
                <p className="text-gray-500 font-medium text-lg">Silakan masuk menggunakan kredensial email Anda.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">Email Kredensial</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-brand-red transition-colors">
                      <Mail size={22} />
                    </div>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dimdump.com"
                      required
                      className="w-full pl-14 pr-4 py-4 md:py-5 text-[16px] md:text-lg rounded-2xl bg-gray-50 border-2 border-gray-100 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/10 transition-all font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full py-4 md:py-5 px-6 bg-brand-red text-white flex items-center justify-center gap-3 font-black text-lg rounded-2xl hover:bg-brand-red-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-xl shadow-brand-red/20 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 border-t border-gray-200"></div>
                  <div className="relative bg-white px-4 text-sm text-gray-400 font-bold">Atau masuk dengan</div>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => showToast('Sedang Maintenance')} className="w-full flex items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  </button>
                  <button type="button" onClick={() => showToast('Sedang Maintenance')} className="w-full flex items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M16.591.002c1.036 0 2.456.633 3.161 1.517.604.757 1.064 1.83 1.023 2.923-1.127.04-2.399-.613-3.117-1.472-.613-.74-1.109-1.854-1.067-2.968z" fill="#000"/>
                      <path d="M17.151 6.559c-1.353-.042-2.781.826-3.486.826-.725 0-1.895-.805-3.003-.784-1.442.022-2.775.836-3.523 2.133-1.514 2.628-.387 6.518 1.085 8.65 .725 1.042 1.579 2.221 2.687 2.179 1.066-.043 1.481-.69 2.761-.69 1.28 0 1.666.69 2.784.667 1.157-.02 1.894-1.11 2.618-2.155.833-1.217 1.173-2.398 1.196-2.46-.026-.011-2.308-.885-2.336-3.525-.022-2.208 1.802-3.254 1.884-3.308-1.026-1.503-2.624-1.706-3.18-1.761z" fill="#000"/>
                    </svg>
                  </button>
                  <button type="button" onClick={() => showToast('Sedang Maintenance')} className="w-full flex items-center justify-center p-3 sm:p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M1 1h10.5v10.5H1z" fill="#F25022"/>
                      <path d="M12.5 1H23v10.5H12.5z" fill="#7FBA00"/>
                      <path d="M1 12.5h10.5V23H1z" fill="#00A4EF"/>
                      <path d="M12.5 12.5H23V23H12.5z" fill="#FFB900"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="mt-12 text-center lg:text-left">
                <button 
                  onClick={() => navigate('/')}
                  className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors inline-flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-xl"
                >
                  &larr; Kembali Ke Beranda
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-xl font-medium text-sm z-[100] flex items-center gap-3 whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-brand-yellow"></div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
