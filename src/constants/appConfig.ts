/**
 * Application Constants
 * Centralized configuration for the entire application
 */

// ==================== API Configuration ====================
export const API_CONFIG = {
  // GitHub Contributions API
  GITHUB_CONTRIBUTIONS_API: 'https://github-contributions-api.jogruber.de/v4',
  GITHUB_API_TIMEOUT: 15000, // 15 seconds
  GITHUB_API_RETRIES: 3,
  GITHUB_API_RETRY_DELAY: 1000, // 1 second

  // Internal API
  INTERNAL_API_TIMEOUT: 10000, // 10 seconds
  INTERNAL_API_RETRIES: 2,
  
  // Cache settings
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  CONTRIBUTION_CACHE_DURATION: 60 * 60 * 1000, // 1 hour
};

// ==================== GitHub Configuration ====================
export const GITHUB_CONFIG = {
  DEFAULT_USERNAME: 'narcisoJavier',
  CONTRIBUTIONS_DAYS_BACK: 364, // 1 year
  MAX_REPOS_PER_PAGE: 30,
};

// ==================== Animation Configuration ====================
export const ANIMATION_CONFIG = {
  SPRING_STIFFNESS: 400,
  SPRING_DAMPING: 60,
  SPRING_MASS: 1,
  
  TRANSITION_FAST: 0.2,
  TRANSITION_NORMAL: 0.3,
  TRANSITION_SLOW: 0.5,
  
  STAGGER_DELAY: 0.1,
};

// ==================== Color Configuration ====================
export const COLOR_CONFIG = {
  // Primary colors
  PRIMARY: '#ffffff', // pure white
  PRIMARY_DARK: '#a1a1aa',
  PRIMARY_LIGHT: '#f4f4f5',
  
  // Background colors
  BACKGROUND: '#09090b', // carbon black
  BACKGROUND_SECONDARY: '#18181b', // dark zinc
  BACKGROUND_TERTIARY: '#27272a', // zinc border
  
  // Text colors
  TEXT_PRIMARY: '#f5f5f5', // neutral-100
  TEXT_SECONDARY: '#a1a1a1', // neutral-400
  TEXT_TERTIARY: '#71717a', // neutral-500
  
  // Status colors
  SUCCESS: '#ffffff',
  WARNING: '#d4d4d8',
  ERROR: '#f43f5e',
  INFO: '#a1a1aa',
  
  // Accent colors
  ACCENT_CYAN: '#d4d4d8',
  ACCENT_GREEN: '#ffffff',
  ACCENT_YELLOW: '#a1a1aa',
  ACCENT_RED: '#f43f5e',
};

// ==================== Local Storage Keys ====================
export const STORAGE_KEYS = {
  // User preferences
  THEME: 'theme_preference',
  
  // WebMCP Inquiries
  WEBMCP_INQUIRIES: 'webmcp-inquiries',
  
  // Content Overrides
  CONTENT_OVERRIDES: 'resume-content-overrides',
  
  // Cache
  GITHUB_CONTRIBUTIONS_CACHE: 'github_contributions_cache',
  GITHUB_STATS_CACHE: 'github_stats_cache',
};

// ==================== Validation Rules ====================
export const VALIDATION_RULES = {
  // Email
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EMAIL_MIN_LENGTH: 5,
  EMAIL_MAX_LENGTH: 254,
  
  // Username
  USERNAME_MIN_LENGTH: 1,
  USERNAME_MAX_LENGTH: 39,
  USERNAME_REGEX: /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i,
  
  // URL
  URL_REGEX: /^https?:\/\/.+/i,
  
  // Password (if ever needed)
  PASSWORD_MIN_LENGTH: 8,
};

// ==================== Notification Settings ====================
export const NOTIFICATION_CONFIG = {
  TOAST_DURATION: 5000, // 5 seconds
  TOAST_POSITION: 'bottom-right' as const,
  DEFAULT_Z_INDEX: 9999,
};

// ==================== Breakpoints ====================
export const BREAKPOINTS = {
  MOBILE: 640, // sm
  TABLET: 768, // md
  DESKTOP: 1024, // lg
  WIDE: 1280, // xl
  ULTRA_WIDE: 1536, // 2xl
};

// ==================== Spacing ====================
export const SPACING = {
  XS: '0.25rem', // 4px
  SM: '0.5rem', // 8px
  MD: '1rem', // 16px
  LG: '1.5rem', // 24px
  XL: '2rem', // 32px
  '2XL': '3rem', // 48px
  '3XL': '4rem', // 64px
};

// ==================== Font Sizes ====================
export const FONT_SIZES = {
  XS: '0.75rem', // 12px
  SM: '0.875rem', // 14px
  BASE: '1rem', // 16px
  LG: '1.125rem', // 18px
  XL: '1.25rem', // 20px
  '2XL': '1.5rem', // 24px
  '3XL': '1.875rem', // 30px
  '4XL': '2.25rem', // 36px
};

// ==================== Z-Index Scale ====================
export const Z_INDEX = {
  HIDDEN: -1,
  BASE: 0,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
};

// ==================== Development Configuration ====================
export const DEV_CONFIG = {
  DEBUG: process.env.NODE_ENV === 'development',
  LOG_API_CALLS: false,
  LOG_COMPONENT_RENDERS: false,
  MOCK_API: false,
};

// ==================== Feature Flags ====================
export const FEATURES = {
  WEBMCP_ENABLED: true,
  CHATBOT_ENABLED: true,
  GITHUB_INTEGRATION_ENABLED: true,
};

const appConfig = {
  API_CONFIG,
  GITHUB_CONFIG,
  ANIMATION_CONFIG,
  COLOR_CONFIG,
  STORAGE_KEYS,
  VALIDATION_RULES,
  NOTIFICATION_CONFIG,
  BREAKPOINTS,
  SPACING,
  FONT_SIZES,
  Z_INDEX,
  DEV_CONFIG,
  FEATURES,
};

export default appConfig;
