"use client";
import React, { memo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants } from './shared';

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
      className="flex items-center justify-between px-3 py-2 bg-[#090d16] border border-slate-800/80 rounded hover:border-blue-500/60 hover:bg-slate-900/60 transition-colors group select-none cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
          {label}
        </span>
      </div>
      <span className="text-[11px] text-blue-400 font-mono group-hover:text-blue-300">
        {value} ↗
      </span>
    </a>
  );
});

const AboutSection = memo(function AboutSection() {
  return (
    <section
      id="overview"
      className="scroll-mt-24 w-full py-8 md:py-12 border-b border-slate-800/80"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="w-full space-y-6"
      >
        {/* Section Header */}
        <motion.div variants={headingVariants} className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-sm font-bold">[01]</span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wider font-mono">
              SYSTEM PROFILE & OVERVIEW
            </h2>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            // sysinfo: narcisoiii.dev
          </span>
        </motion.div>

        {/* Main Grid: Neofetch / System Specs Left, Bio & Telemetry Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Avatar & System Specs Box (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4">
            {/* Neofetch Terminal Box */}
            <div className="bg-[#090d16] border border-slate-800 rounded p-4 relative overflow-hidden group shadow-lg">
              {/* Dark Blue Ambient Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded border border-blue-900/60 overflow-hidden bg-slate-900 shrink-0">
                  <Image
                    src="/profile.jpg"
                    alt={resumeData.personalInfo.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-blue-950/20 mix-blend-color" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-100 truncate">
                    {resumeData.personalInfo.name}
                  </h3>
                  <p className="text-xs text-blue-400 font-mono truncate">
                    {resumeData.personalInfo.title}
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {resumeData.education.university}
                  </p>
                </div>
              </div>

              {/* Spec list */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between py-0.5 border-b border-slate-900">
                  <span className="text-slate-500">Degree</span>
                  <span className="text-slate-300 font-semibold">{resumeData.education.degree}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-900">
                  <span className="text-slate-500">GPA</span>
                  <span className="text-emerald-400 font-semibold">{resumeData.education.gpa} / 4.00</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-900">
                  <span className="text-slate-500">Class</span>
                  <span className="text-slate-300">Class of {resumeData.education.classOf}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-900">
                  <span className="text-slate-500">Location</span>
                  <span className="text-slate-300">{resumeData.personalInfo.location}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">Primary Focus</span>
                  <span className="text-blue-400">Systems & AI Automation</span>
                </div>
              </div>
            </div>

            {/* Quick Credentials Badge Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {credentials.map((cred) => (
                <div
                  key={cred.title}
                  className="px-3 py-2 bg-[#090d16] border border-slate-800/80 rounded text-xs flex items-center gap-2.5"
                >
                  <span className="text-base shrink-0">{cred.icon}</span>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-200 truncate">{cred.title}</div>
                    <div className="text-[10px] text-slate-500 truncate">{cred.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Narrative Bio & Quick Channel Links (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 space-y-4">
            {/* Bio Box */}
            <div className="bg-[#090d16] border border-slate-800 rounded p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-800 pb-2">
                <span>README.md</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400">
                  UTF-8 • markdown
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
                <p>
                  Computer Science student at{' '}
                  <strong className="text-slate-100 font-semibold">{resumeData.education.university}</strong>,
                  specializing in <span className="text-blue-400">containerized systems</span>,{' '}
                  <span className="text-blue-400">process automation</span>, and{' '}
                  <span className="text-blue-400">game mechanics</span>.
                </p>
                <p className="text-slate-400">
                  I construct reproducible developer workflows, microservice architectures, and machine
                  learning prototypes that bridge system-level programming with practical desktop and web utilities.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href="/Javier, Narciso III C._Resume_.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-700/60 rounded text-blue-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <span>📄</span> Download Resume (PDF)
                </a>
                <a
                  href="#contact"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>✉️</span> Initiate Protocol
                </a>
              </div>
            </div>

            {/* Direct Social Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SocialButton
                icon="🐙"
                label="GitHub"
                value="@2241812"
                href="https://github.com/2241812"
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
