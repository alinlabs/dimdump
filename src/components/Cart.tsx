import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartProps {
  qty: number;
  setQty: (qty: number | ((prev: number) => number)) => void;
  onCheckout: () => void;
  isVisible?: boolean;
}

export default function Cart({ qty, setQty, onCheckout, isVisible }: CartProps) {
  const paketCount = Math.floor(qty / 3);
  const satuanCount = qty % 3;
  const totalPrice = (paketCount * 13000) + (satuanCount * 5000);

  return (
    <AnimatePresence>
      {qty > 0 && isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-[40] pb-[env(safe-area-inset-bottom)] md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-white md:rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl p-3 md:p-6 border-t md:border border-gray-100 pointer-events-auto flex flex-row items-center justify-between gap-2 md:gap-8">
            
            <div className="flex items-center gap-3 w-auto md:flex-grow">
               <div className="hidden sm:flex w-12 h-12 rounded-full bg-brand-red/10 items-center justify-center text-brand-red shrink-0">
                 <ShoppingCart size={24} />
               </div>
               <div className="flex flex-col">
                 <h4 className="hidden md:block font-bold text-gray-900 leading-tight">Keranjang Anda</h4>
                 <div className="flex sm:hidden items-center gap-1.5 text-brand-red mb-0.5">
                   <ShoppingCart size={16} />
                   <span className="font-bold text-sm">Pesanan</span>
                 </div>
                 <p className="text-xs md:text-sm text-gray-500 font-medium">
                   {paketCount > 0 && `${paketCount} Pkt`}
                   {paketCount > 0 && satuanCount > 0 && ' + '}
                   {satuanCount > 0 && `${satuanCount} Pcs`}
                 </p>
               </div>
            </div>

            {/* Mobile / Desktop Selector integrated */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 md:p-1.5 rounded-xl border border-gray-100 mx-auto md:mx-0">
              <button 
                onClick={() => setQty(prev => Math.max(0, prev - 1))}
                className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-white text-gray-600 shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Minus size={16} />
              </button>
              <span className="w-5 md:w-6 text-center font-bold text-sm md:text-base text-gray-900">{qty}</span>
              <button 
                onClick={() => setQty(prev => prev + 1)}
                className="w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-white text-brand-red shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex flex-row items-center justify-end gap-3 md:gap-6">
               <div className="text-right flex flex-col justify-end">
                 <div className="hidden md:block text-[10px] md:text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Total Akhir</div>
                 <div className="flex flex-col items-end justify-center leading-none">
                   {qty * 5000 > totalPrice && (
                     <span className="text-[10px] md:text-xs text-brand-red opacity-60 line-through mb-0.5">
                       Rp {(qty * 5000).toLocaleString('id-ID')}
                     </span>
                   )}
                   <span className="font-display font-black text-base md:text-xl text-brand-red leading-none">
                     Rp {totalPrice.toLocaleString('id-ID')}
                   </span>
                 </div>
               </div>
               
               <button onClick={onCheckout} className="bg-brand-red text-white py-2 md:py-3.5 px-3 md:px-6 rounded-lg md:rounded-xl font-bold flex items-center gap-1 md:gap-2 hover:bg-brand-red-dark transition-all shrink-0 text-sm md:text-base">
                 <span className="hidden sm:inline">Checkout</span>
                 <ArrowRight size={16} className="md:w-5 md:h-5" />
               </button>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
