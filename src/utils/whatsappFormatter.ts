export interface WhatsappOrderParams {
  name: string;
  contact: string;
  method: 'cod' | 'ambil';
  address: string;
  patokan: string;
  note?: string;
  paymentMethod: 'tunai' | 'transfer';
  selectedTransfer?: string;
  hasTransferred?: boolean;
  paketCount: number;
  satuanCount: number;
  totalPrice: number;
  totalOriginalPrice: number;
}

export function formatWhatsappNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

export function generateWhatsappMessage(params: WhatsappOrderParams): string {
  const {
    name,
    contact,
    method,
    address,
    patokan,
    note,
    paymentMethod,
    selectedTransfer,
    hasTransferred,
    paketCount,
    satuanCount,
    totalPrice,
    totalOriginalPrice
  } = params;
  
  const discount = totalOriginalPrice - totalPrice;
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Format helper to strip empty lines nicely
  const lines = [
    `Halo Admin DimDump,`,
    `Saya ingin melakukan pemesanan. Berikut rinciannya:`,
    ``,
    `---------`,
    `*CATATAN PEMBELIAN*`,
    `_${note || 'Tidak ada catatan'}_`,
    `---------`,
    ``,
    `*DETAIL PESANAN*`,
    paketCount > 0 ? `- *${paketCount}x* Paket Hemat (3 pcs/paket)` : null,
    satuanCount > 0 ? `- *${satuanCount}x* Dimsum Satuan` : null,
    ``,
    `*RINCIAN HARGA*`,
    discount > 0 ? `- Harga Normal: ~Rp ${totalOriginalPrice.toLocaleString('id-ID')}~` : null,
    discount > 0 ? `- Diskon: _- Rp ${discount.toLocaleString('id-ID')}_` : null,
    `- *Total Bayar: Rp ${totalPrice.toLocaleString('id-ID')}*`,
    ``,
    `*METODE PEMBAYARAN*`,
    `- *${paymentMethod === 'tunai' ? 'Tunai (Cash)' : `Transfer via ${selectedTransfer || 'E-Wallet/Bank'}`}*`,
    paymentMethod === 'transfer' ? `- *Status Bayar:* ${hasTransferred ? 'Sudah Transfer (Cek Bukti)' : 'Belum Ditransfer'}` : null,
    ``,
    `*DATA PEMESAN*`,
    `- *Nama:* ${name}`,
    `- *Kontak:* ${contact}`,
    `- *Tanggal:* ${today}`,
    ``,
    `*METODE PENGIRIMAN*`,
    `- *Tipe:* ${method === 'cod' ? 'Ambil di Tempat (COD)' : 'Ambil Sendiri'}`,
    method === 'cod' ? `- *Alamat:* ${address}` : null,
    method === 'cod' && patokan ? `- *Patokan:* ${patokan}` : null,
    method === 'ambil' ? `- *Lokasi Ambil:* Kampus STIE Wikara` : null,
    ``,
    `Mohon infonya ya Kak, terima kasih!`
  ];

  return lines.filter(line => line !== null).join('\n');
}
