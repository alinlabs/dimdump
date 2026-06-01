import InfoCard from './InfoCard';
import { InfoItem } from '../data/infoData';

interface Props {
  items: InfoItem[];
  onItemClick: (item: InfoItem) => void;
}

export default function InfoSection({ items, onItemClick }: Props) {
  return (
    <section className="flex flex-wrap justify-center gap-4 md:gap-6">
      {items.map((item, idx) => (
        <div key={idx} className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
          <InfoCard
            item={item}
            onClick={() => onItemClick(item)}
          />
        </div>
      ))}
    </section>
  );
}
