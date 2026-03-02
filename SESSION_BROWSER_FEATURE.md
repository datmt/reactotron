# Session Browser Feature - Implementation Summary

## Overview

Added a **Session Browser** feature that allows users to browse and reload previous session logs directly in the Timeline tab. This complements the existing session logging functionality.

## Files Changed/Created

### New Files

1. **apps/reactotron-app/src/main/sessionLogger.ts**
   - Core session logging class
   - Creates timestamped session folders
   - Logs commands to `commands.log` (newline-delimited JSON)
   - Writes `summary.json` with session metadata

2. **apps/reactotron-app/src/renderer/pages/timeline/SessionBrowser.tsx**
   - React component for browsing and loading previous sessions
   - Modal UI with session list
   - Session metadata display (start time, command count, devices)
   - Load/Cancel buttons
   - Refresh button to reload session list

3. **apps/reactotron-app/src/renderer/hooks/useStandaloneContext.ts**
   - Custom hook to access Standalone context
   - Provides type-safe access to context values

4. **apps/reactotron-app/SESSION_LOGGING.md**
   - User documentation for session logging and browser features
   - Storage location reference
   - File format documentation
   - Usage examples

### Modified Files

1. **apps/reactotron-app/src/main/utils.ts**
   - Added `setupSessionLoggerIPC()` function
   - IPC handlers:
     - `list-sessions`: Lists all sessions with metadata
     - `load-session-commands`: Loads commands from a specific session
     - `open-sessions-folder`: Opens sessions folder in file explorer
     - `get-session-dir`: Returns current session directory

2. **apps/reactotron-app/src/main/index.ts**
   - Imported `setupSessionLoggerIPC` and `sessionLogger`
   - Called `setupSessionLoggerIPC()` in app "ready" event
   - Added "quit" event handler to request session summary

3. **apps/reactotron-app/src/renderer/contexts/Standalone/useStandalone.ts**
   - Added `ActionTypes.LoadSessionCommands` enum
   - Added action type for loading session commands
   - Implemented reducer case for `LoadSessionCommands`
   - Added `loadSessionCommands` callback function
   - Returns `loadSessionCommands` from hook

4. **apps/reactotron-app/src/renderer/contexts/Standalone/index.tsx**
   - Imported `loadSessionCommands` from `useStandalone`
   - Exposed `loadSessionCommands` globally as `window.__reactotronLoadSession`
   - Added logging to IPC for command persistence

5. **apps/reactotron-app/src/renderer/pages/timeline/index.tsx**
   - Imported `SessionBrowser` component
   - Added `useState` for session browser modal
   - Added `MdHistory` icon import
   - Added "Load Previous Session" button to Timeline header
   - Implemented `handleSessionLoaded` callback
   - Integrated `SessionBrowser` component to render modal

## Architecture

### Data Flow

```
Timeline Tab (User clicks History Button)
    ↓
SessionBrowser Modal Opens
    ↓
User Selects Session & Clicks "Load"
    ↓
IPC: load-session-commands (main process)
    ↓
Main Process reads session file
    ↓
Commands returned to SessionBrowser
    ↓
handleSessionLoaded callback invoked
    ↓
loadSessionCommands() called (from window.__reactotronLoadSession)
    ↓
Reducer dispatches LoadSessionCommands action
    ↓
Timeline state updated with loaded commands
    ↓
UI updates to show loaded session logs
```

### Session Management

```
App Launch
    ↓
sessionLogger.ts creates timestamped session folder
    ↓
Every command received
    ↓
Logged to disk (commands.log, electron-store)
    ↓
App Closes
    ↓
Summary written to summary.json
    ↓
Next Session Can Load Previous Logs
```

## IPC Handlers

### Main Process (Main Thread)

```typescript
// List all sessions with metadata
ipcRenderer.invoke("list-sessions")
// Returns: Array<{ name, path, sessionStart, sessionEnd, totalCommands, connections }>

// Load commands from a specific session
ipcRenderer.invoke("load-session-commands", sessionPath)
// Returns: Array<Command>

// Get current session directory
ipcRenderer.invoke("get-session-dir")
// Returns: string (path)

// Open sessions folder in file explorer
ipcRenderer.send("open-sessions-folder")
// Returns: void
```

## UI Components

### SessionBrowser Modal

- **Header**: Title, close button, refresh button
- **Session List**: Scrollable list of sessions
  - Session name (timestamp)
  - Start time
  - Command count
  - Device information
- **Footer**: Cancel and Load buttons

### Timeline Header

- Added "Load Previous Session" button (history icon)
- Positioned at the left of the action buttons
- Tooltip: "Load Previous Session"

## Reducer Integration

### New Action: LoadSessionCommands

```typescript
{
  type: ActionTypes.LoadSessionCommands,
  payload: Command[] // Array of commands to load
}
```

### Behavior

- If no connection selected: Creates virtual connection "Loaded Session"
- If connection selected: Replaces commands in selected connection
- Automatically updates UI via Context

## Features

✅ Browse all previous sessions  
✅ View session metadata (timestamp, command count, devices)  
✅ Load any session directly into timeline  
✅ Refresh session list to see newly created sessions  
✅ Sessions sorted newest-first  
✅ Modal UI (non-blocking)  
✅ Error handling for missing/corrupted session files  

## Testing

To test the feature:

1. Run the app: `yarn start reactotron-app`
2. Generate some logs in the timeline
3. Close and reopen the app
4. Click the history button (📋) in Timeline header
5. Previous session should appear
6. Click "Load Session" to restore logs
7. Timeline should populate with loaded commands

## Session Storage

- **Location**: Depends on OS
  - macOS: `~/Library/Application Support/Reactotron/sessions/`
  - Linux: `~/.config/Reactotron/sessions/`
  - Windows: `%APPDATA%\Reactotron\sessions\`

- **Format**: Timestamped folders with `commands.log` and `summary.json`
- **Retention**: Sessions never auto-delete (user must manually delete)

## Notes

- Session loading is synchronous from disk (minimal performance impact)
- Commands are loaded in-memory only (not re-persisted unless new commands arrive)
- Session metadata is calculated from commands when loading
- Malformed session files are gracefully handled (empty array returned)
- Multiple sessions can exist (each gets unique timestamp folder)
