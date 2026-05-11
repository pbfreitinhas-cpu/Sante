"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Heart,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  User,
  Phone,
  Mail,
  Activity,
  Plus,
  Syringe,
  Globe2,
  MapPin,
  Star,
  Zap,
  Building2,
  Users,
  Upload,
  FileText,
  MousePointer2,
  Briefcase,
  Target,
  BarChart3
} from 'lucide-react';
import { ProtectionDome } from '@/components/ProtectionDome';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CorporateQuoteForm } from '@/components/CorporateQuoteForm';
import { TalkingMascot } from '@/components/MascotTip';

export default function SegurosParaEmpresas() {
  const formRef = useRef<HTMLDivElement>(null);
  const [selectedInsurances, setSelectedInsurances] = useState<string[]>([]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleInsurance = (id: string) => {
    setSelectedInsurances(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <main className="relative min-h-screen bg-neutral-50 overflow-x-hidden font-body">
      <Header />

      {/* Background Decor */}
      <div className="pointer-events-none absolute top-0 left-0 w-full h-[1000px] overflow-hidden -z-10 bg-gradient-to-b from-primary-50 to-neutral-50">
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-3xl animate-float-orb"></div>
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-brand-blue-200/30 rounded-full blur-3xl animate-float-orb [animation-delay:2s]"></div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary-100 border border-primary-200 px-4 py-2 rounded-full mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              <p className="text-[0.7rem] font-black text-primary-700 tracking-widest uppercase">Seguros para Empresas</p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-display font-black text-neutral-900 leading-[0.95] tracking-tighter mb-8">
              Proteção estratégica para o seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-blue-500">maior patrimônio.</span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 font-medium mb-12 leading-relaxed max-w-xl">
              Consultoria personalizada e soluções robustas de saúde e proteção, desenhadas para empresas que buscam excelência e valorização do capital humano.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-primary-500 text-neutral-900 font-black rounded-full shadow-glow-primary text-xs tracking-widest uppercase flex items-center gap-3"
              >
                SOLICITAR COTAÇÃO
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center gap-4 px-6 py-4 glass rounded-full border-white/50">
                <div className="flex -space-x-2">
                  {[4, 5, 6].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=corp${i}`} alt="Corporate Client" />
                    </div>
                  ))}
                </div>
                <span className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest">+150 Empresas Parceiras</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full aspect-square relative z-10">
              <ProtectionDome src="/empresas.png" alt="Empresas Sante" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-200/50 rounded-full blur-3xl animate-float-orb"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary-200/40 rounded-full blur-3xl animate-float-orb [animation-delay:3s]"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. SEÇÃO: SAÚDE EMPRESARIAL */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full max-w-4xl mx-auto transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/fullanimation.lottie"
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col">
            <div className="w-16 h-16 bg-primary-100 rounded-[2rem] flex items-center justify-center mb-8 text-primary-600">
              <Stethoscope className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">Saúde Empresarial</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              O benefício mais valorizado pelos colaboradores. Oferecemos gestão eficiente, redução de custos e acesso às melhores redes hospitalares para sua equipe.
            </p>

            <ul className="space-y-6 mb-12">
              {[
                'Gestão de sinistralidade e BI para empresas',
                'Rede referenciada premium e atendimento exclusivo',
                'Modelos flexíveis com ou sem coparticipação'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-primary-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-brand-blue-500 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              ANALISAR MEU PLANO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO: SEGURO DE VIDA EM GRUPO */}
      <section className="relative py-32 px-6 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col">
            <div className="w-16 h-16 bg-brand-blue-100 rounded-[2rem] flex items-center justify-center mb-8 text-brand-blue-600">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">Vida em Grupo</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              Segurança para seus colaboradores e conformidade para sua empresa. Planos flexíveis que atendem convenções coletivas e protegem o futuro das famílias.
            </p>

            <ul className="space-y-6 mb-12">
              {[
                'Atendimento a convenções coletivas (CCT)',
                'Proteção financeira para colaboradores e sócios',
                'Assistências exclusivas e contratação simplificada'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-brand-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-primary-600 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              SIMULAR BENEFÍCIO <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="w-full max-w-4xl mx-auto opacity-90 transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/workflow.lottie"
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent z-10" />
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO: ODONTO EMPRESARIAL */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full max-w-3xl lg:max-w-4xl mx-auto transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/Dental clinic color.lottie"
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col">
            <div className="w-16 h-16 bg-secondary-100 rounded-[2rem] flex items-center justify-center mb-8 text-secondary-600">
              <Activity className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">Odonto Empresarial</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              Bem-estar completo para seu time com custo reduzido. Uma rede ampla e atendimento ágil para garantir o melhor sorriso da sua empresa.
            </p>

            <ul className="space-y-6 mb-12">
              {[
                'Baixo impacto no budget e alto valor percebido',
                'Rede nacional com especialistas em todas as áreas',
                'Contratação rápida a partir de 2 vidas (MEI)'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-secondary-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-neutral-900 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              COTAR AGORA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. FORMULÁRIO DE COTAÇÃO */}
      <section id="cotacao" ref={formRef} className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden">
        {/* Background Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px] opacity-30" />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-blue-500/10 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <TalkingMascot />
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
              <p className="text-[0.6rem] font-black text-primary-400 tracking-[0.2em] uppercase">Consultoria Corporativa</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-6">
              Otimize seus benefícios e<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-brand-blue-400">proteja seu negócio.</span>
            </h2>
            <p className="text-neutral-400 font-medium max-w-xl mx-auto">
              Preencha os dados da sua empresa e receba um estudo técnico personalizado dos nossos especialistas.
            </p>
          </div>

          <CorporateQuoteForm />
        </div>
      </section>

      {/* Footer minimal */}
      <Footer />

    </main>
  );
}
