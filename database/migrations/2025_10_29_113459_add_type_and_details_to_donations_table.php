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
    Schema::table('donations', function (Blueprint $table) {
        $table->enum('type', ['money', 'items'])->default('money');
        $table->string('item_category')->nullable();
        $table->text('item_description')->nullable();
        $table->string('pickup_location')->nullable();
        $table->string('contact')->nullable();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            //
        });
    }
};
