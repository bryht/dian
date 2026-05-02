import React from 'react';
import { Icon } from './Icons';

interface TranslationCardProps {
  lang: { code: string; name: string; native: string };
  entry: { word: string; ipa?: string; pos?: string; gloss?: string; example?: string } | null;
  onSpeak: () => void;
  onLink: () => void;
  loading?: boolean;
}

export const iconBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 6,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--ink-3)',
  border: '1px solid var(--rule)',
  background: 'var(--paper-2)',
};

export function TranslationCard({ lang, entry, onSpeak, onLink, loading }: TranslationCardProps) {
  return (
    <div style={{
      borderTop: '1px solid var(--rule)',
      padding: '20px 0',
      display: 'grid', gridTemplateColumns: '88px 1fr auto', gap: 18,
      alignItems: 'start',
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600,
          color: 'var(--accent-ink)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>{lang.code}</div>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 12, color: 'var(--ink-3)', marginTop: 3,
        }}>{lang.native}</div>
      </div>
      <div style={{ minWidth: 0 }}>
        {loading ? (
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--ink-3)',
          }}>translating…</div>
        ) : entry ? (
          <>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
            }}>
              <span style={{
                fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 22,
                color: 'var(--ink)', letterSpacing: '-0.01em',
              }}>{entry.word}</span>
              {entry.ipa && (
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-3)',
                }}>{entry.ipa}</span>
              )}
              {entry.pos && (
                <span style={{
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 12, color: 'var(--ink-3)',
                }}>{entry.pos}</span>
              )}
            </div>
            {entry.gloss && (
              <div style={{
                fontFamily: 'var(--serif)', fontSize: 14.5, lineHeight: 1.55,
                color: 'var(--ink-2)', marginTop: 6,
                textWrap: 'pretty',
              }}>{entry.gloss}</div>
            )}
            {entry.example && (
              <div style={{
                fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 13, color: 'var(--ink-3)', marginTop: 6,
                paddingLeft: 10, borderLeft: '2px solid var(--accent-soft)',
                textWrap: 'pretty',
              }}>"{entry.example}"</div>
            )}
          </>
        ) : (
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 14, color: 'var(--ink-3)',
          }}>—</div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button title="Pronounce" onClick={onSpeak} style={iconBtnStyle}><Icon.speaker s={13} /></button>
        <button title="Open detail link" onClick={onLink} style={iconBtnStyle}><Icon.link s={13} /></button>
      </div>
    </div>
  );
}