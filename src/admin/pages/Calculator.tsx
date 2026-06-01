import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, RefreshCw, ChevronDown, Package, DollarSign, Percent, Tag } from 'lucide-react';

interface BahanBaku {
  nama: string;
  kuantitas: number;
  satuan: string;
  harga: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1000;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(value * easePercentage));
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count)}</>;
}

export default function Calculator() {
  const [useManual, setUseManual] = useState(false);
  
  // Storage for JSON data
  const [dbBahan, setDbBahan] = useState<BahanBaku[]>([]);
  const [dbTotalPorsi, setDbTotalPorsi] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Manual inputs
  const [manualModal, setManualModal] = useState('');
  const [manualPorsi, setManualPorsi] = useState('');
  
  // Custom Promos & Margins
  const [marginAwal, setMarginAwal] = useState('50'); // 50%
  const [diskonPersen, setDiskonPersen] = useState('0'); // 0%
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data && data.informasi_bahan_baku_dan_operasional && data.informasi_bahan_baku_dan_operasional.bahan_baku) {
          const mappedBahan = data.informasi_bahan_baku_dan_operasional.bahan_baku.map((b: any) => ({
            nama: b.nama_bahan || b.nama || 'Bahan',
            kuantitas: b.kebutuhan_harian || b.kuantitas || 1,
            satuan: b.satuan || '',
            harga: Number(b.estimasi_harga) || Number(b.harga) || 0
          }));
          
          if (data.informasi_bahan_baku_dan_operasional.operasional) {
            const mappedOperasional = data.informasi_bahan_baku_dan_operasional.operasional.map((o: any) => ({
              nama: o.jenis_biaya || o.nama || 'Operasional',
              kuantitas: 1,
              satuan: 'hari',
              harga: Number(o.estimasi_biaya) || Number(o.harga) || 0
            }));
            setDbBahan([...mappedBahan, ...mappedOperasional]);
          } else {
            setDbBahan(mappedBahan);
          }
          // try to infer total porsi from data, let's assume it's roughly 24 per resep based on standard or fallback to 30
          setDbTotalPorsi(30); 
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("Gagal load data bahan", e);
        setIsLoading(false);
      });
  }, []);

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Calculations
  const calculateTotalModal = () => {
    if (useManual) {
      return Number(manualModal) || 0;
    }
    return dbBahan.reduce((sum, item) => sum + item.harga, 0);
  };

  const calculatePorsi = () => {
    if (useManual) {
      return Number(manualPorsi) || 1;
    }
    return dbTotalPorsi;
  };

  const totalModal = calculateTotalModal();
  const totalPorsi = calculatePorsi();
  const hppPerPorsi = totalPorsi > 0 ? totalModal / totalPorsi : 0;
  
  const marginVal = Number(marginAwal) || 0;
  const hargaJualAwal = hppPerPorsi + (hppPerPorsi * (marginVal / 100));
  
  const diskonVal = Number(diskonPersen) || 0;
  const hargaJualAkhir = hargaJualAwal - (hargaJualAwal * (diskonVal / 100));
  const labaPerPorsi = hargaJualAkhir - hppPerPorsi;

  const totalOmzet = hargaJualAkhir * totalPorsi;
  const totalLaba = labaPerPorsi * totalPorsi;

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Left Col - Data Source Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              Basis Data
            </h3>
            <div className="flex items-center bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button
                onClick={() => setUseManual(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${!useManual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Otomatis
              </button>
              <button
                onClick={() => setUseManual(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${useManual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Manual
              </button>
            </div>
          </div>
          
          {useManual ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Modal Baku (Rp)</label>
                <input
                  type="number"
                  value={manualModal}
                  onChange={e => setManualModal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-red text-gray-900 focus:ring-brand-red focus:ring-1 outline-none transition-all"
                  placeholder="Contoh: 150000"
                />
                <p className="text-xs text-gray-500 mt-1">Estimasi total bahan baku yang dibeli.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Total Porsi</label>
                <input
                  type="number"
                  value={manualPorsi}
                  onChange={e => setManualPorsi(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-brand-red text-gray-900 focus:ring-brand-red focus:ring-1 outline-none transition-all"
                  placeholder="Contoh: 30"
                />
              </div>
            </div>
          ) : (
            <div>
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-4 justify-center">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Memuat data...
                </div>
              ) : dbBahan.length > 0 ? (
                <div className="space-y-4">
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-2 mb-4 scrollbar-thin">
                    {dbBahan.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 text-sm">
                        <span className="text-gray-700">{item.nama} <span className="text-gray-400 text-xs">({item.kuantitas} {item.satuan})</span></span>
                        <span className="font-medium text-gray-900">{formatRupiah(item.harga)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 text-sm">Total Modal:</span>
                      <span className="font-bold text-gray-900">{formatRupiah(totalModal)}</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Porsi Dihasilkan</label>
                      <input
                        type="number"
                        value={dbTotalPorsi}
                        onChange={e => setDbTotalPorsi(Number(e.target.value))}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-brand-red text-gray-900 outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-center text-gray-500 py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Data bahan baku tidak ditemukan di KV Data.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Tactics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            Margin & Diskon
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                Margin Profit Awal (%)
                <span className="text-xs font-semibold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">{marginAwal}%</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={marginAwal}
                  onChange={e => setMarginAwal(e.target.value)}
                  className="w-full accent-brand-red"
                />
                <input
                  type="number"
                  value={marginAwal}
                  onChange={e => setMarginAwal(e.target.value)}
                  className="w-16 px-2 py-1.5 text-center text-sm rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                Diskon Promosi (%)
                <span className="text-xs font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">{diskonPersen}%</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={diskonPersen}
                  onChange={e => setDiskonPersen(e.target.value)}
                  className="w-full accent-orange-500"
                />
                <input
                  type="number"
                  value={diskonPersen}
                  onChange={e => setDiskonPersen(e.target.value)}
                  className="w-16 px-2 py-1.5 text-center text-sm rounded-lg border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Col - Results - Now Full Width Below */}
      <div className="w-full space-y-6">
        <div className="bg-white text-gray-900 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8 relative">
            <h3 className="text-gray-600 font-medium tracking-wide text-sm uppercase mb-6 flex items-center justify-between">
              <span className="text-brand-red font-bold">Ringkasan HPP</span>
              <span className="bg-white/80 px-3 py-1 rounded-full text-xs text-brand-red font-semibold shadow-sm border border-brand-red/10">Per 1 Porsi</span>
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10 mb-8 border-b border-brand-red/10 pb-8">
              <div>
                <p className="text-gray-600 text-sm mb-1">Harga Pokok (Modal)</p>
                <p className="text-3xl font-bold font-display tracking-tight text-gray-900"><AnimatedNumber value={hppPerPorsi} /></p>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">Harga Jual (<span className="line-through opacity-50 text-xs ml-1">{formatRupiah(hargaJualAwal)}</span>)</p>
                <p className="text-3xl font-bold font-display tracking-tight text-brand-red">
                  <AnimatedNumber value={hargaJualAkhir} />
                  {Number(diskonPersen) > 0 && <span className="text-sm font-normal text-brand-red bg-brand-red/10 px-2 py-0.5 rounded ml-2 align-middle">-{diskonPersen}%</span>}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm mb-2 uppercase tracking-wider font-semibold">Laba Bersih Per Porsi</p>
                <div className="flex items-end gap-3 text-gray-900">
                  <span className={`text-4xl font-bold font-display ${labaPerPorsi > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {labaPerPorsi > 0 ? '+' : ''}<AnimatedNumber value={Math.abs(labaPerPorsi)} />
                  </span>
                  <span className="text-sm text-gray-500 pb-1">/ porsi</span>
                </div>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Proyeksi Jika Semua Terjual (1 Batch)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-white/60 rounded-xl border border-brand-red/10">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Modal Total</p>
                  <p className="text-xl font-bold font-display text-gray-900"><AnimatedNumber value={totalModal} /></p>
                </div>
                <div className="p-4 bg-white/60 rounded-xl border border-brand-red/10">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Estimasi Omzet</p>
                  <p className="text-xl font-bold font-display text-gray-900"><AnimatedNumber value={totalOmzet} /></p>
                </div>
                <div className={`p-4 rounded-xl border bg-white/80 ${totalLaba > 0 ? 'border-green-200' : 'border-red-200'}`}>
                  <p className={`text-xs font-semibold uppercase mb-1 ${totalLaba > 0 ? 'text-green-600' : 'text-red-600'}`}>Estimasi Profit</p>
                  <p className={`text-xl font-bold font-display ${totalLaba > 0 ? 'text-green-600' : 'text-red-600'}`}><AnimatedNumber value={totalLaba} /></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
