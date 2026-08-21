import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('rms_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Normalize role to lowercase to prevent route mismatch loops
        if (parsed.role) parsed.role = parsed.role.toLowerCase()
        setUser(parsed)
        setIsAuthenticated(true)
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('rms_user', JSON.stringify(userData))
  }

  const updateUser = (newUserData) => {
    setUser(prev => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('rms_user', JSON.stringify(updated));
      return updated;
    });
  };

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('rms_user')
    localStorage.removeItem('rms_token')
  }

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner" style={{ borderColor:'rgba(108,99,255,0.3)', borderTopColor:'#6C63FF' }} />
    </div>
  )

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
