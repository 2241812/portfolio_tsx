'use client';

import React, { memo, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Award,
  CheckCircle2,
  Copy,
  Download,
  Send,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';
import type { CandidateDossier } from '@/lib/webmcpWorkflow';
import { fireConfetti } from '@/components/sections/shared';

interface CandidateDossierModalProps {
  dossier: CandidateDossier | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateDossierModal = memo(function CandidateDossierModal({
  dossier,
  isOpen,
  onClose,
}: CandidateDossierModalProps) {
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const copyMarkdownDossier = useCallback(() => {
    if (!dossier) return;

    const md = `# AI Candidate Fit Dossier — ${dossier.candidateName}
**Generated**: ${dossier.generatedAt}
**Role Target**: Software Engineer / Systems & Infrastructure
**Overall Assessment Score**: ${dossier.overallScore}/100

---

## 🎯 Role Compatibility Breakdown
${dossier.roleMatches
  .map(
    (r) =>
      `### ${r.role} (${r.score}% Match — ${r.matchLevel})\n` +
      r.highlights.map((h) => `- ${h}`).join('\n')
  )
  .join('\n\n')}

---

## 🛠️ Verified Core Stack
${dossier.verifiedCapabilities
  .map((c) => `- **${c.category}**: ${c.skills.join(', ')}`)
  .join('\n')}

---

## 🚀 Verified Project Deliverables
${dossier.featuredDeliverables
  .map(
    (p) =>
      `### ${p.title} (${p.role})\n- **Tech**: ${p.tech.join(', ')}\n- **Proof**: ${p.verificationProof}`
  )
  .join('\n\n')}

---

## 📊 Telemetry & Credentials
- **GitHub Contributions**: ${dossier.telemetrySummary.githubCommitsLastYear}
- **Academic Track**: ${dossier.university}
- **Stack Status**: ${dossier.telemetrySummary.stackHealth}

*Report autonomously compiled via W3C WebMCP Standard on ${typeof window !== 'undefined' ? window.location.origin : 'https://narcisojavier.vercel.app'}*
`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(md);
      setCopied(true);
      fireConfetti();
      setTimeout(() => setCopied(false), 2500);
    }
  }, [dossier]);

  const handlePrint = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }, []);

  const handleDispatchInquiry = useCallback(() => {
    onClose();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onClose]);

  if (!isOpen || !dossier) return null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
      >
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-[#09090c] border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white font-mono text-xs"
        >
          {/* Decorative Studio Corners */}
          <div className="studio-corner-tl" />
          <div className="studio-corner-br" />

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0e0e13]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    id="dossier-title"
                    className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-white font-display"
                  >
                    AI Candidate Fit Dossier
                  </h2>
                  <span className="px-2 py-0.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold">
                    VERIFIED // WebMCP
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-sans">
                  Autonomous Human-Agent Evaluation Report • Generated {dossier.generatedAt}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Dossier Modal"
              className="p-1.5 text-zinc-400 hover:text-white border border-transparent hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="relative z-10 p-5 sm:p-6 overflow-y-auto space-y-6 no-scrollbar text-zinc-300 font-sans">
            {/* Candidate Summary Score Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 bg-[#121217] border border-white/10">
              <div className="sm:col-span-8 space-y-1">
                <div className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <span>{dossier.candidateName}</span>
                  <span className="text-zinc-500">{'//'}</span>
                  <span className="text-zinc-400 font-normal">{dossier.location}</span>
                </div>
                <div className="text-sm font-semibold text-zinc-200">
                  {dossier.title}
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  {dossier.university}
                </div>
              </div>

              <div className="sm:col-span-4 flex sm:flex-col items-center justify-between sm:justify-center p-3 bg-black/40 border border-white/10 text-center">
                <div className="text-[10px] font-mono text-zinc-400 uppercase">
                  Candidate Fit Score
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-display">
                  {dossier.overallScore}
                  <span className="text-xs text-zinc-400 font-normal"> / 100</span>
                </div>
                <div className="text-[10px] font-mono text-emerald-300">
                  ★ TOP 5% MATCH
                </div>
              </div>
            </div>

            {/* Role Compatibility Breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/10 pb-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Role Compatibility Breakdown</span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {dossier.roleMatches.map((role) => (
                  <div
                    key={role.role}
                    className="p-4 bg-[#121217] border border-white/10 hover:border-white/20 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-mono">
                        {role.role}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {role.score}%
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 text-zinc-200 text-[10px] font-mono uppercase">
                          {role.matchLevel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-black/60 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-500"
                        style={{ width: `${role.score}%` }}
                      />
                    </div>

                    <ul className="space-y-1 text-xs text-zinc-400 font-sans">
                      {role.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Project Deliverables */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/10 pb-2">
                <Cpu className="w-4 h-4 text-white" />
                <span>Verified Project Deliverables</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dossier.featuredDeliverables.map((proj) => (
                  <div
                    key={proj.title}
                    className="p-3.5 bg-[#121217] border border-white/10 flex flex-col justify-between space-y-2"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white font-mono">
                        {proj.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-sans">
                        {proj.role}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                      <div className="flex flex-wrap gap-1">
                        {proj.tech.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.5 bg-black/60 text-zinc-300 text-[9px] font-mono border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight font-mono">
                        ✓ {proj.verificationProof}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Skills Matrix */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2 border-b border-white/10 pb-2">
                <Layers className="w-4 h-4 text-white" />
                <span>Verified Technical Capabilities</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {dossier.verifiedCapabilities.map((cap) => (
                  <div key={cap.category} className="p-3 bg-[#121217] border border-white/10 space-y-2">
                    <div className="text-[11px] font-bold text-zinc-300 font-mono uppercase">
                      {cap.category}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cap.skills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-black text-white text-[10px] font-mono border border-white/10"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="relative z-10 p-4 sm:p-5 border-t border-white/10 bg-[#0e0e13] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={copyMarkdownDossier}
                className="px-3.5 py-2 bg-[#181820] hover:bg-zinc-800 text-white border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied Dossier!' : 'Copy as Markdown'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-[#181820] hover:bg-zinc-800 text-white border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>

            <button
              onClick={handleDispatchInquiry}
              className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Interview Inquiry</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

export default CandidateDossierModal;
