import DashboardLayout from "@/layouts/Dashboard/dashboard-layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";

interface Unit {
    id: number;
    nama_unit: string;
}

interface Kelas {
    id: number;
    nama_kelas: string;
}

interface Kamar {
    id: number;
    nama_kamar: string;
}

interface Santri {
    id: number;
    nama: string;
    nisn: string;
    unit?: Unit;
    kelas?: Kelas;
    kamar?: Kamar;
    status: string;
    tanggal_lahir: string;
    no_hp?: string;
    alamat?: string;
}

interface PaginatedSantri {
    data: Santri[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

function SantriManagement() {
    const { props } = usePage()
    const { santri, units, kelas, kamar }: { 
        santri: PaginatedSantri, 
        units: Array<Unit>, 
        kelas: Array<Kelas>, 
        kamar: Array<Kamar> 
    } = props as unknown as { 
        santri: PaginatedSantri, 
        units: Array<Unit>, 
        kelas: Array<Kelas>, 
        kamar: Array<Kamar> 
    }

    const [filters, setFilters] = useState({
        unit_id: 'all',
        kelas_id: 'all',
        kamar_id: 'all',
        search: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (filterData: typeof filters) => {
        setIsLoading(true);
        const params = Object.fromEntries(
            Object.entries(filterData).filter(([key, value]) => {
                if (key === 'search') return value !== '';
                return value !== 'all' && value !== '';
            })
        );
        
        router.get(route('santri.index'), params, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            'aktif': { variant: 'default' as const, label: 'Aktif' },
            'nonaktif': { variant: 'secondary' as const, label: 'Non-Aktif' },
            'lulus': { variant: 'outline' as const, label: 'Lulus' },
            'pindah': { variant: 'destructive' as const, label: 'Pindah' }
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

                {/* Filters and Actions */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filter & Pencarian</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            {/* Search */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pencarian
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Cari nama atau NISN..."
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* Unit Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unit
                                </label>
                                <Select value={filters.unit_id} onValueChange={(value) => handleFilterChange('unit_id', value)}>
                                    <SelectTrigger className="w-[180px]">
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

                            {/* Kelas Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kelas
                                </label>
                                <Select value={filters.kelas_id} onValueChange={(value) => handleFilterChange('kelas_id', value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Semua Kelas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kelas</SelectItem>
                                        {kelas.map((kelas) => (
                                            <SelectItem key={kelas.id} value={kelas.id.toString()}>
                                                {kelas.nama_kelas}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kamar Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Kamar
                                </label>
                                <Select value={filters.kamar_id} onValueChange={(value) => handleFilterChange('kamar_id', value)}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Semua Kamar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kamar</SelectItem>
                                        {kamar.map((kamar) => (
                                            <SelectItem key={kamar.id} value={kamar.id.toString()}>
                                                {kamar.nama_kamar}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Add Button */}
                            <Button 
                                onClick={() => router.get(route('santri.create'))}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Tambah Santri
                            </Button>
                        </div>
                    </CardContent>
                </Card>

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
                                                <TableHead>Nama</TableHead>
                                                <TableHead>NISN</TableHead>
                                                <TableHead>Unit</TableHead>
                                                <TableHead>Kelas</TableHead>
                                                <TableHead>Kamar</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>No. HP</TableHead>
                                                <TableHead className="text-right">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {santri.data.length > 0 ? (
                                                santri.data.map((item) => (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium">{item.nama}</TableCell>
                                                        <TableCell>{item.nisn}</TableCell>
                                                        <TableCell>{item.unit?.nama_unit || '-'}</TableCell>
                                                        <TableCell>{item.kelas?.nama_kelas || '-'}</TableCell>
                                                        <TableCell>{item.kamar?.nama_kamar || '-'}</TableCell>
                                                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                                                        <TableCell>{item.no_hp || '-'}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => router.get(route('santri.show', item.id))}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => router.get(route('santri.edit', item.id))}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        if (confirm('Apakah Anda yakin ingin menghapus santri ini?')) {
                                                                            router.delete(route('santri.destroy', item.id));
                                                                        }
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
                                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
                                                    const params = { ...filters, page: santri.current_page - 1 };
                                                    router.get(route('santri.index'), params, { preserveState: true });
                                                }}
                                            >
                                                Sebelumnya
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={santri.current_page === santri.last_page}
                                                onClick={() => {
                                                    const params = { ...filters, page: santri.current_page + 1 };
                                                    router.get(route('santri.index'), params, { preserveState: true });
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
        </DashboardLayout>
    );
}

export default SantriManagement;