import { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';
import { motion } from 'motion/react';

interface FlashTimerProps {
  onTimerUpdate?: (status: { active: boolean; isPO: boolean; labels: any }) => void;
}

export default function FlashTimer({ onTimerUpdate }: FlashTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; label: string; active: boolean; isPO: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    label: '',
    active: false,
    isPO: false
  });
  
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && data[0] && data[0].promo_waktu) {
          setConfig(data[0].promo_waktu);
        }
      })
      .catch(err => console.error("Error fetching promo_waktu", err));
  }, []);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      let targetHour = 0;
      let label = '';
      let active = false;
      let isPO = false;

      const jadwal1Mulai = config?.jadwal_1_mulai ?? 7;
      const jadwal1Selesai = config?.jadwal_1_selesai ?? 17;
      const jadwal2Mulai = config?.jadwal_2_mulai ?? 17;
      const jadwal2Selesai = config?.jadwal_2_selesai ?? 22;

      if (currentHour >= jadwal1Mulai && currentHour < jadwal1Selesai) {
        targetHour = jadwal1Selesai;
        label = config?.jadwal_1_judul || 'Pesan Sekarang! Promo Spesial Buka:';
        active = true;
        isPO = false;
      } else if (currentHour >= jadwal2Mulai && currentHour < jadwal2Selesai) {
        targetHour = jadwal2Selesai;
        label = config?.jadwal_2_judul || 'Pre-Order Besok ditutup dalam:';
        active = true;
        isPO = true;
      }

      if (active) {
        const target = new Date();
        target.setHours(targetHour, 0, 0, 0);
        
        const diff = target.getTime() - now.getTime();
        
        if (diff > 0) {
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          
          setTimeLeft(prev => {
            const newState = { hours: h, minutes: m, seconds: s, label, active: true, isPO };
            return newState;
          });
        } else {
          setTimeLeft(prev => {
            return { ...prev, active: false };
          });
        }
      } else {
        setTimeLeft(prev => {
          return { ...prev, active: false };
        });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [config]);

  useEffect(() => {
    onTimerUpdate?.({ active: timeLeft.active, isPO: timeLeft.isPO, labels: config });
  }, [timeLeft.active, timeLeft.isPO, config, onTimerUpdate]);

  if (!timeLeft.active) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full mb-6 max-w-7xl mx-auto mt-2 md:mt-0"
    >
      <div className="bg-brand-yellow md:bg-gradient-to-r md:from-red-50 md:to-brand-yellow/10 border border-brand-red/10 rounded-2xl md:rounded-3xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg shadow-brand-red/5 relative pt-8 md:pt-6">
        
        {/* Mobile Title Badge */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 md:hidden z-20">
          <div className="bg-brand-red text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-md whitespace-nowrap tracking-wide border-2 border-white">
            {timeLeft.isPO ? (config?.sub_section_jadwal_2_aktif || "PO Sekarang") : (config?.sub_section_jadwal_1_aktif || "Belanja Sekarang")}
          </div>
        </div>

        {/* Background Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/10 rounded-full blur-2xl opacity-50 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="hidden md:flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-brand-red/10 text-brand-red animate-pulse">
            <Timer size={28} />
          </div>
          <div className="hidden md:block">
            <h3 className="font-black text-gray-900 text-lg md:text-xl capitalize tracking-tight">
              {timeLeft.label}
            </h3>
            <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5">
              Promo & waktu terbatas!
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 sm:gap-3 relative z-10 w-full md:w-auto">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-red text-white font-sans font-bold text-2xl md:text-3xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl shadow-md border-b-4 border-red-800 tracking-tight">
              {timeLeft.hours.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-2 uppercase tracking-wider">Jam</span>
          </div>
          <span className="text-brand-red font-black text-xl md:text-2xl pb-6 opacity-50 animate-pulse">:</span>
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-red text-white font-sans font-bold text-2xl md:text-3xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl shadow-md border-b-4 border-red-800 tracking-tight">
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-2 uppercase tracking-wider">Menit</span>
          </div>
          <span className="text-brand-red font-black text-xl md:text-2xl pb-6 opacity-50 animate-pulse">:</span>
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-red text-white font-sans font-bold text-2xl md:text-3xl w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl md:rounded-2xl shadow-md border-b-4 border-red-800 tracking-tight">
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <span className="text-[10px] md:text-xs font-bold text-white mt-2 uppercase tracking-wider">Detik</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
