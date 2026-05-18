import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, Smartphone, ChevronRight, ShieldCheck, Clock, CheckCircle2, Copy, AlertCircle } from 'lucide-react';

export default function CheckoutJokiApp() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '', gameId: '' });
  const [paymentMethod, setPaymentMethod] = useState('gopay_qris');
  
  const [loading, setLoading] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [error, setError] = useState('');

  // Data Paket Joki (Idealnya ini didapat dari props)
  const service = {
    title: "Joki Mythic Glory - Fast Track",
    game: "Mobile Legends",
    price: 250000,
    features: ["Winrate 80%++", "Done in 24 Hours", "Free 1 Savage", "Bonus BP"]
  };

  // ==========================================
  // HANDLER CHECKOUT (PRODUCTION READY)
  // ==========================================
  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Endpoint ini mengarah ke Vercel Serverless Function (folder api/create-payment.js)
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          amount: service.price,
          description: `${service.title} - ID: ${customer.gameId}`,
          customer_name: customer.name,
          customer_email: customer.email,
          customer_phone: customer.phone,
          payment_method: paymentMethod
        })
      });

      // Menangani response error dari level HTTP
      if (!response.ok) {
        let errorMsg = 'Gagal menghubungi server pembayaran.';
        try {
          const errData = await response.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const result = await response.json();
      
      // Validasi response sukses dari Bayar.GG
      if (!result.success || !result.data) {
        throw new Error(result.error || result.message || 'Transaksi ditolak oleh Payment Gateway.');
      }

      // Render halaman status/QRIS
      setPaymentResult(result.data);

    } catch (err) {
      console.error('Checkout Error:', err);
      setError(err.message || "Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Note: Di production, ganti alert ini dengan toast notification (misal: react-hot-toast)
    alert('Nominal berhasil disalin ke clipboard!');
  };

  // ==========================================
  // RENDER VIEW 1: FORM CHECKOUT
  // ==========================================
  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-slate-200 p-4 md:p-8 font-sans selection:bg-indigo-500/30">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Kolom Kiri: Detail Paket */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-[#151A23] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ShieldCheck size={120} />
              </div>
              <h2 className="text-indigo-400 font-bold tracking-wider text-sm uppercase mb-2">{service.game}</h2>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-4">{service.title}</h1>
              
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-black text-emerald-400">
                  Rp {service.price.toLocaleString('id-ID')}
                </span>
                <span className="text-slate-500 text-sm font-medium">/ paket</span>
              </div>

              <div className="space-y-3">
                {service.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                    <CheckCircle2 size={18} className="text-indigo-500" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-4 flex gap-4 items-start">
              <ShieldCheck className="text-indigo-400 shrink-0 mt-1" />
              <div>
                <h4 className="text-indigo-300 font-semibold text-sm mb-1">Transaksi Aman 100%</h4>
                <p className="text-xs text-indigo-400/70 leading-relaxed">
                  Pembayaran diproses secara instan melalui gateway resmi. Data akun Anda dienkripsi dan dijamin kerahasiaannya.
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Data & Pembayaran */}
          <div className="md:col-span-7">
            <form onSubmit={handleCheckout} className="bg-[#151A23] border border-slate-800 rounded-2xl p-6 shadow-xl">
              
              {/* Header Step 1 */}
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-6 flex items-center gap-2">
                <span className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-indigo-500/20">1</span>
                Data Pelanggan & Akun
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-[#0B0E14] border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white font-medium"
                    placeholder="Masukkan nama"
                    value={customer.name}
                    onChange={(e) => setCustomer({...customer, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">No. WhatsApp</label>
                  <input 
                    required
                    type="tel" 
                    className="w-full bg-[#0B0E14] border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white font-medium"
                    placeholder="0812xxxxxx"
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Resi</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-[#0B0E14] border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white font-medium"
                    placeholder="email@anda.com"
                    value={customer.email}
                    onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID / Username Game</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-[#0B0E14] border border-slate-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 text-white font-medium"
                    placeholder="Nick/ID (Server)"
                    value={customer.gameId}
                    onChange={(e) => setCustomer({...customer, gameId: e.target.value})}
                  />
                </div>
              </div>

              {/* Header Step 2 */}
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4 mb-6 flex items-center gap-2">
                <span className="bg-indigo-500 w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-lg shadow-indigo-500/20">2</span>
                Metode Pembayaran
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Opsi QRIS GoPay */}
                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'gopay_qris' ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' : 'border-slate-800 bg-[#0B0E14] hover:border-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <QrCode className={paymentMethod === 'gopay_qris' ? 'text-indigo-400' : 'text-slate-500'} />
                    <input type="radio" name="payment" value="gopay_qris" checked={paymentMethod === 'gopay_qris'} onChange={() => setPaymentMethod('gopay_qris')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'gopay_qris' ? 'border-indigo-500' : 'border-slate-600'}`}>
                      {paymentMethod === 'gopay_qris' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">QRIS All Payment</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">GoPay, OVO, Dana, ShopeePay, BCA, dll.</p>
                  </div>
                </label>

                {/* Opsi OVO */}
                <label className={`cursor-pointer border rounded-xl p-4 flex flex-col gap-3 transition-all ${paymentMethod === 'ovo' ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/5' : 'border-slate-800 bg-[#0B0E14] hover:border-slate-700'}`}>
                  <div className="flex items-center justify-between">
                    <Smartphone className={paymentMethod === 'ovo' ? 'text-indigo-400' : 'text-slate-500'} />
                    <input type="radio" name="payment" value="ovo" checked={paymentMethod === 'ovo'} onChange={() => setPaymentMethod('ovo')} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${paymentMethod === 'ovo' ? 'border-indigo-500' : 'border-slate-600'}`}>
                      {paymentMethod === 'ovo' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">OVO Direct</h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">Bayar instan pakai aplikasi OVO.</p>
                  </div>
                </label>
              </div>

              {/* Alert Error */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Tombol Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Menghubungkan Gateway...
                  </span>
                ) : (
                  <>
                    Bayar Sekarang Rp {service.price.toLocaleString('id-ID')}
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER VIEW 2: HALAMAN STATUS & QRIS
  // ==========================================
  return <PaymentStatusView data={paymentResult} copyFn={copyToClipboard} />;
}

// ==========================================
// KOMPONEN STATUS PEMBAYARAN & QRIS RENDERER
// ==========================================
function PaymentStatusView({ data, copyFn }) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!data.expires_at) return;

    // Hitung sisa waktu mundur secara real-time
    const updateTimer = () => {
      // Pastikan format date dari API bisa di-parse
      const expiry = new Date(data.expires_at.replace(' ', 'T')).getTime(); 
      const now = new Date().getTime();
      const diff = Math.floor((expiry - now) / 1000);
      
      if (diff <= 0) {
        setTimeLeft(0);
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [data.expires_at]);

  const formatTime = (secs) => {
    if (secs <= 0) return "EXPIRED";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 selection:bg-indigo-500/30">
      <div className="bg-[#151A23] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Header Merah jika expired, Indigo jika aktif */}
        <div className={`p-6 text-center text-white transition-colors ${timeLeft <= 0 ? 'bg-red-600' : 'bg-indigo-600'}`}>
          <h2 className="text-sm font-semibold opacity-90 mb-1">
            {timeLeft <= 0 ? 'Waktu Pembayaran Habis' : 'Selesaikan Pembayaran'}
          </h2>
          <div className="text-4xl font-black mb-2 flex justify-center items-center gap-3">
            <Clock size={28} />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
          {timeLeft > 0 && (
            <p className="text-xs font-medium opacity-80">Menunggu pembayaran sebelum waktu habis</p>
          )}
        </div>

        {/* Detail Body */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800/80">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Invoice ID</p>
              <p className="text-sm font-mono text-white font-medium">{data.invoice_id}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Metode</p>
              <p className="text-sm font-bold text-indigo-400">{data.payment_method_label || data.payment_method}</p>
            </div>
          </div>

          <div className="text-center mb-8 bg-[#0B0E14] p-4 rounded-xl border border-slate-800">
            <p className="text-xs text-slate-400 mb-2 font-medium">Total Tagihan (Termasuk Kode Unik)</p>
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black text-emerald-400 tracking-tight">
                Rp {data.final_amount?.toLocaleString('id-ID')}
              </h1>
              <button 
                onClick={() => copyFn(data.final_amount?.toString())}
                className="p-2.5 bg-[#151A23] hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-all active:scale-95"
                title="Salin nominal"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          {/* Render QRIS Image jika metode adalah QRIS dan belum expired */}
          {data.qris_dynamic_image_url && timeLeft > 0 && (
            <div className="flex flex-col items-center mb-6">
              <div className="bg-white p-4 rounded-2xl mb-4 shadow-lg shadow-white/5">
                <img 
                  src={data.qris_dynamic_image_url} 
                  alt="QRIS" 
                  className="w-56 h-56 object-contain"
                  // Jika URL QR gagal dimuat (misal karena CSP ketat), render kotak peringatan
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.outerHTML = `<div class="w-56 h-56 flex flex-col items-center justify-center bg-slate-100 text-slate-500 text-xs text-center p-4"><svg class="mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>Gagal memuat QRIS. Silakan klik tombol Buka Halaman Pembayaran di bawah.</div>`;
                  }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium text-center max-w-[250px]">
                Scan QRIS di atas menggunakan aplikasi e-Wallet atau M-Banking Anda.
              </p>
            </div>
          )}

          {/* Fallback Payment Link (Untuk OVO, QRIS yang gagal load, atau mobile user) */}
          {data.payment_url && timeLeft > 0 && (
            <a 
              href={data.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl text-center flex items-center justify-center gap-2 mb-4 transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
            >
              Buka Halaman Pembayaran <ChevronRight size={18} />
            </a>
          )}

          <div className="flex items-start gap-3 bg-blue-950/20 border border-blue-900/30 text-blue-400 p-4 rounded-xl text-xs font-medium leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-blue-500" />
            <p>Sistem akan memverifikasi pembayaran secara otomatis. Anda dapat menutup halaman ini jika sudah melakukan pembayaran.</p>
          </div>
        </div>
      </div>
    </div>
  );
}


