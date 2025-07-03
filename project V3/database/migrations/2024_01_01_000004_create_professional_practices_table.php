<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professional_practices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('practice_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('participation_type_id')->constrained()->onDelete('cascade');
            $table->foreignId('participation_level_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('organization');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('duration_hours')->nullable();
            $table->json('additional_data')->nullable();
            $table->json('attachments')->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'certified'])->default('pending');
            $table->integer('calculated_points')->default(0);
            $table->text('reviewer_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->text('approver_notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('approved_at')->nullable();
            $table->text('certifier_notes')->nullable();
            $table->foreignId('certified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('certified_at')->nullable();
            $table->timestamp('submission_deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professional_practices');
    }
};