import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Table, { TableRow, TableCell } from '../../components/Table';
import Badge from '../../components/Badge';
import { ArchiveRestore, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

const ManajemenStok = () => {
  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState('');
  const [riwayat, setRiwayat] = useState([]);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [form, setForm] = useState({
    jenis: 'masuk',
    jumlah: '',
    tanggal: new Date().toISOString().split('T')[0],
    keterangan: ''
  });

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const res = await api.get('/barang');
        setBarangList(res.data.data.map(b => ({ label: `${b.kode_barang} - ${b.nama_barang}`, value: b.id })));
      } catch (err) {
        console.error("Gagal memuat barang", err);
      }
    };
    fetchBarang();
  }, []);

  useEffect(() => {
    if (selectedBarang) {
      const fetchRiwayat = async () => {
        setLoadingRiwayat(true);
        try {
          const res = await api.get(`/stok/riwayat/${selectedBarang}`);
          setRiwayat(res.data.data);
        } catch (err) {
          console.error("Gagal memuat riwayat", err);
        } finally {
          setLoadingRiwayat(false);
        }
      };
      fetchRiwayat();
    } else {
      setRiwayat([]);
    }
  }, [selectedBarang]);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBarang) return alert("Pilih barang terlebih dahulu");
    
    setLoadingSubmit(true);
    try {
      const endpoint = form.jenis === 'masuk' ? '/stok/masuk' : '/stok/keluar';
      await api.post(endpoint, {
        barang_id: selectedBarang,
        jumlah: parseInt(form.jumlah),
        tanggal: form.tanggal,
        keterangan: form.keterangan
      });
      alert('Stok berhasil diperbarui');
      setForm({ ...form, jumlah: '', keterangan: '' });
      // Trigger fetch riwayat again by slightly tweaking state or just direct call:
      const res = await api.get(`/stok/riwayat/${selectedBarang}`);
      setRiwayat(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menyimpan stok');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Form Input */}
        <div className="lg:col-span-1">
          <div className="mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
            <h2 className="text-2xl font-bold uppercase m-0 flex items-center gap-2">
              <ArchiveRestore size={24} /> Input Stok
            </h2>
          </div>

          <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-5 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Select 
                label="Pilih Barang" 
                value={selectedBarang}
                onChange={(e) => setSelectedBarang(e.target.value)}
                options={barangList}
                required
              />
              
              <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--ink)]/80">Jenis Transaksi</label>
                <div className="flex gap-2">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-md cursor-pointer font-bold uppercase text-xs tracking-wider transition-colors ${form.jenis === 'masuk' ? 'bg-[var(--accent-secondary)] text-white border-[var(--accent-secondary)]' : 'bg-transparent border-[var(--ink)]/20 text-[var(--ink)]'}`}>
                    <input type="radio" name="jenis" value="masuk" checked={form.jenis === 'masuk'} onChange={handleFormChange} className="hidden" />
                    <ArrowDownToLine size={16} /> Masuk
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-md cursor-pointer font-bold uppercase text-xs tracking-wider transition-colors ${form.jenis === 'keluar' ? 'bg-[var(--danger)] text-white border-[var(--danger)]' : 'bg-transparent border-[var(--ink)]/20 text-[var(--ink)]'}`}>
                    <input type="radio" name="jenis" value="keluar" checked={form.jenis === 'keluar'} onChange={handleFormChange} className="hidden" />
                    <ArrowUpFromLine size={16} /> Keluar
                  </label>
                </div>
              </div>

              <Input label="Jumlah" type="number" name="jumlah" value={form.jumlah} onChange={handleFormChange} required min="1" />
              <Input label="Tanggal" type="date" name="tanggal" value={form.tanggal} onChange={handleFormChange} required />
              <Input label="Keterangan (Opsional)" type="text" name="keterangan" value={form.keterangan} onChange={handleFormChange} placeholder="Mis: Retur / Tambah Stok" />

              <Button type="submit" disabled={loadingSubmit || !selectedBarang} className="w-full mt-4">
                Simpan Transaksi
              </Button>
            </form>
          </div>
        </div>

        {/* Kolom Kanan: Kartu Stok */}
        <div className="lg:col-span-2">
          <div className="mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
            <h2 className="text-2xl font-bold uppercase m-0">Kartu Riwayat Stok</h2>
          </div>

          {selectedBarang ? (
            loadingRiwayat ? (
              <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat riwayat...</div>
            ) : (
              <Table headers={['Tanggal', 'Jenis', 'Jumlah', 'Keterangan']}>
                {riwayat.length > 0 ? riwayat.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.tanggal}</TableCell>
                    <TableCell>
                      {item.jenis === 'MASUK' ? (
                        <Badge variant="success">Masuk</Badge>
                      ) : (
                        <Badge variant="danger">Keluar</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`font-bold ${item.jenis === 'MASUK' ? 'text-[var(--accent-secondary)]' : 'text-[var(--danger)]'}`}>
                        {item.jenis === 'MASUK' ? '+' : '-'}{item.jumlah}
                      </span>
                    </TableCell>
                    <TableCell className="font-sans whitespace-normal min-w-[200px]">{item.keterangan || '-'}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 opacity-50">Belum ada riwayat pergerakan stok untuk barang ini.</TableCell>
                  </TableRow>
                )}
              </Table>
            )
          ) : (
            <div className="bg-[var(--surface)] border-2 border-dashed border-[var(--ink)]/20 rounded-md p-12 text-center text-[var(--ink)]/50">
              <ArchiveRestore size={48} className="mx-auto mb-4 opacity-50" />
              <p className="font-mono text-sm uppercase">Pilih barang untuk melihat kartu stok</p>
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ManajemenStok;
