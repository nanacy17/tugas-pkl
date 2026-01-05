"use client"
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Package, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  // State untuk Toast Logout
  const [toast, setToast] = useState({ show: false, message: "" });
  
  const router = useRouter()

  // Efek untuk menangkap sinyal logout dari URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'logout') {
      setToast({ show: true, message: "Sesi berakhir. Sampai jumpa lagi! 👋" });
      
      // Bersihkan URL agar notif tidak muncul lagi saat refresh
      window.history.replaceState({}, document.title, "/login");

      // Hilangkan toast setelah 3.5 detik
      const timer = setTimeout(() => {
        setToast({ show: false, message: "" });
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Email atau password salah.');
      setLoading(false);
    } else {
      // Gunakan window.location.replace agar session terbaca segar
      window.location.replace('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dekorasi Background Bulat Soft */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px] -z-10"></div>

      <div className="w-full max-w-[450px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-teal-600 p-3 rounded-2xl shadow-xl shadow-teal-200 mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Package className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">ReLove<span className="text-teal-600">.</span></h1>
          <p className="text-slate-400 font-medium mt-1">Marketplace barang preloved terpercaya</p>
        </div>

        {/* Card Login */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/60 border border-white/20 backdrop-blur-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Selamat Datang!</h2>
            <p className="text-slate-500 text-sm mt-1">Silakan masuk ke akun penjual kamu.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Email */}
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 font-medium"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex justify-between mb-2 ml-1">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="#" className="text-xs font-bold text-teal-600 hover:underline">Lupa?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 font-medium"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full relative overflow-hidden rounded-2xl bg-slate-900 py-4 text-white font-bold transition-all hover:bg-teal-600 active:scale-95 disabled:opacity-70 disabled:pointer-events-none shadow-xl shadow-slate-200"
            >
              <div className="relative z-10 flex items-center justify-center space-x-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>MEMPROSES...</span>
                  </>
                ) : (
                  <>
                    <span>MASUK SEKARANG</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400 font-medium">
              Belum punya akun? {' '}
              <Link href="/register" className="font-bold text-teal-600 hover:text-teal-700 hover:underline transition">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Support */}
        <p className="mt-8 text-center text-xs text-slate-400 font-medium">
          &copy; 2025 ReLove Indonesia. Semua Hak Dilindungi.
        </p>
      </div>

      {/* TOAST SYSTEM UNTUK LOGOUT */}
      <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="flex items-center space-x-4 px-8 py-4 rounded-full bg-slate-900 shadow-2xl border border-slate-800 text-white">
          <div className="bg-teal-500/20 p-1.5 rounded-full">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
            {toast.message}
          </p>
        </div>
      </div>

      {/* CSS untuk Animasi Shake jika Error */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}