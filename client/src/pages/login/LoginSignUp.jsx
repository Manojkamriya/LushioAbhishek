
import React, { useState } from 'react'
import './login.css'
const LoginSignUp = () => {
  const [currState, setCurrState] = useState('Sign Up');
  return (
    <>
      <div className='login-signup'>
        <form  className="login-signup-container">
          <div className="login-signup-title">
          <h2 onClick={()=>setCurrState('Login')}>{currState}</h2>

          </div>
          <div className="login-signup-inputs">
         
          
            <input type="email" placeholder='Enter your email' required/>
          
            <input type="password" placeholder='Enter your password' required/>
            {currState==='Login'?<></>:  <input type="password" placeholder='Confirm your password' required/>}
          </div>
          <button>{currState==='Sign Up'?'Create Account':"Login"}</button>
          <div className="login-signup-condition">
            <input type='checkbox' required/>
            <p>By continuing, i agree to the terms of use & privacy policy</p>
          </div>
          {currState==='Login'?<p>Create a new account <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>:     <p>Already have an account ? <span onClick={()=>setCurrState("Login")}>Login here</span></p>}
          <button>Continue With Google</button>
          <button>Continue With Facebook</button>
     
        </form>
   
      </div>

    </>
  )
}

export default LoginSignUp
