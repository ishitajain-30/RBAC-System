import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Users, UserCircle, Shield, Key, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { MobileNav } from "./MobileNav";
import { cn } from "../../utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: UserCircle },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Roles", href: "/dashboard/roles", icon: Shield },
  { name: "Permissions", href: "/dashboard/permissions", icon: Key },
];

export function DashboardLayout() {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Sidebar for desktop */}
        <div
          className={cn(
            "fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-200 lg:static lg:translate-x-0",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center justify-between px-6">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <MobileNav
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
          <nav className="space-y-1 px-3 py-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium",
                    location.pathname === item.href
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-900 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="bg-white shadow-sm">
            <div className="flex h-16 items-center justify-between px-4 lg:px-6">
              <MobileNav
                isOpen={isMobileMenuOpen}
                onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
              <div></div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-900">
                  {user?.name}
                </span>
                <div className="h-8 w-8 rounded-full bg-gray-200" />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-x-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
