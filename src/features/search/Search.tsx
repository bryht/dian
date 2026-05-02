import * as React from 'react';
import { Language, SearchItem } from '../../types';
import { SearchBar } from '../../components/SearchBar';
import { TranslationCard } from '../../components/TranslationCard';
import { Kbd } from '../../components/Kbd';
import { DianLockup } from '../../components/Logo';
import { translateWord, getCulture } from '../../services';
import { loadWordsAsync } from '../../services';
import { useDict } from '../../context';

interface SearchProps {
  submitFromSummon: string | null;
  onSummonConsumed: () => void;
}

const Search: React.FC<SearchProps> = ({ submitFromSummon, onSummonConsumed }) => {
  const { searchItems, languages: contextLanguages, updateSearchItems, inputLang, setInputLang } = useDict();
  const allLanguages = React.useMemo(() => contextLanguages.filter((p: Language) => p.isUsed), [contextLanguages]);
  const langByCode = React.useMemo(() => Object.fromEntries(contextLanguages.map(l => [l.code, l])), [contextLanguages]);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState('');
  const [lastSubmitted, setLastSubmitted] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [options, setOptions] = React.useState<string[]>([]);

  // Detect /xx prefix for inline language switching
  const liveInputLang = React.useMemo(() => {
    const m = query.match(/^\/(\w{2,3})\s/);
    if (m && langByCode[m[1]]) return m[1];
    return inputLang;
  }, [query, inputLang, langByCode]);

  const cleanedQuery = query.replace(/^\/\w{2,3}\s/, '');

  // Handle submit
  const submit = React.useCallback(async (rawWord?: string) => {
    const w = (rawWord ?? cleanedQuery).trim();
    if (!w) return;
    setLastSubmitted(w);

    let searchItem = new SearchItem();
    for (const element of allLanguages) {
      if (element.code === liveInputLang) {
        searchItem.words.push({ culture: element.code, text: w });
      } else {
        const value = await translateWord(liveInputLang, element.code, w);
        searchItem.words.push({ culture: element.code, text: value.toLowerCase() });
      }
    }

    // Play sound
    try {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('play-audio', { culture: liveInputLang, value: w });
    } catch (e) { /* ignore in browser */ }

    // Update history
    const updatedSearchItems = [...searchItems];
    const itemIndex = updatedSearchItems.findIndex(x => SearchItem.getId(x.words) === SearchItem.getId(searchItem.words));
    if (itemIndex > -1) {
      updatedSearchItems.splice(itemIndex, 1);
    }
    updatedSearchItems.unshift(searchItem);
    await updateSearchItems(updatedSearchItems);

    // Update input lang if switched
    if (liveInputLang !== inputLang) {
      setInputLang(liveInputLang);
    }
    setQuery('');
    setOptions([]);
  }, [cleanedQuery, liveInputLang, allLanguages, searchItems, updateSearchItems, inputLang, setInputLang]);

  // Handle submit from summon overlay
  React.useEffect(() => {
    if (submitFromSummon) {
      setLastSubmitted(submitFromSummon);
      submit(submitFromSummon);
      onSummonConsumed();
    }
  }, [submitFromSummon, submit, onSummonConsumed]);

  // Autocomplete suggestions
  React.useEffect(() => {
    if (!cleanedQuery) {
      setOptions([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const newOptions = await loadWordsAsync(liveInputLang, cleanedQuery, 6);
      if (!cancelled) setOptions(newOptions ?? []);
    })();
    return () => { cancelled = true; };
  }, [cleanedQuery, liveInputLang]);

  const onPickSuggestion = React.useCallback((s: string) => {
    setQuery(s);
    setTimeout(() => submit(s), 30);
  }, [submit]);

  const speak = React.useCallback((text: string, code: string) => {
    try {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.send('play-audio', { culture: code, value: text });
    } catch (e) { /* ignore */ }
  }, []);

  const openLink = React.useCallback((code: string) => {
    const lang = contextLanguages.find(l => l.code === code);
    if (!lang?.detailLink) return;
    const cacheEntry = searchItems.find(item =>
      item.words.some(w => w.culture === lastSubmitted.split(' ')[0] && w.text.toLowerCase() === lastSubmitted.toLowerCase())
    );
    const word = cacheEntry?.words.find(w => w.culture === code)?.text || lastSubmitted;
    const url = lang.detailLink.replace('{word}', encodeURIComponent(word));
    try {
      const { ipcRenderer } = window.require('electron');
      ipcRenderer.invoke('open-external-url', url);
    } catch (e) {
      window.open(url, '_blank');
    }
  }, [contextLanguages, lastSubmitted, searchItems]);

  // Empty state
  if (!lastSubmitted) {
    return (
      <div style={{ padding: '48px 56px 0' }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => submit()}
          inputLang={liveInputLang}
          suggestions={options}
          onPickSuggestion={onPickSuggestion}
          inputRef={inputRef}
        />
        <EmptyState onTryWord={(w) => { setLastSubmitted(w); submit(w); }} />
      </div>
    );
  }

  // Find the current search result
  const currentResult = searchItems.find(item =>
    item.words[0]?.text.toLowerCase() === lastSubmitted.toLowerCase()
  ) || searchItems[0];

  return (
    <div style={{ padding: '0 40px 60px' }}>
      <div style={{ padding: '24px 40px 0' }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => submit()}
          inputLang={liveInputLang}
          suggestions={options}
          onPickSuggestion={onPickSuggestion}
          inputRef={inputRef}
        />
      </div>
      <div style={{ marginTop: 24 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 12, color: 'var(--ink-3)',
          }}>
            translating <span style={{ color: 'var(--ink-2)', fontStyle: 'normal' }}>{lastSubmitted}</span> into {allLanguages.length} languages
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', display: 'flex', gap: 6, alignItems: 'center' }}>
            <Kbd>J</Kbd> <Kbd>K</Kbd> to scroll
          </div>
        </div>
        {currentResult && currentResult.words.map(wordItem => {
          const lang = langByCode[wordItem.culture];
          if (!lang) return null;
          return (
            <TranslationCard
              key={wordItem.culture}
              lang={{ code: lang.code, name: lang.name, native: lang.native }}
              entry={{ word: wordItem.text }}
              onSpeak={() => speak(wordItem.text, wordItem.culture)}
              onLink={() => openLink(wordItem.culture)}
              loading={loading}
            />
          );
        })}
        <div style={{ borderTop: '1px solid var(--rule)' }} />
      </div>
    </div>
  );
};

function EmptyState({ onTryWord }: { onTryWord: (word: string) => void }) {
  return (
    <div style={{
      maxWidth: 560, margin: '40px auto 0', textAlign: 'left',
    }}>
      <div style={{
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'var(--ink-3)', marginBottom: 12,
      }}>welcome to dian</div>
      <h1 style={{
        fontFamily: 'var(--serif)', fontWeight: 600,
        fontSize: 38, lineHeight: 1.1, letterSpacing: '-0.02em',
        margin: 0, color: 'var(--ink)',
        textWrap: 'balance',
      }}>
        Your words, <em style={{ color: 'var(--accent)' }}>beautifully</em> translated.
      </h1>
      <p style={{
        fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.6,
        color: 'var(--ink-2)', marginTop: 14, textWrap: 'pretty',
      }}>
        Type any word above. Dian translates it into all your configured languages
        at once. Press <Kbd>⌘</Kbd><span style={{ margin: '0 4px' }} /> <Kbd>F</Kbd> to focus search;
        prefix with <Kbd mono>/zh</Kbd>, <Kbd mono>/fr</Kbd>, <Kbd mono>/ja</Kbd> to switch input language.
      </p>
      <div style={{
        marginTop: 28,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {['serendipity', 'wander', 'good morning', 'ephemeral'].map(w => (
          <button key={w} onClick={() => onTryWord(w)} style={{
            textAlign: 'left',
            padding: '12px 14px',
            background: 'var(--paper-2)',
            border: '1px solid var(--rule)',
            borderRadius: 8,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--ink)' }}>{w}</span>
            <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>try →</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default Search;