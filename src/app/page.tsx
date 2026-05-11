"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ProtectionDome } from '@/components/ProtectionDome';
import { Building2, User, Globe, ChevronRight, ChevronDown, ShieldCheck, MapPin, Map, Star, ArrowRight, Phone, CheckCircle, Menu, X, Thermometer, Stethoscope, FlaskConical, Activity, Heart, Plus, Syringe, Globe2, Mail, Quote } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Almeida',
    role: 'CEO, TechLog Brasil',
    text: 'A transição do nosso plano empresarial para a Sante foi incrivelmente suave. O nível de cuidado e a velocidade de resposta da equipe não têm comparação no mercado. Nos sentimos verdadeiramente protegidos em todos os momentos.',
    avatar: 'https://i.pravatar.cc/150?u=carlos',
    featured: false,
    direction: 'left'
  },
  {
    id: 2,
    name: 'Mariana Costa',
    role: 'Diretora de RH, Innova',
    text: 'Encontrar uma corretora que entenda as necessidades complexas de uma equipe global parecia impossível até conhecermos a Sante. O plano VUMI mudou a forma como nossos executivos viajam. O suporte 24h e a livre escolha mundial trouxeram uma paz de espírito inestimável para toda a nossa diretoria. Recomendo de olhos fechados para qualquer empresa que valoriza o bem-estar de seus talentos.',
    avatar: 'https://i.pravatar.cc/150?u=mariana',
    featured: true,
    direction: 'up'
  },
  {
    id: 3,
    name: 'Roberto Viana',
    role: 'Cliente Pessoa Física',
    text: 'Depois de anos tendo dor de cabeça com outras corretoras, finalmente encontrei um atendimento humanizado e ágil. A Sante resolve qualquer burocracia antes mesmo que eu precise pedir.',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    featured: false,
    direction: 'right'
  }
];

const TestimonialCard = ({ data, index }: { data: any, index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = data.text.length > 150;
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1.1", "0.8 1"]
  });

  const xOffset = data.direction === 'left' ? -50 : data.direction === 'right' ? 50 : 0;
  const yOffset = data.direction === 'up' ? 80 : 50;

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [xOffset, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, scale, x, y }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`relative p-8 rounded-[2.5rem] border flex flex-col h-full transition-shadow duration-300 ${
        data.featured 
        ? 'bg-brand-blue-950 border-brand-blue-800 shadow-2xl md:scale-105 z-10' 
        : 'bg-white border-neutral-100 shadow-soft hover:shadow-xl mt-0 md:mt-8'
      }`}
    >
      <Quote className={`absolute top-6 right-6 w-12 h-12 opacity-10 ${data.featured ? 'text-primary-500' : 'text-brand-blue-200'}`} />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <img src={data.avatar} alt={data.name} className="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-sm" />
        <div>
          <h4 className={`text-lg font-black tracking-tight ${data.featured ? 'text-white' : 'text-neutral-900'}`}>{data.name}</h4>
          <p className={`text-[0.65rem] font-bold uppercase tracking-widest ${data.featured ? 'text-brand-blue-300' : 'text-neutral-400'}`}>{data.role}</p>
        </div>
      </div>

      <div className={`relative flex-1 z-10 ${data.featured ? 'text-brand-blue-50' : 'text-neutral-600'}`}>
        <p className={`text-sm leading-relaxed font-medium ${!expanded && isLong ? 'line-clamp-4' : ''}`}>
          "{data.text}"
        </p>
        {isLong && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className={`mt-4 text-[0.65rem] font-black uppercase tracking-widest flex items-center gap-1 transition-colors ${
              data.featured ? 'text-primary-500 hover:text-white' : 'text-brand-blue-500 hover:text-brand-blue-700'
            }`}
          >
            {expanded ? 'Ler menos' : 'Ler relato completo'} <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      
      {/* 5 Stars */}
      <div className="flex items-center gap-1 mt-8 relative z-10">
        {[1,2,3,4,5].map(star => (
          <Star key={star} className={`w-4 h-4 fill-current ${data.featured ? 'text-primary-500' : 'text-secondary-400'}`} />
        ))}
      </div>
    </motion.div>
  );
};

