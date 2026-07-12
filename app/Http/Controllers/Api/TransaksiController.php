<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\DetailTransaksi;
use App\Models\Barang;
use App\Models\StokKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TransaksiController extends Controller
{
    public function index()
    {
        $transaksi = Transaksi::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $transaksi
        ]);
    }

    public function show($id)
    {
        $transaksi = Transaksi::with(['detail.barang'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $transaksi
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'total_harga' => 'required|numeric|min:0',
            'bayar' => 'required|numeric|min:0',
            'kembalian' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.barang_id' => 'required|exists:barang,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga_satuan' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $noFaktur = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(5));

            $transaksi = Transaksi::create([
                'no_faktur' => $noFaktur,
                'tanggal' => now(),
                'total_harga' => $request->total_harga,
                'bayar' => $request->bayar,
                'kembalian' => $request->kembalian,
                'catatan' => $request->catatan,
            ]);

            foreach ($request->items as $item) {
                // Buat detail transaksi
                DetailTransaksi::create([
                    'transaksi_id' => $transaksi->id,
                    'barang_id' => $item['barang_id'],
                    'harga_satuan' => $item['harga_satuan'],
                    'jumlah' => $item['jumlah'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Kurangi stok barang
                $barang = Barang::findOrFail($item['barang_id']);
                
                if ($barang->stok < $item['jumlah']) {
                    throw new \Exception("Stok {$barang->nama_barang} tidak mencukupi!");
                }

                $barang->stok -= $item['jumlah'];
                $barang->save();

                // Catat di tabel stok keluar agar riwayatnya jelas (opsional tapi disarankan)
                StokKeluar::create([
                    'barang_id' => $item['barang_id'],
                    'jumlah' => $item['jumlah'],
                    'tanggal' => now()->toDateString(),
                    'keterangan' => 'Penjualan Kasir - ' . $noFaktur
                ]);
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaksi berhasil disimpan',
                'data' => $transaksi
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}
