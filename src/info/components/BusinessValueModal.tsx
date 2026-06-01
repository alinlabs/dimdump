import { motion, AnimatePresence } from 'motion/react';
import { X, Globe } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BusinessValueModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100]"
          />
          
          <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[101] pointer-events-none p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full bg-gradient-to-br from-brand-red to-brand-red-dark rounded-t-3xl md:rounded-3xl md:max-w-md shadow-2xl pointer-events-auto flex flex-col max-h-[85vh] pb-[max(0px,env(safe-area-inset-bottom))] text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Globe className="w-48 h-48" />
              </div>

              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/20 font-semibold text-sm">
                    Studi Kasus Bisnis
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 md:p-8 overflow-y-auto flex-1 min-h-0 relative z-10">
                <h3 className="font-bold text-2xl font-display leading-tight mb-3">Berdasarkan Nilai Bisnis</h3>
                <p className="text-white/90 text-[15px] leading-relaxed mb-6">
                  Mengapa menggunakan website sedetail ini untuk standar UMKM kami?
                </p>
                
                <ul className="space-y-6">
                  <li className="flex gap-4 items-start">
                    <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm border border-white/20 font-bold">1</div>
                    <div>
                      <h4 className="font-semibold text-lg leading-tight">Kepercayaan Pelanggan Lebih Tinggi</h4>
                      <p className="text-white/80 mt-1 text-sm leading-relaxed">Website yang terlihat profesional mengangkat derajat produk dan menumbuhkan rasa percaya (kredibilitas) di mata pembeli.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm border border-white/20 font-bold">2</div>
                    <div>
                      <h4 className="font-semibold text-lg leading-tight">Administrasi Tanpa Repot</h4>
                      <p className="text-white/80 mt-1 text-sm leading-relaxed">Order masuk tercatat rapi, dan admin kami kini punya Panel Admin lengkap dengan pencatatan uang masuk/keluar otomatis layaknya sistem e-commerce.</p>
                    </div>
                  </li>
                  <li className="flex gap-4 items-start">
                    <div className="mt-1 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-sm border border-white/20 font-bold">3</div>
                    <div>
                      <h4 className="font-semibold text-lg leading-tight">Hemat Potongan Biaya (Bebas Bagi Hasil)</h4>
                      <p className="text-white/80 mt-1 text-sm leading-relaxed">Berbeda dengan menitipkan daftar di aplikasi pihak ketiga yang bisa dikenakan pajak potongan 20%+, menggunakan website mandiri sistem pemesanan via WhatsApp ini memiliki rasio pajak dan potongan transaksi hingga 0%.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 md:p-8 border-t border-white/10 shrink-0 mt-auto relative z-10">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-white text-brand-red font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                >
                  Mengerti
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
