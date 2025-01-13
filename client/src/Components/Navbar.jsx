import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../Context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {
  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const logout = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/logout', { withCredentials: true });
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }
  const sentVerifyOtp = async()=>{

    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendUrl+'/api/auth/sendOtp');
      if(data.success){
        navigate('/verify-email');
        toast.success(data.message);
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    }
  }
  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img className='w-28 sm:w-32' src={assets.logo} alt="" />
      {userData ?
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-full pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              {!userData.isVerified && <li className='py-1 px-2 hover:bg-gray-200'onClick={sentVerifyOtp}>Verfiy Email</li>
              }
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 pr-10'>Logout</li>
            </ul>
          </div>
        </div>
        : <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-400 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login<img src={assets.arrow_icon} alt="" /></button>

      }
    </div>
  )
}

export default Navbar
