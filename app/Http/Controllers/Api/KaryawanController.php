<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Karyawan;
use Illuminate\Http\Request;

class KaryawanController extends Controller
{
    public function index()
    {
        $karyawans = Karyawan::orderBy('nama_lengkap', 'asc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $karyawans
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'posisi' => 'required|string|max:255',
            'no_telepon' => 'nullable|string|max:20',
            'gaji_pokok' => 'required|numeric|min:0',
            'tanggal_bergabung' => 'required|date',
            'status' => 'required|in:Aktif,Non-Aktif',
        ]);

        $karyawan = Karyawan::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil ditambahkan',
            'data' => $karyawan
        ], 201);
    }

    public function show(string $id)
    {
        $karyawan = Karyawan::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $karyawan
        ]);
    }

    public function update(Request $request, string $id)
    {
        $karyawan = Karyawan::findOrFail($id);

        $validated = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'posisi' => 'required|string|max:255',
            'no_telepon' => 'nullable|string|max:20',
            'gaji_pokok' => 'required|numeric|min:0',
            'tanggal_bergabung' => 'required|date',
            'status' => 'required|in:Aktif,Non-Aktif',
        ]);

        $karyawan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil diperbarui',
            'data' => $karyawan
        ]);
    }

    public function destroy(string $id)
    {
        $karyawan = Karyawan::findOrFail($id);
        $karyawan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Data karyawan berhasil dihapus'
        ]);
    }
}
