import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Loader2, Settings, Tag } from 'lucide-react';

import PricingManager from '../components/admin/PricingManager';
import PromotionManager from '../components/admin/PromotionManager';
import SiteSettingsManager from '../components/admin/SiteSettingsManager';

function AdminSection({ icon, title, description, children }) {
  return (
    <section className="admin-card p-5 md:p-6">
      <div className="mb-6 flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-[#b72f36]/26 bg-[#b72f36]/10">
          {icon}
        </span>
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#f4efe7]">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-[#d4ccc0]/56">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function AdminSettings() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);

  const [siteSettings, setSiteSettings] = useState(null);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/login');
    });
  }, [navigate]);

  const loadData = useCallback(async () => {
    setDataLoading(true);

    const [settingsResult, pricesResult, promosResult] = await Promise.all([
      supabase.from('site_settings').select('*').maybeSingle(),
      supabase.from('pricing_tiers').select('*').order('created_at', { ascending: true }),
      supabase.from('promotions').select('*').order('created_at', { ascending: false }),
    ]);

    setSiteSettings(settingsResult.data || null);
    setPricingTiers(pricesResult.data || []);
    setPromotions(promosResult.data || []);

    const firstError = settingsResult.error || pricesResult.error || promosResult.error;
    if (firstError) console.error('Erro ao carregar configurações:', firstError);

    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (session) {
      queueMicrotask(() => {
        loadData();
      });
    }
  }, [loadData, session]);

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
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#b7a27a]">Configurações</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f4efe7] md:text-5xl">Conteúdo do site</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#d4ccc0]/62">
            Edite o que aparece publicamente no site. Ao salvar, os dados são recarregados do Supabase.
          </p>
        </div>
        {dataLoading && <Loader2 className="h-5 w-5 animate-spin text-[#b72f36]" />}
      </div>

      <AdminSection
        icon={<Settings className="h-5 w-5 text-[#f4efe7]" />}
        title="Perfil e contato"
        description="Foto do tatuador, Instagram, WhatsApp e localização exibidos no topo e no rodapé."
      >
        <SiteSettingsManager settings={siteSettings} onUpdate={loadData} />
      </AdminSection>

      <AdminSection
        icon={<DollarSign className="h-5 w-5 text-[#f4efe7]" />}
        title="Tabela de preços"
        description="Valores usados como referência na seção de investimento."
      >
        <PricingManager pricing={pricingTiers} onUpdate={loadData} />
      </AdminSection>

      <AdminSection
        icon={<Tag className="h-5 w-5 text-[#f4efe7]" />}
        title="Promoções"
        description="Campanhas ativas aparecem no site; inativas ficam salvas apenas no painel."
      >
        <PromotionManager promotions={promotions} onUpdate={loadData} />
      </AdminSection>
    </div>
  );
}
