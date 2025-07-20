// resources/js/pages/santri-management/components/SantriFilters.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';
import { router } from '@inertiajs/react';



interface SantriFiltersProps {
    units: Unit[];
    kelas: Kelas[];
    kamars: Kamar[];
    tahunAjaran: TahunAjaran[];
    currentFilters: {
        search: string;
        unit_id?: number;
        kelas_id?: number;
        kamar_id?: number;
        tahun_ajaran_id?: number;
        status?: string;
    };
}

export function SantriFilters({
    units,
    kelas,
    kamars,
    tahunAjaran,
    currentFilters,
}: SantriFiltersProps) {
    const [search, setSearch] = useState(currentFilters.search || '');
    const [unitId, setUnitId] = useState<string>(
        currentFilters.unit_id?.toString() || ''
    );
    const [kelasId, setKelasId] = useState<string>(
        currentFilters.kelas_id?.toString() || ''
    );
    const [kamarId, setKamarId] = useState<string>(
        currentFilters.kamar_id?.toString() || ''
    );
    const [tahunAjaranId, setTahunAjaranId] = useState<string>(
        currentFilters.tahun_ajaran_id?.toString() || ''
    );
    const [status, setStatus] = useState(currentFilters.status || '');

    const handleSearch = () => {
        const params: any = {
            search,
        };

        if (unitId) params.unit_id = unitId;
        if (kelasId) params.kelas_id = kelasId;
        if (kamarId) params.kamar_id = kamarId;
        if (tahunAjaranId) params.tahun_ajaran_id = tahunAjaranId;
        if (status) params.status = status;

        router.get(route('santri-management.index'), params, {
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setSearch('');
        setUnitId('');
        setKelasId('');
        setKamarId('');
        setTahunAjaranId('');
        setStatus('');
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (search !== currentFilters.search) {
                handleSearch();
            }
        }, 500);

        return () => clearTimeout(debounce);
    }, [search]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Filter Santri</h3>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <Input
                        placeholder="Cari nama, NISN, atau nomor HP..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={unitId} onValueChange={setUnitId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Unit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Unit</SelectItem>
                        {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id.toString()}>
                                {unit.nama_unit}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={kelasId} onValueChange={setKelasId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Kelas</SelectItem>
                        {kelas.map((kelasItem) => (
                            <SelectItem key={kelasItem.id} value={kelasItem.id.toString()}>
                                {kelasItem.nama_kelas}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={kamarId} onValueChange={setKamarId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Kamar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Kamar</SelectItem>
                        {kamars.map((kamar) => (
                            <SelectItem key={kamar.id} value={kamar.id.toString()}>
                                {kamar.nama_kamar}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={tahunAjaranId} onValueChange={setTahunAjaranId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Tahun Ajaran" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Tahun</SelectItem>
                        {tahunAjaran.map((ta) => (
                            <SelectItem key={ta.id} value={ta.id.toString()}>
                                {ta.nama_tahun_ajaran}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Semua Status</SelectItem>
                        <SelectItem value="aktif">Aktif</SelectItem>
                        <SelectItem value="non-aktif">Non Aktif</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={handleSearch} className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    Terapkan Filter
                </Button>
            </div>
        </div>
    );
}