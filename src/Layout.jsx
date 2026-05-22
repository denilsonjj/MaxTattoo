import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, Image, LogOut, Menu, Settings, X } from "lucide-react";
import { supabase } from "./supabaseClient";

const navItems = [
  { to: "/", label: "Site principal", icon: Home },
  { to: "/dashboard", label: "Dashboard", icon: Image },
  { to: "/admin-settings", label: "Configurações", icon: Settings },
];

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
    navigate("/");
  };

  const isPublicPage = location.pathname === "/" || location.pathname === "/login";

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-[#080807]">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#080807] text-[#f4efe7]">
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/[0.08] bg-[#0c0c0a]/96 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/[0.08] px-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-[#b72f36]/45 bg-[#b72f36]/12 text-sm font-black shadow-[0_0_24px_rgba(183,47,54,0.18)]">
              M
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em]">Max Admin</p>
              <p className="mt-1 text-xs text-[#d4ccc0]/44">Supabase CMS</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-[#d4ccc0]/70">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className="px-3 pb-2 text-[0.68rem] font-black uppercase tracking-[0.28em] text-[#d4ccc0]/36">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "border-[#b72f36]/38 bg-[#b72f36]/12 text-[#f4efe7]"
                    : "border-transparent text-[#d4ccc0]/60 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-[#f4efe7]"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-4">
          <div className="mb-3 rounded-lg border border-white/[0.08] bg-white/[0.035] p-3">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#d4ccc0]/36">Conectado</p>
            <p className="mt-2 truncate text-sm text-[#f4efe7]">{user?.email || "Sessão local"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-[#b72f36]/24 bg-[#b72f36]/8 px-4 py-3 text-sm font-bold text-[#ffb8bd] transition-colors hover:bg-[#b72f36]/14"
          >
            <LogOut size={19} />
            Sair
          </button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/[0.08] bg-[#080807]/82 px-4 backdrop-blur-xl md:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} className="text-[#f4efe7]" />
          </button>
          <span className="font-black uppercase tracking-[0.16em]">Painel</span>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
