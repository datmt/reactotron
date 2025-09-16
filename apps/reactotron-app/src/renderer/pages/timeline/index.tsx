import React, { useCallback, useContext, useMemo } from "react"
import { clipboard, shell, ipcRenderer } from "electron"
import fs from "fs"
import os from "os"
import path from "path"
import debounce from "lodash.debounce"
import { apiRequestToCurl } from "reactotron-core-ui/src/utils/api-to-curl"
import {
  Header,
  filterCommands,
  TimelineFilterModal,
  timelineCommandResolver,
  EmptyState,
  ReactotronContext,
  TimelineContext,
  RandomJoke,
} from "reactotron-core-ui"
import {
  MdSearch,
  MdDeleteSweep,
  MdFilterList,
  MdSwapVert,
  MdReorder,
  MdDownload,
  MdApi,
} from "react-icons/md"
import { FaTimes } from "react-icons/fa"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const TimelineContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`
const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 10px;
  padding-top: 4px;
  padding-right: 10px;
`
const SearchLabel = styled.p`
  padding: 0 10px;
  font-size: 14px;
  color: ${(props) => props.theme.foregroundDark};
`
const SearchInput = styled.input`
  border-radius: 4px;
  padding: 10px;
  flex: 1;
  background-color: ${(props) => props.theme.backgroundSubtleDark};
  border: none;
  color: ${(props) => props.theme.foregroundDark};
  font-size: 14px;
`
const HelpMessage = styled.div`
  margin: 0 40px;
`
const QuickStartButtonContainer = styled.div`
  display: flex;
  padding: 4px 8px;
  margin: 30px 20px;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => props.theme.backgroundLighter};
  color: ${(props) => props.theme.foreground};
  align-items: center;
  justify-content: center;
  text-align: center;
`
const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.foregroundDark};
  margin: 40px 10px;
`

export const ButtonContainer = styled.div`
  padding: 10px;
  cursor: pointer;
