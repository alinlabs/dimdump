import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Save, Plus, Trash2, LayoutList, RefreshCw, ChevronRight, ChevronDown, Edit, X } from 'lucide-react';

// Recursive component for viewing JSON data beautifully
function JsonViewerNode({ data, itemKey = '' }: { data: any, itemKey?: string }) {
  if (data === null || data === undefined || data === '') {
    return <span className="text-gray-400 italic text-sm">-</span>;
  }

  if (typeof data === 'boolean') {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${data ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {data ? 'True' : 'False'}
      </span>
    );
  }

  if (typeof data === 'number') {
    const isPrice = itemKey.toLowerCase().match(/harga|price|biaya/);
    const displayValue = isPrice ? new Intl.NumberFormat('id-ID').format(data) : data;
    return <span className="text-gray-700 text-sm font-mono">{displayValue}</span>;
  }

  if (typeof data === 'string') {
    if (data.startsWith('http')) {
       // Cek apakah itu adalah link gambar dari pattern tertentu atau URL Unsplash.
       const isImage = data.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || data.includes('unsplash.com') || data.includes('images') || data.includes('ui-avatars.com') || itemKey.toLowerCase().match(/gambar|foto|avatar|profil|image|pict|photo/);
       const isAvatar = itemKey.toLowerCase().match(/avatar|profil/) || data.includes('ui-avatars.com') || (data.includes('unsplash') && itemKey.toLowerCase().includes('tim'));

       if (isImage) {
           return (
               <div className="flex flex-col gap-3">
                   <a href={data} target="_blank" rel="noreferrer" className="block w-fit">
                       <img src={data} alt="Preview" className={`${isAvatar ? 'w-24 h-24 rounded-full object-cover' : 'w-32 h-32 rounded-xl object-cover'} bg-gray-100 shadow-sm border border-gray-200`} />
                   </a>
               </div>
           );
       }
       return <a href={data} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-600 underline text-sm whitespace-pre-wrap break-all">{data}</a>;
    }
    return <span className="text-gray-600 text-sm whitespace-pre-wrap">{data}</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-gray-400 italic text-sm">Daftar Kosong</span>;
    return (
      <div className="flex flex-col space-y-4 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 hover:shadow-md transition-shadow">
            <JsonViewerNode data={item} itemKey={itemKey} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(data)
          .filter(([key]) => !['id', '_id', 'ikon', 'icon'].includes(key.toLowerCase()))
          .map(([key, value]) => {
            const isNoTitle = ['hero', 'header'].includes(key.toLowerCase());
            return (
          <div key={key} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col gap-2 ${typeof value === 'object' && value !== null ? 'md:col-span-2' : ''}`}>
            {!isNoTitle && (
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-100 pb-2">
                {key.replace(/_/g, ' ')}
              </span>
            )}
            <div className={`${typeof value === 'object' && value !== null ? (Array.isArray(value) ? '' : '') : 'bg-gray-50 border border-gray-100 rounded-lg px-3 py-2'}`}>
              <JsonViewerNode data={value} itemKey={key} />
            </div>
          </div>
          )})}
      </div>
    );
  }

  return <span>Tidak didukung</span>;
}

// Recursive component for editing JSON data
function JsonEditorNode({ data, onChange, path = [], itemKey = '' }: { data: any, onChange: (value: any) => void, path?: string[], itemKey?: string }) {
  if (data === null || data === undefined) {
    return <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all" value="" onChange={e => onChange(e.target.value)} placeholder="Null atau kosong" />;
  }

  if (typeof data === 'boolean') {
    return (
      <select 
        value={data ? 'true' : 'false'}
        onChange={(e) => onChange(e.target.value === 'true')}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }

  if (typeof data === 'number') {
    const isPrice = itemKey.toLowerCase().match(/harga|price|biaya/) != null;
    
    // For normal numbers, use standard number input
    if (!isPrice) {
      return (
        <input 
          type="number"
          value={data}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
        />
      );
    }
    
    // For price, use text input with formatted thousands separator
    return (
      <input 
        type="text"
        value={new Intl.NumberFormat('id-ID').format(data)}
        onChange={(e) => {
          const rawValue = e.target.value.replace(/\./g, '').replace(/\D/g, '');
          onChange(rawValue ? Number(rawValue) : 0);
        }}
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
      />
    );
  }

  if (typeof data === 'string') {
    const isImage = data.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || data.includes('unsplash.com') || data.includes('images') || data.includes('ui-avatars.com') || itemKey.toLowerCase().match(/gambar|foto|avatar|profil|image|pict|photo/);
    const isAvatar = itemKey.toLowerCase().match(/avatar|profil/) || data.includes('ui-avatars.com') || (data.includes('unsplash') && itemKey.toLowerCase().includes('tim'));

    const imagePreview = isImage ? (
      <div className="mb-3">
         <img src={data} alt="Preview" className={`${isAvatar ? 'w-16 h-16 rounded-full object-cover' : 'w-24 h-24 rounded-lg object-cover'} bg-gray-100 shadow-sm border border-gray-200 inline-block`} />
      </div>
    ) : null;

    if (data.length > 50 || data.includes('\n')) {
      return (
        <div className="w-full">
          {imagePreview}
          <textarea 
            value={data}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
          />
        </div>
      );
    }
    return (
      <div className="w-full">
        {imagePreview}
        <input 
          type="text"
          value={data}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
        />
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-4">
        {data.map((item, idx) => (
          <div key={idx} className="bg-gray-50/50 p-4 rounded-lg border border-gray-100 relative group">
            <button
              onClick={() => {
                const newData = [...data];
                newData.splice(idx, 1);
                onChange(newData);
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Hapus Item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="pt-4">
              <JsonEditorNode 
                data={item} 
                itemKey={itemKey}
                onChange={(val) => {
                  const newData = [...data];
                  newData[idx] = val;
                  onChange(newData);
                }}
                path={[...path, idx.toString()]}
              />
            </div>
          </div>
        ))}
        <button
          onClick={() => {
            const template = data.length > 0 ? getEmptyTemplate(data[0]) : '';
            onChange([...data, template]);
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded text-sm font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Tambah Item
        </button>
      </div>
    );
  }

  if (typeof data === 'object') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(data)
          .filter(([key]) => !['id', '_id', 'ikon', 'icon'].includes(key.toLowerCase()))
          .map(([key, value]) => {
            const isNoTitle = ['hero', 'header'].includes(key.toLowerCase());
            return (
          <div key={key} className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col gap-2 ${typeof value === 'object' && value !== null ? 'md:col-span-2' : ''}`}>
            {!isNoTitle && (
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block border-b border-gray-100 pb-2">
                {key.replace(/_/g, ' ')}
              </label>
            )}
            <div className={typeof value === 'object' && value !== null ? '' : ''}>
              <JsonEditorNode 
                data={value} 
                itemKey={key}
                onChange={(val) => {
                  onChange({ ...data, [key]: val });
                }}
                path={[...path, key]}
              />
            </div>
          </div>
          )})}
      </div>
    );
  }

  return <span>Tipe tidak didukung</span>;
}

