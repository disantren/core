import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, Search, UserPlus, FilePenLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";
import { User } from "@/types";


// --- MAIN COMPONENT ---
export default function UserManagementPage() {
    const { props } = usePage();
    const initialUsers: User[] = props.users as User[];
    const roles_list: Role[] = props.roles as Role[];

    const [users, setUsers] = useState<User[]>(initialUsers);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const [currentUser, setCurrentUser] = useState<User | null>(null);


    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props])

    useEffect(() => {
        setUsers(initialUsers);
    }, [initialUsers]);

    const handleAddNew = () => {
        setCurrentUser(null);
        setIsFormOpen(true);
    };
    const handleEdit = (user: User) => {
        setCurrentUser(user); 
        setIsFormOpen(true);
    };

    const handleDelete = (user: User) => {
        setCurrentUser(user); 
        setIsAlertOpen(true);
    };

    const handleCreateUser = (userData: User) => {
        router.post(route('user-management.create_user'), userData, {
            onSuccess: () => {
                toast.success("User created successfully", {
                    position: "top-right",
                });
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || "Failed to create user.";
                toast.error(errorMessage, {
                    position: "top-right",
                    style: {
                        background: "red",
                        color: "white",
                    },
                });
            },
            preserveScroll: true, 
        });
        setIsFormOpen(false); 
    };
    const handleEditUser = (userData: User) => {
        if (!currentUser || !currentUser.id) {
            toast.error("User ID is missing for update.", { position: "top-right", style: { background: "red", color: "white" } });
            return;
        }

        console.log(userData);


        router.patch(route('user-management.edit_user', { user: currentUser.id }), userData, {
            onSuccess: () => {
                toast.success("User updated successfully", {
                    position: "top-right",
                });
                // Inertia will automatically re-fetch props.users, which updates the 'users' state via useEffect
            },
            onError: (errors) => {
                // Display all validation errors or a generic error message
                const errorMessage = Object.values(errors).flat().join(', ') || "Failed to update user.";
                toast.error(errorMessage, {
                    position: "top-right",
                    style: {
                        background: "red",
                        color: "white",
                    },
                });
            },
            preserveScroll: true, // Keep scroll position after form submission
        });
        setIsFormOpen(false); // Close the form dialog
    };

    const handleConfirmDelete = () => {
        if (!currentUser || !currentUser.id) {
            toast.error("No user selected for deletion.", { position: "top-right", style: { background: "red", color: "white" } });
            return;
        }

        // Send a DELETE request to the backend
        router.delete(route('user-management.destroy_user', { user: currentUser.id }), {
            onSuccess: () => {
                toast.success("User deleted successfully", {
                    position: "top-right",
                });
                // Filter the user from the local state for immediate UI update
                setUsers(prevUsers => prevUsers.filter(u => u.id !== currentUser.id));
            },
            onError: (errors) => {
                const errorMessage = Object.values(errors).flat().join(', ') || "Failed to delete user.";
                toast.error(errorMessage, {
                    position: "top-right",
                    style: {
                        background: "red",
                        color: "white",
                    },
                });
            },
            preserveScroll: true,
        });
        setIsAlertOpen(false); 
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole =
            roleFilter === "all" || user.role?.name.toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                        <p className="text-gray-500 mt-1">Manage users, roles, and permissions efficiently.</p>
                    </header>

                    {/* Toolbar: Search, Filter, and Add Button */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by name or email..."
                                className="pl-10 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    {roles_list.map(role => (
                                        <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAddNew} className="w-full md:w-auto">
                                <UserPlus className="mr-2 h-4 w-4" /> Add User
                            </Button>
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead className="w-[35%]">User</TableHead>
                                    <TableHead className="w-[30%]">Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <TableRow key={user.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {user.role?.name}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(user)}>
                                                            <FilePenLine className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(user)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center text-gray-500">
                                            No users found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Add/Edit User Dialog */}
                <UserFormDialog
                    isOpen={isFormOpen}
                    setIsOpen={setIsFormOpen}
                    user={currentUser} // Pass the user object for editing, or null for new
                    roles={roles_list}
                    onSave={handleCreateUser} // Handler for creating new user
                    onEdit={handleEditUser}   // Handler for editing existing user
                />

                {/* Delete Confirmation Dialog */}
                <DeleteConfirmationDialog
                    isOpen={isAlertOpen}
                    setIsOpen={setIsAlertOpen}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </DashboardLayout>
    );
}


// --- DIALOG COMPONENTS ---

// UserFormDialog component for adding and editing users
function UserFormDialog({ isOpen, setIsOpen, user, roles, onSave, onEdit }: { isOpen: boolean, setIsOpen: (open: boolean) => void, user: User | null, roles: Role[], onSave: (userData: User) => void, onEdit: (userData: User) => void }) {
    // State for form fields
    const [name, setName] = useState<string | undefined>();
    const [email, setEmail] = useState<string | undefined>();
    const [password, setPassword] = useState<string | undefined>();
    const [assignedRoleId, setAssignedRoleId] = useState<number | string | undefined>();

    // Effect to populate form fields when 'user' prop changes (for editing)
    // or to clear fields when 'isOpen' is true and 'user' is null (for new user)
    useEffect(() => {
        if (isOpen) {
            if (user) {
                // If user object is provided, populate form for editing
                setName(user.name);
                setEmail(user.email);
                setAssignedRoleId(user.role_id);
                setPassword(''); // Password field is cleared for security, user can set new
            } else {
                // If no user object, clear form for new user creation
                setName("");
                setEmail("");
                setPassword("");
                setAssignedRoleId("");
            }
        }
    }, [user, isOpen]); // Re-run when user or isOpen changes

    // Handler for form submission (both create and edit)
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create a userData object from form states
        const userData: User = {
            name: name!, // Assert as non-null since inputs are required
            email: email!,
            role_id: assignedRoleId as number, // Cast to number
        };

        // Only include password if it's provided (for new user or if user wants to change password)
        if (password) {
            userData.password = password;
        }

        // Determine whether to call onEdit or onSave based on 'user' prop existence
        if (user) {
            // If 'user' exists, it's an edit operation, add the user's ID
            userData.id = user.id;
            onEdit(userData);
        } else {
            // If 'user' is null, it's a new user creation
            onSave(userData);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                            {user ? 'Update the user details and their role.' : 'Fill in the details to create a new user.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            {/* Password is required for new users, optional for existing */}
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={user ? "Leave blank to keep current" : "Required"} className="col-span-3" required={!user} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">Role</Label>
                            <Select value={String(assignedRoleId)} onValueChange={(value) => setAssignedRoleId(Number(value))}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(role => (
                                        <SelectItem key={role.id} value={String(role.id)}>{role.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// DeleteConfirmationDialog component for confirming user deletion
function DeleteConfirmationDialog({ isOpen, setIsOpen, onConfirm }: { isOpen: boolean, setIsOpen: (open: boolean) => void, onConfirm: React.MouseEventHandler<HTMLButtonElement> | undefined }) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user account and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                        Yes, delete user
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
