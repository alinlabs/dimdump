import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Flame, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function Hero() {
  const [heroData, setHeroData] = useState({
    lencana: "Spesial Dimsum Goreng",
    judul_1: "Garing di Luar,",
    judul_2: "Lembut di Dalam.",
    deskripsi: "DimDump menghadirkan inovasi Dimsum Goreng dengan perpaduan rasa autentik dan kerenyahan yang bikin nagih. Asli buatan mahasiswa!",
    gambar: [
      "/gambar/produk1.webp",
      "/gambar/produk2.webp",
      "/gambar/produk3.webp",
      "/gambar/produk4.webp",
      "/gambar/produk5.webp"
    ],
    rating: "5.0",
    rating_maksimal: "5.0",
    label_rating: "Rating Rasa"
  });

  const [foregroundImage, setForegroundImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImageViewer = (img: string) => setSelectedImage(img);
  const closeImageViewer = () => setSelectedImage(null);

  useEffect(() => {
    if (selectedImage) {
      document.body.classList.add('image-viewer-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('image-viewer-open');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.classList.remove('image-viewer-open');
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage]);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.beranda?.hero) {
          // Normalize to array if somehow string is returned
          let updatedHero = { ...data.beranda.hero };
          if (!Array.isArray(updatedHero.gambar)) {
            updatedHero.gambar = [updatedHero.gambar];
          }
          setHeroData(updatedHero);
        }
      } catch (err) {
        console.error("Failed to load hero data:", err);
      }
    };
    
    fetchHeroData();
  }, []);

  useEffect(() => {
    if (Array.isArray(heroData.gambar) && heroData.gambar.length > 0) {
      const availableImages = [...heroData.gambar];
      
      const fgIndex = Math.floor(Math.random() * availableImages.length);
      const fgImage = availableImages[fgIndex];
      
      let bgImage = fgImage;
      if (availableImages.length > 1) {
        availableImages.splice(fgIndex, 1);
        const bgIndex = Math.floor(Math.random() * availableImages.length);
        bgImage = availableImages[bgIndex];
      }
      
      setForegroundImage(fgImage);
      setBackgroundImage(bgImage);
    } else if (typeof heroData.gambar === 'string') {
      setForegroundImage(heroData.gambar);
      setBackgroundImage(heroData.gambar);
    }
  }, [heroData.gambar]);

  return (
    <section id="home" className="relative pt-24 pb-8 md:pt-48 md:pb-32 overflow-hidden bg-gradient-to-br from-brand-red via-brand-red-dark to-brand-red bg-[size:200%_200%] animate-gradient">
      {/* Dynamic Background Decorations */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 md:w-96 md:h-96 rounded-full border-[20px] md:border-[40px] border-white/10 blur-xl animate-[pulse_6s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 md:w-48 md:h-48 rounded-full bg-brand-yellow/60 blur-3xl opacity-50 animate-[pulse_4s_ease-in-out_infinite]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[50%] bg-gradient-to-t from-transparent via-white/5 to-transparent skew-y-12 blur-2xl"></div>

      {/* Desktop Background Image with Gradient */}
      <div 
        className="hidden md:block absolute inset-0 pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url('${backgroundImage || (Array.isArray(heroData.gambar) ? heroData.gambar[0] : heroData.gambar)}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.5,
          maskImage: 'linear-gradient(to right, transparent 50%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 50%, black 100%)'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-center text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center md:items-start min-w-0 w-full"
          >
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white font-medium text-xs md:text-sm mb-4 md:mb-6">
              <Flame size={14} className="text-brand-yellow md:w-4 md:h-4" />
              <span>{heroData.lencana}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white leading-[1.1] mb-2 md:mb-6">
              {heroData.judul_1} <br />
              <span className="text-brand-yellow">{heroData.judul_2}</span>
            </h1>
            <p className="text-white/90 text-base md:text-xl mb-2 md:mb-8 max-w-lg">
              {heroData.deskripsi}
            </p>
            <div className="hidden md:flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start">
              <a href="#menu" className="bg-brand-yellow text-brand-red-dark px-6 py-3 md:px-8 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-white transition-colors flex items-center gap-2">
                Lihat Menu
                <ArrowRight size={18} className="md:w-5 md:h-5" />
              </a>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative -mt-4 md:mt-0 px-4 md:px-0 min-w-0 w-full"
          >
            <div className="hidden md:block aspect-square rounded-full bg-brand-yellow absolute -inset-4 blur-2xl opacity-40 animate-pulse"></div>
            
            {/* Desktop Image */}
            <div className="hidden md:block relative z-10">
              <img 
                src={foregroundImage || (Array.isArray(heroData.gambar) ? heroData.gambar[0] : heroData.gambar)} 
                alt="Dimsum Goreng Krispi" 
                onClick={() => openImageViewer(foregroundImage || (Array.isArray(heroData.gambar) ? heroData.gambar[0] : heroData.gambar))}
                className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer"
              />
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-4 z-20"
              >
                 <div className="bg-brand-red/10 text-brand-red p-3 rounded-2xl">
                   <Flame size={20} className="w-6 h-6" />
                 </div>
                 <div className="text-left">
                   <div className="text-xs text-gray-500 font-medium">{heroData.label_rating}</div>
                   <div className="font-display font-bold text-xl text-gray-900">{heroData.rating} / {heroData.rating_maksimal}</div>
                 </div>
              </motion.div>
            </div>

            {/* Mobile Marquee */}
            <div className="md:hidden w-[calc(100%+2rem)] -ml-4 overflow-hidden py-6 relative flex items-center bg-transparent">
                {[...Array(2)].map((_, groupIdx) => {
                  const mobileImages = Array.isArray(heroData.gambar) && heroData.gambar.length > 0 ? heroData.gambar : (typeof heroData.gambar === 'string' ? [heroData.gambar] : ["/gambar/produk1.webp"]);
                  return (
                    <div key={groupIdx} className="flex shrink-0 animate-[marquee_20s_linear_infinite] min-w-max gap-4 pr-4">
                      {mobileImages.map((imgSrc, i) => (
                        <div 
                          key={`${groupIdx}-${i}`} 
                          className={`shrink-0 ${i % 2 === 0 ? 'rotate-3 -translate-y-2' : '-rotate-3 translate-y-2'}`}
                        >
                          <img 
                            src={imgSrc} 
                            alt="Dimsum Goreng Krispi" 
                            loading="eager"
                            onClick={() => openImageViewer(imgSrc)}
                            className="w-[160px] h-[160px] object-cover rounded-3xl shadow-xl cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Image Viewer Modal / Bottom Sheet */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {selectedImage && (
            <div className="fixed inset-0 z-[150] pointer-events-none flex flex-col md:items-center justify-end md:justify-center">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeImageViewer}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
              />
              
              {/* Desktop Modal & Mobile Bottom Sheet */}
              <motion.div
                initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative z-10 w-full md:w-auto flex flex-col md:items-center justify-end md:justify-center pointer-events-none"
              >
                <div className="bg-white pointer-events-auto rounded-t-[2rem] md:rounded-3xl w-full md:w-auto md:max-w-3xl overflow-visible shadow-2xl relative">
                  {/* Solid extension to cover the gap pushed up by iOS Safari keyboard / bounce */}
                  <div className="absolute top-full -mt-1 left-0 right-0 h-[100vh] bg-white md:hidden block pointer-events-none -z-10" />

                  <button 
                    onClick={closeImageViewer}
                    className="absolute top-4 right-4 z-20 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 backdrop-blur-md transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <img 
                    src={selectedImage} 
                    alt="Detail Dimsum" 
                    className="w-full aspect-square md:aspect-auto md:max-h-[80vh] md:max-w-screen-md object-cover relative z-10 rounded-t-[2rem] md:rounded-3xl" 
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
