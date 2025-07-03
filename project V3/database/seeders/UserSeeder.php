<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'مدير النظام',
            'email' => 'admin@athar.om',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Student User
        User::create([
            'name' => 'أحمد محمد الشريف',
            'email' => 'student@athar.om',
            'password' => Hash::make('password123'),
            'student_id' => '2021001234',
            'role' => 'student',
            'branch' => 'مسقط',
            'college' => 'الهندسة والتكنولوجيا',
            'department' => 'هندسة الحاسوب',
            'phone' => '96890123456',
        ]);

        // Reviewer User
        User::create([
            'name' => 'فاطمة علي المقبالي',
            'email' => 'reviewer@athar.om',
            'password' => Hash::make('password123'),
            'role' => 'reviewer',
            'branch' => 'مسقط',
        ]);

        // Approver User
        User::create([
            'name' => 'سالم بن عبدالله الهنائي',
            'email' => 'approver@athar.om',
            'password' => Hash::make('password123'),
            'role' => 'approver',
            'branch' => 'مسقط',
        ]);

        // Certifier User
        User::create([
            'name' => 'عائشة بنت سعيد البلوشي',
            'email' => 'certifier@athar.om',
            'password' => Hash::make('password123'),
            'role' => 'certifier',
            'branch' => 'مسقط',
        ]);
    }
}