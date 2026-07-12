<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Satuan;
use Illuminate\Http\Request;

class SatuanController extends Controller
{
    public function index()
    {
        $satuan = Satuan::all();
        return response()->json([
            'status' => 'success',
            'message' => 'Data satuan berhasil diambil',
            'data' => $satuan
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_satuan' => 'required|string|max:255'
        ]);

        $satuan = Satuan::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Satuan berhasil ditambahkan',
            'data' => $satuan
        ], 201);
    }

    public function show($id)
    {
        $satuan = Satuan::findOrFail($id);
        return response()->json([
            'status' => 'success',
            'message' => 'Data satuan',
            'data' => $satuan
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama_satuan' => 'required|string|max:255'
        ]);

        $satuan = Satuan::findOrFail($id);
        $satuan->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Satuan berhasil diubah',
            'data' => $satuan
        ]);
    }

    public function destroy($id)
    {
        $satuan = Satuan::findOrFail($id);
        $satuan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Satuan berhasil dihapus',
            'data' => null
        ]);
    }
}
