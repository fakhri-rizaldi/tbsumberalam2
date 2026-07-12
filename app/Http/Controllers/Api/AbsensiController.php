<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Absensi;
use App\Models\Karyawan;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $tanggal = $request->query('tanggal', Carbon::today()->toDateString());
        
        // Ambil semua karyawan aktif
        $karyawans = Karyawan::where('status', 'Aktif')
            ->orderBy('nama_lengkap', 'asc')
            ->get();

        // Ambil absensi hari tersebut
        $absensis = Absensi::whereDate('tanggal', $tanggal)->get()->keyBy('karyawan_id');

        // Gabungkan data
        $data = $karyawans->map(function($karyawan) use ($absensis) {
            $absen = $absensis->get($karyawan->id);
            return [
                'karyawan_id' => $karyawan->id,
                'nama_lengkap' => $karyawan->nama_lengkap,
                'posisi' => $karyawan->posisi,
                'status' => $absen ? $absen->status : 'Hadir', // Default Hadir jika belum diset
                'keterangan' => $absen ? $absen->keterangan : ''
            ];
        });

        return response()->json([
            'status' => 'success',
            'tanggal' => $tanggal,
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'absensi' => 'required|array',
            'absensi.*.karyawan_id' => 'required|exists:karyawan,id',
            'absensi.*.status' => 'required|in:Hadir,Izin,Sakit,Alpa',
            'absensi.*.keterangan' => 'nullable|string'
        ]);

        $tanggal = $validated['tanggal'];

        foreach ($validated['absensi'] as $item) {
            Absensi::updateOrCreate(
                [
                    'karyawan_id' => $item['karyawan_id'],
                    'tanggal' => $tanggal
                ],
                [
                    'status' => $item['status'],
                    'keterangan' => $item['keterangan'] ?? null
                ]
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Absensi berhasil disimpan'
        ]);
    }
}
