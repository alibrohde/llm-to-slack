# llm-to-slack

Normalize clipboard text so paragraph breaks survive pasting into Slack and iMessage.

---

## Why this exists

When you copy text from ChatGPT or Claude and paste it into **Slack desktop** or **iMessage**, the paragraph breaks collapse — your nicely formatted reply becomes one dense wall of text.

This script normalizes the clipboard before you paste: it collapses excess blank lines, strips trailing spaces, and ensures every paragraph is separated by exactly one blank line. Slack and iMessage then render the breaks correctly.

---

## Quick start

**Requirements:** macOS, Node 18+

```bash
git clone https://github.com/alibrohde/llm-to-slack.git
cd llm-to-slack
```

1. Copy text from ChatGPT or Claude.
2. Run the script:
   ```bash
   node scripts/pastefix.js
   ```
3. Paste into Slack or iMessage as usual (`Cmd+V`).

### npm scripts

```bash
npm run pastefix          # normalize clipboard
npm run pastefix:paste    # normalize and auto-paste (requires Accessibility permission)
```

### Convenience wrapper

```bash
# Make the wrapper executable once:
chmod +x bin/pastefix

# Then use from anywhere inside the repo:
./bin/pastefix
```

Or add the `bin/` directory to your `PATH` to call `pastefix` from anywhere.

---

## Autopaste mode (`--paste`)

Running with `--paste` normalizes the clipboard **and** immediately triggers a paste (`Cmd+V`) in the frontmost app via AppleScript.

```bash
node scripts/pastefix.js --paste
```

> **macOS Accessibility permission required.**
> The first time you run this, macOS may prompt you to grant Accessibility access.
> If it silently fails, go to:
> **System Settings → Privacy & Security → Accessibility**
> Add **Terminal** (or **iTerm**, or **Raycast**) and enable the toggle.

---

## Raycast integration (optional)

Get a hotkey that fixes your clipboard in one keystroke.

1. Open **Raycast → Settings → Extensions → Script Commands**.
2. Click **Add Script Directory** and point it at the `raycast/` folder in this repo.
3. The command **"Slack / iMessage Paste Fix"** will appear.
4. Click the command → **Record Hotkey** → assign something like `⌥⌘V`.

Now your workflow is:
1. Copy from ChatGPT / Claude.
2. Press `⌥⌘V` (or your chosen hotkey).
3. Click in Slack or iMessage and paste with `Cmd+V`.

> **Note:** Edit `@raycast.author` and `@raycast.authorURL` in
> `raycast/Slack-iMessage-Paste-Fix.js` before adding to Raycast.

---

## How it works

| Step | What happens |
|------|-------------|
| 1 | Read clipboard with `pbpaste` |
| 2 | Convert `CRLF` / `CR` → `LF` |
| 3 | Strip trailing spaces on every line |
| 4 | Collapse 3 or more consecutive newlines down to 2 |
| 5 | Trim leading/trailing whitespace |
| 6 | Write back with `pbcopy` |

Slack and iMessage interpret a single blank line (two `\n` characters) as a paragraph break — exactly what this produces.

---

## File tree

```
llm-to-slack/
├── bin/
│   └── pastefix          # executable bash wrapper
├── raycast/
│   └── Slack-iMessage-Paste-Fix.js   # Raycast Script Command
├── scripts/
│   └── pastefix.js       # main Node script
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

---

## License

MIT
