import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

import PortfolioCarousel from '../components/portfolio/PortfolioCarousel';
import PricingSection from '../components/portfolio/PricingSection';
import PromotionsSection from '../components/portfolio/PromotionsSection';
import TattooWizard from '../components/wizard/TattooWizard';

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerGroup = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const navItems = [
  { label: 'Studio', href: '#studio' },
  { label: 'Portfólio', href: '#portfolio' },
  { label: 'Valores', href: '#investimento' },
  { label: 'Contato', href: '#contato' },
];

const MotionDiv = motion.div;

function SectionHeader({ eyebrow, title, children }) {
  return (
    <MotionDiv
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between"
    >
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#b7a27a]">{eyebrow}</p>
        <h2 className="text-3xl font-black tracking-tight text-[#f4efe7] md:text-5xl">{title}</h2>
      </div>
      {children && <div className="max-w-md text-sm leading-6 text-[#d4ccc0]/68">{children}</div>}
    </MotionDiv>
  );
}

export default function Home() {
  const [showWizard, setShowWizard] = useState(false);

  const [siteSettings, setSiteSettings] = useState(null);
  const [images, setImages] = useState([]);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: settings } = await supabase.from('site_settings').select('*').maybeSingle();
        if (settings) setSiteSettings(settings);

        const { data: imgs } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        if (imgs) setImages(imgs);

        const { data: prices } = await supabase
          .from('pricing_tiers')
          .select('*')
          .order('created_at', { ascending: true });
        if (prices) setPricingTiers(prices);

        const { data: promos } = await supabase
          .from('promotions')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        if (promos) setPromotions(promos);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const profileImageUrl = siteSettings?.profile_image_url || 'https://placehold.co/600x600/111111/c8b58a?text=Max';
  const instagramHandle = siteSettings?.instagram_handle || '@max_tatt00';
  const location = siteSettings?.location || 'Igarassu, PE';
  const phoneNumber = siteSettings?.phone_number || '5511999999999';
  const heroImage = images[0]?.image_url || profileImageUrl;
  const secondaryImage = images[1]?.image_url || images[0]?.image_url || profileImageUrl;
  const whatsappHref = `https://wa.me/${phoneNumber}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080807] flex items-center justify-center text-[#f4efe7]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#b72f36]" />
          <span className="text-xs font-bold uppercase tracking-[0.34em] text-[#d4ccc0]/50">Max Tattoo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#080807] font-sans text-[#f4efe7] selection:bg-[#b72f36] selection:text-white">
      <div className="site-texture" />

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.07] bg-[#080807]/76 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          <a href="#topo" className="group flex items-center gap-3">
            <span className="artist-nav-photo">
              <img src={profileImageUrl} alt="Max Tattoo" />
            </span>
            <span className="text-sm font-black uppercase tracking-[0.18em] text-[#f4efe7]">Max Tattoo</span>
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="nav-underline text-xs font-semibold uppercase tracking-[0.18em] text-[#d4ccc0]/58 transition-colors hover:text-[#f4efe7]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <Button
            onClick={() => setShowWizard(true)}
            className="premium-button h-10 rounded-lg px-4 text-xs font-black uppercase tracking-[0.12em] md:h-11 md:px-5"
          >
            Agendar
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </nav>
      </header>

      <main id="topo" className="relative">
        <section className="hero-section relative min-h-[92svh] overflow-hidden border-b border-white/[0.07] pt-16 md:pt-20">
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img src={heroImage} alt="Arte de tatuagem do Max Tattoo" className="h-full w-full object-cover opacity-58" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,7,0.96)_0%,rgba(8,8,7,0.78)_43%,rgba(8,8,7,0.28)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.16)_0%,rgba(8,8,7,0.78)_82%,#080807_100%)]" />
          </motion.div>

          <div className="hero-content relative z-10 mx-auto grid min-h-[calc(92svh-4rem)] max-w-7xl items-center gap-10 px-4 py-16 md:min-h-[calc(92svh-5rem)] md:grid-cols-[1.08fr_0.92fr] md:px-8">
            <motion.div variants={staggerGroup} initial="hidden" animate="visible" className="max-w-3xl">
              <motion.div variants={fadeUp} className="artist-hero-chip">
                <div className="artist-hero-photo">
                  <img src={profileImageUrl} alt="Tatuador Max Tattoo" />
                </div>
                <div>
                  <p>Max Tattoo</p>
                  <span>{instagramHandle} · {location}</span>
                </div>
              </motion.div>

              <motion.h1 variants={fadeUp} className="hero-title text-[clamp(3.65rem,10vw,9.5rem)] font-black uppercase leading-[0.84] tracking-tight text-[#f4efe7]">
                Arte na pele,
                <span className="block text-outline">sem pressa.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-7 max-w-xl text-base leading-7 text-[#d4ccc0]/74 md:text-lg">
                Projetos autorais, atendimento direto e execução com o cuidado que uma tatuagem definitiva merece.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => setShowWizard(true)}
                  className="premium-button h-[3.25rem] rounded-lg px-6 py-6 text-sm font-black uppercase tracking-[0.16em]"
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Fazer orçamento
                </Button>
                <a
                  href="#portfolio"
                  className="inline-flex h-[3.25rem] items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f4efe7] transition-all duration-300 hover:border-[#b7a27a]/60 hover:bg-white/[0.07]"
                >
                  Ver trabalhos
                  <ChevronDown className="ml-3 h-5 w-5" />
                </a>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 36, rotate: 1.4 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.95, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="hidden md:block"
            >
              <div className="hero-frame ml-auto max-w-[430px]">
                <img src={secondaryImage} alt="Detalhe de tatuagem" className="h-[560px] w-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/88 to-transparent p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#b7a27a]">Portfólio recente</p>
                  <p className="mt-2 text-xl font-black">Traço, contraste e intenção.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="studio" className="section-shell">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <motion.div
              variants={staggerGroup}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]"
            >
              <motion.div variants={fadeUp} className="quiet-panel p-7 md:p-9">
                <ShieldCheck className="mb-8 h-9 w-9 text-[#b7a27a]" />
                <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#d4ccc0]/45">Compromisso</p>
                <h2 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">Segurança e agenda organizada</h2>
                <p className="mt-5 max-w-xl leading-7 text-[#d4ccc0]/70">
                  Para reservar uma sessão, o estúdio trabalha com sinal de <strong className="text-[#f4efe7]">R$ 70,00</strong>. O valor é descontado no final da tatuagem e ajuda a manter cada horário preparado com atenção.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: CalendarDays, title: 'Sessão reservada', text: 'Seu horário fica separado para briefing, desenho e execução com calma.' },
                  { icon: ShieldCheck, title: 'Cuidado técnico', text: 'Procedimento limpo, orientação de cuidado e conversa clara antes da agulha.' },
                  { icon: Instagram, title: instagramHandle, text: 'Acompanhe trabalhos novos e ideias disponíveis direto pelo Instagram.' },
                  { icon: MapPin, title: location, text: 'Atendimento com endereço confirmado na etapa de agendamento.' },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="detail-tile">
                      <Icon className="h-5 w-5 text-[#b72f36]" />
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {promotions.length > 0 && (
          <section className="section-shell pt-0">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <SectionHeader eyebrow="Seleção da semana" title="Ofertas com hora marcada">
                Promoções ativas aparecem aqui sem transformar o site em panfleto: preço claro, imagem grande e o necessário para chamar no WhatsApp.
              </SectionHeader>
              <PromotionsSection promotions={promotions} />
            </div>
          </section>
        )}

        <section id="portfolio" className="section-shell">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeader eyebrow="Portfólio" title="Vitrine de pele">
              Uma parede de trabalhos com presença de estúdio: moldura, sombra, contraste e foco total no que o Max entrega.
            </SectionHeader>
            <PortfolioCarousel images={images} />
          </div>
        </section>

        <section id="investimento" className="section-shell pt-0">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <SectionHeader eyebrow="Investimento" title="Valores sem mistério">
              O orçamento final depende de tamanho, área do corpo, estilo e nível de detalhe. Use a tabela como ponto de partida.
            </SectionHeader>
            <PricingSection pricing={pricingTiers} />
          </div>
        </section>

        <section id="contato" className="section-shell pt-0">
          <div className="mx-auto max-w-6xl px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 34, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, margin: '-120px' }}
              className="cta-panel text-center"
            >
              <Zap className="mx-auto mb-6 h-8 w-8 text-[#b7a27a]" />
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#d4ccc0]/48">Próximo passo</p>
              <h2 className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-6xl">
                Manda a ideia. O Max transforma em projeto.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl leading-7 text-[#d4ccc0]/70">
                Conte o local, tamanho aproximado e referências. O orçamento interativo organiza tudo antes da conversa.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  onClick={() => setShowWizard(true)}
                  className="premium-button h-[3.25rem] rounded-lg px-7 py-6 text-sm font-black uppercase tracking-[0.16em]"
                >
                  <MessageCircle className="mr-3 h-5 w-5" />
                  Iniciar orçamento
                </Button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-[3.25rem] items-center justify-center rounded-lg border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f4efe7] transition-all duration-300 hover:border-[#b7a27a]/60 hover:bg-white/[0.07]"
                >
                  Abrir WhatsApp
                  <ArrowUpRight className="ml-3 h-5 w-5" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] px-4 py-10 text-center md:px-8">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-[#f4efe7]">Max Tattoo</p>
        <p className="mt-3 text-xs uppercase tracking-[0.2em] text-[#d4ccc0]/42">{instagramHandle} · {location}</p>
      </footer>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/88 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md"
          >
            <TattooWizard onClose={() => setShowWizard(false)} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
