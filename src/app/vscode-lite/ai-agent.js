// ai-agent.js
// Handles vulnerability display in the right sidebar (AI agent tab)

export function renderVulnerabilities(vulns = []) {
  const agentPanel = document.getElementById('ai-agent-panel');
  if (!agentPanel) return;
  agentPanel.innerHTML = '';
  if (!vulns.length) {
    agentPanel.innerHTML = '<div style="padding:1em;color:#888;">No vulnerabilities found.</div>';
    return;
  }
  const list = document.createElement('ul');
  list.style.padding = '0 1em';
  list.style.listStyle = 'none';
  vulns.forEach(v => {
    const li = document.createElement('li');
    li.style.marginBottom = '1em';
    li.innerHTML = `<b style='color:#c00;'>[${v.severity}]</b> <b>${v.title}</b><br><small>Location: <code>${v.location}</code></small><br><span>${v.description}</span>`;
    li.style.borderBottom = '1px solid #333';
    li.style.paddingBottom = '0.5em';
    list.appendChild(li);
  });
  agentPanel.appendChild(list);
}

// For later: add hooks so the AI agent can access these vulnerabilities for suggestions/fixes.
