import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import Badge from '../../components/Badge';
import { TrendingUp, FileText, AlertTriangle, Box } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LaporanDashboard = () => {
  const [ringkasan, setRingkasan] = useState(null);
  const [stok, setStok] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pendapatan'); // 'pendapatan' | 'stok'

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        const [resRingkasan, resStok] = await Promise.all([
          api.get('/laporan/ringkasan'),
          api.get('/laporan/stok')
        ]);
        setRingkasan(resRingkasan.data.data);
        setStok(resStok.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLaporan();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat data laporan...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 border-b-2 border-[var(--ink)]/10 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold uppercase m-0 flex items-center gap-2">
              <FileText size={28} /> Dashboard Laporan
            </h2>
            <p className="text-sm font-mono opacity-70">Pantau performa dan aset toko</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setTab('pendapatan')}
              className={`px-4 py-2 font-bold uppercase text-sm rounded-sm border-2 transition-colors ${tab === 'pendapatan' ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]' : 'bg-transparent text-[var(--ink)] border-[var(--ink)]/20 hover:bg-[var(--ink)]/5'}`}
            >
              Pendapatan
            </button>
            <button 
              onClick={() => setTab('stok')}
              className={`px-4 py-2 font-bold uppercase text-sm rounded-sm border-2 transition-colors ${tab === 'stok' ? 'bg-[var(--ink)] text-[var(--surface)] border-[var(--ink)]' : 'bg-transparent text-[var(--ink)] border-[var(--ink)]/20 hover:bg-[var(--ink)]/5'}`}
            >
              Aset & Stok
            </button>
          </div>
        </div>

        {tab === 'pendapatan' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-2">Pendapatan Hari Ini</p>
                <h3 className="text-3xl font-black font-mono text-[var(--accent-secondary)]">
                  Rp {Number(ringkasan?.pendapatan_hari_ini || 0).toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-2">Pendapatan Bulan Ini</p>
                <h3 className="text-3xl font-black font-mono text-[var(--ink)]">
                  Rp {Number(ringkasan?.pendapatan_bulan_ini || 0).toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-2">Total Transaksi (Bulan Ini)</p>
                <div className="flex items-center gap-3">
                  <TrendingUp size={32} className="text-[var(--accent-primary)]" />
                  <h3 className="text-3xl font-black font-mono text-[var(--ink)]">
                    {ringkasan?.total_transaksi_bulan_ini || 0}
                  </h3>
                </div>
              </div>
            </div>

            {/* Chart Pendapatan */}
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
              <h3 className="font-bold uppercase m-0 mb-4 border-b-2 border-[var(--ink)]/10 pb-2">Tren Pendapatan 7 Hari Terakhir</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ringkasan?.grafik_pendapatan || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#23272B" opacity={0.1} />
                    <XAxis dataKey="tanggal" tick={{fontFamily: 'IBM Plex Mono', fontSize: 12, fill: '#23272B'}} axisLine={{stroke: '#23272B', strokeWidth: 2}} />
                    <YAxis tickFormatter={(val) => `Rp${val/1000}k`} tick={{fontFamily: 'IBM Plex Mono', fontSize: 12, fill: '#23272B'}} axisLine={{stroke: '#23272B', strokeWidth: 2}} />
                    <Tooltip 
                      cursor={{fill: '#23272B', opacity: 0.05}} 
                      contentStyle={{backgroundColor: '#FFFFFF', border: '2px solid #23272B', borderRadius: '4px', fontFamily: 'IBM Plex Mono', fontWeight: 'bold', boxShadow: '4px 4px 0 0 #23272B'}}
                      formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Pendapatan']}
                    />
                    <Bar dataKey="pendapatan" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} stroke="var(--ink)" strokeWidth={2} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table Transaksi */}
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md overflow-hidden">
              <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--bg-base)]">
                <h3 className="font-bold uppercase m-0">10 Transaksi Terakhir</h3>
              </div>
              <Table headers={['Faktur', 'Tanggal', 'Total Harga', 'Bayar', 'Kembalian']}>
                {ringkasan?.transaksi_terbaru?.length > 0 ? ringkasan.transaksi_terbaru.map((trx) => (
                  <TableRow key={trx.id}>
                    <TableCell>
                      <span className="font-mono bg-[var(--ink)]/5 px-2 py-1 border border-[var(--ink)]/20 rounded-sm">
                        {trx.no_faktur}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(trx.tanggal).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="font-bold">Rp {Number(trx.total_harga).toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {Number(trx.bayar).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-[var(--accent-secondary)]">Rp {Number(trx.kembalian).toLocaleString('id-ID')}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 opacity-50">Belum ada transaksi.</TableCell>
                  </TableRow>
                )}
              </Table>
            </div>
          </div>
        )}

        {tab === 'stok' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Aset Card */}
            <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-6 rounded-md shadow-[4px_4px_0_0_var(--ink)] max-w-sm">
              <div className="flex items-center gap-3 mb-2">
                <Box size={24} className="text-[var(--ink)]/50" />
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink)]/60 m-0">Estimasi Nilai Aset Gudang</p>
              </div>
              <h3 className="text-4xl font-black font-mono text-[var(--ink)] mt-2">
                Rp {Number(stok?.total_aset_gudang || 0).toLocaleString('id-ID')}
              </h3>
              <p className="text-[10px] uppercase opacity-50 mt-2">*Dihitung dari sisa stok dikali harga beli masing-masing barang.</p>
            </div>

            {/* Warning Stok */}
            <div className="bg-[var(--surface)] border-2 border-[var(--danger)] rounded-md overflow-hidden shadow-[4px_4px_0_0_var(--danger)]">
              <div className="p-4 border-b-2 border-[var(--danger)] bg-[var(--danger)]/10 flex items-center gap-2 text-[var(--danger)]">
                <AlertTriangle size={20} />
                <h3 className="font-bold uppercase m-0">Peringatan Stok Kritis</h3>
              </div>
              <Table headers={['Kode', 'Nama Barang', 'Sisa Stok', 'Batas Minimum', 'Status']}>
                {stok?.stok_kritis?.length > 0 ? stok.stok_kritis.map((brg) => (
                  <TableRow key={brg.id}>
                    <TableCell>{brg.kode_barang}</TableCell>
                    <TableCell className="font-bold">{brg.nama_barang}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xl font-bold text-[var(--danger)]">{brg.stok}</span>
                    </TableCell>
                    <TableCell>{brg.stok_minimum}</TableCell>
                    <TableCell>
                      <Badge variant="danger">Butuh Restock</Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12">
                      <div className="opacity-50 flex flex-col items-center">
                        <Box size={48} className="mb-4 opacity-50" />
                        <span className="font-mono uppercase">Semua stok barang dalam kondisi aman.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Table>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default LaporanDashboard;
