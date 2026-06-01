import { ShoppingBag, Menu as MenuIcon, X, Lock, Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({ 
  qty = 0, 
  onCheckout,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isMusicPlaying = false,
  isMusicMuted = false,
  toggleMusic
}: { 
  qty?: number, 
  onCheckout?: () => void,
  isMobileMenuOpen: boolean,
  setIsMobileMenuOpen: (open: boolean) => void,
  isMusicPlaying?: boolean,
  isMusicMuted?: boolean,
  toggleMusic?: () => void
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "/gambar/logo.png"
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.info_web) setInfoWeb(data.info_web);
      })
      .catch(err => console.error("Failed to load info_web:", err));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
      
      const themeMeta = document.getElementById('theme-color-meta');
      if (themeMeta) {
        if (location.pathname === '/') {
          themeMeta.setAttribute('content', scrolled ? '#ffffff' : '#e11d48');
        } else {
          themeMeta.setAttribute('content', '#ffffff');
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = (
    <>
      <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="font-medium text-left transition-colors hover:text-brand-red">Beranda</button>
      <button onClick={() => handleScrollTo('menu')} className="font-medium text-left transition-colors hover:text-brand-red">Produk</button>
      <button onClick={() => { setIsMobileMenuOpen(false); navigate('/tentang'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="font-medium text-left transition-colors hover:text-brand-red">Tentang Kami</button>
    </>
  );

  const isLinkTree = location.pathname === '/link';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white shadow-md py-4 md:py-5' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-12">
          <div className={`font-display font-black text-2xl tracking-tight flex items-center gap-3 cursor-pointer ${isScrolled || location.pathname !== '/' ? 'text-brand-red' : 'text-white'}`} onClick={() => navigate('/')}>
            <img src={infoWeb.logo} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            <span className="pt-1">{infoWeb.nama}</span>
          </div>
          {!isLinkTree && (
            <>
              <nav className="hidden md:flex items-center gap-8 font-medium">
                <button onClick={() => { navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={`${isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-brand-red' : 'text-white/80 hover:text-white'} transition-colors mt-1`}>Beranda</button>
                <button onClick={() => handleScrollTo('menu')} className={`${isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-brand-red' : 'text-white/80 hover:text-white'} transition-colors mt-1`}>Produk</button>
                <button onClick={() => { navigate('/tentang'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className={`${isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-brand-red' : 'text-white/80 hover:text-white'} transition-colors mt-1`}>Tentang Kami</button>
              </nav>
              <div className="flex items-center gap-2 md:gap-3">
                <button 
                  onClick={onCheckout}
                  className={`relative p-2 rounded-full transition-colors ${isScrolled || location.pathname !== '/' ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                  title="Keranjang"
                >
                  <ShoppingBag size={24} />
                  {qty > 0 && (
                    <span className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${isScrolled || location.pathname !== '/' ? 'bg-brand-red text-white border-white' : 'bg-brand-yellow text-brand-red-dark border-transparent'}`}>
                      {qty}
                    </span>
                  )}
                </button>

                <button 
                  onClick={toggleMusic}
                  className={`hidden md:flex relative p-2 rounded-full transition-colors ${isScrolled || location.pathname !== '/' ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                  title={isMusicMuted || !isMusicPlaying ? "Bunyikan Musik" : "Matikan Musik"}
                >
                  {isMusicMuted || !isMusicPlaying ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>

                <button 
                  onClick={() => navigate('/login')}
                  className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 text-xs tracking-wide border-2 ${isScrolled || location.pathname !== '/' ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-white/30 text-white hover:bg-white/10'}`}
                  title="Admin Panel"
                >
                  <Lock size={14} />
                  <span>Admin Panel</span>
                </button>

                <button className={`md:hidden p-2 rounded-full transition-colors ${isScrolled || location.pathname !== '/' ? 'text-gray-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`} onClick={() => setIsMobileMenuOpen(true)}>
                  <MenuIcon size={24} />
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 z-[100] md:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100 || velocity.x > 500) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-[110] md:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="font-display font-black text-xl md:text-2xl tracking-tight flex items-center gap-3 text-brand-red">
                  <img src={infoWeb.logo} alt="Logo" className="h-10 w-auto object-contain" />
                  <span className="pt-1">{infoWeb.nama}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      if (onCheckout) onCheckout();
                    }}
                    className="relative p-2 text-brand-red bg-red-50 hover:bg-brand-red hover:text-white rounded-full transition-colors"
                  >
                    <ShoppingBag size={20} />
                    {qty > 0 && (
                      <span className="absolute -top-1 -right-1 bg-brand-yellow text-brand-red-dark text-[10px] font-black min-w-[20px] h-[20px] flex items-center justify-center rounded-full border border-white">
                        {qty}
                      </span>
                    )}
                  </button>
                  <button 
                    onClick={toggleMusic}
                    className="relative p-2 text-brand-red bg-red-50 hover:bg-brand-red hover:text-white rounded-full transition-colors"
                    title={isMusicMuted || !isMusicPlaying ? "Bunyikan Musik" : "Matikan Musik"}
                  >
                    {isMusicMuted || !isMusicPlaying ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </div>
              <nav className="flex flex-col gap-2 px-4 py-6 text-gray-800">
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="font-bold text-lg text-left px-4 py-3 rounded-xl transition-colors hover:bg-gray-50 hover:text-brand-red">Beranda</button>
                <button onClick={() => handleScrollTo('menu')} className="font-bold text-lg text-left px-4 py-3 rounded-xl transition-colors hover:bg-gray-50 hover:text-brand-red">Produk</button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate('/tentang'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="font-bold text-lg text-left px-4 py-3 rounded-xl transition-colors hover:bg-gray-50 hover:text-brand-red">Tentang Kami</button>
              </nav>
              <div className="mt-auto p-6 border-t border-gray-100">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold bg-brand-red text-white hover:bg-brand-red-dark transition-colors shadow-lg shadow-brand-red/20"
                >
                  <Lock size={20} />
                  <span>Admin Panel</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
