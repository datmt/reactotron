import { useContext } from "react"
import StandaloneContext from "../contexts/Standalone"

export const useStandaloneContext = () => {
  const context = useContext(StandaloneContext)
  if (!context) {
    throw new Error("useStandaloneContext must be used within StandaloneProvider")
  }
  return context
}
