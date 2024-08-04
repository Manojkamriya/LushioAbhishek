import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import signInWithGoogle from "../../auth/googleAuth";
import signInWithFacebook from "../../auth/facebookAuth";
import { handleEmailLogin, sendEmailSignInLink } from "../../auth/emailAuth";
import { sendOtp, verifyOtpForLogin } from "../../auth/phoneAuth";
import "./auth.css";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isPhone, setIsPhone] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password");

  const navigate = useNavigate();

  useEffect(() => {
    setIsPhone(/^\d{10}$/.test(identifier));
  }, [identifier]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate("/user");
    } catch (error) {
      console.error("Error during Google sign-in", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigate("/user");
    } catch (error) {
      console.error("Error during Facebook sign-in", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isPhone) {
      try {
        const formattedPhoneNumber = `${countryCode}${identifier}`;
        console.log(formattedPhoneNumber)
        if (!otpSent) {
          const result = await sendOtp(formattedPhoneNumber);
          setConfirmationResult(result);
          setOtpSent(true);
        } else {
          await verifyOtpForLogin(confirmationResult, otp);
          navigate("/user");
        }
      } catch (error) {
        console.error("Error with phone login", error);
      }
    } else {
      if (loginMethod === "otp") {
        try {
          await sendEmailSignInLink(identifier);
        } catch (error) {
          console.error("Error sending email sign-in link", error);
        }
      } else {
        try {
          await handleEmailLogin(identifier, password);
          navigate("/user");
        } catch (error) {
          console.error("Error logging in with email", error);
        }
      }
    }
  };

  return (
    <div className="auth-container">
       <Link to="/user"> <button className="auth-container-button">Go to User page </button> </Link>
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Enter your email or phone number"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        {isPhone ? (
          <input
            type="text"
            placeholder="Enter your country code"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            required
          />
        ):
        <div className="login-method">
          <label>
            <input
              type="radio"
              value="password"
              checked={loginMethod === "password"}
              onChange={() => setLoginMethod("password")}
              disabled={isPhone}
            />
            Password
          </label>
          <label>
            <input
              type="radio"
              value="otp"
              checked={loginMethod === "otp"}
              onChange={() => setLoginMethod("otp")}
            />
             OTP
          </label>
        </div>
        }
        {loginMethod === "otp" && otpSent ? (
          <input
            type="text"
            placeholder="Enter the OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        ) : (
          loginMethod === "password" && !isPhone && (
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          )
        )}
        <button type="submit"className="enabled">Login</button>
        <p>Create a new account? <Link to="/register">Sign Up here</Link></p>
        <button type="button" className="enabled" onClick={handleGoogleSignIn}>Continue With Google</button>
        <button type="button" className="enabled" onClick={handleFacebookSignIn}>Continue With Facebook</button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
