/**
 * Electron Builder configuration for portable builds
 * This configuration focuses on creating standalone, portable applications
 * that don't require installation
 */

module.exports = {
  productName: "Reactotron",
  appId: "com.reactotron.app",

  // Aggressively exclude unnecessary files for smaller portable builds
  files: [
    "src/dist/",
    "src/app.html",
    "src/main.prod.js",
    "package.json"
  ],

  // Global exclusions for all platforms
  extraFiles: [],

  // Exclude debug files and unnecessary resources
  asarUnpack: [],

  // macOS configuration for portable builds
  mac: {
    target: [
      {
        target: "dir",
        arch: ["x64", "arm64"]
      }
    ],
    hardenedRuntime: false,
    gatekeeperAssess: false,
    // Disable code signing for portable builds
    identity: null,
    extendInfo: {
      LSUIElement: false, // Show in dock
      NSHighResolutionCapable: true
    }
  },

  // Windows configuration for portable builds
  win: {
    target: "portable",
    icon: "./icon.png",
    // Disable digital signing for portable builds
    signingHashAlgorithms: [],
    signDlls: false,
    verifyUpdateCodeSignature: false,
    // Exclude unnecessary files from portable build
    fileAssociations: [],
    // Only include essential files for portable build
    files: [
      "**/*",
      "!**/*.pdb",
      "!**/*.map",
      "!**/node_modules/**/*",
      "!**/resources/*.pak",
      "!**/resources/*.dll",
      "!**/resources/*.bin",
      "!**/resources/*.dat",
      "!**/resources/*.json"
    ],
    // Only include essential DLLs
    extraFiles: [
      {
        from: "../node_modules/electron/dist",
        to: ".",
        filter: [
          "ffmpeg.dll",
          "d3dcompiler_47.dll",
          "libEGL.dll",
          "libGLESv2.dll",
          "vulkan-1.dll"
        ]
      }
    ]
  },

  // Linux configuration for portable builds
  linux: {
    target: ["AppImage"], // Only AppImage for true portability
    icon: "./icon.png",
    category: "Development",
    // Make it more portable
    synopsis: "A desktop app for inspecting React and React Native applications",
    description: "Reactotron is a desktop app for inspecting your React and React Native applications.",
    // Exclude unnecessary files
    files: [
      "**/*",
      "!**/*.pdb",
      "!**/*.map",
      "!**/node_modules/**/*"
    ]
  },

  // General configuration for portable builds
  directories: {
    output: "release-portable",
    buildResources: "resources"
  },

  // Disable auto-update for portable builds
  publish: {
    provider: "github",
    owner: "infinitered",
    repo: "reactotron"
  },

  // Additional configuration for portability
  extraMetadata: {
    portable: true,
    standalone: true
  },

  // Ensure the app can run from any location
  asarUnpack: [
    "**/node_modules/{spawn-sync,spawn-sync/**}",
    "**/node_modules/{sharp,sharp/**}"
  ],

  // Compression settings for portable builds
  compression: "normal",

  // Minimal resources for portable builds
  extraResources: []
}