"use client"
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { 
  User, Plus, Package, ShoppingBag, 
  Search, Wallet, TrendingUp, 
  Trash2, X, Loader2, CheckCircle2, LogOut, RefreshCw, Star, ArchiveX, Image as ImageIcon,
  Calendar, Tag, Bell, Globe, ChevronLeft, ChevronRight, Filter, Pencil
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // --- STATE UTAMA ---
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [profile, setProfile] = useState({ shop_name: "", bio: "", location: "", operational_hours: "" });
  const [loadingData, setLoadingData] = useState(true);
  const [randomTip, setRandomTip] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  // --- STATE PAGINATION & FILTER ---
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const itemsPerPage = 8;

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  
  // --- STATE DATA PILIHAN ---
  const [selectedProduct, setSelectedProduct] = useState<any>(null); 
  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Pakaian", description: "", status: "Tersedia" });
  const [editForm, setEditForm] = useState({ id: null, name: "", price: "", category: "Pakaian", description: "", status: "Tersedia" });
  const [profileForm, setProfileForm] = useState({ shop_name: "", bio: "", location: "", operational_hours: "" });
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [productToUpdate, setProductToUpdate] = useState<{id: number, status: string} | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const categories = [
  { name: "Pakaian", icon: "👕" },
  { name: "Elektronik", icon: "💻" },
  { name: "Hobi", icon: "🎨" },
  { name: "Lainnya", icon: "📦" }
];
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error'}>({
  show: false,
  message: "",
  type: 'success'
});

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  setToast({ show: true, message, type });
  setTimeout(() => setToast({ ...toast, show: false }), 3000); // Hilang setelah 3 detik
};
  const tipsKoleksi = [
    "Balas pesan kurang dari 10 menit bisa ningkatin konversi penjualan sampai 3x lipat! ⚡",
    "Panggil pembeli dengan sebutan 'Kak' agar terasa lebih akrab dan personal. 😊",
    "Setelah barang sampai, jangan ragu minta review bintang 5 ke pembeli ya! ⭐",
    "Gunakan background polos (putih/abu) saat foto produk agar fokus pembeli tidak teralihkan. 📸",
    "Upload video singkat kondisi barang (spill detail) bisa bikin pembeli 80% lebih yakin. 🎥",
    "Cantumkan detail ukuran (P x L) di deskripsi untuk mengurangi pertanyaan 'muat gak kak?'. 📏",
    "Coba teknik harga psikologi, misal: Rp 149.000 terasa jauh lebih murah dari Rp 150.000. 💸",
    "Kasih sedikit diskon untuk pembeli yang beli lebih dari 2 barang (Bundling). 🎁",
    "Berikan 'Free Gift' kecil seperti stiker atau ikat rambut untuk kejutan manis bagi pembeli. ✨",
    "Selalu videokan proses packing sebagai bukti kuat kalau ada komplain dari pembeli. 📹",
    "Manfaatkan fitur 'Sundul' atau Update Produk setiap jam 7 malam (waktu santai pembeli). 🔄",
    "Gunakan bubble wrap berlapis untuk barang pecah belah, keamanan nomor satu! 📦",
    "Tulis bio toko yang informatif, seperti lokasi pengiriman dan jadwal kurir pickup. 🚚",
    "Gunakan foto profil toko yang estetik atau logo yang jelas supaya gampang diingat. 🎨",
    "Konsisten dengan kategori barang yang dijual bisa bikin tokomu jadi spesialis di mata pembeli. 🏆"
  ];

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [prodRes, profRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/user/profile')
      ]);
      if (prodRes.ok) setProducts(await prodRes.json());
      if (profRes.ok) setProfile(await profRes.json());
    } catch (error) { console.error(error); } finally { setLoadingData(false); }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push('/login')
    if (status === "authenticated") {
      fetchData();
      setRandomTip(tipsKoleksi[Math.floor(Math.random() * tipsKoleksi.length)]);
      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      const interval = setInterval(() => {
        setRandomTip((prevTip) => {
          const tipsLainnya = tipsKoleksi.filter(t => t !== prevTip);
          return tipsLainnya[Math.floor(Math.random() * tipsLainnya.length)];
        });
      }, 30000);
      return () => { clearInterval(timer); clearInterval(interval); }
    }
  }, [status, router, fetchData]);

  // --- HANDLER FUNCTIONS ---
  const handlePostProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setNewProduct({ 
        name: "", 
        price: "", 
        category: "Pakaian", 
        description: "", 
        status: "Tersedia" 
      });
      fetchData();
      // Munculkan toast sukses
      showToast("Barang berhasil dipajang!", "success");
    } else {
      // Munculkan toast error jika respons server tidak ok
      showToast("Gagal memposting barang", "error");
    }
  } catch (err) {
    // Munculkan toast error jika terjadi masalah koneksi/server
    showToast("Terjadi kesalahan koneksi", "error");
  } finally {
    setIsSubmitting(false);
  }
};
  
