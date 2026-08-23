"use client";
import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants, fireConfetti } from './shared';
import {
  Mail,
  Phone,
  Check,
  Copy,
  ExternalLink,
  Award,
  Send,
} from 'lucide-react';

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
  </svg>
);

export const ContactSection = memo(function ContactSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    fireConfetti();
    setTimeout(() => setCopiedField(null), 2500);
  }, []);

  return (
    <section id="contact" className="scroll-mt-20 w-full py-12 border-b border-white/10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="w-full space-y-8"
      >
        {/* Studio Section Header */}
        <motion.div
          variants={headingVariants}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-4 gap-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest">
              <span>05 // DISPATCH</span>
              <span className="text-zinc-600">/</span>
              <span>ESTABLISH DIRECT PROTOCOL</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Contact &amp; Engagement
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            [AVAILABLE FOR SWE &amp; GAME DEV OPPORTUNITIES // 2026]
          </span>
        </motion.div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Direct Communication Channels (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 studio-card p-6 sm:p-8 space-y-6">
            <div className="studio-corner-tl" />
            <div className="studio-corner-br" />

            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRY &amp; REACH</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-zinc-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <p className="text-sm text-zinc-300 font-sans leading-relaxed">
              Seeking software engineering and game development roles, systems architecture projects,
              or technical collaboration. Connect directly via email or LinkedIn below.
            </p>

            {/* Direct Copyable Rows */}
            <div className="space-y-3 pt-2">
              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Direct Email
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      {resumeData.personalInfo.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.email, 'email')}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedField === 'email'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-4 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Voice / Phone
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      {resumeData.personalInfo.phone}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.phone, 'phone')}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedField === 'phone'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between p-4 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <LinkedinIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Professional Network
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      linkedin.com/in/narcisoiii-javier
                    </div>
                  </div>
                </div>

                <a
                  href={resumeData.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#181820] hover:bg-zinc-800 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Connect</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Dispatch Specs & Verified Accreditations (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4">
            {/* Dispatch Specifications Card */}
            <div className="studio-card p-6 space-y-4">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />

              <div className="flex items-center justify-between text-xs font-mono border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase tracking-wider">
                  DISPATCH PROTOCOL
                </span>
                <span className="text-zinc-500">{resumeData.personalInfo.location}</span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Response SLA</span>
                  <span className="text-white font-bold">&lt; 24 Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Timezone</span>
                  <span className="text-zinc-200">GMT+8 (PHT)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Work Model</span>
                  <span className="text-zinc-200">Remote / Hybrid / On-Site</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Affiliation</span>
                  <span className="text-white font-bold font-mono">Saint Louis University &apos;27</span>
                </div>
              </div>
            </div>

            {/* Accreditations Badges */}
            <div className="studio-card p-6 space-y-3">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />

              <div className="text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-2">
                VERIFIED ACCREDITATIONS
              </div>

              <div className="space-y-3 pt-1">
                {credentials.map((cred) => (
                  <div key={cred.title} className="flex items-center gap-3 text-xs">
                    <div className="p-1.5 bg-white/5 border border-white/10 text-white">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 font-mono">
                      <div className="font-semibold text-white truncate">{cred.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{cred.description}</div>
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
