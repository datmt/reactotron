# Quick Start: Session Browser

## What is the Session Browser?

The **Session Browser** lets you quickly browse and reload previous debugging sessions without reconnecting your app. All your logs are automatically saved to disk each time you run the app.

## How to Use

### Step 1: Open the Session Browser

In the **Timeline** tab, click the **history button** (📋) in the header to open the Session Browser modal.

### Step 2: Browse Sessions

You'll see a list of all your previous sessions, sorted by newest first:

```
📋 Load Previous Session

2025-03-02_1746082400000
📅 Mar 2, 2025, 10:30:45 AM
📊 245 commands
📱 1 device

2025-03-01_1746082400000
📅 Mar 1, 2025, 2:15:20 PM
📊 89 commands
📱 1 device
```

### Step 3: Select a Session

Click on any session to select it (it will highlight).

### Step 4: Load the Session

Click the **"Load Session"** button to restore all logs from that session in the timeline.

The timeline will immediately populate with all the logs from that session!

### Step 5: Refresh (Optional)

Click the **refresh button** (🔄) if the session list doesn't show your latest sessions.

## Where Are My Sessions Saved?

Sessions are automatically saved in:

- **macOS**: `~/Library/Application Support/Reactotron/sessions/`
- **Linux**: `~/.config/Reactotron/sessions/`
- **Windows**: `%APPDATA%\Reactotron\sessions\`

Each session is a folder named with the date and time it was created. Inside you'll find:
- `commands.log` - All the logs in JSON format
- `summary.json` - Metadata about the session

## What Happens Automatically?

✅ Every time you launch the app, a new session is created  
✅ Every log/command is automatically saved to disk  
✅ When you close the app, session metadata is saved  
✅ All previous sessions are preserved (never auto-deleted)

## Example Workflows

### Workflow 1: Comparing Two Debug Sessions

1. Run your app and debug something
2. Close the app
3. Run your app again and debug something different
4. Click history button → Select first session → Load Session
5. Compare the two sessions side-by-side in the timeline

### Workflow 2: Reviewing Yesterday's Bugs

1. Open the app
2. Click history button
3. Scroll down to find a session from yesterday
4. Click to load it
5. Review all the debug info from that session

### Workflow 3: Sharing Logs

1. Open the app
2. Click history button
3. Look at the session folder location (shown in modal)
4. Find the session folder in your file explorer
5. Share the `commands.log` file with a team member
6. They can review the exact sequence of events

## Keyboard Shortcuts

- **Esc** - Close the Session Browser modal
- **Click outside modal** - Close the Session Browser

## Tips

💡 **Sessions are never auto-deleted** - Your disk space might grow over time, so manually delete old sessions if needed.

💡 **Each session is independent** - Loading a session doesn't affect your current connection. New logs will still arrive normally.

💡 **Metadata is helpful** - Use the command count and device info to find the right session quickly.

💡 **No network needed** - Session loading is purely local/disk-based, so it's instant.

## Troubleshooting

### No sessions appear in the browser

- Check that sessions folder exists in the location above
- Click the refresh button to reload the list
- Make sure you've run the app at least once

### "Failed to load session commands"

- The session file may be corrupted
- Try clicking another session
- Check file permissions on the sessions folder

### Sessions folder is very large

- Check the size of individual session files
- Delete old sessions you don't need anymore
- Each `commands.log` file is typically a few MB per session

## Advanced: Accessing Sessions Programmatically

If you want to parse session files outside of Reactotron, they're just JSON:

```bash
# View a session
cat ~/Library/Application\ Support/Reactotron/sessions/2025-03-02_*/commands.log | jq .

# Count commands in a session
grep -c "timestamp" ~/Library/Application\ Support/Reactotron/sessions/2025-03-02_*/commands.log

# Export to CSV (with jq)
jq -r '.command | [.type, .date] | @csv' commands.log > output.csv
```

Each line in `commands.log` is a JSON object with this structure:

```json
{
  "timestamp": "2025-03-02T10:30:45.123Z",
  "command": {
    "type": "log",
    "level": "debug",
    "message": "...",
    "date": "2025-03-02T10:30:45.123Z",
    ...
  }
}
```
