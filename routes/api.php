<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\KategoriController;
use App\Http\Controllers\Api\SatuanController;
use App\Http\Controllers\Api\BarangController;
use App\Http\Controllers\Api\StokController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\AbsensiController;
use App\Http\Controllers\Api\PenggajianController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);

    // Master Data
    Route::apiResource('kategori', KategoriController::class);
    Route::apiResource('satuan', SatuanController::class);
    Route::apiResource('barang', BarangController::class);

    // Stok
    Route::post('/stok/masuk', [StokController::class, 'stokMasuk']);
    Route::post('/stok/keluar', [StokController::class, 'stokKeluar']);
    Route::get('/stok/riwayat/{barang_id}', [StokController::class, 'riwayatStok']);

    // Transaksi Kasir
    Route::get('/transaksi', [TransaksiController::class, 'index']);
    Route::get('/transaksi/{id}', [TransaksiController::class, 'show']);
    Route::post('/transaksi', [TransaksiController::class, 'store']);

    // Laporan
    Route::get('/laporan/ringkasan', [LaporanController::class, 'ringkasan']);
    Route::get('/laporan/stok', [LaporanController::class, 'stok']);

    // Karyawan
    Route::apiResource('karyawan', KaryawanController::class);

    // Absensi
    Route::get('/absensi', [AbsensiController::class, 'index']);
    Route::post('/absensi', [AbsensiController::class, 'store']);

    // Penggajian
    Route::get('/penggajian', [PenggajianController::class, 'index']);
    Route::post('/penggajian/generate', [PenggajianController::class, 'generate']);
    Route::put('/penggajian/{id}/lunas', [PenggajianController::class, 'updateStatus']);
});
