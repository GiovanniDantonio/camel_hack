import * as monaco from 'monaco-editor';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

// Initialize Monaco
const editor = monaco.editor.create(document.getElementById('container'), {
  value: `function hello() {\n\tconsole.log('Hello, world!');\n}`,
  language: 'javascript',
  theme: 'vs-dark',
});

// --- Folder Tree Data Structure ---
let folderTree = {
  'src': {
    'main.js': 'function hello() {\n\tconsole.log(\'Hello World!\');\n}',
    'utils.js': '',
  },
  'README.md': '# VSCode Lite',
};

// --- Persistence ---
function saveToStorage() {
  localStorage.setItem('vscode-lite-folderTree', JSON.stringify(folderTree));
  localStorage.setItem('vscode-lite-files', JSON.stringify(files));
}
function loadFromStorage() {
  const tree = localStorage.getItem('vscode-lite-folderTree');
  const fs = localStorage.getItem('vscode-lite-files');
  if (tree && fs) {
    try {
      folderTree = JSON.parse(tree);
      Object.assign(files, JSON.parse(fs));
    } catch {}
  }
}
loadFromStorage();

// --- Helper: Render Folder Tree ---
function renderFolderTree(tree, parentPath = '', parentTree = null) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  Object.entries(tree).forEach(([name, value]) => {
    const fullPath = parentPath ? parentPath + '/' + name : name;
    const node = document.createElement('div');
    node.style.display = 'flex';
    node.style.alignItems = 'center';
    node.style.paddingLeft = parentPath ? '20px' : '8px';
    node.oncontextmenu = (e) => showContextMenu(e, typeof value === 'string' ? 'file' : 'folder', fullPath, tree);
    if (typeof value === 'string') {
      node.innerHTML = `<span class='codicon codicon-file-code' style='margin-right:6px;'></span><span>${name}</span>`;
      node.className = 'file' + (fullPath === currentFile ? ' active' : '');
      node.onclick = () => {
        saveCurrentFile();
        openFileInTab(fullPath);
        updateFolderTree();
      };
      container.appendChild(node);
    } else {
      let expanded = true;
      const folderRow = document.createElement('div');
      folderRow.style.display = 'flex';
      folderRow.style.alignItems = 'center';
      folderRow.style.paddingLeft = parentPath ? '20px' : '8px';
      folderRow.className = 'folder';
      folderRow.oncontextmenu = (e) => showContextMenu(e, 'folder', fullPath, tree);
      const folderIcon = document.createElement('span');
      folderIcon.className = 'codicon codicon-folder';
      folderIcon.style.marginRight = '6px';
      folderIcon.style.cursor = 'pointer';
      folderIcon.onclick = (e) => {
        e.stopPropagation();
        expanded = !expanded;
        children.style.display = expanded ? '' : 'none';
        folderIcon.className = expanded ? 'codicon codicon-folder-opened' : 'codicon codicon-folder';
      };
      folderRow.appendChild(folderIcon);
      const folderName = document.createElement('span');
      folderName.textContent = name;
      folderName.style.fontWeight = 'bold';
      folderRow.appendChild(folderName);
      // Add + button for new file/folder
      const plusBtn = document.createElement('span');
      plusBtn.className = 'codicon codicon-add';
      plusBtn.style.marginLeft = 'auto';
      plusBtn.style.opacity = 0.6;
      plusBtn.style.cursor = 'pointer';
      plusBtn.title = 'Add file/folder';
      plusBtn.onclick = (e) => {
        e.stopPropagation();
        showContextMenu(e, 'folder', fullPath, tree);
      };
      folderRow.appendChild(plusBtn);
      container.appendChild(folderRow);
      const children = renderFolderTree(value, fullPath, tree);
      children.style.display = expanded ? '' : 'none';
      container.appendChild(children);
    }
  });
  return container;
}

