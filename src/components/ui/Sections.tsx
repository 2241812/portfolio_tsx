"use client";
import React, { memo } from 'react';
import { usePinnedRepos } from '@/hooks/useGitHubData';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  ContactSection,
  FooterSection,
} from '@/components/sections';

export const Sections = memo(function Sections() {
  // GitHub pinned repos with SWR - automatic caching and revalidation
  const { pinnedRepos, isLoading, isError, retry } = usePinnedRepos('narcisoJavier');

  return (
    <div className="relative z-10 flex flex-col w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
      <HeroSection />
      <AboutSection />
      <ProjectsSection
        pinnedRepos={pinnedRepos}
        reposLoading={isLoading}
        reposError={isError}
        onRetry={retry}
      />
      <ContactSection />
      <FooterSection />
    </div>
  );
});

export default Sections;
