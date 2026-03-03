<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('connected_account_id')->constrained('connected_accounts')->onDelete('cascade');
            $table->string('media_url');
            $table->text('caption');
            $table->timestamp('scheduled_at');
            $table->enum('platform', ['Instagram', 'Facebook']);
            $table->enum('status', ['Terjadwal', 'Sukses', 'Gagal'])->default('Terjadwal');
            $table->text('error_message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('postings');
    }
};
