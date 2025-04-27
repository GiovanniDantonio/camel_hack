import { NextRequest } from 'next/server';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

// Store terminals in-memory (per server instance)
const terminals: Record<string, ChildProcessWithoutNullStreams> = {};
const buffers: Record<string, string[]> = {};

export async function POST(req: NextRequest) {
  const { tabId, input } = await req.json();
  let proc = terminals[tabId];
  if (!proc) {
    // Start a new shell process for this tab
    proc = spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
      env: process.env,
      stdio: 'pipe',
    });
    terminals[tabId] = proc;
    buffers[tabId] = [];
    proc.stdout.on('data', (data) => {
      buffers[tabId].push(data.toString());
    });
    proc.stderr.on('data', (data) => {
      buffers[tabId].push(data.toString());
    });
    proc.on('exit', () => {
      delete terminals[tabId];
      delete buffers[tabId];
    });
  }
  if (input) {
    proc.stdin.write(input);
  }
  // Wait a short time for output to accumulate
  await new Promise((res) => setTimeout(res, 60));
  const output = buffers[tabId].join('');
  buffers[tabId] = [];
  return new Response(JSON.stringify({ output }), { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { tabId } = await req.json();
  const proc = terminals[tabId];
  if (proc) {
    proc.kill();
    delete terminals[tabId];
    delete buffers[tabId];
  }
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
