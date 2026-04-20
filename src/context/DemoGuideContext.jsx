import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const DemoGuideContext = createContext(null)

export function DemoGuideProvider({ children }) {
  const [isActive, setIsActive] = useState(false)
  const [dismissedItems, setDismissedItems] = useState(() => new Set())

  const toggleGuide = useCallback(() => {
    setIsActive((prevActive) => {
      if (prevActive) {
        setDismissedItems(new Set())
        return false
      }
      return true
    })
  }, [])

  const dismissItem = useCallback((overlayId) => {
    setDismissedItems((prevItems) => {
      if (prevItems.has(overlayId)) return prevItems
      const nextItems = new Set(prevItems)
      nextItems.add(overlayId)
      return nextItems
    })
  }, [])

  const value = useMemo(
    () => ({
      isActive,
      toggleGuide,
      dismissedItems,
      dismissItem,
    }),
    [isActive, toggleGuide, dismissedItems, dismissItem],
  )

  return (
    <DemoGuideContext.Provider value={value}>{children}</DemoGuideContext.Provider>
  )
}

export function useDemoGuide() {
  const context = useContext(DemoGuideContext)
  if (!context) {
    throw new Error('useDemoGuide must be used within a DemoGuideProvider')
  }
  return context
}
