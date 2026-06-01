import { Instagram, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Footer({ visits }: { visits?: number | null }) {
  const [contact, setContact] = useState({
    telepon: "083144213184",
    alamat: "Kampus STIE Wikara",
    instagram: "",
    email: "dimdump.official@gmail.com"
  });
  const [infoWeb, setInfoWeb] = useState({
    nama: "DimDump.",
    logo: "https://ui-avatars.com/api/?name=D&background=facc15&color=b91c1c&size=128",
    deskripsi_footer: "Dimsum goreng super krispi dengan cita rasa bintang lima harga mahasiswa. Sensasi renyah di setiap gigitannya!"
  });

  const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    if (cleaned.length === 12) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`;
    } else if (cleaned.length === 13) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 13)}`;
    } else if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length > 7) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
    }
    return phone || "Belum ada nomor";
  };

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.kontak) setContact(data.kontak);
        if (data?.info_web) setInfoWeb(data.info_web);
      })
      .catch(err => console.error("Failed to load footer data:", err));
  }, []);

  return (
    <footer className="bg-gray-900 pt-16 pb-8 border-t-4 border-brand-red">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12">
          
          <div className="max-w-sm">
            <Link to="/" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="font-display font-black text-3xl tracking-tight text-white flex items-center gap-3 mb-4 inline-flex">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-brand-yellow text-brand-red-dark">
                <img src={infoWeb.logo} alt="Logo" className="w-full h-full object-cover" />
              </div>
              {infoWeb.nama}
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              {infoWeb.deskripsi_footer}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 w-full md:w-auto">
             <div className="flex flex-col gap-3">
               <h4 className="text-white font-bold mb-2">Kontak</h4>
               <a href={`https://wa.me/${(() => { let n = contact.telepon?.replace(/[^0-9]/g, '') || ''; if (n.startsWith('08')) n = '62' + n.slice(1); return n; })()}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors text-sm">
                 <Phone size={16} />
                 <span>{formatPhoneNumber(contact.telepon)}</span>
               </a>
               {contact.email && (
                 <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors text-sm">
                   <Mail size={16} />
                   <span>{contact.email}</span>
                 </a>
               )}
               <div className="flex items-start gap-2 text-gray-400 text-sm max-w-[200px]">
                 <MapPin size={16} className="mt-0.5 shrink-0" />
                 <span>{contact.alamat}</span>
               </div>
             </div>

             {contact.instagram && contact.instagram.trim() !== '' && (
               <div className="flex flex-col gap-3">
                 <h4 className="text-white font-bold mb-2">Sosial Media</h4>
                 <a href={`https://instagram.com/${contact.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-brand-yellow transition-colors text-sm">
                   <Instagram size={16} />
                   <span>{contact.instagram}</span>
                 </a>
               </div>
             )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col-reverse md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-xs sm:text-sm flex flex-col sm:flex-row items-center gap-2">
            <span>&copy; {new Date().getFullYear()} {infoWeb.nama} Hak Cipta Dilindungi.</span>
          </p>
          <div className="flex flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
             <a href="#" className="hover:text-gray-300 transition-colors">Kebijakan Privasi</a>
             <span className="inline-block w-1 h-1 rounded-full bg-gray-700" />
             <a href="#" className="hover:text-gray-300 transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
