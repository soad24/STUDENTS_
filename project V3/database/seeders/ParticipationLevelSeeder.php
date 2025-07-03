<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParticipationLevel;

class ParticipationLevelSeeder extends Seeder
{
    public function run(): void
    {
        $participationLevels = [
            [
                'name_ar' => 'الفرع',
                'name_en' => 'Branch Level',
                'multiplier' => 1,
            ],
            [
                'name_ar' => 'الجامعة',
                'name_en' => 'University Level',
                'multiplier' => 2,
            ],
            [
                'name_ar' => 'محلي',
                'name_en' => 'Local Level',
                'multiplier' => 3,
            ],
            [
                'name_ar' => 'إقليمي',
                'name_en' => 'Regional Level',
                'multiplier' => 4,
            ],
            [
                'name_ar' => 'دولي',
                'name_en' => 'International Level',
                'multiplier' => 5,
            ],
        ];

        foreach ($participationLevels as $level) {
            ParticipationLevel::create($level);
        }
    }
}