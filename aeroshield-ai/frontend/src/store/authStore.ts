export interface User {
  officer_id: string
  full_name: string
  role: 'ADMIN' | 'IMMIGRATION_OFFICER' | 'SECURITY_OFFICER' | 'AUDITOR'
  terminal: string
  shift: string
  access_token: string
}

export const getUser = (): User | null => {
  const u = localStorage.getItem('aeroshield_user')
  return u ? JSON.parse(u) : null
}

export const setUser = (user: User) => {
  localStorage.setItem('aeroshield_user', JSON.stringify(user))
  localStorage.setItem('aeroshield_token', user.access_token)
}

export const clearUser = () => {
  localStorage.removeItem('aeroshield_user')
  localStorage.removeItem('aeroshield_token')
}

export const isAdmin = () => getUser()?.role === 'ADMIN'
export const isAuthenticated = () => !!localStorage.getItem('aeroshield_token')
