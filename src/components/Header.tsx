"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Building2, User, Globe } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

export const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuoteDropdownOpen, setIsQuoteDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solucoes = {
    empresa: {
      title: t('nav.company'),
      icon: Building2,
      items: [
        { label: t('sol.health'), path: '/seguros-para-empresas' },
        { label: t('sol.life'), path: '/#vida' },
        { label: t('sol.dental'), path: '/#odontologico' }
      ]
    },
    pessoa: {
      title: t('sol.person'),
      icon: User,
      items: [
        { label: t('sol.health'), path: '/seguros-para-pessoas' },
        { label: t('sol.life'), path: '/#vida' },
        { label: t('sol.dental'), path: '/#odontologico' }
      ]
    },
    internacional: {
      title: t('sol.international'),
      icon: Globe,
      items: [
        { label: 'VUMI', path: '/#internacional' }
      ]
    }
  };

  return (
    <header className={`fixed left-0 w-full z-[100] transition-all duration-500 pointer-events-none ${scrolled ? 'top-0 py-4' : 'top-8 py-0'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between pointer-events-auto">
        <a href="/" className="animate-float-1">
          <img src="/logo.png" alt="Sante" className={`transition-all duration-500 object-contain filter drop-shadow-xl ${scrolled ? 'h-12 md:h-16' : 'h-16 md:h-24'}`} />
        </a>
        
        <nav className="hidden lg:flex items-center gap-8 glass rounded-full px-10 py-3.5 text-[0.7rem] font-black tracking-widest uppercase text-neutral-500 shadow-soft transition-all hover:bg-white/95 relative">
          <a href="/#sobre-nos" className="hover:text-primary-600 transition-colors">{t('nav.about')}</a>
          
          <div 
            className="relative group py-2"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 hover:text-primary-600 cursor-pointer transition-colors outline-none focus:text-primary-600"
            >
              {t('nav.solutions')} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 overflow-hidden"
                >
                  <div className="grid grid-cols-3 gap-8 relative z-10">
                    {Object.entries(solucoes).map(([key, section]) => (
                      <div key={key} className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-neutral-900 border-b border-neutral-100 pb-3">
                          <section.icon className="w-4 h-4 text-brand-blue-600" />
                          <span className="text-[0.75rem] font-black tracking-widest uppercase">{section.title}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          {section.items.map((item) => (
                            <a 
                              key={item.label} 
                              href={item.path}
                              className="text-[0.8rem] font-bold text-neutral-600 hover:text-brand-blue-600 hover:bg-brand-blue-50 px-3 py-2 rounded-xl transition-all normal-case tracking-normal"
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Decor background in dropdown */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-primary-200/20 rounded-full blur-3xl -z-10" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="/#contato" className="hover:text-primary-600 transition-colors">{t('nav.contact')}</a>
        </nav>

        <div className="flex items-center gap-4 relative">
          <LanguageSelector />
          <div 
            className="relative"
            onMouseEnter={() => setIsQuoteDropdownOpen(true)}
            onMouseLeave={() => setIsQuoteDropdownOpen(false)}
          >
            <motion.button 
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 35px rgba(204, 243, 47, 0.8)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(204, 243, 47, 0.4)", 
                  "0 0 35px rgba(204, 243, 47, 0.7)", 
                  "0 0 20px rgba(204, 243, 47, 0.4)"
                ] 
              }}
              transition={{ 
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="hidden sm:flex relative overflow-hidden bg-primary-500 text-neutral-900 font-bold text-[0.65rem] tracking-widest uppercase px-8 py-4 rounded-full cursor-pointer border-none outline-none z-10"
            >
              <span className="relative z-10">{t('nav.quote')}</span>
              <motion.div 
                className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12 z-0"
                animate={{ left: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
              />
            </motion.button>

            <AnimatePresence>
              {isQuoteDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-48 bg-white rounded-3xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 z-[110]"
                >
                  <div className="flex flex-col gap-2">
                    <a 
                      href="/seguros-para-empresas#cotacao" 
                      className="flex items-center gap-3 text-[0.75rem] font-black text-neutral-800 hover:text-brand-blue-600 hover:bg-brand-blue-50 p-3 rounded-2xl transition-all uppercase tracking-widest"
                    >
                      <Building2 className="w-4 h-4" />
                      {t('nav.company')}
                    </a>
                    <a 
                      href="/seguros-para-pessoas#cotacao" 
                      className="flex items-center gap-3 text-[0.75rem] font-black text-neutral-800 hover:text-brand-blue-600 hover:bg-brand-blue-50 p-3 rounded-2xl transition-all uppercase tracking-widest"
                    >
                      <User className="w-4 h-4" />
                      {t('nav.people')}
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-3 glass rounded-full text-neutral-900 hover:text-primary-600 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-[200]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-[201] shadow-2xl flex flex-col p-8"
            >
              <div className="flex items-center justify-between mb-12">
                <img src="/logo.png" alt="Sante" className="h-10 object-contain" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-neutral-100 rounded-full text-neutral-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-[0.65rem] font-black tracking-widest text-neutral-400 uppercase">Idioma</span>
                  <LanguageSelector />
                </div>
                <a href="/#sobre-nos" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-neutral-950 tracking-tight">{t('nav.about')}</a>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setMobileAccordion(mobileAccordion === 'solucoes' ? null : 'solucoes')}
                    className="text-lg font-black text-neutral-950 tracking-tight flex items-center justify-between w-full"
                  >
                    {t('nav.solutions')} <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordion === 'solucoes' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {mobileAccordion === 'solucoes' && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex flex-col gap-6 pl-4 border-l-2 border-primary-100 py-2 overflow-hidden"
                      >
                        {Object.entries(solucoes).map(([key, section]) => (
                          <div key={key} className="flex flex-col gap-3">
                            <span className="text-[0.65rem] font-black tracking-widest text-neutral-400 uppercase">{section.title}</span>
                            <div className="flex flex-col gap-2">
                              {section.items.map(item => (
                                <a 
                                  key={item.label} 
                                  href={item.path}
                                  onClick={() => setIsMobileMenuOpen(false)} 
                                  className="text-sm font-bold text-neutral-700"
                                >
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a href="/#contato" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-black text-neutral-950 tracking-tight">{t('nav.contact')}</a>
              </nav>

              <div className="mt-auto flex flex-col gap-3">
                <p className="text-[0.65rem] font-black text-neutral-400 uppercase tracking-widest text-center mb-1">{t('nav.quote')}</p>
                <a 
                  href="/seguros-para-empresas#cotacao"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-neutral-900 py-4 rounded-2xl font-black text-primary-500 text-xs tracking-widest uppercase text-center border border-neutral-800"
                >
                  {t('nav.forCompany')}
                </a>
                <a 
                  href="/seguros-para-pessoas#cotacao"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-primary-500 py-4 rounded-2xl font-black text-neutral-900 text-xs tracking-widest uppercase text-center"
                >
                  {t('nav.forYou')}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
