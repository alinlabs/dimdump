import { useState } from 'react';
import { ArrowLeft, ShieldCheck, Globe, ArrowUpRight } from 'lucide-react';
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import InfoTabs from '../info/components/InfoTabs';
import InfoSection from '../info/components/InfoSection';
import InfoDetailModal from '../info/components/InfoDetailModal';
import BusinessValueModal from '../info/components/BusinessValueModal';
import CaraPembuatanTimeline from '../info/components/CaraPembuatanTimeline';
import { technologies, features, strategies, sources, caraPembuatan, InfoItem } from '../info/data/infoData';

export default function Info() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<InfoItem | null>(null);
  const [showBusinessValueModal, setShowBusinessValueModal] = useState(false);

  const isValidSection = ['sumber', 'teknologi', 'fitur', 'strategi', 'cara'].includes(section || '');
  if (!isValidSection) {
    return <Navigate to="/info/sumber" replace />;
  }

  const activeTab: 'sources' | 'tech' | 'features' | 'strategies' | 'cara' = 
    section === 'sumber' ? 'sources' :
    section === 'teknologi' ? 'tech' : 
    section === 'fitur' ? 'features' : 
    section === 'strategi' ? 'strategies' :
    'cara';

  const handleTabChange = (tabId: 'sources' | 'tech' | 'features' | 'strategies' | 'cara') => {
    const sectionPath = tabId === 'sources' ? 'sumber' : tabId === 'tech' ? 'teknologi' : tabId === 'features' ? 'fitur' : tabId === 'strategies' ? 'strategi' : 'cara';
    navigate(`/info/${sectionPath}`);
  };

  const getActiveData = () => {
    switch(activeTab) {
      case 'sources': return sources;
      case 'tech': return technologies;
      case 'features': return features;
      case 'strategies': return strategies;
      case 'cara': return caraPembuatan;
      default: return sources;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-brand-yellow selection:text-brand-red-dark">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-start gap-4">
          <Link to="/" className="flex items-center justify-center text-gray-500 hover:text-brand-red transition-colors p-2 -ml-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="font-display font-bold text-xl tracking-tight text-gray-900">
            Dim<span className="text-brand-red">Dump</span> Info
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Intro */}
        <section className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-red/10 text-brand-red mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-gray-900">
            Dokumentasi Sistem
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-4">
            Penjelasan transparan mengenai teknologi, fitur andalan, dan taktik modern pada ekosistem website DimDump.
          </p>
        </section>

        {/* Tabs */}
        <InfoTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content Section */}
        <div className="mt-8">
          {activeTab === 'cara' ? (
            <CaraPembuatanTimeline 
              items={getActiveData()} 
              onItemClick={setSelectedItem}
            />
          ) : (
            <InfoSection 
              items={getActiveData()} 
              onItemClick={setSelectedItem}
            />
          )}
        </div>

        {/* Business Value */}
        <button 
          onClick={() => setShowBusinessValueModal(true)}
          className="w-full text-left bg-gradient-to-br from-brand-red to-brand-red-dark rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden mt-16 group hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-red/30 focus:ring-offset-2"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Globe className="w-48 h-48" />
          </div>
          <div className="relative z-10 max-w-3xl">
            <div className="flex justify-between items-start mb-4">
              <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white/20 text-white font-semibold text-sm">Studi Kasus Bisnis</div>
              <ArrowUpRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-3xl font-bold mb-4 font-display">Berdasarkan Nilai Bisnis</h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Mengapa menggunakan website sedetail ini untuk standar UMKM kami?
            </p>
          </div>
        </button>
      </main>

      {/* Modal / Bottom Sheet */}
      <InfoDetailModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
      <BusinessValueModal 
        isOpen={showBusinessValueModal} 
        onClose={() => setShowBusinessValueModal(false)} 
      />
    </div>
  );
}
