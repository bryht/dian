import * as React from 'react';
import { useDict } from '../../context';
import { ViewHeader } from '../../components/ViewHeader';
import { SectionLabel } from '../../components/SectionLabel';
import { Icon } from '../../components/Icons';

const ghostBtnStyle: React.CSSProperties = {
  fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 500,
  padding: '5px 10px', borderRadius: 5,
  border: '1px solid var(--rule)',
  color: 'var(--ink-2)',
  background: 'var(--paper-2)',
};

function csvEscape(s: string) {
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const ExportView: React.FC = () => {
  const { searchItems, languages } = useDict();
  const [selected, setSelected] = React.useState(searchItems.map(h => h.words[0]?.text || ''));
  const [fmt, setFmt] = React.useState<'csv' | 'tsv' | 'json'>('csv');
  const [done, setDone] = React.useState(false);

  const activeLangs = languages.filter(l => l.isUsed);

  const toggle = (w: string) => setSelected(s => s.includes(w) ? s.filter(x => x !== w) : [...s, w]);
  const selectAll = () => setSelected(searchItems.map(h => h.words[0]?.text || ''));
  const selectNone = () => setSelected([]);

  const buildCsv = () => {
    const headers = ['word', ...activeLangs.flatMap(c => [`${c.code}_word`, `${c.code}_pos`, `${c.code}_gloss`])];
    const rows = [headers.join(',')];
    selected.forEach(w => {
      const item = searchItems.find(h => h.words[0]?.text?.toLowerCase() === w.toLowerCase());
      const row = [csvEscape(w)];
      activeLangs.forEach(c => {
        const entry = item?.words.find(wi => wi.culture === c.code);
        row.push(csvEscape(entry?.text || ''), '', '');
      });
      rows.push(row.join(','));
    });
    return rows.join('\n');
  };

  const doExport = () => {
    const content = fmt === 'csv' ? buildCsv() : fmt === 'tsv' ? buildCsv().replace(/,/g, '\t') : JSON.stringify(searchItems, null, 2);
    const mime = fmt === 'csv' ? 'text/csv' : fmt === 'tsv' ? 'text/tab-separated-values' : 'application/json';
    const ext = fmt;
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dian-vocabulary.${ext}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div style={{ padding: '24px 40px 60px' }}>
      <ViewHeader
        title="Export"
        subtitle="Save your vocabulary for Anki, Quizlet, or any flashcard app"
        right={
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={selectNone} style={ghostBtnStyle}>None</button>
            <button onClick={selectAll} style={ghostBtnStyle}>All</button>
          </div>
        }
      />

      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24 }}>
        <div>
          <SectionLabel>Words ({selected.length} of {searchItems.length} selected)</SectionLabel>
          <div style={{
            marginTop: 10,
            border: '1px solid var(--rule)', borderRadius: 8,
            background: 'var(--paper-2)',
            maxHeight: 260, overflow: 'auto',
          }}>
            {searchItems.map((h, i) => {
              const word = h.words[0]?.text || '';
              const on = selected.includes(word);
              return (
                <label key={i} style={{
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 12,
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderBottom: i < searchItems.length - 1 ? '1px solid var(--rule)' : 'none',
                  cursor: 'pointer',
                }}>
                  <input type="checkbox" checked={on} onChange={() => toggle(word)} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)' }}>{word}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10.5, color: 'var(--ink-3)' }}>
                    {h.words.length} entries
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <SectionLabel>Format</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
            {[
              { id: 'csv' as const, label: 'CSV', note: 'Anki, Quizlet' },
              { id: 'tsv' as const, label: 'TSV', note: 'Anki (tab)' },
              { id: 'json' as const, label: 'JSON', note: 'Programmatic' },
            ].map(f => (
              <button key={f.id} onClick={() => setFmt(f.id)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px',
                background: fmt === f.id ? 'var(--paper-2)' : 'transparent',
                border: '1px solid ' + (fmt === f.id ? 'var(--rule-strong)' : 'var(--rule)'),
                borderRadius: 6,
              }}>
                <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--ink)' }}>{f.label}</span>
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-3)' }}>{f.note}</span>
              </button>
            ))}
          </div>

          <button onClick={doExport} disabled={selected.length === 0} style={{
            marginTop: 16, width: '100%',
            padding: '12px',
            background: 'var(--accent)', color: '#fff',
            borderRadius: 8, fontWeight: 600, fontSize: 14,
            opacity: selected.length === 0 ? 0.4 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {done ? <><Icon.check s={14} /> Saved</> : <><Icon.download s={14} /> Export {selected.length} words</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportView;