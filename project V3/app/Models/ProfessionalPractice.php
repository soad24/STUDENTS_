<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ProfessionalPractice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'practice_type_id',
        'participation_type_id',
        'participation_level_id',
        'title',
        'description',
        'organization',
        'start_date',
        'end_date',
        'duration_hours',
        'additional_data',
        'attachments',
        'status',
        'calculated_points',
        'reviewer_notes',
        'reviewed_by',
        'reviewed_at',
        'approver_notes',
        'approved_by',
        'approved_at',
        'certifier_notes',
        'certified_by',
        'certified_at',
        'submission_deadline',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'additional_data' => 'array',
        'attachments' => 'array',
        'reviewed_at' => 'datetime',
        'approved_at' => 'datetime',
        'certified_at' => 'datetime',
        'submission_deadline' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function practiceType()
    {
        return $this->belongsTo(PracticeType::class);
    }

    public function participationType()
    {
        return $this->belongsTo(ParticipationType::class);
    }

    public function participationLevel()
    {
        return $this->belongsTo(ParticipationLevel::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function certifier()
    {
        return $this->belongsTo(User::class, 'certified_by');
    }

    public function calculatePoints()
    {
        $basePoints = $this->practiceType->base_points;
        $participationMultiplier = $this->participationType->multiplier;
        $levelMultiplier = $this->participationLevel->multiplier;
        
        return $basePoints * $participationMultiplier * $levelMultiplier;
    }

    public function isWithinSubmissionDeadline()
    {
        if (!$this->submission_deadline) {
            return true;
        }
        
        return Carbon::now()->lte($this->submission_deadline);
    }

    public function getStatusBadgeClass()
    {
        return match($this->status) {
            'pending' => 'badge-warning',
            'under_review' => 'badge-info',
            'approved' => 'badge-success',
            'rejected' => 'badge-danger',
            'certified' => 'badge-primary',
            default => 'badge-secondary',
        };
    }

    public function getStatusText()
    {
        return match($this->status) {
            'pending' => 'في الانتظار',
            'under_review' => 'قيد المراجعة',
            'approved' => 'معتمد',
            'rejected' => 'مرفوض',
            'certified' => 'مصدق',
            default => 'غير محدد',
        };
    }
}