import { Header, Navigation } from "@/components";
import { AuthProvider } from "@/hooks/auth/useAuth";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>
                <Header />
                <Navigation />
                {children}
            </AuthProvider>
        </>
    );
}