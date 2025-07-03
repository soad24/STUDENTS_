<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParticipationLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'name_ar',
        'name_en',
        'multiplier',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function professionalPractices()
    {
        return $this->hasMany(ProfessionalPractice::class);
    }
}