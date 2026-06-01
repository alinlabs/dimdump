import { useState, useEffect } from 'react';
import { ChevronRight, X, MessageCircleQuestion, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqs = [
  {
    question: 'Apakah Dimsum Goreng Krispi DimDump tahan lama?',
    answer: 'Dimsum kami diproduksi dengan bahan baku fresh dan tanpa bahan pengawet buatan. Menikmati dimsum kami paling direkomendasikan saat masih hangat karena tekstur luarnya akan sangat renyah dan bagian dalamnya tetap juicy. Namun, jika Anda ingin menyimpannya untuk dinikmati nanti, Anda bisa memasukkannya ke dalam lemari es. Saat ingin menyantapnya kembali, cukup panaskan menggunakan air fryer pada suhu 180°C selama 3-5 menit, atau digoreng sebentar (re-heat) dalam minyak panas agar kembali renyah sempurna.'
  },
  {
    question: 'Selain varian original, apakah ada rasa atau toping lain?',
    answer: 'Saat ini kami memang berfokus pada varian unggulan kami (Original) untuk memastikan kualitas rasa yang konsisten dan terbaik di setiap gigitannya. Namun jangan khawatir, tim pengembangan produk kami terus bereksperimen di dapur! Kami akan segera menghadirkan kreasi rasa baru serta inovasi toping menarik seperti keju leleh, saus mentai, dan taburan nori pedas dalam waktu dekat. Pantau terus update di website dan Instagram kami!'
  },
  {
    question: 'Apakah melayani pemesanan untuk katering acara besar?',
    answer: 'Tentu saja! Kami dengan senang hati melayani pesanan dalam jumlah besar untuk melengkapi berbagai acara spesial Anda, mulai dari rapat kampus, seminar, ulang tahun, hingga kumpul keluarga besar. Kami menyediakan paket khusus harga grosir dan penawaran menarik untuk pesanan katering. Silakan hubungi langsung kontak WhatsApp admin kami minimal H-3 acara untuk mendiskusikan kebutuhan porsi dan penawarannya.'
  },
  {
    question: 'Bagaimana prosedur dan langkah pemesanannya?',
    answer: 'Sistem pemesanan kami dirancang sangat praktis tanpa perlu mendaftar akun. Pertama, pilih menu dan tentukan jumlah porsi yang merarik dari halaman utama. Kedua, klik tombol Keranjang dan lanjutkan ke Checkout. Anda akan diminta melengkapi pengaturan titik lokasi GPS otomatis (alamat detil akan langsung terisi berkat teknologi Maps Pintar kami). Terakhir, sistem kami akan menyusun seluruh rincian tersebut menjadi pesan formulir dan langsung mengarahkannya ke WhatsApp Admin kami.'
  }
];

export default function FAQ() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (selectedFaq !== null || isMobileSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedFaq, isMobileSheetOpen]);

  return (
    <section className="py-16 md:py-12 bg-gray-50 border-t border-gray-100" id="faq">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-brand-red/10 text-brand-red font-semibold text-sm mb-4">FAQ</div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 tracking-tight mb-4">Pertanyaan Seputar DimDump</h2>
          <p className="text-gray-600 text-base md:text-xl max-w-2xl mx-auto">Temukan jawaban terperinci dari beberapa pertanyaan yang paling sering diajukan oleh pelanggan setia kami.</p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setSelectedFaq(index)}
              className="text-left bg-white border border-gray-200 hover:border-brand-red/50 hover:shadow-md transition-all duration-300 p-6 md:p-8 rounded-3xl group flex items-start justify-between gap-4"
            >
              <div className="flex-1 flex flex-row items-center gap-4">
                <div className="hidden md:flex shrink-0 w-10 h-10 rounded-full bg-gray-50 text-brand-red items-center justify-center group-hover:bg-brand-red/10 transition-colors">
                  <MessageCircleQuestion className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg md:text-xl group-hover:text-brand-red transition-colors text-left">
                  {faq.question}
                </h3>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand-red/10 transition-colors mt-2">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-brand-red" />
              </div>
            </button>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex justify-center">
          <button
            onClick={() => setIsMobileSheetOpen(true)}
            className="bg-brand-yellow text-brand-red-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-brand-red border border-transparent hover:border-brand-red transition-all shadow-md flex items-center gap-2 w-full justify-center"
          >
            <MessageCircleQuestion className="w-6 h-6" />
            Tanyakan Sesuatu
          </button>
        </div>
      </div>

      <AnimatePresence>
        {/* Desktop Modal */}
        {selectedFaq !== null && !isMobileSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFaq(null)}
              className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100]"
            />
            
            <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-[101] pointer-events-none p-0 md:p-6">
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full bg-white rounded-t-3xl md:rounded-3xl md:max-w-lg shadow-2xl pointer-events-auto flex flex-col max-h-[85vh]"
              >
                <div className="p-5 md:p-6 border-b border-gray-100 flex items-start justify-between gap-4 sticky top-0 bg-white md:rounded-t-3xl rounded-t-3xl shrink-0">
                  <h3 className="font-bold text-xl text-gray-900 font-display leading-tight flex-1">
                    {faqs[selectedFaq].question}
                  </h3>
                  <button 
                    onClick={() => setSelectedFaq(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="px-5 py-4 md:px-6 md:py-5 overflow-y-auto leading-relaxed text-gray-600 text-lg">
                  {faqs[selectedFaq].answer}
                </div>
                
                <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-100 md:rounded-b-3xl shrink-0">
                  <button
                    onClick={() => setSelectedFaq(null)}
                    className="w-full py-3.5 bg-brand-red text-white font-semibold rounded-xl hover:bg-brand-red-dark transition-colors shadow-sm"
                  >
                    Mengerti
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobileSheetOpen && (
          <div className="md:hidden fixed inset-0 z-[100] flex items-end justify-center bg-gray-900/60 backdrop-blur-sm" onClick={() => { setIsMobileSheetOpen(false); setSelectedFaq(null); }}>
             <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full bg-white rounded-t-3xl flex flex-col max-h-[85vh] relative pb-[max(2rem,env(safe-area-inset-bottom))]"
             >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2 shrink-0" />
                
                {selectedFaq === null ? (
                  // List of FAQ
                  <>
                    <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-xl text-gray-900 font-display">Daftar Pertanyaan</h3>
                      <button onClick={() => { setIsMobileSheetOpen(false); }} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex flex-col gap-3">
                      {faqs.map((faq, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedFaq(index)}
                          className="text-left bg-white border border-gray-100 hover:border-brand-red/50 active:bg-gray-50 p-4 rounded-2xl flex items-center justify-between gap-4 transition-colors"
                        >
                          <span className="font-semibold text-gray-800 flex-1">{faq.question}</span>
                          <ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  // FAQ Details
                  <>
                    <div className="px-5 pb-3 border-b border-gray-100 flex items-start gap-4 shrink-0">
                      <button onClick={() => setSelectedFaq(null)} className="p-2 bg-gray-100 text-gray-600 rounded-full mt-1 shrink-0 hover:bg-gray-200 transition-colors">
                        <ArrowLeft size={18} />
                      </button>
                      <h3 className="font-bold text-lg text-gray-900 font-display flex-1 leading-snug pt-1.5">{faqs[selectedFaq].question}</h3>
                    </div>
                    <div className="px-5 py-4 overflow-y-auto leading-relaxed text-gray-600 text-base">
                      {faqs[selectedFaq].answer}
                    </div>
                  </>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
