import { motion, AnimatePresence } from 'motion/react';
import { Target, Lightbulb, Users, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import React from 'react';

const iconMap: Record<string, React.ReactNode> = {
  "Target": <Target className="text-brand-red" size={24} />,
  "Lightbulb": <Lightbulb className="text-brand-yellow" size={24} />,
  "Users": <Users className="text-brand-red" size={24} />,
  "ShieldCheck": <ShieldCheck className="text-brand-yellow" size={24} />
};

export default function About() {
  const [data, setData] = useState({
    header: { lencana: "Tentang Perjalanan Kami", judulUtama: "Praktik Nyata Wirausaha Mahasiswa", deskripsi: "DimDump adalah inisiatif dan bentuk praktik nyata wirausaha dari kelompok mahasiswa Kampus STIE Wikara. Kami menghadirkan dimsum goreng dengan kualitas premium sebagai UMKM kebanggaan kampus yang menjangkau kantong setiap kalangan." },
    lencana_tim: { judul: "Tim Penggerak Kami", deskripsi: "Mengenal lebih dekat wajah-wajah di balik layar yang senantiasa memastikan setiap porsi DimDump disajikan dengan sempurna." },
    lencana_nilai: "Nilai Inti Kami",
    visi: "",
    misi: [] as string[],
    nilai_nilai: [] as { ikon: string, judul: string, deskripsi: string }[],
    tim: [] as { nama: string, peran: string, gambar: string }[]
  });
  const [selectedNilai, setSelectedNilai] = useState<{judul: string, deskripsi: string, ikon: string} | null>(null);
  const [isVisiMisiOpen, setIsVisiMisiOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState<{nama: string, peran: string, gambar?: string} | null>(null);

  const teamQuotes = [
    "Dimsum hangat, semangat berlipat! Menikmati setiap proses dalam berwirausaha.",
    "Mengukus mimpi, menyajikan bukti. Bisnis bukan cuma soal rasa, tapi juga dedikasi.",
    "Dalam setiap gigitan dimsum, ada kerja keras tim yang tak pernah lelah berusaha.",
    "Bukan seberapa besar memulainya, tapi seberapa konsisten kita mengukusnya hingga matang.",
    "Wirausaha sejati bagai kulit dimsum, lentur hadapi tantangan, erat membalut visi bersama.",
    "Bumbu terbaik dari bisnis ini adalah kerjasama dan senyuman kepuasan pelanggan."
  ];

  useEffect(() => {
    if (selectedNilai || isVisiMisiOpen || selectedTeamMember) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedNilai, isVisiMisiOpen, selectedTeamMember]);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const d = Array.isArray(json) ? json[0] : json;
        if (d?.tentang) setData(d.tentang);
      })
      .catch(err => console.error("Failed to load data:", err));
  }, []);

  return (
    <div className="pt-28 pb-10 md:pt-36 md:pb-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-1.5 rounded-full font-semibold text-sm mb-6"
          >
            {data.header.lencana}
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-4 md:mb-6 leading-tight"
          >
            {data.header.judulUtama}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-xl text-gray-600 leading-relaxed"
          >
            {data.header.deskripsi}
          </motion.p>
        </div>

        {/* Vision & Mission Sections */}
        <div className="flex flex-col gap-4 md:gap-8 lg:gap-12 mb-8 md:mb-16">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => {
              if (window.innerWidth < 768) setIsVisiMisiOpen(true);
            }}
            className="md:bg-gray-50 bg-brand-red rounded-3xl p-6 md:p-12 relative overflow-hidden group cursor-pointer md:cursor-default"
          >
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 md:bg-brand-yellow/20 bg-white/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <h2 className="font-display text-2xl md:text-4xl font-black md:text-gray-900 text-white mb-4 md:mb-6 flex items-center gap-3">
              <span className="md:hidden">Visi & Misi Kami</span>
              <span className="hidden md:inline">Visi Kami</span>
            </h2>
            <p className="md:text-gray-700 text-white/90 text-base md:text-xl leading-relaxed relative z-10 line-clamp-3 md:line-clamp-none">
              {data.visi || "Memuat visi..."}
            </p>
            <div className="md:hidden flex items-center gap-2 mt-4 text-white font-medium text-sm">
                <span>Selengkapnya</span>
                <ChevronRight size={16} />
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:block bg-brand-red rounded-3xl p-6 md:p-12 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
            <h2 className="font-display text-2xl md:text-4xl font-black mb-6 md:mb-8 flex items-center gap-3">
              Misi Kami
            </h2>
            <ul className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-x-12 md:gap-y-6 relative z-10 text-base md:text-lg">
              {data.misi.map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="mt-1 bg-white/20 p-1 rounded-full shrink-0">
                    <ChevronRight size={16} className="text-white" />
                  </div>
                  <span className="text-white/90 leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="border-t border-gray-100 pt-8 md:pt-16">
          <div className="text-center mb-6 md:mb-12 flex flex-col items-center">
            <h2 className="font-display text-2xl md:text-4xl font-black text-gray-900 mb-4">{data.lencana_nilai}</h2>
            <div className="w-16 md:w-20 h-1.5 bg-brand-red rounded-full" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {data.nilai_nilai.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSelectedNilai(item);
                  }
                }}
                className="bg-white p-4 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 hover:border-brand-red/20 shadow-sm hover:shadow-xl hover:shadow-brand-red/5 transition-all text-center flex flex-col items-center group cursor-pointer md:cursor-default"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm mb-3 md:mb-6 group-hover:scale-110 transition-transform">
                  {iconMap[item.ikon] || <Target className="text-brand-red" size={24} />}
                </div>
                <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-0 md:mb-3">{item.judul}</h3>
                <p className="hidden md:block text-gray-600 leading-relaxed text-sm md:text-base">{item.deskripsi}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="pt-10 md:pt-16 mt-8 md:mt-16 border-t border-gray-100">
          <div className="text-center mb-6 md:mb-12 flex flex-col items-center">
            <h2 className="font-display text-2xl md:text-4xl font-black text-gray-900 mb-4">{data.lencana_tim.judul}</h2>
            <div className="w-16 md:w-20 h-1.5 bg-brand-red rounded-full" />
            <p className="mt-4 md:mt-6 text-gray-600 max-w-2xl text-base md:text-lg px-4">{data.lencana_tim.deskripsi}</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 justify-center">
            {[
              { nama: "Mela", peran: "Anggota Tim" },
              { nama: "Ira", peran: "Anggota Tim" },
              { nama: "Jelita", peran: "Anggota Tim" },
              { nama: "Jihan", peran: "Anggota Tim" },
              { nama: "Marni", peran: "Anggota Tim" },
              { nama: "Linda", peran: "Anggota Tim" },
              { nama: "Maspupah", peran: "Anggota Tim" }
            ].map((member, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSelectedTeamMember(member);
                  }
                }}
                className="bg-gray-50 rounded-2xl md:rounded-3xl p-4 md:p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:shadow-brand-red/5 hover:-translate-y-1 transition-all group md:cursor-default cursor-pointer"
              >
                <div className="mb-3 md:mb-6 relative w-16 h-16 md:w-32 md:h-32 mx-auto">
                  <div className="absolute inset-0 bg-brand-red/10 rounded-full scale-110 group-hover:bg-brand-red/20 transition-colors" />
                  <img src={`https://ui-avatars.com/api/?name=${member.nama}&background=random`} alt={member.nama} className="w-full h-full object-cover rounded-full relative z-10 border-2 md:border-4 border-white shadow-md" />
                </div>
                <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-0.5 md:mb-1">{member.nama}</h3>
                <p className="text-gray-500 font-medium text-[10px] md:text-sm">{member.peran}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Mobile Bottom Sheets for Details */}
      <AnimatePresence>
        {/* Nilai Inti Details */}
        {selectedNilai && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedNilai(null)}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-3xl p-6 relative pb-[max(2.5rem,env(safe-area-inset-bottom))]"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
              <button 
                onClick={() => setSelectedNilai(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                {iconMap[selectedNilai.ikon] || <Target className="text-brand-red" size={24} />}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{selectedNilai.judul}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{selectedNilai.deskripsi}</p>
            </motion.div>
          </div>
        )}
        
        {/* Visi & Misi Bottom Sheet */}
        {isVisiMisiOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsVisiMisiOpen(false)}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-3xl p-6 relative pb-[max(2.5rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white z-10 pt-2 pb-4">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
                  <button 
                    onClick={() => setIsVisiMisiOpen(false)}
                    className="absolute top-4 right-2 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200"
                  >
                    <X size={20} />
                  </button>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Visi & Misi Kami</h3>
              </div>
              <div className="mt-2">
                  <h4 className="font-bold text-brand-red text-lg mb-2">Visi</h4>
                  <p className="text-gray-700 leading-relaxed mb-6">{data.visi}</p>
                  <h4 className="font-bold text-brand-red text-lg mb-4">Misi</h4>
                  <ul className="space-y-4 text-gray-700">
                    {data.misi.map((text, i) => (
                        <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 bg-brand-red/10 p-1 rounded-full shrink-0">
                                <ChevronRight size={14} className="text-brand-red" />
                            </div>
                            <span>{text}</span>
                        </li>
                    ))}
                  </ul>
              </div>
            </motion.div>
          </div>
        )}

        {/* Team Member Bottom Sheet */}
        {selectedTeamMember && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setSelectedTeamMember(null)}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full bg-white rounded-t-3xl pt-16 px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] relative mt-20"
              onClick={e => e.stopPropagation()}
            >
              {/* Floating Circle Image */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${selectedTeamMember.nama}&background=random&size=128`}
                    alt={selectedTeamMember.nama} 
                    className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover bg-white" 
                  />
              </div>

              <button 
                onClick={() => setSelectedTeamMember(null)}
                className="absolute top-6 right-6 p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="text-center mt-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedTeamMember.nama}</h3>
                  <p className="text-brand-red font-medium mb-6">{selectedTeamMember.peran}</p>
                  
                  <div className="bg-gray-50 rounded-2xl p-5 relative border border-gray-100 mt-4">
                    <div className="text-gray-300 absolute -top-4 left-2 text-6xl font-serif leading-none opacity-50">"</div>
                    <p className="text-gray-600 italic text-sm leading-relaxed relative z-10">
                        {teamQuotes[(selectedTeamMember.nama.charCodeAt(0) + selectedTeamMember.nama.charCodeAt(selectedTeamMember.nama.length-1)) % teamQuotes.length]}
                    </p>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