const handleEditProduct = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch(`/api/products/${editForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // Mengirim data dengan memastikan price adalah tipe Number
      body: JSON.stringify({
        ...editForm,
        price: Number(editForm.price)
      }),
    });

    if (res.ok) {
      setIsEditModalOpen(false);
      setIsDetailModalOpen(false); // Tutup detail jika sedang terbuka
      fetchData();
      
      // Munculkan toast sukses
      showToast("Perubahan berhasil disimpan!", "success");
    } else {
      showToast("Gagal memperbarui barang", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Terjadi kesalahan sistem", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    const res = await fetch('/api/user/profile/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm),
    });

    if (res.ok) {
      setIsEditProfileOpen(false);
      fetchData();
      // Notifikasi sukses yang estetik
      showToast("Profil Toko berhasil diperbarui!", "success");
    } else {
      showToast("Gagal memperbarui profil", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Terjadi kesalahan koneksi", "error");
  } finally {
    setIsSubmitting(false);
  }
};

  const executeDelete = async () => {
  const id = productToDelete || selectedProduct?.id;
  if (!id) return;
  
  try {
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    
    if (res.ok) {
      fetchData();
      setIsDeleteModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedProduct(null);
      
      // Notifikasi sukses yang lega
      showToast("Barang telah dihapus dari toko", "success");
    } else {
      showToast("Gagal menghapus barang", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Terjadi kesalahan koneksi", "error");
  }
};

const executeUpdateStatus = async () => {
  const target = productToUpdate || { id: selectedProduct?.id, status: selectedProduct?.status };
  if (!target.id) return;

  // Tentukan status baru untuk pesan notifikasi
  const newStatus = target.status === 'Tersedia' ? 'Terjual' : 'Tersedia';

  try {
    const res = await fetch(`/api/products/${target.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      fetchData();
      setIsStatusModalOpen(false);
      setIsDetailModalOpen(false);
      setSelectedProduct(null);
      
      // Notifikasi sukses yang dinamis
      showToast(
        newStatus === 'Terjual' 
          ? "Selamat! Barang telah terjual" 
          : "Barang kembali tersedia di toko", 
        "success"
      );
    } else {
      showToast("Gagal memperbarui status", "error");
    }
  } catch (err) {
    console.error(err);
    showToast("Terjadi kesalahan koneksi", "error");
  }
};

const handleLogout = () => {
  setIsLogoutModalOpen(true);
};