// --- Folder Tree Context Menu & Buttons ---
function showContextMenu(e, type, fullPath, parentTree) {
  e.preventDefault();
  let menu = document.getElementById('context-menu');
  if (menu) menu.remove();
  menu = document.createElement('div');
  menu.id = 'context-menu';
  menu.style.position = 'fixed';
  menu.style.top = e.clientY + 'px';
  menu.style.left = e.clientX + 'px';
  menu.style.background = '#23272e';
  menu.style.color = '#fff';
  menu.style.border = '1px solid #222';
  menu.style.padding = '4px 0';
  menu.style.zIndex = 9999;
  menu.style.minWidth = '140px';

  function addItem(label, handler) {
    const item = document.createElement('div');
    item.textContent = label;
    item.style.padding = '6px 20px';
    item.style.cursor = 'pointer';
    item.onmouseenter = () => item.style.background = '#2a2d33';
    item.onmouseleave = () => item.style.background = 'none';
    item.onclick = () => { handler(); menu.remove(); };
    menu.appendChild(item);
  }

  if (type === 'folder') {
    addItem('New File', () => createFileInTree(fullPath));
    addItem('New Folder', () => createFolderInTree(fullPath));
    addItem('Rename', () => renameInTree(fullPath, parentTree, true));
    addItem('Delete', () => deleteInTree(fullPath, parentTree, true));
  } else if (type === 'file') {
    addItem('Rename', () => renameInTree(fullPath, parentTree, false));
    addItem('Delete', () => deleteInTree(fullPath, parentTree, false));
  }
  document.body.appendChild(menu);
  document.onclick = () => { menu.remove(); document.onclick = null; };
}

function createFileInTree(folderPath) {
  const name = prompt('New file name:');
  if (!name) return;
  const parts = folderPath.split('/');
  let node = folderTree;
  for (const part of parts) if (part) node = node[part];
  if (node[name]) { alert('File/folder exists!'); return; }
  node[name] = '';
  files[folderPath ? folderPath + '/' + name : name] = '';
  updateFolderTree();
  saveToStorage();
}
function createFolderInTree(folderPath) {
  const name = prompt('New folder name:');
  if (!name) return;
  const parts = folderPath.split('/');
  let node = folderTree;
  for (const part of parts) if (part) node = node[part];
  if (node[name]) { alert('File/folder exists!'); return; }
  node[name] = {};
  updateFolderTree();
  saveToStorage();
}
function renameInTree(fullPath, parentTree, isFolder) {
  const parts = fullPath.split('/');
  const oldName = parts.pop();
  const newName = prompt('Rename to:', oldName);
  if (!newName || newName === oldName || parentTree[newName]) return;
  parentTree[newName] = parentTree[oldName];
  delete parentTree[oldName];
  if (!isFolder) {
    files[parts.concat([newName]).join('/')] = files[fullPath];
    delete files[fullPath];
  }
  updateFolderTree();
  saveToStorage();
}
function deleteInTree(fullPath, parentTree, isFolder) {
  if (!confirm('Delete ' + fullPath + '?')) return;
  delete parentTree[fullPath.split('/').pop()];
  if (!isFolder) delete files[fullPath];
  updateFolderTree();
  saveToStorage();
}

// --- Replace fileList with folder tree rendering ---
function updateFolderTree() {
  const treeContainer = document.getElementById('folder-tree');
  if (!treeContainer) return;
  treeContainer.innerHTML = '';
  treeContainer.appendChild(renderFolderTree(folderTree));
}

// --- Activity Bar Switching ---
const activityIcons = document.querySelectorAll('#activitybar .codicon');
activityIcons.forEach(icon => {
  icon.onclick = () => {
    activityIcons.forEach(i => i.classList.remove('active'));
    icon.classList.add('active');
    const view = icon.getAttribute('data-view');
    document.querySelectorAll('.sidebar-view').forEach(v => {
      v.style.display = v.id.startsWith(view) ? '' : 'none';
    });
    // Update sidebar header
    const header = document.getElementById('sidebar-header');
    header.textContent = icon.title || '';
    setSidebarView(view);
  };
});
document.getElementById('sidebar-header').textContent = 'Explorer';

// --- Tab Dirty State ---
let dirtyFiles = new Set();
editor.onDidChangeModelContent(() => {
  if (currentFile && editor.getValue() !== files[currentFile]) {
    dirtyFiles.add(currentFile);
  } else {
    dirtyFiles.delete(currentFile);
  }
  updateTabBar();
});

// Example file list
const files = {
  "src/main.js": "function hello() {\n\tconsole.log('Hello World!');\n}",
  "src/utils.js": "",
  "README.md": "# VSCode Lite",
};

// Populate sidebar with files
let currentFile = Object.keys(files)[0];
editor.setValue(files[currentFile]);

