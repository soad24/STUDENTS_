<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ParticipationType;

class ParticipationTypeSeeder extends Seeder
{
    public function run(): void
    {
        $participationTypes = [
            [
                'name_ar' => 'حضور',
                'name_en' => 'Attendance',
                'multiplier' => 1,
            ],
            [
                'name_ar' => 'مشاركة',
                'name_en' => 'Participation',
                'multiplier' => 2,
            ],
            [
                'name_ar' => 'تقديم',
                'name_en' => 'Presentation',
                'multiplier' => 3,
            ],
            [
                'name_ar' => 'تنظيم',
                'name_en' => 'Organization',
                'multiplier' => 4,
            ],
            [
                'name_ar' => 'قيادة',
                'name_en' => 'Leadership',
                'multiplier' => 5,
            ],
        ];

        foreach ($participationTypes as $type) {
            ParticipationType::create($type);
        }
    }
}