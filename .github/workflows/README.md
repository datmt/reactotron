# GitHub Actions Workflows

## Build Portable Releases Workflow

This workflow builds portable, standalone versions of Reactotron for all supported platforms when a new tag is pushed.

### Trigger Conditions

The workflow automatically runs when:
- A tag matching the pattern `reactotron-app@*` is pushed (e.g., `reactotron-app@3.7.8`)
- Manually triggered via GitHub Actions UI with a specific version

### Build Targets

The workflow builds portable applications for:

#### macOS
- **Intel x64**: Portable app bundle with launcher script
- **Apple Silicon arm64**: Native ARM64 app bundle with launcher script
- **Format**: Directory-based distribution with `.sh` launcher

#### Windows
- **x64**: Portable executable (no installation required)
- **Format**: `.exe` that runs from any location

#### Linux
- **AppImage**: Universal portable format (recommended)
- **Debian**: For Debian/Ubuntu-based systems
- **RPM**: For RedHat/Fedora-based systems
- **Format**: Standalone packages

### Portable Features

- **No installation required**: Applications run from any directory
- **Self-contained**: All dependencies included
- **No system changes**: Doesn't modify registry or system files
- **Launcher scripts**: Easy execution with double-click or command line
- **README files**: Usage instructions included with each build

### Output Locations

Build artifacts are automatically:
1. Uploaded as GitHub Actions artifacts (temporary, 30-day retention)
2. Attached to GitHub releases (permanent, for tag-based builds)

### Release Structure

When triggered by a tag, the workflow creates a GitHub release with:
- All portable binaries organized by platform
- Detailed installation instructions
- Automatic release notes from CHANGELOG.md
- Prerelease marking for beta/alpha versions

### Manual Usage

To trigger a manual build:
1. Go to Actions tab in GitHub repository
2. Select "Build Portable Releases" workflow
3. Click "Run workflow"
4. Enter the version number to build
5. Click "Run workflow"

### Configuration Files

- **Main workflow**: `.github/workflows/build-portable-releases.yml`
- **Portable config**: `apps/reactotron-app/electron-builder-portable.config.js`
- **Build script**: `apps/reactotron-app/scripts/build-portable.js`

### Environment Variables

Key variables used in the build process:
- `BUILD_TARGET`: Platform to build (macos, linux, windows)
- `BUILD_ARCH`: Architecture (x64, arm64)
- `LINUX_TARGET`: Linux specific format (AppImage, deb, rpm)

### Requirements

- GitHub repository with appropriate secrets
- Node.js 18+
- Yarn package manager
- Electron Builder dependencies

### Notes

- Code signing is disabled for portable builds
- Auto-updates are disabled for portable versions
- Builds are optimized for portability over system integration
- All builds are 64-bit only for compatibility and performance