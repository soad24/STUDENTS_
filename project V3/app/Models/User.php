<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'student_id',
        'role',
        'branch',
        'college',
        'department',
        'phone',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function professionalPractices()
    {
        return $this->hasMany(ProfessionalPractice::class);
    }

    public function reviewedPractices()
    {
        return $this->hasMany(ProfessionalPractice::class, 'reviewed_by');
    }

    public function approvedPractices()
    {
        return $this->hasMany(ProfessionalPractice::class, 'approved_by');
    }

    public function certifiedPractices()
    {
        return $this->hasMany(ProfessionalPractice::class, 'certified_by');
    }

    public function isStudent()
    {
        return $this->role === 'student';
    }

    public function isReviewer()
    {
        return $this->role === 'reviewer';
    }

    public function isApprover()
    {
        return $this->role === 'approver';
    }

    public function isCertifier()
    {
        return $this->role === 'certifier';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function getTotalPoints()
    {
        return $this->professionalPractices()
            ->where('status', 'approved')
            ->sum('calculated_points');
    }
}