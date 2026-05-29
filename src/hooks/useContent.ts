'use client';

import { useMemo } from 'react';
import { resumeData as baseData } from '@/data/resumeData';

const STORAGE_KEY = 'resume-content-overrides';

export type ContentOverrides = Partial<typeof baseData>;

export function useContent() {
  const merged = useMemo(() => {
    if (typeof window === 'undefined') return baseData;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return baseData;
      const overrides: ContentOverrides = JSON.parse(raw);
      return deepMerge(baseData, overrides);
    } catch {
      return baseData;
    }
  }, []);

  return merged;
}

export function saveContentOverrides(overrides: ContentOverrides) {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const current = existing ? JSON.parse(existing) : {};
    const merged = deepMerge(current, overrides);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch (err) {
    console.error('Failed to save content:', err);
  }
}

export function resetContentOverrides() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const val = source[key];
    if (val !== undefined) {
      if (isObject(val) && isObject(target[key])) {
        result[key] = deepMerge(target[key] as Record<string, unknown>, val as Record<string, unknown>) as T[keyof T];
      } else {
        result[key] = val as T[keyof T];
      }
    }
  }
  return result;
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}
