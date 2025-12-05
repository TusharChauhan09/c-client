import { UserProfile } from "@clerk/clerk-react";
import useUIStore from "@/store/useUIStore";

export default function UserProfilePage() {
  const theme = useUIStore((state) => state.theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <UserProfile 
        path="/user-profile"
        routing="path"
        appearance={{
          variables: {
            colorPrimary: isDark ? "#ffffff" : "#000000",
            colorBackground: isDark ? "#0a0a0a" : "#ffffff",
            colorInputBackground: isDark ? "#1a1a1a" : "#f5f5f5",
            colorText: isDark ? "#ffffff" : "#000000",
            colorTextSecondary: isDark ? "#a1a1a1" : "#6b7280",
            borderRadius: "0.5rem",
          },
          elements: {
            rootBox: "w-full",
            card: isDark ? "bg-[#0a0a0a] shadow-lg border border-white/10" : "bg-white shadow-lg border border-black/10",
            headerTitle: "font-serif",
            formButtonPrimary: isDark 
              ? "bg-white text-black hover:bg-gray-200" 
              : "bg-black text-white hover:bg-gray-800",
            navbar: isDark ? "bg-[#1a1a1a]" : "bg-gray-100",
            navbarButton: isDark ? "text-white hover:bg-[#2a2a2a]" : "text-black hover:bg-gray-200",
          },
        }}
      />
    </div>
  );
}
