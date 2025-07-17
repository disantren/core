import { useState } from "react";
import { Home, Settings, User, ChevronDown, ChevronRight } from "lucide-react";

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

const items: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Pengaturan",
    icon: Settings,
    children: [
      {
        title: "Units",
        url: "/dashboard/app-setting/unit"
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
            {item.icon && <item.icon className="w-4 h-4" />}
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
  const { props } = usePage()
  const { app_setting }: { app_setting: PondokPesantren } = props as unknown as { app_setting: PondokPesantren }

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
              <RenderMenuItems items={items} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
