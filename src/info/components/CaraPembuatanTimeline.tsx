import { InfoItem } from '../data/infoData';
import InfoCard from './InfoCard';

interface Props {
  items: InfoItem[];
  onItemClick: (item: InfoItem) => void;
}

export default function CaraPembuatanTimeline({ items, onItemClick }: Props) {
  return (
    <section className="mb-12 mt-10 w-full animate-fade-in relative px-4 md:px-0">
      
      <div className="mb-12 max-w-2xl text-center md:text-left">
        <h2 className="text-3xl font-bold font-display text-gray-900 mb-3">Tata Cara Pembuatan</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          Jejak langkah proses dari awal pencarian ide hingga sistem bisa rilis ke publik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10 w-full mt-8">
        {items.map((item, idx) => (
          <div key={idx} className="relative w-full flex h-full"> 
            <div className="w-full h-full bg-white relative z-20 rounded-3xl">
              <InfoCard item={item} onClick={() => onItemClick(item)} hideIcon={true} />
            </div>

            {/* Desktop (LG) Connectors 3 cols */}
            {idx % 3 !== 2 && idx !== items.length - 1 && (
              <div className="hidden lg:block absolute top-[50%] left-[50%] w-[calc(100%+2rem)] border-t-[3px] border-dashed border-gray-300 -z-10" />
            )}
            
            {idx % 3 === 2 && idx !== items.length - 1 && (
              <>
                <div className="hidden lg:block absolute top-[50%] left-[50%] w-[calc(50%+1rem)] h-[calc(100%+2rem)] border-t-[3px] border-r-[3px] border-b-[3px] border-dashed border-gray-300 rounded-tr-[3rem] rounded-br-[3rem] -z-10" />
                <div className="hidden lg:block absolute top-[calc(150%+2rem)] right-[50%] w-[calc(200%+4rem)] border-b-[3px] border-dashed border-gray-300 -z-10 transform -translate-y-[3px]" />
              </>
            )}

            {/* Tablet (MD) Connectors 2 cols */}
            {idx % 2 !== 1 && idx !== items.length - 1 && (
              <div className="hidden md:block lg:hidden absolute top-[50%] left-[50%] w-[calc(100%+2rem)] border-t-[3px] border-dashed border-gray-300 -z-10" />
            )}
            
            {idx % 2 === 1 && idx !== items.length - 1 && (
              <>
                <div className="hidden md:block lg:hidden absolute top-[50%] left-[50%] w-[calc(50%+1rem)] h-[calc(100%+2rem)] border-t-[3px] border-r-[3px] border-b-[3px] border-dashed border-gray-300 rounded-tr-[3rem] rounded-br-[3rem] -z-10" />
                <div className="hidden md:block lg:hidden absolute top-[calc(150%+2rem)] right-[50%] w-[calc(100%+2rem)] border-b-[3px] border-dashed border-gray-300 -z-10 transform -translate-y-[3px]" />
              </>
            )}

            {/* Mobile (SM) Connectors 1 col */}
            {idx !== items.length - 1 && (
              <div className="block md:hidden absolute top-[50%] left-[50%] w-0 h-[calc(100%+1.5rem)] border-l-[3px] border-dashed border-gray-300 -z-10" />
            )}
          </div>
        ))}
      </div>

    </section>
  );
}
