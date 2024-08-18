import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import signInWithGoogle from "../../auth/googleAuth";
import signInWithFacebook from "../../auth/facebookAuth";
import { handleEmailSignUp } from "../../auth/emailAuth";
import { sendOtp, verifyOtp } from "../../auth/phoneAuth";
import "./auth.css";

const Register = () => {
  const [identifier, setIdentifier] = useState(""); // Can be either email or phone number
  const [phone, setPhone] = useState("");
  const [showPwdField,setShowPwdField] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState(""); // Optional referral code
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isPhone, setIsPhone] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [otpTimer, setOtpTimer] = useState(0); // OTP timer state

  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(identifier)) {
      setIsPhone(false);
      setShowPwdField(true);
    } else if (/^\d/.test(identifier)) {
      setIsPhone(true);
      setPhone(identifier);
      setShowPwdField(false);
    } else {
      setShowPwdField(false);
    }

    if (
      isChecked &&
      (isPhone || (password && confirmPassword && password === confirmPassword))
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [identifier, password, confirmPassword, isChecked, isPhone]);

  useEffect(() => {
    let timer;
    if (otpSent && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (otpTimer === 0 && otpSent) {
      setIsButtonDisabled(false); // Enable the Resend OTP button after 1 minute
    }

    return () => clearInterval(timer);
  }, [otpSent, otpTimer]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(referralCode);
      navigate("/user");
    } catch (error) {
      console.error("Error during Google sign-in", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook(referralCode);
      navigate("/user");
    } catch (error) {
      console.error("Error during Facebook sign-in", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isPhone) {
      if (!otpSent) {
        try {
          const result = await sendOtp(`+${phone}`);
          setConfirmationResult(result);
          setOtpSent(true);
          setOtpTimer(60); // Set timer for 1 minute
        } catch (error) {
          console.error("Error sending OTP", error);
        }
      } else {
        try {
          await verifyOtp(confirmationResult, otp, `+${phone}` ,referralCode);
          navigate("/user");
        } catch (error) {
          console.error("Error verifying OTP", error);
        }
      }
    } else {
      try {
        await handleEmailSignUp(identifier, password, referralCode);
        navigate("/user");
      } catch (error) {
        console.error("Error signing up with email", error);
      }
    }
  };

  const handleIdentifierInput = (e) => {
    setIdentifier(e.target.value);
  };

  const handleResendOtp = async () => {
    setIsButtonDisabled(true);
    try {
      const result = await sendOtp(`+${phone}`);
      setConfirmationResult(result);
      setOtpTimer(60); // Reset timer for another 1 minute
    } catch (error) {
      console.error("Error resending OTP", error);
      setIsButtonDisabled(false);
    }
  };

  return (
    <div className="auth-container">
     
      <form className="auth-form" onSubmit={handleFormSubmit}>
        <h2>Sign Up</h2>
        {!isPhone ? (
          <input
            type="text"
            placeholder="Enter your email or phone number"
            value={identifier}
            onChange={handleIdentifierInput}
            required
          />
        ) : (
          <PhoneInput
            country={"in"}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            disabled={otpSent}
          />
        )}
        {otpSent && (
          <div>
            <input
              type="text"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button"  id="submit-otp" onClick={handleFormSubmit} disabled={otp.length !== 6}  className={otp.length !== 6?"disabled":"enabled"}>
              Submit OTP
            </button>
          </div>
        )}
        {showPwdField && (
            <>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: !isPhone ? "block" : "none" }}
                required={!isPhone}
              />
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ display: !isPhone ? "block" : "none" }}
                required={!isPhone}
              />
            </>
        )}
        {otpSent && isPhone && otpTimer === 0 && (
          <button type="button"  onClick={handleResendOtp} disabled={isButtonDisabled} className={isButtonDisabled?"disabled":"enabled"}> 
            Resend OTP
          </button>
        )}
        {otpSent && isPhone && otpTimer !== 0 && (
          <p>Resend OTP in {otpTimer} seconds.</p>
        )}
        <input
          type="text"
          placeholder="Referral Code (optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
        <div className="login-signup-condition">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            required
          />
          <p>By continuing, I agree to the terms of use & privacy policy</p>
        </div>
        <button type="submit" disabled={isButtonDisabled} className={isButtonDisabled?"disabled":"enabled"}>
          Create Account
        </button>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
        <button type="button" onClick={handleGoogleSignIn} disabled = {!isChecked} className={!isChecked?"disabled":"enabled"}>
          Continue With Google
        </button>
        <button type="button" onClick={handleFacebookSignIn} disabled = {!isChecked} className={!isChecked?"disabled":"enabled"}>
          Continue With Facebook
        </button>
      </form>
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Register;
