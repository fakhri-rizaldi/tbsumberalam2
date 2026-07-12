<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Penggajian;
use App\Models\Karyawan;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PenggajianController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'periode_bulan' => 'required|date_format:Y-m'
        ]);

        $periode = $request->periode_bulan;
        $tahun = explode('-', $periode)[0];
        $bulan = explode('-', $periode)[1];

        // Ambil karyawan aktif
        $karyawans = Karyawan::where('status', 'Aktif')->get();

        foreach ($karyawans as $karyawan) {
            // Hitung absensi bulan ini
            $absensi = Absensi::where('karyawan_id', $karyawan->id)
                ->whereYear('tanggal', $tahun)
                ->whereMonth('tanggal', $bulan)
                ->get();

            $totalHadir = $absensi->where('status', 'Hadir')->count();
            $totalIzin = $absensi->where('status', 'Izin')->count();
            $totalSakit = $absensi->where('status', 'Sakit')->count();
            $totalAlpa = $absensi->where('status', 'Alpa')->count();

            // Aturan Bisnis: Gaji dihitung dari (Gaji Harian * Total Hadir)
            // Potongan Rp 50.000 per Alpa
            $gajiPokokBulanIni = $karyawan->gaji_pokok * $totalHadir;
            $potonganPerAlpa = 50000;
            $totalPotongan = $totalAlpa * $potonganPerAlpa;
            
            $gajiBersih = $gajiPokokBulanIni - $totalPotongan;
            if ($gajiBersih < 0) $gajiBersih = 0;

            // Simpan atau Update penggajian
            Penggajian::updateOrCreate(
                [
                    'karyawan_id' => $karyawan->id,
                    'periode_bulan' => $periode
                ],
                [
                    'gaji_pokok' => $gajiPokokBulanIni, // Simpan total gaji pokok bulan ini
                    'total_kehadiran' => $totalHadir,
                    'total_izin' => $totalIzin,
                    'total_sakit' => $totalSakit,
                    'total_alpa' => $totalAlpa,
                    'total_potongan' => $totalPotongan,
                    'gaji_bersih' => $gajiBersih
                ]
            );
        }

        return $this->index($request);
    }

    public function index(Request $request)
    {
        $periode = $request->query('periode_bulan', date('Y-m'));

        $penggajian = Penggajian::with('karyawan')
            ->where('periode_bulan', $periode)
            ->get();

        return response()->json([
            'status' => 'success',
            'periode_bulan' => $periode,
            'data' => $penggajian
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $penggajian = Penggajian::findOrFail($id);
        $penggajian->status_pembayaran = 'Lunas';
        $penggajian->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Status pembayaran berhasil diupdate',
            'data' => $penggajian
        ]);
    }
}
