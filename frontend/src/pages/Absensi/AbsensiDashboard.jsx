import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import { CalendarCheck, Save } from 'lucide-react';

const AbsensiDashboard = () => {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [absensi, setAbsensi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAbsensi = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(`/absensi?tanggal=${date}`);
      setAbsensi(response.data.data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data absensi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAbsensi(tanggal);
  }, [tanggal]);

  const handleStatusChange = (id, newStatus) => {
    setAbsensi(absensi.map(item => 
      item.karyawan_id === id ? { ...item, status: newStatus } : item
    ));
  };

  const handleKeteranganChange = (id, newKet) => {
    setAbsensi(absensi.map(item => 
      item.karyawan_id === id ? { ...item, keterangan: newKet } : item
    ));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/absensi', {
        tanggal,
        absensi: absensi.map(item => ({
          karyawan_id: item.karyawan_id,
          status: item.status,
          keterangan: item.keterangan
        }))
      });
      alert('Data absensi berhasil disimpan!');
    } catch (err) {
      console.error(err);
      alert('Gagal menyimpan data absensi');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-6 border-b-2 border-[var(--ink)]/10 pb-4 gap-4">
          <div>
            <h2 className="text-3xl font-bold uppercase m-0 flex items-center gap-2">
              <CalendarCheck size={28} /> Rekap Absensi
            </h2>
            <p className="text-sm font-mono opacity-70">Catat kehadiran karyawan per hari</p>
          </div>
          
          <div className="flex items-center gap-4 bg-[var(--surface)] p-2 border-2 border-[var(--ink)] shadow-[2px_2px_0_0_var(--ink)] rounded-md">
            <span className="text-sm font-bold uppercase whitespace-nowrap">Tanggal:</span>
            <input 
              type="date" 
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="border-none bg-transparent outline-none font-mono font-bold cursor-pointer"
            />
          </div>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md overflow-hidden shadow-[4px_4px_0_0_var(--ink)]">
          {loading ? (
            <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat data absensi...</div>
          ) : (
            <>
              <Table headers={['Nama Lengkap', 'Posisi', 'Status Kehadiran', 'Keterangan (Opsional)']}>
                {absensi.length > 0 ? (
                  absensi.map((item) => (
                    <TableRow key={item.karyawan_id}>
                      <TableCell className="font-bold">{item.nama_lengkap}</TableCell>
                      <TableCell>{item.posisi}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {['Hadir', 'Izin', 'Sakit', 'Alpa'].map(st => (
                            <label key={st} className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name={`status_${item.karyawan_id}`}
                                value={st}
                                checked={item.status === st}
                                onChange={(e) => handleStatusChange(item.karyawan_id, e.target.value)}
                                className="accent-[var(--accent-primary)] cursor-pointer"
                              />
                              <span className={`text-sm font-bold uppercase ${item.status === st ? 'text-[var(--ink)]' : 'text-[var(--ink)]/50'}`}>
                                {st}
                              </span>
                            </label>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <input 
                          type="text" 
                          value={item.keterangan || ''}
                          onChange={(e) => handleKeteranganChange(item.karyawan_id, e.target.value)}
                          placeholder="Bila perlu..."
                          disabled={item.status === 'Hadir'}
                          className={`w-full border border-[var(--ink)]/20 p-1 text-sm bg-transparent outline-none focus:border-[var(--accent-primary)] ${item.status === 'Hadir' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 opacity-50">
                      Belum ada Karyawan Aktif. Silakan tambah data di Modul Karyawan.
                    </TableCell>
                  </TableRow>
                )}
              </Table>
              
              {absensi.length > 0 && (
                <div className="p-4 bg-[var(--bg-base)] border-t-2 border-[var(--ink)] flex justify-end">
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--ink)] border-2 border-[var(--ink)] px-6 py-2 font-bold uppercase shadow-[4px_4px_0_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={20} />
                    {saving ? 'Menyimpan...' : 'Simpan Absensi Harian'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AbsensiDashboard;
