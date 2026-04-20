import { createContext, useContext, useState } from 'react'
import findingsSeed from '../data/findings.json'

const FindingsContext = createContext(null)

export function FindingsProvider({ children }) {
  const [findings, setFindings] = useState(findingsSeed)

  const updateFinding = (findingId, updates) => {
    setFindings((prevFindings) =>
      prevFindings.map((finding) =>
        finding.id === findingId ? { ...finding, ...updates } : finding,
      ),
    )
  }

  const value = {
    findings,
    updateFinding,
  }

  return (
    <FindingsContext.Provider value={value}>{children}</FindingsContext.Provider>
  )
}

export function useFindings() {
  const context = useContext(FindingsContext)
  if (!context) {
    throw new Error('useFindings must be used within a FindingsProvider')
  }
  return context
}
