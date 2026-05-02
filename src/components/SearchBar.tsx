import React from 'react';
import { Icon } from './Icons';
import { Kbd } from './Kbd';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  inputLang: string;
  suggestions: string[];
  onPickSuggestion: (suggestion: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchBar({ value, onChange, onSubmit, inputLang, suggestions, onPickSuggestion, inputRef }: SearchBarProps) {
  const [focused, setFocused] = React.useState(false);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const showSugg = focused && suggestions.length > 0 && value.length > 0;
  const visibleSuggestions = suggestions.slice(0, 5);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!showSugg) {
      if (e.key === 'Enter') onSubmit();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % visibleSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => prev <= 0 ? visibleSuggestions.length - 1 : prev - 1);
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < visibleSuggestions.length) {
        onPickSuggestion(visibleSuggestions[highlightedIndex]);
      } else {
        onSubmit();
      }
    } else if (e.key === 'Escape') {
      setHighlightedIndex(-1);
    }
  }, [showSugg, visibleSuggestions, highlightedIndex, onPickSuggestion, onSubmit]);

  // Reset highlight when suggestions change
  React.useEffect(() => {
    setHighlightedIndex(-1);
  }, [suggestions]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 18px',
        background: 'var(--paper-2)',
        border: '1px solid var(--rule)',
        borderRadius: 10,
        boxShadow: focused ? '0 0 0 3px var(--accent-soft)' : 'none',
        transition: 'box-shadow 150ms',
      }}>
        <span style={{ color: 'var(--ink-3)', display: 'flex' }}><Icon.search s={16} /></span>
        <span style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
          color: 'var(--accent-ink)', background: 'var(--accent-soft)',
          padding: '2px 7px', borderRadius: 4,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>{inputLang}</span>
        <input
          id="word"
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={handleKeyDown}
          placeholder="Type a word or phrase…  /en /zh /fr to switch input"
          style={{
            flex: 1, fontSize: 17, fontFamily: 'var(--serif)',
            color: 'var(--ink)',
          }}
        />
        <span style={{ color: 'var(--ink-3)', fontSize: 11 }}>
          <Kbd>⌘</Kbd> <Kbd>↵</Kbd>
        </span>
      </div>
      {showSugg && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0,
          background: 'var(--paper)', border: '1px solid var(--rule)',
          borderRadius: 8, boxShadow: 'var(--shadow)',
          zIndex: 10, overflow: 'hidden',
        }}>
          {visibleSuggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => onPickSuggestion(s)}
              onMouseEnter={() => setHighlightedIndex(i)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 14px', fontSize: 14, fontFamily: 'var(--serif)',
                color: 'var(--ink)',
                background: i === highlightedIndex ? 'var(--accent-soft)' : 'transparent',
                borderBottom: i < visibleSuggestions.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}