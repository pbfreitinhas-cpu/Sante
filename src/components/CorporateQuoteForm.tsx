"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';
import {
  Building2,
  FileText,
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Stethoscope,
  Heart,
  Activity,
  MapPin,
  Briefcase,
  Users,
  Target,
  Plus,
  MessageSquare,
  Paperclip,
  X,
  Zap,
  Upload
} from 'lucide-react';

type FormData = {
  // Step 1
  empresa_nome: string;
  empresa_cnpj: string;
  empresa_responsavel: string;
  empresa_email: string;
  empresa_whatsapp: string;
  
  // Step 2
  produtos_desejados: string[];

  // Step 3
  data_inicio: string;
  possui_beneficio: string;
  qual_beneficio: string;

  // Step 4
  num_colaboradores: string;
  cidade_estado: string;
  segmento: string;

  // Step 5 (Conditionals)
  // Vida
  vida_tipo_cobertura: string;
  vida_colaborador_afastado: string;
  vida_incluir_conjuges: string;
  vida_definicao_valor: string;
  // Saude
  saude_mesmo_plano: string;
  saude_acomodacao: string;
  saude_coparticipacao: string;
  saude_copart_percent: number;
  // Odonto
  odonto_possui_plano: string;
  odonto_qual_plano: string;

  // Step 6
  objetivo_principal: string;
  hospitais_desejados: string;
  nivel_plano: string;
  servicos_adicionais: string[];
};

const INITIAL_DATA: FormData = {
  empresa_nome: '', empresa_cnpj: '', empresa_responsavel: '', empresa_email: '', empresa_whatsapp: '',
  produtos_desejados: [],
  data_inicio: '', possui_beneficio: '', qual_beneficio: '',
  num_colaboradores: '', cidade_estado: '', segmento: '',
  vida_tipo_cobertura: '', vida_colaborador_afastado: '', vida_incluir_conjuges: '', vida_definicao_valor: '',
  saude_mesmo_plano: '', saude_acomodacao: '', saude_coparticipacao: '', saude_copart_percent: 20,
  odonto_possui_plano: '', odonto_qual_plano: '',
  objetivo_principal: '', hospitais_desejados: '', nivel_plano: '', servicos_adicionais: []
};

const TOTAL_STEPS = 6;

