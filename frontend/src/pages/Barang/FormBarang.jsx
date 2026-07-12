import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { Save, ArrowLeft } from 'lucide-react';

const FormBarang = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    kode_barang: '',
    nama_barang: '',
    kategori_id: '',
    satuan_id: '',
    harga_beli: '',
    harga_jual: '',
    stok_minimum: 5
  });

  const [kategori, setKategori] = useState([]);
  const [satuan, setSatuan] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const resKat = await api.get('/kategori');
        const resSat = await api.get('/satuan');
        setKategori(resKat.data.data.map(k => ({ label: k.nama_kategori, value: k.id })));
        setSatuan(resSat.data.data.map(s => ({ label: s.nama_satuan, value: s.id })));
      } catch (err) {
        console.error("Gagal memuat kategori/satuan", err);
      }
    };
    fetchMasterData();

    if (isEdit) {
      const fetchBarang = async () => {
        try {
          const res = await api.get(`/barang/${id}`);
          const d = res.data.data;
          setFormData({
            kode_barang: d.kode_barang,
            nama_barang: d.nama_barang,
            kategori_id: d.kategori_id,
            satuan_id: d.satuan_id,
            harga_beli: d.harga_beli,
            harga_jual: d.harga_jual,
            stok_minimum: d.stok_minimum
          });
        } catch (err) {
          console.error("Gagal memuat data barang", err);
        }
      };
      fetchBarang();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/barang/${id}`, formData);
      } else {
        await api.post('/barang', formData);
      }
      navigate('/barang');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6 border-b-2 border-[var(--ink)]/10 pb-4">
          <Link to="/barang">
            <button className="p-2 bg-[var(--surface)] border-2 border-[var(--ink)] rounded-md hover:bg-[var(--bg-base)] transition-colors">
              <ArrowLeft size={20} />
            </button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold uppercase m-0">{isEdit ? 'Edit Data Barang' : 'Tambah Data Barang'}</h2>
            <p className="text-sm font-mono opacity-70">{isEdit ? 'Ubah rincian barang' : 'Registrasi item baru ke dalam sistem'}</p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border-2 border-[var(--ink)] p-6 rounded-md shadow-[4px_4px_0_0_var(--ink)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Kode Barang" 
                name="kode_barang" 
                value={formData.kode_barang} 
                onChange={handleChange} 
                placeholder="Mis: BRG-001"
                required 
              />
              <Input 
                label="Nama Barang" 
                name="nama_barang" 
                value={formData.nama_barang} 
                onChange={handleChange} 
                placeholder="Mis: Semen Tiga Roda 50kg"
                required 
              />
              <Select 
                label="Kategori" 
                name="kategori_id" 
                value={formData.kategori_id} 
                onChange={handleChange} 
                options={kategori}
                required
              />
              <Select 
                label="Satuan" 
                name="satuan_id" 
                value={formData.satuan_id} 
                onChange={handleChange} 
                options={satuan}
                required
              />
              <Input 
                label="Harga Beli (Rp)" 
                type="number"
                name="harga_beli" 
                value={formData.harga_beli} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Harga Jual (Rp)" 
                type="number"
                name="harga_jual" 
                value={formData.harga_jual} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Peringatan Stok Minimum" 
                type="number"
                name="stok_minimum" 
                value={formData.stok_minimum} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="flex justify-end pt-4 border-t-2 border-[var(--ink)]/10">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Data'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default FormBarang;
