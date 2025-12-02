import './App.css'
import { LoginForm } from '@/components/login-form'
//import { authClient } from '@/lib/auth-client'
//import { Button } from './components/ui/button';
//import { Hero1 } from '@/components/hero1';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import { Navbar1 } from '@/components/navbar1'



function App() {
  // const {data: session, isPending} = authClient.useSession();
  // if(isPending) {
  //   return <div>Loading......</div>
  // }
  // if(!session){
  //   return (
  //     <div className='flex min-h-svh items-center justify-center px-4'>
  //       <div className='w-full max-w-md'>
  //        < LoginForm/>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* <h1> Welcome, {session.user.email}</h1>
       <Hero1 heading="Hi user" description='Issue tracker' image={{src:"react.svg", alt:"React Logo"}}/> 
      <Button variant="default" onClick={() => authClient.signOut() }>Logout</Button> */}
      <Navbar1 /> 
      <Routes>
        <Route path='/login' element={<LoginForm/>} />
      </Routes>

      
    </>
  )
}

export default App
