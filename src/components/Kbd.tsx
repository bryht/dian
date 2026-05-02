import React from 'react';

export function Kbd({ children, mono = true }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <kbd style={{
      fontFamily: mono ? 'var(--mono)' : 'var(--sans)',
      fontSize: 10.5,
      fontWeight: 500,
      padding: '2px 6px',
      borderRadius: 4,
      background: 'var(--paper-2)',
      border: '1px solid var(--rule)',
      color: 'var(--ink-2)',
      lineHeight: 1.4,
    }}>{children}</kbd>
  );
}