// src/app/vscode-lite/page.tsx
'use client';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import Terminal from './Terminal';

const activityTabs = [
  { key: 'explorer', icon: 'codicon-files', title: 'Explorer' },
  { key: 'search', icon: 'codicon-search', title: 'Search' },
  { key: 'scm', icon: 'codicon-source-control', title: 'Source Control' },
  { key: 'run', icon: 'codicon-run-all', title: 'Run & Debug' },
  { key: 'extensions', icon: 'codicon-extensions', title: 'Extensions' },
];

const SIDEBAR_MIN_WIDTH = 48;
const SIDEBAR_DEFAULT_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 350;
const RIGHTSIDEBAR_MIN_WIDTH = 200;
const RIGHTSIDEBAR_DEFAULT_WIDTH = 320;
const RIGHTSIDEBAR_MAX_WIDTH = 480;

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function VSCodeLitePage() {
  // Sidebar and right sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = React.useState(true);
  const [terminalCollapsed, setTerminalCollapsed] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('explorer');
  const [activeTerminalTab, setActiveTerminalTab] = React.useState(0);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = React.useState(SIDEBAR_DEFAULT_WIDTH);
  const resizingSidebar = useRef(false);
  const sidebarStartX = useRef(0);
  const sidebarStartWidth = useRef(SIDEBAR_DEFAULT_WIDTH);

  // Right sidebar resize state
  const [rightSidebarWidth, setRightSidebarWidth] = React.useState(RIGHTSIDEBAR_DEFAULT_WIDTH);
  const resizingRightSidebar = useRef(false);
  const rightSidebarStartX = useRef(0);
  const rightSidebarStartWidth = useRef(RIGHTSIDEBAR_DEFAULT_WIDTH);

  // Folder tree, files, and editor state (minimal, for demo)
  const [folderTree, setFolderTree] = useState<any>({});
  const [currentFile, setCurrentFile] = useState('');
  const [editorValue, setEditorValue] = useState('');

  // Collapsed directories state
  const [collapsedDirs, setCollapsedDirs] = useState<Set<string>>(new Set());

  // --- Saved/Unsaved file state ---
  const [savedFiles, setSavedFiles] = useState<{ [path: string]: string }>({});
  const [unsavedFiles, setUnsavedFiles] = useState<Set<string>>(new Set());

  // --- GITHUB REPO SELECTOR ---
  const [repo, setRepo] = useState<string>('');
  const [githubRepos, setGithubRepos] = useState<any[]>([]);
  const [githubFiles, setGithubFiles] = useState<any[]>([]);
  const [githubPath, setGithubPath] = useState<string>('');

  // --- Collapsed state for GitHub folders ---
  const [collapsedGithubDirs, setCollapsedGithubDirs] = useState<Set<string>>(new Set());

  function toggleDirCollapse(path: string) {
    setCollapsedDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }

  function toggleGithubDirCollapse(path: string) {
    setCollapsedGithubDirs(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  }

  // Fetch user's GitHub repositories on mount
  useEffect(() => {
    fetch('/api/github/repositories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setGithubRepos(data);
      });
  }, []);

  // Fetch file tree for selected repo
  useEffect(() => {
    if (!repo) return;
    fetch(`/api/github/files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(githubPath)}`)
      .then(res => res.json())
      .then(data => {
        setGithubFiles(Array.isArray(data) ? data : [data]);
      });
  }, [repo, githubPath]);

  // Track unsaved changes
  useEffect(() => {
    if (editorValue !== savedFiles[currentFile]) {
      setUnsavedFiles(prev => {
        const next = new Set(prev);
        next.add(currentFile);
        return next;
      });
    } else {
      setUnsavedFiles(prev => {
        const next = new Set(prev);
        next.delete(currentFile);
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorValue, currentFile]);

  // Save file
  function handleSaveFile() {
    setSavedFiles(prev => ({ ...prev, [currentFile]: editorValue }));
    setUnsavedFiles(prev => {
      const next = new Set(prev);
      next.delete(currentFile);
      return next;
    });
  }

  // MULTI-TERMINAL SUPPORT
  const [terminals, setTerminals] = React.useState([{ id: 1 }]);
  const [activeTerminal, setActiveTerminal] = React.useState(0);

  function addTerminal() {
    setTerminals(ts => [...ts, { id: Date.now() }]);
    setActiveTerminal(terminals.length);
  }
  function closeTerminal(idx: number) {
    setTerminals(ts => ts.length === 1 ? ts : ts.filter((_, i) => i !== idx));
    setActiveTerminal(idx > 0 ? idx - 1 : 0);
  }

  // Render folder tree with collapsible directories and unsaved indicator
  function renderFolderTree(tree: any, parentPath = ''): React.ReactNode {
    return Object.entries(tree).map(([name, value]) => {
      const fullPath = parentPath ? parentPath + '/' + name : name;
      if (typeof value === 'string') {
        const isUnsaved = unsavedFiles.has(fullPath);
        return (
          <div key={fullPath} className={'file' + (fullPath === currentFile ? ' active' : '')}
            style={{ display: 'flex', alignItems: 'center', paddingLeft: parentPath ? 20 : 8, cursor: 'pointer' }}
            onClick={() => {
              setCurrentFile(fullPath);
              setEditorValue(savedFiles[fullPath] ?? value);
            }}>
            <span className="codicon codicon-file-code" style={{ marginRight: 6 }}></span>
            <span>{name}{isUnsaved && <span style={{ color: '#f55', marginLeft: 4 }}>*</span>}</span>
          </div>
        );
      } else {
        const collapsed = collapsedDirs.has(fullPath);
        return (
          <div key={fullPath} style={{ paddingLeft: parentPath ? 20 : 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
              onClick={() => toggleDirCollapse(fullPath)}>
              <span className={`codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`} style={{ marginRight: 2, fontSize: 14 }}></span>
              <span className="codicon codicon-folder" style={{ marginRight: 6 }}></span>
              <span>{name}</span>
            </div>
            {!collapsed && (
              <div>{renderFolderTree(value, fullPath)}</div>
            )}
          </div>
        );
      }
    });
  }

  // Render GitHub file tree
  function renderGithubTree(tree: any[], parentPath = ''): React.ReactNode {
    return tree.map((item: any) => {
      if (item.type === 'file') {
        return (
          <div key={item.path} className={'file' + (item.path === currentFile ? ' active' : '')}
            style={{ display: 'flex', alignItems: 'center', paddingLeft: parentPath ? 20 : 8, cursor: 'pointer' }}
            onClick={() => {
              setCurrentFile(item.path);
              fetch(`/api/github/file?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(item.path)}`)
                .then(res => res.json())
                .then(data => {
                  const content = data.content ? atob(data.content.replace(/\n/g, '')) : '';
                  setEditorValue(content);
                });
            }}>
            <span className="codicon codicon-file-code" style={{ marginRight: 6 }}></span>
            <span>{item.name}</span>
          </div>
        );
      } else if (item.type === 'dir') {
        const collapsed = collapsedGithubDirs.has(item.path);
        return (
          <div key={item.path} style={{ paddingLeft: parentPath ? 20 : 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold', cursor: 'pointer', userSelect: 'none' }}
              onClick={async () => {
                if (!collapsed && !item.children) {
                  // Fetch children and expand in a single click
                  const children = await fetch(`/api/github/files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(item.path)}`)
                    .then(res => res.json());
                  item.children = Array.isArray(children) ? children : [children];
                  setGithubFiles(files => [...files]); // force update
                  setCollapsedGithubDirs(prev => {
                    const next = new Set(prev);
                    next.delete(item.path); // ensure expanded
                    return next;
                  });
                } else {
                  // Just toggle collapse
                  setCollapsedGithubDirs(prev => {
                    const next = new Set(prev);
                    if (next.has(item.path)) next.delete(item.path); else next.add(item.path);
                    return next;
                  });
                }
              }}>
              <span className={`codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`} style={{ marginRight: 2, fontSize: 14 }}></span>
              <span className="codicon codicon-folder" style={{ marginRight: 6 }}></span>
              <span>{item.name}</span>
            </div>
            {!collapsed && item.children && (
              <div>{renderGithubTree(item.children, item.path)}</div>
            )}
          </div>
        );
      }
      return null;
    });
  }

  // Toolbar actions (minimal, for demo)
  function handleToolbarAction(action: string) {
    alert(`Action: ${action} (demo only)`);
  }

  // Sidebar resize handlers (fixed: use event.pageX and store initial positions)
  function handleSidebarResizeStart(e: React.MouseEvent) {
    resizingSidebar.current = true;
    sidebarStartX.current = e.pageX;
    sidebarStartWidth.current = sidebarWidth;
    document.body.style.cursor = 'ew-resize';
    window.addEventListener('mousemove', handleSidebarResizeDrag);
    window.addEventListener('mouseup', handleSidebarResizeEnd);
    e.preventDefault();
  }
  function handleSidebarResizeDrag(e: MouseEvent) {
    if (!resizingSidebar.current) return;
    let newWidth = sidebarStartWidth.current + (e.pageX - sidebarStartX.current);
    if (newWidth < SIDEBAR_MIN_WIDTH) newWidth = SIDEBAR_MIN_WIDTH;
    if (newWidth > SIDEBAR_MAX_WIDTH) newWidth = SIDEBAR_MAX_WIDTH;
    setSidebarWidth(newWidth);
  }
  function handleSidebarResizeEnd() {
    resizingSidebar.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleSidebarResizeDrag);
    window.removeEventListener('mouseup', handleSidebarResizeEnd);
  }

  // Right sidebar resize handlers (fixed: use event.pageX and store initial positions)
  function handleRightSidebarResizeStart(e: React.MouseEvent) {
    resizingRightSidebar.current = true;
    rightSidebarStartX.current = e.pageX;
    rightSidebarStartWidth.current = rightSidebarWidth;
    document.body.style.cursor = 'ew-resize';
    window.addEventListener('mousemove', handleRightSidebarResizeDrag);
    window.addEventListener('mouseup', handleRightSidebarResizeEnd);
    e.preventDefault();
  }
  function handleRightSidebarResizeDrag(e: MouseEvent) {
    if (!resizingRightSidebar.current) return;
    let newWidth = rightSidebarStartWidth.current - (e.pageX - rightSidebarStartX.current);
    if (newWidth < RIGHTSIDEBAR_MIN_WIDTH) newWidth = RIGHTSIDEBAR_MIN_WIDTH;
    if (newWidth > RIGHTSIDEBAR_MAX_WIDTH) newWidth = RIGHTSIDEBAR_MAX_WIDTH;
    setRightSidebarWidth(newWidth);
  }
  function handleRightSidebarResizeEnd() {
    resizingRightSidebar.current = false;
    document.body.style.cursor = '';
    window.removeEventListener('mousemove', handleRightSidebarResizeDrag);
    window.removeEventListener('mouseup', handleRightSidebarResizeEnd);
  }

  // Fix: Make the UI fill the viewport and match the original layout
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
    document.body.style.overflow = 'hidden';
    document.body.style.background = '#1e1e1e';
    document.body.style.color = '#d4d4d4';
    return () => {
      document.body.style = '';
    };
  }, []);

  // Sidebar views logic
  function renderSidebarView() {
    switch (activeTab) {
      case 'explorer':
        return (
          <div id="explorer-view" className="sidebar-view active" style={{ display: 'flex', flexDirection: 'column', height: '80vh', minHeight: 0 }}>
            {/* --- GITHUB REPO SELECTOR UI (DROPDOWN) --- */}
            <div style={{ padding: 8, background: '#23272e', borderBottom: '1px solid #222', flex: '0 0 auto' }}>
              <span style={{ color: '#fff', marginRight: 8 }}>GitHub Repo:</span>
              <select
                value={repo}
                onChange={e => { setRepo(e.target.value); setGithubPath(''); }}
                style={{ padding: 4, borderRadius: 4, border: '1px solid #444', background: '#181a20', color: '#fff', width: 240 }}
              >
                <option value="">Select a repository...</option>
                {githubRepos.map((r: any) => (
                  <option key={r.fullName || r.full_name} value={r.fullName || r.full_name}>
                    {r.fullName || r.full_name}
                  </option>
                ))}
              </select>
              <button onClick={() => setGithubPath('')} style={{ marginLeft: 8, background: '#3794ff', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer' }}>Root</button>
            </div>
            {/* --- FILE TREE --- */}
            <div id="folder-tree" style={{ flex: 1, minHeight: 0, maxHeight: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
              {repo ? (
                renderGithubTree(githubFiles)
              ) : (
                renderFolderTree(folderTree)
              )}
            </div>
          </div>
        );
      case 'search':
        return (
          <div id="search-view" className="sidebar-view active">
            <input id="search-input" placeholder="Search files..." style={{ width: '90%', margin: '8px 5%', padding: 4 }} />
            <div id="search-results"></div>
          </div>
        );
      case 'scm':
        return (
          <div id="scm-view" className="sidebar-view active">Source Control coming soon...</div>
        );
      case 'run':
        return (
          <div id="run-view" className="sidebar-view active">Run & Debug coming soon...</div>
        );
      case 'extensions':
        return (
          <div id="extensions-view" className="sidebar-view active">Extensions coming soon...</div>
        );
      default:
        return null;
    }
  }

  // Sidebar toggle logic for VSCode-like behavior
  function handleActivityTabClick(tabKey: string) {
    if (activeTab === tabKey && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    } else {
      setActiveTab(tabKey);
      setSidebarCollapsed(false);
    }
  }

  // AI Agent panel toggle logic
  function handleAIAgentToggle() {
    setRightSidebarCollapsed((prev) => !prev);
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1e1e1e', color: '#d4d4d4', display: 'flex', flexDirection: 'column' }}>
      <link href="https://cdn.jsdelivr.net/npm/@vscode/codicons/dist/codicon.css" rel="stylesheet" />
      <div id="toolbar" style={{ flex: '0 0 36px', zIndex: 10, display: 'flex', alignItems: 'center', background: '#23272e', borderBottom: '1px solid #222', height: 36, padding: '0 8px', position: 'relative', gap: 6 }}>
        <button id="new-file-btn" className="vsc-btn" onClick={() => handleToolbarAction('new-file')}><span className="codicon codicon-new-file" style={{marginRight:4}}></span>New File</button>
        <button id="save-file-btn" className="vsc-btn" onClick={handleSaveFile}><span className="codicon codicon-save" style={{marginRight:4}}></span>Save</button>
        <button id="rename-file-btn" className="vsc-btn" onClick={() => handleToolbarAction('rename-file')}><span className="codicon codicon-edit" style={{marginRight:4}}></span>Rename</button>
        <button id="delete-file-btn" className="vsc-btn" onClick={() => handleToolbarAction('delete-file')}><span className="codicon codicon-trash" style={{marginRight:4}}></span>Delete</button>
        <span id="active-filename" style={{ fontWeight: 500, color: '#fff', marginLeft: 16 }}>{currentFile}{unsavedFiles.has(currentFile) && <span style={{ color: '#f55', marginLeft: 4 }}>*</span>}</span>
      </div>
      <div id="tabbar" style={{ flex: '0 0 36px', zIndex: 10, display: 'flex', alignItems: 'center', background: '#23272e', borderBottom: '1px solid #222', height: 36, padding: '0 8px', position: 'relative' }}>
        <div className="tab active" style={{ background: 'none', color: '#fff', border: 'none', padding: '0 12px', height: 28, display: 'flex', alignItems: 'center', borderRadius: 4, fontWeight: 500 }}>
          {currentFile}{unsavedFiles.has(currentFile) && <span style={{ color: '#f55', marginLeft: 4 }}>*</span>} <span className="codicon codicon-close" style={{ marginLeft: 4 }}></span>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 10, right: 24, zIndex: 20, display: 'flex', gap: 12 }}>
        {/* Toggle Left Sidebar (Explorer etc) */}
        <button
          title="Toggle Left Sidebar"
          style={{ width: 36, height: 36, background: '#23272e', border: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px #0002', cursor: 'pointer', outline: 'none', padding: 0 }}
          onClick={() => setSidebarCollapsed(v => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="3" width="4" height="12" fill="#aaa"/><rect x="8" y="3" width="7" height="12" rx="2" fill="#ddd"/></svg>
        </button>
        {/* Toggle Bottom Panel (Terminal) */}
        <button
          title="Toggle Terminal"
          style={{ width: 36, height: 36, background: '#23272e', border: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px #0002', cursor: 'pointer', outline: 'none', padding: 0 }}
          onClick={() => setTerminalCollapsed(v => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="3" y="13" width="12" height="2" rx="1" fill="#aaa"/><rect x="3" y="3" width="12" height="8" rx="2" fill="#ddd"/></svg>
        </button>
        {/* Toggle Right Sidebar (AI Agent) */}
        <button
          title="Toggle Right Sidebar"
          style={{ width: 36, height: 36, background: '#23272e', border: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 6px #0002', cursor: 'pointer', outline: 'none', padding: 0 }}
          onClick={() => setRightSidebarCollapsed(v => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18"><rect x="11" y="3" width="4" height="12" fill="#aaa"/><rect x="3" y="3" width="7" height="12" rx="2" fill="#ddd"/></svg>
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', flexDirection: 'row', width: '100%' }}>
        <div id="activitybar">
          {activityTabs.map(tab => (
            <span
              key={tab.key}
              className={`codicon ${tab.icon}${activeTab === tab.key && !sidebarCollapsed ? ' active' : ''}`}
              title={tab.title}
              data-view={tab.key}
              onClick={() => handleActivityTabClick(tab.key)}
              style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px 0', cursor: 'pointer', fontSize: 24, borderRadius: 6, transition: 'opacity 0.2s, background 0.2s', opacity: activeTab === tab.key && !sidebarCollapsed ? 1 : 0.7, background: activeTab === tab.key && !sidebarCollapsed ? '#31313a' : undefined, color: activeTab === tab.key && !sidebarCollapsed ? '#3794ff' : undefined }}
            />
          ))}
        </div>
        <div
          id="sidebar"
          className={sidebarCollapsed ? 'collapsed' : ''}
          style={{
            width: sidebarCollapsed ? 0 : sidebarWidth,
            minWidth: sidebarCollapsed ? 0 : SIDEBAR_MIN_WIDTH,
            maxWidth: sidebarCollapsed ? 0 : SIDEBAR_MAX_WIDTH,
            transition: 'width 0.2s, min-width 0.2s, max-width 0.2s',
            overflow: sidebarCollapsed ? 'hidden' : undefined,
            position: 'relative',
            userSelect: resizingSidebar.current ? 'none' : 'auto',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div id="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}><span className="codicon codicon-chevron-left"></span></div>
          <div id="sidebar-header">{activityTabs.find(t => t.key === activeTab)?.title ?? ''}</div>
          <div id="sidebar-content">
            {!sidebarCollapsed && renderSidebarView()}
          </div>
          {/* Sidebar resizer */}
          {!sidebarCollapsed && (
            <div
              className="sidebar-resizer"
              onMouseDown={handleSidebarResizeStart}
            />
          )}
        </div>
        <div id="container" style={{ minWidth: 0, minHeight: 0, flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ flex: 1, minHeight: 0, minWidth: 0 }}>
            <MonacoEditor
              height="100%"
              language={currentFile.endsWith('.md') ? 'markdown' : 'javascript'}
              value={editorValue}
              theme="vs-dark"
              onChange={v => setEditorValue(v || '')}
              options={{ minimap: { enabled: false } }}
            />
          </div>
          {/* Only show Terminal if not collapsed */}
          {!terminalCollapsed && (
            <div style={{ position: 'relative', width: '100%' }}>
              <div style={{ borderTop: '1px solid #222', background: '#222', display: 'flex', alignItems: 'center' }}>
                {terminals.map((t, idx) => (
                  <div
                    key={t.id}
                    style={{
                      padding: '6px 16px',
                      background: idx === activeTerminal ? '#1e1e1e' : 'transparent',
                      color: idx === activeTerminal ? '#fff' : '#aaa',
                      borderRight: '1px solid #333',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => setActiveTerminal(idx)}
                  >
                    Terminal {idx + 1}
                    {terminals.length > 1 && (
                      <span
                        style={{ marginLeft: 8, color: '#f55', cursor: 'pointer' }}
                        onClick={e => { e.stopPropagation(); closeTerminal(idx); }}
                      >×</span>
                    )}
                  </div>
                ))}
                <button onClick={addTerminal} style={{ marginLeft: 12, background: 'none', color: '#0f0', border: 'none', fontSize: 20, cursor: 'pointer' }}>+</button>
              </div>
              <div style={{ width: '100%' }}>
                {terminals.map((t, idx) => (
                  <div key={t.id} style={{ display: idx === activeTerminal ? 'block' : 'none', width: '100%' }}>
                    <Terminal key={t.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div
          id="rightsidebar"
          className={rightSidebarCollapsed ? 'collapsed' : ''}
          style={{
            width: rightSidebarCollapsed ? 0 : rightSidebarWidth,
            minWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MIN_WIDTH,
            maxWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MAX_WIDTH,
            transition: 'width 0.2s, min-width 0.2s, max-width 0.2s',
            overflow: rightSidebarCollapsed ? 'hidden' : undefined,
            position: 'relative',
            userSelect: resizingRightSidebar.current ? 'none' : 'auto',
          }}
        >
          <div id="rightsidebar-toggle" onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}><span className="codicon codicon-chevron-right"></span></div>
          <div id="ai-agent-header">AI Agent</div>
          <div id="ai-agent-content">
            <div id="ai-agent-view">AI agent panel coming soon...</div>
            <div id="ai-agent-panel" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 40px)' }}></div>
          </div>
          {/* Right sidebar resizer */}
          {!rightSidebarCollapsed && (
            <div
              className="rightsidebar-resizer"
              onMouseDown={handleRightSidebarResizeStart}
            />
          )}
        </div>
        <div id="rightbar">
          <span className="codicon codicon-chevron-right" id="collapse-rightbar-btn" title="Collapse AI Sidebar" onClick={handleAIAgentToggle}></span>
        </div>
      </div>
      <div id="statusbar" style={{ flex: '0 0 24px', zIndex: 10 }}>
        <span>VSCode Lite</span>
        <span id="status-language">{currentFile.endsWith('.md') ? 'Markdown' : 'JavaScript'}</span>
        <span id="status-encoding">UTF-8</span>
        <span id="status-eol">LF</span>
      </div>
    </div>
  );
}
