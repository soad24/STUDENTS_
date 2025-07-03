<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PracticeTypeTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'participation_types',
        'participation_levels',
        'custom_fields',
        'point_calculation_rules',
        'is_active',
        'created_by',
    ];

    protected $casts = [
        'participation_types' => 'array',
        'participation_levels' => 'array',
        'custom_fields' => 'array',
        'point_calculation_rules' => 'array',
        'is_active' => 'boolean',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function professionalPractices()
    {
        return $this->hasMany(ProfessionalPractice::class, 'template_id');
    }

    public function calculatePoints($formData)
    {
        $totalPoints = 0;
        
        if (!empty($this->point_calculation_rules)) {
            foreach ($this->point_calculation_rules as $rule) {
                if (isset($formData[$rule['field']]) && $formData[$rule['field']] == $rule['value']) {
                    $totalPoints += $rule['points'];
                }
            }
        }
        
        return $totalPoints;
    }
}