'use client';

import { resumeData, credentials } from '@/data/resumeData';
import { getProjectEvidence, projectEvidence } from '@/data/projectEvidence';
import { dispatchWebMCPToolCall } from '@/lib/webmcpEvents';

export interface AuditStep {
  id: number;
  title: string;
  tool: string;
  description: string;
  status: 'pending' | 'running' | 'completed';
}

export interface CandidateDossier {
  generatedAt: string;
  candidateName: string;
  title: string;
  location: string;
  university: string;
  evidenceSummary: {
    sourceCount: number;
    verifiedClaimCount: number;
    limitationCount: number;
  };
  roleMatches: {
    role: string;
    evidenceLevel: 'Repository evidence' | 'Portfolio evidence' | 'Declared focus';
    highlights: string[];
  }[];
  declaredCapabilities: {
    category: string;
    skills: string[];
  }[];
  featuredDeliverables: {
    title: string;
    role: string;
    tech: string[];
    verificationProof: string;
    evidenceSource: string;
    limitations?: string[];
  }[];
  telemetrySummary: {
    githubContributionsLastYear: string;
    publicRepositoryCount: string;
    stackHealth: string;
  };
}

export const INITIAL_AUDIT_STEPS: AuditStep[] = [
  {
    id: 1,
    title: 'Profile & Credentials Check',
    tool: 'get_portfolio_overview',
    description: 'Reading the declared academic track, credentials, and profile data.',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Systems & Infrastructure Evidence',
    tool: 'get_skills',
    description: 'Cross-referencing declared skills with the reviewed project evidence layer.',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Project Source Inspection',
    tool: 'get_project_details',
    description: 'Reading repository-backed implementation notes for Tether and Campus Navigator.',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Live GitHub Activity Check',
    tool: 'get_github_stats',
    description: 'Checking current public GitHub activity when the live API is available.',
    status: 'pending',
  },
];

/** Generate a repository-grounded profile summary without an arbitrary hiring score. */
export function generateCandidateDossier(
  telemetrySummary: CandidateDossier['telemetrySummary'] = {
    githubContributionsLastYear: 'Live API value when available',
    publicRepositoryCount: 'Not included in this audit',
    stackHealth: 'Portfolio data + repository evidence snapshot',
  }
): CandidateDossier {
  const featuredProjectIds = ['tether', 'campus-nav', 'geocradle'];
  const featuredProjects = featuredProjectIds
    .map((id) => resumeData.projects.find((project) => project.id === id))
    .filter((project): project is (typeof resumeData.projects)[number] => Boolean(project));
  const evidence = featuredProjects
    .map((project) => getProjectEvidence(project.id))
    .filter((entry): entry is NonNullable<ReturnType<typeof getProjectEvidence>> => Boolean(entry));

  const evidenceSummary = {
    sourceCount: evidence.length,
    verifiedClaimCount: evidence.reduce((count, entry) => count + entry.verifiedClaims.length, 0),
    limitationCount: evidence.reduce((count, entry) => count + (entry.limitations?.length || 0), 0),
  };

  return {
    generatedAt: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    candidateName: resumeData.personalInfo.name,
    title: resumeData.personalInfo.title,
    location: resumeData.personalInfo.location,
    university: `${resumeData.education.university} (${resumeData.education.degree}, Class of ${resumeData.education.classOf})`,
    evidenceSummary,
    roleMatches: [
      {
        role: 'Systems & Infrastructure Engineer',
        evidenceLevel: 'Repository evidence',
        highlights: [
          ...getProjectEvidence('tether')!.verifiedClaims.slice(0, 2),
          ...getProjectEvidence('campus-nav')!.verifiedClaims.slice(0, 2),
        ],
      },
      {
        role: 'Full Stack Software Engineer',
        evidenceLevel: 'Portfolio evidence',
        highlights: [
          'This portfolio repository implements a Next.js, React, and TypeScript application.',
          'The portfolio repository exposes imperative WebMCP tools and declarative HTML form metadata.',
          ...getProjectEvidence('geocradle')!.verifiedClaims.slice(0, 2),
        ],
      },
      {
        role: 'Game Developer & Interactive 3D',
        evidenceLevel: 'Declared focus',
        highlights: [
          'Resume data declares Unity 3D, C#, game mechanics, and physics as areas of focus.',
          'This dossier does not assign a hiring score to that focus without a reviewed project source.',
        ],
      },
    ],
    declaredCapabilities: [
      {
        category: 'Programming Languages',
        skills: resumeData.skills.programming,
      },
      {
        category: 'Frameworks & Runtimes',
        skills: resumeData.skills.frameworks,
      },
      {
        category: 'Infrastructure & Tools',
        skills: resumeData.skills.infrastructure,
      },
    ],
    featuredDeliverables: featuredProjects.map((project) => {
      const projectEvidence = getProjectEvidence(project.id);
      return {
        title: project.title,
        role: project.role,
        tech: projectEvidence?.technologyTags || [],
        verificationProof: projectEvidence?.verifiedClaims[0] || project.description,
        evidenceSource: projectEvidence?.sourceUrl || project.link,
        limitations: projectEvidence?.limitations,
      };
    }),
    telemetrySummary,
  };
}

