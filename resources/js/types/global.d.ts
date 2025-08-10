import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
    interface AppSettingsProps {
        id: number;
        nama_pondok_pesantren: string;
        logo_img: string;
        alamat: string;
        instagram: string;
        facebook: string;
        website: string;
        linkedin: string;
        created_at: string | null;
        updated_at: string | null;
    }

    interface Permission {
        id: number;
        name: string;
        created_at: string | null;
        updated_at: string | null;
    }

    interface PermissionProps {
        id?: number | undefined;
        name?: string | undefined;
        created_at?: string | null;
        updated_at?: string | null;
    }

    interface Role {
        id: number;
        name: string;
        created_at: string;
        updated_at: string;
        permissions: Permission[];
    }

    interface PondokPesantren {
        nama_pondok_pesantren: string;
        logo_img: string;
        alamat: string;
        instagram: string;
        facebook: string;
        website: string;
        linkedin: string;
        created_at: string | null;
        updated_at: string;
    }

    interface Unit {
        id: number;
        nama_unit: string;
        created_at: string;
        updated_at: string;
    }

    import { LucideIcon } from 'lucide-react';

    interface MenuItem {
        title: string;
        url?: string;
        icon?: LucideIcon;
        children?: MenuItem[];
    }


    interface PaginatedSantri {
        data: Santri[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }
    

    interface Kelas {
        id: number;
        unit_id: number;
        nama_kelas: string;
        created_at?: string | null;
        updated_at?: string | null;
        deleted_at?: string | null;
        unit?: Unit;
    }

    interface Kamar {
        id: number;
        nama_kamar: string;
        created_at: string | null;
        updated_at: string | null;
    }

    export interface TahunAjaran {
        id: number;
        nama_tahun_ajaran: string;
    }

    export interface SantriKelas {
        santri_id: number;
        kelas_id: number;
        tahun_ajaran_id: number;
        kelas: Kelas;
        tahun_ajaran: TahunAjaran;
    }

    export interface Santri {
        id: number;
        nama: string;
        tanggal_lahir: string;
        alamat: string;
        ibu_kandung: string;
        ayah_kandung: string;
        nisn: string;
        no_hp: string;
        no_hp_orang_tua: string;
        status: 'aktif' | 'non-aktif' | 'alumni';
        unit_id: number;
        kelas_id: number;
        kamar_id: number;
        unit: Unit;
        kelas: Kelas;
        kamar: Kamar;
        santri_kelas: SantriKelas[];
    }

    export interface SantriFormData {
        nama: string;
        nisn: string;
        tanggal_lahir: string;
        alamat: string;
        ibu_kandung: string;
        ayah_kandung: string;
        no_hp: string;
        no_hp_orang_tua: string;
        status: 'aktif' | 'non-aktif' | 'alumni';
        unit_id: number;
        kelas_id: number;
        kamar_id?: number;
        password?: string;
    }

    export interface PaginatedResponse<T> {
        data: T[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    }

    export interface SantriManagementProps {
        santri: PaginatedResponse<Santri>;
        units: Unit[];
        kelas: Kelas[];
        kamars: Kamar[];
        tahunAjaran: TahunAjaran[];
        filters: {
            search: string;
            unit_id?: number;
            kelas_id?: number;
            kamar_id?: number;
            tahun_ajaran_id?: number;
            status?: string;
        };
    }
}
