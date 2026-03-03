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
        Schema::create('connected_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('account_id')->unique(); // Meta Account ID
            $table->string('name');
            $table->enum('type', ['FB Page', 'IG Business']);
            $table->text('access_token');
            $table->timestamp('token_expiry')->nullable();
            $table->enum('status', ['Aktif', 'Perlu Re-auth', 'Terputus'])->default('Aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('connected_accounts');
    }
};
