import React from 'react';

export function ViewHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      paddingBottom: 14, borderBottom: '1px solid var(--rule)',
    }}>
      <div>
        <h2 style={{
          fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 26,
          margin: 0, color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>{title}</h2>
        {subtitle && (
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--ink-3)', marginTop: 4,
          }}>{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  );
}