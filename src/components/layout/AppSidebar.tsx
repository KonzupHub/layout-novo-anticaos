import { Calendar, Briefcase, Upload, FileText, BarChart, Users, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dia de hoje", url: "/dashboard", icon: Calendar },
  { title: "Casos", url: "/dashboard/casos", icon: Briefcase },
  { title: "Importar planilha", url: "/dashboard/importar", icon: Upload },
  { title: "Modelos ANAC", url: "/dashboard/modelos", icon: FileText },
  { title: "Relatórios", url: "/dashboard/relatorios", icon: BarChart },
  { title: "Conta e equipe", url: "/dashboard/conta", icon: Users },
  { title: "Ajuda", url: "/dashboard/ajuda", icon: HelpCircle },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="bg-sidebar-background">
        <div className={cn(
          "px-4 py-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10 transition-all",
          open ? "" : "px-2"
        )}>
          <h2 className={cn(
            "font-bold text-primary transition-all",
            open ? "text-xl" : "text-sm text-center"
          )}>
            {open ? "Konzup Hub" : "K"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-4">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all relative",
                          "w-full text-left",
                          isActive
                            ? "bg-sidebar-accent/40 text-sidebar-accent-foreground"
                            : "text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
