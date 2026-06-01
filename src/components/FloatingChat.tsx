import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  time: Date;
};

export default function FloatingChat({ isCartVisible }: { isCartVisible: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('083144213184');
  const [showBadge, setShowBadge] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hai Teman! Dimo disini siap bantu kamu. mau berapa pcs hari ini?",
      sender: 'bot',
      time: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        const data = Array.isArray(json) ? json[0] : json;
        if (data?.kontak?.telepon) {
          setPhone(data.kontak.telepon.replace(/[^0-9]/g, ''));
        }
      })
      .catch(err => console.error("Failed to load contact data:", err));
  }, []);

  useEffect(() => {
    // Tampilkan badge awal setelah 2 detik (jika chat box belum terbuka)
    const initialTimer = setTimeout(() => {
      if (!isOpen) setShowBadge(true);
    }, 2000);

    // Tampilkan kembali setiap 15 detik
    const intervalTimer = setInterval(() => {
      if (!isOpen) setShowBadge(true);
    }, 15000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    let hideTimer: NodeJS.Timeout;
    if (showBadge) {
      // Sembunyikan badge setelah 6 detik
      hideTimer = setTimeout(() => {
        setShowBadge(false);
      }, 6000);
    }
    return () => clearTimeout(hideTimer);
  }, [showBadge]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    const userText = message.trim();
    setMessage('');
    setIsProcessing(true);
    
    setMessages(prev => [
      ...prev,
      { id: Date.now(), text: userText, sender: 'user', time: new Date() }
    ]);
    
    setIsTyping(true);
    
    // 5 detik loading pertama
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: "Hai, Teman Dimo! makasih udah berkunjung", sender: 'bot', time: new Date() }
      ]);
      
      // Jeda 500ms sebelum loading kedua
      setTimeout(() => {
        setIsTyping(true);
        
        // 3 detik loading kedua
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            { id: Date.now(), text: "Pertanyaan kamu Dimo kirim langsung ya ke agent DimDump", sender: 'bot', time: new Date() }
          ]);
          
          // Jeda 3 detik sebelum buka WhatsApp
          setTimeout(() => {
            let formattedPhone = phone.replace(/\D/g, '');
            if (formattedPhone.startsWith('08')) {
              formattedPhone = '62' + formattedPhone.slice(1);
            }
            
            const textUrl = encodeURIComponent(userText);
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            const waUrl = isMobile 
              ? `whatsapp://send?phone=${formattedPhone}&text=${textUrl}`
              : `https://wa.me/${formattedPhone}?text=${textUrl}`;
              
            if (isMobile) {
              window.location.href = waUrl;
            } else {
              const newWindow = window.open(waUrl, '_blank');
              // Jika diblokir oleh popup blocker karena async, gunakan fallback location.href
              if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                window.location.href = waUrl;
              }
            }
            setIsProcessing(false);
          }, 3000);
          
        }, 3000);
      }, 500);
      
    }, 5000);
  };

  return (
    <>
      {/* Floating Gradient Shadow */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="floating-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`floating-chat-container fixed bottom-0 left-0 right-0 pointer-events-none z-[30] bg-gradient-to-t from-gray-900/40 via-gray-900/5 to-transparent transition-all duration-300 ${
              isCartVisible ? "h-64 md:h-56" : "h-32 md:h-40"
            }`}
          />
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <div 
             key="floating-btn"
             className={`floating-chat-container fixed right-4 md:right-8 z-[50] flex items-center justify-end transition-all duration-300 ${
               isCartVisible ? "bottom-[90px] md:bottom-[110px]" : "bottom-6 md:bottom-8"
             }`}
          >
            <AnimatePresence>
              {showBadge && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className="absolute right-[40px] md:right-[50px] top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-semibold pl-4 pr-9 py-1.5 md:py-2 rounded-full shadow-lg border border-gray-100 flex items-center whitespace-nowrap cursor-pointer selection:bg-brand-yellow -z-10"
                  onClick={() => setIsOpen(true)}
                >
                  Tanya <span className="text-brand-red ml-1">Dimo</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="w-[75px] h-[75px] md:w-[85px] md:h-[85px] hover:scale-110 transition-transform duration-300 focus:outline-none drop-shadow-2xl relative z-10"
            >
              <img src="/gambar/maskot.png" alt="Dimo" className="w-full h-full object-contain filter drop-shadow-lg" />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Chat UI */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Desktop Popup Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="hidden md:block fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />
            {/* Mobile Bottom Sheet Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            />

            {/* Chat Container */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`fixed z-[70] bg-white shadow-2xl flex flex-col overflow-visible
                bottom-0 left-0 right-0 w-full h-[65dvh] max-h-[65dvh] rounded-t-3xl
                md:bottom-6 md:left-auto md:right-8 md:w-[360px] md:h-[550px] md:max-h-[80vh] md:rounded-2xl md:border md:border-gray-100 md:overflow-hidden
              `}
            >
              {/* White background extension for mobile keyboard bounce/scroll */}
              <div className="absolute top-[98%] left-0 right-0 h-[50dvh] bg-white pointer-events-none md:hidden"></div>

              {/* Header */}
              <div className="bg-brand-red px-5 py-4 flex items-center justify-between text-white md:rounded-t-2xl rounded-t-3xl shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden p-1 shadow-inner relative shrink-0">
                    <img src="/gambar/maskot.png" alt="Dimo" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg leading-tight truncate">Tanya Dimo</h3>
                    <p className="text-white/80 text-xs flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse shrink-0"></span>
                      Online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 md:p-5 bg-gray-50 flex-1 flex flex-col gap-4 overflow-y-auto min-h-0 relative z-10">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto bg-gray-200/50 flex items-center justify-center p-0.5 border border-gray-100">
                        <img src="/gambar/maskot.png" alt="Dimo" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <div className={`p-3.5 rounded-2xl text-[14.5px] shadow-sm max-w-[85%] relative break-words ${
                      msg.sender === 'user' 
                        ? 'bg-brand-red text-white rounded-br-sm' 
                        : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm'
                    }`}>
                      {msg.text}
                      <span className={`text-[10px] flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mt-1 font-mono ${msg.sender === 'user' ? 'text-white/80' : 'text-gray-400'}`}>
                        {msg.time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 mt-auto bg-gray-200/50 flex items-center justify-center p-0.5 border border-gray-100">
                      <img src="/gambar/maskot.png" alt="Dimo" className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-white border border-gray-100 p-3.5 rounded-2xl rounded-bl-sm shadow-sm h-[42px] flex items-center justify-center gap-1.5 relative">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 md:p-4 bg-white border-t border-gray-100 md:rounded-b-2xl shrink-0 relative z-10 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-4">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                  <textarea
                    autoFocus
                    value={message}
                    disabled={isProcessing}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.target.style.height = '48px';
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    placeholder={isProcessing ? "Menunggu respon..." : "Tulis pesan..."}
                    className="flex-1 max-h-[96px] min-h-[48px] bg-gray-100 border-transparent rounded-xl px-4 py-3 text-[16px] focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red focus:bg-white transition-all resize-none overflow-y-auto w-full outline-none disabled:opacity-50 disabled:bg-gray-50"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(e as any);
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!message.trim() || isProcessing}
                    className="w-12 h-12 shrink-0 bg-brand-red text-white flex items-center justify-center rounded-xl hover:bg-brand-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
                  >
                    <Send size={18} className="translate-y-[1px] -translate-x-[1px]" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
