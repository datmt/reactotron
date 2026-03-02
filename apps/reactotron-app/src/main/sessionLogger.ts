import * as fs from "fs"
import * as path from "path"
import { app } from "electron"

/**
 * Session-based file logger for persisting logs to text files
 * Creates a new session folder with timestamped log files for debugging
 */
export class SessionLogger {
  private sessionDir: string
  private logFile: string
  private sessionStartTime: Date

  constructor() {
    this.sessionStartTime = new Date()
    this.sessionDir = this.initializeSessionDirectory()
    this.logFile = path.join(this.sessionDir, "commands.log")
  }

  private initializeSessionDirectory(): string {
    // Create logs directory in app user data
    const logsDir = path.join(app.getPath("userData"), "sessions")
    
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true })
    }

    // Create session folder with timestamp
    const sessionTimestamp = this.sessionStartTime
      .toISOString()
      .replace(/[:.]/g, "-")
      .split("T")[0] + "_" + this.sessionStartTime.getTime()
    
    const sessionPath = path.join(logsDir, sessionTimestamp)
    
    if (!fs.existsSync(sessionPath)) {
      fs.mkdirSync(sessionPath, { recursive: true })
    }

    return sessionPath
  }

  /**
   * Log a command to the session file
   */
  public logCommand(command: any): void {
    try {
      const timestamp = new Date().toISOString()
      const logEntry = {
        timestamp,
        command,
      }

      const logLine = JSON.stringify(logEntry) + "\n"
      fs.appendFileSync(this.logFile, logLine, "utf-8")
    } catch (error) {
      console.error("Failed to write to session log:", error)
    }
  }

  /**
   * Write a summary file with session metadata
   */
  public writeSummary(summary: {
    sessionStart: string
    sessionEnd: string
    totalCommands: number
    connections: any[]
  }): void {
    try {
      const summaryFile = path.join(this.sessionDir, "summary.json")
      fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), "utf-8")
    } catch (error) {
      console.error("Failed to write session summary:", error)
    }
  }

  /**
   * Get the session directory path
   */
  public getSessionDir(): string {
    return this.sessionDir
  }

  /**
   * Get the current session's start time
   */
  public getSessionStartTime(): Date {
    return this.sessionStartTime
  }
}

// Export singleton instance
export const sessionLogger = new SessionLogger()
