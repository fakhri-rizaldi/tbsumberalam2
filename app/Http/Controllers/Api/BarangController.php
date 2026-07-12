<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index()
    {
        $barang = Barang::with(['kategori', 'satuan'])->get();
        return response()->json([
            'status' => 'success',
            'message' => 'Data barang berhasil diambil',
            'data' => $barang
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_barang' => 'required|string|unique:barang',
            'nama_barang' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori_barang,id',
            'satuan_id' => 'required|exists:satuan,id',
            'harga_beli' => 'required|numeric',
            'harga_jual' => 'required|numeric',
            'stok' => 'integer',
            'stok_minimum' => 'integer',
        ]);

        $barang = Barang::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Barang berhasil ditambahkan',
            'data' => $barang
        ], 201);
    }

    public function show($id)
    {
        $barang = Barang::with(['kategori', 'satuan'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'message' => 'Data barang',
            'data' => $barang
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kode_barang' => 'required|string|unique:barang,kode_barang,' . $id,
            'nama_barang' => 'required|string|max:255',
            'kategori_id' => 'required|exists:kategori_barang,id',
            'satuan_id' => 'required|exists:satuan,id',
            'harga_beli' => 'required|numeric',
            'harga_jual' => 'required|numeric',
            'stok_minimum' => 'integer',
        ]);

        $barang = Barang::findOrFail($id);
        $barang->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Barang berhasil diubah',
            'data' => $barang
        ]);
    }

    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);
        $barang->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Barang berhasil dihapus',
            'data' => null
        ]);
    }
}
