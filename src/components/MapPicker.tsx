import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Target } from 'lucide-react';

interface MapPickerProps {
  onAddressSelect: (address: string) => void;
}

// Custom simple pin to avoid standard Leaflet icon path issues in bundlers
const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); margin-top: -12px; margin-left: -12px;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function LocationMarker({ position, setPosition, onAddressSelect }: { 
  position: L.LatLng | null; 
  setPosition: (pos: L.LatLng) => void;
  onAddressSelect: (address: string) => void;
}) {
  const geocodePosition = async (latlng: L.LatLng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=id`);
      const data = await res.json();
      if (data && data.address) {
        const a = data.address;
        const partStreet = a.road || '';
        const partVillage = a.village || a.neighbourhood || a.suburb || a.hamlet || '';
        const partDistrict = a.city_district || a.county || '';
        const partCity = a.city || a.town || a.municipality || '';
        const partState = a.state || '';
        const partZip = a.postcode || '';

        const addressParts = [];
        if (partStreet) addressParts.push(partStreet);
        if (partVillage) addressParts.push(`Desa/Kel. ${partVillage}`);
        if (partDistrict) addressParts.push(`Kec. ${partDistrict}`);
        if (partCity) addressParts.push(partCity);
        if (partState) addressParts.push(partState);
        if (partZip) addressParts.push(partZip);

        const detailedAddress = addressParts.join(', ') || data.display_name;
        onAddressSelect(detailedAddress);
        
        // Save back to local storage and sync
        localStorage.setItem('dimdumpGPSLat', latlng.lat.toString());
        localStorage.setItem('dimdumpGPSLng', latlng.lng.toString());
        localStorage.setItem('dimdumpGPSAddress', detailedAddress);
        
        const cachedData = localStorage.getItem('dimdumpCheckoutData');
        if (cachedData) {
           const parsedData = JSON.parse(cachedData);
           parsedData.address = detailedAddress;
           localStorage.setItem('dimdumpCheckoutData', JSON.stringify(parsedData));
        }

        fetch('/api/user-info', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-Device-Id': localStorage.getItem('deviceId') || 'unknown'
          },
          body: JSON.stringify({ 
            address: detailedAddress,
            lat: latlng.lat.toString(),
            lng: latlng.lng.toString()
          })
        }).catch(e => console.error("Map sync fail", e));

      } else if (data && data.display_name) {
        onAddressSelect(data.display_name);
      }
    } catch (e) {
      console.error('Error fetching address via Nominatim:', e);
    }
  };

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      geocodePosition(e.latlng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 16);
      geocodePosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={customIcon} />
  );
}

export default function MapPicker({ onAddressSelect }: MapPickerProps) {
  let initialCenter: [number, number] = [-6.702951, 108.555627]; // Approx STIE Wikara/Cirebon
  let initialPos: L.LatLng | null = null;
  
  const cachedLat = localStorage.getItem('dimdumpGPSLat');
  const cachedLng = localStorage.getItem('dimdumpGPSLng');
  
  if (cachedLat && cachedLng) {
    initialCenter = [parseFloat(cachedLat), parseFloat(cachedLng)];
    initialPos = new L.LatLng(initialCenter[0], initialCenter[1]);
  }

  const [position, setPosition] = useState<L.LatLng | null>(initialPos);
  const [isMapActive, setIsMapActive] = useState(false);
  const mapRef = useRef<L.Map>(null);

  const handleLocateMe = () => {
    setIsMapActive(true);
    if (mapRef.current) {
      mapRef.current.locate();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleLocateMe}
        className="w-full justify-center text-brand-red bg-brand-red/10 hover:bg-brand-red/20 px-3 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
      >
        <Target size={18} />
        <span>GPS Lokasi Saat Ini</span>
      </button>

      <div className="w-full h-[200px] md:h-[250px] rounded-xl overflow-hidden shadow-inner border border-gray-200 mt-1 relative z-0 group">
        {!isMapActive && (
          <div 
            className="absolute inset-0 bg-black/10 z-[400] flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors backdrop-blur-[1px]"
            onClick={() => setIsMapActive(true)}
          >
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-md font-bold text-sm text-gray-700 backdrop-blur-sm pointer-events-none">
              Ketuk untuk menggerakkan peta
            </div>
          </div>
        )}
        <MapContainer 
          center={initialCenter} 
          zoom={16} 
          scrollWheelZoom={isMapActive}
          dragging={isMapActive}
          touchZoom={isMapActive}
          doubleClickZoom={isMapActive}
          attributionControl={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onAddressSelect={onAddressSelect} />
        </MapContainer>
      </div>
    </div>
  );
}

