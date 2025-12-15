import { Header, SideNavigation } from "@/components";
import { SidebarMenuItem } from "@/components/common/SideNavigation";
import { AuthProvider } from "@/hooks/auth/useAuth";
import AddCardOutlined from "@mui/icons-material/AddCardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";

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
    id: "vocabulary-management",
    label: "Quản lý từ vựng",
    icon: <TranslateOutlinedIcon />,
    to: "/admin/vocabulary-management",
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
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <div className="flex flex-1 pt-20">
          <SideNavigation items={sidebarItems} />
          <main className="flex-1 overflow-y-auto transition-all duration-300 ml-[260px]">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
