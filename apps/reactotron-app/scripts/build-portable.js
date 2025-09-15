// @ts-check
/**
 * Build script for creating portable Reactotron releases
 * This script builds standalone applications that don't require installation
 */

const path = require('path')
const fs = require('fs')

// #region Validate inputs
const BUILD_TARGET = process.env.BUILD_TARGET
const BUILD_ARCH = process.env.BUILD_ARCH || 'x64'

if (!BUILD_TARGET || !['macos', 'linux', 'windows'].includes(BUILD_TARGET)) {
  throw new Error('BUILD_TARGET must be either "macos", "linux" or "windows"')
}

console.log(`Building portable app for target: '${BUILD_TARGET}' (${BUILD_ARCH})`)
// #endregion

// #region Build configuration
let flags = `--config electron-builder-portable.config.js --publish never`

if (BUILD_TARGET === 'macos') {
  flags += ` --macos --${BUILD_ARCH} --dir`
} else if (BUILD_TARGET === 'windows') {
  flags += ` --windows --x64`
} else if (BUILD_TARGET === 'linux') {
  flags += ` --linux --x64`
  // If a specific Linux target is specified, use it
  if (process.env.LINUX_TARGET) {
    flags += ` --${process.env.LINUX_TARGET}`
  }
}
// #endregion

/** @param cmd {string} */
const $ = (cmd) => {
  require('child_process').execSync(cmd, {
    env: { ...process.env, BUILD_TARGET, BUILD_ARCH },
    stdio: 'inherit'
  })
}

console.log(`Building portable app with flags: '${flags}'...`)

try {
  // Build the application
  $('yarn build')
  $(`npx electron-builder ${flags}`)

  // Create portable packages
  if (BUILD_TARGET === 'macos') {
    createMacOSPortablePackage(BUILD_ARCH)
  } else if (BUILD_TARGET === 'linux') {
    createLinuxPortablePackage()
  }

  console.log(`✅ Portable build completed successfully for ${BUILD_TARGET} (${BUILD_ARCH})`)
} catch (error) {
  console.error(`❌ Build failed for ${BUILD_TARGET}:`, error.message)
  process.exit(1)
}

// #region Platform-specific packaging
function createMacOSPortablePackage(arch) {
  console.log('Creating macOS portable package...')

  const portableDir = path.join(process.cwd(), 'portable', `macos-${arch}`)
  const releaseDir = path.join(process.cwd(), 'release-portable')

  // Create portable directory
  fs.mkdirSync(portableDir, { recursive: true })

  // Copy the app bundle
  const appName = arch === 'arm64' ? 'Reactotron-arm64.app' : 'Reactotron.app'
  const appPath = path.join(releaseDir, appName)

  if (fs.existsSync(appPath)) {
    require('child_process').execSync(`cp -R "${appPath}" "${portableDir}/Reactotron.app"`, { stdio: 'inherit' })

    // Create launcher script
    const launcherScript = `#!/bin/bash
# Reactotron Portable Launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
open "$DIR/Reactotron.app"
`

    fs.writeFileSync(path.join(portableDir, 'Reactotron.sh'), launcherScript)
    fs.chmodSync(path.join(portableDir, 'Reactotron.sh'), '755')

    // Create README for portable version
    const readme = `# Reactotron Portable - macOS

## Instructions

1. Extract this directory to any location
2. Run \`./Reactotron.sh\` or double-click Reactotron.app
3. No installation required!

## System Requirements
- macOS 10.12 or later
- ${arch === 'arm64' ? 'Apple Silicon (M1/M2)' : 'Intel x64'} processor

## Notes
- This is a portable version that doesn't require installation
- All data is stored locally within this directory
- Updates must be downloaded manually

Version: ${process.env.npm_package_version || 'unknown'}
`

    fs.writeFileSync(path.join(portableDir, 'README.txt'), readme)

    console.log(`✅ macOS portable package created at: ${portableDir}`)
  } else {
    console.warn(`⚠️  App bundle not found at: ${appPath}`)
  }
}

function createLinuxPortablePackage() {
  console.log('Creating Linux portable package...')

  const portableDir = path.join(process.cwd(), 'portable', 'linux')
  const releaseDir = path.join(process.cwd(), 'release-portable')

  fs.mkdirSync(portableDir, { recursive: true })

  // Copy all build artifacts
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir)

    files.forEach(file => {
      const srcPath = path.join(releaseDir, file)
      const destPath = path.join(portableDir, file)

      // Copy file if it's a build artifact
      if (file.includes('reactotron') || file.endsWith('.AppImage') || file.endsWith('.deb') || file.endsWith('.rpm')) {
        require('child_process').execSync(`cp "${srcPath}" "${destPath}"`, { stdio: 'inherit' })

        // Make AppImage and executable files executable
        if (file.endsWith('.AppImage') || !file.includes('.')) {
          fs.chmodSync(destPath, '755')
        }
      }
    })
  }

  // Create README for Linux
  const readme = `# Reactotron Portable - Linux

## Instructions

### AppImage (Recommended - Universal)
1. Download the .AppImage file
2. Make it executable: \`chmod +x *.AppImage\`
3. Run it: \`./Reactotron*.AppImage\`
4. No installation required!

### Debian/Ubuntu (.deb)
1. Install with: \`sudo dpkg -i reactotron*.deb\`
2. If dependencies are missing: \`sudo apt-get install -f\`

### RedHat/Fedora (.rpm)
1. Install with: \`sudo rpm -i reactotron*.rpm\`

## System Requirements
- Linux x86_64
- GTK+ 3.0 or later
- WebKitGTK+ 2.0 or later

## Notes
- AppImage is the most portable option (no installation needed)
- Package manager versions integrate with your system
- Updates must be downloaded manually for portable versions

Version: ${process.env.npm_package_version || 'unknown'}
`

  fs.writeFileSync(path.join(portableDir, 'README.txt'), readme)

  console.log(`✅ Linux portable package created at: ${portableDir}`)
}
// #endregion