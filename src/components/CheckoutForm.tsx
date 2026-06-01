import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, X, Truck, MapPin, Copy, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import MapPicker from './MapPicker';
import { generateWhatsappMessage, formatWhatsappNumber } from '../utils/whatsappFormatter';

interface TransferMethod {
  id: string;
  nama: string;
  no_rek?: string;
  no_telp?: string;
  atas_nama: string;
}

interface TransferData {
  bank: TransferMethod[];
  ewallet: TransferMethod[];
}

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  qty: number;
  setQty: (qty: number) => void;
}

export default function CheckoutForm({ isOpen, onClose, qty, setQty }: CheckoutFormProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // iOS Safari prevent background scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      
      return () => {
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      };
    } else {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const getInitialData = () => {
    try {
      const data = localStorage.getItem('dimdumpCheckoutData');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const initialValues = getInitialData();

  const [name, setName] = useState(initialValues.name || '');
  const [contact, setContact] = useState(initialValues.contact || '');
  const [method, setMethod] = useState<'cod' | 'ambil'>(initialValues.method || 'cod');
  const [address, setAddress] = useState(initialValues.address || '');
  const [patokan, setPatokan] = useState(initialValues.patokan || '');
  const [note, setNote] = useState(initialValues.note || '');
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'transfer'>(initialValues.paymentMethod || 'tunai');
  const [transferData, setTransferData] = useState<TransferData | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<TransferMethod | null>(null);
  const [hasTransferred, setHasTransferred] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [contactError, setContactError] = useState('');
  
  const [adminPhone, setAdminPhone] = useState('6285871328639');
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data && data.metode_transfer) {
          setTransferData(data.metode_transfer);
        }
        if (data && data.kontak && data.kontak.telepon) {
          let number = String(data.kontak.telepon).replace(/\D/g, '');
          if (number.startsWith('0')) {
            number = '62' + number.slice(1);
          }
          setAdminPhone(number);
        }
      })
      .catch(console.error);
  }, []);

  // Reload data from localStorage when form is opened (to catch App.tsx background updates)
  useEffect(() => {
    if (isOpen) {
      const cachedData = localStorage.getItem('dimdumpCheckoutData');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.name && !name) setName(parsed.name);
          if (parsed.contact && !contact) setContact(parsed.contact);
          if (parsed.address && !address) setAddress(parsed.address);
          if (parsed.patokan && !patokan) setPatokan(parsed.patokan);
          if (parsed.note && !note) setNote(parsed.note);
          if (parsed.method) setMethod(parsed.method);
          if (parsed.paymentMethod) setPaymentMethod(parsed.paymentMethod);
        } catch (e) {
          console.error("Failed to parse cached checkout data");
        }
      }
    }
  }, [isOpen]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = { name, contact, address, patokan, method, note, paymentMethod };
    localStorage.setItem('dimdumpCheckoutData', JSON.stringify(dataToSave));
  }, [name, contact, address, patokan, method, note, paymentMethod]);
  
  // Helper function to sync with database
  const syncWithDatabase = () => {
    const deviceId = localStorage.getItem('deviceId') || 'unknown';
    const cachedLat = localStorage.getItem('dimdumpGPSLat');
    const cachedLng = localStorage.getItem('dimdumpGPSLng');

    fetch('/api/user-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Device-Id': deviceId
      },
      body: JSON.stringify({
        name,
        contact,
        address,
        patokan,
        method,
        lat: cachedLat || null,
        lng: cachedLng || null
      })
    }).catch(err => console.error("Failed to sync user info:", err));
  };
  
  // Custom close handler to also sync data
  const handleClose = () => {
    if (name || contact || address) {
      syncWithDatabase();
    }
    onClose();
  };

  const validateContact = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length < 9) return 'Nomor HP minimal 9 digit';
    if (/(.)\1{4,}/.test(raw)) return 'Nomor HP tidak boleh memiliki 5 angka berulang yang sama';
    for (let i = 0; i <= raw.length - 5; i++) {
      const chunk = raw.slice(i, i + 5);
      let isAsc = true;
      let isDesc = true;
      for (let j = 1; j < 5; j++) {
        if (Number(chunk[j]) !== Number(chunk[j - 1]) + 1) isAsc = false;
        if (Number(chunk[j]) !== Number(chunk[j - 1]) - 1) isDesc = false;
      }
      if (isAsc || isDesc) return 'Nomor HP tidak boleh memiliki 5 angka berurutan';
    }
    return '';
  };

  const handleContactChange = (e: ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '');
    if (raw.startsWith('62')) raw = raw.slice(2);
    raw = raw.replace(/^0+/, ''); // remove leading 0s
    if (raw.length > 13) raw = raw.slice(0, 13);
    
    let formatted = '';
    if (raw.length > 0) {
      formatted = raw.slice(0, 3);
      if (raw.length > 3) formatted += '-' + raw.slice(3, 7);
      if (raw.length > 7) formatted += '-' + raw.slice(7, 11);
      if (raw.length > 11) formatted += '-' + raw.slice(11, 13);
    }
    setContact(formatted);
    if (raw.length > 0) setContactError(validateContact(formatted));
    else setContactError('');
  };

  const paketCount = Math.floor(qty / 3);
  const satuanCount = qty % 3;
  const totalPrice = (paketCount * 13000) + (satuanCount * 5000);
  const totalOriginalPrice = (paketCount * 15000) + (satuanCount * 5000);
  const discount = totalOriginalPrice - totalPrice;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (qty === 0) return;
    if (!name || !contact) return;
    const rawContact = contact.replace(/\D/g, '');
    const err = validateContact(rawContact);
    if (err) {
      setContactError(err);
      return;
    }
    if (method === 'cod' && !address) return;
    if (paymentMethod === 'transfer') {
      if (!selectedTransfer) return;
      if (!hasTransferred) return;
    }
    
    // Sync with database when submitting
    syncWithDatabase();

    const msgText = generateWhatsappMessage({
      name,
      contact,
      method,
      address,
      patokan,
      note,
      paymentMethod,
      selectedTransfer: selectedTransfer?.nama,
      hasTransferred,
      paketCount,
      satuanCount,
      totalPrice,
      totalOriginalPrice
    });

    const phone = formatWhatsappNumber(adminPhone); 
    const textUrl = encodeURIComponent(msgText);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const waUrl = isMobile 
      ? `whatsapp://send?phone=${phone}&text=${textUrl}`
      : `https://wa.me/${phone}?text=${textUrl}`;
      
    if (isMobile) {
      window.location.href = waUrl;
    } else {
      const newWindow = window.open(waUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = waUrl;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100]"
            onClick={handleClose}
          />
          <div 
            className="fixed inset-0 z-[101] flex flex-col justify-end md:justify-center md:items-center pointer-events-none p-0 md:p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full md:w-[600px] bg-white rounded-t-[2rem] md:rounded-3xl shadow-2xl pointer-events-auto flex flex-col h-[90dvh] md:h-auto max-h-[90dvh] relative overflow-hidden"
            >
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 shrink-0 relative z-10 bg-white rounded-t-[2rem] md:rounded-t-3xl">
              <h3 className="font-display text-2xl font-black text-gray-900">Selesaikan Pesanan</h3>
              <button 
                onClick={handleClose}
                className="bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 md:p-8 pb-32 md:pb-8 overflow-y-auto relative z-10 bg-white md:rounded-b-none flex-1">
              <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* 1. Rincian Singkat */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Total Pesanan</span>
                    <span className="block font-medium text-gray-900">
                      {qty === 0 && 'Belum ada pesanan'}
                      {paketCount > 0 && `${paketCount} Paket`}
                      {paketCount > 0 && satuanCount > 0 && ' + '}
                      {satuanCount > 0 && `${satuanCount} Satuan`}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white p-1 rounded-full border border-gray-200">
                    <button 
                      type="button"
                      onClick={() => setQty(Math.max(0, qty - 1))}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-bold text-gray-900 w-4 text-center">{qty}</span>
                    <button 
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      className="w-8 h-8 rounded-full bg-brand-red flex items-center justify-center text-white hover:bg-brand-red-dark transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* 2. Metode Pemesanan */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900 text-lg">Metode Pemesanan</h4>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => setMethod('cod')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center relative overflow-hidden ${
                        method === 'cod' 
                          ? 'bg-brand-red/5 border-brand-red' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Truck size={24} className={`mb-2 ${method === 'cod' ? 'text-brand-red' : 'text-gray-400'}`} />
                      <span className={`font-bold text-sm md:text-base ${method === 'cod' ? 'text-brand-red-dark' : 'text-gray-700'}`}>COD</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod('ambil')}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all text-center relative overflow-hidden ${
                        method === 'ambil' 
                          ? 'bg-brand-red/5 border-brand-red' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <MapPin size={24} className={`mb-2 ${method === 'ambil' ? 'text-brand-red' : 'text-gray-400'}`} />
                      <span className={`font-bold text-sm md:text-base ${method === 'ambil' ? 'text-brand-red-dark' : 'text-gray-700'}`}>Ambil Sendiri</span>
                    </button>
                  </div>
                </div>

                {/* 3. Data Pemesan */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900 text-lg">Data Pemesan</h4>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masukkan nama kamu"
                      className="w-full px-4 py-3 text-[16px] rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Nomor WhatsApp / HP</label>
                    <div className="flex gap-2 items-start">
                      <div className="bg-gray-100 border border-gray-200 text-gray-600 font-bold px-4 py-3 rounded-xl flex items-center justify-center shrink-0">
                        +62
                      </div>
                      <div className="w-full flex flex-col">
                        <input 
                          required
                          type="tel"
                          value={contact}
                          onChange={handleContactChange}
                          placeholder="812-3456-7890"
                          className={`w-full px-4 py-3 text-[16px] rounded-xl bg-gray-50 border ${contactError ? 'border-brand-red ring-1 ring-brand-red focus:ring-brand-red/20' : 'border-gray-200 focus:border-brand-red focus:ring-brand-red/20'} focus:bg-white focus:outline-none focus:ring-2 transition-all font-medium`}
                        />
                        {contactError && (
                          <span className="text-xs text-brand-red font-semibold mt-1 ml-1">{contactError}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {method === 'cod' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex flex-col overflow-hidden gap-4 mt-2"
                    >
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Tandai Lokasi di Peta</label>
                        <MapPicker onAddressSelect={setAddress} />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Detail Alamat Lengkap</label>
                        <textarea 
                          required
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                          placeholder="Masukkan detail alamat berupa jalan, desa, dll..."
                          rows={3}
                          className="w-full px-4 py-3 text-[16px] rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-medium resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Patokan</label>
                        <input 
                          type="text"
                          value={patokan}
                          onChange={e => setPatokan(e.target.value)}
                          placeholder="Contoh: Depan warung warna biru / Cat rumah abu-abu"
                          className="w-full px-4 py-3 text-[16px] rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-medium"
                        />
                      </div>
                    </motion.div>
                  )}
                  
                  <div className={method === 'cod' ? 'mt-2' : ''}>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Catatan Pembelian (Opsional)</label>
                    <textarea 
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Contoh: Pedasnya dipisah ya kak..."
                      rows={2}
                      className="w-full px-4 py-3 text-[16px] rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all font-medium resize-none"
                    />
                  </div>
                </div>

                {/* 4. Metode Pembayaran */}
                <div className="flex flex-col gap-4">
                  <h4 className="font-bold text-gray-900 text-lg">Metode Pembayaran</h4>
                  
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('tunai')}
                      className={`flex flex-col p-4 rounded-2xl border-2 transition-all justify-center items-center relative overflow-hidden ${
                         paymentMethod === 'tunai' 
                          ? 'bg-brand-red/5 border-brand-red' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`font-bold text-sm md:text-base ${paymentMethod === 'tunai' ? 'text-brand-red-dark' : 'text-gray-700'}`}>Tunai</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('transfer')}
                      className={`flex flex-col p-4 rounded-2xl border-2 transition-all justify-center items-center relative overflow-hidden ${
                         paymentMethod === 'transfer' 
                          ? 'bg-brand-red/5 border-brand-red' 
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`font-bold text-sm md:text-base ${paymentMethod === 'transfer' ? 'text-brand-red-dark' : 'text-gray-700'}`}>Transfer</span>
                    </button>
                  </div>

                  {paymentMethod === 'transfer' && transferData && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-4 mt-2"
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase mb-3 block">Pilihan Bank Transfer</span>
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                          {transferData.bank.map(bank => {
                            const isAvailable = Boolean(bank.no_rek);
                            return (
                              <button 
                                key={bank.id} 
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => setSelectedTransfer(bank)}
                                className={`bg-white border rounded-lg p-2 flex items-center justify-center aspect-video transition-all ${!isAvailable ? 'opacity-50 cursor-not-allowed grayscale border-gray-200' : selectedTransfer?.id === bank.id ? 'border-brand-red ring-1 ring-brand-red' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}
                              >
                                <img 
                                  src={`https://raw.githubusercontent.com/alinlabs/mydata-apiserverless/main/public/gambar/logo/bank/${bank.id}.png`} 
                                  alt={bank.nama} 
                                  className="max-w-full max-h-full object-contain"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase mb-3 block">Pilihan E-Wallet</span>
                        <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                          {transferData.ewallet.map(ewallet => {
                            const isAvailable = Boolean(ewallet.no_telp);
                            return (
                              <button 
                                key={ewallet.id} 
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => setSelectedTransfer(ewallet)}
                                className={`bg-white border rounded-lg p-2 flex items-center justify-center aspect-video transition-all ${!isAvailable ? 'opacity-50 cursor-not-allowed grayscale border-gray-200' : selectedTransfer?.id === ewallet.id ? 'border-brand-red ring-1 ring-brand-red' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}
                              >
                                <img 
                                  src={`https://raw.githubusercontent.com/alinlabs/mydata-apiserverless/main/public/gambar/logo/ewallet/${ewallet.id}.png`} 
                                  alt={ewallet.nama} 
                                  className="max-w-full max-h-full object-contain"
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <AnimatePresence>
                        {selectedTransfer && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mt-2">
                              <div className="flex flex-col">
                                <span className="font-mono font-bold text-xl md:text-2xl text-gray-900 tracking-widest flex items-center gap-2">
                                  {selectedTransfer.no_rek || selectedTransfer.no_telp}
                                </span>
                                <span className="text-sm font-semibold text-gray-500 uppercase mt-0.5">
                                  A.N. {selectedTransfer.atas_nama}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedTransfer.no_rek || selectedTransfer.no_telp || "");
                                  setHasCopied(true);
                                  setTimeout(() => setHasCopied(false), 2000);
                                }}
                                className="flex items-center justify-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                title="Salin Nomor"
                              >
                                {hasCopied ? <CheckCheck size={20} className="text-green-500" /> : <Copy size={20} />}
                              </button>
                            </div>
                            <p className="text-xs mt-2 text-gray-500 mb-3">
                              Silakan transfer sesuai total bayar dan kirim bukti transfer melalui WhatsApp.
                            </p>
                            <label className="flex items-center gap-2 cursor-pointer bg-white p-3 rounded-lg border border-gray-200">
                              <input 
                                type="checkbox" 
                                checked={hasTransferred}
                                onChange={(e) => setHasTransferred(e.target.checked)}
                                className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red" 
                              />
                              <span className="text-sm font-semibold text-gray-700">Saya sudah transfer</span>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>

              </form>
            </div>

            <div className="p-6 md:p-8 shrink-0 pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-white border-t border-gray-100 rounded-b-none md:rounded-b-3xl relative z-10">
              <AnimatePresence>
                {showPriceDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mb-4"
                  >
                    <div className="flex flex-col gap-2 pt-2 pb-4 border-b border-gray-100 text-sm">
                      <div className="flex justify-between items-center text-gray-600 font-medium">
                        <span>Harga Normal</span>
                        <span>Rp {totalOriginalPrice.toLocaleString('id-ID')}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between items-center text-brand-red font-medium">
                          <span>Potongan</span>
                          <div className="flex items-center gap-2">
                            <span>- Rp {discount.toLocaleString('id-ID')}</span>
                            <span className="text-[10px] bg-brand-red/10 text-brand-red-dark px-1.5 py-0.5 rounded font-black">
                              -{Math.round((discount / totalOriginalPrice) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                      {method !== 'ambil' && (
                        <div className="flex justify-between items-center text-gray-600 font-medium">
                          <span>Est. Ongkir</span>
                          <span>Rp 0</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-end mb-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Total Bayar</span>
                <div 
                  className="flex items-center gap-2 cursor-pointer select-none group"
                  onClick={() => setShowPriceDetails(!showPriceDetails)}
                >
                  <div className="flex flex-col items-end">
                    {discount > 0 && !showPriceDetails && (
                      <span className="text-xs text-gray-400 font-medium line-through mb-0.5">Rp {totalOriginalPrice.toLocaleString('id-ID')}</span>
                    )}
                    <span className="font-black text-2xl text-brand-red leading-none group-hover:text-brand-red-dark transition-colors">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="bg-gray-50 hover:bg-gray-100 p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                    {showPriceDetails ? <ChevronDown size={18} /> : <ChevronUp size={18} />} 
                  </div>
                </div>
              </div>
              <button 
                type="submit"
                form="checkout-form"
                disabled={qty === 0 || !!contactError || (paymentMethod === 'transfer' && !hasTransferred)}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${qty === 0 || !!contactError || (paymentMethod === 'transfer' && !hasTransferred) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-red text-white hover:bg-brand-red-dark'}`}
              >
                Pesan Sekarang
              </button>
            </div>
            
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
