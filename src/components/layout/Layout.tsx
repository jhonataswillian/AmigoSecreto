import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Routes that don't show the sidebar (public routes)
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute || !isAuthenticated) {
    return (
      <main className="min-h-screen w-full relative overflow-hidden">
        <div className="snow-container absolute inset-0 pointer-events-none z-0">
          <div className="snow"></div>
        </div>
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex min-h-screen bg-christmas-cream">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white/80 backdrop-blur-md border-b border-christmas-gold/20 flex items-center justify-between px-4 sticky top-0 z-30">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-christmas-wine hover:bg-christmas-wine/5 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-display text-xl font-bold text-christmas-wine">Amigo Secreto</span>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto relative">
           <div className="snow-container absolute inset-0 pointer-events-none z-0 opacity-50">
            <div className="snow"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
