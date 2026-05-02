import { describe, it, expect } from 'vitest';
import { SearchItem } from '../../src/types/SearchItem';
import { WordItem } from '../../src/types/WordItem';
import { languages } from '../../src/types/Language';

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

describe('languages array', () => {
  it('contains 14 language definitions', () => {
    expect(languages).toHaveLength(14);
  });

  it('has English as the first language with isUsed=true', () => {
    expect(languages[0].code).toBe('en');
    expect(languages[0].isUsed).toBe(true);
  });

  it('all languages have required fields', () => {
    for (const lang of languages) {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.native).toBeTruthy();
      expect(lang.detailLink).toBeTruthy();
    }
  });

  it('all detail links contain {word} placeholder', () => {
    for (const lang of languages) {
      expect(lang.detailLink).toContain('{word}');
    }
  });
});