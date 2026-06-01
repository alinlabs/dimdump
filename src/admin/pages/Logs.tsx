import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, Clock, Monitor, Trash2, RefreshCw, User } from 'lucide-react';

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLogs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/db');
      const data = await res.json();
      
      // Create user dictionary for quick lookup
      const uMap: Record<string, string> = {};
      (data?.database_user || []).forEach((u: any) => {
        if (u.device_id && u.nama_lengkap) {
          uMap[u.device_id] = u.nama_lengkap;
        }
      });
      setUsersMap(uMap);

      const sortedLogs = (data?.log || []).sort((a: any, b: any) => b.id_log - a.id_log);
      setLogs(sortedLogs);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      interval = setInterval(() => fetchLogs(true), 3000); // Poll every 3 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  const handleDelete = async (idLog: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus entri log ini?')) return;
    try {
      setLogs(prev => prev.filter(l => l.id_log !== idLog)); // Optimistic UI update
      const res = await fetch(`/api/admin/logs/${idLog}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error(error);
      alert('Gagal menghapus log.');
      fetchLogs(true); // Re-fetch to sync if failed
    }
  };

  const filteredLogs = logs.filter(l => {
    const userName = usersMap[l.device_id] || '';
    return (
      (l.device_id || '').toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase()) ||
      (l.waktu || '').includes(search)
    );
  });

  const headerActionsEl = document.getElementById('header-actions');

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {headerActionsEl && createPortal(
        <div className="flex items-center gap-2">
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
              placeholder="Cari log..."
              className="w-full pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>,
        headerActionsEl
      )}

      {/* Mobile controls */}
      <div className="md:hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Total: {logs.length} Log</span>
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
            placeholder="Cari ID perangkat..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat log...</div>
      ) : filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Log tidak ditemukan.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Stempel Waktu</th>
                  <th className="px-6 py-4">ID Perangkat</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id_log || idx} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-gray-500">#{log.id_log}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {new Date(log.waktu).toLocaleString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {usersMap[log.device_id] ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-brand-red shrink-0" />
                          <span className="font-medium text-gray-900">{usersMap[log.device_id]}</span>
                          <span className="font-mono text-xs text-gray-400">({log.device_id})</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 font-mono text-xs text-gray-600">
                          <Monitor className="w-4 h-4 text-gray-400 shrink-0" />
                          {log.device_id}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(log.id_log)}
                        className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 bg-white shadow-sm border border-gray-100 rounded-full p-1.5 inline-block"
                        title="Hapus Log"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
