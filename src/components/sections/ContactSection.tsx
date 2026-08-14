"use client";
import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants, fireConfetti } from './shared';

const ContactSection = memo(function ContactSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    fireConfetti();
    setTimeout(() => setCopiedField(null), 2500);
  }, []);

  return (
    <section
      id="contact"
      className="scroll-mt-24 w-full py-8 md:py-16"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-blue-900/30 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 text-sm font-bold font-orbitron">[06]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-orbitron">
              COMMUNICATION PROTOCOLS &amp; DISPATCH
            </h2>
          </div>
          <span className="text-xs text-cyan-400/80 font-mono">
            {"// ssh: narcisoJavier (direct pipeline)"}
          </span>
        </motion.div>

        {/* 2-Column Split: Interactive Terminal Dispatch Left, Credentials & Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Contact Terminal Box (7 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 cyber-glass-card rounded-xl p-5 sm:p-7 space-y-5 font-mono relative overflow-hidden shadow-xl"
          >
            <div className="cyber-bracket-tl" />
            <div className="cyber-bracket-br" />

            {/* Cyan ambient glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="text-slate-200 font-bold flex items-center gap-2">
                <span className="text-cyan-400 font-bold">$</span>
                <span>./initiate_direct_connection.sh</span>
              </span>
              <span className="text-emerald-400 text-[10px] flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE // READY</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Available for software engineering roles, systems automation projects, and research opportunities.
              Feel free to establish direct contact via any channel below.
            </p>

            {/* Direct Copyable Fields */}
            <div className="space-y-3 pt-1">
              {/* Email */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#02050c] border border-slate-800 hover:border-cyan-500/60 transition-all shadow-inner">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-base">📧</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-bold">Direct Email</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 truncate font-mono">
                      {resumeData.personalInfo.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.email, 'email')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer shrink-0 font-bold ${
                    copiedField === 'email'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {copiedField === 'email' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#02050c] border border-slate-800 hover:border-cyan-500/60 transition-all shadow-inner">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-base">📱</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-bold">Mobile Voice / SMS</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 truncate font-mono">
                      {resumeData.personalInfo.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.phone, 'phone')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer shrink-0 font-bold ${
                    copiedField === 'phone'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white border-transparent hover:from-blue-500 hover:to-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  {copiedField === 'phone' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between p-3.5 rounded-lg bg-[#02050c] border border-slate-800 hover:border-cyan-500/60 transition-all shadow-inner">
                <div className="min-w-0 flex items-center gap-3">
                  <span className="text-base">💼</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-cyan-400/80 uppercase tracking-wider font-bold">Professional Network</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-100 truncate font-mono">
                      linkedin.com/in/narcisoiii-javier
                    </div>
                  </div>
                </div>
                <a
                  href={resumeData.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-900 text-cyan-300 border border-cyan-800/80 hover:bg-cyan-950/80 hover:border-cyan-400 transition-all shrink-0 flex items-center gap-1.5 font-bold"
                >
                  <span>Connect</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Status & Credentials (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4 font-mono">
            {/* Status Box */}
            <div className="cyber-glass-card rounded-xl p-5 space-y-3 relative">
              <div className="cyber-bracket-tl" />
              <div className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span className="text-cyan-400 font-orbitron">SYSTEM DISPATCH STATUS</span>
                <span className="text-slate-300 text-[11px]">{resumeData.personalInfo.location}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">University</span>
                  <span className="text-slate-100 font-semibold">{resumeData.education.university}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Discipline</span>
                  <span className="text-slate-100">B.S. Computer Science</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Academic Standing</span>
                  <span className="text-emerald-400 font-bold font-mono">GPA: {resumeData.education.gpa} / 4.00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Response SLA</span>
                  <span className="text-cyan-400 font-bold">&lt; 24 hours</span>
                </div>
              </div>
            </div>

            {/* Verified Specialization Badges */}
            <div className="cyber-glass-card rounded-xl p-5 space-y-3 relative">
              <div className="cyber-bracket-tl" />
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-2 font-orbitron">
                ACCREDITATIONS &amp; CERTIFICATIONS
              </div>
              <div className="space-y-2.5">
                {credentials.map((c) => (
                  <div key={c.title} className="flex items-center gap-3 text-xs">
                    <span className="text-lg shrink-0">{c.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 font-mono">{c.title}</div>
                      <div className="text-[11px] text-cyan-400/80 font-mono">{c.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default ContactSection;
