# Timeline Log Persistence

## Problem
Previously, all logs in the Timeline tab were stored only in memory (React state). When the Reactotron app crashed or was closed, all timeline logs disappeared, making it inconvenient for debugging.

## Solution
Implemented persistent storage for timeline logs using `electron-store`, so logs survive app crashes and are automatically restored on the next session.

## Changes Made

### 1. **config.ts** - Added persistent log storage
- Created a new `timelineLogsStore` instance to persistently store timeline logs on disk
- Logs are stored per connection using the client ID as the key
- Storage format: `{ connectionLogs: { [clientId]: Command[] } }`

### 2. **useStandalone.ts** - Integrated persistence logic
- **On command receipt**: When a new command is received, it's now saved to the persistent store
- **On connection established**: Commands are restored from disk when a connection reconnects
- **On clear commands**: When logs are manually cleared, persisted logs are also deleted
- **History limit enforcement**: Commands are limited by the configured `commandHistory` setting (default: 500) for both in-memory and persisted storage

### 3. **Standalone context (index.tsx)** - Passed history limit
- Now reads the `commandHistory` config and passes it to `useStandalone` 
- Ensures both in-memory and persistent storage respect the same limit

## How It Works

1. **Automatic Persistence**: Every time a log/command arrives from a connected client, it's automatically saved to disk
2. **Automatic Recovery**: When the app restarts and a client reconnects, previous logs are loaded from disk
3. **History Limit**: Commands are trimmed to respect the `commandHistory` configuration (max 500 by default)
4. **Manual Clear**: When user clears timeline logs, both in-memory and persisted logs are cleared
5. **Per-Connection**: Each connected client has its own log history, preventing cross-contamination

## Storage Location
- On macOS: `~/Library/Application Support/Reactotron/timeline-logs.json`
- On Linux: `~/.config/Reactotron/timeline-logs.json`
- On Windows: `%APPDATA%\Reactotron\timeline-logs.json`

## Benefits
- ✅ Logs persist across app crashes
- ✅ Logs persist across app restarts
- ✅ Automatic restoration when client reconnects
- ✅ Configurable history limit prevents unbounded growth
- ✅ Manual clear still works as expected
- ✅ No performance impact (asynchronous persistence via electron-store)
