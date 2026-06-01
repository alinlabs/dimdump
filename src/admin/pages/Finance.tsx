import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Minus, DollarSign, Trash2, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
}

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1000;
    
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easePercentage = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      setCount(Math.floor(value * easePercentage));
      
      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        setCount(value);
      }
    };
    
    animationFrameId = requestAnimationFrame(animateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(count)}</>;
}

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dimdump_finance');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse finance data', e);
      }
    }
  }, []);

  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (isFormOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
      if (mainScroll) mainScroll.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = 'unset';
      if (mainScroll) mainScroll.style.overflow = '';
    };
  }, [isFormOpen]);

  const saveTransactions = (newTx: Transaction[]) => {
    setTransactions(newTx);
    localStorage.setItem('dimdump_finance', JSON.stringify(newTx));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) return;

    const numAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const newTx: Transaction = {
      id: Date.now().toString(),
      type,
      amount: numAmount,
      description,
      date: new Date().toISOString()
    };

    saveTransactions([newTx, ...transactions]);
    setAmount('');
    setDescription('');
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    saveTransactions(transactions.filter(t => t.id !== id));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="space-y-6 w-full flex-1 flex flex-col">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 shrink-0">
        {/* Balance Card */}
        <div className="col-span-2 md:col-span-1 bg-brand-red rounded-2xl shadow-sm border border-brand-red-dark p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-2">
              <DollarSign className="w-5 h-5 text-white" />
              <span className="font-medium text-sm tracking-wide uppercase font-semibold">Total Saldo</span>
            </div>
            <div className="text-3xl font-bold font-display tracking-tight text-white mb-1">
              <AnimatedNumber value={balance} />
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2 md:mb-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <span className="font-medium text-xs md:text-sm truncate">Pemasukan</span>
          </div>
          <div className="text-lg md:text-2xl font-bold font-display tracking-tight text-gray-900">
            <AnimatedNumber value={totalIncome} />
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-2 text-gray-500 mb-2 md:mb-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <TrendingDown className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <span className="font-medium text-xs md:text-sm truncate">Pengeluaran</span>
          </div>
          <div className="text-lg md:text-2xl font-bold font-display tracking-tight text-gray-900">
            <AnimatedNumber value={totalExpense} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 min-h-[400px] flex-1 flex flex-col w-full">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="hidden md:inline">Riwayat Transaksi</span>
            <span className="md:hidden">Transaksi</span>
            <span className="text-xs md:text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 md:px-3 md:py-1 rounded-full inline-block">Lokal</span>
          </h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-brand-red text-white p-2.5 md:px-4 md:py-2 rounded-xl text-sm font-medium hover:bg-brand-red-dark transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-5 h-5 md:w-4 md:h-4" />
            <span className="hidden md:inline">Tambah Transaksi</span>
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada transaksi dicatat.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 bg-gray-50/50 group transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'income' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(tx.date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`font-semibold font-display tracking-tight ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </span>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                      title="Hapus transaksi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isFormOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFormOpen(false)}
                className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/50 z-[100] md:backdrop-blur-sm"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 z-[110] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-xl"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Tambah Transaksi</h2>
                    <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setType('income')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${type === 'income' ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                      >
                        <Plus className="w-4 h-4" />
                        Masuk
                      </button>
                      <button
                        type="button"
                        onClick={() => setType('expense')}
                        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${type === 'expense' ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                      >
                        <Minus className="w-4 h-4" />
                        Keluar
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nominal (Rp)</label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-brand-red focus:ring-1 outline-none transition-all"
                        placeholder="Contoh: 50000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Keterangan</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-red focus:ring-brand-red focus:ring-1 outline-none transition-all"
                        placeholder="Contoh: Penjualan 10 porsi"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-colors mt-4"
                    >
                      Simpan Transaksi
                    </button>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
