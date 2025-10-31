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
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          <h2 className={`font-bold text-primary transition-all ${open ? "text-xl" : "text-sm"}`}>
            {open ? "Konzup Hub" : "K"}
          </h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
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
