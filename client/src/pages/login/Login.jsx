import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import signInWithGoogle from '../../auth/googleAuth';
import signInWithFacebook from '../../auth/facebookAuth';
import { handleEmailLogin, sendEmailSignInLink } from '../../auth/emailAuth';
import { sendOtp, verifyOtpForLogin } from '../../auth/phoneAuth';
import './auth.css';

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Can be either email or phone number
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState(''); // Country code for phone number
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isPhone, setIsPhone] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // "password" or "otp"
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const navigate = useNavigate();

  useEffect(() => {
    setIsPhone(/^\d{10}$/.test(identifier));
  }, [identifier]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (error) {
      console.error("Error during Google sign-in", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigate('/');
    } catch (error) {
      console.error("Error during Facebook sign-in", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isPhone) {
      if (loginMethod === 'otp') {
        if (!otpSent) {
          try {
            const formattedPhoneNumber = `${countryCode}${identifier}`;
            const result = await sendOtp(formattedPhoneNumber);
            setConfirmationResult(result);
            setOtpSent(true);
          } catch (error) {
            console.error("Error sending OTP", error);
          }
        } else {
          try {
            await verifyOtpForLogin(confirmationResult, otp);
            navigate('/');
          } catch (error) {
            console.error("Error verifying OTP", error);
          }
        }
      } else {
        // Handle phone login with password
        // You need to implement a function to handle phone login with password if applicable
      }
    } else {
      if (loginMethod === 'otp') {
        // Handle email login with OTP
        await sendEmailSignInLink(identifier);
        navigate('/');
      } else {
        try {
          await handleEmailLogin(identifier, password);
          navigate('/');
        } catch (error) {
          console.error("Error logging in with email", error);
        }
      }
    }
  };

  return (
    <div className='auth-container'>
      <Link to='/user'> <button className='auth-container-button'>Go to User page </button> </Link>
     
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder='Enter your email or phone number'
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        {isPhone && (
          <input
            type="text"
            placeholder='Enter your country code'
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
          />
        )}
        <div className="login-method">
          <label>
            <input
              type="radio"
              value="password"
              checked={loginMethod === 'password'}
              onChange={() => setLoginMethod('password')}
            />
            Password
          </label>
          <label>
            <input
              type="radio"
              value="otp"
              checked={loginMethod === 'otp'}
              onChange={() => setLoginMethod('otp')}
            />
            OTP
          </label>
        </div>
        {loginMethod === 'otp' && otpSent ? (
          <input
            type="text"
            placeholder='Enter the OTP'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        ) : (
          <input
            type="password"
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loginMethod === 'otp'}
          />
        )}
          <div className="login-signup-condition">
            <input type='checkbox'  checked={isChecked}   onChange={handleCheckboxChange}   required/>
            <p>By continuing, i agree to the terms of use & privacy policy</p>
          </div>
        <button type="submit"  className={isChecked ? 'enabled' : 'disabled'} disabled={!isChecked}>Login</button>
        <p>Create a new account? <Link to='/register'>Sign Up here</Link></p>
        <button type="button" onClick={handleGoogleSignIn}  className={isChecked ? 'enabled' : 'disabled'} disabled={!isChecked}>Continue With Google</button>
        <button type="button" onClick={handleFacebookSignIn}  className={isChecked ? 'enabled' : 'disabled'} disabled={!isChecked}>Continue With Facebook</button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
