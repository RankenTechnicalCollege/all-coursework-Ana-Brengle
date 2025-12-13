import { SidebarProvider, SidebarInset} from '@/components/ui/sidebar'
import './App.css'
//import  {AppSidebar}  from '@/components/AppSidebar'

import { AppSidebar } from '@/components/app-sidebar'

import { Header } from '@/components/Header'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { useState, useEffect } from 'react'

function App() {
  const [user, setUser] = useState<null | { fullName: string; email: string }>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch('http://localhost:2023/api/users/me', {
          credentials: 'include',
        })

        if (!res.ok) {
          setUser(null)
          navigate('/login')
          return
        }

        const data = await res.json()
        setUser({
          fullName: data.fullName || data.name || 'Unknown User',
          email: data.email || 'unknown@example.com',
        })
      } catch (err) {
        console.error('Error loading user:', err)
        setUser(null)
        navigate('/login')
      }
    }
    loadUser()
  }, [navigate])
  const isLoggedIn = !!user

  return (
    <>
{isLoggedIn ? (
        <SidebarProvider defaultOpen={false}>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <Routes>
              <Route path="/users" element={<div>Users Page</div>} />
              <Route path="/products" element={<div>Products Page</div>} />
              <Route path="*" element={<Navigate to="/users" />} />
            </Routes>
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

    </>
  )
}


export default App
