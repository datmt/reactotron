import React, { useRef, useEffect, useCallback } from "react"
import { ipcRenderer } from "electron"
import Server, { createServer } from "reactotron-core-server"

import ReactotronBrain from "../../ReactotronBrain"
import config from "../../config"

import useStandalone, { Connection, ServerStatus, ActionTypes } from "./useStandalone"

// TODO: Move up to better places like core somewhere!
interface Context {
  serverStatus: ServerStatus
  connections: Connection[]
  selectedConnection: Connection
  selectConnection: (clientId: string) => void
}

const StandaloneContext = React.createContext<Context>({
  serverStatus: "stopped",
  connections: [],
  selectedConnection: null,
  selectConnection: null,
})

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reactotronServer = useRef<Server>(null)

  const commandHistoryLimit = config.get("commandHistory") as number
  
  const {
    serverStatus,
    connections,
    selectedClientId,
    selectedConnection,
    selectConnection,
    clearSelectedConnectionCommands,
    serverStarted,
    serverStopped,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    addCommandListener,
    portUnavailable,
    loadSessionCommands,
  } = useStandalone(commandHistoryLimit)

  useEffect(() => {
    reactotronServer.current = createServer({ port: config.get("serverPort") as number })

    // Wrapper to log commands to session file
    const commandReceivedWithLogging = (command: any) => {
      ipcRenderer.send("log-command", command)
      commandReceived(command)
    }

    reactotronServer.current.on("start", serverStarted)
    reactotronServer.current.on("stop", serverStopped)
    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("connectionEstablished", connectionEstablished)
    reactotronServer.current.on("command", commandReceivedWithLogging)
    // @ts-expect-error need to sync these types between reactotron-core-server and reactotron-app
    reactotronServer.current.on("disconnect", connectionDisconnected)
    reactotronServer.current.on("portUnavailable", portUnavailable)

    reactotronServer.current.start()

    // Listen for session summary request on app quit
    ipcRenderer.on("request-session-summary", () => {
      const summary = {
        sessionStart: new Date().toISOString(),
        sessionEnd: new Date().toISOString(),
        totalCommands: connections.reduce((acc, conn) => acc + conn.commands.length, 0),
        connections: connections.map((c) => ({
          clientId: c.clientId,
          name: c.name,
          platform: c.platform,
          commandCount: c.commands.length,
        })),
      }
      ipcRenderer.send("session-summary", summary)
    })

    return () => {
      reactotronServer.current.stop()
      ipcRenderer.removeAllListeners("request-session-summary")
    }
  }, [
    serverStarted,
    serverStopped,
    connectionEstablished,
    commandReceived,
    connectionDisconnected,
    portUnavailable,
    connections,
  ])

  const sendCommand = useCallback(
    (type: string, payload: any, clientId?: string) => {
      // TODO: Do better then just throwing these away...
      if (!reactotronServer.current) return

      reactotronServer.current.send(type, payload, clientId || selectedClientId)
    },
    [reactotronServer, selectedClientId]
  )

  // Expose loadSessionCommands globally for timeline to access
  useEffect(() => {
    ;(window as any).__reactotronLoadSession = loadSessionCommands
  }, [loadSessionCommands])

  return (
    <StandaloneContext.Provider
      value={{
        serverStatus,
        connections,
        selectedConnection,
        selectConnection,
      }}
    >
      <ReactotronBrain
        commands={(selectedConnection || { commands: [] }).commands}
        sendCommand={sendCommand}
        clearCommands={clearSelectedConnectionCommands}
        addCommandListener={addCommandListener}
      >
        {children}
      </ReactotronBrain>
    </StandaloneContext.Provider>
  )
}

export default StandaloneContext
export const StandaloneProvider = Provider
