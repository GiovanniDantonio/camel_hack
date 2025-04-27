(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/vscode-lite/Terminal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Terminal.tsx
__turbopack_context__.s({
    "default": (()=>Terminal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function Terminal() {
    _s();
    const xtermRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const termRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitAddonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [height, setHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(200);
    const resizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(200);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Terminal.useEffect": ()=>{
            let term;
            let fitAddon;
            let disposed = false;
            async function setup() {
                const { Terminal } = await __turbopack_context__.r("[project]/node_modules/xterm/lib/xterm.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i);
                const { FitAddon } = await __turbopack_context__.r("[project]/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i);
                fitAddon = new FitAddon();
                term = new Terminal({
                    theme: {
                        background: '#1e1e1e',
                        foreground: '#d4d4d4'
                    },
                    fontFamily: 'Fira Mono, Consolas, monospace',
                    fontSize: 14,
                    cursorBlink: true,
                    rows: 18,
                    cols: 80,
                    scrollback: 1000
                });
                term.loadAddon(fitAddon);
                term.open(xtermRef.current);
                setTimeout({
                    "Terminal.useEffect.setup": ()=>{
                        fitAddon.fit();
                        term.focus();
                    }
                }["Terminal.useEffect.setup"], 0);
                term.write('\u001b[1;32mWelcome to 0PenAI Terminal\u001b[0m\r\n$ ');
                let command = '';
                term.onKey({
                    "Terminal.useEffect.setup": async (e)=>{
                        const ev = e.domEvent;
                        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
                        if (ev.key === 'Enter') {
                            term.write('\r\n');
                            if (command.trim()) {
                                try {
                                    const res = await fetch('/api/terminal', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            input: command + '\n'
                                        })
                                    });
                                    const data = await res.json();
                                    if (data.output !== undefined && data.output !== null) {
                                        term.write(data.output.replace(/\n/g, '\r\n'));
                                    } else {
                                        term.write('No output\r\n');
                                    }
                                } catch  {
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
                    }
                }["Terminal.useEffect.setup"]);
                window.addEventListener('resize', handleResize);
            }
            function handleResize() {
                if (fitAddon) fitAddon.fit();
            }
            setup();
            return ({
                "Terminal.useEffect": ()=>{
                    disposed = true;
                    window.removeEventListener('resize', handleResize);
                    if (term) term.dispose();
                }
            })["Terminal.useEffect"];
        }
    }["Terminal.useEffect"], []);
    // --- Resizing Handlers ---
    function handleResizeStart(e) {
        resizing.current = true;
        startY.current = e.clientY;
        startHeight.current = height;
        document.body.style.cursor = 'ns-resize';
        window.addEventListener('mousemove', handleResizeDrag, {
            passive: false
        });
        window.addEventListener('mouseup', handleResizeEnd, {
            passive: false
        });
        e.preventDefault();
        e.stopPropagation();
    }
    function handleResizeDrag(e) {
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
    function handleResizeEnd(e) {
        resizing.current = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleResizeDrag);
        window.removeEventListener('mouseup', handleResizeEnd);
        if (e) e.preventDefault();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100%',
            background: '#1e1e1e',
            borderTop: '1px solid #222',
            overflow: 'hidden',
            position: 'relative',
            border: '2px solid #222',
            minHeight: 100
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 7,
                    cursor: 'ns-resize',
                    zIndex: 30,
                    background: 'transparent'
                },
                onMouseDown: handleResizeStart,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        width: 48,
                        height: 7,
                        margin: '0 auto',
                        borderRadius: 4,
                        background: '#333',
                        opacity: 0.35
                    }
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: xtermRef,
                style: {
                    width: '100%',
                    height: height,
                    minHeight: 100,
                    maxHeight: 600,
                    background: '#1e1e1e',
                    position: 'relative'
                },
                tabIndex: 0,
                onClick: ()=>{
                    if (termRef.current) termRef.current.focus();
                }
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
        lineNumber: 121,
        columnNumber: 5
    }, this);
}
_s(Terminal, "wFR/IoMvtEw/wThOgm/KQvYvAik=");
_c = Terminal;
var _c;
__turbopack_context__.k.register(_c, "Terminal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/vscode-lite/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// src/app/vscode-lite/page.tsx
__turbopack_context__.s({
    "default": (()=>VSCodeLitePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$vscode$2d$lite$2f$Terminal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/vscode-lite/Terminal.tsx [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const activityTabs = [
    {
        key: 'explorer',
        icon: 'codicon-files',
        title: 'Explorer'
    },
    {
        key: 'search',
        icon: 'codicon-search',
        title: 'Search'
    },
    {
        key: 'scm',
        icon: 'codicon-source-control',
        title: 'Source Control'
    },
    {
        key: 'run',
        icon: 'codicon-run-all',
        title: 'Run & Debug'
    },
    {
        key: 'extensions',
        icon: 'codicon-extensions',
        title: 'Extensions'
    }
];
const SIDEBAR_MIN_WIDTH = 48;
const SIDEBAR_DEFAULT_WIDTH = 250;
const SIDEBAR_MAX_WIDTH = 350;
const RIGHTSIDEBAR_MIN_WIDTH = 200;
const RIGHTSIDEBAR_DEFAULT_WIDTH = 320;
const RIGHTSIDEBAR_MAX_WIDTH = 480;
const MonacoEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c = MonacoEditor;
function VSCodeLitePage() {
    _s();
    // Sidebar and right sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(true);
    const [terminalCollapsed, setTerminalCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState('explorer');
    const [activeTerminalTab, setActiveTerminalTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(0);
    // Sidebar resize state
    const [sidebarWidth, setSidebarWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(SIDEBAR_DEFAULT_WIDTH);
    const resizingSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const sidebarStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const sidebarStartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(SIDEBAR_DEFAULT_WIDTH);
    // Right sidebar resize state
    const [rightSidebarWidth, setRightSidebarWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(RIGHTSIDEBAR_DEFAULT_WIDTH);
    const resizingRightSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const rightSidebarStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rightSidebarStartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(RIGHTSIDEBAR_DEFAULT_WIDTH);
    // Folder tree, files, and editor state (minimal, for demo)
    const [folderTree, setFolderTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentFile, setCurrentFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [editorValue, setEditorValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Collapsed directories state
    const [collapsedDirs, setCollapsedDirs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // --- Saved/Unsaved file state ---
    const [savedFiles, setSavedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [unsavedFiles, setUnsavedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // --- GITHUB REPO SELECTOR ---
    const [repo, setRepo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [githubRepos, setGithubRepos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [githubFiles, setGithubFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [githubPath, setGithubPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // --- Collapsed state for GitHub folders ---
    const [collapsedGithubDirs, setCollapsedGithubDirs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    function toggleDirCollapse(path) {
        setCollapsedDirs((prev)=>{
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    }
    function toggleGithubDirCollapse(path) {
        setCollapsedGithubDirs((prev)=>{
            const next = new Set(prev);
            if (next.has(path)) next.delete(path);
            else next.add(path);
            return next;
        });
    }
    // Fetch user's GitHub repositories on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VSCodeLitePage.useEffect": ()=>{
            fetch('/api/github/repositories').then({
                "VSCodeLitePage.useEffect": (res)=>res.json()
            }["VSCodeLitePage.useEffect"]).then({
                "VSCodeLitePage.useEffect": (data)=>{
                    if (Array.isArray(data)) setGithubRepos(data);
                }
            }["VSCodeLitePage.useEffect"]);
        }
    }["VSCodeLitePage.useEffect"], []);
    // Fetch file tree for selected repo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VSCodeLitePage.useEffect": ()=>{
            if (!repo) return;
            fetch(`/api/github/files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(githubPath)}`).then({
                "VSCodeLitePage.useEffect": (res)=>res.json()
            }["VSCodeLitePage.useEffect"]).then({
                "VSCodeLitePage.useEffect": (data)=>{
                    setGithubFiles(Array.isArray(data) ? data : [
                        data
                    ]);
                }
            }["VSCodeLitePage.useEffect"]);
        }
    }["VSCodeLitePage.useEffect"], [
        repo,
        githubPath
    ]);
    // Track unsaved changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VSCodeLitePage.useEffect": ()=>{
            if (editorValue !== savedFiles[currentFile]) {
                setUnsavedFiles({
                    "VSCodeLitePage.useEffect": (prev)=>{
                        const next = new Set(prev);
                        next.add(currentFile);
                        return next;
                    }
                }["VSCodeLitePage.useEffect"]);
            } else {
                setUnsavedFiles({
                    "VSCodeLitePage.useEffect": (prev)=>{
                        const next = new Set(prev);
                        next.delete(currentFile);
                        return next;
                    }
                }["VSCodeLitePage.useEffect"]);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["VSCodeLitePage.useEffect"], [
        editorValue,
        currentFile
    ]);
    // Save file
    function handleSaveFile() {
        setSavedFiles((prev)=>({
                ...prev,
                [currentFile]: editorValue
            }));
        setUnsavedFiles((prev)=>{
            const next = new Set(prev);
            next.delete(currentFile);
            return next;
        });
    }
    // MULTI-TERMINAL SUPPORT
    const [terminals, setTerminals] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState([
        {
            id: 1
        }
    ]);
    const [activeTerminal, setActiveTerminal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(0);
    function addTerminal() {
        setTerminals((ts)=>[
                ...ts,
                {
                    id: Date.now()
                }
            ]);
        setActiveTerminal(terminals.length);
    }
    function closeTerminal(idx) {
        setTerminals((ts)=>ts.length === 1 ? ts : ts.filter((_, i)=>i !== idx));
        setActiveTerminal(idx > 0 ? idx - 1 : 0);
    }
    // Render folder tree with collapsible directories and unsaved indicator
    function renderFolderTree(tree, parentPath = '') {
        return Object.entries(tree).map(([name, value])=>{
            const fullPath = parentPath ? parentPath + '/' + name : name;
            if (typeof value === 'string') {
                const isUnsaved = unsavedFiles.has(fullPath);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: 'file' + (fullPath === currentFile ? ' active' : ''),
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: parentPath ? 20 : 8,
                        cursor: 'pointer'
                    },
                    onClick: ()=>{
                        setCurrentFile(fullPath);
                        setEditorValue(savedFiles[fullPath] ?? value);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-file-code",
                            style: {
                                marginRight: 6
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 155,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                name,
                                isUnsaved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#f55',
                                        marginLeft: 4
                                    },
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 156,
                                    columnNumber: 39
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 156,
                            columnNumber: 13
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 149,
                    columnNumber: 11
                }, this);
            } else {
                const collapsed = collapsedDirs.has(fullPath);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: parentPath ? 20 : 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                userSelect: 'none'
                            },
                            onClick: ()=>toggleDirCollapse(fullPath),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`,
                                    style: {
                                        marginRight: 2,
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 165,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-folder",
                                    style: {
                                        marginRight: 6
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 166,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 163,
                            columnNumber: 13
                        }, this),
                        !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: renderFolderTree(value, fullPath)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 170,
                            columnNumber: 15
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 162,
                    columnNumber: 11
                }, this);
            }
        });
    }
    // Render GitHub file tree
    function renderGithubTree(tree, parentPath = '') {
        return tree.map((item)=>{
            if (item.type === 'file') {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: 'file' + (item.path === currentFile ? ' active' : ''),
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: parentPath ? 20 : 8,
                        cursor: 'pointer'
                    },
                    onClick: ()=>{
                        setCurrentFile(item.path);
                        fetch(`/api/github/file?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(item.path)}`).then((res)=>res.json()).then((data)=>{
                            const content = data.content ? atob(data.content.replace(/\n/g, '')) : '';
                            setEditorValue(content);
                        });
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-file-code",
                            style: {
                                marginRight: 6
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: item.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 195,
                            columnNumber: 13
                        }, this)
                    ]
                }, item.path, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 183,
                    columnNumber: 11
                }, this);
            } else if (item.type === 'dir') {
                const collapsed = collapsedGithubDirs.has(item.path);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: parentPath ? 20 : 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                userSelect: 'none'
                            },
                            onClick: async ()=>{
                                if (!collapsed && !item.children) {
                                    // Fetch children and expand in a single click
                                    const children = await fetch(`/api/github/files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(item.path)}`).then((res)=>res.json());
                                    item.children = Array.isArray(children) ? children : [
                                        children
                                    ];
                                    setGithubFiles((files)=>[
                                            ...files
                                        ]); // force update
                                    setCollapsedGithubDirs((prev)=>{
                                        const next = new Set(prev);
                                        next.delete(item.path); // ensure expanded
                                        return next;
                                    });
                                } else {
                                    // Just toggle collapse
                                    setCollapsedGithubDirs((prev)=>{
                                        const next = new Set(prev);
                                        if (next.has(item.path)) next.delete(item.path);
                                        else next.add(item.path);
                                        return next;
                                    });
                                }
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`,
                                    style: {
                                        marginRight: 2,
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-folder",
                                    style: {
                                        marginRight: 6
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 226,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 202,
                            columnNumber: 13
                        }, this),
                        !collapsed && item.children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: renderGithubTree(item.children, item.path)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 229,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.path, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 201,
                    columnNumber: 11
                }, this);
            }
            return null;
        });
    }
    // Toolbar actions (minimal, for demo)
    function handleToolbarAction(action) {
        alert(`Action: ${action} (demo only)`);
    }
    // Sidebar resize handlers (fixed: use event.pageX and store initial positions)
    function handleSidebarResizeStart(e) {
        resizingSidebar.current = true;
        sidebarStartX.current = e.pageX;
        sidebarStartWidth.current = sidebarWidth;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', handleSidebarResizeDrag);
        window.addEventListener('mouseup', handleSidebarResizeEnd);
        e.preventDefault();
    }
    function handleSidebarResizeDrag(e) {
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
    function handleRightSidebarResizeStart(e) {
        resizingRightSidebar.current = true;
        rightSidebarStartX.current = e.pageX;
        rightSidebarStartWidth.current = rightSidebarWidth;
        document.body.style.cursor = 'ew-resize';
        window.addEventListener('mousemove', handleRightSidebarResizeDrag);
        window.addEventListener('mouseup', handleRightSidebarResizeEnd);
        e.preventDefault();
    }
    function handleRightSidebarResizeDrag(e) {
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "VSCodeLitePage.useEffect": ()=>{
            document.body.style.margin = '0';
            document.body.style.height = '100vh';
            document.body.style.width = '100vw';
            document.body.style.overflow = 'hidden';
            document.body.style.background = '#1e1e1e';
            document.body.style.color = '#d4d4d4';
            return ({
                "VSCodeLitePage.useEffect": ()=>{
                    document.body.style = '';
                }
            })["VSCodeLitePage.useEffect"];
        }
    }["VSCodeLitePage.useEffect"], []);
    // Sidebar views logic
    function renderSidebarView() {
        switch(activeTab){
            case 'explorer':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "explorer-view",
                    className: "sidebar-view active",
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '80vh',
                        minHeight: 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: 8,
                                background: '#23272e',
                                borderBottom: '1px solid #222',
                                flex: '0 0 auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#fff',
                                        marginRight: 8
                                    },
                                    children: "GitHub Repo:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 312,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: repo,
                                    onChange: (e)=>{
                                        setRepo(e.target.value);
                                        setGithubPath('');
                                    },
                                    style: {
                                        padding: 4,
                                        borderRadius: 4,
                                        border: '1px solid #444',
                                        background: '#181a20',
                                        color: '#fff',
                                        width: 240
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select a repository..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                                            lineNumber: 318,
                                            columnNumber: 17
                                        }, this),
                                        githubRepos.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: r.fullName || r.full_name,
                                                children: r.fullName || r.full_name
                                            }, r.fullName || r.full_name, false, {
                                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                lineNumber: 320,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 313,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setGithubPath(''),
                                    style: {
                                        marginLeft: 8,
                                        background: '#3794ff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        padding: '4px 10px',
                                        cursor: 'pointer'
                                    },
                                    children: "Root"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 311,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "folder-tree",
                            style: {
                                flex: 1,
                                minHeight: 0,
                                maxHeight: '100%',
                                overflowY: 'auto',
                                overflowX: 'hidden'
                            },
                            children: repo ? renderGithubTree(githubFiles) : renderFolderTree(folderTree)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 328,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 309,
                    columnNumber: 11
                }, this);
            case 'search':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "search-view",
                    className: "sidebar-view active",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "search-input",
                            placeholder: "Search files...",
                            style: {
                                width: '90%',
                                margin: '8px 5%',
                                padding: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 340,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "search-results"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 341,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 339,
                    columnNumber: 11
                }, this);
            case 'scm':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "scm-view",
                    className: "sidebar-view active",
                    children: "Source Control coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 346,
                    columnNumber: 11
                }, this);
            case 'run':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "run-view",
                    className: "sidebar-view active",
                    children: "Run & Debug coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 350,
                    columnNumber: 11
                }, this);
            case 'extensions':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "extensions-view",
                    className: "sidebar-view active",
                    children: "Extensions coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 354,
                    columnNumber: 11
                }, this);
            default:
                return null;
        }
    }
    // Sidebar toggle logic for VSCode-like behavior
    function handleActivityTabClick(tabKey) {
        if (activeTab === tabKey && !sidebarCollapsed) {
            setSidebarCollapsed(true);
        } else {
            setActiveTab(tabKey);
            setSidebarCollapsed(false);
        }
    }
    // AI Agent panel toggle logic
    function handleAIAgentToggle() {
        setRightSidebarCollapsed((prev)=>!prev);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            background: '#1e1e1e',
            color: '#d4d4d4',
            display: 'flex',
            flexDirection: 'column'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                href: "https://cdn.jsdelivr.net/npm/@vscode/codicons/dist/codicon.css",
                rel: "stylesheet"
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 378,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "toolbar",
                style: {
                    flex: '0 0 36px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    background: '#23272e',
                    borderBottom: '1px solid #222',
                    height: 36,
                    padding: '0 8px',
                    position: 'relative',
                    gap: 6
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "new-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('new-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-new-file",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 380,
                                columnNumber: 103
                            }, this),
                            "New File"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 380,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "save-file-btn",
                        className: "vsc-btn",
                        onClick: handleSaveFile,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-save",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 381,
                                columnNumber: 81
                            }, this),
                            "Save"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "rename-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('rename-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-edit",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 382,
                                columnNumber: 109
                            }, this),
                            "Rename"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "delete-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('delete-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-trash",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 383,
                                columnNumber: 109
                            }, this),
                            "Delete"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 383,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "active-filename",
                        style: {
                            fontWeight: 500,
                            color: '#fff',
                            marginLeft: 16
                        },
                        children: [
                            currentFile,
                            unsavedFiles.has(currentFile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#f55',
                                    marginLeft: 4
                                },
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 384,
                                columnNumber: 142
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 379,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "tabbar",
                style: {
                    flex: '0 0 36px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    background: '#23272e',
                    borderBottom: '1px solid #222',
                    height: 36,
                    padding: '0 8px',
                    position: 'relative'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "tab active",
                    style: {
                        background: 'none',
                        color: '#fff',
                        border: 'none',
                        padding: '0 12px',
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 4,
                        fontWeight: 500
                    },
                    children: [
                        currentFile,
                        unsavedFiles.has(currentFile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: '#f55',
                                marginLeft: 4
                            },
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 388,
                            columnNumber: 58
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-close",
                            style: {
                                marginLeft: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 388,
                            columnNumber: 115
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 387,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 386,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 10,
                    right: 24,
                    zIndex: 20,
                    display: 'flex',
                    gap: 12
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: "Toggle Left Sidebar",
                        style: {
                            width: 36,
                            height: 36,
                            background: '#23272e',
                            border: 'none',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 6px #0002',
                            cursor: 'pointer',
                            outline: 'none',
                            padding: 0
                        },
                        onClick: ()=>setSidebarCollapsed((v)=>!v),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 18 18",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "3",
                                    y: "3",
                                    width: "4",
                                    height: "12",
                                    fill: "#aaa"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 398,
                                    columnNumber: 59
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "8",
                                    y: "3",
                                    width: "7",
                                    height: "12",
                                    rx: "2",
                                    fill: "#ddd"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 398,
                                    columnNumber: 112
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 398,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: "Toggle Terminal",
                        style: {
                            width: 36,
                            height: 36,
                            background: '#23272e',
                            border: 'none',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 6px #0002',
                            cursor: 'pointer',
                            outline: 'none',
                            padding: 0
                        },
                        onClick: ()=>setTerminalCollapsed((v)=>!v),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 18 18",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "3",
                                    y: "13",
                                    width: "12",
                                    height: "2",
                                    rx: "1",
                                    fill: "#aaa"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 406,
                                    columnNumber: 59
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "3",
                                    y: "3",
                                    width: "12",
                                    height: "8",
                                    rx: "2",
                                    fill: "#ddd"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 406,
                                    columnNumber: 120
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 406,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        title: "Toggle Right Sidebar",
                        style: {
                            width: 36,
                            height: 36,
                            background: '#23272e',
                            border: 'none',
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 6px #0002',
                            cursor: 'pointer',
                            outline: 'none',
                            padding: 0
                        },
                        onClick: ()=>setRightSidebarCollapsed((v)=>!v),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "18",
                            height: "18",
                            viewBox: "0 0 18 18",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "11",
                                    y: "3",
                                    width: "4",
                                    height: "12",
                                    fill: "#aaa"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 414,
                                    columnNumber: 59
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                    x: "3",
                                    y: "3",
                                    width: "7",
                                    height: "12",
                                    rx: "2",
                                    fill: "#ddd"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 414,
                                    columnNumber: 113
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 414,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 409,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minHeight: 0,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "activitybar",
                        children: activityTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `codicon ${tab.icon}${activeTab === tab.key && !sidebarCollapsed ? ' active' : ''}`,
                                title: tab.title,
                                "data-view": tab.key,
                                onClick: ()=>handleActivityTabClick(tab.key),
                                style: {
                                    width: 32,
                                    height: 32,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '12px 0',
                                    cursor: 'pointer',
                                    fontSize: 24,
                                    borderRadius: 6,
                                    transition: 'opacity 0.2s, background 0.2s',
                                    opacity: activeTab === tab.key && !sidebarCollapsed ? 1 : 0.7,
                                    background: activeTab === tab.key && !sidebarCollapsed ? '#31313a' : undefined,
                                    color: activeTab === tab.key && !sidebarCollapsed ? '#3794ff' : undefined
                                }
                            }, tab.key, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 420,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 418,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "sidebar",
                        className: sidebarCollapsed ? 'collapsed' : '',
                        style: {
                            width: sidebarCollapsed ? 0 : sidebarWidth,
                            minWidth: sidebarCollapsed ? 0 : SIDEBAR_MIN_WIDTH,
                            maxWidth: sidebarCollapsed ? 0 : SIDEBAR_MAX_WIDTH,
                            transition: 'width 0.2s, min-width 0.2s, max-width 0.2s',
                            overflow: sidebarCollapsed ? 'hidden' : undefined,
                            position: 'relative',
                            userSelect: resizingSidebar.current ? 'none' : 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-toggle",
                                onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-chevron-left"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 446,
                                    columnNumber: 91
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-header",
                                children: activityTabs.find((t)=>t.key === activeTab)?.title ?? ''
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 447,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-content",
                                children: !sidebarCollapsed && renderSidebarView()
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 448,
                                columnNumber: 11
                            }, this),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-resizer",
                                onMouseDown: handleSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 453,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "container",
                        style: {
                            minWidth: 0,
                            minHeight: 0,
                            flexGrow: 1,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minHeight: 0,
                                    minWidth: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MonacoEditor, {
                                    height: "100%",
                                    language: currentFile.endsWith('.md') ? 'markdown' : 'javascript',
                                    value: editorValue,
                                    theme: "vs-dark",
                                    onChange: (v)=>setEditorValue(v || ''),
                                    options: {
                                        minimap: {
                                            enabled: false
                                        }
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 461,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 460,
                                columnNumber: 11
                            }, this),
                            !terminalCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative',
                                    width: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderTop: '1px solid #222',
                                            background: '#222',
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            terminals.map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: '6px 16px',
                                                        background: idx === activeTerminal ? '#1e1e1e' : 'transparent',
                                                        color: idx === activeTerminal ? '#fff' : '#aaa',
                                                        borderRight: '1px solid #333',
                                                        cursor: 'pointer',
                                                        position: 'relative'
                                                    },
                                                    onClick: ()=>setActiveTerminal(idx),
                                                    children: [
                                                        "Terminal ",
                                                        idx + 1,
                                                        terminals.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                marginLeft: 8,
                                                                color: '#f55',
                                                                cursor: 'pointer'
                                                            },
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                closeTerminal(idx);
                                                            },
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                            lineNumber: 489,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, t.id, true, {
                                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: addTerminal,
                                                style: {
                                                    marginLeft: 12,
                                                    background: 'none',
                                                    color: '#0f0',
                                                    border: 'none',
                                                    fontSize: 20,
                                                    cursor: 'pointer'
                                                },
                                                children: "+"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                lineNumber: 496,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 473,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '100%'
                                        },
                                        children: terminals.map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: idx === activeTerminal ? 'block' : 'none',
                                                    width: '100%'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$vscode$2d$lite$2f$Terminal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, t.id, false, {
                                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                    lineNumber: 501,
                                                    columnNumber: 21
                                                }, this)
                                            }, t.id, false, {
                                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                lineNumber: 500,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 498,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 472,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 459,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "rightsidebar",
                        className: rightSidebarCollapsed ? 'collapsed' : '',
                        style: {
                            width: rightSidebarCollapsed ? 0 : rightSidebarWidth,
                            minWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MIN_WIDTH,
                            maxWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MAX_WIDTH,
                            transition: 'width 0.2s, min-width 0.2s, max-width 0.2s',
                            overflow: rightSidebarCollapsed ? 'hidden' : undefined,
                            position: 'relative',
                            userSelect: resizingRightSidebar.current ? 'none' : 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "rightsidebar-toggle",
                                onClick: ()=>setRightSidebarCollapsed(!rightSidebarCollapsed),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-chevron-right"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 106
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 521,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "ai-agent-header",
                                children: "AI Agent"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 522,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "ai-agent-content",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "ai-agent-view",
                                        children: "AI agent panel coming soon..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 524,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        id: "ai-agent-panel",
                                        style: {
                                            overflow: 'auto',
                                            maxHeight: 'calc(100vh - 40px)'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 525,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 523,
                                columnNumber: 11
                            }, this),
                            !rightSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rightsidebar-resizer",
                                onMouseDown: handleRightSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 529,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "rightbar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-chevron-right",
                            id: "collapse-rightbar-btn",
                            title: "Collapse AI Sidebar",
                            onClick: handleAIAgentToggle
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 536,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 535,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 417,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "statusbar",
                style: {
                    flex: '0 0 24px',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "VSCode Lite"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 540,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-language",
                        children: currentFile.endsWith('.md') ? 'Markdown' : 'JavaScript'
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 541,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-encoding",
                        children: "UTF-8"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 542,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-eol",
                        children: "LF"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 543,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 539,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/page.tsx",
        lineNumber: 377,
        columnNumber: 5
    }, this);
}
_s(VSCodeLitePage, "qjaOtftu5US1g2TVTbjksWP5OMI=");
_c1 = VSCodeLitePage;
var _c, _c1;
__turbopack_context__.k.register(_c, "MonacoEditor");
__turbopack_context__.k.register(_c1, "VSCodeLitePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR(param) {
    let { reason, children } = param;
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
function PreloadChunks(param) {
    let { moduleIds } = param;
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : '';
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = workStore.assetPrefix + "/_next/" + (0, _encodeuripath.encodeURIPath)(chunk) + dplId;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style"
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low'
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    var _mergedOptions_loadableGenerated;
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: (_mergedOptions_loadableGenerated = mergedOptions.loadableGenerated) == null ? void 0 : _mergedOptions_loadableGenerated.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}}),
}]);

//# sourceMappingURL=_f044f8b4._.js.map