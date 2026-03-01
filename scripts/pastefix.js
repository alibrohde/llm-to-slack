#!/usr/bin/env node
// scripts/pastefix.js
// Normalize clipboard text so paragraph breaks survive pasting into Slack and iMessage.

const { execSync, spawnSync } = require("child_process");

const AUTOPASTE = process.argv.includes("--paste");

// Read clipboard
let raw;
try {
  raw = execSync("pbpaste", { encoding: "utf8" });
} catch {
  console.error("Error: could not read clipboard.");
  process.exit(1);
}

if (!raw || !raw.trim()) {
  console.error("Clipboard is empty or contains no text.");
  process.exit(1);
}

// Normalize
let text = raw
  .replace(/\r\n/g, "\n")   // CRLF → LF
  .replace(/\r/g, "\n")     // CR   → LF
  .replace(/[^\S\n]+$/gm, "") // strip trailing spaces per line
  .replace(/\n{3,}/g, "\n\n") // collapse 3+ blank lines to 2
  .trim();

// Write back
try {
  const proc = spawnSync("pbcopy", { input: text, encoding: "utf8" });
  if (proc.status !== 0) throw new Error(proc.stderr);
} catch {
  console.error("Error: could not write to clipboard.");
  process.exit(1);
}

console.log("Clipboard normalized. Ready to paste.");

// Optional autopaste
if (AUTOPASTE) {
  const script = `tell application "System Events" to keystroke "v" using command down`;
  const result = spawnSync("osascript", ["-e", script]);
  if (result.status !== 0) {
    console.error(
      "\nAutopaste failed. macOS requires Accessibility permissions.\n" +
      "To enable:\n" +
      "  System Settings → Privacy & Security → Accessibility\n" +
      "  Add Terminal (or Raycast) and enable the toggle."
    );
    process.exit(1);
  }
}