`

function Timeline() {
  const { sendCommand, clearCommands, commands, openDispatchModal } = useContext(ReactotronContext)
  const {
    isSearchOpen,
    toggleSearch,
    closeSearch,
    setSearch,
    search,
    isReversed,
    toggleReverse,
    openFilter,
    closeFilter,
    isFilterOpen,
    hiddenCommands,
    setHiddenCommands,
  } = useContext(TimelineContext)

  let filteredCommands
  try {
    filteredCommands = filterCommands(commands, search, hiddenCommands)
  } catch (error) {
    console.error(error)
    filteredCommands = commands
  }

  if (isReversed) {
    filteredCommands = filteredCommands.reverse()
  }

  const dispatchAction = (action: any) => {
    sendCommand("state.action.dispatch", { action })
  }

  function openDocs() {
    shell.openExternal("https://docs.infinite.red/reactotron/quick-start/react-native/")
  }

  async function downloadLog() {
    try {
      // Show save dialog via IPC
      const result = await ipcRenderer.invoke('show-save-dialog', {
        title: 'Export Timeline Log',
        defaultPath: path.join(os.homedir(), 'Downloads', `timeline-log-${Date.now()}.json`),
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (result.filePath) {
        fs.writeFileSync(result.filePath, JSON.stringify(commands || [], null, 2), 'utf8')
        console.log(`Exported timeline log to ${result.filePath}`)
      }
    } catch (err) {
      console.error('Error showing save dialog:', err)
    }
  }

  async function exportApiCalls() {
    const apiCommands = commands.filter(cmd => cmd.type === 'api.response')

    if (apiCommands.length === 0) {
      try {
        await ipcRenderer.invoke('show-message-box', {
          type: 'info',
          title: 'No API Calls',
          message: 'No API calls found in the timeline to export.',
          buttons: ['OK']
        })
      } catch (err) {
        console.error('Error showing message box:', err)
      }
      return
    }

    let exportContent = ''

    apiCommands.forEach((command, index) => {
      const { payload, date } = command
      exportContent += `API Call #${index + 1}\n`
      exportContent += `Timestamp: ${new Date(date).toISOString()}\n`
      exportContent += `Method: ${payload.request.method}\n`
      exportContent += `URL: ${payload.request.url}\n`
      exportContent += `Status: ${payload.response.status}\n`
      exportContent += `Duration: ${payload.duration}ms\n`

      if (payload.request.headers) {
        exportContent += `Request Headers:\n`
        Object.entries(payload.request.headers).forEach(([key, value]) => {
          exportContent += `  ${key}: ${value}\n`
        })
      }

      if (payload.request.data) {
        exportContent += `Request Body:\n`
        try {
          const parsedData = typeof payload.request.data === 'string'
            ? JSON.parse(payload.request.data)
            : payload.request.data
          exportContent += `${JSON.stringify(parsedData, null, 2)}\n`
        } catch (e) {
          exportContent += `${payload.request.data}\n`
        }
      }

      exportContent += `Response Headers:\n`
      Object.entries(payload.response.headers).forEach(([key, value]) => {
        exportContent += `  ${key}: ${value}\n`
      })

      exportContent += `Response Body:\n`
      try {
        const responseBody = typeof payload.response.body === 'string'
          ? JSON.parse(payload.response.body)
          : payload.response.body
        exportContent += `${JSON.stringify(responseBody, null, 2)}\n`
      } catch (e) {
        exportContent += `${payload.response.body}\n`
      }

      exportContent += `cURL Command:\n`
      exportContent += `${apiRequestToCurl(payload)}\n`

      exportContent += '------\n\n'
    })

    try {
      // Show save dialog via IPC
      const result = await ipcRenderer.invoke('show-save-dialog', {
        title: 'Export API Calls',
        defaultPath: path.join(os.homedir(), 'Downloads', `api-calls-${Date.now()}.txt`),
        filters: [
          { name: 'Text Files', extensions: ['txt'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })

      if (result.filePath) {
        fs.writeFileSync(result.filePath, exportContent, 'utf8')
        console.log(`Exported ${apiCommands.length} API calls to ${result.filePath}`)
      }
    } catch (err) {
      console.error('Error showing save dialog:', err)
    }
  }

  const { searchString, handleInputChange } = useDebouncedSearchInput(search, setSearch, 300)

  return (
    <Container>
      <Header
        title="Timeline"
        isDraggable
        actions={[
          {
            tip: "Export Log",
            icon: MdDownload,
            onClick: () => {
              downloadLog()
            },
          },
          {
            tip: "Export API Calls",
            icon: MdApi,
            onClick: () => {
              exportApiCalls()
            },
          },
          {
            tip: "Search",
            icon: MdSearch,
            onClick: () => {
              toggleSearch()
            },
          },
          {
            tip: "Filter",
            icon: MdFilterList,
            onClick: () => {
              openFilter()
            },
          },
          {
            tip: "Reverse Order",
            icon: MdSwapVert,
            onClick: () => {
              toggleReverse()
            },
          },
          {
            tip: "Clear",
            icon: MdDeleteSweep,
            onClick: () => {
              clearCommands()
            },
          },
        ]}
      >
        {isSearchOpen && (
          <SearchContainer>
            <SearchLabel>Search</SearchLabel>
            <SearchInput autoFocus value={searchString} onChange={handleInputChange} />
            <ButtonContainer
              onClick={() => {
                if (search === "") {
                  closeSearch()
                } else {
                  setSearch("")
                }
              }}
            >
              <FaTimes size={24} />
            </ButtonContainer>
          </SearchContainer>
        )}
      </Header>
      <TimelineContainer>
        {filteredCommands.length === 0 ? (
          <EmptyState icon={MdReorder} title="No Activity">
            <HelpMessage>
              Once your app connects and starts sending events, they will appear here.
            </HelpMessage>
            <QuickStartButtonContainer onClick={openDocs}>
              Check out the quick start guide here!
            </QuickStartButtonContainer>
            <Divider />
            <RandomJoke />
          </EmptyState>
        ) : (
          filteredCommands.map((command) => {
            const CommandComponent = timelineCommandResolver(command.type)

            if (CommandComponent) {
              return (
                <CommandComponent
                  key={command.messageId}
                  command={command}
                  copyToClipboard={clipboard.writeText}
                  readFile={(path) => {
                    return new Promise((resolve, reject) => {
                      fs.readFile(path, "utf-8", (err, data) => {
                        if (err || !data) reject(new Error("Something failed"))
                        else resolve(data)
                      })
                    })
                  }}
                  sendCommand={sendCommand}
                  dispatchAction={dispatchAction}
                  openDispatchDialog={openDispatchModal}
                />
              )
            }

            return null
          })
        )}
      </TimelineContainer>
      <TimelineFilterModal
        isOpen={isFilterOpen}
        onClose={() => {
          closeFilter()
        }}
        hiddenCommands={hiddenCommands}
        setHiddenCommands={setHiddenCommands}
      />
    </Container>
  )
}

export default Timeline

const useDebouncedSearchInput = (
  initialValue: string,
  setSearch: (search: string) => void,
  delay: number = 300
) => {
  const [searchString, setSearchString] = React.useState<string>(initialValue)
  const debouncedOnChange = useMemo(() => debounce(setSearch, delay), [delay, setSearch])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      setSearchString(value)
      debouncedOnChange(value)
    },
    [debouncedOnChange]
  )

  return {
    searchString,
    handleInputChange,
  }
}
