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
    DropdownMenuTrigger
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, ShieldPlus, Search, FilePenLine } from "lucide-react";
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";


const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function RoleManagement() {

    // --- HOOKS ---
    // Using usePage() from Inertia.js, with a fallback to mock data for standalone demonstration
    const { props } = usePage();
    const roles: Role[] = (props.roles as Role[])?.length > 0 ? props.roles as Role[] : [];
    const allPermissions: Permission[] = (props.permissions as Permission[])?.length > 0 ? props.permissions as Permission[] : [];

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [roleData, setRoleData] = useState({ role_id: 0, name: '', permissions: [] as number[] });
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props])



    const handleCreate = () => {
        setRoleData({ role_id: 0, name: '', permissions: [] });
        setIsCreateModalOpen(true);
    };

    // Open edit modal and populate with selected role's data
    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setRoleData({
            role_id: role.id,
            name: role.name,
            permissions: role.permissions.map(p => p.id),
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoleData({ ...roleData, name: e.target.value });
    };

    // Handle checkbox changes for permissions
    const handlePermissionChange = (permissionId: number) => {
        setRoleData(prevData => {
            const newPermissions = prevData.permissions.includes(permissionId)
                ? prevData.permissions.filter(id => id !== permissionId)
                : [...prevData.permissions, permissionId];
            return { ...prevData, permissions: newPermissions };
        });
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Creating role:", roleData);

        router.post(route('user-management.create_role'), roleData);
        setIsCreateModalOpen(false); // Close modal on submit
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`Updating role ${selectedRole?.id}:`, roleData);

        router.patch(route('user-management.edit_role'), roleData, {
            onSuccess: () => {
                toast.success("Role updated successfully", {
                    position: "top-right",
                });
            },
            onError: (e) => {
                console.log(e)
            },
        });
        setIsEditModalOpen(false); // Close modal on submit
    };

    // Filter roles based on search term
    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    // --- RENDER ---
    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Role Management</h1>
                        <p className="text-gray-500 mt-1">Atur role dan permissions untuk setiap pengguna.</p>
                    </header>

                    {/* Toolbar: Search and Create Button */}
                    <div className="flex justify-between items-center mb-4">
                        <div className="relative w-full max-w-xs">
                            <Input
                                type="text"
                                placeholder="Cari role..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                        <Button onClick={handleCreate}>
                            <ShieldPlus className="mr-2 h-4 w-4" /> Tambah Role
                        </Button>
                    </div>

                    {/* Role Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead className="w-[25%]">Role Name</TableHead>
                                    <TableHead className="w-[50%]">Permissions</TableHead>
                                    <TableHead>Created On</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRoles.length > 0 ? (
                                    filteredRoles.map((role) => (
                                        <TableRow key={role.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{role.name}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map((permission) => (
                                                        <Badge key={permission.id} variant="outline" className="font-normal">{permission.name}</Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{formatDate(role.created_at)}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Buka menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => handleEdit(role)}>
                                                            <FilePenLine className="mr-2 h-4 w-4" />
                                                            <span>Edit</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            Role tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Create Role Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmitCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Role Baru</DialogTitle>
                            <DialogDescription>
                                Buat role baru dan tentukan permissions yang dimiliki.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama Role
                                </Label>
                                <Input id="name" value={roleData.name} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Permissions</Label>
                                <div className="col-span-3 grid grid-cols-2 gap-2">
                                    {allPermissions.map(permission => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`create-${permission.id}`}
                                                checked={roleData.permissions.includes(permission.id)}
                                                onCheckedChange={() => handlePermissionChange(permission.id)}
                                            />
                                            <Label htmlFor={`create-${permission.id}`} className="font-normal text-sm">{permission.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Simpan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Role Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmitEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Role</DialogTitle>
                            <DialogDescription>
                                Ubah nama dan permissions untuk role <span className="font-semibold">{selectedRole?.name}</span>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name-edit" className="text-right">
                                    Nama Role
                                </Label>
                                <Input id="name-edit" value={roleData.name} onChange={handleInputChange} className="col-span-3" required />
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Permissions</Label>
                                <div className="col-span-3 grid grid-cols-2 gap-2">
                                    {allPermissions.map(permission => (
                                        <div key={permission.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`edit-${permission.id}`}
                                                checked={roleData.permissions.includes(permission.id)}
                                                onCheckedChange={() => handlePermissionChange(permission.id)}
                                            />
                                            <Label htmlFor={`edit-${permission.id}`} className="font-normal text-sm">{permission.name}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Batal</Button>
                            </DialogClose>
                            <Button type="submit">Simpan Perubahan</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Role Alert Dialog */}
            {/* <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus role <span className="font-semibold">{selectedRole?.name}</span> secara permanen.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog> */}

        </DashboardLayout>
    );
}
