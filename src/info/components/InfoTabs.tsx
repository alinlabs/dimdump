interface Props {
  activeTab: 'sources' | 'tech' | 'features' | 'strategies' | 'cara';
  onTabChange: (tab: 'sources' | 'tech' | 'features' | 'strategies' | 'cara') => void;
}

export default function InfoTabs({ activeTab, onTabChange }: Props) {
  const tabs = [
    { id: 'sources', label: 'Sumber' },
    { id: 'tech', label: 'Teknologi' },
    { id: 'features', label: 'Fitur' },
    { id: 'strategies', label: 'Strategi' },
    { id: 'cara', label: 'Pembuatan' },
  ] as const;

  return (
    <div className="flex bg-gray-100 p-1.5 rounded-2xl md:w-fit mx-auto mb-10 overflow-x-auto hide-scrollbar">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
            activeTab === tab.id 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
