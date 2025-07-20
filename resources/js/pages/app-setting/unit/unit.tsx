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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RoleManagement() {
    const { props } = usePage();
    const { units }: { units: Array<Unit> } = props.props as unknown as { units: Array<Unit> };

    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ id: 0, nama_unit: "" });


    useEffect(() => {
        const errors = props.errors
        const error_key = Object.keys(errors)
        error_key.forEach(key => {
            toast.error(errors[key], {
                position: "top-right",
            })
        })
    }, [props])

    const handleOpenCreate = () => {
        setForm({ id: 0, nama_unit: "" });
        setOpen(true);
    };

    const handleOpenEdit = (unit: Unit) => {
        setForm(unit);
        setOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (form.id) {
            // Simulasikan update

            router.patch(route('app-setting.unit.update'), form, {
                onSuccess: () => {
                    toast.success('Unit berhasil diupdate', {
                        position: "top-right",
                    });
                }
            });
        } else {
            router.post(route('app-setting.unit.create'), form, {
                onSuccess: () => {
                    toast.success('Unit berhasil dibuat', {
                        position: "top-right",
                    });
                }
            });    
        }
        setOpen(false);
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Units Management</h1>
                        <p className="text-gray-500 mt-1">Atur units untuk pondok pesantren</p>
                    </header>

                    <div className="mb-4 flex justify-end">
                        <Button onClick={handleOpenCreate}>Tambah Unit</Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead className="w-[50%]">Nama Unit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.length > 0 ? (
                                    units.map((unit) => (
                                        <TableRow key={unit.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{unit.nama_unit}</div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() => handleOpenEdit(unit)}
                                                        >
                                                            <span className="sr-only">Buka menu</span>
                                                            <PenLine className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                            Unit tidak ditemukan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{form.id ? "Edit Unit" : "Tambah Unit"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            name="nama_unit"
                            placeholder="Nama unit"
                            value={form.nama_unit}
                            onChange={handleChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>{form.id ? "Update" : "Simpan"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
