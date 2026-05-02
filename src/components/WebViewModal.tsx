import React from 'react';

interface WebViewModalProps {
  url: string | null;
  onClose: () => void;
}

export function WebViewModal({ url, onClose }: WebViewModalProps) {
  if (!url) return null;

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20,17,13,0.55)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(800px, 90vw)',
        height: 'min(600px, 80vh)',
        background: 'var(--paper)',
        border: '1px solid var(--rule-strong)',
        borderRadius: 14,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--rule)',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600,
            color: 'var(--ink-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 40px)',
          }}>{url}</span>
          <button onClick={onClose} style={{
            background: 'var(--paper-2)', border: '1px solid var(--rule)',
            borderRadius: 6, padding: '4px 10px', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
          }}>Esc</button>
        </div>
        <webview
          src={url}
          style={{ flex: 1, minHeight: 0 }}
        />
      </div>
    </div>
  );
}