import { createContext, useContext, useState } from 'react'

const RoleContext = createContext(null)

export function RoleProvider({ children }) {
  const [role, setRole] = useState('customer')

  const toggleRole = () => {
    setRole((prevRole) => (prevRole === 'customer' ? 'consultant' : 'customer'))
  }

  const value = {
    role,
    toggleRole,
  }

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
