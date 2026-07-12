<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaksi;
use App\Models\Barang;
use Illuminate\Http\Request;
use Carbon\Carbon;

class LaporanController extends Controller
{
    public function ringkasan()
    {
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();

        $pendapatanHariIni = Transaksi::whereDate('tanggal', $today)->sum('total_harga');
        $pendapatanBulanIni = Transaksi::whereBetween('tanggal', [$startOfMonth, Carbon::now()])->sum('total_harga');
        
        $totalTransaksiBulanIni = Transaksi::whereBetween('tanggal', [$startOfMonth, Carbon::now()])->count();

        $transaksiTerbaru = Transaksi::orderBy('created_at', 'desc')->take(10)->get();

        // Data Grafik 7 Hari Terakhir
        $grafikPendapatan = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $total = Transaksi::whereDate('tanggal', $date)->sum('total_harga');
            $grafikPendapatan[] = [
                'tanggal' => $date->format('d M'),
                'pendapatan' => (int) $total
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'pendapatan_hari_ini' => $pendapatanHariIni,
                'pendapatan_bulan_ini' => $pendapatanBulanIni,
                'total_transaksi_bulan_ini' => $totalTransaksiBulanIni,
                'transaksi_terbaru' => $transaksiTerbaru,
                'grafik_pendapatan' => $grafikPendapatan
            ]
        ]);
    }

    public function stok()
    {
        $barang = Barang::with('satuan')->get();

        $totalAset = 0;
        $stokKritis = [];

        foreach ($barang as $item) {
            // Hitung nilai aset berdasarkan harga beli * stok
            if ($item->stok > 0) {
                $totalAset += ($item->harga_beli * $item->stok);
            }

            // Kumpulkan daftar stok kritis
            if ($item->stok <= $item->stok_minimum) {
                $stokKritis[] = $item;
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'total_aset_gudang' => $totalAset,
                'stok_kritis' => $stokKritis
            ]
        ]);
    }
}
