import React, { useState, useEffect, useCallback } from "react"
import { ipcRenderer } from "electron"
import styled from "styled-components"
import { MdClose, MdDownload, MdRefresh } from "react-icons/md"

interface Session {
  name: string
  path: string
  sessionStart?: string
  sessionEnd?: string
  totalCommands?: number
  connections?: Array<{
    clientId: string
    platform: string
    name?: string
    commandCount?: number
  }>
}

interface SessionBrowserProps {
  isOpen: boolean
  onClose: () => void
  onSessionLoaded: (commands: any[]) => void
}

const Overlay = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background-color: ${(props) => props.theme.backgroundDarker};
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.foregroundDark};
`

const Title = styled.h2`
  margin: 0;
  color: ${(props) => props.theme.foreground};
  font-size: 18px;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.foreground};
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.foregroundBright};
  }
`

const SessionList = styled.div`
  overflow-y: auto;
  flex: 1;
  padding: 0;
`

const SessionItem = styled.div<{ isSelected?: boolean }>`
  padding: 16px 20px;
  border-bottom: 1px solid ${(props) => props.theme.foregroundDark};
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected ? props.theme.backgroundLighter : props.theme.backgroundDarker};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => props.theme.backgroundLighter};
  }
`

const SessionName = styled.div`
  color: ${(props) => props.theme.foreground};
  font-weight: 500;
  margin-bottom: 8px;
`

const SessionMetadata = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.foregroundDark};
  display: flex;
  gap: 16px;

  & > span {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const Footer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid ${(props) => props.theme.foregroundDark};
  justify-content: flex-end;
`

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  ${(props) =>
    props.variant === "primary"
      ? `
    background-color: ${props.theme.tintColor || "#5B9BFF"};
    color: white;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `
      : `
    background-color: ${props.theme.backgroundLighter};
    color: ${props.theme.foreground};

    &:hover {
      background-color: ${props.theme.backgroundSubtleDark};
    }
  `}
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: ${(props) => props.theme.foregroundDark};
  text-align: center;
`

const RefreshButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.foreground};
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.foregroundBright};
  }
`

const SessionBrowser: React.FC<SessionBrowserProps> = ({ 
  isOpen, 
  onClose, 
  onSessionLoaded
}) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedSession, setSelectedSession] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const loadSessions = useCallback(async () => {
    setRefreshing(true)
    try {
      const sessionList = await ipcRenderer.invoke("list-sessions")
      setSessions(sessionList || [])
    } catch (error) {
      console.error("Failed to load sessions:", error)
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      loadSessions()
    }
  }, [isOpen, loadSessions])

  const handleLoadSession = useCallback(async () => {
    if (!selectedSession) return

    const session = sessions.find((s) => s.path === selectedSession)
    if (!session) return

    setLoading(true)
    try {
      const commands = await ipcRenderer.invoke("load-session-commands", session.path)
      onSessionLoaded(commands)
      onClose()
    } catch (error) {
      console.error("Failed to load session commands:", error)
    } finally {
      setLoading(false)
    }
  }, [selectedSession, sessions, onSessionLoaded, onClose])

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown"
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Load Previous Session</Title>
          <div style={{ display: "flex", gap: "8px" }}>
            <RefreshButton onClick={loadSessions} disabled={refreshing} title="Refresh">
              <MdRefresh style={{ transform: refreshing ? "rotate(360deg)" : "none" }} />
            </RefreshButton>
            <CloseButton onClick={onClose}>
              <MdClose />
            </CloseButton>
          </div>
        </Header>

        <SessionList>
          {sessions.length === 0 ? (
            <EmptyState>
              <p>No previous sessions found</p>
              <p style={{ fontSize: "12px" }}>
                Sessions are created each time you launch the app
              </p>
            </EmptyState>
          ) : (
            sessions.map((session) => (
              <SessionItem
                key={session.path}
                isSelected={selectedSession === session.path}
                onClick={() => setSelectedSession(session.path)}
              >
                <SessionName>{session.name}</SessionName>
                <SessionMetadata>
                  <span title="Session start time">
                    📅 {formatDate(session.sessionStart)}
                  </span>
                  <span title="Total commands logged">
                    📊 {session.totalCommands || 0} commands
                  </span>
                  {session.connections && session.connections.length > 0 && (
                    <span title="Connected devices">
                      📱 {session.connections.length} device{session.connections.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </SessionMetadata>
              </SessionItem>
            ))
          )}
        </SessionList>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleLoadSession}
            disabled={!selectedSession || loading}
          >
            {loading ? "Loading..." : "Load Session"}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  )
}

export default SessionBrowser
