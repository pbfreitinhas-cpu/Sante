"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

/* ============================================================
   TalkingMascot — Grouped mascot and cloud for the left corner
   ============================================================ */
export function TalkingMascot({ message }: { message?: string }) {
  return (
    <div className="talking-mascot-wrapper">
      {/* Cloud Speech Bubble */}
      <div className="cloud-container">
        <MascotCloud message={message} />
      </div>

      {/* Mascot Lottie */}
      <div className="mascot-container">
        <MascotFloat />
      </div>

      <style jsx>{`
        .talking-mascot-wrapper {
          position: absolute;
          right: -480px; /* Adjusted further out for larger size */
          top: 450px;   /* Slightly higher */
          width: 450px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 40;
          pointer-events: none;
        }

        .cloud-container {
          width: 100%;
          margin-bottom: -50px; /* Adjusted for larger size */
          margin-right: 0;
        }

        .mascot-container {
          width: 400px;
          height: 400px;
        }

        /* Responsive adjustments */
        @media (max-width: 1400px) {
          .talking-mascot-wrapper {
            right: -420px;
            width: 380px;
          }
          .cloud-container {
            margin-right: 0;
          }
          .mascot-container {
            width: 340px;
            height: 340px;
          }
        }

        @media (max-width: 1200px) {
          .talking-mascot-wrapper {
            right: -350px;
            width: 300px;
          }
          .cloud-container {
            margin-right: 0;
          }
          .mascot-container {
            width: 280px;
            height: 280px;
          }
        }

        @media (max-width: 1024px) {
          .talking-mascot-wrapper {
            position: relative;
            right: auto;
            top: auto;
            width: 100%;
            margin: 0 auto 3rem;
            transform: none;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .cloud-container {
            margin-right: 0;
            margin-bottom: -30px;
            max-width: 450px;
          }
          .mascot-container {
            width: 250px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   MascotFloat — The Lottie Character
   ============================================================ */
export function MascotFloat() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="mascot-float-inner-wrapper"
    >
      <motion.div
        className="mascot-float-inner"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <DotLottieReact
          src="/mascot.lottie"
          autoplay
          loop
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      {/* Glow effect under mascot */}
      <div className="mascot-float-glow" />

      <style jsx>{`
        .mascot-float-inner-wrapper {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .mascot-float-inner {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 2;
          filter: drop-shadow(0 10px 40px rgba(204, 243, 47, 0.15));
          transform: scaleX(-1); /* Mirror mascot to face the form on the right */
        }

        .mascot-float-glow {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 30px;
          background: radial-gradient(ellipse, rgba(204, 243, 47, 0.2) 0%, transparent 75%);
          border-radius: 50%;
          z-index: 1;
        }
      `}</style>
    </motion.div>
  );
}

/* ============================================================
   MascotCloud — Stylish cloud speech bubble
   ============================================================ */
interface MascotCloudProps {
  message?: string;
}

export function MascotCloud({
  message = "Preencha o quanto quiser — quanto mais informações, mais precisa e personalizada será sua cotação"
}: MascotCloudProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "backOut" }}
      className="mascot-cloud-wrapper"
    >
      <div className="mascot-cloud-container">
        {/* Puffy Premium Cloud Shape */}
        <svg
          className="mascot-cloud-svg"
          viewBox="0 0 450 220"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mcFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(204, 243, 47, 0.12)" />
              <stop offset="50%" stopColor="rgba(204, 243, 47, 0.06)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.08)" />
            </linearGradient>
            <linearGradient id="mcStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(204, 243, 47, 0.45)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.25)" />
            </linearGradient>
          </defs>

          {/* New Puffy Organic Shape */}
          <path
            d="
              M 70,140
              C 30,140 15,115 25,90
              C 10,75 15,45 45,35
              C 55,10 95,0 135,15
              C 165,0 215,0 245,15
              C 275,5 325,5 355,20
              C 395,10 435,25 440,65
              C 455,100 435,130 405,140
              C 385,155 345,155 315,145
              C 285,155 245,155 215,145
              C 185,155 135,155 105,145
              Z
            "
            fill="url(#mcFill)"
            stroke="url(#mcStroke)"
            strokeWidth="1.5"
          />

          {/* Thought bubble circles instead of a tail - Adjusted to point to mascot center */}
          <circle cx="180" cy="158" r="10" fill="url(#mcFill)" stroke="url(#mcStroke)" strokeWidth="1.5" />
          <circle cx="200" cy="182" r="7" fill="url(#mcFill)" stroke="url(#mcStroke)" strokeWidth="1.5" />
          <circle cx="215" cy="202" r="4" fill="url(#mcFill)" stroke="url(#mcStroke)" strokeWidth="1.5" />
        </svg>

        {/* Content */}
        <div className="mascot-cloud-content">
          <div className="mascot-cloud-header">
            <div className="mascot-cloud-badge">
              <span className="mascot-cloud-dot" />
              <span className="mascot-cloud-dot dot-delay-1" />
              <span className="mascot-cloud-dot dot-delay-2" />
            </div>
            <span className="mascot-cloud-label">DICA DO SANTÊ</span>
          </div>
          <p className="mascot-cloud-message">{message}</p>
        </div>
      </div>

      <style jsx>{`
        .mascot-cloud-wrapper {
          width: 100%;
          filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.2));
          pointer-events: auto;
        }

        .mascot-cloud-container {
          position: relative;
          padding-bottom: 50px;
        }

        .mascot-cloud-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          /* Removed scaleX(-1) so tail points bottom-left towards mascot again */
        }

        .mascot-cloud-content {
          position: relative;
          z-index: 1;
          padding: 2rem 2.5rem 2.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mascot-cloud-header {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .mascot-cloud-badge {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .mascot-cloud-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgb(204, 243, 47);
          animation: pulse-dot 1.5s ease-in-out infinite;
        }

        .dot-delay-1 { animation-delay: 0.2s; }
        .dot-delay-2 { animation-delay: 0.4s; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .mascot-cloud-label {
          font-size: 0.55rem;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(204, 243, 47, 0.7);
        }

        .mascot-cloud-message {
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        @media (max-width: 640px) {
          .mascot-cloud-content {
            padding: 1.5rem 2rem 2rem 2rem;
          }
          .mascot-cloud-message {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </motion.div>
  );
}

/* ============================================================
   MascotTip — (Legacy) Exported for backward compatibility
   ============================================================ */
export function MascotTip({ message }: { message?: string }) {
  return <MascotCloud message={message} />;
}
