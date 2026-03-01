#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Slack / iMessage Paste Fix
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 📋
// @raycast.packageName Paste Fix

// Documentation:
// @raycast.description Normalizes clipboard text so paragraph breaks survive pasting into Slack and iMessage.
// @raycast.author a_l_i_r
// @raycast.authorURL https://raycast.com/a_l_i_r

const { execSync, spawnSync } = require("child_process");

let raw;
try {
  raw = execSync("pbpaste", { encoding: "utf8" });
} catch {
  console.error("Could not read clipboard.");
  process.exit(1);
}

if (!raw || !raw.trim()) {
  console.error("Clipboard is empty or contains no text.");
  process.exit(1);
}

const text = raw
  .replace(/\r\n/g, "\n")
  .replace(/\r/g, "\n")
  .replace(/[^\S\n]+$/gm, "")
  .replace(/\n{3,}/g, "\n\n")
  .trim();

try {
  const proc = spawnSync("pbcopy", { input: text, encoding: "utf8" });
  if (proc.status !== 0) throw new Error();
} catch {
  console.error("Could not write to clipboard.");
  process.exit(1);
}

console.log("Clipboard normalized. Ready to paste.");