function SearchHandler({ setSolicitacao, contatoRef }: { 
  setSolicitacao: (val: string) => void, 
  contatoRef: React.RefObject<HTMLDivElement | null> 
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('cotacao') === 'true') {
      setSolicitacao('Gostaria de solicitar uma cotação!');
      // Give a small delay for the page to render, then scroll to contact
      setTimeout(() => {
        contatoRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [searchParams, setSolicitacao, contatoRef]);

  return null;
}

export default function Home() {
  const [hoveredSide, setHoveredSide] = useState<'pj' | 'pf' | null>(null);
  const [solicitacao, setSolicitacao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get('nome') as string,
      email: formData.get('email') as string,
      whatsapp: formData.get('whatsapp') as string,
      mensagem: solicitacao,
    };

    try {
      const { error } = await supabase.from('leads_contato').insert([data]);
      if (error) {
        console.error('Supabase Error:', error);
        setSubmitStatus('error');
        alert(`Erro do Supabase: ${error.message}`); // Alerta temporário para debug
        return;
      }
      setSubmitStatus('success');
      setSolicitacao('');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      setSubmitStatus('error');
      alert(`Erro inesperado: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const contatoRef = useRef<HTMLDivElement>(null);

  const partners = [
    { name: 'Amil', src: '/amil.jpg' },
    { name: 'Bradesco', src: '/bradesco.jpg' },
    { name: 'Hapvida', src: '/hapvida.jpg' },
    { name: 'Omint', src: '/omint.jpg' },
    { name: 'Porto Seguro', src: '/Porto_seguro.jpg' },
    { name: 'SulAmerica', src: '/sulamerica.jpg' },
    { name: 'Unimed', src: '/unimed.jpg' },
    { name: 'Vumi', src: '/vumi.jpg' },
  ];

  return (
    <main className="relative min-h-screen bg-neutral-50 overflow-x-hidden">
      <Suspense fallback={null}>
        <SearchHandler setSolicitacao={setSolicitacao} contatoRef={contatoRef} />
      </Suspense>
      
      {/* Background Decor (Radiant Playful Gradients) */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[1000px] overflow-hidden -z-10 bg-gradient-to-b from-primary-50 to-neutral-50">
          <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-3xl animate-float-orb"></div>
          <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-secondary-300/30 rounded-full blur-3xl animate-float-orb [animation-delay:2s]"></div>
      </div>

      {/* Header professional */}
      <Header />

      {/* 1. HERO SPLIT SECTION */}
      <section className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden z-20">
        
        {/* Painel Esquerdo: EMPRESAS */}
        <motion.div 
          onMouseEnter={() => setHoveredSide('pj')}
          onMouseLeave={() => setHoveredSide(null)}
          className={`relative min-h-[50vh] md:h-full bg-primary cursor-pointer flex flex-col items-center justify-center transition-[flex] duration-700 ease-out p-8 md:p-12
            ${hoveredSide === 'pj' ? 'md:flex-[1.4] flex-[1.2]' : hoveredSide === 'pf' ? 'md:flex-[0.6] flex-[0.8]' : 'flex-1'}`}
        >
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center max-w-xl">
            <div className={`relative w-full aspect-[4/3] mb-8 transition-transform duration-700 ease-out 
              ${hoveredSide === 'pj' ? '-translate-y-6 scale-105' : 'translate-y-0 scale-100'}`}>
              <ProtectionDome src="/empresas.png" alt="Empresas" />
            </div>

            <div className="text-center w-full max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-neutral-950 mb-6 leading-[1.1] tracking-tight">
                Seguros para<br/>Empresas
              </h1>
              <div className="min-h-[6rem] flex flex-col items-center justify-start"> {/* Flexible height */}
                <AnimatePresence mode="wait">
                  {hoveredSide === 'pj' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-neutral-900 text-sm md:text-base font-medium mb-8 max-w-xs mx-auto"
                    >
                      Consultoria personalizada para o seu negócio, com inovação e inteligência cibernética.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <a href="/seguros-para-empresas" className="px-10 py-4 bg-brand-blue text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-xs tracking-widest uppercase inline-block">
                SABER MAIS
              </a>
            </div>
          </div>
          <div className={`absolute inset-0 bg-black/40 pointer-events-none transition-opacity duration-700 ${hoveredSide === 'pf' ? 'opacity-100' : 'opacity-0'}`} />
        </motion.div>

        {/* Painel Direito: PESSOAS */}
        <motion.div 
          onMouseEnter={() => setHoveredSide('pf')}
          onMouseLeave={() => setHoveredSide(null)}
          className={`relative min-h-[50vh] md:h-full bg-white cursor-pointer flex flex-col items-center justify-center transition-[flex] duration-700 ease-out p-8 md:p-12
            ${hoveredSide === 'pf' ? 'md:flex-[1.4] flex-[1.2]' : hoveredSide === 'pj' ? 'md:flex-[0.6] flex-[0.8]' : 'flex-1'}`}
        >
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center max-w-xl">
            <div className={`relative w-full aspect-[4/3] mb-8 transition-transform duration-700 ease-out 
              ${hoveredSide === 'pf' ? '-translate-y-6 scale-105' : 'translate-y-0 scale-100'}`}>
              <ProtectionDome src="/referencia_total.png" alt="Pessoas" />
            </div>

            <div className="text-center w-full max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-neutral-950 mb-6 leading-[1.1] tracking-tight">
                Seguros para<br/>Pessoas
              </h1>
              <div className="min-h-[6rem] flex flex-col items-center justify-start"> {/* Flexible height */}
                <AnimatePresence mode="wait">
                  {hoveredSide === 'pf' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-neutral-700 text-sm md:text-base font-medium mb-8 max-w-xs mx-auto"
                    >
                      Proteção completa para você e sua família, com foco em cuidado elevado e tranquilidade.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
                <a href="/seguros-para-pessoas" className="px-10 py-4 bg-brand-blue text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-xs tracking-widest uppercase inline-block">
                SABER MAIS
              </a>
            </div>
          </div>
          <div className={`absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-700 ${hoveredSide === 'pj' ? 'opacity-100' : 'opacity-0'}`} />
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.74V120H0Z"></path>
          </svg>
        </div>
      </section>

      {/* 2. SOBRE NÓS */}
      <section id="sobre-nos" className="relative py-32 md:py-48 px-6 bg-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:40px_40px] opacity-30 -z-10" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative flex items-center justify-center min-h-[450px] lg:min-h-[750px]"
          >
            {/* Lottie Animation Replacement */}
            <div className="w-full max-w-4xl xl:max-w-5xl h-full relative z-10 transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/Yoga Se Hi hoga.lottie"
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Glowing Orbs for extra clinical/tech feel */}
            <div className="absolute -top-10 -left-10 w-60 h-60 md:w-80 md:h-80 bg-primary/30 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute -bottom-20 -right-10 w-72 h-72 md:w-96 md:h-96 bg-brand-blue/20 rounded-full blur-[120px] -z-10" />
          </motion.div>
          <div className="flex flex-col">
            <div className="bg-primary-100/50 border border-primary-200 px-5 py-2 rounded-full w-max mb-8 mx-auto lg:mx-0">
              <p className="text-[0.65rem] font-bold text-primary-700 tracking-[0.2em] uppercase">SOBRE NÓS</p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black text-neutral-900 mb-8 leading-[1.1] tracking-tight text-center lg:text-left">
              Sua saúde merece um<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-brand-blue-400 to-brand-blue-600 animate-pulse-slow">cuidado elevado.</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium mb-12 leading-relaxed max-w-xl text-center lg:text-left mx-auto lg:mx-0">
              A Sante é uma corretora de alta performance, entregando as melhores soluções em Seguro Saúde, Vida e Planos Internacionais com foco total em proteção e inovação há 20 anos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: MapPin, title: 'Regional', text: 'Melhores opções locais.', color: 'bg-primary-500', iconColor: 'text-neutral-950' },
                { icon: Map, title: 'Nacional', text: 'Cobertura em todo o país.', color: 'bg-brand-blue-500', iconColor: 'text-white' },
                { icon: Globe2, title: 'Global', text: 'Atendimento pelo mundo.', color: 'bg-neutral-900', iconColor: 'text-primary-500' },
              ].map((item, i) => (
                <div key={i} className="p-8 bg-white rounded-[2rem] border border-neutral-100/50 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all group">
                  <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 ${item.iconColor} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-500 font-medium leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LOGO CLOUD / PARTNERS */}
      <section className="bg-white py-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="text-primary-600 font-bold tracking-widest text-xs uppercase mb-2">Rede de Excelência</p>
          <h2 className="text-3xl md:text-5xl font-black text-neutral-900 tracking-tight">Seguradoras Parceiras</h2>
        </div>
        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] gap-8 md:gap-12 whitespace-nowrap">
            {[...partners, ...partners].map((partner, i) => (
              <div key={i} className="w-48 h-28 bg-neutral-50 rounded-[2rem] flex items-center justify-center p-8 border border-neutral-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all">
                <img src={partner.src} alt={partner.name} className="max-h-full object-contain grayscale hover:grayscale-0 transition-all opacity-60 hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERNACIONAL (VUMI) - NOVO */}
      <section id="internacional" className="relative min-h-[80vh] bg-brand-blue-950 overflow-hidden flex items-center py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          {/* Subtle Grid / Texture for deep blue */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:40px_40px] opacity-40"></div>
          
          {/* Lime Green Blob Glow */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col"
            >
              <div className="inline-flex items-center gap-3 bg-primary-500/10 border border-primary-500/20 px-5 py-2 rounded-full w-max mb-8">
                <Globe2 className="w-4 h-4 text-primary-500" />
                <p className="text-[0.65rem] font-black text-primary-500 tracking-[0.2em] uppercase">Alcance Global</p>
              </div>

              <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1] tracking-tight">
                Sua proteção não <br/>
                <span className="text-primary-500 italic">conhece fronteiras.</span>
              </h2>

              <p className="text-xl text-brand-blue-100 font-medium mb-12 leading-relaxed max-w-xl">
                O cuidado Sante ultrapassa limites geográficos. Com a nossa solução <span className="text-white font-bold">VUMI Internacional</span>, garantimos acesso aos centros médicos mais prestigiados do mundo.
              </p>

              <div className="flex flex-wrap gap-6 items-center">
                <a 
                  href="/VUMI.pptx" 
                  download 
                  className="px-10 py-5 bg-primary-500 hover:bg-white text-neutral-950 font-black rounded-full transition-all duration-300 shadow-glow-primary hover:scale-[1.03] flex items-center gap-3 text-xs tracking-widest uppercase group"
                >
                  Explorar VUMI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <div className="flex -space-x-3 items-center">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-blue-900 bg-brand-blue-800 flex items-center justify-center overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="pl-6 text-[0.65rem] font-bold text-brand-blue-300 uppercase tracking-widest">+500 Famílias Protegidas</div>
                </div>
              </div>

              {/* Differential Pills */}
              <div className="mt-16 grid grid-cols-2 gap-4">
                 <div className="flex items-center gap-3 text-white border-l-2 border-primary-500 pl-4 py-1">
                    <span className="text-xs font-black tracking-widest uppercase">Segunda Opinião Médica</span>
                 </div>
                 <div className="flex items-center gap-3 text-white border-l-2 border-primary-500 pl-4 py-1">
                    <span className="text-xs font-black tracking-widest uppercase">Livre Escolha Mundial</span>
                 </div>
              </div>
            </motion.div>

            {/* Right Side: The Globe (75% visible) */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] lg:absolute lg:right-[-5%] xl:right-[-10%] lg:top-1/2 lg:-translate-y-1/2 lg:w-[50%] flex items-center justify-center pointer-events-none">
                <div className="w-[110%] sm:w-[120%] lg:w-[140%] xl:w-[150%] aspect-square relative opacity-90 rounded-full">
                    <div className="absolute inset-0 bg-brand-blue-500/20 blur-[100px] rounded-full -z-10" />
                    <DotLottieReact
                      src="/Globe.lottie"
                      autoplay
                      loop
                      className="w-full h-full object-contain mix-blend-screen"
                      style={{ 
                        background: 'transparent',
                        maskImage: 'radial-gradient(circle at center, black 35%, transparent 55%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 35%, transparent 55%)'
                      }}
                    />
                  
                  {/* Subtle Atmos Glow */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-brand-blue-950 to-transparent z-10 pointer-events-none" />
                </div>
            </div>

          </div>
        </div>

        {/* Wave Divider to Contato */}
        <div className="absolute bottom-0 left-0 w-full z-30 pointer-events-none">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-20 fill-white">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,2,1200,34.74V120H0Z"></path>
          </svg>
        </div>
      </section>

      {/* 5. CONTATO / CLINICAL LANDING SECTION */}
      {/* 4.5. DEPOIMENTOS */}
      <section id="depoimentos" className="relative py-24 md:py-32 bg-white overflow-hidden">
        {/* Animated Umbrella Decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 pointer-events-none z-0 translate-x-1/4 -translate-y-1/4">
          <DotLottieReact
            src="/JoyPixels Umbrella with Raindrops Animated Emoji.lottie"
            autoplay
            loop
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 bg-primary-100 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              <p className="text-[0.6rem] font-black text-primary-700 tracking-[0.2em] uppercase">Depoimentos</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-[1.1] mb-6">
              A confiança de quem<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-blue-600">vive a diferença.</span>
            </h2>
            <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto">
              Nossa maior recompensa é a tranquilidade dos nossos clientes. Veja o que dizem sobre o cuidado e a performance da Sante.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 items-stretch">
            {testimonials.map((test, index) => (
              <TestimonialCard key={test.id} data={test} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. CONTATO / CLINICAL LANDING SECTION */}
      <section id="contato" ref={contatoRef} className="relative min-h-[80vh] bg-white overflow-hidden flex items-center justify-center px-6 py-24">
        
        <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center justify-center">
          
          {/* Side-by-side Overlay Composition */}
          <div className="relative w-full flex flex-col lg:flex-row items-center justify-center min-h-[700px] py-12 px-6">
            
            {/* Left: Lottie Background - Taking up more space */}
            <div className="lg:w-[60%] w-full relative z-0 flex justify-center lg:justify-end">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="relative w-full max-w-6xl h-full transform scale-100 transition-transform duration-700"
              >
                <div className="w-full h-full opacity-100">
                  <DotLottieReact
                    src="/Doctor check.lottie"
                    autoplay
                    loop
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: Premium Glassmorphism Form - Positioned to overlap */}
            <div className="lg:w-[40%] w-full relative z-30 lg:-ml-24 mt-12 lg:mt-0 flex justify-center lg:justify-start">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full max-w-lg bg-white/80 backdrop-blur-3xl p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/90 shadow-[0_40px_80px_rgba(0,0,0,0.08)]"
              >
                <div className="text-center lg:text-left mb-8">
                  <div className="inline-flex items-center gap-2 bg-primary-100 px-3 py-1 rounded-full mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                    <p className="text-[0.6rem] font-black text-primary-700 tracking-[0.2em] uppercase">Contato Prioritário</p>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-neutral-900 font-display tracking-tight leading-[1.1] mb-4">
                    Fale com um<br/>especialista <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-blue-600">agora.</span>
                  </h2>
                  <p className="text-xs text-neutral-500 font-medium tracking-tight">Especialistas prontos para te atender.</p>
                </div>
                
                <form className="flex flex-col gap-5" onSubmit={handleContactSubmit}>
                  <div className="space-y-1.5">
                    <label className="text-[0.6rem] font-bold text-neutral-700 uppercase tracking-widest ml-4">Nome completo</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-blue-500 transition-colors" />
                      <input 
                        name="nome"
                        required
                        type="text" 
                        placeholder="Como te chamamos?" 
                        className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-6 text-neutral-900 font-bold placeholder:text-neutral-400 outline-none focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 transition-all text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[0.6rem] font-bold text-neutral-700 uppercase tracking-widest ml-4">e-mail corporativo</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-blue-500 transition-colors" />
                      <input 
                        name="email"
                        required
                        type="email" 
                        placeholder="contato@sante.com.br" 
                        className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-6 text-neutral-900 font-bold placeholder:text-neutral-300 outline-none focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 transition-all text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[0.6rem] font-bold text-neutral-700 uppercase tracking-widest ml-4">WhatsApp / Celular</label>
                    <div className="relative group">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-blue-500 transition-colors" />
                      <input 
                        name="whatsapp"
                        required
                        type="tel" 
                        placeholder="(11) 99999-9999" 
                        className="w-full bg-white border border-neutral-200 rounded-2xl py-4 pl-12 pr-6 text-neutral-900 font-bold placeholder:text-neutral-300 outline-none focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 transition-all text-xs" 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[0.6rem] font-bold text-neutral-700 uppercase tracking-widest ml-4">sua solicitação</label>
                    <textarea 
                      placeholder="Fale um pouco sobre o que você busca..." 
                      rows={2}
                      required
                      value={solicitacao}
                      onChange={(e) => setSolicitacao(e.target.value)}
                      className={`w-full bg-white border rounded-2xl py-4 px-6 text-neutral-900 font-bold placeholder:text-neutral-400 outline-none focus:ring-4 focus:ring-brand-blue-500/10 focus:border-brand-blue-500 transition-all text-xs resize-none ${solicitacao ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-neutral-200'}`}
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className={`w-full py-5 mt-2 bg-gradient-to-r from-brand-blue-600 to-primary-500 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-2 group ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Proposta'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>

                  {submitStatus === 'success' && (
                    <p className="text-center text-xs font-bold text-green-600 uppercase tracking-widest mt-2 animate-bounce">✓ Enviado com sucesso!</p>
                  )}
                  {submitStatus === 'error' && (
                    <p className="text-center text-xs font-bold text-red-600 uppercase tracking-widest mt-2">× Erro ao enviar. Tente novamente.</p>
                  )}
                </form>
                
                <div className="mt-8 pt-6 border-t border-neutral-100/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-primary-500">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[0.5rem] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">WhatsApp</p>
                      <p className="text-[0.65rem] font-black text-neutral-900 leading-none">(11) 98765-4321</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-900 rounded-full flex items-center justify-center text-primary-500">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-[0.5rem] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">E-mail</p>
                      <p className="text-[0.65rem] font-black text-neutral-900 leading-none">contato@sante.com.br</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Footer />



      {/* Marquee styles in global CSS, but here for demo if needed */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </main>
  );
}
