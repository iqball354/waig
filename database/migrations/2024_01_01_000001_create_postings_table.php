<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('postings', function (Blueprint $blade) {
            $blade->id();
            $blade->string('media_url');
            $blade->text('caption');
            $blade->dateTime('scheduled_at');
            $blade->enum('platform', ['Instagram', 'Facebook']);
            $blade->enum('status', ['Terjadwal', 'Sukses', 'Gagal'])->default('Terjadwal');
            $blade->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('postings');
    }
};
