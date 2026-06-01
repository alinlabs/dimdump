import { ArrowUpRight, Info } from 'lucide-react';
import { InfoItem } from '../data/infoData';

interface Props {
  key?: number | string;
  item: InfoItem;
  onClick: () => void;
  hideIcon?: boolean;
}

export default function InfoCard({ item, onClick, hideIcon }: Props) {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 group flex flex-col h-full w-full focus:outline-none hover:-translate-y-1 hover:shadow-lg ${item.hoverColor}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent group-hover:animate-shimmer z-10 pointer-events-none w-full" style={{ transform: 'translateX(-150%) skewX(-20deg)' }}></div>
      
      <div className="relative z-20 flex flex-col h-full w-full">
        {(!hideIcon || item.category) && (
          <div className="flex justify-between items-start mb-4 min-h-[24px]">
            {item.category ? (
              <p className="text-[13px] font-semibold text-gray-400 capitalize">{item.category}</p>
            ) : (
              <div />
            )}
            {!hideIcon && (
              item.link ? (
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-brand-red transition-colors -mt-1 -mr-1" />
              ) : (
                <Info className="w-5 h-5 text-gray-300 group-hover:text-brand-red transition-colors -mt-1 -mr-1" />
              )
            )}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${item.colorClass}`}>
            {item.icon}
          </div>
          <h3 className="text-xl font-bold font-display text-gray-900 group-hover:text-brand-red text-left transition-colors font-semibold leading-tight">{item.title}</h3>
        </div>
      </div>
    </button>
  );
}
