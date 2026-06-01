import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Phone, Hash, Trash2, RefreshCw, X, ChevronLeft, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'motion/react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon issue natively
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapBounds({ users }: { users: any[] }) {
  const map = useMap();
  useEffect(() => {
    const mappedUsers = users.filter((u) => u.lat && u.lng);
    if (mappedUsers.length > 0) {
      const bounds = L.latLngBounds(mappedUsers.map((u) => [parseFloat(u.lat), parseFloat(u.lng)]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, users]);
  return null;
}

export default function UserDatabase() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isGlobalMapActive, setIsGlobalMapActive] = useState(false);
  const [isModalMapActive, setIsModalMapActive] = useState(false);

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/db');
      const data = await res.json();
      setUsers(data?.database_user || []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      interval = setInterval(() => fetchUsers(true), 3000); // Poll every 3 seconds for realtime feel
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchUsers]);

  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (selectedUser && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      if (mainScroll) mainScroll.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    };
  }, [selectedUser]);

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini? Semua datanya akan dihapus permanen.')) return;
    try {
      setUsers(prev => prev.filter(u => u.device_id !== deviceId)); // Optimistic UI update
      const res = await fetch(`/api/admin/users/${deviceId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus pengguna.');
      fetchUsers(true); // Re-fetch to sync if failed
    }
  };

  const filteredUsers = users.filter(u => 
    (u.nama_lengkap || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.device_id || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.nomor_telepon || '').includes(search)
  );

  const headerActionsEl = document.getElementById('header-actions');

  return (
    <div className="space-y-6 relative h-full w-full flex flex-col flex-1">
      {headerActionsEl && createPortal(
        <div className="flex items-center gap-2">
          {!selectedUser ? (
            <>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors sm:w-auto justify-center sm:justify-start ${autoRefresh ? 'bg-brand-red/10 text-brand-red' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh || isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{autoRefresh ? 'Live Sync Aktif' : 'Live Sync Mati'}</span>
              </button>
              <div className="relative w-full md:w-64 shrink-0 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari pengguna..."
                  className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="hidden md:flex items-center">
              <button onClick={() => setSelectedUser(null)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                <ChevronLeft className="w-4 h-4" />
                Kembali ke Daftar
              </button>
            </div>
          )}
        </div>,
        headerActionsEl
      )}

      {/* Main List View (hidden on desktop when detail is open) */}
      <div className={`${selectedUser ? 'md:hidden' : ''} space-y-6 flex-1 w-full flex flex-col`}>
        {/* Mobile controls */}
        <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total: {users.length} Pengguna</span>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${autoRefresh ? 'bg-brand-red/10 text-brand-red' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh || isRefreshing ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'Live Sync Aktif' : 'Live Sync Mati'}</span>
          </button>
        </div>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, telepon, atau ID perangkat..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat pengguna...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Pengguna tidak ditemukan.</p>
        </div>
      ) : (
        <>
          {filteredUsers.some(u => u.lat && u.lng) && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-red" />
                  Peta
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {filteredUsers.filter(u => u.lat && u.lng).length} Pengguna
                </span>
              </div>
              <div className="h-[300px] w-full relative z-0 group rounded-b-xl overflow-hidden">
                {!isGlobalMapActive && (
                  <div 
                    className="absolute inset-0 bg-black/10 z-[400] flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors backdrop-blur-[1px]"
                    onClick={() => setIsGlobalMapActive(true)}
                  >
                    <div className="bg-white/90 px-4 py-2 rounded-full shadow-md font-bold text-sm text-gray-700 backdrop-blur-sm pointer-events-none">
                      Ketuk untuk menggerakkan peta
                    </div>
                  </div>
                )}
                <MapContainer 
                  center={
                    filteredUsers.find(u => u.lat && u.lng) 
                      ? [parseFloat(filteredUsers.find(u => u.lat && u.lng)!.lat), parseFloat(filteredUsers.find(u => u.lat && u.lng)!.lng)] 
                      : [-6.200000, 106.816666]
                  } 
                  zoom={12} 
                  scrollWheelZoom={isGlobalMapActive}
                  dragging={isGlobalMapActive}
                  touchZoom={isGlobalMapActive}
                  doubleClickZoom={isGlobalMapActive}
                  attributionControl={false}
                  className="h-full w-full"
                >
                  <MapBounds users={filteredUsers} />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  {filteredUsers.map((user, idx) => {
                    if (user.lat && user.lng) {
                      return (
                        <Marker 
                          key={user.device_id || idx} 
                          position={[parseFloat(user.lat), parseFloat(user.lng)]}
                        >
                          <Popup>
                            <div className="text-sm font-sans">
                              <h4 className="font-semibold">{user.nama_lengkap || 'Pengguna Anonim'}</h4>
                              {user.detail_alamat && <p className="mt-1 text-gray-600 line-clamp-2">{user.detail_alamat}</p>}
                              <p className="mt-1 text-xs text-brand-red">{user.jumlah_kunjungan || 1} log</p>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    }
                    return null;
                  })}
                </MapContainer>
              </div>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user, idx) => (
            <div 
              key={user.device_id || idx} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow relative group cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(user.device_id); }}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 rounded-full p-1.5 z-10"
                title="Hapus Pengguna"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="flex items-start justify-between mb-4 pr-8">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{user.nama_lengkap || 'Pengguna Anonim'}</h3>
                </div>
                <div className="bg-brand-red/10 text-brand-red text-xs font-semibold px-2 py-1 rounded inline-flex items-center shrink-0">
                  {user.jumlah_kunjungan || 1} Kunjungan
                </div>
              </div>
              
              <div className="space-y-3 text-sm text-gray-600">
                {user.nomor_telepon && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <span>{user.nomor_telepon}</span>
                  </div>
                )}
                
                {(user.detail_alamat || user.patokan) && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    <div className="flex-1">
                      {user.detail_alamat && <p className="line-clamp-2">{user.detail_alamat}</p>}
                      {user.patokan && <p className="text-xs text-brand-red mt-1">Catatan: {user.patokan}</p>}
                    </div>
                  </div>
                )}

                {user.lat && user.lng && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <a 
                      href={`https://maps.google.com/?q=${user.lat},${user.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Lihat di Peta ({user.lat.substring(0, 7)}, {user.lng.substring(0, 7)})
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        </>
      )}
      </div>

      <AnimatePresence>
      {selectedUser && (
        <>
          {/* Mobile Bottom Sheet Overlay */}
          <AnimatePresence>
            {selectedUser && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setSelectedUser(null)}
              />
            )}
          </AnimatePresence>
          
          {/* Detail Panel */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed md:relative z-50 md:z-auto bg-white md:inset-auto inset-x-0 bottom-0 rounded-t-2xl md:rounded-xl md:shadow-sm md:border md:border-gray-100 h-[85vh] md:h-auto min-h-[500px] md:min-h-0 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none md:!transform-none md:!opacity-100"
          >
            <header className="px-4 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white md:rounded-t-xl rounded-t-2xl">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 md:hidden"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h3 className="text-lg font-bold text-gray-900 md:hidden">Detail Pengguna</h3>
                <h3 className="text-xl font-bold text-gray-900 hidden md:block">Analitik Profil Pengguna</h3>
              </div>
              <div className="md:hidden w-12 h-1.5 bg-gray-200 rounded-full absolute left-1/2 -top-3 -translate-x-1/2" />
            </header>

            <div className="flex-1 overflow-auto p-4 md:p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedUser.nama_lengkap || 'Pengguna Anonim'}</h2>
                  <p className="text-gray-500 font-mono mt-1 text-sm md:text-base">ID: {selectedUser.device_id}</p>
                </div>
                <div className="bg-brand-red/10 text-brand-red font-semibold px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-1.5 md:gap-2">
                  <Hash className="w-4 h-4 md:w-5 md:h-5" />
                  {selectedUser.jumlah_kunjungan || 1} Log
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedUser.nomor_telepon && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-sm font-medium"><Phone className="w-4 h-4"/> Nomor Telepon</div>
                    <div className="font-semibold text-gray-900">{selectedUser.nomor_telepon}</div>
                  </div>
                )}
                {selectedUser.created_at && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 mb-1.5 text-sm font-medium"><Clock className="w-4 h-4"/> Pertama Kali Terlihat</div>
                    <div className="font-semibold text-gray-900">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
                  </div>
                )}
              </div>

              {(selectedUser.detail_alamat || selectedUser.patokan) && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium"><MapPin className="w-4 h-4"/> Alamat Pengiriman</div>
                  {selectedUser.detail_alamat && <p className="font-semibold text-gray-900 leading-relaxed">{selectedUser.detail_alamat}</p>}
                  {selectedUser.patokan && <div className="text-sm font-medium border-l-2 border-brand-red pl-3 py-2 bg-white inline-block pr-4 rounded-r shadow-sm text-gray-700">Catatan: {selectedUser.patokan}</div>}
                </div>
              )}

              {selectedUser.lat && selectedUser.lng && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[300px] md:h-[400px]">
                  <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold"><MapPin className="w-4 h-4 text-brand-red"/> Lokasi Tersimpan</div>
                    <a href={`https://maps.google.com/?q=${selectedUser.lat},${selectedUser.lng}`} target="_blank" rel="noreferrer" className="text-brand-red hover:underline text-sm font-medium px-3 py-1.5 bg-brand-red/10 rounded-md transition-colors">Buka di Peta</a>
                  </div>
                  <div className="flex-1 w-full relative z-0 group">
                    {!isModalMapActive && (
                      <div 
                        className="absolute inset-0 bg-black/10 z-[400] flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors backdrop-blur-[1px]"
                        onClick={() => setIsModalMapActive(true)}
                      >
                        <div className="bg-white/90 px-4 py-2 rounded-full shadow-md font-bold text-sm text-gray-700 backdrop-blur-sm pointer-events-none">
                          Ketuk untuk menggerakkan peta
                        </div>
                      </div>
                    )}
                    <MapContainer 
                      center={[parseFloat(selectedUser.lat), parseFloat(selectedUser.lng)]} 
                      zoom={15} 
                      scrollWheelZoom={isModalMapActive}
                      dragging={isModalMapActive}
                      touchZoom={isModalMapActive}
                      doubleClickZoom={isModalMapActive}
                      attributionControl={false}
                      className="h-full w-full"
                    >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      <Marker position={[parseFloat(selectedUser.lat), parseFloat(selectedUser.lng)]} />
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
      </AnimatePresence>
    </div>
  );
}
