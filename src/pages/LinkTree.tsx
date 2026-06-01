import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, ShoppingBag, Info, ShieldQuestion, Heart, Smartphone, Share2, Utensils } from 'lucide-react';

const links = [
  { id: 'home', title: 'Beranda Utama', path: '/', icon: Home, desc: 'Halaman utama DimDump' },
  { id: 'menu', title: 'Menu Dimsum', path: '/#menu', icon: Utensils, desc: 'Lihat pilihan menu spesial kami' },
  { id: 'checkout', title: 'Pesan Sekarang', path: '/checkout', icon: ShoppingBag, desc: 'Langsung ke halaman checkout' },
  { id: 'about', title: 'Tentang Kami', path: '/tentang', icon: Info, desc: 'Kenali DimDump lebih dekat' },
  { id: 'testimoni', title: 'Kata Mereka', path: '/#testimoni', icon: Heart, desc: 'Baca testimoni pelanggan setia' },
  { id: 'faq', title: 'FAQ', path: '/#faq', icon: ShieldQuestion, desc: 'Pertanyaan seputar DimDump' },
  { id: 'install', title: 'Install Aplikasi', path: '/install', icon: Smartphone, desc: 'Install DimDump di perangkatmu' },
];

export default function LinkTree() {
  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "/gambar/logo.png"
  });
  const navigate = useNavigate();

  const handleHomeClick = () => {
    sessionStorage.setItem('popupShown', 'true');
    navigate('/');
  };

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.info_web) setInfoWeb(data.info_web);
      })
      .catch(err => console.error("Failed to load info_web:", err));
  }, []);

  const getFullUrl = (path: string) => {
    return `${window.location.origin}${path}`;
  };

  const handleCopy = async (id: string, path: string) => {
    try {
      await navigator.clipboard.writeText(getFullUrl(path));
      alert('Tautan disalin ke papan klip!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleShare = async (title: string, path: string) => {
    const url = getFullUrl(path);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `DimDump - ${title}`,
          text: `Cek ${title} di DimDump!`,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy if share API not supported
      handleCopy(title, path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto pt-20">
        <div className="text-center mb-10 md:mb-16 flex flex-col items-center">
          <button onClick={handleHomeClick} className="group flex flex-col items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red rounded-xl p-2 -m-2 mb-2">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shrink-0 overflow-hidden border-4 border-gray-100 group-hover:scale-105 transition-all group-hover:border-brand-red/30">
              <img src={infoWeb.logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-display font-black text-gray-900 group-hover:text-brand-red transition-colors">{infoWeb.nama} Links</h1>
          </button>
          <p className="text-gray-600 mt-2">Semua tautan penting {infoWeb.nama} dalam satu tempat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {links.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.id}
                href={link.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-red/30 transition-all group flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <div className="w-12 h-12 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-brand-red shrink-0">
                    <Icon size={24} />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">{link.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{link.desc}</p>
                  </div>
                </div>
                
                <div className="flex items-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleShare(link.title, link.path);
                    }}
                    className="p-3 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                    title="Bagikan Link"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