function getEmptyTemplate(obj: any): any {
  if (Array.isArray(obj)) return [];
  if (typeof obj === 'object' && obj !== null) {
    const res: any = {};
    for (const k in obj) {
      if (typeof obj[k] === 'string') res[k] = '';
      else if (typeof obj[k] === 'number') res[k] = 0;
      else if (typeof obj[k] === 'boolean') res[k] = false;
      else res[k] = getEmptyTemplate(obj[k]);
    }
    return res;
  }
  return '';
}


export default function KVData({ selectedKey }: { selectedKey?: string }) {
  const [data, setData] = useState<any>(null); // State object inside array
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [isEditingMode, setIsEditingMode] = useState(false);

  const fetchKVData = useCallback(async (silent = false, forceUpdate = false) => {
    if (!silent) setLoading(true);
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/data');
      const json = await res.json();
      
      const payload = Array.isArray(json) && json.length > 0 ? json[0] : json;
      
      // Update only if we are not actively in edit mode (prevent overwriting user typing)
      if (!isEditingMode || forceUpdate) {
        setData(payload);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
      setIsRefreshing(false);
    }
  }, [isEditingMode]);

  useEffect(() => {
    fetchKVData();
  }, [fetchKVData]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && !saving && !isEditingMode) {
      interval = setInterval(() => fetchKVData(true), 3000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchKVData, saving, isEditingMode]);

  const handleSave = () => {
    setSaving(true);
    const wrapInArray = [data]; // The API expects an array format wrapper for data.json
    
    fetch('/api/admin/kv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wrapInArray)
    })
      .then(res => res.json())
      .then(() => {
        alert('Data saved successfully!');
        setIsEditingMode(false);
        setAutoRefresh(true);
      })
      .catch(err => {
        console.error(err);
        alert('Failed to save data. Check console.');
      })
      .finally(() => setSaving(false));
  };
  
  const handleEditToggle = () => {
    setIsEditingMode(true);
    setAutoRefresh(false);
  };

  const headerActionsEl = document.getElementById('header-actions');

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      {headerActionsEl && createPortal(
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            disabled={isEditingMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors sm:w-auto justify-center sm:justify-start ${autoRefresh && !isEditingMode ? 'bg-brand-red/10 text-brand-red' : 'bg-gray-100 text-gray-600'} ${isEditingMode ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${(autoRefresh && !isEditingMode) || isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isEditingMode ? 'Sinkronisasi Dijeda' : autoRefresh ? 'Live Sync Aktif' : 'Live Sync Mati'}</span>
          </button>
          
          {!isEditingMode ? (
            <button 
              onClick={handleEditToggle}
              className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 bg-brand-red text-white hover:bg-brand-red/90 rounded-lg text-sm font-medium transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Masuk Mode Edit</span>
            </button>
          ) : (
            <>
              <button 
                onClick={() => {
                  if (window.confirm('Batalkan editan dan memuat ulang data?')) {
                    setIsEditingMode(false);
                    setAutoRefresh(true);
                    fetchKVData(true, true);
                  }
                }}
                className="flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                type="button"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Batal</span>
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center justify-center gap-2 p-2 sm:px-3 sm:py-1.5 bg-brand-red text-white hover:bg-brand-red-dark rounded-lg text-sm font-medium transition-colors ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </>
          )}
        </div>,
        headerActionsEl
      )}

      {loading && !data ? (
        <div className="text-center py-12 text-gray-500">Memuat data...</div>
      ) : data ? (
        <div className="flex flex-col gap-10">
          {Object.keys(data)
            .filter(key => 
              (!['id', '_id'].includes(key.toLowerCase())) &&
              (!selectedKey || key === selectedKey)
            )
            .map(key => (
            <div key={key}>
              <div className="overflow-x-visible">
                 {isEditingMode ? (
                   <div className="py-2 space-y-6">
                     <JsonEditorNode 
                       data={data[key]} 
                       onChange={(newVal) => {
                         setData({ ...data, [key]: newVal });
                       }}
                     />
                   </div>
                 ) : (
                    <div className="py-2 space-y-6">
                      <JsonViewerNode data={data[key]} itemKey={key} />
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">Gagal memuat atau tidak ada data.</p>
        </div>
      )}
    </div>
  );
}