export function CorporateQuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_DATA);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { t } = useTranslation();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // 1. Upload files to Supabase Storage in parallel
      const uploadPromises = uploadedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        // More robust unique name: random string + timestamp + index-like randomness
        const uniqueId = Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);
        const fileName = `${uniqueId}-${Date.now()}.${fileExt}`;
        const filePath = `empresas/${fileName}`;

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
        data_inicio: formData.data_inicio || null,
        num_colaboradores: formData.num_colaboradores || null,
        arquivos_url: fileUrls, // Save the list of URLs
      };

      // 3. Insert into Database
      const { error } = await supabase.from('leads_empresas').insert([cleanedData]);
      if (error) {
        console.error('Supabase Error:', error);
        setSubmitStatus('error');
        alert(`Erro Supabase: ${error.message}`);
        return;
      }
      setSubmitStatus('success');
      setUploadedFiles([]); // Clear files on success
    } catch (err: any) {
      console.error('Unexpected Error:', err);
      setSubmitStatus('error');
      alert(`Erro inesperado: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const array = prev[field] as string[];
      if (array.includes(value)) {
        return { ...prev, [field]: array.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...array, value] };
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-between mb-12 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -translate-y-1/2 -z-10 rounded-full"></div>
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 -z-10 rounded-full transition-all duration-500" 
          style={{ width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        ></div>
        
        {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={stepNum} className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-xl ${
                  isActive ? 'bg-primary-500 text-neutral-900 scale-110 shadow-glow-primary' :
                  isCompleted ? 'bg-primary-500 text-neutral-900' : 'bg-neutral-800 text-neutral-500 border border-white/10'
                }`}
              >
                {isCompleted ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ----------------------------------------------------
  // STEPS CONTENT
  // ----------------------------------------------------

  const step1 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step1.title')}</h3>
        <p className="text-neutral-400 text-sm mt-2">{t('corp.form.step1.desc')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.companyName')}</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="empresa_nome" value={formData.empresa_nome} onChange={handleChange} type="text" placeholder={t('cf.companyName.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.cnpj')}</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="empresa_cnpj" value={formData.empresa_cnpj} onChange={handleChange} type="text" placeholder="00.000.000/0001-00" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.responsible')}</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="empresa_responsavel" value={formData.empresa_responsavel} onChange={handleChange} type="text" placeholder={t('cf.responsible.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.email')}</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="empresa_email" value={formData.empresa_email} onChange={handleChange} type="email" placeholder="rh@empresa.com.br" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
          </div>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.whatsapp')}</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="empresa_whatsapp" value={formData.empresa_whatsapp} onChange={handleChange} type="tel" placeholder="(11) 99999-9999" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/5 transition-all text-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const step2 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step2.title')}</h3>
        <p className="text-neutral-400 text-sm mt-2">{t('corp.form.step2.desc')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { id: 'saude', label: t('cf.healthPlan'), icon: Stethoscope },
          { id: 'vida', label: t('cf.lifeInsurance'), icon: Heart },
          { id: 'odonto', label: t('cf.dentalPlan'), icon: Activity }
        ].map(opt => {
          const isSelected = formData.produtos_desejados.includes(opt.id);
          return (
            <div 
              key={opt.id} 
              onClick={() => toggleArrayItem('produtos_desejados', opt.id)}
              className={`cursor-pointer p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all duration-300
                ${isSelected ? 'border-primary-500 bg-primary-500/10 shadow-glow-primary scale-105' : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'}`}
            >
              <opt.icon className={`w-10 h-10 transition-colors duration-300 ${isSelected ? 'text-primary-500' : 'text-neutral-400'}`} />
              <span className={`text-xs font-black uppercase tracking-widest text-center ${isSelected ? 'text-primary-500' : 'text-white'}`}>
                {opt.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );

  const step3 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step3.title')}</h3>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.startDate')}</label>
          <input name="data_inicio" value={formData.data_inicio} onChange={handleChange} type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm [color-scheme:dark]" />
        </div>

        <div className="space-y-4">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.hasBenefit')}</label>
          <div className="grid grid-cols-2 gap-4">
            {['sim', 'nao'].map(opt => (
              <label key={opt} className="cursor-pointer">
                <input type="radio" name="possui_beneficio" value={opt} checked={formData.possui_beneficio === opt} onChange={handleChange} className="peer sr-only" />
                <div className="py-4 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-center peer-checked:border-primary-500 peer-checked:text-primary-500 peer-checked:bg-primary-500/10 transition-all">
                  {opt === 'sim' ? t('cf.yes') : t('cf.no')}
                </div>
              </label>
            ))}
          </div>
        </div>

        {formData.possui_beneficio === 'sim' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
            <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.which')}</label>
            <input name="qual_beneficio" value={formData.qual_beneficio} onChange={handleChange} type="text" placeholder={t('cf.which.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );

  const step4 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step4.title')}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.employees')}</label>
          <div className="relative group">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="num_colaboradores" value={formData.num_colaboradores} onChange={handleChange} type="number" placeholder="Ex: 50" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.cityState')}</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="cidade_estado" value={formData.cidade_estado} onChange={handleChange} type="text" placeholder="Ex: São Paulo / SP" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
          </div>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.segment')}</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-primary-500 transition-colors" />
            <input name="segmento" value={formData.segmento} onChange={handleChange} type="text" placeholder="Ex: Tecnologia, Indústria, Comércio..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const step5 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step5.title')}</h3>
        <p className="text-neutral-400 text-sm mt-2">{t('corp.form.step5.desc')}</p>
      </div>

      {formData.produtos_desejados.length === 0 && (
        <div className="text-center text-neutral-500 py-10 bg-white/5 rounded-3xl border border-white/10">
          {t('cf.noProducts')}
        </div>
      )}

      {/* BLOCO: VIDA */}
      {formData.produtos_desejados.includes('vida') && (
        <div className="p-8 bg-black/20 rounded-[2rem] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Heart className="w-6 h-6 text-brand-blue-500" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">{t('cf.life.title')}</h4>
          </div>

          <div className="space-y-4">
            <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.life.coverageType')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { val: 'por_colaborador', label: t('cf.life.perEmployee'), desc: t('cf.life.perEmployee.desc') },
                { val: 'total_empresa', label: t('cf.life.global'), desc: t('cf.life.global.desc') },
                { val: 'acidentes_pessoais', label: t('cf.life.accidents'), desc: t('cf.life.accidents.desc') }
              ].map(opt => (
                <label key={opt.val} className="cursor-pointer">
                  <input type="radio" name="vida_tipo_cobertura" value={opt.val} checked={formData.vida_tipo_cobertura === opt.val} onChange={handleChange} className="peer sr-only" />
                  <div className="p-4 rounded-2xl border border-white/10 bg-white/5 flex flex-col gap-2 peer-checked:border-brand-blue-500 peer-checked:bg-brand-blue-500/10 transition-all h-full">
                    <span className="text-[0.7rem] font-bold text-white uppercase tracking-wider">{opt.label}</span>
                    <span className="text-[0.6rem] text-neutral-500 leading-relaxed">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.life.spouses')}</label>
              <div className="flex gap-2">
                {['sim', 'nao'].map(opt => (
                  <label key={`conjuge_${opt}`} className="flex-1 cursor-pointer">
                    <input type="radio" name="vida_incluir_conjuges" value={opt} checked={formData.vida_incluir_conjuges === opt} onChange={handleChange} className="peer sr-only" />
                    <div className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-center peer-checked:bg-white peer-checked:text-black transition-all">{opt}</div>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.life.absent')}</label>
              <div className="flex gap-2">
                {['sim', 'nao'].map(opt => (
                  <label key={`afastado_${opt}`} className="flex-1 cursor-pointer">
                    <input type="radio" name="vida_colaborador_afastado" value={opt} checked={formData.vida_colaborador_afastado === opt} onChange={handleChange} className="peer sr-only" />
                    <div className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-center peer-checked:bg-white peer-checked:text-black transition-all">{opt}</div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.life.capitalDef')}</label>
            <select name="vida_definicao_valor" value={formData.vida_definicao_valor} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-brand-blue-500 transition-all appearance-none">
              <option value="" disabled className="bg-neutral-900 text-neutral-500">{t('cf.life.selectOption')}</option>
              <option value="igual_todos" className="bg-neutral-900">{t('cf.life.equalAll')}</option>
              <option value="baseado_salario" className="bg-neutral-900">{t('cf.life.salaryBased')}</option>
              <option value="por_cargo" className="bg-neutral-900">{t('cf.life.byPosition')}</option>
            </select>
          </div>
        </div>
      )}

      {/* BLOCO: SAÚDE */}
      {formData.produtos_desejados.includes('saude') && (
        <div className="p-8 bg-black/20 rounded-[2rem] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Stethoscope className="w-6 h-6 text-primary-500" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">{t('cf.health.title')}</h4>
          </div>

          <div className="space-y-4">
            <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.health.samePlan')}</label>
            <div className="flex gap-4 max-w-xs">
              {['sim', 'nao'].map(opt => (
                <label key={`mesmo_${opt}`} className="flex-1 cursor-pointer">
                  <input type="radio" name="saude_mesmo_plano" value={opt} checked={formData.saude_mesmo_plano === opt} onChange={handleChange} className="peer sr-only" />
                  <div className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-center peer-checked:bg-primary-500 peer-checked:text-black transition-all">{opt}</div>
                </label>
              ))}
            </div>
            <p className="text-[0.6rem] text-neutral-500 font-medium">{t('cf.health.samePlan.note')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.health.accommodation')}</label>
              <select name="saude_acomodacao" value={formData.saude_acomodacao} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all appearance-none">
                <option value="" disabled className="bg-neutral-900 text-neutral-500">{t('cf.health.select')}</option>
                <option value="enfermaria" className="bg-neutral-900">{t('cf.health.ward')}</option>
                <option value="apartamento" className="bg-neutral-900">{t('cf.health.apartment')}</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.health.copart')}</label>
              <select name="saude_coparticipacao" value={formData.saude_coparticipacao} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-white text-xs font-bold outline-none focus:border-primary-500 transition-all appearance-none">
                <option value="" disabled className="bg-neutral-900 text-neutral-500">{t('cf.health.select')}</option>
                <option value="nao" className="bg-neutral-900">{t('cf.health.noCopart')}</option>
                <option value="sim" className="bg-neutral-900">{t('cf.health.withCopart')}</option>
              </select>
            </div>
          </div>

          {formData.saude_coparticipacao === 'sim' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between">
                <label className="text-[0.65rem] font-black text-primary-400 uppercase tracking-widest">{t('cf.health.copartLimit')}</label>
                <span className="text-sm font-black text-white">{formData.saude_copart_percent}%</span>
              </div>
              <input 
                type="range" 
                name="saude_copart_percent" 
                min="0" max="50" step="5" 
                value={formData.saude_copart_percent} 
                onChange={handleChange}
                className="w-full accent-primary-500" 
              />
              <p className="text-[0.6rem] text-neutral-500 font-medium text-right">{t('cf.health.copartRecommend')}</p>
            </motion.div>
          )}
        </div>
      )}

      {/* BLOCO: ODONTO */}
      {formData.produtos_desejados.includes('odonto') && (
        <div className="p-8 bg-black/20 rounded-[2rem] border border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Activity className="w-6 h-6 text-secondary-500" />
            <h4 className="text-lg font-bold text-white uppercase tracking-widest">{t('cf.dental.title')}</h4>
          </div>

          <div className="space-y-4">
            <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest">{t('cf.dental.hasPlan')}</label>
            <div className="flex gap-4 max-w-xs">
              {['sim', 'nao'].map(opt => (
                <label key={`odonto_${opt}`} className="flex-1 cursor-pointer">
                  <input type="radio" name="odonto_possui_plano" value={opt} checked={formData.odonto_possui_plano === opt} onChange={handleChange} className="peer sr-only" />
                  <div className="py-3 rounded-xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest text-center peer-checked:bg-secondary-500 peer-checked:text-black transition-all">{opt}</div>
                </label>
              ))}
            </div>
          </div>

          {formData.odonto_possui_plano === 'sim' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
              <label className="text-[0.65rem] font-black text-secondary-400 uppercase tracking-widest ml-1">{t('cf.dental.currentProvider')}</label>
              <input name="odonto_qual_plano" value={formData.odonto_qual_plano} onChange={handleChange} type="text" placeholder={t('cf.dental.currentProvider.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-secondary-500/50 transition-all text-sm" />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );

  const step6 = (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold uppercase tracking-tight text-white">{t('corp.form.step6.title')}</h3>
      </div>

      <div className="space-y-4">
        <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1 text-center block">{t('cf.objective')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'reduzir_custos', label: t('cf.reduceCosts') },
            { id: 'melhor_cobertura', label: t('cf.betterCoverage') },
            { id: 'reter_talentos', label: t('cf.retainTalent') }
          ].map(opt => (
            <label key={opt.id} className="cursor-pointer">
              <input type="radio" name="objetivo_principal" value={opt.id} checked={formData.objetivo_principal === opt.id} onChange={handleChange} className="peer sr-only" />
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 text-[0.65rem] font-black uppercase tracking-widest text-center transition-all peer-checked:bg-white peer-checked:text-black">
                {opt.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.upgradeLevel')}</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'basico', label: t('cf.basic') },
              { id: 'intermediario', label: t('cf.intermediate') },
              { id: 'premium', label: t('cf.premium') }
            ].map(opt => (
              <label key={opt.id} className="cursor-pointer">
                <input type="radio" name="nivel_plano" value={opt.id} checked={formData.nivel_plano === opt.id} onChange={handleChange} className="peer sr-only" />
                <div className="p-3 rounded-xl border border-white/10 bg-white/5 text-xs font-bold transition-all peer-checked:border-primary-500 peer-checked:text-primary-500">
                  {opt.label}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.additionalServices')}</label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'reembolso', label: t('cf.reimbursement') },
              { id: 'concierge', label: t('cf.concierge') },
              { id: 'resgate_aereo', label: t('cf.airRescue') }
            ].map(opt => {
              const isSelected = formData.servicos_adicionais.includes(opt.id);
              return (
                <div 
                  key={opt.id} 
                  onClick={() => toggleArrayItem('servicos_adicionais', opt.id)}
                  className={`cursor-pointer p-3 rounded-xl border transition-all text-xs font-bold
                    ${isSelected ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'border-white/10 bg-white/5 text-white hover:bg-white/10'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary-500 border-primary-500 text-black' : 'border-white/30'}`}>
                      {isSelected && <CheckCircle className="w-3 h-3" />}
                    </div>
                    {opt.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest ml-1">{t('cf.hospitals')}</label>
        <textarea name="hospitais_desejados" value={formData.hospitais_desejados} onChange={handleChange} rows={2} placeholder={t('cf.hospitals.ph')} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium placeholder:text-neutral-600 outline-none focus:border-primary-500/50 transition-all text-sm resize-none" />
      </div>

      <div className="pt-10 border-t border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="w-5 h-5 text-primary-500" />
          <h4 className="text-sm font-black uppercase tracking-wider text-white">{t('corp.form.upload.optional')}</h4>
        </div>
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:border-primary-500/50 transition-colors cursor-pointer bg-white/5"
        >
          <Upload className="w-10 h-10 text-neutral-500 group-hover:text-primary-500 transition-colors mb-4" />
          <h4 className="text-sm font-bold mb-1">{t('corp.form.upload.title')}</h4>
          <p className="text-xs text-neutral-500">{t('corp.form.upload.desc')}</p>
        </div>

        {/* Lista de arquivos específicos para este passo */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                <FileText className="w-4 h-4 text-primary-500 shrink-0" />
                <span className="text-sm text-white font-medium truncate flex-1">{file.name}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center text-neutral-400 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );

  return (
    <div className="w-full relative">
      {/* ATALHO RÁPIDO + UPLOAD */}
      <div className="bg-gradient-to-br from-primary-500/10 via-brand-blue-500/5 to-transparent backdrop-blur-xl p-8 md:p-10 rounded-[3rem] border border-primary-500/20 shadow-2xl mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-500 text-neutral-900 rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold uppercase tracking-tight text-white">{t('ind.form.quick')}</h3>
        </div>

        <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
          {t('ind.form.quick.desc')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Botão contato rápido */}
          <a
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
          </a>

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
            <p className="text-[0.65rem] font-black text-primary-400 uppercase tracking-widest">{t('ind.form.files')}</p>
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

      {renderStepIndicator()}

      <div className="bg-white/5 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden min-h-[400px]">
        {/* Glow Effects inside card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <motion.div key="1">{step1}</motion.div>}
            {currentStep === 2 && <motion.div key="2">{step2}</motion.div>}
            {currentStep === 3 && <motion.div key="3">{step3}</motion.div>}
            {currentStep === 4 && <motion.div key="4">{step4}</motion.div>}
            {currentStep === 5 && <motion.div key="5">{step5}</motion.div>}
            {currentStep === 6 && <motion.div key="6">{step6}</motion.div>}
          </AnimatePresence>
        </div>
      </div>

      {/* Navegação Inferior */}
      <div className="flex items-center justify-between mt-10">
        {currentStep > 1 ? (
          <button 
            onClick={handlePrev}
            className="px-6 py-4 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> {t('form.back')}
          </button>
        ) : <div></div>}

        {currentStep < TOTAL_STEPS ? (
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(204, 243, 47, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="px-8 py-4 bg-white text-neutral-950 font-black rounded-full text-xs uppercase tracking-widest hover:bg-primary-500 transition-colors flex items-center gap-2"
          >
            {t('form.next')} <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <div className="flex flex-col items-end gap-4">
            <motion.button 
              whileHover={!isSubmitting ? { scale: 1.05, boxShadow: "0 0 40px rgba(204, 243, 47, 0.4)" } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-8 py-4 bg-primary-500 text-neutral-900 font-black rounded-full shadow-glow-primary text-xs uppercase tracking-widest flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? t('form.submitting') : t('form.submitStudy')}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </motion.button>
            
            {submitStatus === 'success' && (
              <p className="text-xs font-black text-primary-500 uppercase tracking-widest animate-pulse">{t('form.successFull')}</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-xs font-black text-red-500 uppercase tracking-widest">{t('form.error')}</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
