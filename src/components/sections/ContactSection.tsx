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
import { LinkedinIcon } from '@/components/ui/StudioIcons';

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
              <span>03 // DISPATCH</span>
              <span className="text-zinc-600">/</span>
              <span>GET IN TOUCH</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Contact &amp; Connect
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            [OPEN FOR SOFTWARE &amp; GAME DEV OPPORTUNITIES // 2026]
          </span>
        </motion.div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Direct Channels (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 kokonut-card-glow p-6 sm:p-8 space-y-6">
            <div className="studio-corner-tl" />
            <div className="studio-corner-br" />
            <div className="kokonut-spotlight-layer" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRIES</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-zinc-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <p className="relative z-10 text-sm text-zinc-300 font-sans leading-relaxed">
              Seeking software engineering and game development roles, systems projects, or technical
              collaboration. Feel free to reach out directly via email, phone, or LinkedIn.
            </p>

            {/* Direct Copyable Rows */}
            <div className="relative z-10 space-y-3 pt-2">
              {/* Email */}
              <div className="flex items-center justify-between p-4 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Email
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
                      Phone / Mobile
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
                      LinkedIn
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

          {/* Right Column: Dispatch Specs & Accreditations (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4">
            {/* Dispatch Specs Card */}
            <div className="kokonut-card-glow p-6 space-y-4">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase tracking-wider">
                  DISPATCH METRICS
                </span>
                <span className="text-zinc-500">{resumeData.personalInfo.location}</span>
              </div>

              <div className="relative z-10 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Response Time</span>
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
            <div className="kokonut-card-glow p-6 space-y-3">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-2">
                VERIFIED CREDENTIALS
              </div>

              <div className="relative z-10 space-y-3 pt-1">
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
