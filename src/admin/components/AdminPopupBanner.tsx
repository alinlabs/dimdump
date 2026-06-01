import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Info, Users, Activity, ShoppingBag, Gift, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

function AnimatedCounter({ value, duration = 1500 }: { value: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(value * easePercentage));
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <>{count}</>;
}

export default function AdminPopupBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstallable, installPWA } = usePWAInstall();
  const [stats, setStats] = useState({ users: 0, logs: 0, promos: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [dbRes, dataRes] = await Promise.all([
          fetch('/api/admin/db'),
          fetch('/api/data')
        ]);
        
        const db = await dbRes.json();
        const kvDataRaw = await dataRes.json();
        const kvData = Array.isArray(kvDataRaw) ? kvDataRaw[0] : kvDataRaw;
        
        const users = db.database_user || [];
        const logs = db.log || [];
        
        let promoCount = 0;
        if (kvData?.promo?.paket_hemat) promoCount += kvData.promo.paket_hemat.length;
        if (kvData?.promo?.satuan) promoCount += kvData.promo.satuan.length;

        let productsCount = 0;
        if (kvData?.produk && Array.isArray(kvData.produk)) {
          productsCount = kvData.produk.length;
        } else if (kvData?.menu?.produk && Array.isArray(kvData.menu.produk)) {
          productsCount = kvData.menu.produk.length;
        }

        setStats({
          users: Array.isArray(users) ? users.length : 0,
          logs: Array.isArray(logs) ? logs.length : 0,
          promos: promoCount,
          products: productsCount
        });
      } catch (err) {
        console.error('Failed to fetch stats for popup', err);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (mainScroll) mainScroll.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[480px] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl border-none"
          >
            {/* Header Section */}
            <div className="relative bg-gradient-to-br from-brand-red to-brand-red-dark px-6 py-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative z-10 text-white flex items-center gap-4">
                <div className="shrink-0 inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-inner">
                  <Sparkles className="w-6 h-6 text-brand-yellow" />
                </div>
                <div>
                  <h3 className="font-bold text-2xl mb-1">Halo Admin! 👋</h3>
                  <p className="text-white/80 text-sm">Berikut ringkasan singkat sistem hari ini.</p>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 bg-gray-50/50">
              {loading ? (
                <div className="grid grid-cols-3 gap-4 animate-pulse mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl h-24 border border-gray-100"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-brand-red/5 p-3 md:p-4 rounded-2xl shadow-sm border border-brand-red/10 flex flex-col justify-center items-center gap-1.5 group hover:border-brand-red/30 transition-colors text-center">
                    <div className="p-1.5 md:p-2 bg-brand-red/10 text-brand-red rounded-lg group-hover:bg-brand-red group-hover:text-white transition-colors mb-0.5">
                      <Users className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 leading-none"><AnimatedCounter value={stats.users} /></div>
                    <span className="text-[10px] md:text-xs font-medium text-brand-red-dark leading-none mt-0.5">Pengguna</span>
                  </div>

                  <div className="bg-brand-red/5 p-3 md:p-4 rounded-2xl shadow-sm border border-brand-red/10 flex flex-col justify-center items-center gap-1.5 group hover:border-brand-red/30 transition-colors text-center">
                    <div className="p-1.5 md:p-2 bg-brand-red/10 text-brand-red rounded-lg group-hover:bg-brand-red group-hover:text-white transition-colors mb-0.5">
                      <Activity className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 leading-none"><AnimatedCounter value={stats.logs} /></div>
                    <span className="text-[10px] md:text-xs font-medium text-brand-red-dark leading-none mt-0.5">Aktivitas</span>
                  </div>

                  <div className="bg-brand-red/5 p-3 md:p-4 rounded-2xl shadow-sm border border-brand-red/10 flex flex-col justify-center items-center gap-1.5 group hover:border-brand-red/30 transition-colors text-center">
                    <div className="p-1.5 md:p-2 bg-brand-red/10 text-brand-red rounded-lg group-hover:bg-brand-red group-hover:text-white transition-colors mb-0.5">
                      <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900 leading-none"><AnimatedCounter value={stats.products} /></div>
                    <span className="text-[10px] md:text-xs font-medium text-brand-red-dark leading-none mt-0.5">Menu</span>
                  </div>
                </div>
              )}
              
              <p className="text-[13px] text-gray-500 font-medium leading-relaxed text-center px-4">
                Selalu pantau tab <span className="font-bold text-gray-700">Log Sistem</span> untuk melihat interaksi pengunjung secara realtime dan pastikan ketersediaan dimsum!
              </p>
            </div>

            {isInstallable && (
              <div className="w-full bg-white p-5 border-t border-gray-100">
                <button 
                  onClick={installPWA}
                  className="relative overflow-hidden group flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors focus:ring-4 focus:ring-gray-200"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  <Download className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
                  <span>Install Admin Apps</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
