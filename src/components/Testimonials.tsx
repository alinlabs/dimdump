import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    id: 1,
    name: "Ahmad Rizky",
    role: "Mahasiswa STIE Wikara",
    content: "Dimsum gorengnya krispi banget! Porsi pas untuk ngemil pas nugas. Apalagi dicocol sausnya yang juara. Bakal sering pesen nih!",
    rating: 5,
  },
  {
    id: 2,
    name: "Siti Nurhaliza",
    role: "Karyawan Swasta",
    content: "Suka banget sama tekstur luarnya yang garing tapi dalamnya tetep lembut. Pengiriman cepat dan selalu hangat pas sampai di Purwakarta.",
    rating: 5,
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Warga Purwakarta",
    content: "Harga ramah di kantong, rasanya wah. Cocok buat acara keluarga atau sekedar jajan sore. Mantap DimDump!",
    rating: 5,
  },
  {
    id: 4,
    name: "Rina Amelia",
    role: "Pelajar",
    content: "Baru pertama kali nyoba langsung ketagihan. Krispinya dapet, rasanya gurih banget. Paling enak dimakan anget-anget.",
    rating: 4,
  },
  {
    id: 5,
    name: "Dedi Irawan",
    role: "Pecinta Kuliner",
    content: "Saus cocolannya itu lho yang bikin kangen. Dimsumnya juga ukurannya lumayan gede, puas deh pokoknya jajan di sini.",
    rating: 5,
  }
];

export default function Testimonials() {
  const [items, setItems] = useState(testimonialsData);
  const [isShifting, setIsShifting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Mulai animasi transisi
      setIsShifting(true);

      // Selesaikan transisi dan rotasi array tanpa animasi
      setTimeout(() => {
        setIsShifting(false);
        setItems(prev => {
          const arr = [...prev];
          const first = arr.shift();
          if (first) arr.push(first);
          return arr;
        });
      }, 500); // 500ms sama dengan duration-500 di class tailwind
    }, 4000); // Loop setiap 4 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-12 bg-gray-50 overflow-hidden" id="testimoni">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3 md:mb-4 tracking-tight">KATA <span className="text-brand-red">MEREKA</span></h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Pendapat pelanggan setia tentang kerenyahan Dimsum Goreng DimDump.
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden -mx-4">
            <div 
              className={`flex transition-transform ease-in-out ${isShifting ? 'duration-500 -translate-x-full md:-translate-x-[33.333333%]' : 'duration-0 translate-x-0'}`}
            >
              {items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="w-full md:w-1/3 flex-shrink-0 px-4">
                  <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col relative group hover:border-brand-red/20 transition-colors">
                    <Quote className="absolute top-6 right-6 md:right-8 w-10 h-10 md:w-12 md:h-12 text-brand-red/5 -z-0 group-hover:text-brand-red/10 transition-colors" />
                    
                    <div className="flex gap-1 mb-4 md:mb-6 relative z-10">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 md:w-5 md:h-5 ${i < item.rating ? 'fill-brand-yellow text-brand-yellow' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                    
                    <p className="text-gray-700 italic mb-6 md:mb-8 flex-grow relative z-10 leading-relaxed text-base md:text-lg">"{item.content}"</p>
                    
                    <div className="mt-auto flex items-center gap-3 md:gap-4 relative z-10">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red font-bold font-display text-lg md:text-xl">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-gray-900 leading-tight">{item.name}</h4>
                        <p className="text-xs md:text-sm text-gray-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient overlay to soften the edges on desktop */}
          <div className="hidden md:block absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="hidden md:block absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
