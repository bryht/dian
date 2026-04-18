import { describe, it, expect } from 'vitest';
import { SearchItem } from '../../src/types/SearchItem';
import { WordItem } from '../../src/types/WordItem';
import { Language, languages } from '../../src/types/Language';

describe('SearchItem', () => {
  it('has default empty words array', () => {
    const item = new SearchItem();
    expect(item.words).toEqual([]);
  });

  it('has a data timestamp', () => {
    const before = Date.now();
    const item = new SearchItem();
    const after = Date.now();
    expect(item.data).toBeGreaterThanOrEqual(before);
    expect(item.data).toBeLessThanOrEqual(after);
  });

  describe('getId', () => {
    it('concatenates word texts with dash separator', () => {
      const words = [
        { culture: 'en', text: 'hello' },
        { culture: 'nl', text: 'hallo' },
      ];
      expect(SearchItem.getId(words)).toBe('hello-hallo');
    });

    it('returns empty string for empty words', () => {
      expect(SearchItem.getId([])).toBe('');
    });

    it('returns single text for single word', () => {
      const words = [{ culture: 'en', text: 'hello' }];
      expect(SearchItem.getId(words)).toBe('hello');
    });
  });

  describe('isPhrase', () => {
    it('returns true when any word contains a space', () => {
      const words = [
        { culture: 'en', text: 'hello world' },
        { culture: 'nl', text: 'hallo wereld' },
      ];
      expect(SearchItem.isPhrase(words)).toBe(true);
    });

    it('returns false when no words contain a space', () => {
      const words = [
        { culture: 'en', text: 'hello' },
        { culture: 'nl', text: 'hallo' },
      ];
      expect(SearchItem.isPhrase(words)).toBe(false);
    });

    it('returns false for empty array', () => {
      expect(SearchItem.isPhrase([])).toBe(false);
    });
  });
});

describe('WordItem', () => {
  it('has default empty culture and text', () => {
    const item = new WordItem();
    expect(item.culture).toBe('');
    expect(item.text).toBe('');
  });
});

describe('Language', () => {
  it('has default values', () => {
    const lang = new Language();
    expect(lang.isSelected).toBe(false);
    expect(lang.isUsed).toBe(false);
    expect(lang.detailLink).toBe('');
    expect(lang.detailHideTop).toBe(0);
    expect(lang.detailHideFilters).toEqual([]);
  });
});

describe('languages array', () => {
  it('contains 11 language definitions', () => {
    expect(languages).toHaveLength(11);
  });

  it('has English as the first and selected language', () => {
    expect(languages[0].culture).toBe('en');
    expect(languages[0].isSelected).toBe(true);
    expect(languages[0].isUsed).toBe(true);
  });

  it('all languages have required fields', () => {
    for (const lang of languages) {
      expect(lang.culture).toBeTruthy();
      expect(lang.cultureFull).toBeTruthy();
      expect(lang.cultureName).toBeTruthy();
      expect(lang.detailLink).toBeTruthy();
      expect(typeof lang.detailHideTop).toBe('number');
    }
  });

  it('all detail links contain {{word}} placeholder', () => {
    for (const lang of languages) {
      expect(lang.detailLink).toContain('{{word}}');
    }
  });

  it('has exactly 3 languages with isUsed=true by default', () => {
    const used = languages.filter(l => l.isUsed);
    expect(used.length).toBe(3);
    expect(used.map(l => l.culture)).toEqual(['en', 'nl', 'zh']);
  });
});
