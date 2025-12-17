import { Header, SideNavigation } from "@/components";
import { SidebarMenuItem } from "@/components/common/SideNavigation";
import AdminGate from "@/components/auth/AdminGate";
import { AuthProvider } from "@/hooks/auth/useAuth";
import AddCardOutlined from "@mui/icons-material/AddCardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";

const sidebarItems: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    to: "/admin",
  },
  {
    id: "grammar-management",
    label: "Quản lý ngữ pháp",
    icon: <LanguageOutlinedIcon />,
    to: "/admin/grammar-management",
  },
  {
    id: "minigame-management",
    label: "Quản lý mini game",
    icon: <SportsEsportsOutlinedIcon />,
    to: "/admin/minigame-management",
  },
  {
    id: "exercise-management",
    label: "Quản lý bài tập",
    icon: <QuizOutlinedIcon />,
    to: "/admin/exercise-management",
  },
  {
    id: "flashcard-management",
    label: "Quản lý flashcard",
    icon: <AddCardOutlined />,
    to: "/admin/flashcard-management",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGate>
        <div className="flex min-h-screen flex-col bg-gray-50">
          <Header />
          <div className="flex flex-1 pt-20">
            <SideNavigation items={sidebarItems} />
            <main className="flex-1 overflow-y-auto transition-all duration-300 ml-[260px]">
              {children}
            </main>
          </div>
        </div>
      </AdminGate>
    </AuthProvider>
  );
}
