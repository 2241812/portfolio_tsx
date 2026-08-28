"use client";
import React, { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { resumeData, credentials } from '@/data/resumeData';
import { containerVariants, cardVariants, headingVariants, fireConfetti } from './shared';
import {
  Mail,
  Phone,
  Check,
  Copy,
  ExternalLink,
  Award,
  Send,
  Bot,
  Sparkles,
} from 'lucide-react';
import { LinkedinIcon } from '@/components/ui/StudioIcons';
import { dispatchWebMCPToolCall } from '@/lib/webmcpEvents';

export const ContactSection = memo(function ContactSection() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [inquiryStatus, setInquiryStatus] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
  });

  const copyToClipboard = useCallback((text: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(label);
    fireConfetti();
    setTimeout(() => setCopiedField(null), 2500);
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.sender_name || !formState.sender_email || !formState.subject || !formState.message) {
      setInquiryStatus('Please fill in all fields.');
      return;
    }

    try {
      if (typeof localStorage !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('webmcp-inquiries') || '[]');
        existing.push({
          ...formState,
          timestamp: new Date().toISOString(),
          source: 'declarative_html_form',
        });
        localStorage.setItem('webmcp-inquiries', JSON.stringify(existing));
      }
    } catch {}

    dispatchWebMCPToolCall({
      tool: 'send_inquiry',
      input: formState as unknown as Record<string, unknown>,
      result: { success: true, message: 'Inquiry saved successfully.' },
      summary: `Inquiry sent by ${formState.sender_name}: "${formState.subject}"`,
    });

    fireConfetti();
    setInquiryStatus('Inquiry received! Narciso will review your message.');
    setFormState({ sender_name: '', sender_email: '', subject: '', message: '' });
    setTimeout(() => setInquiryStatus(null), 5000);
  };

  return (
    <section id="contact" className="scroll-mt-20 w-full py-12 border-b border-white/10">
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
              <span>03 // DISPATCH</span>
              <span className="text-zinc-600">/</span>
              <span>GET IN TOUCH &amp; INQUIRE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase font-display tracking-tight">
              Contact &amp; Connect
            </h2>
          </div>

          <span className="text-xs font-mono text-zinc-400">
            [OPEN FOR SOFTWARE &amp; SYSTEMS OPPORTUNITIES // 2026]
          </span>
        </motion.div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Direct Channels & Declarative Form (7 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-7 kokonut-card-glow p-6 sm:p-8 space-y-6">
            <div className="studio-corner-tl" />
            <div className="studio-corner-br" />
            <div className="kokonut-spotlight-layer" />

            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                <Send className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRIES &amp; DISPATCH</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-zinc-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <p className="relative z-10 text-sm text-zinc-300 font-sans leading-relaxed">
              Seeking software engineering, backend systems, and technical collaboration roles. Reach out
              directly or dispatch a message through the form below.
            </p>

            {/* Direct Copyable Rows */}
            <div className="relative z-10 space-y-3 pt-1">
              {/* Email */}
              <div className="flex items-center justify-between p-3.5 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Email
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      {resumeData.personalInfo.email}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.email, 'email')}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedField === 'email'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {copiedField === 'email' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3.5 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      Phone / Mobile
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      {resumeData.personalInfo.phone}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(resumeData.personalInfo.phone, 'phone')}
                  className={`px-3.5 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    copiedField === 'phone'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white hover:bg-zinc-200 text-black'
                  }`}
                >
                  {copiedField === 'phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedField === 'phone' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between p-3.5 bg-[#121217] border border-white/10 hover:border-white/25 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2 bg-white/5 border border-white/10 text-white">
                    <LinkedinIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                      LinkedIn
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white font-mono truncate">
                      linkedin.com/in/narcisoiii-javier
                    </div>
                  </div>
                </div>

                <a
                  href={resumeData.personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 text-xs font-mono font-bold bg-[#181820] hover:bg-zinc-800 text-white border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Connect</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Declarative WebMCP Form (W3C Standard) */}
            <div className="relative z-10 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between pb-3 text-xs font-mono">
                <span className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DISPATCH FORM // WebMCP ENABLED</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  [AGENT DECLARATIVE API]
                </span>
              </div>

              <form
                id="inquiry-form"
                onSubmit={handleInquirySubmit}
                // @ts-expect-error W3C WebMCP Declarative Form Attributes
                toolname="send_inquiry"
                tooldescription="Send a professional inquiry, role opportunity, or message to Narciso III Javier"
                toolautosubmit="true"
                className="space-y-3 text-xs font-mono"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                      Your Name / Org
                    </label>
                    <input
                      name="sender_name"
                      value={formState.sender_name}
                      onChange={(e) => setFormState((p) => ({ ...p, sender_name: e.target.value }))}
                      placeholder="e.g. Alex Morgan / Tech Co"
                      // @ts-expect-error W3C WebMCP Parameter Attribute
                      toolparamdescription="Your full name or recruiting organization"
                      required
                      className="w-full bg-[#121218] border border-white/15 text-white p-2.5 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                      Your Email
                    </label>
                    <input
                      name="sender_email"
                      type="email"
                      value={formState.sender_email}
                      onChange={(e) => setFormState((p) => ({ ...p, sender_email: e.target.value }))}
                      placeholder="alex@tech.co"
                      // @ts-expect-error W3C WebMCP Parameter Attribute
                      toolparamdescription="Your contact email address for correspondence"
                      required
                      className="w-full bg-[#121218] border border-white/15 text-white p-2.5 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Subject Line
                  </label>
                  <input
                    name="subject"
                    value={formState.subject}
                    onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))}
                    placeholder="e.g. Systems & Go Developer Role"
                    // @ts-expect-error W3C WebMCP Parameter Attribute
                    toolparamdescription="Subject line describing the inquiry, role, or proposal"
                    required
                    className="w-full bg-[#121218] border border-white/15 text-white p-2.5 font-mono text-xs focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase text-zinc-400 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formState.message}
                    onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                    placeholder="Details about your project, team, or opportunity..."
                    rows={3}
                    // @ts-expect-error W3C WebMCP Parameter Attribute
                    toolparamdescription="Detailed message body"
                    required
                    className="w-full bg-[#121218] border border-white/15 text-white p-2.5 font-mono text-xs focus:outline-none focus:border-white transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-zinc-200 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>

                  {inquiryStatus && (
                    <span className="text-emerald-400 text-xs font-mono flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{inquiryStatus}</span>
                    </span>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Dispatch Specs & Accreditations (5 cols) */}
          <motion.div variants={cardVariants} className="lg:col-span-5 space-y-4">
            {/* Dispatch Specs Card */}
            <div className="kokonut-card-glow p-6 space-y-4">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 flex items-center justify-between text-xs font-mono border-b border-white/10 pb-3">
                <span className="text-white font-bold uppercase tracking-wider">
                  DISPATCH METRICS
                </span>
                <span className="text-zinc-500">{resumeData.personalInfo.location}</span>
              </div>

              <div className="relative z-10 space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Response Time</span>
                  <span className="text-white font-bold">&lt; 24 Hours</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Timezone</span>
                  <span className="text-zinc-200">GMT+8 (PHT)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-zinc-400">Work Model</span>
                  <span className="text-zinc-200">Remote / Hybrid / On-Site</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-400">Affiliation</span>
                  <span className="text-white font-bold font-mono">Saint Louis University &apos;27</span>
                </div>
              </div>
            </div>

            {/* Accreditations Badges */}
            <div className="kokonut-card-glow p-6 space-y-3">
              <div className="studio-corner-tl" />
              <div className="studio-corner-br" />
              <div className="kokonut-spotlight-layer" />

              <div className="relative z-10 text-xs font-bold text-white uppercase tracking-wider font-mono border-b border-white/10 pb-2">
                VERIFIED CREDENTIALS
              </div>

              <div className="relative z-10 space-y-3 pt-1">
                {credentials.map((cred) => (
                  <div key={cred.title} className="flex items-center gap-3 text-xs">
                    <div className="p-1.5 bg-white/5 border border-white/10 text-white">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0 font-mono">
                      <div className="font-semibold text-white truncate">{cred.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{cred.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});

export default ContactSection;
