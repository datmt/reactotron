import Store from "electron-store"

type StoreType = {
  serverPort: number
  commandHistory: number
}

const config = new Store<StoreType>({
  schema: {
    serverPort: {
      type: "number",
      default: 9090,
    },
    commandHistory: {
      type: "number",
      default: 500,
    },
  },
})

// Separate store for timeline logs persistence
export type TimelineLogsType = {
  connectionLogs: {
    [clientId: string]: any[]
  }
}

export const timelineLogsStore = new Store<TimelineLogsType>({
  name: "timeline-logs",
  schema: {
    connectionLogs: {
      type: "object",
      default: {},
    },
  },
})

// Setup defaults
if (!config.has("serverPort")) {
  config.set("serverPort", 9090)
}
if (!config.has("commandHistory")) {
  config.set("commandHistory", 500)
}

export default config
