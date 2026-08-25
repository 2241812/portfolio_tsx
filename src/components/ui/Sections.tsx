"use client";
import React, { memo } from 'react';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  ContactSection,
  FooterSection,
} from '@/components/sections';

export const Sections = memo(function Sections() {
  return (
    <div className="relative z-10 flex flex-col w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <FooterSection />
    </div>
  );
});

export default Sections;
