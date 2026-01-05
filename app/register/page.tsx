"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, Lock, Package, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/register', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        // Tunggu 2 detik agar user bisa melihat pesan sukses, lalu pindah ke login
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.message || 'Pendaftaran gagal. Coba email lain.')
        setLoading(false)
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dekorasi Background Bulat Soft */}
      <div className="absolute top-[-5%] right-[-5%] w-[35%] h-[35%] bg-emerald-50 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[35%] h-[35%] bg-teal-50 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-[480px]">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-600 p-3 rounded-2xl shadow-xl shadow-teal-100 mb-4 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Package className="text-white w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Buka Toko<span className="text-teal-600">.</span></h1>
          <p className="text-slate-400 font-medium mt-1 text-center">Bergabunglah dengan ribuan penjual preloved lainnya</p>
        </div>

        {/* Card Register */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-slate-200/60 border border-white/20 backdrop-blur-sm">
          
          {isSuccess ? (
            /* Tampilan Sukses */
            <div className="py-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Berhasil Daftar!</h2>
                <p className="text-slate-500 mt-2">Akunmu sudah siap. Mengalihkan kamu ke halaman login...</p>
            </div>
          ) : (
            /* Form Pendaftaran */
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800">Daftar Akun Baru</h2>
                <p className="text-slate-500 text-sm mt-1">Mulai bisnis preloved-mu dalam hitungan menit.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Nama */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-1.5">Nama Lengkap</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 font-medium"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-1.5">Email Aktif</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                      type="email"
                      placeholder="contoh@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 font-medium"
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 mb-1.5">Buat Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                    <input
                      type="password"
                      placeholder="Min. 8 karakter"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 py-3.5 pl-12 pr-4 text-slate-700 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 font-medium"
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-bold">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full relative overflow-hidden rounded-2xl bg-slate-900 py-4 text-white font-bold transition-all hover:bg-teal-600 active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-slate-200 mt-2"
                >
                  <div className="relative z-10 flex items-center justify-center space-x-2">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="tracking-wide">MENDAFTARKAN...</span>
                      </>
                    ) : (
                      <>
                        <span className="tracking-wide">DAFTAR SEKARANG</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Link ke Login */}
              <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-400 font-medium">
                  Sudah punya akun? {' '}
                  <Link href="/login" className="font-bold text-teal-600 hover:text-teal-700 transition px-1">
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Info Tambahan */}
        <p className="mt-8 text-center text-[11px] text-slate-400 font-medium px-4 leading-relaxed">
          Dengan mendaftar, Anda menyetujui <span className="underline cursor-pointer">Syarat & Ketentuan</span> serta <span className="underline cursor-pointer">Kebijakan Privasi</span> ReLove Indonesia.
        </p>
      </div>
    </div>
  )
}