/**
 * Execute the evidence audit sequence step-by-step
 */
export async function runRecruiterAuditWorkflow(
  onStepChange: (stepIndex: number, status: 'running' | 'completed') => void
): Promise<CandidateDossier> {
  // Step 1: Profile & Credentials Check
  onStepChange(0, 'running');
  dispatchWebMCPToolCall({
    tool: 'get_portfolio_overview',
    result: {
      developer: resumeData.personalInfo.name,
      title: resumeData.personalInfo.title,
      credentials_count: credentials.length,
      university: resumeData.education.university,
    },
    summary: 'Audit demo: read declared profile and academic data',
  });
  await new Promise((r) => setTimeout(r, 700));
  onStepChange(0, 'completed');

  // Step 2: Systems & Stack Evidence
  onStepChange(1, 'running');
  dispatchWebMCPToolCall({
    tool: 'get_skills',
    input: { category: 'programming' },
    result: {
      declared_skills: resumeData.skills,
      repository_evidence: Object.values(projectEvidence),
    },
    summary: 'Audit demo: cross-referenced declared skills with reviewed project evidence',
  });
  await new Promise((r) => setTimeout(r, 800));
  onStepChange(1, 'completed');

  // Step 3: Project Source Inspection
  onStepChange(2, 'running');
  dispatchWebMCPToolCall({
    tool: 'get_project_details',
    input: { project_name: 'Tether' },
    result: {
      projects: ['tether', 'campus-nav'].map((id) => ({
        project: resumeData.projects.find((entry) => entry.id === id),
        evidence: getProjectEvidence(id),
      })),
    },
    summary: 'Audit demo: inspected repository-backed project notes',
  });
  await new Promise((r) => setTimeout(r, 800));
  onStepChange(2, 'completed');

  // Step 4: Live GitHub Activity Check
  onStepChange(3, 'running');
  let githubResult: Record<string, unknown>;
  let githubContributionsLastYear: string = 'Unavailable';
  try {
    const response = await fetch('https://github-contributions-api.jogruber.de/v4/narcisoJavier?y=last');
    const data = response.ok ? await response.json() as { total?: { lastYear?: number } } : null;
    githubContributionsLastYear = typeof data?.total?.lastYear === 'number'
      ? String(data.total.lastYear)
      : 'Unavailable';
    githubResult = data
      ? { source: 'GitHub contributions API', total_contributions_last_year: data.total?.lastYear ?? null, status: 'live' }
      : { source: 'GitHub contributions API', status: 'unavailable' };
  } catch {
    githubResult = { source: 'GitHub contributions API', status: 'unavailable' };
  }
  dispatchWebMCPToolCall({
    tool: 'get_github_stats',
    result: githubResult,
    summary: githubResult.status === 'live'
      ? 'Audit demo: checked live GitHub contribution data'
      : 'Audit demo: GitHub contribution data was unavailable',
  });
  await new Promise((r) => setTimeout(r, 700));
  onStepChange(3, 'completed');

  return generateCandidateDossier({
    githubContributionsLastYear,
    publicRepositoryCount: 'Not included in this audit',
    stackHealth: 'Portfolio data + repository evidence snapshot',
  });
}
