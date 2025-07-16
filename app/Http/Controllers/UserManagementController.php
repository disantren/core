<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    public function __invoke()
    {



        $users_list = User::with("role")->get();
        $roles_list = Role::all();

        return Inertia::render("user-management/user-management", [
            "users" => $users_list,
            "roles" => $roles_list,
        ]);
    }

    public function Role()
    {


        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();

        return Inertia::render("user-management/role-management", [
            "roles" => $roles_list,
            "permissions" => $permissions_list,
        ]);
    }

    public function Permission()
    {

        $permissions_list = Permission::all();

        return Inertia::render(
            "user-management/permission-management",
            [
                "permissions" => $permissions_list,
            ]
        );
    }

    public function create_permission(Request $request)
    {
        $request->validate([
            "name" => "required|unique:permissions,name",
        ]);

        $permission = Permission::create([
            "name" => $request->name,
        ]);

        return redirect()->route("user-management.permission")->with("success", "");
    }

    public function edit_permission(Request $request)
    {
        $request->validate([
            "permission_id" => "required",
            "name" => "required",
        ]);

        $permission = Permission::find($request->permission_id);
        $permission->update([
            "name" => $request->name,
        ]);
    }


    public function create_user(Request $request)
    {
        $request->validate([
            "name" => "required",
            "email" => "required|email",
            "password" => "required",
            "role_id" => "required",
        ]);

        Log::info($request->all());

        User::create([
            "role_id" => $request->role_id,
            "name" => $request->name,
            "email" => $request->email,
            "password" => bcrypt($request->password),
        ]);
    }

    public function create_role(Request $request)
    {
        $request->validate([
            "name" => "required",
            "permissions" => "required",
        ]);

        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();

        // Permission berbentuk array yang berisi id permission
        $role = Role::create([
            "name" => $request->name,
        ]);

        $role->permissions()->attach($request->permissions);

        return Inertia::render("user-management/role-management", [
            "roles" => $roles_list,
            "permissions" => $permissions_list,
        ]);
    }
    public function edit_role(Request $request)
    {
        $request->validate([
            "role_id" => "required",
            "name" => "required",
            "permissions" => "required",
        ]);

        $roles_list = Role::with("permissions")->get();
        $permissions_list = Permission::all();
        $role = Role::find($request->role_id);
        $role->update([
            "name" => $request->name,
        ]);



        $role->permissions()->sync($request->permissions);
    }
}