// Highlight active file in sidebar
function updateActiveFilename() {
  const active = document.getElementById('active-filename');
  if (active) active.textContent = currentFile ? `Editing: ${currentFile}` : '';
}

function saveCurrentFile() {
  if (currentFile) {
    files[currentFile] = editor.getValue();
  }
}

// --- VSCode Lite Features ---
let openTabs = [currentFile];
function updateTabBar() {
  const tabbar = document.getElementById('tabbar');
  tabbar.innerHTML = '';
  openTabs.forEach(filename => {
    const tab = document.createElement('div');
    tab.className = 'tab' + (filename === currentFile ? ' active' : '');
    const dirty = dirtyFiles.has(filename) ? '<span style="color:#e0af68;font-size:18px;margin-left:2px;">●</span>' : '';
    tab.innerHTML = `<span class="codicon codicon-file-code"></span> ${filename} ${dirty} <span class="codicon codicon-close"></span>`;
    tab.onclick = e => {
      if (e.target.classList.contains('codicon-close')) {
        // Close tab
        openTabs = openTabs.filter(f => f !== filename);
        if (currentFile === filename) {
          currentFile = openTabs[openTabs.length-1] || Object.keys(files)[0] || '';
          editor.setValue(currentFile ? files[currentFile] : '');
          updateActiveFilename();
        }
        updateTabBar();
      } else {
        saveCurrentFile();
        currentFile = filename;
        editor.setValue(files[filename]);
        updateTabBar();
        updateFolderTree();
        updateActiveFilename();
      }
    };
    tabbar.appendChild(tab);
  });
}

// Open file in tab if not already open
function openFileInTab(filename) {
  if (!openTabs.includes(filename)) openTabs.push(filename);
  currentFile = filename;
  editor.setValue(files[filename]);
  updateTabBar();
  updateFolderTree();
  updateActiveFilename();
}

// Toolbar actions
const newFileBtn = document.getElementById('new-file-btn');
const saveFileBtn = document.getElementById('save-file-btn');
const renameFileBtn = document.getElementById('rename-file-btn');
const deleteFileBtn = document.getElementById('delete-file-btn');

newFileBtn.onclick = () => {
  const name = prompt('Enter new file name:');
  if (name && !files[name]) {
    saveCurrentFile();
    files[name] = '';
    openFileInTab(name);
    updateFolderTree();
    updateActiveFilename();
  } else if (files[name]) {
    alert('File already exists!');
  }
};

saveFileBtn.onclick = () => {
  saveCurrentFile();
  dirtyFiles.delete(currentFile);
  updateTabBar();
  alert('File saved!');
};

renameFileBtn.onclick = () => {
  const newName = prompt('Enter new name:', currentFile);
  if (newName && newName !== currentFile && !files[newName]) {
    files[newName] = files[currentFile];
    delete files[currentFile];
    openTabs = openTabs.map(f => f === currentFile ? newName : f);
    currentFile = newName;
    updateTabBar();
    updateFolderTree();
    updateActiveFilename();
  } else if (files[newName]) {
    alert('File already exists!');
  }
};

deleteFileBtn.onclick = () => {
  if (confirm(`Delete ${currentFile}?`)) {
    delete files[currentFile];
    openTabs = openTabs.filter(f => f !== currentFile);
    const remaining = openTabs.length ? openTabs : Object.keys(files);
    currentFile = remaining[0] || '';
    editor.setValue(currentFile ? files[currentFile] : '');
    updateTabBar();
    updateFolderTree();
    updateActiveFilename();
  }
};

// --- Search Panel ---
document.getElementById('search-input').oninput = function() {
  const q = this.value.toLowerCase();
  const results = [];
  for (const [path, content] of Object.entries(files)) {
    if (path.toLowerCase().includes(q) || content.toLowerCase().includes(q)) {
      results.push(path);
    }
  }
  const resultDiv = document.getElementById('search-results');
  resultDiv.innerHTML = '';
  results.forEach(path => {
    const el = document.createElement('div');
    el.textContent = path;
    el.className = 'file';
    el.onclick = () => {
      saveCurrentFile();
      openFileInTab(path);
    };
    resultDiv.appendChild(el);
  });
};

