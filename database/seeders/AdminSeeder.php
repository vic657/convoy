<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@convoy.com'], // admin email
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Admin@1234'), // secure password
                'role' => 'admin', // make sure you have a 'role' column
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('Admin user created!');
    }
}
