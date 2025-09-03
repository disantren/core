/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { Home, Settings, User, ChevronDown, ChevronRight, Building, UserRound, Banknote, CalendarCheck } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";
import { Separator } from "./ui/separator";

// Define base menu items with optional role/permission gates
const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Akuntansi",
    url: "/dashboard/akuntansi",
    icon: Banknote,
    children: [
      {
        title: "Laporan",
        url: "/dashboard/akuntansi",
      },
      {
        title: "Akun",
        url: "/dashboard/akuntansi/akun",
      },
      {
        title: "Jurnal",
        url: "/dashboard/akuntansi/jurnal",
      },
      {
        title: "Pembayaran",
        url: "/dashboard/akuntansi/pembayaran",
      },
      
    ]
  },
  {
    title: "Sarana Prasarana",
    icon: Building,
    children: [
      {
        title: "Kelas",
        url: "/dashboard/kelas",
      },
      {
        title: "Kamar",
        url: "/dashboard/kamar",
      }
    ]
  },
  {
    title: "Kesantrian",
    icon: UserRound,
    children: [
      {
        title: "Santri",
        url: "/dashboard/santri",
      }
    ]
  },
  {
    title: "Pengaturan",
    icon: Settings,
    // Only for Admins by default
    roles: ["Admin"],
    children: [
      {
        title: "Units",
        url: "/dashboard/app-setting/unit",
      },
      {
        title: "App Setting",
        url: "/dashboard/app-setting",
      },
    ]
  },
  {
    title: "User Management",
    icon: User,
    // Only for Admins by default
    roles: ["Admin"],
    children: [
      {
        title: "User List",
        url: "/dashboard/user-management",
      },
      {
        title: "Roles",
        url: "/dashboard/user-management/roles",
      },
      {
        title: "Permission",
        url: "/dashboard/user-management/permissions",
      },
    ],
  },
];

function isAllowed(item: MenuItem, roleName?: string, permissions: string[] = []) {
  // If item defines allowed roles and current role not included, block
  if (item.roles && item.roles.length > 0) {
    if (!roleName || !item.roles.map(r => r.toLowerCase()).includes(roleName.toLowerCase())) {
      return false;
    }
  }
  // If item defines required permissions and user doesn't have them, block
  if (item.permissions && item.permissions.length > 0) {
    const userPerms = new Set(permissions.map(p => p.toLowerCase()));
    // Require all permissions in the list
    const ok = item.permissions.every(p => userPerms.has(p.toLowerCase()));
    if (!ok) return false;
  }
  return true;
}

function filterMenu(items: MenuItem[], roleName?: string, permissions: string[] = []): MenuItem[] {
  return items
    .map((item) => {
      // First, filter children recursively
      const children = item.children ? filterMenu(item.children, roleName, permissions) : undefined;
      const withChildren: MenuItem = { ...item, children };
      // Then, check if the item itself is allowed
      const allowedSelf = isAllowed(withChildren, roleName, permissions);
      // Keep item if allowed and either has a URL or has any children left
      const hasVisibleChildren = !!(withChildren.children && withChildren.children.length > 0);
      if (!allowedSelf && !hasVisibleChildren) return null as unknown as MenuItem;
      return allowedSelf || hasVisibleChildren ? withChildren : null as unknown as MenuItem;
    })
    .filter(Boolean) as MenuItem[];
}

function CollapsibleMenuItem({ item }: { item: MenuItem }) {

  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => hasChildren ? setOpen(!open) : null}
        >
          <Link
            href={item.url as string}
            className="flex items-center gap-2 flex-1"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            {/* {item.icon && <item.icon className="w-4 h-4" />} */}
            <span>{item.title}</span>
          </Link>
          {hasChildren && (
            <span>
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>
      </SidebarMenuButton>

      {hasChildren && open && (
        <SidebarMenu className="ml-4">
          {item.children?.map((child) => (
            <CollapsibleMenuItem key={child.title} item={child} />
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  );
}

function RenderMenuItems({ items }: { items: MenuItem[] }) {
  return items.map((item) => (
    <CollapsibleMenuItem key={item.title} item={item} />
  ));
}

export function AppSidebar() {
  const { props } = usePage();
  const { app_setting } = props as unknown as { app_setting: PondokPesantren };
  const roleName = (props as any)?.auth?.user?.role?.name as string | undefined;
  const permissions = ((props as any)?.auth?.user?.role?.permissions || []).map((p: any) => p.name as string);
  const authSantri = (props as any)?.auth?.santri;

  // Build items dynamically to inject feature-based menu
  const menuItems = useMemo(() => {
    // If logged in as santri, show a minimal menu
    if (authSantri) {
      const base: MenuItem[] = [];
      if (app_setting?.attendance_enabled) {
        base.push({ title: 'Absensi', url: '/santri/absen', icon: CalendarCheck });
      }
      return base;
    }

    // Default admin/staff menu
    const base = JSON.parse(JSON.stringify(items)) as MenuItem[];
    if (app_setting?.attendance_enabled) {
      // Find Kesantrian group and append Absensi
      const kesantrian = base.find(i => i.title === 'Kesantrian');
      if (kesantrian) {
        kesantrian.children = kesantrian.children || [];
        // Avoid duplicates
        if (!kesantrian.children.find(c => c.title === 'Absensi')) {
          kesantrian.children.push({
            title: 'Absensi',
            url: '/dashboard/attendance',
            icon: CalendarCheck,
          });
        }
      }
    }
    return base;
  }, [authSantri, app_setting?.attendance_enabled]);

  const visibleItems = useMemo(() => filterMenu(menuItems, roleName, permissions), [menuItems, roleName, permissions]);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarContent className="flex flex-row items-center">
          <img src={`/storage/${app_setting.logo_img}`} alt="Logo" className="w-15 h-15 object-cover" />
          <h1 className="text-xl font-bold ml-2">{app_setting.nama_pondok_pesantren}</h1>
        </SidebarContent>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <RenderMenuItems items={visibleItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
