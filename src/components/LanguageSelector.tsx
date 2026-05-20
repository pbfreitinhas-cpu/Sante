"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';

const languages = [
  { code: 'pt', name: 'Português', flag: 'https://flagcdn.com/br.svg', label: 'PT-BR' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/us.svg', label: 'English' },
  { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/fr.svg', label: 'Français' },
] as const;

export const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useTranslation();

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass hover:bg-white/90 transition-all duration-300 border border-white/20 shadow-soft"
        onClick={() => setIsOpen(!isOpen)}
      >
        <img 
          src={currentLang.flag} 
          alt={currentLang.name} 
          className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
        />
        <span className="text-[0.65rem] font-black tracking-widest uppercase text-neutral-600 hidden sm:inline">
          {currentLang.label}
        </span>
        <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 w-40 bg-white rounded-3xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-neutral-100 z-[120] overflow-hidden"
          >
            <div className="flex flex-col gap-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-200 text-left ${
                    language === lang.code 
                      ? 'bg-primary-50 text-brand-blue-600 font-bold' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-brand-blue-500'
                  }`}
                >
                  <img 
                    src={lang.flag} 
                    alt={lang.name} 
                    className="w-5 h-3.5 object-cover rounded-sm shadow-sm"
                  />
                  <span className="text-[0.7rem] font-black tracking-widest uppercase">
                    {lang.label}
                  </span>
                </button>
              ))}
            </div>
            {/* Subtle decor */}
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary-100/50 rounded-full blur-xl -z-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
