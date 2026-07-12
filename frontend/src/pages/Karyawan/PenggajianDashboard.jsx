import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import Badge from '../../components/Badge';
import { Wallet, Calculator, CheckCircle2, Printer } from 'lucide-react';

const PenggajianDashboard = () => {
  const [periode, setPeriode] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [penggajian, setPenggajian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [printData, setPrintData] = useState(null);

  const fetchPenggajian = async (bulan) => {
    setLoading(true);
    try {
      const response = await api.get(`/penggajian?periode_bulan=${bulan}`);
      setPenggajian(response.data.data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data penggajian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPenggajian(periode);
  }, [periode]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await api.post('/penggajian/generate', { periode_bulan: periode });
      setPenggajian(response.data.data);
      alert('Slip gaji bulan ini berhasil dikalkulasi!');
    } catch (err) {
      console.error(err);
      alert('Gagal melakukan kalkulasi penggajian');
    } finally {
      setGenerating(false);
    }
  };

  const handleLunas = async (id, nama) => {
    if (window.confirm(`Tandai slip gaji ${nama} sebagai Lunas?`)) {
      try {
        await api.put(`/penggajian/${id}/lunas`);
        fetchPenggajian(periode); // Refresh data
      } catch (err) {
        alert('Gagal mengupdate status pembayaran');
      }
    }
  };

  const handlePrint = (item) => {
    setPrintData(item);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Layout>
      <div className="no-print p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 border-b-2 border-[var(--ink)]/10 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold uppercase m-0 flex items-center gap-2">
              <Wallet size={28} /> Penggajian (Payroll)
            </h2>
            <p className="text-sm font-mono opacity-70">Kalkulator otomatis slip gaji karyawan</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-4 bg-[var(--surface)] p-2 border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)] rounded-md">
              <span className="text-sm font-bold uppercase whitespace-nowrap">Bulan:</span>
              <input 
                type="month" 
                value={periode}
                onChange={(e) => setPeriode(e.target.value)}
                className="border-none bg-transparent outline-none font-mono font-bold cursor-pointer"
              />
            </div>
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--ink)] border-2 border-[var(--ink)] px-4 py-2 font-bold uppercase shadow-[4px_4px_0_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition-all disabled:opacity-50"
            >
              <Calculator size={20} />
              {generating ? 'Menghitung...' : 'Generate Slip Gaji'}
            </button>
          </div>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md overflow-hidden shadow-[4px_4px_0_0_var(--ink)]">
          {loading ? (
            <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat data penggajian...</div>
          ) : (
            <Table headers={['Nama Karyawan', 'Rekap Absensi', 'Gaji Pokok', 'Total Potongan', 'Gaji Bersih', 'Status', 'Aksi']}>
              {penggajian.length > 0 ? (
                penggajian.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-bold">{item.karyawan?.nama_lengkap}</div>
                      <div className="text-xs opacity-70">{item.karyawan?.posisi}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-mono space-y-1">
                        <div>Hadir: <span className="font-bold text-[var(--success)]">{item.total_kehadiran}</span></div>
                        <div>Alpa: <span className="font-bold text-[var(--danger)]">{item.total_alpa}</span></div>
                        <div className="opacity-50">Sakit/Izin: {item.total_sakit + item.total_izin}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      Rp {Number(item.gaji_pokok).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono text-[var(--danger)]">
                      - Rp {Number(item.total_potongan).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-[var(--accent-secondary)] text-lg bg-[var(--ink)]/5">
                      Rp {Number(item.gaji_bersih).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status_pembayaran === 'Lunas' ? 'success' : 'warning'}>
                        {item.status_pembayaran}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {item.status_pembayaran === 'Belum Lunas' && (
                          <button 
                            onClick={() => handleLunas(item.id, item.karyawan?.nama_lengkap)}
                            className="flex items-center gap-1 p-2 bg-[var(--success)] text-[var(--surface)] border-2 border-[var(--ink)] rounded-sm hover:brightness-95 transition-all text-xs font-bold uppercase shadow-[2px_2px_0_0_var(--ink)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]"
                            title="Tandai Lunas"
                          >
                            <CheckCircle2 size={16} /> Bayar
                          </button>
                        )}
                        <button 
                          onClick={() => handlePrint(item)}
                          className="flex items-center gap-1 p-2 bg-[var(--surface)] text-[var(--ink)] border-2 border-[var(--ink)] rounded-sm hover:bg-[var(--ink)]/5 transition-all text-xs font-bold uppercase shadow-[2px_2px_0_0_var(--ink)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]"
                          title="Cetak Slip"
                        >
                          <Printer size={16} /> Cetak
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="opacity-50 flex flex-col items-center">
                      <Calculator size={48} className="mb-4 opacity-50" />
                      <span className="font-mono uppercase">Data penggajian bulan ini belum dihitung.</span>
                      <span className="font-mono uppercase text-sm mt-2">Klik tombol "Generate Slip Gaji" di atas.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Table>
          )}
        </div>
      </div>

      {/* SLIP GAJI PRINT AREA */}
      {printData && (
        <div className="hidden print-only print-area p-8" style={{ fontFamily: 'monospace' }}>
          <div className="text-center mb-8 border-b-4 border-double border-black pb-4">
            <h1 className="text-2xl font-black uppercase m-0">TB. SUMBER ALAM 2</h1>
            <p className="m-0 text-sm">Jl. Contoh Bangunan No. 123, Kota Anda</p>
            <p className="m-0 text-sm">Telp: 0812-3456-7890</p>
          </div>

          <h2 className="text-center text-xl font-bold uppercase underline mb-8">Slip Gaji Karyawan</h2>

          <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-32 pb-2">Nama</td>
                    <td className="w-4 pb-2">:</td>
                    <td className="font-bold pb-2">{printData.karyawan?.nama_lengkap}</td>
                  </tr>
                  <tr>
                    <td className="pb-2">Posisi / Jabatan</td>
                    <td className="pb-2">:</td>
                    <td className="pb-2">{printData.karyawan?.posisi}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="w-32 pb-2">Periode</td>
                    <td className="w-4 pb-2">:</td>
                    <td className="font-bold pb-2">{printData.periode_bulan}</td>
                  </tr>
                  <tr>
                    <td className="pb-2">Status</td>
                    <td className="pb-2">:</td>
                    <td className="pb-2">{printData.status_pembayaran}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-black mb-8">
            <div className="grid grid-cols-2 p-2 border-b border-black bg-gray-100 font-bold text-sm">
              <div>KETERANGAN</div>
              <div className="text-right">JUMLAH (Rp)</div>
            </div>
            <div className="p-4 text-sm space-y-4">
              <div className="flex justify-between font-bold">
                <span>Gaji Pokok ({printData.total_kehadiran} Hari)</span>
                <span>{Number(printData.gaji_pokok).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="border-t border-dashed border-gray-400 my-2 pt-2 text-xs italic">
                Rincian Kehadiran: Hadir ({printData.total_kehadiran}), Izin ({printData.total_izin}), Sakit ({printData.total_sakit}), Alpa ({printData.total_alpa})
              </div>

              <div className="flex justify-between text-[var(--danger)]">
                <span>Potongan Absensi (Alpa)</span>
                <span>- {Number(printData.total_potongan).toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 p-2 border-t border-black bg-gray-100 font-bold text-lg">
              <div>PENERIMAAN BERSIH</div>
              <div className="text-right">Rp {Number(printData.gaji_bersih).toLocaleString('id-ID')}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-center text-sm mt-16">
            <div>
              <p className="mb-16">Penerima,</p>
              <p className="font-bold underline">{printData.karyawan?.nama_lengkap}</p>
            </div>
            <div>
              <p className="mb-16">Disetujui Oleh,</p>
              <p className="font-bold underline">Pemilik TB. Sumber Alam 2</p>
            </div>
          </div>

        </div>
      )}
    </Layout>
  );
};

export default PenggajianDashboard;
