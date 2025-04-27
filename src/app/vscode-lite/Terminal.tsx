// Terminal.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import 'xterm/css/xterm.css';

export default function Terminal() {
  const xtermRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<any>(null);
  const fitAddonRef = useRef<any>(null);
  const [height, setHeight] = useState(200);
  const resizing = useRef(false);
  const startY = useRef(0);
  const startHeight = useRef(200);

  useEffect(() => {
    let term: any;
    let fitAddon: any;
    let disposed = false;
    async function setup() {
      const { Terminal } = await import('xterm');
      const { FitAddon } = await import('xterm-addon-fit');
      fitAddon = new FitAddon();
      term = new Terminal({
        theme: {
          background: '#1e1e1e',
          foreground: '#d4d4d4',
        },
        fontFamily: 'Fira Mono, Consolas, monospace',
        fontSize: 14,
        cursorBlink: true,
        rows: 18,
        cols: 80,
        scrollback: 1000,
      });
      term.loadAddon(fitAddon);
      term.open(xtermRef.current!);
      setTimeout(() => {
        fitAddon.fit();
        term.focus();
      }, 0);
      term.write('\u001b[1;32mWelcome to 0PenAI Terminal\u001b[0m\r\n$ ');
      let command = '';
      term.onKey(async (e: any) => {
        const ev = e.domEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (ev.key === 'Enter') {
          term.write('\r\n');
          if (command.trim()) {
            try {
              const res = await fetch('/api/terminal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: command + '\n' }),
              });
              const data = await res.json();
              if (data.output !== undefined && data.output !== null) {
                term.write(data.output.replace(/\n/g, '\r\n'));
              } else {
                term.write('No output\r\n');
              }
            } catch {
              term.write('Error: backend unavailable\r\n');
            }
          }
          command = '';
          term.write('$ ');
        } else if (ev.key === 'Backspace') {
          if (command.length > 0) {
            term.write('\b \b');
            command = command.slice(0, -1);
          }
        } else if (printable && e.key.length === 1) {
          command += e.key;
          term.write(e.key);
        }
      });
      window.addEventListener('resize', handleResize);
    }
    function handleResize() {
      if (fitAddon) fitAddon.fit();
    }
    setup();
    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      if (term) term.dispose();
    };
  }, []);

  // --- Resizing Handlers ---
  function handleResizeStart(e: React.MouseEvent) {
    resizing.current = true;
    startY.current = e.clientY;
    startHeight.current = height;
    document.body.style.cursor = 'ns-resize';
    window.addEventListener('mousemove', handleResizeDrag, { passive: false });
    window.addEventListener('mouseup', handleResizeEnd, { passive: false });
    e.preventDefault();
    e.stopPropagation();
  }
  function handleResizeDrag(e: MouseEvent) {
    if (!resizing.current) return;
    e.preventDefault();
    let newHeight = startHeight.current - (e.clientY - startY.current);
    if (newHeight < 100) newHeight = 100;
    if (newHeight > 600) newHeight = 600;
    setHeight(newHeight);
    if (fitAddonRef.current && fitAddonRef.current.fit) {
      fitAddonRef.current.fit();
    }
  }
  function handleResizeEnd(e?: MouseEvent) {
    resizing.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleResizeDrag);
    window.removeEventListener('mouseup', handleResizeEnd);
    if (e) e.preventDefault();
  }

  return (
    <div style={{ width: '100%', background: '#1e1e1e', borderTop: '1px solid #222', overflow: 'hidden', position: 'relative', border: '2px solid #222', minHeight: 100 }}>
      <div
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 7, cursor: 'ns-resize', zIndex: 30, background: 'transparent' }}
        onMouseDown={handleResizeStart}
      >
        <div style={{ width: 48, height: 7, margin: '0 auto', borderRadius: 4, background: '#333', opacity: 0.35 }}></div>
      </div>
      <div
        ref={xtermRef}
        style={{ width: '100%', height: height, minHeight: 100, maxHeight: 600, background: '#1e1e1e', position: 'relative' }}
        tabIndex={0}
        onClick={() => {
          if (termRef.current) termRef.current.focus();
        }}
      />
    </div>
  );
}
