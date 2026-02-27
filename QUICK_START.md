# JAMLA - Quick Start Guide

## Installation

### From Source (Development)
```bash
# Clone the repo
git clone https://github.com/datmt/reactotron.git
cd reactotron

# Install dependencies
yarn install

# Start development server
yarn start
```

### From Binary (End Users)
Download the latest release from [GitHub Releases](https://github.com/datmt/reactotron/releases)

- **macOS**: Extract `.dmg` and drag JAMLA to Applications
- **Windows**: Run `.exe` installer
- **Linux**: Make `.AppImage` executable and run

## Setting Up Your App

### React Native
```javascript
import Reactotron from 'reactotron-react-native'

Reactotron
  .configure()
  .connect()

// Now use Reactotron for logging
Reactotron.log('Hello from React Native!')
```

### React (Web)
```javascript
import Reactotron from 'reactotron-react-js'

Reactotron
  .configure()
  .connect()

// Log messages
Reactotron.log('Hello from React!')
```

## Key Features

- 📊 **Timeline Tab**: View all logs with timestamps (persists across crashes)
- 🔍 **Search**: Filter logs by text
- 🌐 **Network**: Inspect API calls and responses
- 📱 **Multi-Device**: Monitor multiple connected devices
- 💾 **Persistent Logs**: Logs saved to disk - survive app crashes

## Common Tasks

### Clear Logs
In the Timeline tab, click "Clear Timeline" button or press the keyboard shortcut.

### Export Logs
Click the "Export" button in Timeline to save logs as JSON.

### Filter by Type
Use the filter icon to hide specific log types.

### Search Logs
Press Ctrl/Cmd+F or click search icon to find specific logs.

## Building & Releasing

### Build Locally
```bash
yarn build
```

### Create a Release
```bash
# Create a version tag
git tag jamla-app@1.0.0

# Push to trigger automated build
git push origin jamla-app@1.0.0
```

The GitHub Actions workflow will:
1. Build for macOS, Windows, and Linux
2. Create a GitHub Release with all artifacts
3. Clean up old artifacts

## Troubleshooting

### App Won't Connect
- Ensure Reactotron client library is configured in your app
- Check that both app and JAMLA are on the same network
- Verify the port (default: 9090) is not blocked by firewall

### Logs Not Showing
- Verify client is configured with `Reactotron.configure().connect()`
- Check that client sends logs: `Reactotron.log('test')`
- Restart both JAMLA and the client app

### Build Fails
```bash
# Clear cache and reinstall
yarn clean
yarn install
yarn build
```

## Configuration

Preferences are stored in:
- **macOS**: `~/Library/Application Support/JAMLA/`
- **Windows**: `%APPDATA%\JAMLA\`
- **Linux**: `~/.config/JAMLA/`

### Available Settings
- **Server Port**: Default 9090
- **Command History**: Max logs to keep (default: 500)

## Resources

- **Official Reactotron Docs**: https://docs.infinite.red/reactotron/
- **GitHub Repository**: https://github.com/datmt/reactotron
- **Report Issues**: https://github.com/datmt/reactotron/issues

## Support

For questions or issues:
1. Check existing GitHub issues
2. Create a new issue with details
3. Include OS, JAMLA version, and steps to reproduce

---

Happy debugging! 🚀
