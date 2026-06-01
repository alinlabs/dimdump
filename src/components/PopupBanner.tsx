import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PopupBanner({ onCloseProp }: { onCloseProp?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState({ mobile: [] as string[], desktop: [] as string[] });
  const { isInstallable, installPWA } = usePWAInstall();

  useEffect(() => {
    if (sessionStorage.getItem('popupShown')) {
      if (onCloseProp) onCloseProp();
      return;
    }

    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && data[0] && data[0].popup) {
          const popupConfig = data[0].popup;
          setImages({
            mobile: popupConfig.gambar_mobile || [],
            desktop: popupConfig.gambar_desktop || []
          });
          if (popupConfig.gambar_mobile && popupConfig.gambar_mobile.length > 0) {
            setCurrentIndex(Math.floor(Math.random() * popupConfig.gambar_mobile.length));
          }
        }
      })
      .catch(err => console.error("Error fetching popup data", err));

    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem('popupShown', 'true');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Make body unscrollable when popup is open
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

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseProp) onCloseProp();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <motion.div 
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-[85vw] sm:max-w-[400px] md:max-w-[650px] lg:max-w-[800px] bg-transparent rounded-2xl overflow-hidden flex flex-col shadow-2xl"
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white text-gray-900 rounded-full transition-colors drop-shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative w-full flex flex-col items-center justify-center overflow-hidden group bg-transparent">
          {(images.mobile.length > 0 || images.desktop.length > 0) && (
            <picture className="w-full block">
              {images.desktop.length > 0 && <source media="(min-width: 768px)" srcSet={images.desktop[currentIndex]} />}
              {images.mobile.length > 0 && (
                <img
                  src={images.mobile[currentIndex]}
                  alt={`Promo ${currentIndex + 1}`}
                  className="w-full h-auto max-h-[75vh] md:max-h-[85vh] aspect-[4/5] md:aspect-[4/3] object-contain sm:object-cover block"
                  onError={(e) => {
                    // Fallback style if image isn't available
                    (e.target as HTMLImageElement).src = `https://placehold.co/800x1000/e11d48/ffffff?text=Promo+${currentIndex + 1}`;
                  }}
                />
              )}
            </picture>
          )}
          {isInstallable && (
            <div className="w-full bg-white p-3 flex justify-center border-t border-gray-100">
              <button 
                onClick={installPWA}
                className="flex items-center gap-2 text-brand-red font-medium hover:text-brand-red-dark transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Install Apps DimDump</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
