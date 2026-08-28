"use client";
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants } from './shared';
import {
  Award,
  Cpu,
  Layers,
  Gamepad2,
} from 'lucide-react';

export const AboutSection = memo(function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 w-full py-12 border-b border-white/10">
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
              <span>01 // PROFILE</span>
              <span className="text-zinc-600">/</span>
              <span>BACKGROUND &amp; FOCUS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              About &amp; Focus
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            [SAINT LOUIS UNIVERSITY // CS &apos;27]
          </span>
        </motion.div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Narrative Bio (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 space-y-5">
            <div className="kokonut-card-glow p-6 sm:p-8 space-y-5">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase tracking-wider">
                  ENGINEERING STATEMENT
                </span>
                <span>SWE &amp; GAME DEV</span>
              </div>

              <div className="relative z-10 space-y-4 text-zinc-300 font-sans text-sm sm:text-base leading-relaxed">
                <p>
                  I am a Computer Science student at{' '}
                  <strong className="text-white font-semibold">
                    {resumeData.education.university}
                  </strong>{' '}
                  in Baguio City, focusing on software engineering, backend systems, and interactive
                  game mechanics.
                </p>
                <p className="text-zinc-400 text-sm">
                  I enjoy building practical tools that solve real problems — whether that means
                  connecting to remote servers on mobile via SSH, designing algorithm-backed
                  microservices in Go and Docker, automating repetitive desktop workflows with Python,
                  or programming responsive character mechanics in Unity 3D.
                </p>
              </div>

              {/* Specialization Pillars */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 bg-[#121217] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Systems</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-normal">
                    Go microservices, Docker Compose, and remote Linux containers.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121217] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
                    <Gamepad2 className="w-3.5 h-3.5" />
                    <span>Game Dev</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-normal">
                    Unity 3D gameplay physics, C#, state logic, and player mechanics.
                  </p>
                </div>

                <div className="p-3.5 bg-[#121217] border border-white/10 space-y-1">
                  <div className="flex items-center gap-2 text-white text-xs font-mono font-bold">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Tooling</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-normal">
                    Python desktop automation, PyQt6, and GIS data visualization.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Academic Specs & Credentials (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4">
            {/* Academic Specification Card */}
            <div className="kokonut-card-glow p-6 space-y-4">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase tracking-wider">
                  ACADEMIC BACKGROUND
                </span>
                <span className="text-zinc-500">DECLARED</span>
              </div>

              <div className="relative z-10 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">University</span>
                  <span className="text-white font-semibold">{resumeData.education.university}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Degree</span>
                  <span className="text-white font-semibold">{resumeData.education.degree}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Track</span>
                  <span className="text-white font-semibold">Systems &amp; Game Development</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Cohort</span>
                  <span className="text-zinc-300">Class of {resumeData.education.classOf}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Location Base</span>
                  <span className="text-zinc-300">{resumeData.personalInfo.location}</span>
                </div>
              </div>
            </div>

            {/* Listed Credentials */}
            <div className="space-y-2.5">
              {credentials.map((cred) => (
                <div
                  key={cred.title}
                  className="kokonut-card-glow p-3.5 flex items-center gap-3.5 group"
                >
                  <div className="studio-corner-tl" />
                  <div className="studio-corner-br" />
                  <div className="kokonut-spotlight-layer" />
                  <div className="relative z-10 p-2 bg-white/5 border border-white/10 text-white">
                    <Award className="w-4 h-4" />
                  </div>
                  <div className="relative z-10 min-w-0">
                    <div className="font-bold text-white text-xs font-mono uppercase tracking-wide">
                      {cred.title}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                      {cred.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default AboutSection;
