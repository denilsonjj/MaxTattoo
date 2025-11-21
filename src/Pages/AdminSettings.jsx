import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Usando Supabase
import { useNavigate } from 'react-router-dom';
import { DollarSign, Tag, Settings, Loader2 } from 'lucide-react';

// Importando seus componentes (vamos manter eles, depois ajustamos o código deles se precisar)
import PricingManager from '../components/admin/PricingManager';
import PromotionManager from '../components/admin/PromotionManager';
import SiteSettingsManager from '../components/admin/SiteSettingsManager';

export default function AdminSettings() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [siteSettings, setSiteSettings] = useState(null);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  
  const navigate = useNavigate();

  // 1. Verificar Login com Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/login');
    });
  }, [navigate]);

  // 2. Buscar Dados do Supabase
  useEffect(() => {
    if (!session) return;

    async function loadData() {
        // Configurações
        const { data: settings } = await supabase.from('site_settings').select('*').maybeSingle();
        if(settings) setSiteSettings(settings);

        // Preços
        const { data: prices } = await supabase.from('pricing_tiers').select('*').order('created_at', { ascending: true });
        if(prices) setPricingTiers(prices);

        // Promoções
        const { data: promos } = await supabase.from('promotions').select('*').order('created_at', { ascending: false });
        if(promos) setPromotions(promos);
    }
    loadData();
  }, [session]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#E60000] w-8 h-8"/></div>;
  if (!session) return null;

  return (
    <div className="p-8 w-full max-w-5xl mx-auto space-y-10 text-white fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações & Preços</h1>
        <p className="text-gray-400">Gerencie as informações visíveis no site</p>
      </div>

      {/* Bloco 1: Perfil */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#E60000] border-b border-[#E60000]/20 pb-2">
          <Settings /> <h2 className="text-xl font-bold">Perfil e Contato</h2>
        </div>
        {/* Passamos a função de update vazia por enquanto para não quebrar */}
        <SiteSettingsManager settings={siteSettings} onUpdate={() => {}} />
      </div>

      {/* Bloco 2: Preços */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#E60000] border-b border-[#E60000]/20 pb-2">
          <DollarSign /> <h2 className="text-xl font-bold">Tabela de Preços</h2>
        </div>
        <PricingManager pricing={pricingTiers} onUpdate={() => {}} />
      </div>

      {/* Bloco 3: Promoções */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#E60000] border-b border-[#E60000]/20 pb-2">
          <Tag /> <h2 className="text-xl font-bold">Promoções Ativas</h2>
        </div>
        <PromotionManager promotions={promotions} onUpdate={() => {}} />
      </div>
    </div>
  );
}