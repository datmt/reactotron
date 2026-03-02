import childProcess from "child_process"
import { type BrowserWindow, dialog, ipcMain, shell } from "electron"
import { sessionLogger } from "./sessionLogger"

// Setup IPC handlers for session logging
export const setupSessionLoggerIPC = (mainWindow: BrowserWindow) => {
  ipcMain.on("log-command", (_event, command: any) => {
    sessionLogger.logCommand(command)
  })

  ipcMain.on("session-summary", (_event, summary: any) => {
    sessionLogger.writeSummary(summary)
  })

  ipcMain.on("open-sessions-folder", () => {
    shell.openPath(sessionLogger.getSessionDir())
  })

  ipcMain.handle("get-session-dir", () => {
    return sessionLogger.getSessionDir()
  })

  ipcMain.handle("list-sessions", async () => {
    const sessionDir = sessionLogger.getSessionDir().split("/").slice(0, -1).join("/")
    try {
      const fs = await import("fs").then((m) => m.promises)
      const sessions = await fs.readdir(sessionDir)

      const sessionData = await Promise.all(
        sessions.map(async (session) => {
          const sessionPath = `${sessionDir}/${session}`
          const summaryPath = `${sessionPath}/summary.json`

          try {
            const summaryContent = await fs.readFile(summaryPath, "utf-8")
            const summary = JSON.parse(summaryContent)
            return {
              name: session,
              path: sessionPath,
              ...summary,
            }
          } catch (e) {
            // If no summary, return basic info
            return {
              name: session,
              path: sessionPath,
              sessionStart: session,
              totalCommands: 0,
              connections: [],
            }
          }
        })
      )

      // Sort by date descending
      return sessionData.sort((a, b) => {
        const dateA = new Date(a.sessionStart || a.name).getTime()
        const dateB = new Date(b.sessionStart || b.name).getTime()
        return dateB - dateA
      })
    } catch (error) {
      console.error("Error listing sessions:", error)
      return []
    }
  })

  ipcMain.handle("load-session-commands", async (_event, sessionPath: string) => {
    try {
      const fs = await import("fs").then((m) => m.promises)
      const logFilePath = `${sessionPath}/commands.log`

      const content = await fs.readFile(logFilePath, "utf-8")
      const lines = content.split("\n").filter((line) => line.trim())

      const commands = lines.map((line) => {
        const parsed = JSON.parse(line)
        return parsed.command || parsed
      })

      return commands
    } catch (error) {
      console.error("Error loading session commands:", error)
      return []
    }
  })
}

// This function sets up numerous IPC commands for communicating with android devices.
// It also watches for android devices being plugged in and unplugged.
//
// Setup IPC handlers for file dialogs
export const setupDialogIPCCommands = (mainWindow: BrowserWindow) => {
  ipcMain.handle('show-save-dialog', async (event, options) => {
    const result = await dialog.showSaveDialog(mainWindow, options)
    return result
  })

  ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options)
    return result
  })
}

// This function sets up numerous IPC commands for communicating with android devices.
// It also watches for android devices being plugged in and unplugged.
//
export const setupAndroidDeviceIPCCommands = (mainWindow: BrowserWindow) => {
  // Allows the main renderer to communicate with the main process and get a list of connected android devices.
  ipcMain.on("get-device-list", () => {
    console.log("Getting Android device list")
    const devicesProcess = childProcess.spawn("adb", ["devices"], {
      shell: true,
    })
    devicesProcess.stdout.setEncoding("utf8")
    devicesProcess.stdout.on("data", (data) => {
      data = data.toString()
      console.log("Got adb device list", data)
      mainWindow.webContents.send("device-list", data)
    })
  })

  // Creates a reverse tunnel to an android device for reactotron and metro.
  ipcMain.on("reverse-tunnel-device", (_event, deviceId, reactotronPort, metroPort) => {
    console.log("Reverse Tunneling Android device", deviceId, reactotronPort, metroPort)

    // First do the reverse tunnel for reactotron:
    const reactotronReverseProcess = childProcess.spawn(
      "adb",
      ["-s", deviceId, "reverse", `tcp:${reactotronPort}`, `tcp:${reactotronPort}`],
      {
        shell: true,
      }
    )
    reactotronReverseProcess.stdout.setEncoding("utf8")
    reactotronReverseProcess.stdout.on("data", () => {
      console.log(`Reverse Tunneling To Reactotron Port ${reactotronPort} Complete.`)
    })

    // Now do the reverse tunnel for react native:
    const metroReverseProcess = childProcess.spawn(
      "adb",
      ["-s", deviceId, "reverse", `tcp:${metroPort}`, `tcp:${metroPort}`],
      {
        shell: true,
      }
    )
    metroReverseProcess.stdout.setEncoding("utf8")
    metroReverseProcess.stdout.on("data", () => {
      console.log(`Reverse Tunneling To Metro Port ${metroPort} Complete.`)
    })
  })

  // Reloads the app on the android device
  ipcMain.on("reload-app", (_event, arg) => {
    console.log("Reloading App on device", arg)
    const reloadAppProcess = childProcess.spawn(
      "adb",
      ["-s", arg, "shell", "input", "text", '"RR"'],
      {
        shell: true,
      }
    )
    reloadAppProcess.stdout.setEncoding("utf8")
    reloadAppProcess.stdout.on("data", (data) => {
      data = data.toString()
      console.log("Reloading App Complete", data)
    })
  })

  // Reloads the app on the android device
  ipcMain.on("shake-device", (_event, arg) => {
    console.log("Showing react-native debug menu", arg)
    const shakeDeviceProcess = childProcess.spawn(
      "adb",
      ["-s", arg, "shell", "input", "keyevent", "82"],
      {
        shell: true,
      }
    )
    shakeDeviceProcess.stdout.setEncoding("utf8")
    shakeDeviceProcess.stdout.on("data", (data) => {
      data = data.toString()
      console.log("Shaking Device Complete", data)
    })
  })

  // Now we need to start watching for android devices being plugged and unplugged
  const trackDevicesProcess = childProcess.spawn("adb", ["track-devices"], {
    shell: true,
  })
  trackDevicesProcess.on("error", (error) => {
    dialog.showMessageBox({
      title: "Android communication problem",
      type: "warning",
      message: "Error occurred running adb track-devices.\n" + error,
    })
  })
  trackDevicesProcess.stdout.setEncoding("utf8")
  trackDevicesProcess.stdout.on("data", (data) => {
    data = data.toString()
    console.log("Got adb track-devices output: ", data)
    ipcMain.emit("get-device-list")
  })
  trackDevicesProcess.stderr.setEncoding("utf8")
  trackDevicesProcess.stderr.on("data", (data) => {
    console.log(data)
  })
  trackDevicesProcess.on("close", (code) => {
    // Warn the user if the process closes.
    switch (code) {
      case 0:
        dialog.showMessageBox({
          title: "Closing adb track-devices",
          type: "info",
          message: "End process.\r\n",
        })
        break
    }
  })
}
