'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Terminal,
  Play,
  X,
  Sparkles,
  Eye,
  FileCheck2,
  CheckCircle2,
  Loader2,
  Send,
  Check,
  Search,
  FolderGit2,
  Activity,
  Mail,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useWebMCPListener, dispatchWebMCPToolCall, type WebMCPToolCallEvent } from '@/lib/webmcpEvents';
import { submitInquiry } from '@/lib/inquiryClient';
import { resumeData, credentials } from '@/data/resumeData';
import {
  runRecruiterAuditWorkflow,
  INITIAL_AUDIT_STEPS,
  type CandidateDossier,
  type AuditStep,
} from '@/lib/webmcpWorkflow';
import CandidateDossierModal from '@/components/ui/CandidateDossierModal';

const AVAILABLE_TOOLS = [
  'get_portfolio_overview',
  'get_profile',
  'get_skills',
  'get_projects',
  'get_project_details',
  'get_education',
  'get_github_stats',
  'search_portfolio',
  'send_inquiry',
  'download_resume',
  'get_telemetry',
] as const;

export default function WebMCPAgentHUD() {
  const { activeToolCall, history } = useWebMCPListener();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recruiter' | 'dispatch' | 'playground'>('recruiter');
  const [selectedTool, setSelectedTool] = useState<string>('search_portfolio');
  const [customArgs, setCustomArgs] = useState<string>('{\n  "query": "Docker"\n}');
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [latestEvent, setLatestEvent] = useState<WebMCPToolCallEvent | null>(null);

  // Evidence audit workflow state
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const [auditSteps, setAuditSteps] = useState<AuditStep[]>(INITIAL_AUDIT_STEPS);
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Embedded Dispatch Form State
  const [formState, setFormState] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
    website: '',
  });
  const [inquiryStatus, setInquiryStatus] = useState<string | null>(null);
  const [inquiryError, setInquiryError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeToolCall) {
      setLatestEvent(activeToolCall);
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [activeToolCall]);

  // Unified global trigger: Pet click or page button opens the bottom-right console
  useEffect(() => {
    const handleOpenSimulator = () => setIsOpen((prev) => !prev);
    window.addEventListener('webmcp:open-simulator', handleOpenSimulator);
    return () => window.removeEventListener('webmcp:open-simulator', handleOpenSimulator);
  }, []);

  const handleRunEvidenceAudit = async () => {
    setIsAuditRunning(true);
    setAuditSteps(INITIAL_AUDIT_STEPS.map((s) => ({ ...s, status: 'pending' })));

    try {
      const generatedDossier = await runRecruiterAuditWorkflow((stepIdx, status) => {
        setAuditSteps((prev) =>
          prev.map((s, idx) => (idx === stepIdx ? { ...s, status } : s))
        );
      });

      setDossier(generatedDossier);
      setIsDossierOpen(true);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setIsAuditRunning(false);
    }
  };

  const executeSimulatedTool = async (toolName: string, inputArgs: Record<string, unknown> = {}) => {
    setIsRunning(true);
    try {
      let result: unknown = null;

      if (typeof document !== 'undefined' && 'modelContext' in document) {
        const mc = (document as unknown as { modelContext: { getTools?: () => Promise<{ name: string }[]>; executeTool?: (t: unknown, a: unknown) => Promise<unknown> } }).modelContext;
        if (mc?.getTools && mc?.executeTool) {
          const tools = await mc.getTools();
          const target = tools.find((t) => t.name === toolName);
          if (target) {
            result = await mc.executeTool(target, inputArgs);
          }
        }
      }

      // Fallback local execution if native modelContext execute is not bound
      if (!result) {
        switch (toolName) {
          case 'get_portfolio_overview':
            result = {
              developer: resumeData.personalInfo.name,
              title: resumeData.personalInfo.title,
              specializations: resumeData.personalInfo.titleAnimated,
              total_projects: resumeData.projects.length,
              top_languages: resumeData.skills.programming.slice(0, 5),
            };
            break;
          case 'get_profile':
            result = { ...resumeData.personalInfo, education: resumeData.education, credentials };
            break;
          case 'get_skills':
            result = resumeData.skills;
            break;
          case 'get_projects':
            result = resumeData.projects;
            break;
          case 'get_project_details': {
            const q = ((inputArgs.project_name as string) || '').toLowerCase();
            result = resumeData.projects.find((p) => p.title.toLowerCase().includes(q)) || { error: 'Not found' };
            break;
          }
          case 'get_education':
            result = { education: resumeData.education, credentials };
            break;
          case 'get_github_stats':
            result = { github_url: 'https://github.com/narcisoJavier', contributions_last_year: null, status: 'live API unavailable in local fallback' };
            break;
          case 'search_portfolio': {
            const q = ((inputArgs.query as string) || '').toLowerCase();
            const skillMatches = Object.values(resumeData.skills).flat().filter((s) => s.toLowerCase().includes(q));
            const projMatches = resumeData.projects.filter((p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)).map((p) => p.title);
            result = { query: inputArgs.query, matches: { skills: skillMatches, projects: projMatches } };
            break;
          }
          case 'send_inquiry':
            result = await submitInquiry({
              sender_name: String(inputArgs.sender_name || ''),
              sender_email: String(inputArgs.sender_email || ''),
              subject: String(inputArgs.subject || ''),
              message: String(inputArgs.message || ''),
            });
            break;
          case 'download_resume':
            result = { download_url: '/api/resume', format: 'PDF' };
            break;
          case 'get_telemetry':
            result = { runtime: 'Next.js 16 + React 19 + Turbopack', stack_status: 'Portfolio configuration loaded' };
            break;
          default:
            result = { message: 'Tool executed' };
        }
      }

      setLastResult(result);
    } catch (err) {
      setLastResult({ error: String(err) });
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunPreset = (presetType: 'skills' | 'projects' | 'telemetry' | 'inquiry') => {
    switch (presetType) {
      case 'skills':
        setSelectedTool('search_portfolio');
        setCustomArgs('{\n  "query": "Docker"\n}');
        executeSimulatedTool('search_portfolio', { query: 'Docker' });
        break;
      case 'projects':
        setSelectedTool('get_project_details');
        setCustomArgs('{\n  "project_name": "Campus Navigator"\n}');
        executeSimulatedTool('get_project_details', { project_name: 'Campus Navigator' });
        break;
      case 'telemetry':
        setSelectedTool('get_telemetry');
        setCustomArgs('{}');
        executeSimulatedTool('get_telemetry', {});
        break;
      case 'inquiry':
        setActiveTab('dispatch');
        setFormState({
          sender_name: 'Lead Technical Recruiter',
          sender_email: 'recruiter@innovatetech.io',
          subject: 'Systems & Backend Engineering Opportunity',
          message: 'Hello Narciso, our engineering leadership reviewed your Go/Dart projects and would love to schedule a technical interview!',
          website: '',
        });
        break;
    }
  };

  const handleCustomExecute = () => {
    try {
      const parsed = customArgs.trim() ? JSON.parse(customArgs) : {};
      executeSimulatedTool(selectedTool, parsed);
    } catch (e) {
      setLastResult({ error: `Invalid JSON payload: ${String(e)}` });
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formState.sender_name || !formState.sender_email || !formState.subject || !formState.message) {
      setInquiryError(true);
      setInquiryStatus('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setInquiryError(false);
    setInquiryStatus(null);

    try {
      const result = await submitInquiry(formState);
      dispatchWebMCPToolCall({
        tool: 'send_inquiry',
        input: formState as unknown as Record<string, unknown>,
        result,
        summary: `Inquiry sent by ${formState.sender_name}: "${formState.subject}"`,
      });

      setInquiryError(false);
      setInquiryStatus('Inquiry sent successfully.');
      setFormState({ sender_name: '', sender_email: '', subject: '', message: '', website: '' });
      setTimeout(() => setInquiryStatus(null), 5000);
    } catch (error) {
      setInquiryError(true);
      setInquiryStatus(error instanceof Error ? error.message : 'The inquiry could not be sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillTemplate = (type: 'recruiter' | 'collab') => {
    if (type === 'recruiter') {
      setFormState({
        sender_name: 'Senior Talent Partner',
        sender_email: 'talent@cloudinfra.dev',
        subject: 'Distributed Systems & Go Developer Role',
        message: 'Hi Narciso, we are building high-throughput infrastructure and want to discuss opportunities.',
        website: '',
      });
    } else {
      setFormState({
        sender_name: 'Open Source Maintainer',
        sender_email: 'lead@oss-systems.org',
        subject: 'Technical Collaboration & Architecture Review',
        message: 'Hello Narciso, we loved your Tether project and would like to collaborate on container networking tooling.',
        website: '',
      });
    }
  };

  return (
    <>
      {/* Real-time Agent Activity Toast Notification */}
      <AnimatePresence>
        {showToast && latestEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-28 right-4 sm:right-6 md:right-8 z-50 max-w-sm w-full bg-[#0a0a0f] border border-white/20 p-3.5 shadow-2xl font-mono text-xs text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Bot className="w-4 h-4" />
                <span>WebMCP AGENT EVENT</span>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="text-zinc-500 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-2 text-zinc-300 font-sans text-xs">
              <span className="font-mono text-white font-bold">{latestEvent.tool}()</span> — {latestEvent.summary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Bottom-Right Agent Simulator & Hub (Docked with Cyber Serpent) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 md:right-8 z-50 w-[92vw] sm:w-[500px] md:w-[560px] max-h-[82vh] bg-[#07070b]/98 backdrop-blur-2xl border border-white/25 p-4 sm:p-5 shadow-2xl shadow-black flex flex-col space-y-4 overflow-y-auto no-scrollbar font-mono text-xs text-white"
          >
            {/* Corner Crosshairs */}
            <span className="blk-crosshair-tl">+</span>
            <span className="blk-crosshair-tr">+</span>
            <span className="blk-crosshair-bl">+</span>
            <span className="blk-crosshair-br">+</span>

            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-500/10 border border-emerald-400/30 text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <span>WebMCP AGENT SIMULATOR &amp; HUB</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-zinc-400 font-sans">
                    W3C Browser Model Context Testing &amp; Dispatch Console
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Close Agent Hub"
                className="p-1.5 text-zinc-400 hover:text-white border border-transparent hover:border-white/20 transition-all cursor-pointer"
                title="Close Agent Hub"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tab Bar with Vector Icons (Zero Emojis) */}
            <div role="tablist" aria-label="Agent hub views" className="grid grid-cols-3 gap-1 bg-[#101017] p-1 border border-white/10 text-[10px] font-mono">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'recruiter'}
                aria-controls="agent-recruiter-panel"
                onClick={() => setActiveTab('recruiter')}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'recruiter'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Recruiter Screen</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'dispatch'}
                aria-controls="agent-dispatch-panel"
                onClick={() => setActiveTab('dispatch')}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'dispatch'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Send className="w-3 h-3 text-cyan-400" />
                <span>Dispatch Form</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'playground'}
                aria-controls="agent-playground-panel"
                onClick={() => setActiveTab('playground')}
                className={`py-1.5 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'playground'
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3 h-3 text-zinc-400" />
                <span>Tool Runner</span>
              </button>
            </div>

            {/* TAB 1: Recruiter Screen & Presets */}
            {activeTab === 'recruiter' && (
              <div id="agent-recruiter-panel" role="tabpanel" aria-label="Recruiter audit" className="space-y-4">
                {/* Evidence Audit Workflow Card */}
                <div className="p-3.5 bg-gradient-to-b from-[#14141f] to-[#0c0c12] border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Recruiter Audit Demo</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-400/20 text-emerald-300 font-mono">
                      EVIDENCE SNAPSHOT
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    Run a four-step demonstration that reads declared profile data, reviewed project evidence, and live GitHub activity when available. It produces an evidence summary—not a hiring decision.
                  </p>

                  {/* Audit Steps Progress List */}
                  {isAuditRunning && (
                    <div className="space-y-1.5 p-2.5 bg-black/60 border border-white/10">
                      {auditSteps.map((step) => (
                        <div
                          key={step.id}
                          className="flex items-center justify-between text-[10px] font-mono"
                        >
                          <span className="text-zinc-300 truncate max-w-[320px]">
                            {step.id}. {step.title}
                          </span>
                          {step.status === 'running' && (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              <span>Auditing...</span>
                            </span>
                          )}
                          {step.status === 'completed' && (
                            <span className="flex items-center gap-1 text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Checked</span>
                            </span>
                          )}
                          {step.status === 'pending' && (
                            <span className="text-zinc-600">Pending</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleRunEvidenceAudit}
                      disabled={isAuditRunning}
                      className="flex-1 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-black font-mono font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      {isAuditRunning ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Running Evidence Audit...</span>
                        </>
                      ) : (
                        <>
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Run Evidence Audit</span>
                        </>
                      )}
                    </button>

                    {dossier && (
                      <button
                        onClick={() => setIsDossierOpen(true)}
                        className="px-3 py-2 bg-[#1f1f2a] hover:bg-zinc-700 text-white border border-white/20 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dossier</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 1-Click Judge & Recruiter Presets with Vector Icons */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3 h-3 text-white" />
                    <span>1-Click Tool Presets (Judge Fallback)</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRunPreset('skills')}
                      className="p-2.5 bg-[#121218] hover:bg-white hover:text-black border border-white/10 hover:border-white text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-[11px] uppercase flex items-center gap-1.5">
                        <Search className="w-3 h-3 text-emerald-400 group-hover:text-black transition-colors" />
                        <span>Inspect Skills</span>
                      </div>
                      <div className="text-[10px] opacity-70 font-sans mt-0.5">Search &apos;Docker&apos; stack</div>
                    </button>

                    <button
                      onClick={() => handleRunPreset('projects')}
                      className="p-2.5 bg-[#121218] hover:bg-white hover:text-black border border-white/10 hover:border-white text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-[11px] uppercase flex items-center gap-1.5">
                        <FolderGit2 className="w-3 h-3 text-cyan-400 group-hover:text-black transition-colors" />
                        <span>Project Lookup</span>
                      </div>
                      <div className="text-[10px] opacity-70 font-sans mt-0.5">Campus Navigator details</div>
                    </button>

                    <button
                      onClick={() => handleRunPreset('telemetry')}
                      className="p-2.5 bg-[#121218] hover:bg-white hover:text-black border border-white/10 hover:border-white text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-[11px] uppercase flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-amber-400 group-hover:text-black transition-colors" />
                        <span>Live Telemetry</span>
                      </div>
                      <div className="text-[10px] opacity-70 font-sans mt-0.5">Runtime &amp; stack specs</div>
                    </button>

                    <button
                      onClick={() => handleRunPreset('inquiry')}
                      className="p-2.5 bg-[#121218] hover:bg-white hover:text-black border border-white/10 hover:border-white text-left transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-[11px] uppercase flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-purple-400 group-hover:text-black transition-colors" />
                        <span>Send Inquiry</span>
                      </div>
                      <div className="text-[10px] opacity-70 font-sans mt-0.5">Open Dispatch Form</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: W3C Declarative Dispatch Form */}
            {activeTab === 'dispatch' && (
              <div id="agent-dispatch-panel" role="tabpanel" aria-label="Dispatch form" className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>W3C Declarative Dispatch Console</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-zinc-300 font-mono">
                    toolname=&quot;send_inquiry&quot;
                  </span>
                </div>

                {/* Autofill quick templates */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400">Quick Templates:</span>
                  <button
                    type="button"
                    onClick={() => autofillTemplate('recruiter')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[9px] text-white transition-all cursor-pointer"
                  >
                    + Role Opportunity
                  </button>
                  <button
                    type="button"
                    onClick={() => autofillTemplate('collab')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-[9px] text-white transition-all cursor-pointer"
                  >
                    + Tech Collab
                  </button>
                </div>

                <form
                  id="hud-inquiry-form"
                  onSubmit={handleInquirySubmit}
                  // @ts-expect-error W3C WebMCP Declarative Form Attributes
                  toolname="send_inquiry"
                  tooldescription="Send a professional inquiry, role opportunity, or message to Narciso III Javier"
                  toolautosubmit="true"
                  className="space-y-2.5 text-xs font-mono"
                >
                  <input
                    name="website"
                    value={formState.website}
                    onChange={(e) => setFormState((p) => ({ ...p, website: e.target.value }))}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="hud-sender-name" className="block text-[10px] uppercase text-zinc-400 mb-1">
                        Sender / Organization
                      </label>
                      <input
                        id="hud-sender-name"
                        name="sender_name"
                        value={formState.sender_name}
                        onChange={(e) => setFormState((p) => ({ ...p, sender_name: e.target.value }))}
                        placeholder="e.g. Sarah Connor / Tech Inc"
                        // @ts-expect-error W3C WebMCP Parameter Attribute
                        toolparamdescription="Your full name or recruiting organization"
                        required
                        className="w-full bg-[#121218] border border-white/15 text-white p-2 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="hud-sender-email" className="block text-[10px] uppercase text-zinc-400 mb-1">
                        Contact Email
                      </label>
                      <input
                        id="hud-sender-email"
                        name="sender_email"
                        type="email"
                        value={formState.sender_email}
                        onChange={(e) => setFormState((p) => ({ ...p, sender_email: e.target.value }))}
                        placeholder="sarah@tech.co"
                        // @ts-expect-error W3C WebMCP Parameter Attribute
                        toolparamdescription="Your contact email address for correspondence"
                        required
                        className="w-full bg-[#121218] border border-white/15 text-white p-2 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="hud-subject" className="block text-[10px] uppercase text-zinc-400 mb-1">
                      Subject Line
                    </label>
                    <input
                      id="hud-subject"
                      name="subject"
                      value={formState.subject}
                      onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))}
                      placeholder="e.g. Backend Go Developer Role"
                      // @ts-expect-error W3C WebMCP Parameter Attribute
                      toolparamdescription="Subject line describing the inquiry, role, or proposal"
                      required
                      className="w-full bg-[#121218] border border-white/15 text-white p-2 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="hud-message" className="block text-[10px] uppercase text-zinc-400 mb-1">
                      Message Body
                    </label>
                    <textarea
                      id="hud-message"
                      name="message"
                      value={formState.message}
                      onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                      placeholder="Message details or interview proposal..."
                      rows={3}
                      // @ts-expect-error W3C WebMCP Parameter Attribute
                      toolparamdescription="Detailed message body"
                      required
                      className="w-full bg-[#121218] border border-white/15 text-white p-2 font-mono text-xs focus:outline-none focus:border-white transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-black font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      <span>{isSubmitting ? 'Sending...' : 'Dispatch Inquiry via WebMCP'}</span>
                    </button>

                    {inquiryStatus && (
                      <span role="status" aria-live="polite" className={`${inquiryError ? 'text-rose-300' : 'text-emerald-400'} text-xs font-mono flex items-center gap-1.5 animate-pulse`}>
                        {inquiryError ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                        <span>{inquiryStatus}</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: Custom Tool Execution Playground */}
            {activeTab === 'playground' && (
              <div id="agent-playground-panel" role="tabpanel" aria-label="Tool runner" className="space-y-3">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-white" />
                    <span>Direct Tool Execution</span>
                  </span>
                  <span className="text-[10px] text-zinc-500">11 Tools Available</span>
                </div>

                <div className="space-y-2">
                  <select
                    value={selectedTool}
                    onChange={(e) => setSelectedTool(e.target.value)}
                    className="w-full bg-[#121218] border border-white/20 text-white p-2 font-mono text-xs focus:outline-none focus:border-white"
                  >
                    {AVAILABLE_TOOLS.map((tool) => (
                      <option key={tool} value={tool} className="bg-[#121218] text-white">
                        {tool}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={customArgs}
                    onChange={(e) => setCustomArgs(e.target.value)}
                    placeholder='Input arguments in JSON (e.g. {"query": "Go"})'
                    rows={3}
                    className="w-full bg-[#121218] border border-white/15 text-white p-2 font-mono text-xs focus:outline-none focus:border-white resize-none"
                  />

                  <button
                    onClick={handleCustomExecute}
                    disabled={isRunning}
                    className="w-full py-2 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>{isRunning ? 'Executing Tool...' : 'Execute Tool via WebMCP'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Live JSON Response Viewer */}
            {lastResult !== null && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="uppercase font-bold text-white flex items-center gap-1.5">
                    <Eye className="w-3 h-3" />
                    <span>Live Response Payload</span>
                  </span>
                  <span className="text-emerald-400 font-bold">200 OK</span>
                </div>

                <pre className="p-3 bg-black/80 border border-white/10 max-h-36 overflow-y-auto text-[11px] text-zinc-300 font-mono leading-relaxed select-text">
                  {JSON.stringify(lastResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Activity History Logs */}
            {history.length > 0 && (
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  Recent Session Invocations ({history.length})
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {history.slice(0, 4).map((h, i) => (
                    <div
                      key={`${h.timestamp}-${i}`}
                      className="flex items-center justify-between p-1.5 bg-white/5 border border-white/5 text-[10px]"
                    >
                      <span className="font-bold text-white">{h.tool}</span>
                      <span className="text-zinc-400 font-sans truncate max-w-[200px]">{h.summary}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evidence Snapshot Modal */}
      <CandidateDossierModal
        dossier={dossier}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </>
  );
}
