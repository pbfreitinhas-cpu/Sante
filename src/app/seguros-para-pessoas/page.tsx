"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
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
  MessageSquare,
  Paperclip,
  X
} from 'lucide-react';
import { ProtectionDome } from '@/components/ProtectionDome';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TalkingMascot } from '@/components/MascotTip';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';

type FormData = {
  nome: string;
  email: string;
  whatsapp: string;
  seguros_selecionados: string[];
  data_nascimento: string;
  sexo: string;
  ocupacao: string;
  renda: string;
  tipo_plano: string;
  localizacao: string;
  vidas: string;
  idades: string;
  coparticipacao: string;
  acomodacao: string;
  abrangencia: string;
  prioridade: string;
  hospitais: string;
  frequencia_uso: string;
  coberturas: string[];
  mensagem: string;
};

const INITIAL_DATA: FormData = {
  nome: '', email: '', whatsapp: '', seguros_selecionados: [],
  data_nascimento: '', sexo: '', ocupacao: '', renda: '',
  tipo_plano: 'Individual', localizacao: '', vidas: '', idades: '',
  coparticipacao: 'Indiferente', acomodacao: 'Indiferente', abrangencia: 'Indiferente',
  prioridade: '', hospitais: '', frequencia_uso: '', coberturas: [], mensagem: ''
};

