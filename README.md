# JAMLA - Just Another Mobile Logging App

<div align="center">

![JAMLA Logo](./apps/reactotron-app/icon.png)

**A lightweight, fork-focused mobile app debugger built for backend developers**

[📦 Download](#installation) • [🚀 Quick Start](#quick-start) • [📚 Documentation](#features) • [🔗 GitHub](https://github.com/datmt/reactotron)

</div>

---

⚠️ **Note**: This is a customized fork of [Reactotron](https://github.com/infinitered/reactotron), tailored specifically for backend developers who need simplified mobile app logging and monitoring. If you're looking for the full-featured official Reactotron, please visit the [original repository](https://github.com/infinitered/reactotron).

## What is JAMLA?

JAMLA is a specialized fork of Reactotron designed for **backend developers** who need to quickly monitor and debug logs from mobile applications. It provides:

- ✅ **Real-time Log Monitoring** - View all application logs in one place
- ✅ **Persistent Timeline** - Logs survive app crashes
- ✅ **Network Inspection** - Monitor API calls and responses
- ✅ **Simplified UI** - Clean, backend-focused interface
- ✅ **Cross-platform** - macOS, Windows, and Linux support

## Features

Use Reactotron to:

- view your application state
- show API requests & responses
- perform quick performance benchmarks
- subscribe to parts of your application state
- display messages similar to `console.log`
- track global errors with source-mapped stack traces including saga stack traces!
- dispatch actions like a government-run mind control experiment
- hot swap your app's state using Redux or mobx-state-tree
- show image overlay in React Native
- track your Async Storage in React Native

You plug it into your app as a dev dependency so it adds nothing to your production builds.

### Desktop

Reactotron on the left, demo React Native app on the right.

![Desktop](./docs/plugins/images/readme/reactotron-demo-app.gif)

## Installation

Download the latest version from [Releases](https://github.com/datmt/reactotron/releases):

- **macOS**: Download `.dmg` and drag to Applications
- **Windows**: Download `.exe` installer and run
- **Linux**: Download `.AppImage`, make executable, and run

## Quick Start

1. Download and install JAMLA from releases
2. Connect your mobile app using Reactotron's client libraries
3. View logs, network requests, and app state in real-time

For setup instructions:
- [**React Native**](https://docs.infinite.red/reactotron/quick-start/react-native/)
- [**React**](https://docs.infinite.red/reactotron/quick-start/react-js/)

## How to use Reactotron's features/plugins

- [**Track Global Errors**](https://docs.infinite.red/reactotron/plugins/track-global-errors/)
- [**Track Global Logs**](https://docs.infinite.red/reactotron/plugins/track-global-logs/)
- [**Networking**](https://docs.infinite.red/reactotron/plugins/networking/)
- [**Async Storage**](https://docs.infinite.red/reactotron/plugins/async-storage/)
- [**React Native MMKV**](https://docs.infinite.red/reactotron/plugins/react-native-mmkv/)
- [**Benchmark**](https://docs.infinite.red/reactotron/plugins/benchmark/)
- [**apisauce**](https://docs.infinite.red/reactotron/plugins/apisauce/)
- [**Overlay**](https://docs.infinite.red/reactotron/plugins/overlay/)
- [**MST**](https://docs.infinite.red/reactotron/plugins/mst/)
- [**Redux**](https://docs.infinite.red/reactotron/plugins/redux/)
- [**Open in Editor**](https://docs.infinite.red/reactotron/plugins/open-in-editor/)
- [**Storybook (only for React Native)**](https://docs.infinite.red/reactotron/plugins/storybook/) \
   `reactotron-react-native` ships with [Storybook](https://storybook.js.org/).
  This enables you to switch to Storybook from the Reactotron app.
- [**Custom Commands**](https://docs.infinite.red/reactotron/custom-commands/)

## Tips and Tricks

[Some tips that will elevate your Reactotron experience.](https://docs.infinite.red/reactotron/tips/)

## Bug Reports

When reporting problems with Reactotron, use the provided example app located in `app/example-app` to replicate the issue. This approach enables us to isolate and expedite the resolution of the problem.

## Want to contribute? Here are some helpful reading materials

- [**Contributing**](https://docs.infinite.red/reactotron/contributing/)
- [**Architecture**](https://docs.infinite.red/reactotron/contributing/architecture/)
- [**Monorepo**](https://docs.infinite.red/reactotron/contributing/monorepo/)
- [**Release**](https://docs.infinite.red/reactotron/contributing/releasing/)

## Troubleshooting

- [**React Native iOS**](https://docs.infinite.red/reactotron/troubleshooting/#react-native-ios)
- [**React Native Android**](https://docs.infinite.red/reactotron/troubleshooting/#react-native-android)

## Credits

Reactotron is developed by [Infinite Red](https://infinite.red), [@rmevans9](https://github.com/rmevans9), and 70+ amazing contributors! Special thanks to [@skellock](https://github.com/skellock) for originally creating Reactotron while at Infinite Red.

## Premium Support

[Reactotron](https://infinite.red/reactotron), as an open source project, is free to use and always will be. [Infinite Red](https://infinite.red/) offers premium React and [React Native](https://infinite.red/react-native) mobile app design/development services. Email us at [hello@infinite.red](mailto:hello@infinite.red) to get in touch for more details.