// --- SCM Panel (Dirty Files) ---
document.getElementById('scm-view').innerHTML = '<b>Changes:</b><div id="scm-list"></div>';
function updateSCMList() {
  const scmList = document.getElementById('scm-list');
  if (!scmList) return;
  scmList.innerHTML = '';
  dirtyFiles.forEach(f => {
    const el = document.createElement('div');
    el.textContent = f;
    el.className = 'file';
    el.onclick = () => {
      saveCurrentFile();
      openFileInTab(f);
    };
    scmList.appendChild(el);
  });
}

// --- Run Panel ---
document.getElementById('run-view').innerHTML = '<button id="run-current-file">Run Current File</button><pre id="run-output"></pre>';
document.getElementById('run-current-file').onclick = () => {
  const output = document.getElementById('run-output');
  output.textContent = 'Running ' + currentFile + '...\n' + (files[currentFile] || '(empty)');
};

// --- Extensions Panel ---
document.getElementById('extensions-view').innerHTML = '<b>Extensions (Mock):</b><ul><li>Prettier Formatter</li><li>Python</li><li>ESLint</li><li>GitLens</li></ul>';

// --- Update all panels and persist on change ---
function updateAllPanels() {
  updateFolderTree();
  updateTabBar();
  updateSCMList();
  saveToStorage();
}

// Update hooks
editor.onDidChangeModelContent(() => {
  if (currentFile && editor.getValue() !== files[currentFile]) {
    dirtyFiles.add(currentFile);
  } else {
    dirtyFiles.delete(currentFile);
  }
  updateTabBar();
  updateSCMList();
  saveToStorage();
});

// Update after file/folder actions
updateAllPanels();

// --- Terminal using xterm.js ---
let terminals = [];
let activeTerminal = 0;
let cwd = '';
function resolvePath(path) {
  if (!path || path === '.') return cwd;
  if (path === '/') return '';
  if (path.startsWith('/')) return path.slice(1);
  if (cwd === '') return path;
  // Support ../ and ./
  const parts = (cwd + '/' + path).split('/');
  const stack = [];
  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else stack.push(part);
  }
  return stack.join('/');
}

// --- Tidy Terminal Output: Prompt, Command Echo, Output Formatting ---
function getPrompt() {
  return `\u001b[1;36m${cwd ? '/' + cwd : '~'}\u001b[0m$ `;
}
function createTerminalInstance() {
  const term = new Terminal({
    theme: {
      background: '#1e1e1e',
      foreground: '#d4d4d4',
    },
    fontSize: 14,
    rows: 10,
    fontFamily: 'Fira Mono, Consolas, monospace',
    cursorBlink: true,
  });
  term.prompt = () => {
    term.write('\r\n' + getPrompt());
  };
  term.write('Welcome to VSCode Lite Terminal! Type help for commands.');
  term.prompt();
  let command = '';
  let inputStart = 0;
  term.onKey(e => {
    const ev = e.domEvent;
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
    if (ev.keyCode === 13) { // Enter
      term.write('\r\n');
      if (command.trim()) {
        // Echo the command (only if not already shown)
        // Already shown in prompt line, so do not repeat
        const [cmd, ...args] = command.trim().split(' ');
        const rest = args.join(' ');
        const handler = shellCommands[cmd];
        let result = '';
        if (handler) {
          result = handler(rest);
        } else {
          result = `command not found: ${cmd}`;
        }
        if (result !== undefined && result !== '') {
          term.write(result.toString().replace(/\n/g, '\r\n'));
        }
      }
      command = '';
      term.prompt();
      inputStart = 0;
    } else if (ev.keyCode === 8) { // Backspace
      if (command.length > 0) {
        term.write('\b \b');
        command = command.slice(0, -1);
      }
    } else if (printable) {
      command += e.key;
      term.write(e.key);
    }
  });
  return term;
}
function renderTerminals() {
  const container = document.getElementById('terminal-container');
  container.innerHTML = '';
  terminals.forEach((term, i) => {
    const termDiv = document.createElement('div');
    termDiv.style.display = i === activeTerminal ? '' : 'none';
    termDiv.style.width = '100%';
    termDiv.style.height = '172px';
    container.appendChild(termDiv);
    if (!term._initialized) {
      term.open(termDiv);
      term._initialized = true;
    }
  });
  // Tab bar
  const tabBar = document.getElementById('terminal-tabs');
  tabBar.querySelectorAll('.term-tab').forEach((tab, i) => {
    tab.classList.toggle('active', i === activeTerminal);
  });
}
function addTerminal() {
  terminals.push(createTerminalInstance());
  activeTerminal = terminals.length - 1;
  updateTerminalTabs();
  renderTerminals();
}
function closeTerminal(idx) {
  if (terminals.length === 1) return;
  terminals.splice(idx, 1);
  if (activeTerminal >= terminals.length) activeTerminal = terminals.length - 1;
  updateTerminalTabs();
  renderTerminals();
}
function updateTerminalTabs() {
  const tabBar = document.getElementById('terminal-tabs');
  tabBar.innerHTML = '';
  terminals.forEach((_, i) => {
    const tab = document.createElement('span');
    tab.className = 'term-tab' + (i === activeTerminal ? ' active' : '');
    tab.setAttribute('data-index', i);
    tab.innerHTML = `Terminal ${i + 1} <span class='codicon codicon-close'></span>`;
    tab.onclick = e => {
      if (e.target.classList.contains('codicon-close')) {
        closeTerminal(i);
      } else {
        activeTerminal = i;
        updateTerminalTabs();
        renderTerminals();
      }
    };
    tabBar.appendChild(tab);
  });
  // Add button
  const addBtn = document.createElement('span');
  addBtn.className = 'codicon codicon-add';
  addBtn.id = 'add-terminal-btn';
  addBtn.onclick = addTerminal;
  tabBar.appendChild(addBtn);
  // Collapse button
  const collapseBtn = document.createElement('span');
  collapseBtn.style.marginLeft = 'auto';
  collapseBtn.style.cursor = 'pointer';
  collapseBtn.id = 'collapse-terminal-btn';
  collapseBtn.innerHTML = `<span class='codicon codicon-chevron-down'></span>`;
  collapseBtn.onclick = () => {
    const panel = document.getElementById('terminal-panel');
    panel.classList.toggle('collapsed');
  };
  tabBar.appendChild(collapseBtn);
}
// Initialize first terminal
terminals = [createTerminalInstance()];
activeTerminal = 0;
window.addEventListener('DOMContentLoaded', () => {
  updateTerminalTabs();
  renderTerminals();
});

