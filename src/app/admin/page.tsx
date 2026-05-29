"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { resumeData } from '@/data/resumeData';
import { saveContentOverrides, resetContentOverrides, type ContentOverrides } from '@/hooks/useContent';

type EditableSection = 'personalInfo' | 'skills' | 'education';

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState<EditableSection>('personalInfo');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<ContentOverrides>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('resume-content-overrides');
      if (raw) {
        setFormData(JSON.parse(raw));
      }
    } catch {}
  }, []);

  const updateField = (path: string, value: string) => {
    setFormData(prev => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let obj: Record<string, unknown> = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]] as Record<string, unknown>;
      }
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const handleSave = () => {
    saveContentOverrides(formData);
    setMessage('Content saved! Reload the page to see changes.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReset = () => {
    resetContentOverrides();
    setFormData({});
    setMessage('Content reset to defaults. Reload the page.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2 font-mono">Content Editor</h1>
        <p className="text-sm text-neutral-500 mb-6 font-mono">
          Edit your portfolio content. Changes are saved to localStorage and persist until reset.
        </p>

        {message && (
          <div className="mb-4 px-4 py-2 bg-cyan-900/40 border border-cyan-500/40 rounded-lg text-sm text-cyan-300">
            {message}
          </div>
        )}

        <div className="flex gap-2 mb-6 flex-wrap">
          {(['personalInfo', 'skills', 'education'] as EditableSection[]).map(s => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                activeSection === s
                  ? 'bg-cyan-600 text-neutral-950 font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {s === 'personalInfo' ? 'Personal Info' : s === 'skills' ? 'Skills' : 'Education'}
            </button>
          ))}
        </div>

        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6 mb-6">
          {activeSection === 'personalInfo' && (
            <div className="space-y-4">
              <Field label="Name" value={formData.personalInfo?.name ?? resumeData.personalInfo.name} onChange={v => updateField('personalInfo.name', v)} />
              <Field label="Title" value={formData.personalInfo?.title ?? resumeData.personalInfo.title} onChange={v => updateField('personalInfo.title', v)} />
              <Field label="Location" value={formData.personalInfo?.location ?? resumeData.personalInfo.location} onChange={v => updateField('personalInfo.location', v)} />
              <Field label="Email" value={formData.personalInfo?.email ?? resumeData.personalInfo.email} onChange={v => updateField('personalInfo.email', v)} />
              <Field label="Phone" value={formData.personalInfo?.phone ?? resumeData.personalInfo.phone} onChange={v => updateField('personalInfo.phone', v)} />
              <Field label="LinkedIn URL" value={formData.personalInfo?.linkedin ?? resumeData.personalInfo.linkedin} onChange={v => updateField('personalInfo.linkedin', v)} />
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Animated Titles (one per line)</label>
                <textarea
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 font-mono"
                  rows={4}
                  value={(formData.personalInfo?.titleAnimated ?? resumeData.personalInfo.titleAnimated).join('\n')}
                  onChange={e => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    setFormData(prev => {
                      const next = structuredClone(prev);
                      if (!next.personalInfo) next.personalInfo = {} as typeof resumeData.personalInfo;
                      next.personalInfo = { ...resumeData.personalInfo, ...next.personalInfo, titleAnimated: lines };
                      return next;
                    });
                  }}
                />
              </div>
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4">
              <Field label="University" value={formData.education?.university ?? resumeData.education.university} onChange={v => updateField('education.university', v)} />
              <Field label="Degree" value={formData.education?.degree ?? resumeData.education.degree} onChange={v => updateField('education.degree', v)} />
              <Field label="GPA" value={formData.education?.gpa ?? resumeData.education.gpa} onChange={v => updateField('education.gpa', v)} />
              <Field label="Class of" value={formData.education?.classOf ?? resumeData.education.classOf} onChange={v => updateField('education.classOf', v)} />
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Programming Languages (one per line)</label>
                <textarea
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 font-mono"
                  rows={6}
                  value={(formData.skills?.programming ?? resumeData.skills.programming).join('\n')}
                  onChange={e => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    setFormData(prev => {
                      const next = structuredClone(prev);
                      if (!next.skills) next.skills = {} as typeof resumeData.skills;
                      next.skills = { ...resumeData.skills, ...next.skills, programming: lines };
                      return next;
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-500 mb-1">Frameworks (one per line)</label>
                <textarea
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 font-mono"
                  rows={4}
                  value={(formData.skills?.frameworks ?? resumeData.skills.frameworks).join('\n')}
                  onChange={e => {
                    const lines = e.target.value.split('\n').filter(Boolean);
                    setFormData(prev => {
                      const next = structuredClone(prev);
                      if (!next.skills) next.skills = {} as typeof resumeData.skills;
                      next.skills = { ...resumeData.skills, ...next.skills, frameworks: lines };
                      return next;
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-neutral-950 font-bold rounded-lg font-mono text-sm transition-all"
          >
            Save Changes
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg font-mono text-sm transition-all"
          >
            Reset to Defaults
          </button>
          <Link
            href="/"
            className="px-6 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 rounded-lg font-mono text-sm transition-all inline-block"
          >
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-mono text-neutral-500 mb-1">{label}</label>
      <input
        type="text"
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 font-mono focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
