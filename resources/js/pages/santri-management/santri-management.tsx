import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import ModalAddSantri from "./components/modal-add-santri";
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

function SantriManagement() {
    const { props } = usePage();
    const urlParams = new URLSearchParams(window.location.search);

    const { santri, units, kelas }: {
        santri: PaginatedSantri,
        units: Array<Unit>,
        kelas: Array<Kelas>,
    } = props as unknown as {
        santri: PaginatedSantri,
        units: Array<Unit>,
        kelas: Array<Kelas>
    };

    // Ambil default filter dari URL agar sinkron
    const [filters, setFilters] = useState({
        unit_id: urlParams.get("unit_id") || "all",
        kelas_id: urlParams.get("kelas_id") || "all",
        kamar_id: urlParams.get("kamar_id") || "all",
        search: urlParams.get("search") || "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; nama: string } | null>(null);

    type QueryParams = {
        [key: string]: string | number | boolean | undefined;
    };

    const buildParams = (filterData: typeof filters, extra: QueryParams = {}) => {
        const params = Object.fromEntries(
            Object.entries(filterData).filter(([key, value]) => {
                if (key === "search") return value.trim() !== "";
                return value !== "all" && value !== "";
            })
        );
        return { ...params, ...extra };
    };

    const applyFilters = (filterData: typeof filters) => {
        setIsLoading(true);
        router.get(route("santri.index"), buildParams(filterData), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (key !== "search") {
            applyFilters(newFilters);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            applyFilters(filters);
        }, 400);
        return () => clearTimeout(timeout);
    }, [filters.search]);

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            aktif: { variant: "default" as const, label: "Aktif" },
            nonaktif: { variant: "secondary" as const, label: "Non-Aktif" },
            lulus: { variant: "outline" as const, label: "Lulus" },
            pindah: { variant: "destructive" as const, label: "Pindah" },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.aktif;
        return <Badge variant={config.variant}>{config.label}</Badge>;
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Manajemen Santri</h1>
                    <p className="text-gray-600">Kelola data santri pesantren</p>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="
      grid gap-3 sm:gap-4
      grid-cols-1
      md:grid-cols-[1fr_auto_auto_auto]
      items-end
    "
                        >
                            {/* Search */}
                            <div className="w-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pencarian
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Cari nama atau NISN..."
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        className="pl-10 w-full"
                                    />
                                </div>
                            </div>

                            {/* Unit */}
                            <div className="w-full md:w-[180px] lg:w-[220px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <Select value={filters.unit_id} onValueChange={(v) => handleFilterChange("unit_id", v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Semua Unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Unit</SelectItem>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                                {unit.nama_unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kelas */}
                            <div className="w-full md:w-[180px] lg:w-[220px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                                <Select value={filters.kelas_id} onValueChange={(v) => handleFilterChange("kelas_id", v)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Semua Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {kelas.map((k) => (
                                            <SelectItem key={k.id} value={k.id.toString()}>
                                                {k.nama_kelas}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Add Button */}
                            <div className="w-full md:w-auto">
                                <Button
                                    onClick={() => setShowAddModal(true)}
                                    className="w-full md:w-auto"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Tambah Santri
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Add Santri Modal */}
                <ModalAddSantri
                    open={showAddModal}
                    onOpenChange={setShowAddModal}
                    units={units}
                />

                {/* Data Table */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Data Santri</CardTitle>
                            <div className="text-sm text-gray-600">
                                Menampilkan {santri.data.length} dari {santri.total} santri
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>NIS</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>NISN</TableHead>
                                                <TableHead>Unit</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>No. HP</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {santri.data.length > 0 ? (
                                                santri.data.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-mono">{item.nis || '-'}</TableCell>
                                                        <TableCell className="font-medium">{item.nama}</TableCell>
                                                        <TableCell>{item.nisn}</TableCell>
                                                        <TableCell>{item.unit?.nama_unit || "-"}</TableCell>
                                                        <TableCell>{item.kelas?.nama_kelas || "-"}</TableCell>
                                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                        <TableCell>{item.no_hp || "-"}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="outline" size="sm" onClick={() => router.get(route("santri.show", item.id))}>
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="outline" size="sm" onClick={() => router.get(route("santri.edit", item.id))}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setDeleteTarget({ id: item.id, nama: item.nama });
                                                                        setIsDeleteOpen(true);
                                                                    }}
                                                                    className="text-red-600 hover:text-red-700"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                        Tidak ada data santri ditemukan
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                {santri.last_page > 1 && (
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="text-sm text-gray-600">
                                            Halaman {santri.current_page} dari {santri.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={santri.current_page === 1}
                                                onClick={() => {
                                                    setIsLoading(true);
                                                    router.get(route("santri.index"), buildParams(filters, { page: santri.current_page - 1 }), {
                                                        preserveState: true,
                                                        onFinish: () => setIsLoading(false),
                                                    });
                                                }}
                                            >
                                                Sebelumnya
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={santri.current_page === santri.last_page}
                                                onClick={() => {
                                                    setIsLoading(true);
                                                    router.get(route("santri.index"), buildParams(filters, { page: santri.current_page + 1 }), {
                                                        preserveState: true,
                                                        onFinish: () => setIsLoading(false),
                                                    });
                                                }}
                                            >
                                                Selanjutnya
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteOpen}
                setIsOpen={(open) => {
                    setIsDeleteOpen(open);
                    if (!open) setDeleteTarget(null);
                }}
                name={deleteTarget?.nama}
                onConfirm={() => {
                    if (!deleteTarget) return;
                    router.delete(route("santri.destroy", deleteTarget.id), {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsDeleteOpen(false),
                    });
                }}
            />
        </DashboardLayout>
    );
}

export default SantriManagement;

// DeleteConfirmationDialog component for confirming santri deletion
function DeleteConfirmationDialog({
    isOpen,
    setIsOpen,
    onConfirm,
    name,
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    onConfirm: React.MouseEventHandler<HTMLButtonElement> | undefined;
    name?: string;
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus santri?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {`Tindakan ini akan mengarsipkan (soft delete) data santri${name ? ` "${name}"` : ""}. Anda dapat memulihkannya nanti jika diperlukan.`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
                        Hapus
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
