import * as React from 'react';
import { useDict } from '../../context';
import { ViewHeader } from '../../components/ViewHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { Icon } from '../../components/Icons';

const Config: React.FC = () => {
  const { languages, updateLanguages, loadLanguages } = useDict();

  const toggleLang = React.useCallback((code: string) => {
    const updated = languages.map(l =>
      l.code === code ? { ...l, isUsed: !l.isUsed } : l
    );
    // Ensure at least 2 languages remain active
    const activeCount = updated.filter(l => l.isUsed).length;
    if (activeCount < 2) {
      alert('Please select at least 2 languages.');
      return;
    }
    updateLanguages(updated);
  }, [languages, updateLanguages]);

  const handleDetailLinkChange = React.useCallback((code: string, value: string) => {
    const updated = languages.map(l =>
      l.code === code ? { ...l, detailLink: value } : l
    );
    updateLanguages(updated);
  }, [languages, updateLanguages]);

  const activeLangs = languages.filter(l => l.isUsed);

  return (
    <div style={{ padding: '24px 40px 60px' }}>
      <ViewHeader title="Settings" subtitle="Languages and detail links" />

      <div style={{ marginTop: 24 }}>
        <SectionLabel>Configured languages</SectionLabel>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8,
          marginTop: 10,
        }}>
          {languages.map(l => {
            const on = l.isUsed;
            return (
              <button key={l.code} onClick={() => toggleLang(l.code)} style={{
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12,
                alignItems: 'center',
                padding: '10px 12px', borderRadius: 8,
                background: on ? 'var(--paper-2)' : 'transparent',
                border: '1px solid ' + (on ? 'var(--rule-strong)' : 'var(--rule)'),
                textAlign: 'left',
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 4,
                  border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--rule-strong)'),
                  background: on ? 'var(--accent)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white',
                }}>
                  {on && <Icon.check s={11} />}
                </span>
                <span>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)' }}>{l.name}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)' }}>{l.native}</div>
                </span>
                <span style={{
                  fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600,
                  color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{l.code}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>Detail links</SectionLabel>
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4, marginBottom: 12,
        }}>
          Use <code style={{ fontFamily: 'var(--mono)', fontSize: 11.5, background: 'var(--paper-2)', padding: '1px 5px', borderRadius: 3 }}>{'{word}'}</code> as a placeholder. Click any word's link icon to open in a browser.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activeLangs.map(l => (
            <div key={l.code} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr',
              alignItems: 'center', gap: 10,
              padding: '8px 12px',
              background: 'var(--paper-2)',
              border: '1px solid var(--rule)',
              borderRadius: 8,
            }}>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--ink)' }}>{l.name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--ink-3)' }}>{l.code}</div>
              </div>
              <input
                value={l.detailLink}
                onChange={e => handleDetailLinkChange(l.code, e.target.value)}
                placeholder="https://example.com/?q={word}"
                style={{
                  fontFamily: 'var(--mono)', fontSize: 12,
                  color: 'var(--ink-2)',
                  padding: '6px 10px',
                  background: 'var(--paper)',
                  border: '1px solid var(--rule)',
                  borderRadius: 6,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 32 }}>
        <SectionLabel>About</SectionLabel>
        <div style={{
          marginTop: 10, padding: '14px 16px',
          background: 'var(--paper-2)', borderRadius: 8,
          border: '1px solid var(--rule)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 14 }}>Dian v0.7.6</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)' }}>
              Free & open source · MIT
            </div>
          </div>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>github.com/bryht/dian</span>
        </div>
      </div>
    </div>
  );
};

export default Config;