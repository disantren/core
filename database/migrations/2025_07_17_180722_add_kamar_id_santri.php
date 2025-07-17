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
        Schema::table("santris", function (Blueprint $table) {  
            $table->unsignedBigInteger("kamar_id")->nullable();
            $table->foreign("kamar_id")->references("id")->on("kamar")->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table("santris", function (Blueprint $table) {
            $table->dropForeign("santri_kamar_id_foreign");
            $table->dropColumn("kamar_id");
        });
    }
};
