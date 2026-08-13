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
    setFormData((prev) => {
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
    <div className="min-h-screen bg-[#06090e] text-slate-200 p-4 sm:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-blue-400 hover:text-blue-300 font-bold">
              ← ~/portfolio
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">admin_config.sh</span>
          </div>
          <span className="text-[10px] text-slate-500">TUI CMS UTILITY</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-100 mb-1">Portfolio Content Configuration</h1>
          <p className="text-xs text-slate-400">
            Edit content overrides stored in client localStorage. Persists until manually reset.
          </p>
        </div>

        {message && (
          <div className="px-4 py-2 bg-blue-950/80 border border-blue-700/60 rounded text-xs text-blue-300">
            {message}
          </div>
        )}

        {/* Section Tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['personalInfo', 'skills', 'education'] as EditableSection[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeSection === s
                  ? 'bg-blue-950 text-blue-200 border border-blue-500 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {s === 'personalInfo' ? 'Personal Info' : s === 'skills' ? 'Skills' : 'Education'}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="bg-[#090d16] rounded border border-slate-800 p-4 sm:p-6 space-y-4">
          {activeSection === 'personalInfo' && (
            <div className="space-y-4">
              <Field
                label="Name"
                value={formData.personalInfo?.name ?? resumeData.personalInfo.name}
                onChange={(v) => updateField('personalInfo.name', v)}
              />
              <Field
                label="Title"
                value={formData.personalInfo?.title ?? resumeData.personalInfo.title}
                onChange={(v) => updateField('personalInfo.title', v)}
              />
              <Field
                label="Location"
                value={formData.personalInfo?.location ?? resumeData.personalInfo.location}
                onChange={(v) => updateField('personalInfo.location', v)}
              />
              <Field
                label="Email"
                value={formData.personalInfo?.email ?? resumeData.personalInfo.email}
                onChange={(v) => updateField('personalInfo.email', v)}
              />
              <Field
                label="Phone"
                value={formData.personalInfo?.phone ?? resumeData.personalInfo.phone}
                onChange={(v) => updateField('personalInfo.phone', v)}
              />
              <Field
                label="LinkedIn URL"
                value={formData.personalInfo?.linkedin ?? resumeData.personalInfo.linkedin}
                onChange={(v) => updateField('personalInfo.linkedin', v)}
              />
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-4">
              <TextareaField
                label="Programming Languages (comma separated)"
                value={
                  formData.skills?.programming?.join(', ') ??
                  resumeData.skills.programming.join(', ')
                }
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      programming: v.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  }))
                }
              />
              <TextareaField
                label="Frameworks (comma separated)"
                value={
                  formData.skills?.frameworks?.join(', ') ??
                  resumeData.skills.frameworks.join(', ')
                }
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      frameworks: v.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  }))
                }
              />
              <TextareaField
                label="Infrastructure (comma separated)"
                value={
                  formData.skills?.infrastructure?.join(', ') ??
                  resumeData.skills.infrastructure.join(', ')
                }
                onChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    skills: {
                      ...prev.skills,
                      infrastructure: v.split(',').map((s) => s.trim()).filter(Boolean),
                    },
                  }))
                }
              />
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4">
              <Field
                label="University"
                value={formData.education?.university ?? resumeData.education.university}
                onChange={(v) => updateField('education.university', v)}
              />
              <Field
                label="Degree"
                value={formData.education?.degree ?? resumeData.education.degree}
                onChange={(v) => updateField('education.degree', v)}
              />
              <Field
                label="GPA"
                value={formData.education?.gpa ?? resumeData.education.gpa}
                onChange={(v) => updateField('education.gpa', v)}
              />
              <Field
                label="Class Of"
                value={formData.education?.classOf ?? resumeData.education.classOf}
                onChange={(v) => updateField('education.classOf', v)}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-950 hover:bg-blue-900 border border-blue-700/60 rounded text-blue-200 text-xs font-bold transition-colors cursor-pointer"
            >
              [Ctrl+S] Save Overrides
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 text-xs transition-colors cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        className="w-full bg-[#06090e] border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextareaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-mono text-slate-500 mb-1">{label}</label>
      <textarea
        className="w-full bg-[#06090e] border border-slate-800 rounded px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
