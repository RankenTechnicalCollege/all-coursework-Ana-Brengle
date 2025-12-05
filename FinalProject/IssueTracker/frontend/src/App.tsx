import './App.css'
import { LoginForm } from '@/components/login-form'
//import { authClient } from '@/lib/auth-client'
//import { Button } from './components/ui/button';
//import { Hero1 } from '@/components/hero1';
import {Routes, Route, Navigate } from 'react-router-dom'
import { Navbar1 } from '@/components/navbar1'
import { SignupForm } from '@/components/signup-form';
import { Footer2 } from '@/components/footer2';
import { LandingPage } from '@/components/landing-page';
import UserList from './components/userList';



function App() {


  return (
    <>
      <Navbar1 /> 
      <Routes>
        <Route path='/' element={<Navigate to={"/login"}/>}/>
        <Route index element={<LandingPage/>}/>
        <Route path='/login' element={<LoginForm/>} />
        <Route path='/signup' element={<SignupForm/>} />
        <Route path='/UserList' element={<UserList /> } />
      </Routes>
      <Footer2/>
      

      

      
    </>
  )
}

export default App
