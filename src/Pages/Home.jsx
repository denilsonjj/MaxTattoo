import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // <--- Agora usamos Supabase
import { MessageCircle, Sparkles, Instagram, MapPin, Zap, Info, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Componentes do site
import PortfolioCarousel from '../components/portfolio/PortfolioCarousel';
import PricingSection from '../components/portfolio/PricingSection';
import PromotionsSection from '../components/portfolio/PromotionsSection';
import TattooWizard from '../components/wizard/TattooWizard'; 

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);
  
  // Estados dos dados
  const [siteSettings, setSiteSettings] = useState(null);
  const [images, setImages] = useState([]);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // 1. Carregar Configurações (Perfil)
        const { data: settings } = await supabase.from('site_settings').select('*').maybeSingle();
        if (settings) setSiteSettings(settings);

        // 2. Carregar Portfólio
        const { data: imgs } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false }).limit(10);
        if (imgs) setImages(imgs);

        // 3. Carregar Preços
        const { data: prices } = await supabase.from('pricing_tiers').select('*').order('created_at', { ascending: true });
        if (prices) setPricingTiers(prices);

        // 4. Carregar Promoções Ativas
        const { data: promos } = await supabase.from('promotions').select('*').eq('active', true).order('created_at', { ascending: false });
        if (promos) setPromotions(promos);

      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Valores padrão caso o banco esteja vazio
  const profileImageUrl = siteSettings?.profile_image_url || "https://placehold.co/400x400/101010/E60000?text=Max";
  const instagramHandle = siteSettings?.instagram_handle || "@max_tatt00";
  const location = siteSettings?.location || "Recife, PE";
  const phoneNumber = siteSettings?.phone_number || "5511999999999";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101010] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#E60000] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden text-white font-sans">
      
      {/* Efeitos de Fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E60000]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#E60000]/5 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative pt-12 pb-8 px-4 fade-in">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#E60000] to-[#FF4444] rounded-full blur-xl opacity-75 animate-pulse" />
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#E60000] shadow-2xl shadow-[#E60000]/50 bg-black">
              <img src={profileImageUrl} alt="Max Tattoo" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FAFAFA] to-[#E60000] mb-2 tracking-tight">
              MAX TATTOO
            </h1>
            <div className="flex items-center justify-center gap-2 text-[#E60000]">
              <Instagram className="w-5 h-5" />
              <p className="text-xl font-semibold">{instagramHandle}</p>
            </div>
            <div className="flex items-center justify-center gap-2 text-[#FAFAFA]/60">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{location}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              onClick={() => setShowWizard(true)} 
              className="bg-[#E60000] hover:bg-[#C50000] text-white px-8 py-6 text-lg rounded-full shadow-[0_0_20px_rgba(230,0,0,0.4)] hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-5 h-5 mr-2" /> Fazer Orçamento
            </Button>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto px-4 pb-32 space-y-24 fade-in">
        
        {/* Aviso de Sinal */}
        <section className="relative">
          <div className="bg-gradient-to-br from-[#E60000]/20 to-[#151515] border border-[#E60000]/30 rounded-3xl p-6 md:p-8 overflow-hidden relative shadow-2xl">
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E60000] flex items-center justify-center flex-shrink-0 shadow-lg">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#FAFAFA] mb-3">⚖️ Importante: Sinal Obrigatório</h3>
                <p className="text-[#FAFAFA] mb-3 text-lg">
                  Conforme regras do estúdio, exigimos um sinal de <span className="font-black text-[#E60000]">R$ 50,00</span> para agendar.
                </p>
                <div className="bg-black/40 p-4 rounded-xl border border-[#E60000]/20 inline-block">
                  <p className="text-[#FAFAFA]/90 text-sm font-medium">✓ Esse valor é descontado do preço final da sua tatuagem.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promoções */}
        {promotions.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-8">
              <Zap className="w-8 h-8 text-[#E60000]" />
              <h2 className="text-4xl md:text-5xl font-black text-[#FAFAFA]">Promoções da Semana</h2>
            </div>
            <PromotionsSection promotions={promotions} />
          </section>
        )}

        {/* Portfólio */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-[#E60000]" />
            <h2 className="text-4xl md:text-5xl font-black text-[#FAFAFA]">Trabalhos Recentes</h2>
          </div>
          <PortfolioCarousel images={images} />
          {images.length === 0 && <p className="text-center text-gray-600">Nenhuma foto adicionada ainda.</p>}
        </section>

        {/* Preços */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <Sparkles className="w-8 h-8 text-[#E60000]" />
            <h2 className="text-4xl md:text-5xl font-black text-[#FAFAFA]">Investimento</h2>
          </div>
          <PricingSection pricing={pricingTiers} />
        </section>

        {/* CTA Final */}
        <section className="relative text-center">
          <div className="bg-gradient-to-br from-[#1A1A1A] to-black border border-[#E60000]/20 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-black text-[#FAFAFA] mb-6">Pronto para riscar?</h3>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">Tire suas dúvidas, mande sua ideia e receba um orçamento personalizado agora mesmo.</p>
            <Button 
              onClick={() => setShowWizard(true)} 
              className="bg-[#E60000] hover:bg-[#C50000] px-12 py-8 text-xl rounded-full shadow-[0_0_30px_rgba(230,0,0,0.3)] hover:scale-105 transition-all"
            >
              <MessageCircle className="w-6 h-6 mr-3" /> Iniciar Orçamento
            </Button>
          </div>
        </section>
      </div>

      {/* Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-md">
                <TattooWizard onClose={() => setShowWizard(false)} />
            </div>
        </div>
      )}
    </div>
  );
}