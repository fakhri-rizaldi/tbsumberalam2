import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hammer, Truck, ShieldCheck, MapPin, Phone, Lock } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--ink)] font-sans overflow-x-hidden selection:bg-[var(--accent-primary)] selection:text-[var(--ink)]">
      
      {/* HEADER / NAVIGATION */}
      <nav className="fixed w-full z-50 bg-[var(--bg-base)]/80 backdrop-blur-md border-b-2 border-[var(--ink)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--accent-primary)] text-[var(--ink)] p-2 rounded-sm font-black text-xl border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)]">
              TB
            </div>
            <div>
              <h1 className="text-xl m-0 tracking-wider uppercase font-black">Sumber Alam 2</h1>
            </div>
          </div>
          <div className="hidden md:flex gap-8 font-bold text-sm tracking-widest uppercase">
            <a href="#beranda" className="hover:text-[var(--accent-primary)] transition-colors">Beranda</a>
            <a href="#layanan" className="hover:text-[var(--accent-primary)] transition-colors">Layanan</a>
            <a href="#kontak" className="hover:text-[var(--accent-primary)] transition-colors">Kontak</a>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="beranda" className="pt-32 pb-20 px-6 min-h-[90vh] flex items-center relative">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-block px-3 py-1 bg-[var(--ink)] text-[var(--surface)] font-bold text-xs uppercase tracking-widest mb-6">
              Toko Material Terbaik di Kota Anda
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-[1.1] mb-6">
              Membangun <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-primary)] to-[var(--danger)]">Impian Anda</span> <br/>
              Jadi Nyata
            </h2>
            <p className="text-lg md:text-xl opacity-80 mb-10 max-w-lg font-mono">
              Kami menyediakan bahan bangunan berkualitas tinggi dengan harga grosir. Solusi tepat untuk konstruksi rumah dan proyek besar Anda.
            </p>
            <div className="flex gap-4">
              <a href="#layanan" className="bg-[var(--ink)] text-[var(--surface)] px-8 py-4 font-bold uppercase tracking-wider border-2 border-[var(--ink)] hover:bg-[var(--surface)] hover:text-[var(--ink)] transition-colors shadow-[6px_6px_0_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--ink)]">
                Eksplorasi
              </a>
              <a href="#kontak" className="bg-[var(--accent-primary)] text-[var(--ink)] px-8 py-4 font-bold uppercase tracking-wider border-2 border-[var(--ink)] shadow-[6px_6px_0_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_var(--ink)] transition-all">
                Hubungi Kami
              </a>
            </div>
          </div>
          
          <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
            {/* Dekorasi Bentuk Geometris Modern */}
            <div className="absolute inset-0 bg-[var(--accent-primary)] rounded-tl-[100px] rounded-br-[100px] translate-x-4 translate-y-4 border-2 border-[var(--ink)]"></div>
            <div className="relative aspect-square md:aspect-[4/3] bg-[var(--ink)] rounded-tl-[100px] rounded-br-[100px] overflow-hidden border-2 border-[var(--ink)]">
              {/* Gambar Fiktif Gedung / Material (Gunakan Placeholder premium) */}
              <img 
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&fmt=webp&auto=format&fit=crop" 
                alt="TB Sumber Alam 2" 
                fetchpriority="high"
                decoding="async"
                className="w-full h-full object-cover opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section id="layanan" className="py-24 px-6 bg-[var(--ink)] text-[var(--surface)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase mb-4">Mengapa Memilih Kami?</h2>
            <p className="font-mono opacity-70 max-w-2xl mx-auto">Tiga pilar utama yang menjadikan TB. Sumber Alam 2 sebagai partner konstruksi terpercaya.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[var(--surface)] text-[var(--ink)] p-8 border-2 border-[var(--accent-primary)] rounded-md hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[var(--accent-primary)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_0_var(--ink)]">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">Kualitas Terjamin</h3>
              <p className="font-mono opacity-80 text-sm">Semua material yang kami suplai berasal dari pabrik berstandar SNI. Menjamin kokohnya bangunan Anda puluhan tahun lamanya.</p>
            </div>
            
            <div className="bg-[var(--surface)] text-[var(--ink)] p-8 border-2 border-[var(--accent-primary)] rounded-md hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[var(--accent-primary)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_0_var(--ink)]">
                <Truck size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">Pengiriman Cepat</h3>
              <p className="font-mono opacity-80 text-sm">Armada pengiriman kami selalu siaga. Pesan hari ini, barang sampai di lokasi proyek Anda hari ini juga (S&K Berlaku).</p>
            </div>

            <div className="bg-[var(--surface)] text-[var(--ink)] p-8 border-2 border-[var(--accent-primary)] rounded-md hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[var(--accent-primary)] border-2 border-[var(--ink)] rounded-full flex items-center justify-center mb-6 shadow-[4px_4px_0_0_var(--ink)]">
                <Hammer size={32} />
              </div>
              <h3 className="text-2xl font-bold uppercase mb-4">Material Terlengkap</h3>
              <p className="font-mono opacity-80 text-sm">Dari semen, paku, besi beton, hingga aksesoris kelistrikan dan pipa. Semua tersedia dalam satu atap untuk kemudahan Anda.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="kontak" className="pt-20 pb-8 px-6 bg-[var(--bg-base)] border-t border-[var(--ink)]/20 relative">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-[var(--ink)] text-[var(--surface)] p-2 rounded-sm font-black text-xl">
                TB
              </div>
              <h2 className="text-2xl font-black uppercase m-0">Sumber Alam 2</h2>
            </div>
            <p className="font-mono opacity-70 mb-6 max-w-sm">
              Toko material bangunan kebanggaan kita semua. Membantu pembangunan infrastruktur dengan material yang kokoh.
            </p>
          </div>
          
          <div className="flex flex-col md:items-end font-mono">
            <h3 className="font-bold text-lg uppercase font-sans mb-4 border-b-2 border-[var(--accent-primary)] pb-2 inline-block">Hubungi Kami</h3>
            <div className="space-y-4 text-sm opacity-80 flex flex-col md:items-end">
              <div className="flex items-center gap-3">
                <span>Jl. Jendral Sudirman No. 123, Kota Anda</span>
                <MapPin size={18} className="text-[var(--accent-primary)] hidden md:block" />
              </div>
              <div className="flex items-center gap-3">
                <span>(021) 1234-5678 / 0812-3456-7890</span>
                <Phone size={18} className="text-[var(--accent-primary)] hidden md:block" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center font-mono text-xs opacity-50 border-t border-[var(--ink)]/10 pt-8 flex justify-between items-center relative">
          <span>&copy; {new Date().getFullYear()} TB. Sumber Alam 2. All rights reserved.</span>
          
          {/* SECRET LOGIN BUTTON */}
          <button 
            onClick={() => navigate('/login')}
            className="w-8 h-8 rounded-full hover:bg-[var(--ink)]/10 flex items-center justify-center transition-colors text-[var(--ink)]/20 hover:text-[var(--ink)] cursor-pointer"
            title="Sistem Back-Office (Admin Only)"
          >
            <Lock size={14} />
          </button>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;
