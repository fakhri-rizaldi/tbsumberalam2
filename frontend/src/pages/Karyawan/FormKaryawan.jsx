import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';

const FormKaryawan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    nama_lengkap: '',
    posisi: '',
    no_telepon: '',
    gaji_pokok: '',
    tanggal_bergabung: new Date().toISOString().split('T')[0],
    status: 'Aktif'
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      api.get(`/karyawan/${id}`)
        .then(res => {
          setFormData({
            nama_lengkap: res.data.data.nama_lengkap,
            posisi: res.data.data.posisi,
            no_telepon: res.data.data.no_telepon || '',
            gaji_pokok: res.data.data.gaji_pokok,
            tanggal_bergabung: res.data.data.tanggal_bergabung,
            status: res.data.data.status
          });
          setLoading(false);
        })
        .catch(err => {
          alert('Gagal memuat data karyawan');
          navigate('/karyawan');
        });
    }
  }, [id, navigate, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/karyawan/${id}`, formData);
        alert('Karyawan berhasil diupdate');
      } else {
        await api.post('/karyawan', formData);
        alert('Karyawan berhasil ditambahkan');
      }
      navigate('/karyawan');
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan karyawan');
    }
  };

  if (loading) return <Layout><div className="p-8 text-center font-mono">Memuat...</div></Layout>;

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
          <h2 className="text-3xl font-bold uppercase m-0">
            {isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}
          </h2>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-6 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold uppercase mb-1">Nama Lengkap</label>
              <input 
                type="text"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleChange}
                required
                className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Posisi / Jabatan</label>
              <input 
                type="text"
                name="posisi"
                value={formData.posisi}
                onChange={handleChange}
                required
                placeholder="Misal: Sopir, Kernet, dsb"
                className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">No Telepon</label>
              <input 
                type="text"
                name="no_telepon"
                value={formData.no_telepon}
                onChange={handleChange}
                className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase mb-1">Gaji Pokok (Rp)</label>
              <input 
                type="number"
                name="gaji_pokok"
                value={formData.gaji_pokok}
                onChange={handleChange}
                required
                min="0"
                className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold uppercase mb-1">Tanggal Bergabung</label>
                <input 
                  type="date"
                  name="tanggal_bergabung"
                  value={formData.tanggal_bergabung}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold uppercase mb-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border-2 border-[var(--ink)] bg-[var(--bg-base)] p-2 rounded-sm focus:outline-none focus:border-[var(--accent-primary)] font-mono"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                type="button"
                onClick={() => navigate('/karyawan')}
                className="flex-1 border-2 border-[var(--ink)] bg-transparent p-2 font-bold uppercase rounded-sm hover:bg-[var(--ink)]/5 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="flex-1 border-2 border-[var(--ink)] bg-[var(--accent-primary)] p-2 font-bold uppercase rounded-sm hover:brightness-95 transition-all shadow-[2px_2px_0_0_var(--ink)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]"
              >
                Simpan
              </button>
            </div>

          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormKaryawan;
