<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\StokMasuk;
use App\Models\StokKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StokController extends Controller
{
    public function stokMasuk(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $stokMasuk = StokMasuk::create($request->all());
            
            $barang = Barang::findOrFail($request->barang_id);
            $barang->stok += $request->jumlah;
            $barang->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Stok masuk berhasil dicatat',
                'data' => $stokMasuk
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function stokKeluar(Request $request)
    {
        $request->validate([
            'barang_id' => 'required|exists:barang,id',
            'jumlah' => 'required|integer|min:1',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string'
        ]);

        try {
            DB::beginTransaction();

            $barang = Barang::findOrFail($request->barang_id);
            if ($barang->stok < $request->jumlah) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Stok tidak mencukupi. Sisa stok: ' . $barang->stok
                ], 400);
            }

            $stokKeluar = StokKeluar::create($request->all());
            
            $barang->stok -= $request->jumlah;
            $barang->save();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Stok keluar berhasil dicatat',
                'data' => $stokKeluar
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function riwayatStok($barang_id)
    {
        $masuk = StokMasuk::where('barang_id', $barang_id)->get()->map(function($item) {
            $item->jenis = 'MASUK';
            return $item;
        });
        
        $keluar = StokKeluar::where('barang_id', $barang_id)->get()->map(function($item) {
            $item->jenis = 'KELUAR';
            return $item;
        });

        $riwayat = $masuk->concat($keluar)->sortByDesc('tanggal')->values();

        return response()->json([
            'status' => 'success',
            'message' => 'Riwayat stok',
            'data' => $riwayat
        ]);
    }
}
