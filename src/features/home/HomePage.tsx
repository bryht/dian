import * as React from 'react';
import { DictProvider, useDict } from '../../context';
import { Sidebar } from '../../components/Sidebar';
import { DianMark } from '../../components/Logo';
import { Kbd } from '../../components/Kbd';
import Search from '../search/Search';
import HistoryView from '../history/HistoryView';
import ExportView from '../export/ExportView';
import Config from '../config/Config';

const HomePage: React.FC = () => {
  return (
    <DictProvider>
      <HomePageContent />
    </DictProvider>
  );
};

const HomePageContent: React.FC = () => {
  const { activeView, setActiveView, isDark, toggleDark, inputLang } = useDict();
  const [summonOpen, setSummonOpen] = React.useState(false);
  const [summonValue, setSummonValue] = React.useState('');
  const summonInputRef = React.useRef<HTMLInputElement>(null);
  const [submitFromSummon, setSubmitFromSummon] = React.useState<string | null>(null);

  // Hotkeys
  React.useEffect(() => {
    const { ipcRenderer } = window.require('electron');

    const handleInputMessage = (_event: any, message: any) => {
      if (message === 'focus') {
        const word = document.querySelector('#word') as HTMLInputElement;
        if (word) word.focus();
      }
    };

    ipcRenderer.on('input-message', handleInputMessage);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        const word = document.querySelector('#word') as HTMLInputElement;
        if (word) word.focus();
      } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setSummonOpen(true);
      } else if (e.key === 'Escape') {
        setSummonOpen(false);
      } else if (e.key === 'j' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        window.scrollTo(window.scrollX, window.scrollY + 20);
      } else if (e.key === 'k' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT') {
        window.scrollTo(window.scrollX, window.scrollY - 20);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      ipcRenderer.removeListener('input-message', handleInputMessage);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    if (summonOpen && summonInputRef.current) {
      summonInputRef.current.focus();
    }
  }, [summonOpen]);

  const handleSummonSubmit = (word: string) => {
    setSummonOpen(false);
    setSummonValue('');
    setSubmitFromSummon(word);
    setActiveView('translate');
  };

  const handleSummonConsumed = React.useCallback(() => {
    setSubmitFromSummon(null);
  }, []);

  return (
    <div className={isDark ? 'dian-dark' : 'dian-light'} style={{
      height: '100vh', display: 'flex',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: 'var(--sans)',
    }}>
      <Sidebar
        view={activeView}
        setView={setActiveView}
        onSummon={() => setSummonOpen(true)}
        onToggleDark={toggleDark}
        isDark={isDark}
      />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          {activeView === 'translate' && <Search submitFromSummon={submitFromSummon} onSummonConsumed={handleSummonConsumed} />}
          {activeView === 'history' && <HistoryView />}
          {activeView === 'export' && <ExportView />}
          {activeView === 'settings' && <Config />}
        </div>

        {summonOpen && (
          <div onClick={() => setSummonOpen(false)} style={{
            position: 'absolute', inset: 0, zIndex: 50,
            background: 'rgba(20,17,13,0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 80,
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              width: 'min(560px, 80%)',
              background: 'var(--paper)',
              border: '1px solid var(--rule-strong)',
              borderRadius: 14,
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '18px 20px',
                borderBottom: '1px solid var(--rule)',
              }}>
                <DianMark size={26} accent="var(--accent)" />
                <input
                  ref={summonInputRef}
                  value={summonValue}
                  onChange={e => setSummonValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleSummonSubmit(summonValue);
                    if (e.key === 'Escape') setSummonOpen(false);
                  }}
                  placeholder="Look up anything…"
                  style={{
                    flex: 1,
                    fontFamily: 'var(--serif)', fontSize: 22,
                    color: 'var(--ink)',
                  }}
                />
                <Kbd>Esc</Kbd>
              </div>
              <SummonRecent onSelect={handleSummonSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function SummonRecent({ onSelect }: { onSelect: (word: string) => void }) {
  const { searchItems } = useDict();
  const recent = searchItems.slice(0, 4);

  return (
    <div style={{ padding: '12px 20px 18px' }}>
      <div style={{
        fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600,
        color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase',
        marginBottom: 8,
      }}>Recent</div>
      {recent.map((item, i) => {
        const word = item.words[0]?.text || '';
        return (
          <button key={i} onClick={() => onSelect(word)} style={{
            display: 'flex', justifyContent: 'space-between', width: '100%',
            padding: '8px 4px', textAlign: 'left',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 15, color: 'var(--ink)' }}>{word}</span>
            <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-3)' }}>↵</span>
          </button>
        );
      })}
    </div>
  );
}

export default HomePage;