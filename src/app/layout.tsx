import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sante - Cuidado Especializado",
  description: "Corretora de alta performance entregando as melhores soluções em Seguro Saúde, Vida e Planos Internacionais.",
};

import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <LanguageProvider>
          {children}
          <FloatingWhatsApp />
        </LanguageProvider>
      </body>
    </html>
  );
}
