import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import UserDatabase from './pages/UserDatabase';
import Logs from './pages/Logs';
import KVData from './pages/KVData';
import Calculator from './pages/Calculator';
import Finance from './pages/Finance';
import Dashboard from './pages/Dashboard';
import AdminPopupBanner from './components/AdminPopupBanner';
import InstallPWA from '../pages/InstallPWA';
import { Database, Activity, FileJson, LogOut, Menu as MenuIcon, X, Home, Info, Phone, ShoppingBag, FileText, Calculator as CalculatorIcon, Wallet, ChevronDown, LayoutDashboard } from 'lucide-react';

export default function AdminApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [kvKeys, setKvKeys] = useState<string[]>([]);
  const [openGroup, setOpenGroup] = useState({
    db: true,
    finance: true,
    website: true
  });

  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "/gambar/logo.png"
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Change manifest and theme color for Admin PWA
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      manifestLink.setAttribute('href', '/admin-manifest.json');
    }
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
      themeColor.setAttribute('content', '#111827');
    }
    
    return () => {
      // Restore main manifest when leaving admin
      const manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.setAttribute('href', '/manifest.json');
      }
      const themeColor = document.querySelector('meta[name="theme-color"]');
      if (themeColor) {
        themeColor.setAttribute('content', '#e11d48');
      }
    };
  }, []);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data) {
          setKvKeys(Object.keys(data).filter(k => !['id', '_id'].includes(k.toLowerCase())));
          if (data.info_web) setInfoWeb(data.info_web);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    sessionStorage.removeItem('admin_email_temp');
    navigate('/'); // Back to home
  };

  const getIconForKey = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('beranda')) return Home;
    if (k.includes('info') || k.includes('alamat') || k.includes('bahan')) return Info;
    if (k.includes('kontak') || k.includes('telepon')) return Phone;
    if (k.includes('produk') || k.includes('menu')) return ShoppingBag;
    return FileText;
  };

  const getLabelForKey = (key: string) => {
    if (key === 'informasi_bahan_baku_dan_operasional') {
      return 'Bahan Baku & Operasional';
    }
    return key.replace(/_/g, ' ');
  };

  if (location.pathname === '/admin/install') {
    return <InstallPWA isAdmin={true} />;
  }

  // Derive active tab from location
  let activeTab = location.pathname.split('/')[2] || 'dashboard';
  if (activeTab === 'kv') {
    activeTab = 'kv:' + (location.pathname.split('/')[3] || '');
  }

  const navigateTo = (tab: string) => {
    setIsSidebarOpen(false);
    if (tab.startsWith('kv:')) {
      navigate(`/admin/kv/${tab.replace('kv:', '')}`);
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-50 flex font-sans text-gray-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-xl`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
          <div className="font-display font-black text-xl tracking-tight flex items-center gap-2 text-gray-900">
            <img src={infoWeb.logo} alt="Logo" className="h-8 w-auto object-contain" />
            Admin
          </div>
          <button className="lg:hidden text-gray-400 hover:text-gray-900 transition-colors" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {/* Ringkasan */}
          <div className="mb-4">
            <button
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === 'dashboard' ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              <span>Ringkasan Dasbor</span>
            </button>
          </div>

          {/* Database Pengguna */}
          <div className="mb-4">
            <button
              onClick={() => setOpenGroup(p => ({...p, db: !p.db}))}
              className="w-full flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 hover:text-gray-900 transition-colors"
            >
              <span>Database Pengguna</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${openGroup.db ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 mt-1 overflow-hidden transition-all ${openGroup.db ? 'max-h-96' : 'max-h-0'}`}>
              <button
                onClick={() => navigateTo('users')}
                className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'users' ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Database className="w-4 h-4 shrink-0" />
                <span>Basis Data Pengguna</span>
              </button>
              
              <button
                onClick={() => navigateTo('logs')}
                className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'logs' ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Log Aktivitas</span>
              </button>
            </div>
          </div>

          {/* Alat Keuangan */}
          <div className="mb-4">
            <button
              onClick={() => setOpenGroup(p => ({...p, finance: !p.finance}))}
              className="w-full flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 hover:text-gray-900 transition-colors"
            >
              <span>Alat Keuangan</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${openGroup.finance ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 mt-1 overflow-hidden transition-all ${openGroup.finance ? 'max-h-96' : 'max-h-0'}`}>
              <button
                onClick={() => navigateTo('calculator')}
                className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'calculator' ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <CalculatorIcon className="w-4 h-4 shrink-0" />
                <span>Kalkulator HPP</span>
              </button>
              
              <button
                onClick={() => navigateTo('finance')}
                className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === 'finance' ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <Wallet className="w-4 h-4 shrink-0" />
                <span>Catatan Keuangan</span>
              </button>
            </div>
          </div>

          {/* Tampilan Website */}
          <div className="mb-4">
            <button
              onClick={() => setOpenGroup(p => ({...p, website: !p.website}))}
              className="w-full flex items-center justify-between gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 py-1.5 hover:text-gray-900 transition-colors"
            >
              <span>Tampilan Website</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${openGroup.website ? '' : '-rotate-90'}`} />
            </button>
            <div className={`space-y-1 mt-1 overflow-hidden transition-all ${openGroup.website ? 'max-h-screen' : 'max-h-0'}`}>
              {kvKeys.map(key => {
                const Icon = getIconForKey(key);
                return (
                  <button
                    key={key}
                    onClick={() => navigateTo(`kv:${key}`)}
                    className={`w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === `kv:${key}` ? 'bg-red-50 text-brand-red shadow-sm' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{getLabelForKey(key)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-start text-left gap-3 px-3 py-2 rounded-lg text-sm font-medium text-brand-red hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="flex items-center">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-900 mr-4"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {activeTab === 'dashboard' ? 'Ringkasan Dasbor' :
               activeTab === 'users' ? 'Basis Data Pengguna' : 
               activeTab === 'logs' ? 'Log Aktivitas' : 
               activeTab === 'calculator' ? 'Kalkulator HPP' :
               activeTab === 'finance' ? 'Catatan Keuangan' :
               activeTab.startsWith('kv:') ? `${getLabelForKey(activeTab.replace('kv:', ''))}` : 
               activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>
          <div id="header-actions" className="flex items-center gap-2"></div>
        </header>
        
        <div id="main-scroll-container" className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="w-full flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserDatabase />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/kv/:key" element={<KVDataWrapper />} />
            </Routes>
          </div>
        </div>
      </main>
      <AdminPopupBanner />
    </div>
  );
}

function KVDataWrapper() {
  const location = useLocation();
  const key = location.pathname.split('/').pop() || '';
  return <KVData selectedKey={key} />;
}
