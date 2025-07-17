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
}
