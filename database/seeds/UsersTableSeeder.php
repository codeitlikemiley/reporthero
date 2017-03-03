<?php

use Illuminate\Database\Seeder;
use Reporthero\User;


class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \Bouncer::seeder(function () {
        \Bouncer::allow('admin')->to(['ban-user', 'add-user', 'delete-user', 'view-user', 'edit-user']);
        \Bouncer::allow('user')->to('update-profile');
        });

        $user = User::create([
            'email' => 'admin@reporthero.io',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'password' => bcrypt('adminpass')
        ]);
        \Bouncer::assign('admin')->to($user);

    }
}
