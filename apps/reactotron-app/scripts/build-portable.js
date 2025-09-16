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
  } else if (BUILD_TARGET === 'windows') {
    createWindowsPortablePackage()
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
  console.log(`Creating macOS portable package for ${arch}...`)

  const portableDir = path.join(process.cwd(), 'portable', `macos-${arch}`)
  const releaseDir = path.join(process.cwd(), 'release-portable')

  console.log(`Portable directory: ${portableDir}`)
  console.log(`Release directory: ${releaseDir}`)

  // Create portable directory
  fs.mkdirSync(portableDir, { recursive: true })
  console.log(`✅ Created portable directory: ${portableDir}`)

  // List contents of release directory for debugging
  if (fs.existsSync(releaseDir)) {
    const releaseFiles = fs.readdirSync(releaseDir)
    console.log(`Release directory contents: ${releaseFiles.join(', ')}`)
  } else {
    console.warn(`⚠️  Release directory not found: ${releaseDir}`)
    return
  }

  // Copy the app bundle
  const appName = arch === 'arm64' ? 'Reactotron-arm64.app' : 'Reactotron.app'
  const appPath = path.join(releaseDir, appName)
  console.log(`Looking for app bundle at: ${appPath}`)

  if (fs.existsSync(appPath)) {
    console.log(`✅ Found app bundle: ${appName}`)

    const targetAppPath = path.join(portableDir, 'Reactotron.app')
    require('child_process').execSync(`cp -R "${appPath}" "${targetAppPath}"`, { stdio: 'inherit' })
    console.log(`✅ Copied app bundle to: ${targetAppPath}`)

    // Create launcher script
    const launcherScript = `#!/bin/bash
# Reactotron Portable Launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
open "$DIR/Reactotron.app"
`

    const launcherPath = path.join(portableDir, 'Reactotron.sh')
    fs.writeFileSync(launcherPath, launcherScript)
    fs.chmodSync(launcherPath, '755')
    console.log(`✅ Created launcher script: ${launcherPath}`)

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

    const readmePath = path.join(portableDir, 'README.txt')
    fs.writeFileSync(readmePath, readme)
    console.log(`✅ Created README: ${readmePath}`)

    // List final contents
    const finalFiles = fs.readdirSync(portableDir)
    console.log(`✅ Final portable package contents: ${finalFiles.join(', ')}`)
    console.log(`✅ macOS portable package created successfully at: ${portableDir}`)
  } else {
    console.warn(`⚠️  App bundle not found at: ${appPath}`)
    console.warn(`Available files in release directory: ${fs.readdirSync(releaseDir).join(', ')}`)
  }
}

function createWindowsPortablePackage() {
  console.log('Creating Windows portable package...')

  const portableDir = path.join(process.cwd(), 'portable', 'windows')
  const releaseDir = path.join(process.cwd(), 'release-portable')

  fs.mkdirSync(portableDir, { recursive: true })

  // Copy only the essential files for portable distribution
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir)

    files.forEach(file => {
      const srcPath = path.join(releaseDir, file)
      const destPath = path.join(portableDir, file)

      // Only copy the main executable and essential DLLs
      if (file.includes('reactotron') && file.endsWith('.exe')) {
        require('child_process').execSync(`cp "${srcPath}" "${destPath}"`, { stdio: 'inherit' })
        console.log(`✅ Copied ${file} to portable package`)
      } else if (file.endsWith('.dll') && [
        'ffmpeg.dll',
        'd3dcompiler_47.dll',
        'libEGL.dll',
        'libGLESv2.dll',
        'vulkan-1.dll'
      ].includes(file)) {
        require('child_process').execSync(`cp "${srcPath}" "${destPath}"`, { stdio: 'inherit' })
        console.log(`✅ Copied ${file} to portable package`)
      }
    })
  }

  // Create README for Windows
  const readme = `# Reactotron Portable - Windows

## Instructions

### Portable Executable
1. Download Reactotron.exe and the required DLL files
2. Place all files in the same directory
3. Run Reactotron.exe - no installation required!
4. All settings and data are stored locally

## System Requirements
- Windows 10 or later
- Approximately 50MB of free disk space (much smaller than previous versions)

## Included Files
- Reactotron.exe (main application)
- ffmpeg.dll (media playback support)
- d3dcompiler_47.dll (Direct3D support)
- libEGL.dll (OpenGL support)
- libGLESv2.dll (OpenGL ES support)
- vulkan-1.dll (Vulkan graphics support)

## Notes
- This is a portable version that doesn't require installation
- Only essential files are included for a smaller download size
- Updates must be downloaded manually
- The application will create a local data directory for settings

## Troubleshooting
If you see errors about missing DLLs:
1. Ensure all DLL files are in the same directory as Reactotron.exe
2. Run the application as Administrator if permission issues occur
3. Make sure your antivirus isn't blocking the application

Version: ${process.env.npm_package_version || 'unknown'}
`

  fs.writeFileSync(path.join(portableDir, 'README.txt'), readme)

  console.log(`✅ Windows portable package created at: ${portableDir}`)
}

function createLinuxPortablePackage() {
  console.log('Creating Linux portable package...')

  const portableDir = path.join(process.cwd(), 'portable', 'linux')
  const releaseDir = path.join(process.cwd(), 'release-portable')

  fs.mkdirSync(portableDir, { recursive: true })

  // Copy only the AppImage for true portability
  if (fs.existsSync(releaseDir)) {
    const files = fs.readdirSync(releaseDir)

    files.forEach(file => {
      const srcPath = path.join(releaseDir, file)
      const destPath = path.join(portableDir, file)

      // Only copy AppImage files for clean portable distribution
      if (file.endsWith('.AppImage')) {
        require('child_process').execSync(`cp "${srcPath}" "${destPath}"`, { stdio: 'inherit' })
        fs.chmodSync(destPath, '755') // Make it executable
        console.log(`✅ Copied ${file} to portable package`)
      }
    })
  }

  // Create README for Linux
  const readme = `# Reactotron Portable - Linux

## Instructions

### AppImage (Universal Portable)
1. Download the Reactotron.AppImage file
2. Make it executable: \`chmod +x Reactotron.AppImage\`
3. Run it: \`./Reactotron.AppImage\`
4. No installation required!

## System Requirements
- Linux x86_64
- GTK+ 3.0 or later
- WebKitGTK+ 2.0 or later

## Notes
- This is a single-file portable application
- No installation or dependencies required
- Updates must be downloaded manually
- Much smaller download size than package manager versions

## Troubleshooting
If the AppImage doesn't run:
1. Ensure it's executable: \`chmod +x Reactotron.AppImage\`
2. Try running with: \`./Reactotron.AppImage\`
3. Check your system meets the requirements above

Version: ${process.env.npm_package_version || 'unknown'}
`

  fs.writeFileSync(path.join(portableDir, 'README.txt'), readme)

  console.log(`✅ Linux portable package created at: ${portableDir}`)
}
// #endregion