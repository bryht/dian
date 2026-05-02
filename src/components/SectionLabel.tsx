import React from 'react';

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600,
      color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase',
    }}>{children}</div>
  );
}