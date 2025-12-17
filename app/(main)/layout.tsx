import { Footer, Header, MainSidebar } from "@/components";
import { AuthProvider } from "@/hooks/auth/useAuth";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Header />
            <MainSidebar />
            <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 transition-all duration-300 flex flex-col">
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                        {children}
                    </div>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
}