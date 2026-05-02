import React from 'react';
import { DianLockup } from './Logo';
import { Icon } from './Icons';
import { Kbd } from './Kbd';

type ViewId = 'translate' | 'history' | 'export' | 'settings';

interface SidebarProps {
  view: ViewId;
  setView: (view: ViewId) => void;
  onSummon: () => void;
  onToggleDark: () => void;
  isDark: boolean;
}

export function Sidebar({ view, setView, onSummon, onToggleDark, isDark }: SidebarProps) {
  const items: { id: ViewId; label: string; icon: typeof Icon.search }[] = [
    { id: 'translate', label: 'Translate', icon: Icon.search },
    { id: 'history', label: 'History', icon: Icon.history },
    { id: 'export', label: 'Export', icon: Icon.download },
    { id: 'settings', label: 'Settings', icon: Icon.settings },
  ];

  return (
    <div style={{
      width: 184, flexShrink: 0,
      borderRight: '1px solid var(--rule)',
      background: 'var(--paper)',
      display: 'flex', flexDirection: 'column',
      padding: '14px 10px',
      userSelect: 'none',
    }}>
      <div style={{ padding: '4px 8px 14px' }}>
        <DianLockup size={22} gap={9} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map(it => {
          const active = view === it.id;
          return (
            <button key={it.id} onClick={() => setView(it.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '7px 10px', borderRadius: 6,
              fontSize: 13, fontWeight: 500,
              color: active ? 'var(--ink)' : 'var(--ink-2)',
              background: active ? 'var(--paper-2)' : 'transparent',
              textAlign: 'left',
              transition: 'background 120ms',
            }}>
              <span style={{ color: active ? 'var(--accent)' : 'var(--ink-3)', display: 'flex' }}>
                <it.icon s={14} />
              </span>
              {it.label}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      <button onClick={onToggleDark} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '7px 10px', borderRadius: 6,
        fontSize: 13, color: 'var(--ink-3)',
        marginBottom: 6,
      }} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <Icon.moon s={16} />
      </button>

      <button onClick={onSummon} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 10px', borderRadius: 6,
        fontSize: 12, color: 'var(--ink-3)',
        border: '1px dashed var(--rule)',
      }}>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Summon Dian</span>
        <span style={{ display: 'flex', gap: 3 }}>
          <Kbd>⌃</Kbd><Kbd>⇧</Kbd><Kbd>F</Kbd>
        </span>
      </button>
    </div>
  );
}