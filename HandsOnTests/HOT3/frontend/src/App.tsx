import { Route, Routes} from 'react-router-dom'
import { LoginForm } from '@/components/login-form'

import AppLayout from './components/applayout/app-layout'
import UserMenu from './components/UserMenu'

import ProductDisplay from './components/ProductDisplay'
import { SignupForm } from './components/signup-form'
import {ToastContainer, } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
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

        {/* Protected routes using layout */}
        <Route path="/" element={<AppLayout />}>
          <Route path="users" element={<UserMenu />} />
          <Route path="products" element={<ProductDisplay />} />
          {/* Default child route for "/" */}
          <Route index element={<div>Welcome Home!</div>} />
        </Route>
      </Routes>
    </>
  )
}


export default App
