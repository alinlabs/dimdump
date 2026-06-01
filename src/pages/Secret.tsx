import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Key, Fingerprint, UserCog, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Secret() {
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.akses_admin) {
          setAllowedEmails(data.akses_admin);
        }
      })
      .catch(err => console.error("Failed to load admin emails:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAutoLogin = (email: string) => {
    // Navigate to login with the auto-login URL pattern
    navigate(`/login?=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col md:items-center md:justify-center p-0 md:p-8 font-sans selection:bg-brand-red selection:text-white relative overflow-x-hidden">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-brand-yellow/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        <div className="fixed inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl relative z-10 flex flex-col min-h-screen md:min-h-0 md:h-auto md:max-h-[900px]"
      >
        {/* Main Card */}
        <div className="bg-transparent md:bg-white/5 md:backdrop-blur-2xl md:border border-white/10 rounded-none md:rounded-[2.5rem] md:shadow-2xl md:shadow-black/50 flex flex-col flex-1 md:overflow-hidden">
          
          <div className="flex flex-col md:flex-row flex-1">
            {/* Left Column - Header & Bypass */}
            <div className="p-6 pt-16 pb-16 sm:p-10 md:w-5/12 md:border-r border-white/10 relative overflow-hidden flex flex-col justify-between shrink-0">
              {/* Header Background Glow */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-red/20 to-transparent opacity-50 blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-red to-brand-red-dark text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-red/20 border border-white/10">
                    <ShieldAlert size={28} className="sm:w-8 sm:h-8" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs font-bold text-white/70 tracking-wider">SISTEM AKTIF</span>
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight mb-3">Area Terbatas</h1>
                <p className="text-white/60 font-medium text-sm sm:text-base leading-relaxed mb-8">
                  Pilih identitas yang memiliki otoritas untuk mengakses panel admin, atau gunakan akses bypass sementara.
                </p>
              </div>

              {/* Bypass Button */}
              <div className="relative z-10 mt-auto pb-4 md:pb-0">
                <div className="text-[10px] sm:text-xs font-bold text-white/50 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Key size={14} /> Akses Darurat
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAutoLogin('auto')}
                  className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-brand-red to-brand-red-dark p-[1px]"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-[#0F0F13] px-5 py-4 sm:px-6 sm:py-5 rounded-[15px] flex items-center justify-between transition-all group-hover:bg-opacity-0">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-red/20 flex items-center justify-center text-brand-red group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Key size={20} className="sm:w-6 sm:h-6" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-white text-base sm:text-lg group-hover:text-white transition-colors">Akses Bypass</span>
                        <span className="text-[9px] sm:text-[10px] text-brand-red group-hover:text-white/80 font-medium tracking-wide">SESI SEMENTARA • AUTO BYPASS</span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-brand-red group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Right Column - Identities (Bottom Sheet on Mobile) */}
            <div className="p-6 pt-8 pb-8 sm:pb-12 sm:p-10 md:w-7/12 flex flex-col flex-1 bg-[#111] md:bg-white/[0.02] relative rounded-t-[2.5rem] md:rounded-none shadow-[0_-20px_40px_rgba(0,0,0,0.4)] md:shadow-none -mt-8 md:mt-0 z-20 border-t border-white/10 md:border-none min-h-[50vh] md:min-h-0">
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 md:hidden shrink-0"></div>
              
              <div className="flex items-center gap-3 mb-6 relative z-10 shrink-0">
                <div className="text-[10px] sm:text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Fingerprint size={14} />
                  <span>Identitas Terotorisasi</span>
                </div>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>
              
              <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0 pb-4">
                <AnimatePresence>
                  {isLoading ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="flex flex-col gap-3 py-2"
                    >
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-16 w-full rounded-xl bg-white/5 animate-pulse border border-white/5"></div>
                      ))}
                    </motion.div>
                  ) : allowedEmails.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {allowedEmails.map((email, i) => (
                        <motion.button
                          key={email}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAutoLogin(email)}
                          className="w-full text-left bg-white/5 hover:bg-white/10 p-4 rounded-xl flex items-center justify-between transition-all outline-none focus:ring-2 focus:ring-white/20 border border-white/5 hover:border-white/20 group"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-brand-yellow group-hover:bg-brand-yellow/10 transition-colors">
                              <UserCog size={18} />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                              <span className="font-bold text-white/80 group-hover:text-white transition-colors text-sm truncate">{email}</span>
                              <span className="text-[9px] sm:text-[10px] text-white/30 uppercase tracking-wider">AKSES PENUH</span>
                            </div>
                          </div>
                          <Lock size={16} className="text-white/20 group-hover:text-brand-yellow opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-2" />
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 h-full text-white/40 font-medium bg-white/5 rounded-xl border border-white/5 text-sm"
                    >
                      <UserCog size={32} className="mb-3 opacity-20" />
                      Tidak ada identitas terotorisasi.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Return Button */}
              <div className="md:hidden mt-6 pt-4 border-t border-white/10">
                <button 
                  onClick={() => navigate('/')}
                  className="text-white/40 hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-2 mx-auto group w-full py-2"
                >
                  <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                  <span>Kembali ke Beranda</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Desktop Footer */}
          <div className="hidden md:block p-4 sm:p-5 border-t border-white/10 bg-black/40 text-center shrink-0">
            <button 
              onClick={() => navigate('/')}
              className="text-white/40 hover:text-white transition-colors text-xs sm:text-sm font-bold flex items-center justify-center gap-2 mx-auto group w-full py-1"
            >
              <ArrowRight size={16} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
              <span>Kembali ke Beranda</span>
            </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