// --- Right Sidebar: AI Agent ---
const rightbar = document.getElementById('rightbar');
const rightsidebar = document.getElementById('rightsidebar');
const rightsidebarToggle = document.getElementById('rightsidebar-toggle');
const openAIAgentBtn = document.getElementById('open-ai-agent');
const collapseRightbarBtn = document.getElementById('collapse-rightbar-btn');

function showRightSidebar() {
  rightsidebar.classList.remove('collapsed');
  rightsidebarToggle.querySelector('.codicon').className = 'codicon codicon-chevron-right';
}
function hideRightSidebar() {
  rightsidebar.classList.add('collapsed');
  rightsidebarToggle.querySelector('.codicon').className = 'codicon codicon-chevron-left';
}
openAIAgentBtn.onclick = function() {
  if (rightsidebar.classList.contains('collapsed')) {
    showRightSidebar();
    this.classList.add('active');
  } else {
    hideRightSidebar();
    this.classList.remove('active');
  }
};
rightsidebarToggle.onclick = function() {
  if (rightsidebar.classList.contains('collapsed')) {
    showRightSidebar();
    openAIAgentBtn.classList.add('active');
  } else {
    hideRightSidebar();
    openAIAgentBtn.classList.remove('active');
  }
};
collapseRightbarBtn.onclick = function() {
  hideRightSidebar();
  openAIAgentBtn.classList.remove('active');
};

// --- Bottom Panel Toggle (Terminal) ---
const terminalPanel = document.getElementById('terminal-panel');
const bottomPanelToggle = document.getElementById('bottom-panel-toggle');
bottomPanelToggle.onclick = function() {
  terminalPanel.classList.toggle('collapsed');
  if (terminalPanel.classList.contains('collapsed')) {
    this.className = 'codicon codicon-chevron-down';
  } else {
    this.className = 'codicon codicon-chevron-up';
  }
};

// --- Sidebar Collapse/Expand (VSCode-accurate) ---
const activityBar = document.getElementById('activitybar');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');

function showSidebar() {
  sidebar.classList.remove('collapsed');
  sidebarToggle.querySelector('.codicon').className = 'codicon codicon-chevron-left';
}
function hideSidebar() {
  sidebar.classList.add('collapsed');
  sidebarToggle.querySelector('.codicon').className = 'codicon codicon-chevron-right';
}

