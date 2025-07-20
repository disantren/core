import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import DashboardLayout from '@/layouts/Dashboard/dashboard-layout';
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ClassManagement() {
    const { props } = usePage();

    const { units, kelas }: { units: Array<Unit>, kelas: Array<Kelas> } = (props as unknown as { units: Array<Unit>, kelas: Array<Kelas> });

    const [selectedUnitId, setSelectedUnitId] = useState(units[0]?.id || 0);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({ id: 0, nama_kelas: "", unit_id: selectedUnitId });

    const handleOpenCreate = () => {
        setForm({ id: 0, nama_kelas: "", unit_id: selectedUnitId });
        setOpen(true);
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

    const handleOpenEdit = (kelas: Kelas) => {
        setForm(kelas);
        setOpen(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUnitChange = (value: string) => {
        setSelectedUnitId(Number(value));
    };

    const handleFormUnitChange = (value: string) => {
        setForm({ ...form, unit_id: Number(value) });
    };

    const handleSubmit = () => {
        if (form.id) {
            router.patch(route('kelas.edit'), form, {
                onSuccess: () => {
                    toast.success('Kelas berhasil diupdate', {
                        position: "top-right",
                    });
                }
            });
        } else {
            router.post(route('kelas.create'), form, {
                onSuccess: () => {
                    toast.success('Kelas berhasil dibuat', {
                        position: "top-right",
                    });
                }
            });
        }
        setOpen(false);
    };

    const handleDelete = (id: number) => {
        router.delete(route('kelas.delete', id), {
            onSuccess: () => {
                toast.success('Kelas berhasil dihapus', {
                    position: "top-right",
                });
            }
        });
    };

    const filteredClasses = kelas.filter((k) => k.unit_id === selectedUnitId);

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Manajemen Kelas</h1>
                        <p className="text-gray-500 mt-1">Kelola kelas berdasarkan unit pondok pesantren</p>
                    </header>

                    <div className="mb-4 flex items-center gap-4">
                        <Select onValueChange={handleUnitChange} defaultValue={selectedUnitId.toString()}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Pilih Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={unit.id.toString()}>{unit.nama_unit}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleOpenCreate}>Tambah Kelas</Button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50 hover:bg-gray-100">
                                    <TableHead>Nama Kelas</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClasses.length > 0 ? (
                                    filteredClasses.map((kelas) => (
                                        <TableRow key={kelas.id} className="hover:bg-gray-50">
                                            <TableCell>
                                                <div className="font-medium text-gray-800">{kelas.nama_kelas}</div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(kelas)}>Edit</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(kelas.id)}>Hapus</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} className="h-24 text-center text-gray-500">
                                            Tidak ada kelas untuk unit ini.
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
                        <DialogTitle>{form.id ? "Edit Kelas" : "Tambah Kelas"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            name="nama_kelas"
                            placeholder="Nama kelas"
                            value={form.nama_kelas}
                            onChange={handleChange}
                        />
                        <Select value={form.unit_id.toString()} onValueChange={handleFormUnitChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Unit" />
                            </SelectTrigger>
                            <SelectContent>
                                {units.map((unit) => (
                                    <SelectItem key={unit.id} value={unit.id.toString()}>{unit.nama_unit}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSubmit}>{form.id ? "Update" : "Simpan"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
