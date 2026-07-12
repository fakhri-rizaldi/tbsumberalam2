import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Package2, ArrowRightLeft, ArchiveRestore, Users, CalendarCheck, Wallet, TrendingUp, BarChart2 } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [laporan, setLaporan] = useState(null);
  const [absensiToday, setAbsensiToday] = useState({ hadir: 0, izin: 0, sakit: 0, alpa: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const [resLaporan, resAbsensi] = await Promise.all([
          api.get('/laporan/ringkasan'),
          api.get(`/absensi?tanggal=${today}`)
        ]);
        
        setLaporan(resLaporan.data.data);
        
        const absData = resAbsensi.data.data || [];
        const recap = { hadir: 0, izin: 0, sakit: 0, alpa: 0 };
        absData.forEach(item => {
          if (item.status) recap[item.status.toLowerCase()] += 1;
        });
        setAbsensiToday(recap);

      } catch (err) {
        console.error("Gagal memuat data dashboard utama", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <main className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
          <h2 className="text-3xl font-bold uppercase">Dashboard Eksekutif</h2>
          <p className="font-mono text-sm opacity-70">Ringkasan harian TB. Sumber Alam 2</p>
        </div>

        {/* TOP SECTION: QUICK INSIGHTS */}
        {!loading && (
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            
            {/* KIRI: CHART PENDAPATAN */}
            <div className="lg:col-span-2 bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
              <div className="flex justify-between items-center mb-4 border-b-2 border-[var(--ink)]/10 pb-2">
                <h3 className="font-bold uppercase flex items-center gap-2 m-0">
                  <BarChart2 size={20} /> Tren Pendapatan (7 Hari)
                </h3>
                <span className="font-mono font-bold text-[var(--accent-secondary)]">
                  Hari Ini: Rp {Number(laporan?.pendapatan_hari_ini || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={laporan?.grafik_pendapatan || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#23272B" opacity={0.1} />
                    <XAxis dataKey="tanggal" tick={{fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#23272B'}} axisLine={{stroke: '#23272B', strokeWidth: 2}} />
                    <YAxis tickFormatter={(val) => `Rp${val/1000}k`} tick={{fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#23272B'}} width={60} axisLine={{stroke: '#23272B', strokeWidth: 2}} />
                    <Tooltip 
                      cursor={{fill: '#23272B', opacity: 0.05}} 
                      contentStyle={{backgroundColor: '#FFFFFF', border: '2px solid #23272B', borderRadius: '4px', fontFamily: 'IBM Plex Mono', fontWeight: 'bold'}}
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                    />
                    <Bar dataKey="pendapatan" fill="var(--accent-primary)" radius={[2, 2, 0, 0]} stroke="var(--ink)" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KANAN: ABSENSI QUICK ACCESS */}
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)] flex flex-col">
              <div className="mb-4 border-b-2 border-[var(--ink)]/10 pb-2">
                <h3 className="font-bold uppercase flex items-center gap-2 m-0">
                  <Users size={20} /> Absensi Hari Ini
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3 font-mono">
                <div className="flex justify-between items-center p-3 bg-[var(--success)]/10 border border-[var(--success)] rounded-sm">
                  <span className="font-bold text-[var(--success)]">HADIR</span>
                  <span className="text-xl font-black text-[var(--success)]">{absensiToday.hadir}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-sm">
                  <span className="font-bold text-[var(--danger)]">ALPA</span>
                  <span className="text-xl font-black text-[var(--danger)]">{absensiToday.alpa}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[var(--ink)]/5 border border-[var(--ink)]/20 rounded-sm">
                  <span className="font-bold opacity-70">IZIN / SAKIT</span>
                  <span className="text-xl font-black opacity-70">{absensiToday.izin + absensiToday.sakit}</span>
                </div>
              </div>
              <Link to="/absensi" className="mt-4 block text-center py-2 bg-[var(--ink)] text-[var(--surface)] text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[var(--accent-primary)] hover:text-[var(--ink)] transition-colors">
                Kelola Absensi
              </Link>
            </div>
          </div>
        )}

        {/* BOTTOM SECTION: MODULES GRID */}
        <div className="mb-4">
          <h3 className="text-xl font-bold uppercase">Akses Modul</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <Link to="/kasir" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--accent-primary)] border-2 border-[var(--ink)] rounded-md">
                  <ArrowRightLeft size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Kasir (POS)</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">Sistem transaksi kasir.</p>
            </div>
          </Link>

          {/* Card 2 */}
          <Link to="/barang" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--bg-base)] border border-[var(--ink)]/20 rounded-md group-hover:border-[var(--ink)] transition-colors">
                  <Package2 size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Barang</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">Master data barang & harga.</p>
            </div>
          </Link>

          {/* Card 3 */}
          <Link to="/stok" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--bg-base)] border border-[var(--ink)]/20 rounded-md group-hover:border-[var(--ink)] transition-colors">
                  <ArchiveRestore size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Stok Gudang</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">In/Out dan kartu stok.</p>
            </div>
          </Link>

          {/* Card 4 */}
          <Link to="/laporan" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--bg-base)] border border-[var(--ink)]/20 rounded-md group-hover:border-[var(--ink)] transition-colors">
                  <TrendingUp size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Laporan</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">Omzet dan rekap aset.</p>
            </div>
          </Link>

          {/* Card 5 */}
          <Link to="/karyawan" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--bg-base)] border border-[var(--ink)]/20 rounded-md group-hover:border-[var(--ink)] transition-colors">
                  <Users size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Karyawan</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">Buku induk pegawai.</p>
            </div>
          </Link>

          {/* Card 6 */}
          <Link to="/penggajian" className="block">
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md p-4 shadow-[4px_4px_0_0_var(--ink)] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--ink)] transition-all cursor-pointer group h-full">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-[var(--bg-base)] border border-[var(--ink)]/20 rounded-md group-hover:border-[var(--ink)] transition-colors">
                  <Wallet size={20} className="text-[var(--ink)]" />
                </div>
                <h3 className="text-lg font-bold uppercase m-0 group-hover:text-[var(--accent-primary)] transition-colors">Penggajian</h3>
              </div>
              <p className="text-xs text-[var(--ink)]/70 m-0">Slip gaji & potongan.</p>
            </div>
          </Link>
          
        </div>
      </main>
    </Layout>
  );
};

export default Dashboard;
