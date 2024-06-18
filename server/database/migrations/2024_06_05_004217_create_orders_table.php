<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('status', ['open', 'await', 'accepted', 'delivering', 'delivered', 'cancelled']);
            $table->enum('payment_type', ['cash', 'card']);
            $table->string('start_location');
            $table->string('end_location');
            $table->string('start_location_lat_long');
            $table->string('end_location_lat_long');
            $table->dateTime('start_at');
            $table->integer('appoint_to_user')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
