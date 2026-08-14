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

  const updatePersonalInfo = (field: keyof typeof resumeData.personalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: {
        ...(prev.personalInfo ?? resumeData.personalInfo),
        [field]: value,
      },
    }));
  };

  const updateEducation = (field: keyof typeof resumeData.education, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...(prev.education ?? resumeData.education),
        [field]: value,
      },
    }));
  };

  const updateSkills = (field: 'programming' | 'frameworks' | 'infrastructure', value: string) => {
    const list = value.split(',').map((s) => s.trim()).filter(Boolean);
    setFormData((prev) => ({
      ...prev,
      skills: {
        ...(prev.skills ?? resumeData.skills),
        [field]: list,
      },
    }));
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
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-4 sm:p-8 font-mono">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-zinc-300 hover:text-white font-bold">
              ← ~/portfolio
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300">admin_config.sh</span>
          </div>
          <span className="text-[10px] text-zinc-500">TUI CMS UTILITY</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-zinc-100 mb-1">Portfolio Content Configuration</h1>
          <p className="text-xs text-zinc-400">
            Edit content overrides stored in client localStorage. Persists until manually reset.
          </p>
        </div>

        {message && (
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-white">
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
                  ? 'bg-white text-black font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {s === 'personalInfo' ? 'Personal Info' : s === 'skills' ? 'Skills' : 'Education'}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <div className="bg-[#121215] rounded-xl border border-zinc-800 p-4 sm:p-6 space-y-4">
          {activeSection === 'personalInfo' && (
            <div className="space-y-4">
              <Field
                label="Full Name"
                value={formData.personalInfo?.name ?? resumeData.personalInfo.name}
                onChange={(v) => updatePersonalInfo('name', v)}
              />
              <Field
                label="Title"
                value={formData.personalInfo?.title ?? resumeData.personalInfo.title}
                onChange={(v) => updatePersonalInfo('title', v)}
              />
              <Field
                label="Location"
                value={formData.personalInfo?.location ?? resumeData.personalInfo.location}
                onChange={(v) => updatePersonalInfo('location', v)}
              />
              <Field
                label="Email"
                value={formData.personalInfo?.email ?? resumeData.personalInfo.email}
                onChange={(v) => updatePersonalInfo('email', v)}
              />
              <Field
                label="Phone"
                value={formData.personalInfo?.phone ?? resumeData.personalInfo.phone}
                onChange={(v) => updatePersonalInfo('phone', v)}
              />
              <Field
                label="LinkedIn URL"
                value={formData.personalInfo?.linkedin ?? resumeData.personalInfo.linkedin}
                onChange={(v) => updatePersonalInfo('linkedin', v)}
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
                onChange={(v) => updateSkills('programming', v)}
              />
              <TextareaField
                label="Frameworks (comma separated)"
                value={
                  formData.skills?.frameworks?.join(', ') ??
                  resumeData.skills.frameworks.join(', ')
                }
                onChange={(v) => updateSkills('frameworks', v)}
              />
              <TextareaField
                label="Infrastructure (comma separated)"
                value={
                  formData.skills?.infrastructure?.join(', ') ??
                  resumeData.skills.infrastructure.join(', ')
                }
                onChange={(v) => updateSkills('infrastructure', v)}
              />
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4">
              <Field
                label="University"
                value={formData.education?.university ?? resumeData.education.university}
                onChange={(v) => updateEducation('university', v)}
              />
              <Field
                label="Degree"
                value={formData.education?.degree ?? resumeData.education.degree}
                onChange={(v) => updateEducation('degree', v)}
              />
              <Field
                label="GPA"
                value={formData.education?.gpa ?? resumeData.education.gpa}
                onChange={(v) => updateEducation('gpa', v)}
              />
              <Field
                label="Class Of"
                value={formData.education?.classOf ?? resumeData.education.classOf}
                onChange={(v) => updateEducation('classOf', v)}
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-zinc-800">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-white hover:bg-zinc-200 rounded text-black text-xs font-bold transition-colors cursor-pointer"
            >
              [Ctrl+S] Save Overrides
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded text-zinc-300 text-xs transition-colors cursor-pointer"
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
      <label className="block text-xs font-mono text-zinc-500 mb-1">{label}</label>
      <input
        type="text"
        className="w-full bg-[#0c0d10] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 font-mono focus:border-zinc-500 focus:outline-none"
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
      <label className="block text-xs font-mono text-zinc-500 mb-1">{label}</label>
      <textarea
        className="w-full bg-[#0c0d10] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 font-mono focus:border-zinc-500 focus:outline-none"
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
