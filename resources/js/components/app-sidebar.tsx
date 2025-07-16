import { useState } from "react";
import { Home, Settings, User, ChevronDown, ChevronRight } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "App Setting",
    url: "/dashboard/app-setting",
    icon: Settings,
  },
  {
    title: "User Management",
    url: "/dashboard/user-management",
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

function CollapsibleMenuItem({ item }) {
  const [open, setOpen] = useState(false);

  const hasChildren = item.children && item.children.length > 0;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => hasChildren ? setOpen(!open) : null}
        >
          <a
            href={item.url}
            className="flex items-center gap-2 flex-1"
            onClick={(e) => hasChildren && e.preventDefault()}
          >
            {item.icon && <item.icon className="w-4 h-4" />}
            <span>{item.title}</span>
          </a>
          {hasChildren && (
            <span>
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
        </div>
      </SidebarMenuButton>

      {hasChildren && open && (
        <SidebarMenu className="ml-4">
          {item.children.map((child) => (
            <CollapsibleMenuItem key={child.title} item={child} />
          ))}
        </SidebarMenu>
      )}
    </SidebarMenuItem>
  );
}

function RenderMenuItems({ items }) {
  return items.map((item) => (
    <CollapsibleMenuItem key={item.title} item={item} />
  ));
}

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
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
