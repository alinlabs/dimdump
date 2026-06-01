import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, X } from 'lucide-react';
import FlashTimer from './FlashTimer';

interface MenuProps {
  setQty: (qty: number | ((prev: number) => number)) => void;
}

interface Product {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  harga_asli: number | null;
  info_satuan: string;
  gambar: string;
  jumlah_tambah: number;
}

export default function Menu({ setQty }: MenuProps) {
  const [isSeputarOpen, setIsSeputarOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [timerStatus, setTimerStatus] = useState<{ active: boolean, isPO: boolean, labels?: any }>({ active: false, isPO: false });

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        console.log("Data from /api/data:", json);
        const data = Array.isArray(json) ? json[0] : json;
        let foundProducts: any[] = [];
        if (data && Array.isArray(data.produk)) {
          foundProducts = data.produk;
        } else if (Array.isArray(json)) {
          // If json was an array but json[0].produk doesn't exist, maybe json itself is the products array
          foundProducts = json;
        } else if (data && typeof data === 'object') {
          // Fallback: look specifically for something that looks like products
          const possibleArrays = Object.values(data).filter(Array.isArray);
          for (const arr of possibleArrays) {
            if (arr.length > 0 && ('harga' in arr[0] || 'harga_asli' in arr[0])) {
              foundProducts = arr;
              break;
            }
          }
        }
        setProducts(foundProducts);
      })
      .catch(err => console.error("Failed to load products:", err));
  }, []);

  useEffect(() => {
    if (isSeputarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSeputarOpen]);

  const handleAddQty = (qty: number) => setQty(prev => prev + qty);

  const paketHemat = products.find(p => p.id === 'paket_hemat') || products[0];
  const satuan = products.find(p => p.id === 'satuan') || products[1];

  return (
    <section id="menu" className="pt-10 pb-6 md:py-12 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-2xl mx-auto ${timerStatus.active ? 'mb-4 md:mb-8' : 'mb-6 md:mb-10'}`}>
          <span className="text-brand-red font-bold tracking-wider uppercase text-xs md:text-sm mb-2 block md:hidden">
            {timerStatus.active 
              ? (timerStatus.labels?.judul_section_mobile_aktif || "Promo & Waktu Terbatas") 
              : "Pilihan Menu Spesial"}
          </span>
          <span className="text-brand-red font-bold tracking-wider uppercase text-xs md:text-sm mb-2 hidden md:block">
            {timerStatus.active 
              ? (timerStatus.labels?.judul_section_desktop_aktif || "Pilihan Menu Spesial") 
              : "Pilihan Menu Spesial"}
          </span>
          
          {!timerStatus.active && (
            <h2 className="font-display text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-6 md:hidden">
              Nikmati Sesuai Selera
            </h2>
          )}
          <h2 className="font-display text-3xl md:text-5xl font-black text-gray-900 mb-4 md:mb-4 hidden md:block">
            Nikmati Sesuai Selera
          </h2>

          <p className="text-gray-600 text-base md:text-lg hidden md:block">Tersedia dalam dua pilihan pesanan, untuk kamu yang suka ngemil santai atau berbagi porsi maksimal dengan teman-teman.</p>
        </div>

        <FlashTimer onTimerUpdate={setTimerStatus} />

        <div className="flex flex-col gap-4 md:gap-6 w-full mb-4 md:mb-6">
          
          {/* Menu 1: Paket Hemat (Promo Utama) */}
          {paketHemat && paketHemat.harga !== undefined && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-red rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row w-full [transform:translateZ(0)]"
          >
            <div className="absolute top-1/2 right-0 w-64 h-64 md:w-96 md:h-96 bg-brand-yellow rounded-full blur-3xl opacity-20 pointer-events-none z-0"></div>

            {/* Image section */}
            <div className="w-full md:w-1/2 lg:w-[55%] aspect-[4/3] md:aspect-auto relative z-10 shrink-0">
              <img 
                src={paketHemat.gambar} 
                alt={paketHemat.nama} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 md:p-8 md:hidden">
                <h3 className="font-display text-2xl font-bold text-white mb-0 drop-shadow-md">{paketHemat.nama}</h3>
              </div>
            </div>

            {/* Content section */}
            <div className="flex flex-col flex-grow relative z-10 p-5 md:p-8 lg:p-8 md:justify-center">
              {paketHemat.id === 'paket_hemat' && (
              <div className="hidden md:inline-block px-4 py-1.5 bg-brand-yellow text-brand-red-dark font-bold text-sm rounded-full shadow-lg self-start mb-4">
                BEST SELLER 🔥
              </div>
              )}
              <h3 className="hidden md:block font-display text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-md">{paketHemat.nama}</h3>
              <p className="hidden md:block text-white/90 text-sm lg:text-base mb-6 leading-relaxed">{paketHemat.deskripsi}</p>

              <div className="flex flex-row items-center justify-between gap-4 w-full mt-2 md:mt-0">
                <div className="flex flex-col justify-center">
                  {paketHemat.harga_asli && (
                  <span className="text-sm md:text-xl text-white/80 mb-0.5 md:mb-1 leading-none">
                    Harga hanya <span className="line-through decoration-white/70 text-white/60">Rp {paketHemat.harga_asli.toLocaleString('id-ID')}</span>
                  </span>
                  )}
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-none mt-1">
                    Rp {paketHemat.harga.toLocaleString('id-ID')} <span className="text-sm md:text-xl font-medium text-white/70">{paketHemat.info_satuan}</span>
                  </div>
                </div>

                {/* Mobile Add Button */}
                <button 
                  onClick={() => handleAddQty(paketHemat.jumlah_tambah)}
                  className="w-14 h-14 md:hidden rounded-xl bg-brand-yellow text-brand-red-dark hover:bg-white transition-all flex items-center justify-center shadow-lg shrink-0"
                >
                  <span className="text-4xl font-black leading-none mb-1">+</span>
                </button>
              </div>

              {/* Desktop Add Button */}
              <button 
                onClick={() => handleAddQty(paketHemat.jumlah_tambah)}
                className="hidden md:flex w-full mt-6 lg:mt-6 py-3.5 md:py-4 rounded-xl md:rounded-2xl bg-brand-yellow text-brand-red-dark font-bold text-base md:text-xl hover:bg-white transition-all md:shadow-xl md:shadow-brand-yellow/20 items-center justify-center gap-2"
              >
                <span className="text-xl md:text-2xl leading-none font-black">+</span>
                Masukkan Keranjang
              </button>
            </div>
            {/* Mobile label fallback */}
            {paketHemat.id === 'paket_hemat' && (
            <div className="absolute top-4 left-4 z-20 md:hidden">
              <div className="inline-block px-3 py-1 bg-brand-yellow text-brand-red-dark font-bold text-xs rounded-full shadow-lg">
                BEST SELLER 🔥
              </div>
            </div>
            )}
          </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-1 md:mt-0">
            {/* Menu 2: Satuan (Opsi Kecil) */}
            {satuan && satuan.harga !== undefined && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-200 p-3 md:p-5 hover:border-brand-red/30 hover:shadow-md transition-all flex items-center justify-between gap-3 md:gap-4 relative overflow-hidden"
            >
              <div className="flex items-center gap-3 md:gap-5 flex-grow">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden relative shrink-0">
                  <img 
                    src={satuan.gambar} 
                    alt={satuan.nama} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-display font-bold text-gray-900 text-lg md:text-2xl leading-tight mb-0.5">{satuan.nama}</h3>
                  <div className="text-brand-red font-black text-base md:text-xl">
                    Rp {satuan.harga.toLocaleString('id-ID')} <span className="text-xs md:text-base font-medium text-gray-400">{satuan.info_satuan}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleAddQty(satuan.jumlah_tambah)}
                className="w-12 h-12 md:w-auto md:px-6 md:h-14 rounded-xl bg-gray-100 text-gray-900 font-bold hover:bg-brand-red hover:text-white transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <span className="text-2xl md:text-xl font-black leading-none md:-mt-0.5">+</span>
                <span className="hidden md:inline">Tambah</span>
              </button>
            </motion.div>
            )}

            {/* Seputar Dimsum Kami - Clickable Trigger */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => setIsSeputarOpen(true)}
              className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-5 md:p-6 cursor-pointer hover:border-brand-red/30 hover:shadow-md transition-all group flex flex-col justify-center"
            >
              <h3 className="font-display text-xl md:text-2xl font-black text-gray-900 mb-2">Seputar Dimsum Kami</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-2">
                DimDump menyajikan dimsum goreng krispi dengan kualitas terbaik. Karena kami fokus pada satu menu spesial, 
                kami pastikan setiap gigitannya memberikan pengalaman rasa yang asik. Paling pas untuk nemenin aktivitas.
              </p>
              <span className="inline-block mt-3 text-brand-red font-bold text-sm md:text-base group-hover:underline">Lihat Selengkapnya...</span>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSeputarOpen && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsSeputarOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full md:w-[500px] bg-white rounded-t-[2rem] md:rounded-3xl p-6 md:p-8 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:pb-8 max-h-[90dvh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <button 
                onClick={() => setIsSeputarOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>

              <h3 className="font-display text-2xl md:text-3xl font-black text-gray-900 mb-4 pr-8">Seputar Dimsum Kami</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                DimDump menyajikan dimsum goreng krispi dengan kualitas terbaik. Karena kami fokus pada satu menu spesial, 
                kami pastikan setiap gigitannya memberikan pengalaman rasa yang asik. Paling pas untuk nemenin aktivitas atau tugas kamu seharian penuh.
              </p>
              
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-brand-red/10 flex flex-col items-center justify-center text-brand-red shrink-0">
                    <span className="font-black text-lg md:text-xl leading-none">100%</span>
                  </div>
                  <div>
                    <span className="block text-sm md:text-base font-bold text-gray-900 mb-0.5">Daging Ayam</span>
                    <span className="block text-xs md:text-sm text-gray-500">Daging fillet dada ayam segar pilihan tanpa bahan pengawet.</span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-brand-yellow/30 flex flex-col items-center justify-center text-brand-yellow shrink-0">
                    <span className="font-black text-lg md:text-xl leading-none">Keju</span>
                  </div>
                  <div>
                    <span className="block text-sm md:text-base font-bold text-gray-900 mb-0.5">Isian Lumer</span>
                    <span className="block text-xs md:text-sm text-gray-500">Keju moza yang lumer di dalam memberikan sensasi gurih.</span>
                  </div>
                </div>
                <div className="flex flex-row items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-200 flex flex-col items-center justify-center text-gray-700 shrink-0">
                    <span className="font-black text-[10px] md:text-xs leading-tight text-center px-1">Chili<br className="hidden md:block"/>Garlic</span>
                  </div>
                  <div>
                    <span className="block text-sm md:text-base font-bold text-gray-900 mb-0.5">Saus Spesial</span>
                    <span className="block text-xs md:text-sm text-gray-500">Saus racikan sendiri khusus untuk menemani kerenyahan ekstra.</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
