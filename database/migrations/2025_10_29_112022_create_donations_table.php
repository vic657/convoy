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
    Schema::create('donations', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('user_id')->nullable(); // optional: if logged-in users donate
        $table->unsignedBigInteger('event_id')->nullable(); // link to event
        $table->string('donor_name');
        $table->string('email')->nullable();
        $table->decimal('amount', 10, 2);
        $table->string('payment_method')->nullable(); // e.g. M-Pesa, Card, Bank
        $table->string('transaction_id')->nullable(); // optional, if using integration
        $table->text('message')->nullable();
        $table->timestamps();

        $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};
