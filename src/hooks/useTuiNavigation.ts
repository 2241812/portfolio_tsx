"use client";
import { useState, useEffect, useCallback } from 'react';

export type TuiSectionId =
  | 'overview'
  | 'projects'
  | 'skills'
  | 'github'
  | 'gists'
  | 'contact'
  | 'chat';

export interface NavItem {
  id: TuiSectionId;
  key: string;
  num: string;
  label: string;
  desc: string;
  badge?: string;
}

export const TUI_NAV_ITEMS: NavItem[] = [
  { id: 'overview', key: '1', num: '01', label: 'Overview', desc: 'System & Profile' },
  { id: 'projects', key: '2', num: '02', label: 'Top Projects', desc: 'Featured Architecture', badge: '★ TOP 3' },
  { id: 'skills', key: '3', num: '03', label: 'Skills Matrix', desc: 'Verified Stack & Inspector' },
  { id: 'github', key: '4', num: '04', label: 'GitHub & Activity', desc: 'Telemetry & Block Game' },
  { id: 'gists', key: '5', num: '05', label: 'Logs & Notes', desc: 'Gist Documentation' },
  { id: 'contact', key: '6', num: '06', label: 'Contact Shell', desc: 'SSH & Protocols' },
];

export function useTuiNavigation() {
  const [activeSection, setActiveSection] = useState<TuiSectionId>('overview');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navigateToSection = useCallback((id: TuiSectionId) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const topBarOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topBarOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const nextSection = useCallback(() => {
    const currentIndex = TUI_NAV_ITEMS.findIndex((item) => item.id === activeSection);
    const nextIndex = (currentIndex + 1) % TUI_NAV_ITEMS.length;
    navigateToSection(TUI_NAV_ITEMS[nextIndex].id);
  }, [activeSection, navigateToSection]);

  const prevSection = useCallback(() => {
    const currentIndex = TUI_NAV_ITEMS.findIndex((item) => item.id === activeSection);
    const prevIndex = (currentIndex - 1 + TUI_NAV_ITEMS.length) % TUI_NAV_ITEMS.length;
    navigateToSection(TUI_NAV_ITEMS[prevIndex].id);
  }, [activeSection, navigateToSection]);

  // Global key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        if (e.key === 'Escape') {
          target.blur();
          setIsCommandOpen(false);
          setIsHelpOpen(false);
        }
        return;
      }

      if (e.key === ':' || e.key === '/') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        setIsHelpOpen(false);
        return;
      }

      if (e.key === '?' || (e.shiftKey && e.key === '?')) {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
        setIsCommandOpen(false);
        return;
      }

      if (e.key === 'Escape') {
        setIsCommandOpen(false);
        setIsHelpOpen(false);
        return;
      }

      if (isCommandOpen || isHelpOpen) return;

      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextSection();
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSection();
      } else if (e.key >= '1' && e.key <= '6') {
        const item = TUI_NAV_ITEMS.find((nav) => nav.key === e.key);
        if (item) {
          e.preventDefault();
          navigateToSection(item.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, isCommandOpen, isHelpOpen, nextSection, prevSection, navigateToSection]);

  // Sync active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (const item of TUI_NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          const elemTop = top + window.pageYOffset;
          const elemBottom = bottom + window.pageYOffset;
          if (scrollPosition >= elemTop && scrollPosition < elemBottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    activeSection,
    setActiveSection: navigateToSection,
    nextSection,
    prevSection,
    isCommandOpen,
    setIsCommandOpen,
    isHelpOpen,
    setIsHelpOpen,
  };
}
