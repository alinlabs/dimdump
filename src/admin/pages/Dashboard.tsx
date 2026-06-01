import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Home, ShoppingBag, Info, Heart, Smartphone, Share2, Utensils, LayoutDashboard, ShieldQuestion, FileText, Settings } from 'lucide-react';

const links = [
  { id: 'home', title: 'Beranda Utama', path: '/', icon: Home, desc: 'Halaman utama DimDump' },
  { id: 'about', title: 'Tentang Kami', path: '/tentang', icon: Info, desc: 'Informasi tentang DimDump' },
  { id: 'link', title: 'Link Tree', path: '/link', icon: Share2, desc: 'Kumpulan tautan sosial & navigasi' },
  { id: 'info', title: 'Informasi Proyek', path: '/info', icon: FileText, desc: 'Nilai bisnis & teknologi aplikasi' },
  { id: 'install', title: 'Install Aplikasi', path: '/install', icon: Smartphone, desc: 'Hapus instalasi & setup PWA' },
];

export default function Dashboard() {
  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "/gambar/logo.png"
  });

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
      handleCopy(title, path);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="text-center mb-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-md shrink-0 overflow-hidden border-4 border-gray-50">
          <img src={infoWeb.logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-2xl font-display font-black text-gray-900">{infoWeb.nama} - Semua Tautan</h2>
        <p className="text-gray-500 mt-2 text-sm">Akses cepat ke seluruh halaman yang ada dalam platform ini.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((link, idx) => {
          const Icon = link.icon;
          return (
            <motion.a
              key={link.id}
              href={link.path}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md hover:border-brand-red/30 hover:bg-white transition-all group flex items-center justify-between gap-4 cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-brand-red shrink-0 group-hover:bg-brand-yellow group-hover:text-brand-red-dark transition-colors">
                  <Icon size={20} />
                </div>
                <div className="flex-grow min-w-0 flex flex-col">
                  <h3 className="font-bold text-sm text-gray-900 truncate">{link.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{link.desc}</p>
                </div>
              </div>
              
              <div className="flex items-center shrink-0">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleShare(link.title, link.path);
                  }}
                  className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
                  title="Bagikan Link"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
