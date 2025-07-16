<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function __invoke(){



        $users_list = User::with("roles")->get();

        return Inertia::render("user-management/user-management", [
            "users" => $users_list,
        ]);
    }

    public function Role(){


        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();

        return Inertia::render("user-management/role-management", [
            "roles" => $roles_list,
            "permissions" => $permissions_list,
        ]);
    }

    public function Permission(){
        return Inertia::render("user-management/permission-management");
    }

    public function create_user(Request $request){
        $request->validate([
            "name" => "required",
            "email" => "required|email",
            "password" => "required",
            "role_id" => "required",
        ]);

        $user = User::create([
            "name"=> $request->name,
            "email"=> $request->email,
            "password"=> bcrypt($request->password),
        ]);

        $user->roles()->attach($request->role_id);

        return Inertia::render("user-management/create-user", [
            "user" => $user,
        ]);
    }

    public function create_role(Request $request){
        $request->validate([
            "name" => "required",
            "permissions" => "required",
        ]);

        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();

        // Permission berbentuk array yang berisi id permission
        $role = Role::create([
            "name"=> $request->name,
        ]);

        $role->permissions()->attach($request->permissions);

        return Inertia::render("user-management/role-management", [
            "roles" => $roles_list,
            "permissions" => $permissions_list,
        ]);
    }
    public function edit_role(Request $request){
        $request->validate([
            "role_id" => "required",
            "name" => "required",
            "permissions"=> "required",
        ]);

        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();
        $role = Role::find($request->role_id);
        $role->update([
            "name"=> $request->name,
        ]);



        $role->permissions()->sync($request->permissions);
    }
}