export default function SegurosParaPessoas() {
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();


  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleInsurance = (id: string) => {
    setFormData(prev => {
      const current = prev.seguros_selecionados;
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      return { ...prev, seguros_selecionados: next };
    });
  };

  const toggleCobertura = (id: string) => {
    setFormData(prev => {
      const current = prev.coberturas;
      const next = current.includes(id) ? current.filter(item => item !== id) : [...current, id];
      return { ...prev, coberturas: next };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 1. Upload files to Supabase Storage in parallel
      const uploadPromises = uploadedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const uniqueId = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
        const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;
        const filePath = `pessoas/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('leads')
          .upload(filePath, file);

        if (uploadError) {
          console.error(`Error uploading ${file.name}:`, uploadError);
          return null;
        }

        const { data: urlData } = supabase.storage
          .from('leads')
          .getPublicUrl(filePath);

        return urlData?.publicUrl || null;
      });

      const results = await Promise.all(uploadPromises);
      const fileUrls = results.filter((url): url is string => url !== null);

      // 2. Clean and Prepare data for DB
      const cleanedData = {
        ...formData,
        data_nascimento: formData.data_nascimento || null,
        vidas: formData.vidas || null,
        arquivos_url: fileUrls, // Save the list of URLs
      };

      // 3. Insert into Database
      const { error } = await supabase.from('leads_pessoas').insert([cleanedData]);
      if (error) {
        console.error('Supabase Error:', error);
        setSubmitStatus('error');
        alert(`Erro Supabase: ${error.message}`);
        return;
      }
      setSubmitStatus('success');
      setUploadedFiles([]); // Clear files on success
    } catch (err) {
      console.error('Unexpected Error:', err);
      setSubmitStatus('error');
      alert(`Erro inesperado: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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
              <p className="text-[0.7rem] font-black text-primary-700 tracking-widest uppercase">{t('ind.badge')}</p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] xl:text-[6rem] font-display font-black text-neutral-900 leading-[0.95] tracking-tighter mb-8">
              {t('ind.title').split(' ').map((word, i) => i > 2 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-brand-blue-500">{word} </span> : <React.Fragment key={i}>{word} </React.Fragment>)}
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 font-medium mb-12 leading-relaxed max-w-xl">
              {t('ind.desc')}
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                onClick={scrollToForm}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-primary-500 text-neutral-900 font-black rounded-full shadow-glow-primary text-xs tracking-widest uppercase flex items-center gap-3"
              >
                {t('ind.cta')}
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <div className="flex items-center gap-4 px-6 py-4 glass rounded-full border-white/50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-neutral-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=user${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <span className="text-[0.65rem] font-bold text-neutral-500 uppercase tracking-widest">{t('ind.lives')}</span>
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
              <ProtectionDome src="/referencia_total.png" alt="Família Sante" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-200/50 rounded-full blur-3xl animate-float-orb"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-primary-200/40 rounded-full blur-3xl animate-float-orb [animation-delay:3s]"></div>
          </motion.div>
        </div>
      </section>

      {/* 2. SEÇÃO: PLANO DE SAÚDE */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full max-w-4xl mx-auto transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/Doctor.lottie"
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
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">{t('ind.health.title')}</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              {t('ind.health.desc')}
            </p>

            <ul className="space-y-6 mb-12">
              {[
                t('ind.health.f1'),
                t('ind.health.f2'),
                t('ind.health.f3')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-accent-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-brand-blue-500 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              {t('ind.health.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO: SEGURO DE VIDA */}
      <section className="relative py-32 px-6 bg-neutral-50 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col">
            <div className="w-16 h-16 bg-brand-blue-100 rounded-[2rem] flex items-center justify-center mb-8 text-brand-blue-600">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">{t('ind.life.title')}</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              {t('ind.life.desc')}
            </p>

            <ul className="space-y-6 mb-12">
              {[
                t('ind.life.f1'),
                t('ind.life.f2'),
                t('ind.life.f3')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-brand-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-primary-600 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              {t('ind.life.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="relative">
            <div className="w-full max-w-4xl mx-auto opacity-90 transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/Vital signs.lottie"
                autoplay
                loop
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-50 via-transparent to-transparent z-10" />
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO: PLANO ODONTOLÓGICO */}
      <section className="relative py-32 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative w-full max-w-4xl mx-auto transform scale-100 transition-transform duration-700">
              <DotLottieReact
                src="/Dental Care.lottie"
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
            <h2 className="text-4xl md:text-5xl font-display font-black text-neutral-900 mb-8 tracking-tight">{t('ind.dental.title')}</h2>
            <p className="text-lg text-neutral-600 font-medium mb-10 leading-relaxed">
              {t('ind.dental.desc')}
            </p>

            <ul className="space-y-6 mb-12">
              {[
                t('ind.dental.f1'),
                t('ind.dental.f2'),
                t('ind.dental.f3')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-neutral-700 font-bold">
                  <CheckCircle className="w-6 h-6 text-secondary-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <button onClick={scrollToForm} className="text-neutral-900 font-black text-[0.7rem] tracking-[0.2em] uppercase flex items-center gap-2 group">
              {t('ind.dental.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
              <p className="text-[0.6rem] font-black text-primary-400 tracking-[0.2em] uppercase">{t('ind.form.badge')}</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-6">
              {t('ind.form.title').split(' ').map((word, i) => i > 3 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-brand-blue-400">{word} </span> : <React.Fragment key={i}>{word} </React.Fragment>)}
            </h2>
            <p className="text-neutral-400 font-medium max-w-xl mx-auto">
              {t('ind.form.desc')}
            </p>
          </div>

          <form className="space-y-8">


            {/* [0] ATALHO RÁPIDO + UPLOAD */}
            <div className="bg-gradient-to-br from-primary-500/10 via-brand-blue-500/5 to-transparent backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-primary-500/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('ind.form.quick')}</h3>
              </div>

              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                {t('ind.form.quick.desc')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Botão contato rápido */}
                <Link
                  href="/?cotacao=true#contato"
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-primary-500/30 bg-primary-500/10 hover:bg-primary-500/20 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center text-neutral-900 shrink-0 group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mb-1">{t('ind.form.talk')}</h4>
                    <p className="text-xs text-neutral-400">{t('ind.form.talk.desc')}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary-500 ml-auto group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Upload de arquivo */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="group flex items-center gap-4 p-6 rounded-2xl border border-dashed border-white/20 bg-white/5 hover:border-primary-500/50 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-neutral-400 shrink-0 group-hover:text-primary-500 group-hover:scale-110 transition-all">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white mb-1">{t('ind.form.upload')}</h4>
                    <p className="text-xs text-neutral-400">{t('ind.form.upload.desc')}</p>
                  </div>
                  <Upload className="w-5 h-5 text-neutral-500 ml-auto group-hover:text-primary-500 transition-colors" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="*/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Lista de arquivos enviados */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6 space-y-2">
                  <p className="text-[0.65rem] font-black text-primary-400 uppercase tracking-widest">{t('pf.files')}</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                      <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                      <span className="text-sm text-white font-medium truncate flex-1">{file.name}</span>
                      <span className="text-xs text-neutral-500">{(file.size / 1024).toFixed(0)} KB</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* [1] DADOS DE CONTATO */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center font-black">1</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step1')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.fullName')}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="nome" value={formData.nome} onChange={handleChange} required type="text" placeholder={t('pf.fullName.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.email')}</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder={t('pf.email.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.whatsapp')}</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="whatsapp" value={formData.whatsapp} onChange={handleChange} required type="tel" placeholder="(11) 99999-9999" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* [2] TIPO DE SEGURO */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-blue-500 text-white rounded-xl flex items-center justify-center font-black">2</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step2')}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'saude', label: t('pf.healthPlan'), icon: Stethoscope },
                  { id: 'vida', label: t('pf.lifeInsurance'), icon: Heart },
                  { id: 'odonto', label: t('pf.dentalPlan'), icon: Activity }
                ].map(opt => (
                  <label key={opt.id} className="relative cursor-pointer group">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.seguros_selecionados.includes(opt.id)}
                      onChange={() => toggleInsurance(opt.id)}
                    />
                    <div className="p-6 rounded-3xl border border-white/10 bg-white/5 flex flex-col items-center gap-4 transition-all peer-checked:border-primary-500 peer-checked:bg-primary-500/10 hover:bg-white/10">
                      <opt.icon className={`w-8 h-8 transition-colors ${formData.seguros_selecionados.includes(opt.id) ? 'text-primary-500' : 'text-neutral-400 group-hover:text-primary-500'}`} />
                      <span className="text-xs font-black uppercase tracking-widest text-center">{opt.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* [2.5] DETALHES SEGURO DE VIDA (CONDICIONAL) */}
            <AnimatePresence>
              {formData.seguros_selecionados.includes('vida') && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center font-black">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.lifeDetails')}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.dob')}</label>
                      <input name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium outline-none focus:border-primary-500/50 transition-all text-sm [color-scheme:dark]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.sex')}</label>
                      <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium outline-none focus:border-primary-500 transition-all appearance-none">
                        <option value="" className="bg-neutral-900">{t('pf.select')}</option>
                        <option value="Masculino" className="bg-neutral-900">{t('pf.male')}</option>
                        <option value="Feminino" className="bg-neutral-900">{t('pf.female')}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.occupation')}</label>
                      <input name="ocupacao" value={formData.ocupacao} onChange={handleChange} type="text" placeholder={t('pf.occupation.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.income')}</label>
                      <select name="renda" value={formData.renda} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm font-medium outline-none focus:border-primary-500 transition-all appearance-none">
                        <option value="" className="bg-neutral-900">{t('pf.select')}</option>
                        <option value="Até R$ 2.500,00" className="bg-neutral-900">Até R$ 2.500,00</option>
                        <option value="De R$ 2.500,01 até R$ 5.000,00" className="bg-neutral-900">De R$ 2.500,01 até R$ 5.000,00</option>
                        <option value="De R$ 5.000,01 até R$ 7.500,00" className="bg-neutral-900">De R$ 5.000,01 até R$ 7.500,00</option>
                        <option value="De R$ 7.500,01 até R$ 10.000,00" className="bg-neutral-900">De R$ 7.500,01 até R$ 10.000,00</option>
                        <option value="Acima de R$ 10.000,00" className="bg-neutral-900">Acima de R$ 10.000,00</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* [3] PERFIL DA CONTRATAÇÃO */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center font-black">3</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step3')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.planType')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{v:'Individual',l:t('pf.individual')}, {v:'Familiar',l:t('pf.family')}, {v:'MEI',l:'MEI'}].map(type => (
                      <label key={type.v} className="cursor-pointer group">
                        <input type="radio" name="tipo_plano" value={type.v} checked={formData.tipo_plano === type.v} onChange={handleChange} className="peer sr-only" />
                        <div className="py-3 px-1 rounded-xl border border-white/10 bg-white/5 text-[0.6rem] font-black uppercase tracking-tighter text-center transition-all peer-checked:bg-white peer-checked:text-neutral-950">
                          {type.l}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.location')}</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="localizacao" value={formData.localizacao} onChange={handleChange} type="text" placeholder={t('pf.location.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.lives')}</label>
                  <div className="relative group">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="vidas" value={formData.vidas} onChange={handleChange} type="number" placeholder="Ex: 5" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.ages')}</label>
                  <div className="relative group">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <input name="idades" value={formData.idades} onChange={handleChange} type="text" placeholder="Ex: 25, 30, 2" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* [4] PREFERÊNCIAS & PRIORIDADES */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-blue-500 text-white rounded-xl flex items-center justify-center font-black">4</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step4')}</h3>
              </div>

              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.copart')}</label>
                    <select name="coparticipacao" value={formData.coparticipacao} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all appearance-none">
                      <option className="bg-neutral-900">{t('pf.indifferent')}</option>
                      <option className="bg-neutral-900">{t('pf.yes')}</option>
                      <option className="bg-neutral-900">{t('pf.no')}</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.accommodation')}</label>
                    <select name="acomodacao" value={formData.acomodacao} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all appearance-none">
                      <option className="bg-neutral-900">{t('pf.indifferent')}</option>
                      <option className="bg-neutral-900">{t('pf.apartment')}</option>
                      <option className="bg-neutral-900">{t('pf.ward')}</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.coverage')}</label>
                    <select name="abrangencia" value={formData.abrangencia} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all appearance-none">
                      <option className="bg-neutral-900">{t('pf.indifferent')}</option>
                      <option className="bg-neutral-900">{t('pf.regional')}</option>
                      <option className="bg-neutral-900">{t('pf.national')}</option>
                      <option className="bg-neutral-900">{t('pf.international')}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[0.75rem] font-black text-primary-400 uppercase tracking-widest text-center block">{t('pf.priority')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      t('pf.lowCost'),
                      t('pf.bestNetwork'),
                      t('pf.costQuality')
                    ].map(prio => (
                      <label key={prio} className="cursor-pointer">
                        <input type="radio" name="prioridade" value={prio} checked={formData.prioridade === prio} onChange={handleChange} className="peer sr-only" />
                        <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-center transition-all peer-checked:bg-primary-500 peer-checked:text-neutral-950">
                          {prio}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.hospitals')}</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-4 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
                    <textarea name="hospitais" value={formData.hospitais} onChange={handleChange} rows={2} placeholder={t('pf.hospitals.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm resize-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* [6] USO & NECESSIDADES */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center font-black">5</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step5')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('pf.frequency')}</label>
                  <div className="flex gap-2">
                    {[{v:'Baixa',l:t('pf.low')},{v:'Média',l:t('pf.medium')},{v:'Alta',l:t('pf.high')}].map(u => (
                      <label key={u.v} className="flex-1 cursor-pointer">
                        <input type="radio" name="frequencia_uso" value={u.v} checked={formData.frequencia_uso === u.v} onChange={handleChange} className="peer sr-only" />
                        <div className="py-3 rounded-xl border border-white/10 bg-white/5 text-[0.6rem] font-black uppercase tracking-widest text-center peer-checked:border-primary-500 peer-checked:text-primary-500">
                          {u.l}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('pf.desiredCoverage')}</label>
                  <div className="flex flex-wrap gap-2">
                    {[{v:'Terapia',l:t('pf.therapy')},{v:'Fisioterapia',l:t('pf.physio')},{v:'Maternidade',l:t('pf.maternity')}].map(c => (
                      <label key={c.v} className="cursor-pointer">
                        <input type="checkbox" checked={formData.coberturas.includes(c.v)} onChange={() => toggleCobertura(c.v)} className="peer sr-only" />
                        <div className="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-[0.6rem] font-black uppercase tracking-widest peer-checked:bg-white/20">
                          {c.l}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* [7] EMPRESAS & FINAL */}
            <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-blue-500 text-white rounded-xl flex items-center justify-center font-black">6</div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{t('pf.step6')}</h3>
              </div>

              <div className="space-y-8">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-primary-500/50 transition-colors cursor-pointer bg-white/5"
                >
                  <Upload className="w-10 h-10 text-neutral-500 group-hover:text-primary-500 transition-colors mb-4" />
                  <h4 className="text-sm font-bold mb-1">{t('pf.upload')}</h4>
                  <p className="text-xs text-neutral-500">{t('pf.upload.desc')}</p>
                </div>

                {/* Lista de arquivos enviados no passo final */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-6 space-y-2 text-left w-full">
                    <p className="text-[0.65rem] font-black text-primary-400 uppercase tracking-widest ml-1">{t('pf.files')}</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/5">
                        <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                        <span className="text-sm text-white font-medium truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          className="w-6 h-6 rounded-full bg-white/20 hover:bg-red-500/20 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('pf.importantNote')}</label>
                  <textarea name="mensagem" value={formData.mensagem} onChange={handleChange} rows={3} placeholder={t('pf.importantNote.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm resize-none" />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="space-y-4">
              <motion.button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 0 40px rgba(204, 243, 47, 0.4)" } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                className={`w-full py-8 bg-primary-500 text-neutral-950 font-black rounded-[2.5rem] shadow-glow-primary text-sm tracking-[0.3em] uppercase flex items-center justify-center gap-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? t('form.submitting') : t('pf.submitAnalysis')}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </motion.button>

              {submitStatus === 'success' && (
                <p className="text-center text-xs font-black text-primary-500 uppercase tracking-[0.2em] animate-pulse">{t('form.successFull')}</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-center text-xs font-black text-red-500 uppercase tracking-[0.2em]">{t('form.error')}</p>
              )}
            </div>

            <p className="text-center text-[0.6rem] font-bold text-neutral-500 uppercase tracking-[0.2em] pt-4">
              {t('form.privacy')}
            </p>

          </form>
        </div>
      </section>

      {/* Footer minimal */}
      <Footer />

    </main>
  );
}
