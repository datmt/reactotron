# JAMLA Documentation Index

Complete guide to all documentation files for JAMLA.

## Quick Navigation

### 🚀 Getting Started
- **[JAMLA_FINAL_SUMMARY.txt](./JAMLA_FINAL_SUMMARY.txt)** - Everything you need to know (start here!)
- **[QUICK_START.md](./QUICK_START.md)** - User guide and setup instructions
- **[README.md](./README.md)** - Main project documentation

### 📋 For Release Managers
- **[JAMLA_SETUP_CHECKLIST.md](./JAMLA_SETUP_CHECKLIST.md)** - Pre-release verification & release process
- **[JAMLA_REBRANDING_COMPLETE.md](./JAMLA_REBRANDING_COMPLETE.md)** - Detailed changelog of all changes

### 🔧 Technical Documentation
- **[TIMELINE_PERSISTENCE.md](./TIMELINE_PERSISTENCE.md)** - How persistent logs work
- **[REBRANDING_GUIDE.md](./REBRANDING_GUIDE.md)** - If you want to rename again

## Documentation Files

### JAMLA_FINAL_SUMMARY.txt
**Purpose**: Complete overview of rebranding
- What was done
- Files changed
- 3-step getting started
- Release process
- Features overview

**Read this first** if you're just getting started.

### QUICK_START.md
**Purpose**: User and developer quick start guide
- Installation for end users
- Setup instructions for React/React Native apps
- Key features reference
- Common tasks
- Troubleshooting

**Read this** if you want to use JAMLA or set up a client app.

### README.md
**Purpose**: Main project documentation
- What JAMLA is
- Features list
- Installation instructions
- Setup guides
- Feature plugins

**Read this** for complete project overview.

### JAMLA_SETUP_CHECKLIST.md
**Purpose**: Pre-release verification and release process
- Pre-release setup checklist
- Build testing procedures
- Configuration verification
- Git setup
- Release tag creation
- GitHub Actions monitoring
- Post-release tasks
- Troubleshooting

**Read this** before creating your first release.

### JAMLA_REBRANDING_COMPLETE.md
**Purpose**: Detailed changelog of rebranding changes
- What was changed and why
- File-by-file modifications
- Metadata updates
- Build status
- Next steps

**Read this** to understand exactly what changed during rebranding.

### TIMELINE_PERSISTENCE.md
**Purpose**: Technical documentation of log persistence feature
- Problem statement
- Solution overview
- Implementation details
- How it works
- Storage locations
- Benefits

**Read this** to understand how persistent logs work.

### REBRANDING_GUIDE.md
**Purpose**: Guide for rebranding the project again (if needed)
- Step-by-step instructions
- File-by-file changes needed
- Naming suggestions
- Build and test instructions

**Read this** only if you want to change the name from JAMLA to something else.

## File Organization

```
reactotron/
├── README.md                          ← Main project docs
├── QUICK_START.md                     ← User quick start
├── JAMLA_FINAL_SUMMARY.txt           ← Overview (START HERE)
├── JAMLA_SETUP_CHECKLIST.md          ← Release checklist
├── JAMLA_REBRANDING_COMPLETE.md      ← Changelog
├── TIMELINE_PERSISTENCE.md            ← Log persistence feature
├── REBRANDING_GUIDE.md               ← Rename guide (if needed)
└── INDEX.md                           ← This file
```

## Common Scenarios

### I'm a new user, where do I start?
1. Read [JAMLA_FINAL_SUMMARY.txt](./JAMLA_FINAL_SUMMARY.txt)
2. Follow [QUICK_START.md](./QUICK_START.md)
3. Install from [README.md#Installation](./README.md#installation)

### I want to make the first release
1. Check [JAMLA_SETUP_CHECKLIST.md](./JAMLA_SETUP_CHECKLIST.md)
2. Follow the "Pre-Release Setup" section
3. Follow the "First Release" section
4. Monitor GitHub Actions

### I want to understand what changed
1. Read [JAMLA_REBRANDING_COMPLETE.md](./JAMLA_REBRANDING_COMPLETE.md)
2. Check [JAMLA_FINAL_SUMMARY.txt](./JAMLA_FINAL_SUMMARY.txt) for overview

### I want to understand how logs persist
1. Read [TIMELINE_PERSISTENCE.md](./TIMELINE_PERSISTENCE.md)
2. Check the implementation in `apps/reactotron-app/src/renderer/contexts/Standalone/useStandalone.ts`

### I want to rename JAMLA to something else
1. Read [REBRANDING_GUIDE.md](./REBRANDING_GUIDE.md)
2. Follow the step-by-step instructions

## Key Concepts

### JAMLA
**J**ust **A**nother **M**obile **L**ogging **A**pp - A customized fork of Reactotron tailored for backend developers.

### Persistent Logs
Logs are saved to disk automatically, so they survive app crashes and are restored when reconnecting.

### GitHub Actions
Automated CI/CD pipeline that builds the app for macOS, Windows, and Linux when you push a tag.

### Branding
Complete rebranding from Reactotron to JAMLA with custom logo (yellow phone icon).

## Quick Commands

```bash
# Build the app locally
yarn build

# Start development server
yarn start

# Create a release
git tag jamla-app@1.0.0
git push origin main
git push origin jamla-app@1.0.0

# Check GitHub Actions
# Visit: https://github.com/datmt/reactotron/actions
```

## Support

Need help?

1. Check the relevant documentation file above
2. Review [QUICK_START.md#Troubleshooting](./QUICK_START.md#troubleshooting)
3. Look at [JAMLA_SETUP_CHECKLIST.md#Troubleshooting](./JAMLA_SETUP_CHECKLIST.md#troubleshooting)
4. Check GitHub Issues: https://github.com/datmt/reactotron/issues
5. Review original Reactotron docs: https://docs.infinite.red/reactotron/

---

Last updated: 2026-02-27  
Status: ✅ Complete - Ready to release
