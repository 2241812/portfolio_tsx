'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WebMCPToolCallEvent {
  tool: string;
  input?: Record<string, unknown>;
  result?: unknown;
  summary: string;
  timestamp: number;
}

export interface WebMCPState {
  activeToolCall: WebMCPToolCallEvent | null;
  highlightedSkills: string[];
  highlightedProjects: string[];
  telemetryPulse: boolean;
  history: WebMCPToolCallEvent[];
}

const EVENT_TOOL_CALL = 'webmcp:tool-call';
const EVENT_SKILL_HIGHLIGHT = 'webmcp:skill-highlight';
const EVENT_PROJECT_HIGHLIGHT = 'webmcp:project-highlight';
const EVENT_TELEMETRY_PULSE = 'webmcp:telemetry-pulse';

/**
 * Dispatch a tool invocation event across the portfolio UI
 */
export function dispatchWebMCPToolCall(detail: {
  tool: string;
  input?: Record<string, unknown>;
  result?: unknown;
  summary?: string;
}): void {
  if (typeof window === 'undefined') return;

  const eventPayload: WebMCPToolCallEvent = {
    tool: detail.tool,
    input: detail.input,
    result: detail.result,
    summary: detail.summary || `Executed ${detail.tool}`,
    timestamp: Date.now(),
  };

  window.dispatchEvent(new CustomEvent(EVENT_TOOL_CALL, { detail: eventPayload }));

  // Intelligent UI reaction routing based on tool
  switch (detail.tool) {
    case 'get_skills': {
      const category = detail.input?.category as string | undefined;
      window.dispatchEvent(
        new CustomEvent(EVENT_SKILL_HIGHLIGHT, {
          detail: { category, timestamp: Date.now() },
        })
      );
      break;
    }
    case 'search_portfolio': {
      const query = (detail.input?.query as string || '').toLowerCase();
      window.dispatchEvent(
        new CustomEvent(EVENT_SKILL_HIGHLIGHT, {
          detail: { query, timestamp: Date.now() },
        })
      );
      window.dispatchEvent(
        new CustomEvent(EVENT_PROJECT_HIGHLIGHT, {
          detail: { query, timestamp: Date.now() },
        })
      );
      break;
    }
    case 'get_projects':
    case 'get_project_details': {
      const projectName = (detail.input?.project_name as string || '').toLowerCase();
      window.dispatchEvent(
        new CustomEvent(EVENT_PROJECT_HIGHLIGHT, {
          detail: { query: projectName, timestamp: Date.now() },
        })
      );
      break;
    }
    case 'get_github_stats':
    case 'get_telemetry': {
      window.dispatchEvent(new CustomEvent(EVENT_TELEMETRY_PULSE, { detail: { timestamp: Date.now() } }));
      break;
    }
    default:
      break;
  }
}

/**
 * React hook to listen for WebMCP tool activity and visual synchronization
 */
export function useWebMCPListener() {
  const [activeToolCall, setActiveToolCall] = useState<WebMCPToolCallEvent | null>(null);
  const [highlightedSkills, setHighlightedSkills] = useState<string[]>([]);
  const [highlightedProjects, setHighlightedProjects] = useState<string[]>([]);
  const [telemetryPulse, setTelemetryPulse] = useState(false);
  const [history, setHistory] = useState<WebMCPToolCallEvent[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleToolCall = (e: Event) => {
      const customEvent = e as CustomEvent<WebMCPToolCallEvent>;
      const call = customEvent.detail;
      setActiveToolCall(call);
      setHistory((prev) => [call, ...prev.slice(0, 19)]);
    };

    const handleSkillHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ category?: string; query?: string }>;
      const { query } = customEvent.detail;
      if (query) {
        setHighlightedSkills([query]);
      }
    };

    const handleProjectHighlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string }>;
      const { query } = customEvent.detail;
      if (query) {
        setHighlightedProjects([query]);
      }
    };

    const handleTelemetryPulse = () => {
      setTelemetryPulse(true);
      setTimeout(() => setTelemetryPulse(false), 2000);
    };

    window.addEventListener(EVENT_TOOL_CALL, handleToolCall);
    window.addEventListener(EVENT_SKILL_HIGHLIGHT, handleSkillHighlight);
    window.addEventListener(EVENT_PROJECT_HIGHLIGHT, handleProjectHighlight);
    window.addEventListener(EVENT_TELEMETRY_PULSE, handleTelemetryPulse);

    return () => {
      window.removeEventListener(EVENT_TOOL_CALL, handleToolCall);
      window.removeEventListener(EVENT_SKILL_HIGHLIGHT, handleSkillHighlight);
      window.removeEventListener(EVENT_PROJECT_HIGHLIGHT, handleProjectHighlight);
      window.removeEventListener(EVENT_TELEMETRY_PULSE, handleTelemetryPulse);
    };
  }, []);

  const clearHighlights = useCallback(() => {
    setActiveToolCall(null);
    setHighlightedSkills([]);
    setHighlightedProjects([]);
  }, []);

  return {
    activeToolCall,
    highlightedSkills,
    highlightedProjects,
    telemetryPulse,
    history,
    clearHighlights,
  };
}
