import type { CSSProperties } from 'react';

/**
 * Shared design tokens and UI helpers for the web portal.
 * Keeps styling consistent, clean, and modular across admin and customer pages.
 */

export const T = {
  // Page backgrounds
  pageBg:    '#f3f4f8',
  pageBgAlt: '#0f1117',

  // Dark header / sidebar
  dark:      '#1a1c2b',
  darkAlt:   '#21243a',
  darkBd:    '#2e3250',

  // Surfaces (cards, panels)
  white:     '#ffffff',
  surface:   '#f8f9fc',
  border:    '#e4e6f0',
  borderDark:'#2e3250',

  // Typography
  heading:   '#0f1023',
  body:      '#4a4d6b',
  muted:     '#8e92b0',
  dim:       '#b0b4cc',

  // Brand accent: green (money, CTA, success)
  green:     '#22c55e',
  greenDark: '#16a34a',
  greenBg:   '#f0fdf4',
  greenBd:   '#bbf7d0',

  // Status palette
  blue:      '#3b82f6',
  blueBg:    '#eff6ff',
  blueBd:    '#bfdbfe',
  amber:     '#f59e0b',
  amberBg:   '#fffbeb',
  amberBd:   '#fde68a',
  red:       '#ef4444',
  redBg:     '#fef2f2',
  redBd:     '#fecaca',
  purple:    '#8b5cf6',
  purpleBg:  '#ede9fe',
  purpleBd:  '#ddd6fe',
} as const;

/** Reusable input/select/textarea style. */
export const inputStyle: CSSProperties = {
  width:        '100%',
  padding:      '10px 14px',
  border:       `1px solid ${T.border}`,
  borderRadius: 8,
  fontSize:     13,
  color:        T.heading,
  background:   T.white,
  outline:      'none',
  fontFamily:   "'Plus Jakarta Sans', system-ui, sans-serif",
  boxSizing:    'border-box',
  transition:   'border-color 0.15s, box-shadow 0.15s',
};

/** Primary CTA button style (dark). */
export function btnPrimary(disabled = false): CSSProperties {
  return {
    background:     T.dark,
    color:          '#fff',
    border:         'none',
    borderRadius:   8,
    padding:        '11px 18px',
    fontSize:       13,
    fontWeight:     700,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.7 : 1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
    transition:     'opacity 0.15s, background-color 0.15s',
  };
}

/** Accent / Action button style (brand green). */
export function btnAccent(disabled = false): CSSProperties {
  return {
    background:     T.green,
    color:          '#0f172a',
    border:         'none',
    borderRadius:   8,
    padding:        '11px 18px',
    fontSize:       13,
    fontWeight:     700,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.75 : 1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
    transition:     'opacity 0.15s, filter 0.15s',
  };
}

/** Secondary / outline button style. */
export function btnSecondary(disabled = false): CSSProperties {
  return {
    background:     T.white,
    color:          T.body,
    border:         `1px solid ${T.border}`,
    borderRadius:   8,
    padding:        '10px 16px',
    fontSize:       13,
    fontWeight:     600,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.6 : 1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
    transition:     'background 0.15s, border-color 0.15s',
  };
}

/** Danger button style (red). */
export function btnDanger(disabled = false): CSSProperties {
  return {
    background:     T.red,
    color:          '#fff',
    border:         'none',
    borderRadius:   8,
    padding:        '10px 16px',
    fontSize:       13,
    fontWeight:     700,
    cursor:         disabled ? 'not-allowed' : 'pointer',
    opacity:        disabled ? 0.75 : 1,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    fontFamily:     "'Plus Jakarta Sans', system-ui, sans-serif",
  };
}

/** Standard white card style. */
export const cardStyle: CSSProperties = {
  background:   T.white,
  border:       `1px solid ${T.border}`,
  borderRadius: 14,
  padding:      '22px 24px',
  boxShadow:    '0 1px 4px rgba(0,0,0,0.04)',
};

/** Error alert box. */
export const errorBoxStyle: CSSProperties = {
  background:   T.redBg,
  border:       `1px solid ${T.redBd}`,
  borderRadius: 8,
  padding:      '10px 14px',
  fontSize:     13,
  color:        '#dc2626',
  display:      'flex',
  alignItems:   'center',
  gap:          7,
};

/** Warning alert box. */
export const warningBoxStyle: CSSProperties = {
  background:   T.amberBg,
  border:       `1px solid ${T.amberBd}`,
  borderRadius: 8,
  padding:      '12px 14px',
  fontSize:     13,
  color:        '#854d0e',
  lineHeight:   1.6,
};

/** Success alert box. */
export const successBoxStyle: CSSProperties = {
  background:   T.greenBg,
  border:       `1px solid ${T.greenBd}`,
  borderRadius: 8,
  padding:      '10px 14px',
  fontSize:     13,
  color:        '#15803d',
  display:      'flex',
  alignItems:   'center',
  gap:          7,
};

/** Currency formatter (IDR). */
export function fmtCurrency(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(n);
}

/** Date formatter (Indonesian locale). */
export function fmtDate(s?: string): string {
  if (!s) return '-';
  try {
    return new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(s));
  } catch {
    return s;
  }
}

/** Copy text to clipboard helper. */
export function copyText(text: string): Promise<void> {
  if (navigator?.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return Promise.reject(new Error('Clipboard API unavailable'));
}

/** Payment status badge config. */
export const statusBadgeConfig = {
  paid:      { bg: '#dcfce7', color: '#15803d', label: 'Lunas' },
  pending:   { bg: '#fef9c3', color: '#854d0e', label: 'Menunggu' },
  cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Dibatalkan' },
} as const;
