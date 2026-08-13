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
          className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm font-bold">[06]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              COMMUNICATION PROTOCOLS & CONTACT
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            // ssh: 2241812@slu.edu.ph
          </span>
        </motion.div>

        {/* 2-Column Split: Interactive Terminal Dispatch Left, Credentials & Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Contact Terminal Box (7 cols) */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 bg-[#090d16] border border-slate-800 rounded p-4 sm:p-6 space-y-5 font-mono relative overflow-hidden"
          >
            {/* Dark blue ambient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-800 pb-2">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <span className="text-blue-500">$</span>
                <span>./initiate_connection.sh</span>
              </span>
              <span className="text-emerald-400 text-[10px]">● READY</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Available for technical inquiries, open source collaborations, and software engineering opportunities.
              Feel free to establish direct contact via any channel below.
            </p>

            {/* Direct Copyable Fields */}
            <div className="space-y-2.5">
              {/* Email */}
              <div className="flex items-center justify-between p-3 rounded bg-[#06090e] border border-slate-800 hover:border-blue-700/60 transition-colors">
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="text-sm">📧</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Direct Email</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                      {resumeData.personalInfo.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.email, 'email')}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer shrink-0 ${
                    copiedField === 'email'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                      : 'bg-blue-950/80 text-blue-300 border-blue-800 hover:bg-blue-900'
                  }`}
                >
                  {copiedField === 'email' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3 rounded bg-[#06090e] border border-slate-800 hover:border-blue-700/60 transition-colors">
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="text-sm">📱</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Mobile Contact</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                      {resumeData.personalInfo.phone}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.phone, 'phone')}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors cursor-pointer shrink-0 ${
                    copiedField === 'phone'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700 font-bold'
                      : 'bg-blue-950/80 text-blue-300 border-blue-800 hover:bg-blue-900'
                  }`}
                >
                  {copiedField === 'phone' ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between p-3 rounded bg-[#06090e] border border-slate-800 hover:border-blue-700/60 transition-colors">
                <div className="min-w-0 flex items-center gap-2.5">
                  <span className="text-sm">💼</span>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Professional Network</div>
                    <div className="text-xs sm:text-sm font-bold text-slate-200 truncate">
                      linkedin.com/in/narcisoiii-javier
                    </div>
                  </div>
                </div>
                <a
                  href={resumeData.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs rounded bg-blue-950/80 text-blue-300 border border-blue-800 hover:bg-blue-900 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>Connect</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Credentials, Location & Fast Links (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4 font-mono">
            {/* Location & Status Box */}
            <div className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 space-y-3">
              <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>SYSTEM STATUS</span>
                <span className="text-blue-400 text-[11px]">{resumeData.personalInfo.location}</span>
              </div>
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span className="text-slate-500">Institution</span>
                  <span className="text-slate-200">{resumeData.education.university}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Program</span>
                  <span className="text-slate-200">B.S. Computer Science</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Academic Standing</span>
                  <span className="text-emerald-400 font-semibold">GPA: {resumeData.education.gpa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Response Window</span>
                  <span className="text-blue-300">&lt; 24 hours</span>
                </div>
              </div>
            </div>

            {/* Verified Specialization Badges */}
            <div className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-5 space-y-2.5">
              <div className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                ACCREDITATIONS & CERTIFICATIONS
              </div>
              <div className="space-y-2">
                {credentials.map((c) => (
                  <div key={c.title} className="flex items-center gap-2.5 text-xs">
                    <span className="text-base shrink-0">{c.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200">{c.title}</div>
                      <div className="text-[10px] text-slate-500">{c.description}</div>
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
