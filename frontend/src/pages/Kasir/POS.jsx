import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import { Search, Plus, Minus, Trash2, ShoppingCart, Calculator } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';

const POS = () => {
  const [barangList, setBarangList] = useState([]);
  const [search, setSearch] = useState('');
  const [bayar, setBayar] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const cart = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const searchInputRef = useRef(null);

  const fetchBarang = async () => {
    setLoading(true);
    try {
      const res = await api.get('/barang');
      // Hanya tampilkan barang yang stoknya lebih dari 0
      setBarangList(res.data.data.filter(b => b.stok > 0));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarang();
  }, []);

  const filteredBarang = barangList.filter(b => 
    b.nama_barang.toLowerCase().includes(search.toLowerCase()) || 
    b.kode_barang.toLowerCase().includes(search.toLowerCase())
  );

  const totalHarga = getTotal();
  const kembalian = bayar ? parseFloat(bayar) - totalHarga : 0;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Keranjang kosong!');
    if (!bayar || parseFloat(bayar) < totalHarga) return alert('Uang bayar tidak mencukupi!');

    setIsProcessing(true);
    try {
      const payload = {
        total_harga: totalHarga,
        bayar: parseFloat(bayar),
        kembalian: kembalian,
        catatan: '',
        items: cart.map(item => ({
          barang_id: item.id,
          jumlah: item.qty,
          harga_satuan: item.harga_jual,
          subtotal: item.harga_jual * item.qty
        }))
      };

      const response = await api.post('/transaksi', payload);
      alert('Transaksi Berhasil!');
      
      setLastTransaction({
        no_faktur: response.data.data.no_faktur || `INV-${Date.now()}`,
        tanggal: new Date().toLocaleString('id-ID'),
        items: [...cart],
        total_harga: totalHarga,
        bayar: parseFloat(bayar),
        kembalian: kembalian
      });

      clearCart();
      setBayar('');
      setSearch('');
      fetchBarang(); // Refresh stok
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses transaksi');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Layout>
      <div className="no-print p-4 h-[calc(100vh-76px)] overflow-hidden flex flex-col md:flex-row gap-4">
        
        {/* KOLOM KIRI: Pencarian Barang */}
        <div className="w-full md:w-7/12 flex flex-col h-full bg-[var(--surface)] border-2 border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] rounded-md">
          <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--bg-base)]">
            <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2">
              <Search size={20} /> Pencarian Barang
            </h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/50" />
              <input 
                ref={searchInputRef}
                autoFocus
                type="text" 
                placeholder="Ketik kode atau nama barang (fokus auto)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border-2 border-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] rounded-md font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-base)]/50">
            {loading ? (
              <div className="text-center font-mono py-10 opacity-50">Memuat barang...</div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredBarang.map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => addItem(item)}
                    className="bg-[var(--surface)] border-2 border-[var(--ink)] p-3 rounded-md cursor-pointer hover:-translate-y-1 hover:shadow-[4px_4px_0_0_var(--accent-primary)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-mono bg-[var(--ink)] text-[var(--surface)] inline-block px-1.5 py-0.5 mb-2 rounded-sm">
                        {item.kode_barang}
                      </div>
                      <h3 className="font-bold text-sm leading-tight mb-2">{item.nama_barang}</h3>
                    </div>
                    <div className="flex justify-between items-end mt-2 pt-2 border-t border-[var(--ink)]/10">
                      <span className="font-mono font-bold text-[var(--accent-secondary)] text-sm">
                        Rp {Number(item.harga_jual).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] font-bold opacity-60">Sisa: {item.stok}</span>
                    </div>
                  </div>
                ))}
                {filteredBarang.length === 0 && (
                  <div className="col-span-full text-center py-10 font-mono opacity-50">
                    Tidak ada barang ditemukan atau stok habis.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: Keranjang & Pembayaran */}
        <div className="w-full md:w-5/12 flex flex-col h-full bg-[var(--surface)] border-2 border-[var(--ink)] shadow-[4px_4px_0_0_var(--ink)] rounded-md">
          <div className="p-4 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--surface)] flex justify-between items-center">
            <h2 className="text-xl font-bold uppercase m-0 flex items-center gap-2">
              <ShoppingCart size={20} /> Keranjang Kasir
            </h2>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-xs uppercase font-bold text-[var(--danger)] hover:text-red-400">
                Kosongkan
              </button>
            )}
          </div>

          {/* List Keranjang */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                <ShoppingCart size={48} className="mb-4" />
                <p className="font-mono text-sm uppercase">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="border-b-2 border-dashed border-[var(--ink)]/20 pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-sm">{item.nama_barang}</h4>
                        <p className="text-xs font-mono opacity-70">Rp {Number(item.harga_jual).toLocaleString('id-ID')} / {item.satuan?.nama_satuan || 'Pcs'}</p>
                      </div>
                      <span className="font-mono font-bold text-sm">
                        Rp {Number(item.harga_jual * item.qty).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-[var(--bg-base)] border border-[var(--ink)] rounded-sm hover:bg-[var(--ink)] hover:text-[var(--surface)]"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono w-6 text-center text-sm font-bold">{item.qty}</span>
                        <button 
                          onClick={() => {
                            if (item.qty < item.stok) {
                              updateQty(item.id, item.qty + 1);
                            } else {
                              alert(`Stok maksimal hanya ${item.stok}`);
                            }
                          }}
                          className="w-6 h-6 flex items-center justify-center bg-[var(--bg-base)] border border-[var(--ink)] rounded-sm hover:bg-[var(--ink)] hover:text-[var(--surface)]"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[var(--danger)] hover:bg-[var(--danger)]/10 p-1 rounded-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bagian Pembayaran */}
          <div className="p-4 bg-[var(--bg-base)] border-t-2 border-[var(--ink)]">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase text-sm">Total Tagihan</span>
              <span className="font-mono text-2xl font-black text-[var(--danger)]">
                Rp {totalHarga.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1">Diterima (Rp)</label>
                <div className="relative">
                  <Calculator size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink)]/50" />
                  <input 
                    type="number" 
                    value={bayar}
                    onChange={(e) => setBayar(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border-2 border-[var(--ink)] focus:border-[var(--accent-primary)] rounded-md font-mono text-lg font-bold outline-none"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 border-2 border-dashed border-[var(--ink)] bg-[var(--surface)] rounded-md">
                <span className="font-bold uppercase text-sm">Kembali</span>
                <span className="font-mono text-xl font-bold text-[var(--accent-secondary)]">
                  Rp {kembalian > 0 ? kembalian.toLocaleString('id-ID') : '0'}
                </span>
              </div>

              <Button 
                onClick={handleCheckout} 
                disabled={cart.length === 0 || !bayar || kembalian < 0 || isProcessing}
                className="w-full py-4 text-lg"
              >
                {isProcessing ? 'Memproses...' : 'Proses Pembayaran'}
              </Button>
              {lastTransaction && (
                <button 
                  onClick={() => window.print()} 
                  className="w-full mt-2 py-3 bg-[var(--surface)] text-[var(--ink)] border-2 border-[var(--ink)] font-bold uppercase rounded-sm hover:bg-[var(--ink)] hover:text-[var(--surface)] transition-all flex justify-center items-center gap-2 shadow-[2px_2px_0_0_var(--ink)] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_var(--ink)]"
                >
                  🖨️ Cetak Struk Terakhir
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* STRUK PRINT AREA (HIDDEN ON SCREEN, VISIBLE ON PRINT) */}
      {lastTransaction && (
        <div className="hidden print-only print-area p-4" style={{ width: '58mm', fontSize: '12px', fontFamily: 'monospace' }}>
          <div className="text-center mb-4">
            <h2 className="font-bold text-lg m-0">TB. SUMBER ALAM 2</h2>
            <p className="m-0 text-[10px]">Jl. Contoh Bangunan No. 123</p>
            <p className="m-0 text-[10px]">Telp: 0812-3456-7890</p>
          </div>
          
          <div className="border-b border-dashed border-black mb-2 pb-2 text-[10px]">
            <div>No  : {lastTransaction.no_faktur}</div>
            <div>Tgl : {lastTransaction.tanggal}</div>
            <div>Kasir: Kasir Utama</div>
          </div>

          <div className="border-b border-dashed border-black mb-2 pb-2">
            {lastTransaction.items.map((item, idx) => (
              <div key={idx} className="mb-2">
                <div className="font-bold">{item.nama_barang}</div>
                <div className="flex justify-between text-[10px]">
                  <span>{item.qty} x {Number(item.harga_jual).toLocaleString('id-ID')}</span>
                  <span>{Number(item.qty * item.harga_jual).toLocaleString('id-ID')}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold mb-1">
            <span>TOTAL</span>
            <span>Rp {Number(lastTransaction.total_harga).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[10px] mb-1">
            <span>TUNAI</span>
            <span>Rp {Number(lastTransaction.bayar).toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[10px] mb-2">
            <span>KEMBALI</span>
            <span>Rp {Number(lastTransaction.kembalian).toLocaleString('id-ID')}</span>
          </div>

          <div className="text-center mt-4 text-[10px]">
            <p className="m-0">Terima kasih atas kunjungan Anda!</p>
            <p className="m-0">Barang yang sudah dibeli</p>
            <p className="m-0">tidak dapat ditukar/dikembalikan.</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default POS;
