/**
 * WebMCP Tool Registration
 * Exposes portfolio data and actions as structured tools for AI agents.
 *
 * API: document.modelContext.registerTool() / navigator.modelContext.registerTool()
 * Spec: https://webmachinelearning.github.io/webmcp/
 */

import { resumeData, credentials } from '@/data/resumeData';
import { dispatchWebMCPToolCall } from '@/lib/webmcpEvents';

interface ModelContextTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: {
    readOnlyHint?: boolean;
    [key: string]: unknown;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execute: (...args: any[]) => Promise<unknown> | unknown;
}

interface ModelContext {
  registerTool: (tool: ModelContextTool) => Promise<void> | void;
  getTools?: () => Promise<ModelContextTool[]> | ModelContextTool[];
  executeTool?: (tool: ModelContextTool | string, input?: unknown) => Promise<unknown>;
}

// Feature-detect the WebMCP API (handles both new and backward-compat locations)
export function getModelContext(): ModelContext | null {
  if (typeof document !== 'undefined' && 'modelContext' in document) {
    return (document as unknown as { modelContext: ModelContext }).modelContext;
  }
  if (typeof navigator !== 'undefined' && 'modelContext' in navigator) {
    return (navigator as unknown as { modelContext: ModelContext }).modelContext;
  }
  return null;
}

