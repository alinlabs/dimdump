import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, MapPin, CheckCircle2 } from 'lucide-react';

export default function Promo() {
  const [promoData, setPromoData] = useState({
    label: "Layanan Spesial",
    judul_utama: "Lebih Mudah,<br class=\"block md:hidden\" /> <span class=\"text-brand-yellow\">Lebih Dekat.</span>",
    deskripsi: "Nikmati kemudahan memesan DimDump dengan layanan pesan antar ke tempatmu. Bebas repot, tinggal tunggu sambil nugas.",
    layanan: [
      {
        icon: <Truck size={32} className="text-brand-red" />,
        iconBg: "bg-brand-red/10",
        title: "COD & Gratis Ongkir",
        mobileTitle: "COD & Gratis Ongkir",
        desc: "Menerima layanan COD Spesial Gratis Ongkir khusus wilayah STIE Wikara dan sekitarnya."
      },
      {
        icon: <MapPin size={32} className="text-brand-red" />,
        iconBg: "bg-brand-red/10",
        title: "Ambil Sendiri",
        mobileTitle: "Ambil Sendiri Ke Lokasi",
        desc: "Kamu juga bisa mengambil pesananmu secara langsung di Kampus STIE Wikara."
      }
    ]
  });

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.beranda?.layanan_spesial) {
          const apiData = data.beranda.layanan_spesial;
          setPromoData({
            label: apiData.label || promoData.label,
            judul_utama: apiData.judul_utama ? 
              (apiData.judul_utama === "Lebih Mudah, Lebih Dekat." 
                ? "Lebih Mudah,<br class=\"block md:hidden\" /> <span class=\"text-brand-yellow\">Lebih Dekat.</span>" 
                : apiData.judul_utama.replace("Lebih Dekat</span>", "Lebih Dekat.</span>")) 
              : promoData.judul_utama,
            deskripsi: apiData.deskripsi || promoData.deskripsi,
            layanan: apiData.layanan && apiData.layanan.length > 0 ? apiData.layanan.map((l: any, i: number) => ({
              icon: i === 0 ? <Truck size={32} className="text-brand-red" /> : <MapPin size={32} className="text-brand-red" />,
              iconBg: "bg-brand-red/10",
              title: l.judul || l.title || '',
              mobileTitle: l.judul_mobile || l.mobileTitle || l.judul || '',
              desc: l.deskripsi || l.desc || ''
            })) : promoData.layanan
          });
        }
      })
      .catch(err => console.error("Failed to load promo data:", err));
  }, []);

  const [selectedService, setSelectedService] = useState<number | null>(null);

  useEffect(() => {
    if (selectedService !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedService]);

  return (
    <section className="py-6 md:py-10 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-red rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 shadow-2xl">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow rounded-full blur-3xl opacity-20 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="w-full md:w-1/2 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-xs md:text-sm mb-6">
              <CheckCircle2 size={16} className="text-brand-yellow" />
              <span>{promoData.label}</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Lebih Mudah,<br className="block md:hidden" />
              <span className="text-brand-yellow"> Lebih Dekat.</span>
            </h2>
            <p className="text-white/90 text-sm md:text-lg mb-0 leading-relaxed max-w-lg mx-auto md:mx-0">
              {promoData.deskripsi}
            </p>
          </div>

          <div className="w-full md:w-1/2 relative z-10 grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-4">
            {promoData.layanan.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSelectedService(idx);
                  }
                }}
                className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-lg border border-white/20 flex flex-col items-center text-center md:items-start md:text-left gap-2 md:gap-3 md:cursor-default cursor-pointer transition-transform active:scale-[0.98] md:active:scale-100"
              >
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                  <div className={`w-14 h-14 md:w-14 md:h-14 ${item.iconBg} rounded-2xl md:rounded-xl flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-xl">
                    <span className="md:hidden">{item.mobileTitle}</span>
                    <span className="hidden md:inline">{item.title}</span>
                  </h3>
                </div>
                <p 
                  className="hidden md:block text-gray-500 text-sm md:text-base"
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedService !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-gray-900/40 z-[60] md:hidden backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 bg-white z-[70] rounded-t-3xl p-6 pb-[max(2rem,env(safe-area-inset-bottom))] md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col items-center text-center"
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-6 relative">
                 <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute -top-3 -right-32 md:hidden"
                 >
                 </button>
              </div>
              <div className={`w-20 h-20 ${promoData.layanan[selectedService].iconBg} rounded-2xl flex items-center justify-center shadow-sm shrink-0 mb-4 border border-white/50`}>
                 {promoData.layanan[selectedService].icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{promoData.layanan[selectedService].mobileTitle}</h3>
              <p 
                className="text-gray-600 text-sm leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: promoData.layanan[selectedService].desc }}
              />
              
              <button 
                onClick={() => setSelectedService(null)}
                className="bg-brand-red text-white font-bold py-4 px-6 rounded-2xl w-full active:scale-[0.98] transition-transform"
              >
                Mengerti
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
