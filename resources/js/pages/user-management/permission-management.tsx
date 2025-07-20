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
import { Label } from "@/components/ui/label";
import { MoreHorizontal, ShieldPlus, Search, FilePenLine } from "lucide-react";
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { useEffect, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";



export default function RoleManagement() {
    const { props } = usePage();
    const { errors } = props;
    const permissions: Permission[] = (props.permissions as Permission[])?.length > 0 ? props.permissions as Permission[] : [];


    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
    const [permissionData, setPermissionData] = useState({ permission_id: 0, name: '', permissions: [] as number[] });
    const [searchTerm, setSearchTerm] = useState('');

    const handleCreate = () => {
        setPermissionData({ permission_id: 0, name: '', permissions: [] });
        setIsCreateModalOpen(true);
    };

    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props])


    const handleEdit = (permission: Permission) => {
        setSelectedPermission(permission);
        // @ts-expect-error type
        setPermissionData({
            permission_id: permission.id,
            name: permission.name
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPermissionData({ ...permissionData, name: e.target.value });
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('user-management.create_permission'), permissionData, {
            onSuccess: () => {
                toast.success("Permission created successfully", {
                    position: "top-right",
                });
            },
            onError: () => {
                toast.error(errors.name, {
                    position: "top-right",
                    style: {
                        background: "red",
                        color: "white",
                    },
                });
            }
        });
        setIsCreateModalOpen(false);
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        router.patch(route('user-management.edit_permission'), permissionData, {
            onSuccess: () => {
                toast.success("Permission updated successfully", {
                    position: "top-right",
                });
            },
            onError: () => {
                toast.error(errors.name, {
                    position: "top-right",
                    style: {
                        background: "red",
                        color: "white",
                    },
                });
            }
        });
        setIsEditModalOpen(false); // Close modal on submit
    };

    // Filter roles based on search term
    const filteredPermissions = permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


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
                            <ShieldPlus className="mr-2 h-4 w-4" /> Tambah Permission
                        </Button>
                    </div>

                    {/* Role Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead className="w-[50%]">Permissions</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPermissions.length > 0 ? (
                                    filteredPermissions.map((permission) => (
                                        <TableRow key={permission.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{permission.name}</div>
                                            </TableCell>
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
                                                        <DropdownMenuItem onClick={() => handleEdit(permission)}>
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
                                            Permission tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Create Permission Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmitCreate}>
                        <DialogHeader>
                            <DialogTitle>Tambah Permission Baru</DialogTitle>
                            <DialogDescription>
                                Buat permission baru dan tentukan permissions yang dimiliki.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Nama Permission
                                </Label>
                                <Input id="name" value={permissionData.name} onChange={handleInputChange} className="col-span-3" required />
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

            {/* Edit Permission Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <form onSubmit={handleSubmitEdit}>
                        <DialogHeader>
                            <DialogTitle>Edit Permission</DialogTitle>
                            <DialogDescription>
                                Ubah nama dan permissions untuk permission <span className="font-semibold">{selectedPermission?.name}</span>.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name-edit" className="text-right">
                                    Nama Permission
                                </Label>
                                <Input id="name-edit" value={permissionData.name} onChange={handleInputChange} className="col-span-3" required />
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

            {/* Delete Permission Alert Dialog */}
            {/* <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus permission <span className="font-semibold">{selectedPermission?.name}</span> secara permanen.
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
