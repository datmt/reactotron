# Rebranding Guide for Your Fork

You've successfully updated the logo to the yellow phone icon. Here's what to do next to fully rebrand:

## 1. Update the Brand Name (Choose Your Own)

Replace all instances of "Reactotron" with your preferred name. Here are the files to change:

### Critical Files:

**apps/reactotron-app/package.json**
- Line 2: `"name": "reactotron-app"` → `"name": "YOUR-APP-NAME"`
- Line 3: `"productName": "Reactotron"` → `"productName": "YOUR-APP-NAME"`
- Line 5: `"description": "Reactotron desktop mode engage!"` → Update description
- Lines 6-9: Update author info (remove Infinite Red references)
- Line 15: Update repository URL to your fork
- Line 114: `"productName": "Reactotron"` → `"productName": "YOUR-APP-NAME"` (build section)
- Line 115: `"appId": "com.reactotron.app"` → `"appId": "com.yourname.yourapp"`

**src/main/index.ts (Window Title)**
- Line 31: `title: "Reactotron"` → `title: "YOUR-APP-NAME"`

**src/main/menu.ts (Menu Labels)**
- Line 10: `label: isDarwin ? "Reactotron" : "&File"`
- Line 17: `label: "About Reactotron"`
- Line 22: `label: "Hide Reactotron"`

**Root README.md**
- Update the first section to clarify your fork's purpose and differences

## 2. Done on Logo

✅ Replaced `apps/reactotron-app/icon.png` with your yellow phone icon
✅ Replaced `apps/reactotron-app/src/renderer/images/Reactotron-128.png` with your logo

The logo will now display in:
- Window titlebar
- Sidebar navigation  
- Application icon (macOS, Windows, Linux)
- About dialog

## 3. Update Metadata (Optional but Recommended)

**root package.json**
- Lines 10-24: Update author info and repository references

## 4. Github Repo Settings

After pushing these changes:
1. Go to your GitHub repo Settings
2. Update the description
3. Add appropriate topics/tags so it's clear this is a fork with modifications

## 5. Example Names for Your Fork

Since you mentioned it's for backend development and specific needs:
- "BackendTron" (logs & monitoring focused)
- "DevLog" (simple & clear)
- "AppMonitor" 
- "DebugPulse"
- "SignalLog"

## 6. Build & Test

After rebranding:

```bash
yarn build
yarn start
```

Verify the new name/logo appears in:
- Window title
- Application menu
- Sidebar logo
- Build artifacts

## Important Notes

⚠️ Keep the underlying package names (`reactotron-core-ui`, etc.) the same unless you plan to publish to npm under a new scope.

⚠️ Update GitHub Actions and CI references if you modify the app name significantly.

⚠️ Remember to update version tags in git when you're ready to release:
```bash
git tag YOUR-APP-NAME@1.0.0 && git push origin YOUR-APP-NAME@1.0.0
```
