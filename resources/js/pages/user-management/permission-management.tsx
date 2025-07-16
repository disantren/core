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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Search, UserPlus, FilePenLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";

// --- MOCK DATA ---
// Simulating your database tables

const allRoles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Editor" },
    { id: 3, name: "Viewer" },
    { id: 4, name: "Content Manager" },
];

const initialUsers = [
    {
        id: 1,
        name: "Anya Forger",
        email: "anya.forger@eden.edu",
        created_at: "2023-01-15T10:00:00Z",
        roleIds: [1, 3],
    },
    {
        id: 2,
        name: "Loid Forger",
        email: "loid.forger@wise.org",
        created_at: "2023-02-20T11:30:00Z",
        roleIds: [1],
    },
    {
        id: 3,
        name: "Yor Forger",
        email: "yor.forger@garden.org",
        created_at: "2023-03-10T09:00:00Z",
        roleIds: [2],
    },
    {
        id: 4,
        name: "Damian Desmond",
        email: "damian.desmond@eden.edu",
        created_at: "2023-04-05T14:20:00Z",
        roleIds: [3],
    },
    {
        id: 5,
        name: "Franky Franklin",
        email: "franky.franklin@info.net",
        created_at: "2023-05-01T18:00:00Z",
        roleIds: [4, 3],
    },
];

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

// --- MAIN COMPONENT ---
export default function UserManagementPage() {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // --- Filtering Logic ---
    const filteredUsers = users
        .filter((user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter((user) => {
            if (roleFilter === "all") return true;
            const role = allRoles.find(r => r.name === roleFilter);
            return user.roleIds.includes(role.id);
        });

    // --- Event Handlers ---
    const handleAddNew = () => {
        setCurrentUser(null);
        setIsFormOpen(true);
    };

    const handleEdit = (user) => {
        setCurrentUser(user);
        setIsFormOpen(true);
    };

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user.id !== userId));
    };

    const handleSaveUser = (userData) => {
        if (currentUser) {
            setUsers(users.map(u => u.id === currentUser.id ? { ...u, ...userData } : u));
        } else {
            const newUser = {
                id: Math.max(...users.map(u => u.id)) + 1,
                ...userData,
                created_at: new Date().toISOString(),
            };
            setUsers([...users, newUser]);
        }
        setIsFormOpen(false);
    };

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
                                    {allRoles.map(role => (
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50">
                                    <TableHead>No</TableHead>
                                    <TableHead>Permission</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user, idx) => (
                                        <TableRow key={user.id}>
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{idx + 1}</div>
                                            </TableCell>
                                            <TableCell>
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

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                                                    <span className="text-red-500">Delete</span>
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the user account for <span className="font-semibold">{user.name}</span>.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700">
                                                                        Yes, delete user
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>

                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
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
                    user={currentUser}
                    onSave={handleSaveUser}
                />
            </div>
        </DashboardLayout>
    );
}

function UserFormDialog({ isOpen, setIsOpen, user, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [assignedRoles, setAssignedRoles] = useState(new Set());

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPassword(''); // Don't pre-fill password for security
            setAssignedRoles(new Set(user.roleIds));
        } else {
            // Reset form for new user
            setName('');
            setEmail('');
            setPassword('');
            setAssignedRoles(new Set());
        }
    }, [user, isOpen]); // Rerun effect when user or dialog open state changes

    const handleRoleChange = (roleId) => {
        const newRoles = new Set(assignedRoles);
        if (newRoles.has(roleId)) {
            newRoles.delete(roleId);
        } else {
            newRoles.add(roleId);
        }
        setAssignedRoles(newRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name,
            email,
            roleIds: Array.from(assignedRoles),
        };
        // Only include password if it's been entered
        if (password) {
            userData.password = password; // In a real app, you'd hash this
        }
        onSave(userData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[480px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                            {user ? 'Update the user details below.' : 'Fill in the details to create a new user.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Permission</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
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
