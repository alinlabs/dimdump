import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check } from 'lucide-react';
import { InfoItem } from '../data/infoData';
import { useEffect, useState } from 'react';

interface Props {
  item: InfoItem | null;
  onClose: () => void;
}

export default function InfoDetailModal({ item, onClose }: Props) {
  useEffect(() => {
    if (item !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  const [copied, setCopied] = useState(false);

  const handleCopy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AnimatePresence>
      {item && (
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
              className="w-full bg-white rounded-t-3xl md:rounded-3xl md:max-w-md shadow-2xl pointer-events-auto flex flex-col max-h-[85vh] pb-[max(0px,env(safe-area-inset-bottom))]"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white md:rounded-t-3xl rounded-t-3xl shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.colorClass}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 font-display leading-tight">{item.title}</h3>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-5 py-4 md:px-6 md:py-6 overflow-y-auto flex-1 min-h-0">
                <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider rounded-lg mb-4">
                  {item.category}
                </div>
                <p className="leading-relaxed text-gray-600 md:text-lg whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
              
              <div className="p-5 md:p-6 bg-gray-50 border-t border-gray-100 md:rounded-b-3xl shrink-0 mt-auto flex flex-col gap-3">
                {item.link ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 hover:text-brand-red transition-colors truncate mr-3 pl-1 flex-1">
                        {item.link}
                      </a>
                      <button
                        onClick={() => handleCopy(item.link || '')}
                        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors shrink-0 shadow-sm border border-gray-100"
                      >
                        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      Lihat Sumber
                    </a>
                  </>
                ) : (
                  <button
                    onClick={onClose}
                    className="w-full py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                  >
                    Mengerti
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