// VSCode: clicking the Explorer icon toggles the sidebar (if already open, closes it; if closed, opens it)
activityBar.querySelectorAll('span[data-view]').forEach(icon => {
  icon.onclick = function() {
    const view = this.getAttribute('data-view');
    if (sidebar.classList.contains('collapsed')) {
      showSidebar();
      setSidebarView(view);
    } else {
      // If clicking the current view, collapse; else switch view
      if (document.querySelector('.sidebar-view.active')?.id.startsWith(view)) {
        hideSidebar();
      } else {
        setSidebarView(view);
      }
    }
    // Highlight the active icon
    activityBar.querySelectorAll('span').forEach(i => i.classList.remove('active'));
    this.classList.add('active');
  };
});
// Sidebar chevron always expands/collapses
sidebarToggle.onclick = function() {
  if (sidebar.classList.contains('collapsed')) {
    showSidebar();
  } else {
    hideSidebar();
  }
};

function setSidebarView(view) {
  document.querySelectorAll('.sidebar-view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById(view + '-view');
  if (v) {
    v.classList.add('active');
    // Also update the sidebar header to match the selected view
    const sidebarHeader = document.getElementById('sidebar-header');
    let headerText = '';
    switch(view) {
      case 'explorer': headerText = 'Explorer'; break;
      case 'search': headerText = 'Search'; break;
      case 'scm': headerText = 'Source Control'; break;
      case 'run': headerText = 'Run & Debug'; break;
      case 'extensions': headerText = 'Extensions'; break;
      default: headerText = '';
    }
    if (sidebarHeader) sidebarHeader.textContent = headerText;
  }
}

// Ensure sidebar stays open on startup
showSidebar();

// Terminal command handlers
const shellCommands = {
  ls: (args) => {
    let dir = cwd;
    if (args) dir = resolvePath(args);
    // Find all files and directories directly under dir
    const prefix = dir ? dir + '/' : '';
    const entries = new Set();
    Object.keys(files).forEach(f => {
      if (f.startsWith(prefix) && f !== prefix) {
        const rel = f.slice(prefix.length);
        const top = rel.split('/')[0];
        if (top) entries.add(top.endsWith('/') ? top : (files[prefix + top + '/'] !== undefined ? top + '/' : top));
      }
    });
    return Array.from(entries).sort().join('\n');
  },
  cat: (args) => {
    if (!args) return 'cat: missing file operand';
    const filePath = resolvePath(args);
    if (files[filePath]) return files[filePath];
    return `cat: ${args}: No such file`;
  },
  touch: (args) => {
    if (!args) return 'touch: missing file operand';
    const filePath = resolvePath(args);
    if (files[filePath]) return `touch: cannot create file '${args}': File exists`;
    files[filePath] = '';
    updateFolderTree && updateFolderTree();
    updateTabBar && updateTabBar();
    saveToStorage && saveToStorage();
    return '';
  },
  rm: (args) => {
    if (!args) return 'rm: missing file operand';
    const filePath = resolvePath(args);
    if (!files[filePath]) return `rm: cannot remove '${args}': No such file`;
    delete files[filePath];
    openTabs = openTabs.filter(f => f !== filePath);
    if (currentFile === filePath) {
      currentFile = openTabs[0] || Object.keys(files)[0] || '';
      editor.setValue(currentFile ? files[currentFile] : '');
    }
    updateFolderTree && updateFolderTree();
    updateTabBar && updateTabBar();
    saveToStorage && saveToStorage();
    return '';
  },
  mv: (args) => {
    const [src, dst] = args.split(/\s+/);
    if (!src || !dst) return 'mv: missing file operand';
    const srcPath = resolvePath(src);
    const dstPath = resolvePath(dst);
    if (!files[srcPath]) return `mv: cannot stat '${src}': No such file`;
    if (files[dstPath]) return `mv: cannot move '${src}': '${dst}' already exists`;
    files[dstPath] = files[srcPath];
    delete files[srcPath];
    openTabs = openTabs.map(f => f === srcPath ? dstPath : f);
    if (currentFile === srcPath) currentFile = dstPath;
    updateFolderTree && updateFolderTree();
    updateTabBar && updateTabBar();
    saveToStorage && saveToStorage();
    return '';
  },
  mkdir: (args) => {
    if (!args) return 'mkdir: missing operand';
    const dir = resolvePath(args) + '/';
    if (Object.keys(files).some(f => f.startsWith(dir))) return `mkdir: cannot create directory '${args}': File exists`;
    files[dir] = '';
    updateFolderTree && updateFolderTree();
    saveToStorage && saveToStorage();
    return '';
  },
  rmdir: (args) => {
    if (!args) return 'rmdir: missing operand';
    const dir = resolvePath(args) + '/';
    const hasChildren = Object.keys(files).some(f => f.startsWith(dir) && f !== dir);
    if (hasChildren) return `rmdir: failed to remove '${args}': Directory not empty`;
    if (!files[dir]) return `rmdir: failed to remove '${args}': No such directory`;
    delete files[dir];
    updateFolderTree && updateFolderTree();
    saveToStorage && saveToStorage();
    return '';
  },
  cd: (args) => {
    if (!args || args === '~') { cwd = ''; return ''; }
    const target = resolvePath(args);
    // Simulate directories as any prefix of files ending with /
    const isDir = Object.keys(files).some(f => f.startsWith(target + '/') || f === target + '/');
    if (isDir) { cwd = target; return ''; }
    return `cd: ${args}: No such directory`;
  },
  pwd: () => '/' + cwd,
  echo: (args) => args,
  clear: () => { terminals[activeTerminal].clear(); return ''; },
  help: () => [
    'Available commands:',
    'ls [dir]         List files (optionally in dir)',
    'cat <file>       Show file contents',
    'touch <file>     Create a new file',
    'rm <file>        Delete a file',
    'mv <src> <dst>   Rename/move a file',
    'mkdir <dir>      Create a directory',
    'rmdir <dir>      Remove a directory',
    'echo <msg>       Print a message',
    'clear            Clear the terminal',
    'js <code>        Run JS code',
    'run              Run current JS file',
    'help             Show this help',
    'cd <dir>         Change directory',
    'pwd              Print working directory',
  ].join('\n'),
  js: (args) => {
    try {
      // eslint-disable-next-line no-eval
      return String(eval(args));
    } catch (e) {
      return String(e);
    }
  },
  run: () => {
    if (currentFile && currentFile.endsWith('.js')) {
      try {
        // eslint-disable-next-line no-eval
        const result = eval(editor.getValue());
        terminals[activeTerminal].write(`\r\n[Run] ${currentFile}: ${result}\r\n`);
      } catch (e) {
        terminals[activeTerminal].write(`\r\n[Run Error] ${e}\r\n`);
      }
    } else {
      terminals[activeTerminal].write(`\r\n[Run] Only JS files can be executed.\r\n`);
    }
  },
};

// Run panel: execute JS code and output to terminal
const runBtn = document.getElementById('run-current-file');
if (runBtn) runBtn.onclick = () => {
  if (currentFile.endsWith('.js')) {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(editor.getValue());
      terminals[activeTerminal].write(`\r\n[Run] ${currentFile}: ${result}\r\n`);
    } catch (e) {
      terminals[activeTerminal].write(`\r\n[Run Error] ${e}\r\n`);
    }
  } else {
    terminals[activeTerminal].write(`\r\n[Run] Only JS files can be executed.\r\n`);
  }
};

// --- Data Loader: Accept project files & vulnerabilities from localStorage or URL ---
function loadExternalProjectAndVulns() {
  // Try to load from localStorage (preferred for large data)
  let payload = null;
  try {
    payload = JSON.parse(localStorage.getItem('vscodelite_payload'));
  } catch {}
  if (!payload) {
    // Try to load from URL param (base64-encoded JSON)
    const params = new URLSearchParams(window.location.search);
    if (params.has('payload')) {
      try {
        payload = JSON.parse(atob(params.get('payload')));
      } catch {}
    }
  }
  if (payload) {
    if (payload.files) {
      Object.assign(files, payload.files);
      updateFolderTree && updateFolderTree();
      updateTabBar && updateTabBar();
    }
    if (payload.vulnerabilities) {
      window.vulnerabilities = payload.vulnerabilities;
      import('./ai-agent.js').then(mod => {
        mod.renderVulnerabilities(window.vulnerabilities);
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', loadExternalProjectAndVulns);

// --- Ensure right sidebar panel can display vulnerabilities ---
// (Assume #ai-agent-panel exists in index.html)