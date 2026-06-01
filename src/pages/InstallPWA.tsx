import { useEffect } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InstallPWA({ isAdmin = false }: { isAdmin?: boolean }) {
  const { isInstallable, installPWA } = usePWAInstall();
  const navigate = useNavigate();

  useEffect(() => {
    // If we auto-trigger, we could do it here, but browser requires user gesture
    // So we show the UI for the user to click
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center">
        <div className="w-full aspect-[1/1] bg-gray-100 flex justify-center items-center overflow-hidden relative">
          <img 
            src={isAdmin ? '/gambar/admin-install.webp' : '/gambar/publik-install.webp'} 
            alt={isAdmin ? 'DimDump Admin Install' : 'DimDump Install'}
            className="w-full h-full object-cover aspect-square block"
          />
        </div>
        
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Install {isAdmin ? 'DimDump Admin' : 'DimDump'}
          </h1>
          <p className="text-gray-600 mb-8">
            Install website ini sebagai aplikasi (PWA) di perangkat Anda untuk akses yang lebih cepat dan mudah, tanpa harus membuka browser setiap saat.
          </p>

          <div className="space-y-4">
            {isInstallable ? (
              <button
                onClick={installPWA}
                className="w-full py-4 px-6 bg-brand-red hover:bg-brand-red-dark text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Install Sekarang</span>
              </button>
            ) : (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 flex flex-col items-center gap-2">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <p className="font-medium mt-1">Aplikasi sudah diinstall atau tidak didukung di browser ini.</p>
                <p className="text-sm opacity-80 mt-1">Jika belum diinstall, coba buka dari menu browser (titik 3) lalu pilih "Tambahkan ke Layar Utama".</p>
              </div>
            )}
            
            <button
              onClick={() => navigate(isAdmin ? '/admin/' : '/')}
              className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
