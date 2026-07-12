import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import Button from '../../components/Button';
import Badge from '../../components/Badge';
import { Plus, Search, AlertTriangle, Edit, Trash2 } from 'lucide-react';

const DataBarang = () => {
  const [barang, setBarang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBarang = async () => {
    try {
      const res = await api.get('/barang');
      setBarang(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus barang ini?')) {
      try {
        await api.delete(`/barang/${id}`);
        fetchBarang();
      } catch (err) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const filteredBarang = barang.filter(b => 
    b.nama_barang.toLowerCase().includes(search.toLowerCase()) || 
    b.kode_barang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b-2 border-[var(--ink)]/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold uppercase m-0">Master Data Barang</h2>
            <p className="text-sm font-mono opacity-70">Kelola inventaris dan harga</p>
          </div>
          <Link to="/barang/tambah">
            <Button className="gap-2">
              <Plus size={16} /> Tambah Barang
            </Button>
          </Link>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-4 mb-6 rounded-md shadow-[4px_4px_0_0_var(--ink)] flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/50" />
            <input 
              type="text" 
              placeholder="Cari nama atau kode barang..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-base)] border-2 border-[var(--ink)]/20 focus:border-[var(--ink)] rounded-md font-mono text-sm outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Badge variant="danger">Stok Kritis</Badge>
            <Badge variant="success">Stok Aman</Badge>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat data...</div>
        ) : (
          <Table headers={['Kode', 'Nama Barang', 'Kategori', 'Harga Jual', 'Stok', 'Aksi']}>
            {filteredBarang.length > 0 ? filteredBarang.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="bg-[var(--ink)]/5 inline-block px-2 py-1 rounded-sm border border-[var(--ink)]/20">
                    {item.kode_barang}
                  </div>
                </TableCell>
                <TableCell className="font-sans font-bold">{item.nama_barang}</TableCell>
                <TableCell>{item.kategori?.nama_kategori || '-'}</TableCell>
                <TableCell>Rp {Number(item.harga_jual).toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${item.stok <= item.stok_minimum ? 'text-[var(--danger)]' : ''}`}>
                      {item.stok}
                    </span>
                    <span className="text-xs opacity-60">{item.satuan?.nama_satuan}</span>
                    {item.stok <= item.stok_minimum && (
                      <AlertTriangle size={16} className="text-[var(--danger)]" title="Stok Kritis" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Link to={`/barang/edit/${item.id}`}>
                      <button className="p-1.5 hover:bg-[var(--ink)]/10 rounded-sm transition-colors text-[var(--ink)]">
                        <Edit size={16} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 hover:bg-[var(--danger)]/10 rounded-sm transition-colors text-[var(--danger)]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 opacity-50">Tidak ada data barang ditemukan.</TableCell>
              </TableRow>
            )}
          </Table>
        )}
      </div>
    </Layout>
  );
};

export default DataBarang;
