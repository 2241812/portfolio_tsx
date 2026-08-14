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
      className="flex items-center justify-between px-3.5 py-2.5 cyber-glass-card rounded hover:border-zinc-600 transition-all group select-none cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors font-mono">
          {label}
        </span>
      </div>
      <span className="text-[11px] text-zinc-400 font-mono group-hover:text-white flex items-center gap-1 font-bold">
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
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-zinc-800"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div variants={headingVariants} className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-sm font-bold font-mono">[01]</span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-wider font-mono">
              ABOUT &amp; PROFILE
            </h2>
          </div>
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
              <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2 mb-3">
                <span className="text-zinc-200 font-bold font-mono">SPECIFICATIONS // METRICS</span>
                <span className="text-[10px] text-zinc-500 font-mono">NODE_ENV: PRODUCTION</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Institution</span>
                  <span className="text-zinc-200 font-semibold">{resumeData.education.university}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Degree</span>
                  <span className="text-zinc-200 font-semibold">{resumeData.education.degree}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Cumulative GPA</span>
                  <span className="text-white font-bold font-mono">{resumeData.education.gpa} / 4.00</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Cohort</span>
                  <span className="text-zinc-200">Class of {resumeData.education.classOf}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-400">Location Base</span>
                  <span className="text-zinc-200">{resumeData.personalInfo.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Specialization</span>
                  <span className="text-zinc-100 font-bold">Systems, Automation &amp; Game Dev</span>
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
                    <div className="font-bold text-zinc-100 font-mono truncate">{cred.title}</div>
                    <div className="text-[11px] text-zinc-400 font-mono truncate">{cred.description}</div>
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
              <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
                <span className="font-mono text-zinc-200 font-bold">README.md // EXECUTIVE_SUMMARY</span>
                <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
                  UTF-8 • MARKDOWN
                </span>
              </div>

              <div className="space-y-3.5 text-xs sm:text-sm text-zinc-300 leading-relaxed font-mono">
                <p>
                  Computer Science undergraduate at{' '}
                  <strong className="text-white font-bold">{resumeData.education.university}</strong>,
                  engineering <span className="text-zinc-100 font-semibold">containerized cloud architectures</span>,{' '}
                  <span className="text-zinc-100 font-semibold">automated desktop workflows</span>, and{' '}
                  <span className="text-zinc-100 font-semibold">interactive game engines</span>.
                </p>
                <p className="text-zinc-400">
                  I bridge low-level systems programming with high-polish interactive applications — constructing reproducible Docker environments, microservice pipelines, and computer vision models.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap gap-3">
                <a
                  href="/Javier, Narciso III C._Resume_.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white hover:bg-zinc-200 rounded text-black text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>📄</span> Download Resume (PDF)
                </a>
                <a
                  href="#contact"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded text-zinc-200 text-xs font-semibold font-mono transition-all flex items-center gap-2 cursor-pointer"
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
