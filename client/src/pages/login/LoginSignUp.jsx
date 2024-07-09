import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import signInWithGoogle from '../../auth/googleAuth';
import signInWithFacebook from '../../auth/facebookAuth';
import handleEmailSignUp from '../../auth/emailAuth';
import './login.css';

const LoginSignUp = () => {
	const [currState, setCurrState] = useState('Sign Up');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle();
			navigate('/'); // Redirect to home after successful sign-in
		} catch (error) {
			console.error("Error during Google sign-in", error);
		}
	};

	const handleFacebookSignIn = async () => {
		try {
			await signInWithFacebook();
			navigate('/'); // Redirect to home after successful sign-in
		} catch (error) {
			console.error("Error during Facebook sign-in", error);
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (currState === 'Sign Up') {
			await handleEmailSignUp(email, password);
		} else {
			// Handle login logic here if needed			
		}
	};

	return (
		<>
			<div className='login-signup'>
				<form className="login-signup-container" onSubmit={handleFormSubmit}>
					<div className="login-signup-title">
						<h2 onClick={() => setCurrState('Login')}>{currState}</h2>
					</div>
					<div className="login-signup-inputs">
						<input
							type="email"
							placeholder='Enter your email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
						<input
							type="password"
							placeholder='Enter your password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						{currState === 'Login' ? null : (
							<input
								type="password"
								placeholder='Confirm your password'
								required
							/>
						)}
					</div>
					<button type="submit">{currState === 'Sign Up' ? 'Create Account' : "Login"}</button>
					<div className="login-signup-condition">
						<input type='checkbox' required />
						<p>By continuing, I agree to the terms of use & privacy policy</p>
					</div>
					{currState === 'Login' ? (
						<p>Create a new account <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
					) : (
						<p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
					)}
					<button type="button" onClick={handleGoogleSignIn}>Continue With Google</button>
					<button type="button" onClick={handleFacebookSignIn}>Continue With Facebook</button>
				</form>
			</div>
		</>
	);
};

export default LoginSignUp;
