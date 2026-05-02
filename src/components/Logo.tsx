import React from 'react';

export function DianMark({ size = 28, color = 'currentColor', accent = null }: { size?: number; color?: string; accent?: string | null }) {
  const fg = color;
  const acc = accent || color;
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
      {/* corner brackets */}
      <path d="M3 3 L3 9 M3 3 L9 3" stroke={acc} strokeWidth="1.5" fill="none" strokeLinecap="square" />
      <path d="M37 3 L37 9 M37 3 L31 3" stroke={acc} strokeWidth="1.5" fill="none" strokeLinecap="square" />
      <path d="M3 37 L3 31 M3 37 L9 37" stroke={acc} strokeWidth="1.5" fill="none" strokeLinecap="square" />
      <path d="M37 37 L37 31 M37 37 L31 37" stroke={acc} strokeWidth="1.5" fill="none" strokeLinecap="square" />
      {/* 典 character */}
      <text x="20" y="29"
        textAnchor="middle"
        fontFamily="'Noto Serif SC','Source Han Serif','Songti SC',serif"
        fontSize="22"
        fontWeight="600"
        fill={fg}>典</text>
    </svg>
  );
}

export function DianWordmark({ size = 22, color = 'currentColor', italic = true }: { size?: number; color?: string; italic?: boolean }) {
  return (
    <span style={{
      fontFamily: "var(--serif)",
      fontSize: size,
      fontWeight: 600,
      fontStyle: italic ? 'italic' : 'normal',
      color,
      letterSpacing: '-0.01em',
      lineHeight: 1,
    }}>Dian</span>
  );
}

export function DianLockup({ size = 28, gap = 10 }: { size?: number; gap?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap }}>
      <DianMark size={size} accent="var(--accent)" />
      <DianWordmark size={size * 0.78} />
    </span>
  );
}