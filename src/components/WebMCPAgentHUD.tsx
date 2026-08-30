'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Terminal,
  Play,
  Sparkles,
  Eye,
  FileCheck2,
  CheckCircle2,
  Loader2,
  Send,
  Search,
  FolderGit2,
  Activity,
  Mail,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useWebMCPListener } from '@/lib/webmcpEvents';
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
  const { history } = useWebMCPListener();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'recruiter' | 'dispatch' | 'playground'>('recruiter');
  const [selectedTool, setSelectedTool] = useState<string>('search_portfolio');
  const [customArgs, setCustomArgs] = useState<string>('{\n  "query": "Docker"\n}');
  const [lastResult, setLastResult] = useState<unknown>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Evidence audit workflow state
  const [isAuditRunning, setIsAuditRunning] = useState(false);
  const [auditSteps, setAuditSteps] = useState<AuditStep[]>(INITIAL_AUDIT_STEPS);
  const [dossier, setDossier] = useState<CandidateDossier | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Unified global trigger: the WebMCP button or page launcher opens the hub.
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

  // Dismiss on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Bottom-right WebMCP agent hub */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="WebMCP Agent Hub"
            id="webmcp-agent-drawer"
            tabIndex={-1}
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
                    <span>WebMCP AGENT HUB</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 font-sans">
                    W3C Browser Model Context tools &amp; workflow demos
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
                <span>Contact Route</span>
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
                      <div className="text-[10px] opacity-70 font-sans mt-0.5">Open the page contact form</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Link to the authoritative W3C Declarative Form */}
            {activeTab === 'dispatch' && (
              <div id="agent-dispatch-panel" role="tabpanel" aria-label="Contact route" className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>W3C DECLARATIVE FORM</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-zinc-300 font-mono">
                    send_inquiry
                  </span>
                </div>

                <div className="border border-white/10 bg-[#0c0c12] p-3.5 space-y-3">
                  <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                    The live inquiry form is embedded in the Contact section below. This hub keeps the registered WebMCP tools visible without duplicating the submission fields.
                  </p>
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <span className="text-[10px] text-zinc-500 font-mono">SOURCE: #inquiry-form</span>
                    <a
                      href="#inquiry-form"
                      className="inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-emerald-300"
                    >
                      <Send className="h-3 w-3" />
                      <span>Open Main Form</span>
                    </a>
                  </div>
                </div>
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
