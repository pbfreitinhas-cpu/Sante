"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight 
} from 'lucide-react';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
);

const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    solucoes: [
      { name: 'Seguros para Empresas', href: '/seguros-para-empresas' },
      { name: 'Seguros para Pessoas', href: '/seguros-para-pessoas' },
      { name: 'Planos Internacionais', href: '/#internacional' },
      { name: 'Consultoria de Saúde', href: '#' }
    ],
    institucional: [
      { name: 'Sobre a Sante', href: '/#sobre-nos' },
      { name: 'Depoimentos', href: '/#depoimentos' },
      { name: 'Contato', href: '/#contato' }
    ],
    contato: [
      { icon: Phone, text: '(11) 98765-4321', label: 'WhatsApp' },
      { icon: Mail, text: 'contato@sante.com.br', label: 'E-mail' },
      { icon: MapPin, text: 'Av. Paulista, 1000 - São Paulo', label: 'Endereço' }
    ]
  };

  return (
    <footer className="bg-white border-t border-neutral-100 pt-24 pb-12 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <motion.img 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              src="/logo.png" 
              alt="Sante" 
              className="h-12 w-fit grayscale hover:grayscale-0 transition-all duration-500"
            />
            <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-xs">
              Especialistas em proteção elevada. Oferecemos soluções inteligentes em seguros saúde, vida e planos internacionais com foco em excelência e cuidado.
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: InstagramIcon, label: 'Instagram' },
                { Icon: LinkedinIcon, label: 'Linkedin' }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 hover:bg-brand-blue-500 hover:text-white transition-all duration-300"
                  title={social.label}
                >
                  <social.Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 className="text-[0.7rem] font-black text-neutral-900 uppercase tracking-[0.2em] mb-8">Nossas Soluções</h4>
            <ul className="space-y-4">
              {footerLinks.solucoes.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm font-bold text-neutral-500 hover:text-brand-blue-500 transition-colors flex items-center gap-2 group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional */}
          <div>
            <h4 className="text-[0.7rem] font-black text-neutral-900 uppercase tracking-[0.2em] mb-8">Institucional</h4>
            <ul className="space-y-4">
              {footerLinks.institucional.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-sm font-bold text-neutral-500 hover:text-brand-blue-500 transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-[0.7rem] font-black text-neutral-900 uppercase tracking-[0.2em] mb-8">Fale Conosco</h4>
            <ul className="space-y-6">
              {footerLinks.contato.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-neutral-900">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-neutral-400 text-[0.65rem] font-bold uppercase tracking-widest">
              © {currentYear} Sante Corretora de Seguros
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-neutral-400 text-[0.6rem] font-bold uppercase tracking-widest hover:text-neutral-900 transition-colors">Privacidade</a>
              <a href="#" className="text-neutral-400 text-[0.6rem] font-bold uppercase tracking-widest hover:text-neutral-900 transition-colors">Termos</a>
            </div>
          </div>
          <p className="text-neutral-300 text-[0.6rem] font-bold uppercase tracking-[0.3em]">
            Elevando o cuidado com inovação
          </p>
        </div>
      </div>
    </footer>
  );
};
