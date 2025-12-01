import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Gift,
  Bell,
  User,
  LogOut,
  X,
  Github,
  Linkedin,
  Heart,
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useNotificationStore } from "../../store/useNotificationStore";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FrameRenderer } from "../profile/FrameRenderer";
import { FRAMES } from "../../data/avatars";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/groups", icon: Home, label: "Grupos" },
    { path: "/wishlist", icon: Gift, label: "Presentes" },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notificações",
      badge: unreadCount,
    },
    { path: "/profile", icon: User, label: "Perfil" },
    { path: "/donate", icon: Heart, label: "Contribua" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-72 bg-christmas-wine text-white z-50 transition-transform duration-300 ease-in-out shadow-2xl md:translate-x-0 md:static md:h-screen md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-christmas-gold rounded-full flex items-center justify-center shadow-lg">
                <Gift className="w-6 h-6 text-christmas-wine" />
              </div>
              <h1 className="font-display text-2xl font-bold text-christmas-gold">
                Amigo Secreto
              </h1>
            </div>
            <button
              onClick={onClose}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info (Optional) */}
          {user && (
            <div className="mb-8 p-4 bg-white/10 rounded-2xl flex items-center gap-3 border border-white/10">
              <div className="relative w-10 h-10">
                <div
                  className={cn(
                    "w-full h-full rounded-full overflow-hidden bg-white/20",
                    user.frame?.class,
                  )}
                >
                  <img
                    src={
                      user.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                    }
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <FrameRenderer frame={user.frame || FRAMES[0]} />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate">{user.name}</p>
                <p className="text-xs text-white/70 truncate">{user.handle}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group relative notranslate",
                      isActive
                        ? "bg-white text-christmas-wine shadow-lg shadow-black/10"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )
                  }
                  translate="no"
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                      isActive
                        ? "text-christmas-wine"
                        : "text-white/70 group-hover:text-white",
                    )}
                  />
                  <span>{item.label}</span>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute right-4 bg-christmas-gold text-christmas-wine text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Developer Credits */}
          <div className="px-4 py-4 text-center">
            <p className="text-[10px] text-white/40 mb-2 font-medium tracking-wide uppercase">
              Desenvolvido com{" "}
              <span className="text-red-400 animate-pulse">❤</span> por
            </p>
            <p className="text-xs text-white/60 font-medium mb-3">
              Jhonatas Willian
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://github.com/jhonataswillian"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                title="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/in/jhonataswillian"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-blue-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Footer / Logout */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
