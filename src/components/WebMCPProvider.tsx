'use client';

import { useEffect } from 'react';
import { registerWebMCPTools } from '@/lib/webmcp';
import WebMCPAgentHUD from '@/components/WebMCPAgentHUD';
import CyberSerpentPet from '@/components/ui/CyberSerpentPet';

export default function WebMCPProvider() {
  useEffect(() => {
    registerWebMCPTools();
  }, []);

  return (
    <>
      <WebMCPAgentHUD />
      <CyberSerpentPet />
    </>
  );
}
