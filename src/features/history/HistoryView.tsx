import * as React from 'react';
import { useDict } from '../../context';
import { ViewHeader } from '../../components/ViewHeader';

function timeAgo(ts: number) {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const HistoryView: React.FC = () => {
  const { searchItems, setActiveView } = useDict();

  const grouped = React.useMemo(() => {
    const byDay: Record<string, typeof searchItems> = {};
    searchItems.forEach(h => {
      const d = new Date(h.data);
      const key = d.toDateString();
      (byDay[key] = byDay[key] || []).push(h);
    });
    return byDay;
  }, [searchItems]);

  const handlePick = React.useCallback((word: string) => {
    setActiveView('translate');
    // The search component will handle this via a custom event
    const ev = new CustomEvent('dian:searchword', { detail: word });
    window.dispatchEvent(ev);
  }, [setActiveView]);

  return (
    <div style={{ padding: '24px 40px' }}>
      <ViewHeader title="History" subtitle={`${searchItems.length} words saved`} />
      <div style={{ marginTop: 18 }}>
        {Object.entries(grouped).map(([day, items]) => (
          <div key={day} style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 10.5, fontWeight: 600,
              color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 8, paddingBottom: 6, borderBottom: '1px solid var(--rule)',
            }}>{day}</div>
            {items.map((h, i) => {
              const word = h.words[0]?.text || '';
              return (
                <button key={i} onClick={() => handlePick(word)} style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14,
                  width: '100%', padding: '10px 4px',
                  borderBottom: '1px solid var(--rule)',
                  textAlign: 'left',
                }}>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ink)' }}>{word}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-3)' }}>
                    {h.words.length} langs
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>
                    {timeAgo(h.data)}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;