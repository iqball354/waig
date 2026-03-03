<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('connected_accounts', function (Blueprint $blade) {
            $blade->id();
            $blade->string('account_id')->unique();
            $blade->string('name');
            $blade->string('type'); // e.g., FB Page, IG Business
            $blade->string('status');
            $blade->date('token_expiry');
            $blade->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('connected_accounts');
    }
};
