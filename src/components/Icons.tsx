import React from 'react';

type IconProps = { s?: number };

export const Icon = {
  search: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  history: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 4v4l2.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M3 8a5 5 0 1 0 1.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/><path d="M3 3v2.5h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  settings: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  download: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 2v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 13h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>,
  speaker: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 6v4h2.5L9 13V3L5.5 6H3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" fill="none"/><path d="M11 5.5c1 .8 1 4.2 0 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none"/></svg>,
  link: ({ s = 12 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M9 7l-2 2M6.5 4.5L8 3a2.5 2.5 0 0 1 3.5 3.5L10 8M9.5 11.5L8 13a2.5 2.5 0 0 1-3.5-3.5L6 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
  plus: ({ s = 12 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  x: ({ s = 12 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  check: ({ s = 12 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  chevron: ({ s = 10 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M5 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  moon: ({ s = 14 }: IconProps = {}) => <svg width={s} height={s} viewBox="0 0 16 16" fill="none"><path d="M14 9.5A6 6 0 0 1 6.5 2 6 6 0 1 0 14 9.5z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};