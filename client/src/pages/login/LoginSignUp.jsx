// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import signInWithGoogle from '../../auth/googleAuth';
// import signInWithFacebook from '../../auth/facebookAuth';
// import handleEmailSignUp from '../../auth/emailAuth';
// import { sendOtp, verifyOtp } from '../../auth/phoneAuth';
// import './login.css';

// const LoginSignUp = () => {
//   const [currState, setCurrState] = useState('Sign Up');
//   const [identifier, setIdentifier] = useState(''); // Can be either email or phone number
//   const [password, setPassword] = useState('');
//   const [countryCode, setCountryCode] = useState(''); // Country code for phone number
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [isPhone, setIsPhone] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if identifier is a phone number
//     setIsPhone(/^\d{10}$/.test(identifier));
//   }, [identifier]);

//   const handleGoogleSignIn = async () => {
//     try {
//       await signInWithGoogle();
//       navigate('/'); // Redirect to home after successful sign-in
//     } catch (error) {
//       console.error("Error during Google sign-in", error);
//     }
//   };

//   const handleFacebookSignIn = async () => {
//     try {
//       await signInWithFacebook();
//       navigate('/'); // Redirect to home after successful sign-in
//     } catch (error) {
//       console.error("Error during Facebook sign-in", error);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (isPhone) {
//       if (!otpSent) {
//         try {
//           const formattedPhoneNumber = `${countryCode}${identifier}`;
//           const result = await sendOtp(formattedPhoneNumber);
//           setConfirmationResult(result);
//           setOtpSent(true);
//         } catch (error) {
//           console.error("Error sending OTP", error);
//         }
//       } else {
//         try {
//           await verifyOtp(confirmationResult, otp, `${countryCode}${identifier}`, password);
//           navigate('/'); // Redirect to home after successful OTP verification
//         } catch (error) {
//           console.error("Error verifying OTP", error);
//         }
//       }
//     } else {
//       try {
//         await handleEmailSignUp(identifier, password);
//         navigate('/');
//       } catch (error) {
//         console.error("Error signing up with email", error);
//       }
//     }
//   };

//   return (
//     <>
//       <div className='login-signup'>
//         <form className="login-signup-container" onSubmit={handleFormSubmit}>
//           <div className="login-signup-title">
//             <h2 onClick={() => setCurrState('Login')}>{currState}</h2>
//           </div>
//           <div className="login-signup-inputs">
//             <input
//               type="text"
//               placeholder='Enter your email or phone number'
//               value={identifier}
//               onChange={(e) => setIdentifier(e.target.value)}
//               required
//             />
//             {isPhone && (
//               <input
//                 type="text"
//                 placeholder='Enter your country code'
//                 value={countryCode}
//                 onChange={(e) => setCountryCode(e.target.value)}
//                 required
//               />
//             )}
//             {otpSent ? (
//               <input
//                 type="text"
//                 placeholder='Enter the OTP'
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//               />
//             ) : (
//               <input
//                 type="password"
//                 placeholder='Enter your password'
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             )}
//             {currState === 'Sign Up' && !otpSent && (
//               <input
//                 type="password"
//                 placeholder='Confirm your password'
//                 required
//               />
//             )}
//           </div>
//           <button type="submit">{currState === 'Sign Up' ? 'Create Account' : "Login"}</button>
//           <div className="login-signup-condition">
//             <input type='checkbox' required />
//             <p>By continuing, I agree to the terms of use & privacy policy</p>
//           </div>
//           {currState === 'Login' ? (
//             <p>Create a new account <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
//           ) : (
//             <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
//           )}
//           <button type="button" onClick={handleGoogleSignIn}>Continue With Google</button>
//           <button type="button" onClick={handleFacebookSignIn}>Continue With Facebook</button>
//         </form>
//         <div id="recaptcha-container"></div>
//       </div>
//     </>
//   );
// };

// export default LoginSignUp;
