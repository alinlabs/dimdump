import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Zap, Heart, Wallet, X, CheckCircle2 } from 'lucide-react';

export default function Features() {
  const [featuresData, setFeaturesData] = useState({
    judul_utama: "Kenapa Memilih DimDump?",
    deskripsi: "Lebih dari sekadar jajanan, DimDump adalah wujud passion kami dalam menghadirkan kualitas rasa bintang lima dengan harga ramah kantong mahasiswa.",
    fitur: [
      { icon: <Heart className="text-brand-red" size={32} />, title: "Bahan Premium", desc: "Menggunakan daging segar pilihan dan racikan bumbu rahasia yang autentik." },
      { icon: <Zap className="text-brand-yellow" size={32} />, title: "Ekstra Crispy", desc: "Teknik penggorengan khusus yang menghasilkan tekstur krispi super tahan lama." },
      { icon: <Utensils className="text-brand-red" size={32} />, title: "Inovasi Mahasiswa", desc: "Dibuat dengan penuh dedikasi." },
      { icon: <Wallet className="text-brand-yellow" size={32} />, title: "Harga Pas", desc: "Kualitas rasa bintang lima dengan harga ramah kantong." }
    ]
  });

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.beranda?.mengapa_memilih_dimdump) {
          const apiData = data.beranda.mengapa_memilih_dimdump;
          setFeaturesData({
            judul_utama: apiData.judul_utama || featuresData.judul_utama,
            deskripsi: apiData.deskripsi || featuresData.deskripsi,
            fitur: apiData.fitur && apiData.fitur.length > 0 ? apiData.fitur.map((f: any, i: number) => ({
              icon: i % 4 === 0 ? <Heart className="text-brand-red" size={32} /> : 
                    i % 4 === 1 ? <Zap className="text-brand-yellow" size={32} /> : 
                    i % 4 === 2 ? <Utensils className="text-brand-red" size={32} /> : 
                    <Wallet className="text-brand-yellow" size={32} />,
              title: f.judul || f.title || '',
              desc: f.deskripsi || f.desc || ''
            })) : featuresData.fitur
          });
        }
      })
      .catch(err => console.error("Failed to load features data:", err));
  }, []);

  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);

  useEffect(() => {
    if (selectedFeature !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedFeature]);

  return (
    <section className="py-16 md:py-12 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4">{featuresData.judul_utama}</h2>
          <p className="text-gray-600 text-base md:text-lg">{featuresData.deskripsi}</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {featuresData.fitur.map((item, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSelectedFeature(idx);
                }
              }}
              className="bg-gray-50 p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-brand-red/20 md:hover:shadow-xl md:hover:shadow-brand-red/5 transition-all flex flex-col items-center text-center gap-3 md:gap-4 md:cursor-default cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {item.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 leading-tight">{item.title}</h3>
              </div>
              <p className="hidden md:block text-xs sm:text-sm lg:text-base text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedFeature !== null && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
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
                  onClick={() => setSelectedFeature(null)}
                  className="absolute -top-3 bottom-0 -right-[4.5rem] p-2 bg-gray-100 rounded-full md:hidden"
                 >
                  <X className="text-gray-500" size={20} />
                 </button>
              </div>
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm shrink-0 mb-4 border border-gray-100">
                 {featuresData.fitur[selectedFeature].icon}
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{featuresData.fitur[selectedFeature].title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{featuresData.fitur[selectedFeature].desc}</p>
              
              <button 
                onClick={() => setSelectedFeature(null)}
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
