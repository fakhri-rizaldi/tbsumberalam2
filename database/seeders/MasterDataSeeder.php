<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\KategoriBarang;
use App\Models\Satuan;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        $kategori = [
            'Semen', 'Besi', 'Cat', 'Paku', 'Kayu', 'Pipa', 'Keramik'
        ];

        foreach ($kategori as $k) {
            KategoriBarang::firstOrCreate(['nama_kategori' => $k]);
        }

        $satuan = [
            'Sak', 'Batang', 'Kaleng', 'Kg', 'Lembar', 'Meter', 'Dus'
        ];

        foreach ($satuan as $s) {
            Satuan::firstOrCreate(['nama_satuan' => $s]);
        }
    }
}
