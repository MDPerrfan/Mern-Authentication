import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../Context/AppContext';

const VerifyEmail = () => {
  const { backendUrl,isLoggedin,userData } = useContext(AppContext);

  const [otp, setOtp] = useState(Array(6).fill('')); // Array of 6 empty strings
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Focus on the next input field automatically when a digit is entered
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6); // Limit to 6 characters
    const newOtp = [...otp];
    paste.split('').forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
        document.getElementById(`otp-input-${index}`).value = char; // Update the input field
      }
    });
    setOtp(newOtp); // Update state
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    setLoading(true);
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-email', { otp: otpValue });
      if (data.success) {
        toast.success(data.message);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
isLoggedin && userData && userData.isVerified && navigate('/')
},[isLoggedin,userData])
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 flex items-center justify-center">
      <div className="bg-slate-900 text-white p-10 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center mb-4">Verify Your Email</h2>
        <p className="text-center mb-6 text-sm text-indigo-300">
          Enter the 6-digit OTP sent to your email to verify your account.
        </p>
        <form onSubmit={handleVerify}>
          <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-xl font-semibold bg-[#333A5C] text-white rounded-md outline-none"
                maxLength="1"
                required
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <p className="text-center text-xs mt-4 text-gray-400">
            Didn't receive the OTP?{' '}
            <span className="text-indigo-400 cursor-pointer underline">Resend OTP</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmail;
