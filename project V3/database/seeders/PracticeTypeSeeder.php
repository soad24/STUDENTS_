<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PracticeType;

class PracticeTypeSeeder extends Seeder
{
    public function run(): void
    {
        $practiceTypes = [
            [
                'name_ar' => 'التدريب على رأس العمل',
                'name_en' => 'On-the-job Training',
                'description' => 'التدريب في بيئة العمل الفعلية',
                'base_points' => 20,
            ],
            [
                'name_ar' => 'التدريب الاختياري',
                'name_en' => 'Optional Training',
                'description' => 'التدريب التطوعي خارج المنهج',
                'base_points' => 15,
            ],
            [
                'name_ar' => 'الزيارات الميدانية',
                'name_en' => 'Field Visits',
                'description' => 'زيارات للمؤسسات والشركات',
                'base_points' => 5,
            ],
            [
                'name_ar' => 'ورش العمل والندوات',
                'name_en' => 'Workshops and Seminars',
                'description' => 'المشاركة في ورش العمل والندوات المهنية',
                'base_points' => 10,
            ],
            [
                'name_ar' => 'المؤتمرات المهنية',
                'name_en' => 'Professional Conferences',
                'description' => 'حضور أو المشاركة في المؤتمرات',
                'base_points' => 15,
            ],
            [
                'name_ar' => 'المسابقات والهاكاثونات',
                'name_en' => 'Competitions and Hackathons',
                'description' => 'المشاركة في المسابقات التقنية',
                'base_points' => 25,
            ],
            [
                'name_ar' => 'المعارض',
                'name_en' => 'Exhibitions',
                'description' => 'المشاركة في المعارض المهنية',
                'base_points' => 10,
            ],
            [
                'name_ar' => 'عضوية الجمعيات المهنية',
                'name_en' => 'Professional Society Membership',
                'description' => 'العضوية في الجمعيات المهنية المتخصصة',
                'base_points' => 15,
            ],
            [
                'name_ar' => 'الشهادات الاحترافية',
                'name_en' => 'Professional Certifications',
                'description' => 'الحصول على شهادات مهنية معتمدة',
                'base_points' => 30,
            ],
            [
                'name_ar' => 'العمل بدوام جزئي',
                'name_en' => 'Part-time Work',
                'description' => 'العمل في تخصص ذي صلة',
                'base_points' => 20,
            ],
            [
                'name_ar' => 'العمل التطوعي',
                'name_en' => 'Volunteer Work',
                'description' => 'الأنشطة التطوعية المجتمعية',
                'base_points' => 10,
            ],
            [
                'name_ar' => 'مشاريع ريادة الأعمال',
                'name_en' => 'Entrepreneurship Projects',
                'description' => 'تأسيس أو المشاركة في مشاريع ريادية',
                'base_points' => 35,
            ],
            [
                'name_ar' => 'البحوث العلمية المنشورة',
                'name_en' => 'Published Research',
                'description' => 'نشر البحوث في المجلات العلمية',
                'base_points' => 40,
            ],
            [
                'name_ar' => 'براءات الاختراع',
                'name_en' => 'Patents',
                'description' => 'الحصول على براءات اختراع',
                'base_points' => 50,
            ],
            [
                'name_ar' => 'الجوائز المهنية',
                'name_en' => 'Professional Awards',
                'description' => 'الحصول على جوائز في المجال المهني',
                'base_points' => 25,
            ],
        ];

        foreach ($practiceTypes as $type) {
            PracticeType::create($type);
        }
    }
}