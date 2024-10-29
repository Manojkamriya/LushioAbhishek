import React, { useState, useEffect } from "react";
import { auth, db } from "../../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getUser } from "../../firebaseUtils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import AdminComponent from "./AdminComponent";
import SubAdminComponent from "./SubAdminComponent";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [OTP, setOTP] = useState("");
    const [isOTPRequested, setIsOTPRequested] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [selectedType, setSelectedType] = useState("admin");
    const [userType, setUserType] = useState("");

    const navigate = useNavigate(); // Use navigate hook for redirection

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getUser();
                if (user) {
                    const q = query(collection(db, "employees"), where("phone", "==", user.phoneNumber));
                    const querySnapshot = await getDocs(q);
                    let userRole = "";

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.type === "admin" || data.type === "sub-admin") {
                            userRole = data.type;
                        }
                    });

                    if (userRole) {
                        setUserType(userRole);
                        setIsLoggedIn(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        let interval;
        if (isOTPRequested && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsResendDisabled(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isOTPRequested, timer]);

    const handleOTPInput = (e) => {
        setOTP(e.target.value);
    };

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container",
                {
                    size: "invisible",
                    callback: () => {
                        requestOTP();
                    },
                }
            );
        }
    };

    const requestOTP = async () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;

        try {
            const confirmationResult = await signInWithPhoneNumber(auth, `+${phoneNumber}`, appVerifier);
            window.confirmationResult = confirmationResult;
            setIsOTPRequested(true);
            setTimer(60); // Reset timer
            setIsResendDisabled(true);
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const verifyOTP = async () => {
        try {
            const result = await window.confirmationResult.confirm(OTP);
            const user = result.user;
            
            // Log user details
            console.log("User authenticated:", user);
            const q = query(
                collection(db, "employees"),
                where("phone", "==", `+${phoneNumber}`),
                where("type", "==", selectedType)
            );
    
            const querySnapshot = await getDocs(q);
            
            let isAdmin = false;
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log('Document data:', data);
                if (data.type === selectedType) {
                    isAdmin = true;
                }
            });
    
            if (isAdmin) {
                localStorage.setItem("adminLoggedIn", "true");
                setUserType(selectedType);
                setIsLoggedIn(true);
            } else {
                alert("You are not authorized to access the admin panel.");
                navigate("/"); // Redirect to home page if not authorized
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP");
        }
    };

    return (
        <div className="admin-auth">
            {isLoggedIn ? (
                userType === "admin" ? (
                    <AdminComponent />
                ) : (
                    <SubAdminComponent />
                )
            ) : (
                <div className="auth-form admin-form">
                    <PhoneInput
                        country={"in"}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="Enter phone number"
                    />
                    <div className="admin-radio">
                        <label>
                            <input
                                type="radio"
                                value="admin"
                                checked={selectedType === "admin"}
                                onChange={handleTypeChange}
                            />
                            Admin
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="sub-admin"
                                checked={selectedType === "sub-admin"}
                                onChange={handleTypeChange}
                            />
                            Sub-admin
                        </label>
                    </div>
                    {isOTPRequested && (
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={OTP}
                            onChange={handleOTPInput}
                        />
                    )}
                    {!isOTPRequested ? (
                        <button onClick={requestOTP} className="enabled">Request OTP</button>
                    ) : (
                        <>
                            <button onClick={verifyOTP} className="enabled">Verify OTP</button>
                            <button
                                onClick={requestOTP}
                                disabled={isResendDisabled}
                                className={isResendDisabled?"disabled":"enabled"}
                            >
                                Resend OTP {isResendDisabled ? `(${timer}s)` : ""}
                            </button>
                        </>
                    )}
                    <div id="recaptcha-container"></div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
