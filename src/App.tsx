/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import fpPromise from '@fingerprintjs/fingerprintjs';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Menu from './components/Menu';
import Promo from './components/Promo';
import FAQ from './components/FAQ';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import PopupBanner from './components/PopupBanner';
import InstallPWA from './pages/InstallPWA';
import LinkTree from './pages/LinkTree';

import { useRef } from 'react';
import FloatingChat from './components/FloatingChat';

export default function App() {
  const [qty, setQty] = useState(() => {
    const savedQty = localStorage.getItem('dimdumpQty');
    return savedQty ? parseInt(savedQty, 10) : 0;
  });

  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(() => {
    return localStorage.getItem('dimdumpMusicMuted') === 'true';
  });
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStartMusic = () => {
    if (audioRef.current && !isMusicPlaying && !isMusicMuted) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {
        // Autoplay blocked by browser. Will be handled by handleFirstClick
      });
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicMuted) {
        audioRef.current.muted = false;
        setIsMusicMuted(false);
        localStorage.setItem('dimdumpMusicMuted', 'false');
        // Also play if not playing
        if (!isMusicPlaying) {
           audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
        }
      } else {
        audioRef.current.muted = true;
        setIsMusicMuted(true);
        localStorage.setItem('dimdumpMusicMuted', 'true');
      }
    }
  };

  useEffect(() => {
    const handleFirstClick = () => {
      if (!isMusicPlaying && !isMusicMuted && audioRef.current) {
        audioRef.current.volume = 0.4;
        audioRef.current.play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
      document.removeEventListener('click', handleFirstClick);
    };
    
    document.addEventListener('click', handleFirstClick);
    return () => {
      document.removeEventListener('click', handleFirstClick);
    };
  }, [isMusicPlaying, isMusicMuted]);

  useEffect(() => {
    localStorage.setItem('dimdumpQty', qty.toString());
  }, [qty]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visits, setVisits] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/checkout') {
      setIsCheckoutOpen(true);
    } else {
      setIsCheckoutOpen(false);
    }
  }, [location.pathname]);

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    if (location.pathname === '/checkout') {
      navigate(-1);
    }
  };

  const handleOpenCheckout = () => {
    setIsMobileMenuOpen(false);
    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    if (isCheckoutOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCheckoutOpen, isMobileMenuOpen]);

  useEffect(() => {
    const initTracking = async () => {
      // Gunakan FingerprintJS untuk identitas unik perangkat yang lebih konsisten lintas session/account Google
      let deviceId = localStorage.getItem('deviceId');
      
      if (!deviceId) {
        try {
          const fp = await fpPromise.load();
          const result = await fp.get();
          deviceId = 'fp-' + result.visitorId;
          localStorage.setItem('deviceId', deviceId);
        } catch (e) {
          console.warn("FingerprintJS failed, falling back to random UUID", e);
          deviceId = 'dev-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
          localStorage.setItem('deviceId', deviceId);
        }
      }

      // Geolocation and Geocoding
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            localStorage.setItem('dimdumpGPSLat', lat.toString());
            localStorage.setItem('dimdumpGPSLng', lng.toString());

            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`);
            const data = await res.json();
            
            let detailedAddress = '';
            if (data && data.address) {
              const a = data.address;
              const addressParts = [];
              if (a.road) addressParts.push(a.road);
              if (a.village || a.neighbourhood || a.suburb || a.hamlet) addressParts.push(`Desa/Kel. ${a.village || a.neighbourhood || a.suburb || a.hamlet}`);
              if (a.city_district || a.county) addressParts.push(`Kec. ${a.city_district || a.county}`);
              if (a.city || a.town || a.municipality) addressParts.push(a.city || a.town || a.municipality);
              if (a.state) addressParts.push(a.state);
              if (a.postcode) addressParts.push(a.postcode);
              detailedAddress = addressParts.join(', ');
            } else if (data && data.display_name) {
              detailedAddress = data.display_name;
            }

            if (detailedAddress) {
              localStorage.setItem('dimdumpGPSAddress', detailedAddress);
              
              // Prefill checkout data if not already filled
              const cachedData = localStorage.getItem('dimdumpCheckoutData');
              let parsedData = cachedData ? JSON.parse(cachedData) : {};
              let hasChanged = false;

              if (!parsedData.address || parsedData.address !== detailedAddress) {
                parsedData.address = detailedAddress;
                hasChanged = true;
              }
              
              if (hasChanged) {
                localStorage.setItem('dimdumpCheckoutData', JSON.stringify(parsedData));
              }

              // Sync ke db agar kita hemat push, update ke backend sekali
              fetch('/api/user-info', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'X-Device-Id': localStorage.getItem('deviceId') || 'unknown'
                },
                body: JSON.stringify({ 
                  address: detailedAddress,
                  lat: lat.toString(),
                  lng: lng.toString()
                })
              }).catch(e => console.error("Auto loc sync fail", e));
            }
          } catch (e) {
            console.error('Error fetching auto location:', e);
          }
        }, (error) => {
          console.log("Auto location not permitted/available", error);
        });
      }

      // Gunakan sessionStorage untuk mendeteksi apakah kita sudah hit api visits di sesi ini
      const isVisitRecorded = sessionStorage.getItem('visitRecorded');

      if (!isVisitRecorded) {
        // Sesi baru, lakukan POST untuk menambah kunjungan
        fetch('/api/visits', { 
          method: 'POST',
          headers: { 'X-Device-Id': deviceId }
        })
          .then(res => res.json())
          .then(data => {
            if (data && typeof data.visits === 'number') {
              setVisits(data.visits);
              sessionStorage.setItem('visitRecorded', 'true');
            }
          })
          .catch(err => console.error("Failed to post visit:", err));
      } else {
        // Sudah ada di sesi ini (misal refresh halaman)
        fetch('/api/visits', { 
          method: 'GET',
          headers: { 'X-Device-Id': deviceId }
        })
          .then(res => res.json())
          .then(data => {
            if (data && typeof data.visits === 'number') {
              setVisits(data.visits);
            }
          })
          .catch(err => console.error("Failed to fetch visit count:", err));
      }
    };

    initTracking();
  }, []);

  return (
    <div className={`min-h-[100dvh] font-sans text-gray-900 selection:bg-brand-yellow selection:text-brand-red-dark relative bg-gray-900 overflow-x-hidden ${qty > 0 ? 'pb-24 md:pb-0' : ''}`}>
      <div className="bg-white min-h-[100dvh]">
        {location.pathname !== '/link' && (
          <Header 
            qty={qty} 
            onCheckout={handleOpenCheckout} 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={(open) => {
              if (open) handleCloseCheckout();
              setIsMobileMenuOpen(open);
            }}
            isMusicPlaying={isMusicPlaying}
            isMusicMuted={isMusicMuted}
            toggleMusic={toggleMusic}
          />
        )}
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Menu setQty={setQty} />
                <Promo />
                <Features />
                <Testimonials />
                <FAQ />
              </>
            } />
            <Route path="/checkout" element={
              <>
                <Hero />
                <Menu setQty={setQty} />
                <Promo />
                <Features />
                <Testimonials />
                <FAQ />
              </>
            } />
            <Route path="/tentang" element={<About />} />
            <Route path="/install" element={<InstallPWA isAdmin={false} />} />
            <Route path="/link" element={<LinkTree />} />
          </Routes>
        </main>
      </div>
      {location.pathname !== '/link' && <Footer visits={visits} />}
      <Cart 
        qty={qty} 
        setQty={setQty} 
        onCheckout={handleOpenCheckout} 
        isVisible={!isCheckoutOpen && !isMobileMenuOpen && location.pathname !== '/link'}
      />
      <CheckoutForm 
        isOpen={isCheckoutOpen} 
        onClose={handleCloseCheckout} 
        qty={qty}
        setQty={setQty}
      />
      {location.pathname === '/' && <PopupBanner onCloseProp={handleStartMusic} />}
      <FloatingChat isCartVisible={qty > 0 && !isCheckoutOpen && !isMobileMenuOpen && location.pathname !== '/link'} />
      <audio 
        ref={audioRef} 
        src="/music/backsound.mp3" 
        loop 
        muted={isMusicMuted}
        autoPlay={!isMusicMuted}
        onPlay={() => setIsMusicPlaying(true)}
      />
    </div>
  );
}
