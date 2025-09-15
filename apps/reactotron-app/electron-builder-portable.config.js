/**
 * Electron Builder configuration for portable builds
 * This configuration focuses on creating standalone, portable applications
 * that don't require installation
 */

module.exports = {
  productName: "Reactotron",
  appId: "com.reactotron.app",

  files: [
    "src/dist/",
    "src/app.html",
    "src/main.prod.js",
    "src/main.prod.js.map",
    "package.json"
  ],

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
    target: [
      {
        target: "portable",
        arch: ["x64"]
      }
    ],
    icon: "./icon.png",
    // Disable digital signing for portable builds
    signingHashAlgorithms: [],
    signDlls: false,
    verifyUpdateCodeSignature: false
  },

  // Linux configuration for portable builds
  linux: {
    target: [
      {
        target: "AppImage",
        arch: ["x64"]
      },
      {
        target: "deb",
        arch: ["x64"]
      },
      {
        target: "rpm",
        arch: ["x64"]
      }
    ],
    icon: "./icon.png",
    category: "Development",
    // Make it more portable
    synopsis: "A desktop app and command line tool for inspecting your React and React Native applications",
    description: "Reactotron is a desktop app and command line tool for inspecting your React and React Native applications. Use it to view your application state, show API requests & responses, perform performance benchmarks, and more."
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

  // Remove unnecessary files for portable builds
  extraResources: [
    {
      from: "LICENSE",
      to: "LICENSE"
    },
    {
      from: "../../README.md",
      to: "README.md"
    }
  ]
}