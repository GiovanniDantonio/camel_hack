(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/vscode-lite/Terminal.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// Terminal.tsx
__turbopack_context__.s({
    "default": (()=>TerminalMultiTab)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function TerminalTab({ tab, active, onClick, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `term-tab${active ? ' active' : ''}`,
        style: {
            padding: '4px 12px',
            cursor: 'pointer',
            background: active ? '#23272e' : 'none',
            borderRadius: 4,
            marginRight: 4,
            display: 'inline-flex',
            alignItems: 'center'
        },
        onClick: onClick,
        children: [
            tab.name,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "codicon codicon-close",
                style: {
                    marginLeft: 6,
                    fontSize: 14
                },
                onClick: (e)=>{
                    e.stopPropagation();
                    onClose();
                }
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
_c = TerminalTab;
function TerminalMultiTab() {
    _s();
    const [tabs, setTabs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
            name: 'Terminal 1'
        }
    ]);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const xtermRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const termInstances = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const [outputs, setOutputs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        ''
    ]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [termHeight, setTermHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(200);
    const resizing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startHeight = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(200);
    // Remove the WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW thing by hiding the xterm-char-measure-element
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalMultiTab.useEffect": ()=>{
            const style = document.createElement('style');
            style.innerHTML = `.xterm-char-measure-element { display: none !important; }`;
            document.head.appendChild(style);
            return ({
                "TerminalMultiTab.useEffect": ()=>{
                    document.head.removeChild(style);
                }
            })["TerminalMultiTab.useEffect"];
        }
    }["TerminalMultiTab.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TerminalMultiTab.useEffect": ()=>{
            // Only create terminals for visible tabs
            xtermRefs.current.forEach({
                "TerminalMultiTab.useEffect": async (ref, i)=>{
                    if (!ref) return;
                    // If terminal instance already exists, skip
                    if (termInstances.current[i] && ref.querySelector('.xterm')) return;
                    const XTerm = (await __turbopack_context__.r("[project]/node_modules/xterm/lib/xterm.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).Terminal;
                    const FitAddon = (await __turbopack_context__.r("[project]/node_modules/xterm-addon-fit/lib/xterm-addon-fit.js [app-client] (ecmascript, async loader)")(__turbopack_context__.i)).FitAddon;
                    const fitAddon = new FitAddon();
                    const term = new XTerm({
                        theme: {
                            background: '#1e1e1e',
                            foreground: '#d4d4d4'
                        },
                        fontSize: 14,
                        rows: 10,
                        fontFamily: 'Fira Mono, Consolas, monospace',
                        cursorBlink: true,
                        allowProposedApi: true,
                        windowsMode: false,
                        cols: 80,
                        scrollback: 1000
                    });
                    term.loadAddon(fitAddon);
                    term.open(ref);
                    fitAddon.fit();
                    // Prompt and shell output formatting
                    function prompt(term, cwd) {
                        term.write(`\r\n${cwd} $ `);
                    }
                    let cwd = '/';
                    prompt(term, cwd);
                    let command = '';
                    term.onKey({
                        "TerminalMultiTab.useEffect": async (e)=>{
                            const ev = e.domEvent;
                            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
                            if (ev.keyCode === 13) {
                                term.write('\r\n');
                                if (command.trim()) {
                                    setLoading(true);
                                    const res = await fetch('/api/terminal', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            tabId: tabs[i].id,
                                            input: command + '\n'
                                        })
                                    });
                                    const data = await res.json();
                                    term.write(data.output);
                                    setLoading(false);
                                }
                                command = '';
                                prompt(term, cwd);
                            } else if (ev.keyCode === 8) {
                                if (command.length > 0) {
                                    term.write('\b \b');
                                    command = command.slice(0, -1);
                                }
                            } else if (printable) {
                                command += e.key;
                                term.write(e.key);
                            }
                        }
                    }["TerminalMultiTab.useEffect"]);
                    termInstances.current[i] = term;
                }
            }["TerminalMultiTab.useEffect"]);
        // eslint-disable-next-line
        }
    }["TerminalMultiTab.useEffect"], [
        tabs,
        activeTab
    ]);
    // Add new terminal tab
    function handleAddTab() {
        setTabs((tabs)=>[
                ...tabs,
                {
                    id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])(),
                    name: `Terminal ${tabs.length + 1}`
                }
            ]);
        setOutputs((outputs)=>[
                ...outputs,
                ''
            ]);
        setActiveTab(tabs.length);
    }
    // Remove terminal tab
    function handleCloseTab(idx) {
        const tabId = tabs[idx].id;
        fetch('/api/terminal', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tabId
            })
        });
        setTabs((tabs)=>tabs.filter((_, i)=>i !== idx));
        setOutputs((outputs)=>outputs.filter((_, i)=>i !== idx));
        if (activeTab >= idx && activeTab > 0) setActiveTab(activeTab - 1);
    }
    // Terminal resize handlers (vertical drag)
    function handleResizeStart(e) {
        resizing.current = true;
        startY.current = e.clientY;
        startHeight.current = termHeight;
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
        // Invert the direction: dragging up should decrease height, down should increase
        let newHeight = startHeight.current - (e.clientY - startY.current);
        if (newHeight < 120) newHeight = 120;
        if (newHeight > 600) newHeight = 600;
        setTermHeight(newHeight);
    }
    function handleResizeEnd(e) {
        resizing.current = false;
        document.body.style.cursor = '';
        window.removeEventListener('mousemove', handleResizeDrag);
        window.removeEventListener('mouseup', handleResizeEnd);
        if (e) e.preventDefault();
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        id: "terminal-outer-panel",
        style: {
            background: '#1e1e1e',
            borderTop: '1px solid #222',
            width: '100%',
            minHeight: 120,
            display: 'flex',
            flexDirection: 'column',
            height: termHeight + 34,
            userSelect: resizing.current ? 'none' : 'auto'
        },
        onMouseDown: (e)=>{
            // Only start resize if the event is at the very top (from parent resizer)
            if (e.nativeEvent.offsetY <= 10) {
                handleResizeStart(e);
            }
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "terminal-tabs",
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px 8px',
                    borderBottom: '1px solid #222',
                    minHeight: 34
                },
                children: [
                    tabs.map((tab, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TerminalTab, {
                            tab: tab,
                            active: i === activeTab,
                            onClick: ()=>setActiveTab(i),
                            onClose: ()=>handleCloseTab(i)
                        }, tab.id, false, {
                            fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                            lineNumber: 172,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "codicon codicon-add",
                        id: "add-terminal-btn",
                        style: {
                            marginLeft: 8,
                            cursor: 'pointer',
                            fontSize: 18
                        },
                        onClick: handleAddTab
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "terminal-container",
                style: {
                    width: '100%',
                    flex: 1,
                    background: '#1e1e1e',
                    position: 'relative',
                    transition: 'height 0.18s cubic-bezier(.4,2,.6,1)',
                    overflow: 'hidden',
                    borderBottom: '1px solid #222',
                    minHeight: 80
                },
                onClick: ()=>{
                    // Focus the terminal when clicking anywhere in the terminal container
                    const textarea = xtermRefs.current[activeTab]?.querySelector?.('textarea');
                    if (textarea) textarea.focus();
                },
                children: [
                    tabs.map((tab, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: i === activeTab ? 'block' : 'none',
                                width: '100%',
                                height: '100%'
                            },
                            ref: (el)=>{
                                xtermRefs.current[i] = el;
                                return undefined;
                            },
                            tabIndex: 0
                        }, tab.id, false, {
                            fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                            lineNumber: 192,
                            columnNumber: 11
                        }, this)),
                    loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: 'absolute',
                            top: 8,
                            right: 16,
                            color: '#fff',
                            fontSize: 12
                        },
                        children: "Running..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                        lineNumber: 202,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/Terminal.tsx",
        lineNumber: 162,
        columnNumber: 5
    }, this);
}
_s(TerminalMultiTab, "bybDIODKmXf42CzOvi07BuxFNCE=");
_c1 = TerminalMultiTab;
var _c, _c1;
__turbopack_context__.k.register(_c, "TerminalTab");
__turbopack_context__.k.register(_c1, "TerminalMultiTab");
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
    const [folderTree] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState({
        src: {
            'main.js': `function hello() {\n\tconsole.log('Hello World!');\n}`,
            'utils.js': ''
        },
        'README.md': '# VSCode Lite'
    });
    const [currentFile, setCurrentFile] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState('src/main.js');
    const [editorValue, setEditorValue] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useState(folderTree.src['main.js']);
    // Render folder tree
    function renderFolderTree(tree, parentPath = '') {
        return Object.entries(tree).map(([name, value])=>{
            const fullPath = parentPath ? parentPath + '/' + name : name;
            if (typeof value === 'string') {
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
                        setEditorValue(value);
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-file-code",
                            style: {
                                marginRight: 6
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 68,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: name
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 69,
                            columnNumber: 13
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, this);
            } else {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        paddingLeft: parentPath ? 20 : 8
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                fontWeight: 'bold'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-folder",
                                    style: {
                                        marginRight: 6
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 76,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: name
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: renderFolderTree(value, fullPath)
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 79,
                            columnNumber: 13
                        }, this)
                    ]
                }, fullPath, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 74,
                    columnNumber: 11
                }, this);
            }
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
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "folder-tree",
                        children: renderFolderTree(folderTree)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 158,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 157,
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
                            lineNumber: 164,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "search-results"
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 165,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 163,
                    columnNumber: 11
                }, this);
            case 'scm':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "scm-view",
                    className: "sidebar-view active",
                    children: "Source Control coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 170,
                    columnNumber: 11
                }, this);
            case 'run':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "run-view",
                    className: "sidebar-view active",
                    children: "Run & Debug coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 174,
                    columnNumber: 11
                }, this);
            case 'extensions':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    id: "extensions-view",
                    className: "sidebar-view active",
                    children: "Extensions coming soon..."
                }, void 0, false, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 178,
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
                lineNumber: 202,
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
                                lineNumber: 204,
                                columnNumber: 103
                            }, this),
                            "New File"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        id: "save-file-btn",
                        className: "vsc-btn",
                        onClick: ()=>handleToolbarAction('save-file'),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "codicon codicon-save",
                                style: {
                                    marginRight: 4
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 205,
                                columnNumber: 105
                            }, this),
                            "Save"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 205,
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
                                lineNumber: 206,
                                columnNumber: 109
                            }, this),
                            "Rename"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 206,
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
                                lineNumber: 207,
                                columnNumber: 109
                            }, this),
                            "Delete"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "active-filename",
                        style: {
                            fontWeight: 500,
                            color: '#fff',
                            marginLeft: 16
                        },
                        children: currentFile
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 203,
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
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "codicon codicon-close",
                            style: {
                                marginLeft: 4
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 212,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 210,
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
                                    lineNumber: 222,
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
                                    lineNumber: 222,
                                    columnNumber: 112
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 222,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 217,
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
                                    lineNumber: 230,
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
                                    lineNumber: 230,
                                    columnNumber: 120
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 230,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 225,
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
                                    lineNumber: 238,
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
                                    lineNumber: 238,
                                    columnNumber: 113
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                            lineNumber: 238,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 215,
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
                                lineNumber: 244,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 242,
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
                            userSelect: resizingSidebar.current ? 'none' : 'auto'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-toggle",
                                onClick: ()=>setSidebarCollapsed(!sidebarCollapsed),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "codicon codicon-chevron-left"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/vscode-lite/page.tsx",
                                    lineNumber: 267,
                                    columnNumber: 91
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 267,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-header",
                                children: activityTabs.find((t)=>t.key === activeTab)?.title ?? ''
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "sidebar-content",
                                children: !sidebarCollapsed && renderSidebarView()
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 269,
                                columnNumber: 11
                            }, this),
                            !sidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sidebar-resizer",
                                onMouseDown: handleSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 274,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 254,
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
                                    lineNumber: 282,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 281,
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
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: 7,
                                            cursor: 'ns-resize',
                                            zIndex: 30,
                                            background: 'transparent'
                                        },
                                        onMouseDown: (e)=>{
                                            // Bubble the event to the terminal for resize
                                            const term = document.getElementById('terminal-outer-panel');
                                            if (term) {
                                                const evt = new MouseEvent('mousedown', e);
                                                term.dispatchEvent(evt);
                                            }
                                        },
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
                                            fileName: "[project]/src/app/vscode-lite/page.tsx",
                                            lineNumber: 306,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 295,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$vscode$2d$lite$2f$Terminal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                                        lineNumber: 308,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 280,
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
                                    lineNumber: 325,
                                    columnNumber: 106
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 325,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                id: "ai-agent-header",
                                children: "AI Agent"
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 326,
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
                                        lineNumber: 328,
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
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this),
                            !rightSidebarCollapsed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rightsidebar-resizer",
                                onMouseDown: handleRightSidebarResizeStart
                            }, void 0, false, {
                                fileName: "[project]/src/app/vscode-lite/page.tsx",
                                lineNumber: 333,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 312,
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
                            lineNumber: 340,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 339,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 241,
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
                        lineNumber: 344,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-language",
                        children: currentFile.endsWith('.md') ? 'Markdown' : 'JavaScript'
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-encoding",
                        children: "UTF-8"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        id: "status-eol",
                        children: "LF"
                    }, void 0, false, {
                        fileName: "[project]/src/app/vscode-lite/page.tsx",
                        lineNumber: 347,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/vscode-lite/page.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/vscode-lite/page.tsx",
        lineNumber: 201,
        columnNumber: 5
    }, this);
}
_s(VSCodeLitePage, "FIHPrxtm9bgjm467170fuI75734=");
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
"[project]/node_modules/uuid/dist/esm-browser/native.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const randomUUID = typeof crypto !== 'undefined' && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const __TURBOPACK__default__export__ = {
    randomUUID
};
}}),
"[project]/node_modules/uuid/dist/esm-browser/rng.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>rng)
});
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
    if (!getRandomValues) {
        if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
            throw new Error('crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported');
        }
        getRandomValues = crypto.getRandomValues.bind(crypto);
    }
    return getRandomValues(rnds8);
}
}}),
"[project]/node_modules/uuid/dist/esm-browser/regex.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
const __TURBOPACK__default__export__ = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/i;
}}),
"[project]/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$regex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/regex.js [app-client] (ecmascript)");
;
function validate(uuid) {
    return typeof uuid === 'string' && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$regex$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].test(uuid);
}
const __TURBOPACK__default__export__ = validate;
}}),
"[project]/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "unsafeStringify": (()=>unsafeStringify)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/validate.js [app-client] (ecmascript)");
;
const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
    return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
function stringify(arr, offset = 0) {
    const uuid = unsafeStringify(arr, offset);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$validate$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(uuid)) {
        throw TypeError('Stringified UUID is invalid');
    }
    return uuid;
}
const __TURBOPACK__default__export__ = stringify;
}}),
"[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$native$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/native.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/rng.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/stringify.js [app-client] (ecmascript)");
;
;
;
function v4(options, buf, offset) {
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$native$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].randomUUID && !buf && !options) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$native$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].randomUUID();
    }
    options = options || {};
    const rnds = options.random ?? options.rng?.() ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$rng$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    if (rnds.length < 16) {
        throw new Error('Random bytes length must be >= 16');
    }
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80;
    if (buf) {
        offset = offset || 0;
        if (offset < 0 || offset + 16 > buf.length) {
            throw new RangeError(`UUID byte range ${offset}:${offset + 15} is out of buffer bounds`);
        }
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$stringify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["unsafeStringify"])(rnds);
}
const __TURBOPACK__default__export__ = v4;
}}),
"[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript) <export default as v4>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "v4": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$esm$2d$browser$2f$v4$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/esm-browser/v4.js [app-client] (ecmascript)");
}}),
}]);

//# sourceMappingURL=_2eb014d3._.js.map