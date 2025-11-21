import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { Home, Image, Settings, Menu, X, LogOut } from "lucide-react";
import { supabase } from "./supabaseClient";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isPublicPage = location.pathname === "/" || location.pathname === "/login";

  if (isPublicPage) {
    return <div className="min-h-screen bg-[#101010]"><Outlet /></div>;
  }

  return (
    <div className="min-h-screen flex w-full bg-[#101010]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 md:translate-x-0 md:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#E60000] rounded-full flex items-center justify-center text-white font-bold">M</div>
             <span className="font-bold text-gray-900">Max Admin</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500"><X size={24} /></button>
        </div>
        <nav className="p-4 space-y-2">
          <p className="px-4 text-xs font-semibold uppercase tracking-wider mb-2">Menu</p>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"><Home size={20}/> Site Principal</Link>
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === '/dashboard' ? 'bg-gray-100 text-[#E60000] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><Image size={20}/> Portfólio</Link>
          <Link to="/admin-settings" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${location.pathname === '/admin-settings' ? 'bg-gray-100 text-[#E60000] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}><Settings size={20}/> Configurações</Link>
          
          <div className="pt-8 border-t border-gray-100 mt-4">
             <div className="px-4 mb-4 text-sm text-gray-500 truncate">{user?.email}</div>
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"><LogOut size={20}/> Sair</button>
          </div>
        </nav>
      </aside>
      
      <div className="flex-1 flex flex-col min-w-0 bg-[#101010]">
        <header className="md:hidden bg-white px-4 py-3 flex items-center gap-4 border-b border-gray-200">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} className="text-gray-900" />
          </button>
          <span className="font-bold text-gray-900">Painel</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