const confirmLogout = async () => {
  window.location.href = "/login?status=logout";
};

  // --- LOGIKA FILTER & PAGINATION ---
  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory]);

  const totalOmzet = products.filter((p: any) => p.status === 'Terjual').reduce((sum, p: any) => sum + Number(p.price), 0);
  const totalAktif = products.filter((p: any) => p.status === 'Tersedia').length;

  if (status === "loading") return <div className="flex min-h-screen items-center justify-center bg-white"><Loader2 className="w-10 h-10 animate-spin text-teal-500" /></div>

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* --- NAVBAR PREMIUM --- */}
      <nav className="bg-teal-600 sticky top-0 z-[100] px-6 h-16 flex justify-between items-center text-white shadow-xl">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="bg-white p-2 rounded-xl shadow-lg transition-transform group-hover:rotate-12">
              <Package className="text-teal-600 w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter leading-none">ReLove</span>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Seller System</span>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-6 border-l border-white/20 pl-8">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold uppercase opacity-60 tracking-widest">Waktu Lokal</span>
              <span className="text-xs font-mono font-bold tracking-wider">
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
              </span>
            </div>
            <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:text-teal-200 transition-colors">
              <Globe className="w-3 h-3" />
              <span>Preview Toko</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <button className="relative p-2.5 hover:bg-white/10 rounded-2xl transition-all group">
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-teal-600"></div>
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center space-x-2 bg-white text-teal-600 hover:bg-teal-50 px-5 py-2.5 rounded-2xl transition-all font-black shadow-lg active:scale-95">
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase tracking-widest">Keluar</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* HERO SECTION DENGAN LOGIKA DINAMIS */}
        <div className="bg-white rounded-[3rem] p-10 mb-8 border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal-50 rounded-full -mr-20 -mt-20 opacity-60 blur-3xl animate-pulse"></div>
          <div className="relative z-10 text-center md:text-left">
             <div className="inline-flex items-center space-x-2 bg-teal-50 text-teal-600 px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 fill-teal-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Dashboard</span>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Halo, {session?.user?.name || "Seller"}! ✨</h1>
            <p className="text-slate-500 mt-2 font-medium max-w-md">
              {totalAktif > 0 ? (
                <>Senang melihatmu kembali. Kamu punya <span className="text-teal-600 font-bold">{totalAktif} barang</span> aktif untuk dikelola hari ini.</>
              ) : (
                <>Tokomu masih terlihat sepi nih. Yuk, <span className="text-teal-600 font-bold">mulai posting barang</span> pertama kamu dan raih penjualan hari ini! 🚀</>
              )}
            </p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="group relative z-10 flex items-center space-x-4 bg-teal-600 text-white px-10 py-5 rounded-[2.5rem] font-black hover:bg-teal-700 transition-all active:scale-95 shadow-2xl shadow-teal-200">
            <Plus className="w-7 h-7 transition-transform duration-500 group-hover:rotate-180" />
            <span className="uppercase text-sm tracking-[0.2em]">Posting Barang</span>
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Total Omzet" value={`Rp ${totalOmzet.toLocaleString('id-ID')}`} icon={<Wallet />} trend="Pencairan" color="teal" />
          <StatCard label="Barang Aktif" value={totalAktif} icon={<Package />} trend="Ready" color="teal" />
          <StatCard label="Barang Terjual" value={products.length - totalAktif} icon={<ShoppingBag />} trend="Sold" color="emerald" />
          <StatCard label="Total Traffic" value="1.2K" icon={<TrendingUp />} trend="+12% Baru" color="purple" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* INVENTARIS DENGAN PAGINATION & FILTER */}
          <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[650px]">
            <div className="p-10 border-b border-slate-50 flex flex-col lg:flex-row justify-between items-center gap-6">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Daftar Inventaris</h3>
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                <div className="relative w-full sm:w-48">
                  <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black uppercase outline-none appearance-none cursor-pointer"
                  >
                    <option>Semua</option><option>Pakaian</option><option>Elektronik</option><option>Hobi</option><option>Lainnya</option>
                  </select>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Cari nama..." className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-teal-500/10 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto">
              {loadingData ? (
                <div className="p-24 text-center animate-pulse text-slate-300 font-black uppercase text-[10px] tracking-widest">Sinkronisasi Data...</div>
              ) : currentItems.length > 0 ? (
                <>
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                      <tr><th className="px-10 py-6">Informasi Produk</th><th className="px-6 py-6">Harga</th><th className="px-6 py-6 text-center">Status</th><th className="px-10 py-6 text-right">Aksi</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {currentItems.map((p: any) => (
                        <tr key={p.id} className="group hover:bg-teal-50/30 transition-all duration-300">
                          <td className="px-10 py-7 flex items-center space-x-6 cursor-pointer" onClick={() => { setSelectedProduct(p); setIsDetailModalOpen(true); }}>
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                               {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" /> : <ImageIcon className="text-slate-300 w-6 h-6" />}
                            </div>
                            <div>
                              <p className="text-base font-black text-slate-800 group-hover:text-teal-600 transition-colors">{p.name}</p>
                              <p className="text-[9px] text-slate-400 uppercase font-black tracking-[0.2em] mt-1">{p.category}</p>
                            </div>
                          </td>
                          <td className="px-6 py-7 font-black text-slate-700 text-sm italic tracking-tight">Rp {Number(p.price).toLocaleString('id-ID')}</td>
                          <td className="px-6 py-7 text-center">
                            <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Tersedia' ? 'bg-teal-500 text-white shadow-lg shadow-teal-100' : 'bg-slate-100 text-slate-400'}`}>{p.status}</span>
                          </td>
                          <td className="px-10 py-7 text-right opacity-0 group-hover:opacity-100 transition-all">
                            <div className="flex justify-end space-x-2">
                              <button onClick={() => { setEditForm(p); setIsEditModalOpen(true); }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-teal-600 shadow-sm transition-all"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => { setProductToUpdate({id: p.id, status: p.status}); setIsStatusModalOpen(true); }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-500 shadow-sm transition-all"><CheckCircle2 className="w-4 h-4" /></button>
                              <button onClick={() => { setProductToDelete(p.id); setIsDeleteModalOpen(true); }} className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 shadow-sm transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* PAGINATION CONTROLS */}
                  {filteredProducts.length > itemsPerPage && (
                    <div className="p-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Hal {currentPage} dari {totalPages} — {filteredProducts.length} Produk
                      </p>
                      <div className="flex items-center space-x-2">
                        <button 
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="flex items-center space-x-1">
                          {[...Array(totalPages)].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'bg-white border border-slate-200 text-slate-400 hover:border-teal-200'}`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                        <button 
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          className="p-3 rounded-xl border border-slate-200 bg-white disabled:opacity-30 hover:bg-teal-50 hover:text-teal-600 transition-all shadow-sm"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-32 flex flex-col items-center text-center">
                  <div className="bg-slate-50 p-8 rounded-full mb-6 text-slate-200"><ArchiveX className="w-16 h-16" /></div>
                  <p className="text-slate-800 text-xl font-black uppercase tracking-tight">Tidak Ada Hasil</p>
                  <p className="text-slate-400 text-xs mt-2 font-medium">Coba cari dengan kata kunci lain atau kategori berbeda.</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm text-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-teal-50 to-transparent opacity-60"></div>
               <div className="relative text-center">
                <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl ring-1 ring-slate-100 group-hover:rotate-3 transition-transform duration-500"><User className="w-12 h-12 text-teal-600" /></div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-tight">{profile.shop_name || "Toko ReLove"}</h2>
                <div className="mt-8 p-7 bg-slate-50 rounded-[2.5rem] text-left border border-slate-100 space-y-5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em]">Bio Toko</p>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{profile.bio || "Belum ada deskripsi profil."}</p>
                  </div>
                  <div className="space-y-3 pt-5 border-t border-slate-200/50 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex justify-between items-center"><span className="text-slate-400">Lokasi</span><span className="text-slate-800">{profile.location || "-"}</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-400">Operasional</span><span className="text-slate-800">{profile.operational_hours || "-"}</span></div>
                  </div>
                  <button onClick={() => { setProfileForm({...profile}); setIsEditProfileOpen(true); }} className="w-full py-4.5 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-teal-600 uppercase tracking-widest hover:bg-teal-50 hover:border-teal-100 transition-all shadow-sm">Edit Pengaturan</button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 rounded-[3rem] p-8 text-white shadow-2xl shadow-teal-200/50 relative overflow-hidden min-h-[220px] group transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -right-10 -bottom-10 opacity-20 transition-transform group-hover:scale-150 duration-1000 rotate-12"><Star className="w-48 h-48 fill-white" /></div>
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex items-center space-x-3 mb-6 relative z-10">
                <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
                  <Star className="w-4 h-4 animate-pulse fill-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">Tips Seller Pro</span>
              </div>
              <div className="relative z-10 min-h-[80px]">
                <p key={randomTip} className="text-base font-bold italic leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-md">"{randomTip}"</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/10">
                <div key={`bar-${randomTip}`} className="bg-white/60 h-full animate-[progress_30s_linear_forwards] origin-left" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* --- MODAL EDIT PRODUK (BARU) --- */}
{isEditModalOpen && (
  <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>
    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
      
      {/* Header */}
      <div className="p-10 pb-4 flex justify-between items-center bg-white z-20">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Edit Barang</h2>
        <button onClick={() => setIsEditModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-all">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 pt-4">
        <form onSubmit={handleEditProduct} className="space-y-8">
          {/* Nama Produk */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Nama Produk</label>
            <input required type="text" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Harga */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Harga Jual (Rp)</label>
              <input required type="number" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black text-sm" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} />
            </div>

            {/* Custom Dropdown Kategori untuk Edit */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Kategori</label>
              <button
                type="button"
                onClick={() => setIsEditDropdownOpen(!isEditDropdownOpen)}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between group hover:border-teal-200 transition-all text-sm font-black"
              >
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  {editForm.category}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isEditDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {isEditDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsEditDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95">
                    {["Pakaian", "Elektronik", "Hobi", "Lainnya"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, category: cat });
                          setIsEditDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          editForm.category === cat ? 'bg-teal-50 text-teal-600' : 'hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Deskripsi Produk</label>
            <textarea className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none h-40 resize-none text-sm font-medium leading-relaxed" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} />
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="p-10 pt-4 bg-white border-t border-slate-50">
        <button onClick={handleEditProduct} disabled={isSubmitting} className="w-full py-6 bg-teal-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-teal-100 active:scale-95 transition-all">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* MODAL DETAIL */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in" onClick={() => setIsDetailModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-3xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row h-auto max-h-[90vh]">
            <div className="md:w-1/2 bg-slate-100 relative h-72 md:h-auto">
               {selectedProduct.image_url ? <img src={selectedProduct.image_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon className="w-20 h-20" /></div>}
            </div>
            <div className="md:w-1/2 p-12 flex flex-col justify-between bg-white overflow-y-auto">
              <button onClick={() => setIsDetailModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-50 rounded-full transition-all"><X className="w-6 h-6 text-slate-400" /></button>
              <div>
                <div className="flex items-center space-x-2 text-teal-600 mb-3"><Tag className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-[0.2em]">{selectedProduct.category}</span></div>
                <h2 className="text-4xl font-black text-slate-800 leading-tight mb-3 tracking-tighter">{selectedProduct.name}</h2>
                <p className="text-3xl font-black text-teal-600 mb-8 italic">Rp {Number(selectedProduct.price).toLocaleString('id-ID')}</p>
                <p className="text-base text-slate-600 font-medium leading-relaxed mb-10">{selectedProduct.description || "Pemilik belum memberikan deskripsi lengkap."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-50">
                {/* TOMBOL EDIT DI DETAIL */}
                <button onClick={() => { setEditForm(selectedProduct); setIsEditModalOpen(true); }} className="flex items-center justify-center space-x-3 py-5 bg-teal-50 text-teal-600 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-teal-600 hover:text-white transition-all">
                  <Pencil className="w-4 h-4" />
                  <span>Edit Data</span>
                </button>
                <button onClick={() => { setProductToDelete(selectedProduct.id); setIsDeleteModalOpen(true); }} className="flex items-center justify-center space-x-3 py-5 bg-slate-50 text-slate-400 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-red-50 hover:text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POST */}
{isModalOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
    <div className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8">
      
      {/* Header */}
      <div className="p-10 pb-4 flex justify-between items-center bg-white z-20">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Post Barang Baru</h2>
        <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-slate-50 rounded-full transition-all">
          <X className="w-6 h-6 text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-10 pt-4">
        <form onSubmit={handlePostProduct} className="space-y-8">
          {/* Nama Produk */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Nama Produk</label>
            <input required type="text" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold" placeholder="Contoh: Jaket Vintage Denim" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Harga */}
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Harga Jual (Rp)</label>
              <input required type="number" className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-black text-sm" placeholder="150000" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} />
            </div>

            {/* Custom Dropdown Kategori */}
            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Kategori</label>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-between group hover:border-teal-200 transition-all text-sm font-black"
              >
                <span>{newProduct.category}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl p-2 z-40 animate-in fade-in zoom-in-95">
                    {["Pakaian", "Elektronik", "Hobi", "Lainnya"].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setNewProduct({ ...newProduct, category: cat });
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          newProduct.category === cat ? 'bg-teal-50 text-teal-600' : 'hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 ml-3 mb-2 block tracking-[0.2em]">Kondisi & Deskripsi</label>
            <textarea className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none h-40 resize-none text-sm font-medium leading-relaxed" placeholder="Jelaskan kondisi barang..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} />
          </div>
        </form>
      </div>

      {/* Footer / Button */}
      <div className="p-10 pt-4 bg-white border-t border-slate-50">
        <button onClick={handlePostProduct} disabled={isSubmitting} className="w-full py-6 bg-teal-600 text-white font-black uppercase text-xs tracking-[0.3em] rounded-[1.5rem] shadow-2xl shadow-teal-100 active:scale-95 transition-all">
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Posting Barang Sekarang"}
        </button>
      </div>
    </div>
  </div>
)}

      {/* MODAL KONFIRMASI */}
      {(isStatusModalOpen || isDeleteModalOpen) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-12 rounded-[4rem] max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95">
             <div className={`w-20 h-20 ${isDeleteModalOpen ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'} rounded-[2rem] flex items-center justify-center mx-auto mb-8 transition-transform animate-bounce`}>{isDeleteModalOpen ? <Trash2 className="w-10 h-10" /> : <RefreshCw className="w-10 h-10" />}</div>
             <h3 className="text-2xl font-black uppercase text-slate-800 mb-4 tracking-tighter">{isDeleteModalOpen ? 'Hapus Barang?' : 'Ganti Status?'}</h3>
             <p className="text-[11px] text-slate-400 mb-10 font-bold uppercase tracking-widest leading-relaxed px-4">Tindakan ini akan diperbarui secara real-time pada halaman toko publik.</p>
             <div className="flex space-x-4">
               <button onClick={() => { setIsStatusModalOpen(false); setIsDeleteModalOpen(false); }} className="flex-1 py-5 bg-slate-50 text-slate-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all">Batal</button>
               <button onClick={isDeleteModalOpen ? executeDelete : executeUpdateStatus} className={`flex-1 py-5 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 ${isDeleteModalOpen ? 'bg-red-500 shadow-red-100' : 'bg-emerald-500 shadow-emerald-100'}`}>Lanjutkan</button>
             </div>
          </div>
        </div>
      )}
      
      {/* MODAL EDIT PROFIL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsEditProfileOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95">
            <h2 className="text-3xl font-black text-slate-800 uppercase mb-8 tracking-tighter">Update Toko</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <input placeholder="Nama Toko" className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none font-bold" value={profileForm.shop_name} onChange={(e) => setProfileForm({...profileForm, shop_name: e.target.value})} />
              <textarea placeholder="Bio Singkat Toko" className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none h-28 resize-none text-sm font-medium" value={profileForm.bio} onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="Kota" className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold" value={profileForm.location} onChange={(e) => setProfileForm({...profileForm, location: e.target.value})} />
                <input placeholder="Jam Buka" className="w-full px-7 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] outline-none text-sm font-bold" value={profileForm.operational_hours} onChange={(e) => setProfileForm({...profileForm, operational_hours: e.target.value})} />
              </div>
              <button disabled={isSubmitting} className="w-full py-6 bg-teal-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] shadow-xl transition-all active:scale-95">Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI LOGOUT */}
{isLogoutModalOpen && (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
    {/* Overlay Gelap */}
    <div 
      className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
      onClick={() => setIsLogoutModalOpen(false)}
    ></div>
    
    {/* Kotak Modal */}
    <div className="relative bg-white w-full max-w-sm rounded-[3.5rem] p-12 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
      <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 ring-8 ring-rose-50/50">
        <LogOut className="w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
        Yakin mau keluar?
      </h2>
      <p className="text-slate-400 text-xs font-medium leading-relaxed mb-10 px-4">
        Kamu perlu login kembali untuk mengelola stok dan melihat laporan penjualan tokomu.
      </p>
      
      <div className="flex flex-col gap-3">
        <button 
          onClick={confirmLogout}
          className="w-full py-5 bg-rose-500 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] shadow-lg shadow-rose-200 active:scale-95 transition-all"
        >
          Ya, Keluar Sekarang
        </button>
        
        <button 
          onClick={() => setIsLogoutModalOpen(false)}
          className="w-full py-5 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-[1.5rem] hover:bg-slate-100 transition-all"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
)}

      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center space-x-4 px-8 py-5 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border backdrop-blur-xl ${
          toast.type === 'success' 
          ? 'bg-teal-600/90 border-teal-400 text-white' 
          : 'bg-rose-600/90 border-rose-400 text-white'
        }`}>
          <div className="bg-white/20 p-2 rounded-xl">
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap">
            {toast.message}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend, color }: any) {
  const colors: any = { 
    teal: "bg-teal-50 text-teal-600 ring-teal-100", 
    emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100", 
    purple: "bg-purple-50 text-purple-600 ring-purple-100" 
  };
  return (
    <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm group hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6 ring-4 ${colors[color]}`}>{icon}</div>
        <div className="bg-slate-50 text-slate-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em]">{trend}</div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] relative z-10">{label}</p>
      <p className="text-3xl font-black text-slate-800 mt-2 tracking-tighter group-hover:text-teal-600 transition-colors relative z-10">{value}</p>
    </div>
  )
}