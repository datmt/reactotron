# Session Logging & Browser

## Overview

Each time you launch the Reactotron app, a new **session folder** is automatically created to store logs and metadata. The **Session Browser** feature lets you browse and reload previous sessions directly in the Timeline tab.

## Session Storage

### Location

Logs are stored per-session in a timestamped folder:

- **macOS**: `~/Library/Application Support/Reactotron/sessions/`
- **Linux**: `~/.config/Reactotron/sessions/`
- **Windows**: `%APPDATA%\Reactotron\sessions\`

### Session Folder Structure

Each session folder is named with the date and timestamp when the app was launched:

```
sessions/
├── 2025-03-02_1746082400000/
│   ├── commands.log          (all commands received, one per line as JSON)
│   └── summary.json          (session metadata)
└── 2025-03-01_1746082400000/
    ├── commands.log
    └── summary.json
```

## Files

### commands.log

A newline-delimited JSON file containing all commands received during the session:

```json
{"timestamp":"2025-03-02T10:30:45.123Z","command":{...}}
{"timestamp":"2025-03-02T10:30:46.456Z","command":{...}}
```

**Use case**: Parse this file to analyze command history, build dashboards, or integrate with external tools.

### summary.json

Session metadata saved when the app closes:

```json
{
  "sessionStart": "2025-03-02T10:30:30.000Z",
  "sessionEnd": "2025-03-02T10:35:00.000Z",
  "totalCommands": 245,
  "connections": [
    {
      "clientId": "device-123",
      "name": "iOS Simulator",
      "platform": "ios",
      "commandCount": 245
    }
  ]
}
```

## Session Browser

### How to Use

1. **Open the Session Browser**: Click the "Load Previous Session" button (history icon) in the Timeline tab header
2. **Browse Sessions**: View all saved sessions sorted by date (newest first)
3. **View Metadata**: See the session start time, command count, and connected devices for each session
4. **Load Session**: Select a session and click "Load Session" to restore all logs in the timeline
5. **Refresh**: Click the refresh button to reload the session list

### Features

✅ Browse all previous sessions  
✅ View session metadata (start time, command count, devices)  
✅ Load any session directly into the timeline  
✅ Refresh to see newly created sessions  
✅ Sessions displayed newest first  

### Example Flow

```
Timeline Tab → Click History Icon (📋) → Session Browser Opens
                                          ├─ Session A (245 commands)
                                          ├─ Session B (89 commands)
                                          └─ Session C (156 commands)
                                          
Select Session B → Click "Load Session" → Timeline populated with Session B logs
```

## Accessing Session Logs

### Session Browser (UI)

Simply click the history button (📋) in the Timeline tab to browse and load previous sessions.

### Programmatic Access

From the renderer process:

```javascript
import { ipcRenderer } from "electron"

// List all sessions
const sessions = await ipcRenderer.invoke("list-sessions")

// Load commands from a specific session
const commands = await ipcRenderer.invoke("load-session-commands", sessionPath)

// Get the current session directory
const sessionDir = await ipcRenderer.invoke("get-session-dir")

// Open the sessions folder in file explorer
ipcRenderer.send("open-sessions-folder")
```

### File Explorer

You can open the sessions folder directly:

- **macOS**: `~/Library/Application Support/Reactotron/sessions/`
- **Linux**: `~/.config/Reactotron/sessions/`
- **Windows**: `%APPDATA%\Reactotron\sessions\`

## Features

✅ Automatic logging of all commands  
✅ Persistent storage across app restarts  
✅ Session metadata (start time, total commands, connections)  
✅ Session Browser to browse and reload previous sessions  
✅ Easy file-based access for integration with other tools  
✅ Timestamped folders prevent log overwrites  
✅ JSON format for easy parsing

## Combining with Timeline Persistence

Reactotron has **two complementary persistence mechanisms**:

| Feature | Storage | Purpose |
|---------|---------|---------|
| **Timeline Persistence** | `electron-store` (JSON) | In-app display of logs across restarts |
| **Session Logging** | Text files (newline-delimited JSON) | Archival and external tool integration |
| **Session Browser** | Timeline UI | Interactive browsing and loading of previous sessions |

How they work together:
- Timeline logs restore automatically in the UI on app restart
- Session logs provide external backup files you can parse
- Session Browser lets you browse all sessions and load any into the timeline
