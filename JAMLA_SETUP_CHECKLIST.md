# JAMLA Setup Checklist

Use this checklist to ensure everything is set up correctly before your first release.

## Pre-Release Setup

### ✅ Verify Rebranding
- [ ] Window title shows "JAMLA" (not Reactotron)
- [ ] Logo is yellow phone icon (not Reactotron logo)
- [ ] Menu items say "JAMLA" (not Reactotron)
- [ ] README mentions JAMLA prominently
- [ ] GitHub repo description mentions JAMLA (optional)

### ✅ Test Build
```bash
# Clean and rebuild
yarn clean
yarn install
yarn build

# Verify build succeeds
# Expected: "Successfully ran target build for project jamla-app"
```

### ✅ Local Development Test
```bash
yarn start

# Verify in the running app:
# ✓ Window title = "JAMLA"
# ✓ Sidebar logo = yellow phone icon
# ✓ Menu has correct labels
```

### ✅ Configuration Review
- [ ] `apps/reactotron-app/package.json`
  - [ ] `name: "jamla-app"`
  - [ ] `productName: "JAMLA"`
  - [ ] `appId: "com.jamla.app"`
  - [ ] Author info updated (or at least valid)

- [ ] `package.json` (root)
  - [ ] Repository URLs point to `github.com/datmt/reactotron`

- [ ] `.github/workflows/build-portable-releases.yml`
  - [ ] Tag pattern is `jamla-app@*`
  - [ ] Release names are "JAMLA"

### ✅ Documentation
- [ ] README.md is updated and accurate
- [ ] JAMLA_REBRANDING_COMPLETE.md explains changes
- [ ] QUICK_START.md provides good getting-started guide
- [ ] TIMELINE_PERSISTENCE.md documents log persistence feature

### ✅ Git Setup
```bash
# Verify git is clean
git status
# Expected: working tree clean

# Add all changes
git add .

# Commit
git commit -m "chore: rebrand to JAMLA"

# Verify commit
git log --oneline -1
```

## First Release

### ✅ Create Release Tag
```bash
# Create version tag
git tag jamla-app@1.0.0

# Verify tag created
git tag -l jamla-app@*
# Expected: jamla-app@1.0.0
```

### ✅ Push to GitHub
```bash
# Push commits
git push origin main

# Push tag (this triggers GitHub Actions)
git push origin jamla-app@1.0.0
```

### ✅ Monitor Build
1. Go to: https://github.com/datmt/reactotron/actions
2. Watch the "Build Portable Releases" workflow
3. Wait for all platform builds to complete (5-10 minutes)

Expected jobs:
- [ ] extract-version: ✅ PASSED
- [ ] build-macos: ✅ PASSED
- [ ] build-windows: ✅ PASSED
- [ ] build-linux: ✅ PASSED
- [ ] create-release: ✅ PASSED
- [ ] cleanup-artifacts: ✅ PASSED

### ✅ Verify Release
1. Go to: https://github.com/datmt/reactotron/releases
2. Look for "JAMLA 1.0.0" release
3. Verify all artifacts are present:
   - [ ] jamla-1.0.0-macos-x64.dmg
   - [ ] jamla-1.0.0-macos-x64.zip
   - [ ] jamla-1.0.0-macos-arm64.dmg
   - [ ] jamla-1.0.0-macos-arm64.zip
   - [ ] jamla-1.0.0-windows.exe
   - [ ] jamla-1.0.0-windows.msi
   - [ ] jamla-1.0.0-linux.AppImage
   - [ ] jamla-1.0.0-linux.deb
   - [ ] jamla-1.0.0-linux.rpm

## Post-Release

### ✅ Announce
- [ ] Update GitHub repo description (if desired)
- [ ] Share announcement (social media, etc.)
- [ ] Update any external documentation

### ✅ Monitor
- [ ] Check GitHub Issues for any problems
- [ ] Monitor release downloads
- [ ] Respond to user feedback

## Future Releases

For subsequent releases, follow the same process:

```bash
# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Create new tag (increment version)
git tag jamla-app@1.0.1

# Push to trigger build
git push origin main
git push origin jamla-app@1.0.1
```

---

## Troubleshooting

### Build Failed
1. Check GitHub Actions logs: https://github.com/datmt/reactotron/actions
2. Common causes:
   - Dependency issues (run `yarn install`)
   - TypeScript errors (run `yarn typecheck`)
   - Missing dependencies (check error messages)

### Release Not Created
1. Verify all platforms built successfully
2. Check GitHub Actions logs for the `create-release` job
3. Common causes:
   - No artifacts generated (check platform-specific builds)
   - Permission issues (check GitHub token)

### App Won't Launch
1. Verify system requirements are met
2. Check logs in `~/Library/Application Support/JAMLA/` (macOS)
3. Report issue on GitHub with:
   - OS and version
   - JAMLA version
   - Detailed error message

---

You've got this! Ready to release JAMLA to the world! 🚀
