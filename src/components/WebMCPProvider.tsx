'use client';

import { useEffect } from 'react';
import { registerWebMCPTools } from '@/lib/webmcp';
import WebMCPAgentHUD from '@/components/WebMCPAgentHUD';

export default function WebMCPProvider() {
  useEffect(() => {
    registerWebMCPTools();
  }, []);

  return <WebMCPAgentHUD />;
}
