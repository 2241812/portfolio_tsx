"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants } from './shared';
import AsciiAvatar from '@/components/ui/AsciiAvatar';

const SocialButton = memo(function SocialButton({
  icon,
  label,
  value,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between px-3.5 py-2.5 cyber-glass-card rounded hover:border-cyan-400/60 transition-all group select-none cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-slate-300 group-hover:text-cyan-200 transition-colors font-mono">
          {label}
        </span>
      </div>
      <span className="text-[11px] text-cyan-400 font-mono group-hover:text-cyan-300 flex items-center gap-1 font-bold">
        <span>{value}</span>
        <span className="text-[10px]">↗</span>
      </span>
    </a>
  );
});

const AboutSection = memo(function AboutSection() {
  return (
    <section
      id="overview"
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-blue-900/30"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div variants={headingVariants} className="flex items-center justify-between border-b border-blue-900/30 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 text-sm font-bold font-orbitron">[01]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-orbitron">
              SYSTEM PROFILE &amp; CORE IDENTITY
            </h2>
          </div>
          <span className="text-[11px] text-cyan-400/80 font-mono hidden sm:inline">
            {"// sysinfo: narcisoiii.dev (v2.0)"}
          </span>
        </motion.div>

        {/* Main Grid: ASCII Avatar & Specs Left, Narrative Bio & Telemetry Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive ASCII Avatar & Specs Box (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-5 flex flex-col items-center sm:items-stretch">
            {/* Interactive Animated ASCII Avatar */}
            <div className="flex justify-center w-full">
              <AsciiAvatar src="/profile.jpg" name={resumeData.personalInfo.name} />
            </div>

            {/* Spec Box */}
            <div className="cyber-glass-card rounded p-4 relative overflow-hidden group shadow-lg w-full">
              <div className="cyber-bracket-tl" />
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2 mb-3">
                <span className="text-cyan-400 font-bold font-mono">SPECIFICATIONS // METRICS</span>
                <span className="text-[10px] text-slate-400 font-mono">NODE_ENV: PRODUCTION</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Institution</span>
                  <span className="text-slate-200 font-semibold">{resumeData.education.university}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Degree</span>
                  <span className="text-slate-200 font-semibold">{resumeData.education.degree}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cumulative GPA</span>
                  <span className="text-emerald-400 font-bold font-mono">{resumeData.education.gpa} / 4.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Cohort</span>
                  <span className="text-slate-200">Class of {resumeData.education.classOf}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Location Base</span>
                  <span className="text-slate-200">{resumeData.personalInfo.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Specialization</span>
                  <span className="text-cyan-400 font-bold">Systems, Automation &amp; Game Dev</span>
                </div>
              </div>
            </div>

            {/* Quick Credentials Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 w-full">
              {credentials.map((cred) => (
                <div
                  key={cred.title}
                  className="px-3.5 py-2.5 cyber-glass-card rounded text-xs flex items-center gap-3 relative"
                >
                  <div className="cyber-bracket-tl" />
                  <span className="text-lg shrink-0">{cred.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 font-mono truncate">{cred.title}</div>
                    <div className="text-[11px] text-cyan-400/80 font-mono truncate">{cred.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Narrative Bio & Channels (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 space-y-4">
            {/* Bio Box */}
            <div className="cyber-glass-card rounded p-5 sm:p-7 space-y-4 relative">
              <div className="cyber-bracket-tl" />
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-mono text-cyan-400 font-bold">README.md // EXECUTIVE_SUMMARY</span>
                <span className="text-[10px] bg-cyan-950/60 border border-cyan-800 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  UTF-8 • MARKDOWN
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                <p>
                  Computer Science undergraduate at{' '}
                  <strong className="text-slate-100 font-bold">{resumeData.education.university}</strong>,
                  engineering <span className="text-cyan-400 font-semibold">containerized cloud architectures</span>,{' '}
                  <span className="text-cyan-400 font-semibold">automated desktop workflows</span>, and{' '}
                  <span className="text-cyan-400 font-semibold">interactive game engines</span>.
                </p>
                <p className="text-slate-400">
                  I bridge low-level systems programming with high-polish interactive applications — constructing reproducible Docker environments, microservice pipelines, and computer vision models.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="/Javier, Narciso III C._Resume_.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
                >
                  <span>📄</span> Download Resume (PDF)
                </a>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-slate-900/80 hover:bg-cyan-950/60 border border-cyan-800/60 hover:border-cyan-400 rounded text-cyan-300 text-xs font-semibold font-mono transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>✉️</span> Initiate Direct Protocol
                </a>
              </div>
            </div>

            {/* Direct Social Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SocialButton
                icon="🐙"
                label="GitHub"
                value="@narcisoJavier"
                href="https://github.com/narcisoJavier"
              />
              <SocialButton
                icon="💼"
                label="LinkedIn"
                value="Narciso III Javier"
                href={resumeData.personalInfo.linkedin}
              />
              <SocialButton
                icon="📧"
                label="Email"
                value={resumeData.personalInfo.email}
                href={`mailto:${resumeData.personalInfo.email}`}
              />
              <SocialButton
                icon="📍"
                label="Location"
                value={resumeData.personalInfo.location}
                href="https://maps.google.com/?q=Baguio+City+Philippines"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default AboutSection;
