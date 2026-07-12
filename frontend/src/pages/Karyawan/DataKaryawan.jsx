import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Table, { TableRow, TableCell } from '../../components/Table';
import Badge from '../../components/Badge';

const DataKaryawan = () => {
  const [karyawans, setKaryawans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchKaryawans = async () => {
    try {
      const response = await api.get('/karyawan');
      setKaryawans(response.data.data);
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data karyawan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKaryawans();
  }, []);

  const handleDelete = async (id, nama) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus karyawan ${nama}?`)) {
      try {
        await api.delete(`/karyawan/${id}`);
        fetchKaryawans();
      } catch (err) {
        alert('Gagal menghapus karyawan');
      }
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
        <div className="flex justify-between items-end mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
          <div>
            <h2 className="text-3xl font-bold uppercase m-0 flex items-center gap-2">
              <Users size={28} /> Data Karyawan
            </h2>
            <p className="text-sm font-mono opacity-70">Master Data Pegawai TB. Sumber Alam 2</p>
          </div>
          <Link 
            to="/karyawan/tambah" 
            className="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/80 text-[var(--ink)] border-2 border-[var(--ink)] px-4 py-2 font-bold uppercase shadow-[4px_4px_0_0_var(--ink)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Tambah Karyawan</span>
          </Link>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md overflow-hidden shadow-[4px_4px_0_0_var(--ink)]">
          {loading ? (
            <div className="p-8 text-center font-mono font-bold animate-pulse">Memuat data...</div>
          ) : (
            <Table headers={['Nama Lengkap', 'Posisi', 'No. Telepon', 'Gaji Pokok', 'Status', 'Aksi']}>
              {karyawans.length > 0 ? (
                karyawans.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.nama_lengkap}</TableCell>
                    <TableCell>{item.posisi}</TableCell>
                    <TableCell>{item.no_telepon || '-'}</TableCell>
                    <TableCell className="font-mono text-[var(--accent-secondary)] font-bold">
                      Rp {Number(item.gaji_pokok).toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === 'Aktif' ? 'success' : 'danger'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/karyawan/edit/${item.id}`)}
                          className="p-2 bg-[var(--accent-primary)] border border-[var(--ink)] rounded-sm hover:opacity-80 transition-opacity"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id, item.nama_lengkap)}
                          className="p-2 bg-[var(--danger)] text-[var(--surface)] border border-[var(--ink)] rounded-sm hover:opacity-80 transition-opacity"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 opacity-50">
                    Belum ada data karyawan.
                  </TableCell>
                </TableRow>
              )}
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DataKaryawan;
