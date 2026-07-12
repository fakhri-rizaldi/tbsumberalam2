<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $guarded = [];

    public function kategori()
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_id');
    }

    public function satuan()
    {
        return $this->belongsTo(Satuan::class, 'satuan_id');
    }

    public function stokMasuk()
    {
        return $this->hasMany(StokMasuk::class, 'barang_id');
    }

    public function stokKeluar()
    {
        return $this->hasMany(StokKeluar::class, 'barang_id');
    }
}
