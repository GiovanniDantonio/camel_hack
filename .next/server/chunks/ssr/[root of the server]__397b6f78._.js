module.exports = {

"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/vscode-lite/Terminal.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// Terminal.tsx
__turbopack_context__.s({
    "default": (()=>Terminal)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
;
function Terminal() {
    const xtermRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const termRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fitAddonRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [height, setHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(200);
    const resizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(200);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let term;
        let fitAddon;
        let disposed = false;
        async function setup() {
            const { Terminal } = await __turbopack_context__.r("[project]/node_modules/xterm/lib/xterm.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i);
            const { FitAddon } = await __turbopack_context__.r("[project]/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js [app-ssr] (ecmascript, async loader)")(__turbopack_context__.i);
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
            setTimeout(()=>{
                fitAddon.fit();
                term.focus();
            }, 0);
            term.write('\u001b[1;32mWelcome to 0PenAI Terminal\u001b[0m\r\n$ ');
            let command = '';
            term.onKey(async (e)=>{
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
            });
            window.addEventListener('resize', handleResize);
        }
        function handleResize() {
            if (fitAddon) fitAddon.fit();
        }
        setup();
        return ()=>{
            disposed = true;
            window.removeEventListener('resize', handleResize);
            if (term) term.dispose();
        };
    }, []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
}}),
"[project]/src/app/vscode-lite/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// src/app/vscode-lite/page.tsx
__turbopack_context__.s({
    "default": (()=>VSCodeLitePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$vscode$2d$lite$2f$Terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/vscode-lite/Terminal.tsx [app-ssr] (ecmascript)");
;
'use client';
;
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
const MonacoEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.r("[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-ssr] (ecmascript, next/dynamic entry, async loader)")(__turbopack_context__.i), {
    loadableGenerated: {
        modules: [
            "[project]/node_modules/@monaco-editor/react/dist/index.mjs [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function VSCodeLitePage() {
    // Sidebar and right sidebar state
    const [sidebarCollapsed, setSidebarCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [rightSidebarCollapsed, setRightSidebarCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(true);
    const [terminalCollapsed, setTerminalCollapsed] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [activeTab, setActiveTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState('explorer');
    const [activeTerminalTab, setActiveTerminalTab] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(0);
    // Sidebar resize state
    const [sidebarWidth, setSidebarWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(SIDEBAR_DEFAULT_WIDTH);
    const resizingSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const sidebarStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const sidebarStartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(SIDEBAR_DEFAULT_WIDTH);
    // Right sidebar resize state
    const [rightSidebarWidth, setRightSidebarWidth] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(RIGHTSIDEBAR_DEFAULT_WIDTH);
    const resizingRightSidebar = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const rightSidebarStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const rightSidebarStartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(RIGHTSIDEBAR_DEFAULT_WIDTH);
    // Folder tree, files, and editor state (minimal, for demo)
    const [folderTree, setFolderTree] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [currentFile, setCurrentFile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [editorValue, setEditorValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // Collapsed directories state
    const [collapsedDirs, setCollapsedDirs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // --- Saved/Unsaved file state ---
    const [savedFiles, setSavedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [unsavedFiles, setUnsavedFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // --- GITHUB REPO SELECTOR ---
    const [repo, setRepo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [githubRepos, setGithubRepos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [githubFiles, setGithubFiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [githubPath, setGithubPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // --- Collapsed state for GitHub folders ---
    const [collapsedGithubDirs, setCollapsedGithubDirs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // --- Deep link state ---
    const [deepLink, setDeepLink] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        repo: '',
        file: '',
        line: undefined,
        issue: undefined
    });
    // Track if we've auto-loaded from deep link
    const [autoLoaded, setAutoLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetch('/api/github/repositories').then((res)=>res.json()).then((data)=>{
            if (Array.isArray(data)) setGithubRepos(data);
        });
    }, []);
    // Fetch file tree for selected repo
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!repo) return;
        fetch(`/api/github/files?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(githubPath)}`).then((res)=>res.json()).then((data)=>{
            setGithubFiles(Array.isArray(data) ? data : [
                data
            ]);
        });
    }, [
        repo,
        githubPath
    ]);
    // Track unsaved changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editorValue !== savedFiles[currentFile]) {
            setUnsavedFiles((prev)=>{
                const next = new Set(prev);
                next.add(currentFile);
                return next;
            });
        } else {
            setUnsavedFiles((prev)=>{
                const next = new Set(prev);
                next.delete(currentFile);
                return next;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
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
    const [terminals, setTerminals] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState([
        {
            id: 1
        }
    ]);
    const [activeTerminal, setActiveTerminal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(0);
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
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-file-code",
                            style: {
                                marginRight: 6
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 179,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: [
                                name,
                                isUnsaved && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#f55',
                                        marginLeft: 4
                                    },
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 39
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 173,
                    columnNumber: 11
                }, this);
            } else {
                const collapsed = collapsedDirs.has(fullPath);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: parentPath ? 20 : 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                userSelect: 'none'
                            },
                            onClick: ()=>toggleDirCollapse(fullPath),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`,
                                    style: {
                                        marginRight: 2,
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 189,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-folder",
                                    style: {
                                        marginRight: 6
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this),
                        !collapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: renderFolderTree(value, fullPath)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 194,
                            columnNumber: 15
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 186,
                    columnNumber: 11
                }, this);
            }
        });
    }
    // Render GitHub file tree
    function renderGithubTree(tree, parentPath = '') {
        return tree.map((item)=>{
            if (item.type === 'file') {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-file-code",
                            style: {
                                marginRight: 6
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 218,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: item.name
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 219,
                            columnNumber: 13
                        }, this)
                    ]
                }, item.path, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 207,
                    columnNumber: 11
                }, this);
            } else if (item.type === 'dir') {
                const collapsed = collapsedGithubDirs.has(item.path);
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: parentPath ? 20 : 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `codicon ${collapsed ? 'codicon-chevron-right' : 'codicon-chevron-down'}`,
                                    style: {
                                        marginRight: 2,
                                        fontSize: 14
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-folder",
                                    style: {
                                        marginRight: 6
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: item.name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this),
                        !collapsed && item.children && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: renderGithubTree(item.children, item.path)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 253,
                            columnNumber: 15
                        }, this)
                    ]
                }, item.path, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 225,
                    columnNumber: 11
                }, this);
            }
            return null;
        });
    }
    // --- Utility: Expand directories to reveal a file path in the GitHub tree ---
    function expandGithubDirsToFile(filePath) {
        const parts = filePath.split('/');
        let currPath = '';
        const newSet = new Set(collapsedGithubDirs);
        for(let i = 0; i < parts.length - 1; ++i){
            currPath = currPath ? currPath + '/' + parts[i] : parts[i];
            newSet.delete(currPath); // ensure expanded
        }
        setCollapsedGithubDirs(newSet);
    }
    // --- Highlight line in Monaco Editor (robust) ---
    const editorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    function handleEditorMount(editor) {
        editorRef.current = editor;
        // Highlight line if deepLink.line is present
        if (deepLink.line) {
            editor.revealLineInCenter(deepLink.line);
            editor.setPosition({
                lineNumber: deepLink.line,
                column: 1
            });
            editor.focus();
            editor.deltaDecorations([], [
                {
                    range: new window.monaco.Range(deepLink.line, 1, deepLink.line, 1),
                    options: {
                        isWholeLine: true,
                        className: 'ai-vuln-highlight',
                        linesDecorationsClassName: 'ai-vuln-gutter'
                    }
                }
            ]);
        }
    }
    // --- Effect: On deep link or repo/file change, auto-select and expand ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!deepLink.repo) return;
        if (!repo) setRepo(deepLink.repo);
        // Wait for repo and githubFiles to be loaded
        if (repo === deepLink.repo && githubFiles.length && !autoLoaded) {
            if (deepLink.file) {
                setCurrentFile(deepLink.file);
                expandGithubDirsToFile(deepLink.file);
                // Fetch file content if not already loaded
                fetch(`/api/github/file?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(deepLink.file)}`).then((res)=>res.json()).then((data)=>{
                    const content = data.content ? atob(data.content.replace(/\n/g, '')) : '';
                    setEditorValue(content);
                    setTimeout(()=>{
                        if (editorRef.current && deepLink.line) {
                            editorRef.current.revealLineInCenter(deepLink.line);
                            editorRef.current.setPosition({
                                lineNumber: deepLink.line,
                                column: 1
                            });
                            editorRef.current.focus();
                            editorRef.current.deltaDecorations([], [
                                {
                                    range: new window.monaco.Range(deepLink.line, 1, deepLink.line, 1),
                                    options: {
                                        isWholeLine: true,
                                        className: 'ai-vuln-highlight',
                                        linesDecorationsClassName: 'ai-vuln-gutter'
                                    }
                                }
                            ]);
                        }
                    }, 600);
                });
            }
            setAutoLoaded(true);
        }
    }, [
        deepLink,
        repo,
        githubFiles,
        autoLoaded
    ]);
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        document.body.style.margin = '0';
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';
        document.body.style.overflow = 'hidden';
        document.body.style.background = '#1e1e1e';
        document.body.style.color = '#d4d4d4';
        return ()=>{
            document.body.style = '';
        };
    }, []);
    // Parse query params for deep linking
    function parseQuery() {
        if ("TURBOPACK compile-time truthy", 1) return {
            repo: '',
            file: '',
            line: undefined,
            issue: undefined
        };
        "TURBOPACK unreachable";
        const params = undefined;
        let issue;
        const state = undefined;
    }
    // On mount, parse query params
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setDeepLink(parseQuery());
    }, []);
    // --- AI Agent Panel Content as React ---
    function renderAIAgentPanel() {
        if (!deepLink.issue) return null;
        const issue = deepLink.issue;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: '1em'
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '1.1em',
                        marginBottom: '0.5em',
                        color: '#c00'
                    },
                    children: issue.title
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 432,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '0.5em'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Severity:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 433,
                            columnNumber: 48
                        }, this),
                        " ",
                        issue.severity || 'N/A'
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 433,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '0.5em'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "File:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 434,
                            columnNumber: 48
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                            children: issue.file_path || ''
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 434,
                            columnNumber: 61
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Line:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 434,
                            columnNumber: 98
                        }, this),
                        " ",
                        issue.line_start || ''
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 434,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '0.5em'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Description:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 435,
                            columnNumber: 48
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 435,
                            columnNumber: 68
                        }, this),
                        issue.description || ''
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 435,
                    columnNumber: 9
                }, this),
                issue.remediation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        marginBottom: '0.5em'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("b", {
                            children: "Recommended Fix:"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 438,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 438,
                            columnNumber: 36
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                            style: {
                                background: '#222',
                                color: '#fff',
                                padding: '0.5em',
                                borderRadius: 4
                            },
                            children: issue.remediation
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 439,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 437,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    id: "ai-fix-btn",
                    style: {
                        background: '#c00',
                        color: '#fff',
                        padding: '0.5em 1em',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    },
                    onClick: ()=>alert('AI code fix coming soon!'),
                    children: "Auto-Fix with AI"
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 442,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/vscode-lite/page.tsx",
            lineNumber: 431,
            columnNumber: 7
        }, this);
    }
    // --- When deepLink.issue is present, always open the right sidebar and show the panel ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (deepLink.issue) {
            setRightSidebarCollapsed(false); // Open right sidebar
        }
    }, [
        deepLink.issue
    ]);
    // --- Open AI Agent Panel by default ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setRightSidebarCollapsed(false);
    }, []);
    // --- Panel Toggle Buttons ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Add floating set of panel toggle buttons for left, right, and bottom panels
        const panelToggleButtons = document.getElementById('panel-toggle-buttons');
        if (!panelToggleButtons) {
            const container = document.getElementById('container');
            if (container) {
                const buttons = document.createElement('div');
                buttons.id = 'panel-toggle-buttons';
                buttons.style.position = 'absolute';
                buttons.style.top = '12px';
                buttons.style.right = '60px';
                buttons.style.zIndex = '30';
                buttons.style.display = 'flex';
                buttons.style.gap = '8px';
                const leftButton = document.createElement('button');
                leftButton.className = 'vsc-btn';
                leftButton.title = sidebarCollapsed ? 'Open Left Sidebar' : 'Close Left Sidebar';
                leftButton.onclick = ()=>setSidebarCollapsed(!sidebarCollapsed);
                const leftIcon = document.createElement('span');
                leftIcon.className = `codicon ${sidebarCollapsed ? 'codicon-chevron-right' : 'codicon-chevron-left'}`;
                leftButton.appendChild(leftIcon);
                buttons.appendChild(leftButton);
                const bottomButton = document.createElement('button');
                bottomButton.className = 'vsc-btn';
                bottomButton.title = terminalCollapsed ? 'Open Bottom Panel' : 'Close Bottom Panel';
                bottomButton.onclick = ()=>setTerminalCollapsed(!terminalCollapsed);
                const bottomIcon = document.createElement('span');
                bottomIcon.className = `codicon ${terminalCollapsed ? 'codicon-chevron-up' : 'codicon-chevron-down'}`;
                bottomButton.appendChild(bottomIcon);
                buttons.appendChild(bottomButton);
                const rightButton = document.createElement('button');
                rightButton.className = 'vsc-btn';
                rightButton.title = rightSidebarCollapsed ? 'Open AI Agent Panel' : 'Close AI Agent Panel';
                rightButton.onclick = ()=>setRightSidebarCollapsed(!rightSidebarCollapsed);
                const rightIcon = document.createElement('span');
                rightIcon.className = `codicon ${rightSidebarCollapsed ? 'codicon-chevron-left' : 'codicon-chevron-right'}`;
                rightButton.appendChild(rightIcon);
                buttons.appendChild(rightButton);
                container.appendChild(buttons);
            }
        }
    }, [
        sidebarCollapsed,
        terminalCollapsed,
        rightSidebarCollapsed
    ]);
    // Sidebar views logic
    function renderSidebarView() {
        switch(activeTab){
            case 'explorer':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "explorer-view",
                    className: "sidebar-view active",
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        height: '80vh',
                        minHeight: 0
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                padding: 8,
                                background: '#23272e',
                                borderBottom: '1px solid #222',
                                flex: '0 0 auto'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: '#fff',
                                        marginRight: 8
                                    },
                                    children: "GitHub Repo:"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 521,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select a repository..."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                                            lineNumber: 527,
                                            columnNumber: 17
                                        }, this),
                                        githubRepos.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: r.fullName || r.full_name,
                                                children: r.fullName || r.full_name
                                            }, r.fullName || r.full_name, false, {
                                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                lineNumber: 529,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                    lineNumber: 534,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            lineNumber: 537,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 518,
                    columnNumber: 11
                }, this);
            case 'search':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "search-view",
                    className: "sidebar-view active",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            id: "search-input",
                            placeholder: "Search files...",
                            style: {
                                width: '90%',
                                margin: '8px 5%',
                                padding: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 549,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "search-results"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 550,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 548,
                    columnNumber: 11
                }, this);
            case 'scm':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "scm-view",
                    className: "sidebar-view active",
                    children: "Source Control coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 555,
                    columnNumber: 11
                }, this);
            case 'run':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "run-view",
                    className: "sidebar-view active",
                    children: "Run & Debug coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 559,
                    columnNumber: 11
                }, this);
            case 'extensions':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "extensions-view",
                    className: "sidebar-view active",
                    children: "Extensions coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 563,
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("link", {
                href: "https://cdn.jsdelivr.net/npm/@vscode/codicons/dist/codicon.css",
                rel: "stylesheet"
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 587,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "new-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('new-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-new-file",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 589,
                                columnNumber: 103
                            }, this),
                            "New File"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 589,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "save-file-btn",
                        className: "vsc-btn",
                        onClick: handleSaveFile,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-save",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 590,
                                columnNumber: 81
                            }, this),
                            "Save"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 590,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "rename-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('rename-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-edit",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 591,
                                columnNumber: 109
                            }, this),
                            "Rename"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 591,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "delete-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('delete-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-trash",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 592,
                                columnNumber: 109
                            }, this),
                            "Delete"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 592,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "active-filename",
                        style: {
                            fontWeight: 500,
                            color: '#fff',
                            marginLeft: 16
                        },
                        children: [
                            currentFile,
                            unsavedFiles.has(currentFile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#f55',
                                    marginLeft: 4
                                },
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 593,
                                columnNumber: 142
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 593,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 588,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                        unsavedFiles.has(currentFile) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            style: {
                                color: '#f55',
                                marginLeft: 4
                            },
                            children: "*"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 597,
                            columnNumber: 58
                        }, this),
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-close",
                            style: {
                                marginLeft: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 597,
                            columnNumber: 115
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 596,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 595,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    minHeight: 0,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "activitybar",
                        children: activityTabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                lineNumber: 603,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 601,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-toggle",
                                onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-chevron-left"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 629,
                                    columnNumber: 91
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 629,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-header",
                                children: activityTabs.find((t)=>t.key === activeTab)?.title ?? ''
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 630,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-content",
                                children: !sidebarCollapsed && renderSidebarView()
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 631,
                                columnNumber: 11
                            }, this),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-resizer",
                                onMouseDown: handleSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 636,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 613,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    flex: 1,
                                    minHeight: 0,
                                    minWidth: 0
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MonacoEditor, {
                                    height: "100%",
                                    language: currentFile.endsWith('.md') ? 'markdown' : 'javascript',
                                    value: editorValue,
                                    theme: "vs-dark",
                                    onChange: (v)=>setEditorValue(v || ''),
                                    options: {
                                        minimap: {
                                            enabled: false
                                        }
                                    },
                                    onMount: handleEditorMount
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 644,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 643,
                                columnNumber: 11
                            }, this),
                            !terminalCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: 'relative',
                                    width: '100%'
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            borderTop: '1px solid #222',
                                            background: '#222',
                                            display: 'flex',
                                            alignItems: 'center'
                                        },
                                        children: [
                                            terminals.map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                        terminals.length > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                            lineNumber: 673,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, t.id, true, {
                                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                    lineNumber: 659,
                                                    columnNumber: 19
                                                }, this)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
                                                lineNumber: 680,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 657,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            width: '100%'
                                        },
                                        children: terminals.map((t, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: idx === activeTerminal ? 'block' : 'none',
                                                    width: '100%'
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$vscode$2d$lite$2f$Terminal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, t.id, false, {
                                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 21
                                                }, this)
                                            }, t.id, false, {
                                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                                lineNumber: 684,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 656,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 642,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "rightsidebar",
                        className: rightSidebarCollapsed ? 'collapsed' : '',
                        style: {
                            width: rightSidebarCollapsed ? 0 : rightSidebarWidth,
                            minWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MIN_WIDTH,
                            maxWidth: rightSidebarCollapsed ? 0 : RIGHTSIDEBAR_MAX_WIDTH,
                            transition: 'width 0.2s, min-width 0.2s, max-width 0.2s',
                            overflow: rightSidebarCollapsed ? 'hidden' : undefined,
                            position: 'relative',
                            userSelect: resizingRightSidebar.current ? 'none' : 'auto',
                            display: deepLink.issue ? 'block' : rightSidebarCollapsed ? 'none' : 'block'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "rightsidebar-toggle",
                                onClick: ()=>setRightSidebarCollapsed(!rightSidebarCollapsed),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-chevron-right"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 706,
                                    columnNumber: 106
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 706,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "ai-agent-header",
                                children: "AI Agent"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 707,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "ai-agent-content",
                                style: {
                                    padding: '0 8px 8px 8px',
                                    maxHeight: 'calc(100vh - 80px)',
                                    overflowY: 'auto'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    id: "ai-agent-panel",
                                    children: renderAIAgentPanel()
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 709,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 708,
                                columnNumber: 11
                            }, this),
                            !rightSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rightsidebar-resizer",
                                onMouseDown: handleRightSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 715,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "rightbar",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-chevron-right",
                            id: "collapse-rightbar-btn",
                            title: "Collapse AI Sidebar",
                            onClick: handleAIAgentToggle
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 722,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 721,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "statusbar",
                style: {
                    flex: '0 0 24px',
                    zIndex: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: "VSCode Lite"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 726,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-language",
                        children: currentFile.endsWith('.md') ? 'Markdown' : 'JavaScript'
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 727,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-encoding",
                        children: "UTF-8"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 728,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-eol",
                        children: "LF"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 729,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 725,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    top: 18,
                    right: 22,
                    zIndex: 40,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": sidebarCollapsed ? 'Open Left Sidebar' : 'Close Left Sidebar',
                        title: sidebarCollapsed ? 'Open Left Sidebar' : 'Close Left Sidebar',
                        onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                        style: {
                            background: sidebarCollapsed ? '#23272e' : '#23272e',
                            border: 'none',
                            borderRadius: 4,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: sidebarCollapsed ? '0 0 0 2px #3794ff' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.15s, box-shadow 0.15s',
                            outline: sidebarCollapsed ? '2px solid #3794ff' : 'none',
                            color: sidebarCollapsed ? '#3794ff' : '#d4d4d4'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `codicon ${sidebarCollapsed ? 'codicon-chevron-right' : 'codicon-chevron-left'}`
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 764,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 744,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": terminalCollapsed ? 'Open Bottom Panel' : 'Close Bottom Panel',
                        title: terminalCollapsed ? 'Open Bottom Panel' : 'Close Bottom Panel',
                        onClick: ()=>setTerminalCollapsed(!terminalCollapsed),
                        style: {
                            background: terminalCollapsed ? '#23272e' : '#23272e',
                            border: 'none',
                            borderRadius: 4,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: terminalCollapsed ? '0 0 0 2px #3794ff' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.15s, box-shadow 0.15s',
                            outline: terminalCollapsed ? '2px solid #3794ff' : 'none',
                            color: terminalCollapsed ? '#3794ff' : '#d4d4d4'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `codicon ${terminalCollapsed ? 'codicon-chevron-up' : 'codicon-chevron-down'}`
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 787,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 767,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        "aria-label": rightSidebarCollapsed ? 'Open AI Agent Panel' : 'Close AI Agent Panel',
                        title: rightSidebarCollapsed ? 'Open AI Agent Panel' : 'Close AI Agent Panel',
                        onClick: ()=>setRightSidebarCollapsed(!rightSidebarCollapsed),
                        style: {
                            background: rightSidebarCollapsed ? '#23272e' : '#23272e',
                            border: 'none',
                            borderRadius: 4,
                            width: 32,
                            height: 32,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: rightSidebarCollapsed ? '0 0 0 2px #3794ff' : 'none',
                            cursor: 'pointer',
                            transition: 'background 0.15s, box-shadow 0.15s',
                            outline: rightSidebarCollapsed ? '2px solid #3794ff' : 'none',
                            color: rightSidebarCollapsed ? '#3794ff' : '#d4d4d4'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `codicon ${rightSidebarCollapsed ? 'codicon-chevron-left' : 'codicon-chevron-right'}`
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 810,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 790,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 732,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/page.tsx",
        lineNumber: 586,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__397b6f78._.js.map