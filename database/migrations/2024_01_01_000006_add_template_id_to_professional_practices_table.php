<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('professional_practices', function (Blueprint $table) {
            $table->foreignId('template_id')->nullable()->after('participation_level_id')->constrained('practice_type_templates')->onDelete('set null');
            $table->json('template_data')->nullable()->after('additional_data');
        });
    }

    public function down(): void
    {
        Schema::table('professional_practices', function (Blueprint $table) {
            $table->dropForeign(['template_id']);
            $table->dropColumn(['template_id', 'template_data']);
        });
    }
};