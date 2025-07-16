import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Toaster />
      <AppSidebar />
      <SidebarTrigger />
      <main className="flex items-center justify-center w-full">
        <SidebarInset>
          {children}
        </SidebarInset>
      </main>
    </SidebarProvider>
  )
}