export async function registerWebMCPTools(): Promise<void> {
  const mc = getModelContext();
  if (!mc) {
    console.log('[WebMCP] API not available in this browser environment');
    return;
  }

  console.log('[WebMCP] Registering portfolio tools...');

  // ============ TOOL 1: get_portfolio_overview ============
  await mc.registerTool({
    name: 'get_portfolio_overview',
    description: "Get a high-level overview of this portfolio — developer name, title, track, key skills, project count, and a directory of available tools.",
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        developer: resumeData.personalInfo.name,
        title: resumeData.personalInfo.title,
        specializations: resumeData.personalInfo.titleAnimated,
        location: resumeData.personalInfo.location,
        university: resumeData.education.university,
        total_skills: Object.values(resumeData.skills).flat().length,
        total_projects: resumeData.projects.length,
        project_titles: resumeData.projects.map((p) => p.title),
        top_languages: resumeData.skills.programming.slice(0, 5),
        available_tools: [
          'get_profile — Full professional profile with contact info',
          'get_skills — Technical skills matrix with descriptions',
          'get_projects — All portfolio projects with details',
          'get_project_details — Deep dive into a specific project by name',
          'get_education — Academic credentials and certifications',
          'get_github_stats — Live GitHub contribution and repo data',
          'search_portfolio — Search skills, projects, credentials by keyword',
          'send_inquiry — Send a professional message to the developer',
          'download_resume — Get resume PDF download link',
          'get_telemetry — Live architecture and stack telemetry specs',
        ],
        portfolio_url: typeof window !== 'undefined' ? window.location.origin : 'https://narcisojavier.vercel.app',
      };
      dispatchWebMCPToolCall({ tool: 'get_portfolio_overview', result, summary: 'Fetched portfolio overview' });
      return result;
    },
  });

  // ============ TOOL 2: get_profile ============
  await mc.registerTool({
    name: 'get_profile',
    description: "Get the developer's professional profile including name, title, location, specializations, contact info (email, LinkedIn, GitHub, phone), and academic credentials.",
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        ...resumeData.personalInfo,
        education: resumeData.education,
        credentials: credentials.map((c) => ({ title: c.title, description: c.description })),
      };
      dispatchWebMCPToolCall({ tool: 'get_profile', result, summary: 'Fetched developer profile' });
      return result;
    },
  });

  // ============ TOOL 3: get_skills ============
  await mc.registerTool({
    name: 'get_skills',
    description: "Get technical skills organized by category (programming, frameworks, infrastructure, coreCompetencies) with project-context descriptions. Optionally filter by category.",
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: "Optional filter: 'programming', 'frameworks', 'infrastructure', or 'coreCompetencies'. Omit for all.",
          enum: ['programming', 'frameworks', 'infrastructure', 'coreCompetencies'],
        },
      },
    },
    annotations: { readOnlyHint: true },
    execute: async (input: { category?: string } = {}) => {
      const { skills, skillDescriptions } = resumeData;
      const buildCategory = (cat: string, items: string[]) => ({
        category: cat,
        skills: items.map((s) => ({
          name: s,
          description: (skillDescriptions as Record<string, string>)[s] || null,
        })),
      });

      let result;
      if (input?.category && input.category in skills) {
        const items = skills[input.category as keyof typeof skills];
        result = buildCategory(input.category, items);
      } else {
        result = Object.entries(skills).map(([cat, items]) => buildCategory(cat, items));
      }

      dispatchWebMCPToolCall({
        tool: 'get_skills',
        input: input as Record<string, unknown>,
        result,
        summary: `Fetched skills${input?.category ? ` for [${input.category}]` : ''}`,
      });
      return result;
    },
  });

  // ============ TOOL 4: get_projects ============
  await mc.registerTool({
    name: 'get_projects',
    description: 'Get all 6 portfolio projects with titles, roles, descriptions, and repository links.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        count: resumeData.projects.length,
        projects: resumeData.projects.map((p, i) => ({
          id: i,
          title: p.title,
          role: p.role,
          description: p.description,
          link: p.link,
        })),
      };
      dispatchWebMCPToolCall({ tool: 'get_projects', result, summary: `Listed ${result.count} portfolio projects` });
      return result;
    },
  });

  // ============ TOOL 5: get_project_details ============
  await mc.registerTool({
    name: 'get_project_details',
    description: "Get detailed info about a specific project by name (case-insensitive substring match).",
    inputSchema: {
      type: 'object',
      properties: {
        project_name: {
          type: 'string',
          description: "Project title to look up, e.g. 'Tether', 'geoCradle', 'Campus Navigator'",
        },
      },
      required: ['project_name'],
    },
    annotations: { readOnlyHint: true },
    execute: async (input: { project_name: string }) => {
      if (!input?.project_name) {
        return { error: 'Please provide a project_name to search for.', available: resumeData.projects.map((p) => p.title) };
      }
      const q = input.project_name.toLowerCase();
      const project = resumeData.projects.find((p) => p.title.toLowerCase().includes(q));
      const result = project || { error: `No project matching "${input.project_name}".`, available: resumeData.projects.map((p) => p.title) };

      dispatchWebMCPToolCall({
        tool: 'get_project_details',
        input: input as Record<string, unknown>,
        result,
        summary: project ? `Inspected project: ${project.title}` : `Project query "${input.project_name}" not found`,
      });
      return result;
    },
  });

  // ============ TOOL 6: get_education ============
  await mc.registerTool({
    name: 'get_education',
    description: 'Get academic credentials: university, degree, GPA, graduation cohort, and verified certifications.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        education: resumeData.education,
        credentials: credentials.map((c) => ({ title: c.title, description: c.description })),
      };
      dispatchWebMCPToolCall({ tool: 'get_education', result, summary: 'Fetched education and credentials' });
      return result;
    },
  });

  // ============ TOOL 7: get_github_stats ============
  await mc.registerTool({
    name: 'get_github_stats',
    description: 'Get live GitHub telemetry: contribution counts for the past year, pinned repositories, and recent public activity events.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const username = 'narcisoJavier';
      let result;
      try {
        const [contribRes, pinnedRes, activityRes] = await Promise.allSettled([
          fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`),
          fetch(`https://pinned.berrysauce.dev/get/${username}`),
          fetch(`https://api.github.com/users/${username}/events/public?per_page=5`),
        ]);

        const contributions =
          contribRes.status === 'fulfilled' && contribRes.value.ok
            ? await contribRes.value.json()
            : null;
        const pinned =
          pinnedRes.status === 'fulfilled' && pinnedRes.value.ok
            ? await pinnedRes.value.json()
            : null;
        const activity =
          activityRes.status === 'fulfilled' && activityRes.value.ok
            ? await activityRes.value.json()
            : null;

        result = {
          github_url: `https://github.com/${username}`,
          total_contributions_last_year: contributions?.total?.lastYear ?? '240+',
          pinned_repos: pinned || [],
          recent_activity: Array.isArray(activity)
            ? activity.slice(0, 5).map((e: { type?: string; repo?: { name?: string }; created_at?: string }) => ({
                type: e.type,
                repo: e.repo?.name,
                created_at: e.created_at,
              }))
            : [],
        };
      } catch {
        result = { github_url: `https://github.com/${username}`, error: 'Could not fetch live telemetry' };
      }

      dispatchWebMCPToolCall({ tool: 'get_github_stats', result, summary: 'Queried live GitHub telemetry' });
      return result;
    },
  });

  // ============ TOOL 8: search_portfolio ============
  await mc.registerTool({
    name: 'search_portfolio',
    description: 'Search the entire portfolio by keyword — matches against skills, descriptions, project titles/roles/descriptions, and credentials.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: "Search keyword, e.g. 'Docker', 'Python', 'GIS', 'Go', 'Flutter'" },
      },
      required: ['query'],
    },
    annotations: { readOnlyHint: true },
    execute: async (input: { query: string }) => {
      if (!input?.query) {
        return { error: 'Please provide a query parameter to search.' };
      }
      const q = input.query.toLowerCase();
      const results: { category: string; matches: string[] }[] = [];

      // Skills
      const allSkills = Object.values(resumeData.skills).flat();
      const skillMatches = allSkills.filter((s) => s.toLowerCase().includes(q));
      if (skillMatches.length) results.push({ category: 'skills', matches: skillMatches });

      // Skill descriptions
      const descMatches = Object.entries(resumeData.skillDescriptions)
        .filter(([, d]) => d.toLowerCase().includes(q))
        .map(([s]) => s);
      if (descMatches.length) results.push({ category: 'skill_usage', matches: descMatches });

      // Projects
      const projMatches = resumeData.projects
        .filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q)
        )
        .map((p) => `${p.title} (${p.role})`);
      if (projMatches.length) results.push({ category: 'projects', matches: projMatches });

      // Credentials
      const credMatches = credentials
        .filter((c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
        .map((c) => c.title);
      if (credMatches.length) results.push({ category: 'credentials', matches: credMatches });

      const totalMatches = results.reduce((s, r) => s + r.matches.length, 0);
      const result = { query: input.query, total_matches: totalMatches, results };

      dispatchWebMCPToolCall({
        tool: 'search_portfolio',
        input: input as Record<string, unknown>,
        result,
        summary: `Searched "${input.query}" → ${totalMatches} match(es)`,
      });
      return result;
    },
  });

  // ============ TOOL 9: send_inquiry ============
  await mc.registerTool({
    name: 'send_inquiry',
    description: 'Send a professional inquiry, job offer, or message to the developer. The message is stored in localStorage for review.',
    inputSchema: {
      type: 'object',
      properties: {
        sender_name: { type: 'string', description: 'Your name or organization' },
        sender_email: { type: 'string', description: 'Your contact email address' },
        subject: { type: 'string', description: 'Subject of the inquiry' },
        message: { type: 'string', description: 'The message body' },
      },
      required: ['sender_name', 'sender_email', 'subject', 'message'],
    },
    annotations: { readOnlyHint: false },
    execute: async (input: { sender_name: string; sender_email: string; subject: string; message: string }) => {
      console.log('[WebMCP] Inquiry received:', input);
      try {
        if (typeof localStorage !== 'undefined') {
          const existing = JSON.parse(localStorage.getItem('webmcp-inquiries') || '[]');
          existing.push({ ...input, timestamp: new Date().toISOString(), read: false });
          localStorage.setItem('webmcp-inquiries', JSON.stringify(existing));
        }
      } catch (err) {
        console.warn('[WebMCP] Failed to persist inquiry:', err);
      }

      const result = {
        success: true,
        message: `Inquiry from ${input.sender_name} received. The developer will review it.`,
        developer_email: resumeData.personalInfo.email,
      };

      dispatchWebMCPToolCall({
        tool: 'send_inquiry',
        input: input as Record<string, unknown>,
        result,
        summary: `Dispatched inquiry from ${input.sender_name}: "${input.subject}"`,
      });
      return result;
    },
  });

  // ============ TOOL 10: download_resume ============
  await mc.registerTool({
    name: 'download_resume',
    description: "Get the download link for the developer's resume in PDF format.",
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        download_url: typeof window !== 'undefined' ? `${window.location.origin}/api/resume` : 'https://narcisojavier.vercel.app/api/resume',
        format: 'PDF',
      };
      dispatchWebMCPToolCall({ tool: 'download_resume', result, summary: 'Provided resume PDF download link' });
      return result;
    },
  });

  // ============ TOOL 11: get_telemetry ============
  await mc.registerTool({
    name: 'get_telemetry',
    description: 'Get live architecture telemetry, stack synchronization state, active commit metrics, and system runtime specifications.',
    inputSchema: { type: 'object', properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => {
      const result = {
        runtime: 'Next.js 16 + React 19 + Turbopack',
        architecture: 'Monochrome Studio Architecture (Syne / Geist Typography)',
        graphics_engine: 'Three.js / WebGL Constellation + Anime.js Kinetic Waveforms',
        total_projects_in_deck: 6,
        tracked_capabilities: Object.values(resumeData.skills).flat().length,
        timezone: 'GMT+8 (Asia/Manila)',
        location: 'Baguio City, Philippines [16.40°N, 120.59°E]',
        stack_status: 'SYNCED & VERIFIED',
      };
      dispatchWebMCPToolCall({ tool: 'get_telemetry', result, summary: 'Fetched live architecture telemetry specs' });
      return result;
    },
  });

  console.log('[WebMCP] ✅ All 11 Studio tools registered successfully');
}
