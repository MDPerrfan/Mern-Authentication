import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import VerifyEmail from './Pages/VerifyEmail'
import ResetPass from './Pages/ResetPass'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='/verify-email' element={<VerifyEmail/>}/>
        <Route path='/reset-pass' element={<ResetPass/>}/>
      </Routes>
    </div>
  )
}

export default App
