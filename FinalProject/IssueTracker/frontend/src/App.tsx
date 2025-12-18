import './App.css'
import { LoginForm } from '@/components/login-form'
// import { authClient } from '@/lib/auth-client'
// import { Button } from './components/ui/button';
// import { Hero1 } from '@/components/hero1';
import {Routes, Route, Navigate } from 'react-router-dom'
//import { Navbar1 } from '@/components/navbar1'
import { SignupForm } from '@/components/signup-form';
//import { Footer2 } from '@/components/footer2';
//import { LandingPage } from '@/components/landing-page';
import UserList from './components/UserList';
import {ToastContainer, } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BugList from './components/BugList';
import UserPage from './components/UserPage';
//import { Hero1 } from './components/hero1';
import AppLayout from './components/layouts/app-layout';
import { LandingPage } from './components/landing-page';





function App() {
  // function showError(message: string) {
  //   toast(message, {type: 'error', position: 'bottom-right'})
  // }

  // function showSuccess(message: string) {
  //   toast(message, {type: 'success', position: 'bottom-right'})
  // }

  return (
    <>
    <ToastContainer />

      <Routes>
      
        {/* Public routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route path="/users" element={<UserList />} />
          <Route path="/bugs" element={<BugList />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/landingPage" element={<LandingPage />} />

        </Route>
        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      
    </>
  )
}

export default App
