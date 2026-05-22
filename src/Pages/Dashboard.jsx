import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import PortfolioManager from '../components/dashboard/PortfolioManager';
import { ArrowUpRight, BadgeCheck, Image, Loader2, MapPin, Settings, Tag } from 'lucide-react';

function StatCard({ icon, label, value, helper }) {
  return (
    <div className="admin-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#d4ccc0]/42">{label}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-[#f4efe7]">{value}</p>
          {helper && <p className="mt-2 text-sm text-[#d4ccc0]/54">{helper}</p>}
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#b72f36]/26 bg-[#b72f36]/10 text-[#f4efe7]">
          {icon}
        </span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/login');
    });
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    setDataLoading(true);

    const [portfolioResult, pricingResult, promosResult, settingsResult] = await Promise.all([
      supabase.from('portfolio').select('*').order('created_at', { ascending: false }),
      supabase.from('pricing_tiers').select('*').order('created_at', { ascending: true }),
      supabase.from('promotions').select('*').order('created_at', { ascending: false }),
      supabase.from('site_settings').select('*').maybeSingle(),
    ]);

    if (portfolioResult.data) setImages(portfolioResult.data);
    if (pricingResult.data) setPricingTiers(pricingResult.data);
    if (promosResult.data) setPromotions(promosResult.data);
    if (settingsResult.data) setSiteSettings(settingsResult.data);

    const firstError = portfolioResult.error || pricingResult.error || promosResult.error || settingsResult.error;
    if (firstError) console.error('Erro ao carregar dashboard:', firstError);

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      queueMicrotask(() => {
        loadDashboardData();
      });
    }
  }, [loadDashboardData, session]);

  const activePromotions = useMemo(() => promotions.filter((promo) => promo.active), [promotions]);
  const missingProfileItems = useMemo(() => {
    if (!siteSettings) return ['perfil do estúdio'];

    return [
      !siteSettings.profile_image_url && 'foto do tatuador',
      !siteSettings.instagram_handle && 'Instagram',
      !siteSettings.phone_number && 'WhatsApp',
      !siteSettings.location && 'localização',
    ].filter(Boolean);
  }, [siteSettings]);

  if (loading) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Loader2 className="h-9 w-9 animate-spin text-[#b72f36]" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b7a27a]">Painel geral</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f4efe7] md:text-5xl">Dashboard Max Tattoo</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d4ccc0]/62">
            Tudo aqui vem direto do Supabase: portfólio, promoções, valores e informações públicas do site.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-black uppercase tracking-[0.14em] text-[#f4efe7] transition-colors hover:border-[#b7a27a]/50 hover:bg-white/[0.07]"
        >
          Ver site
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Image size={20} />} label="Portfólio" value={dataLoading ? '...' : images.length} helper="imagens publicadas" />
        <StatCard icon={<Tag size={20} />} label="Promoções" value={dataLoading ? '...' : activePromotions.length} helper={`${promotions.length} cadastradas no total`} />
        <StatCard icon={<BadgeCheck size={20} />} label="Valores" value={dataLoading ? '...' : pricingTiers.length} helper="opções de investimento" />
        <StatCard icon={<MapPin size={20} />} label="Local" value={siteSettings?.location || 'Não definido'} helper="visível no topo do site" />
      </div>

      {missingProfileItems.length > 0 && (
        <div className="admin-card border-[#b72f36]/26 bg-[#b72f36]/8 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black text-[#f4efe7]">Perfil incompleto</p>
              <p className="mt-2 text-sm text-[#d4ccc0]/62">
                Faltando: {missingProfileItems.join(', ')}.
              </p>
            </div>
            <Link
              to="/admin-settings"
              className="inline-flex items-center justify-center rounded-lg border border-[#b72f36]/30 px-4 py-2 text-sm font-bold text-[#ffb8bd] transition-colors hover:bg-[#b72f36]/12"
            >
              Ajustar perfil
              <Settings className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <section className="admin-card p-5 md:p-6">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#f4efe7]">Portfólio</h2>
            <p className="mt-2 text-sm text-[#d4ccc0]/54">As imagens abaixo alimentam a vitrine do site.</p>
          </div>
          {dataLoading && <Loader2 className="h-5 w-5 animate-spin text-[#b72f36]" />}
        </div>
        <PortfolioManager images={images} onUpdate={loadDashboardData} />
      </section>
    </div>
  );
}
