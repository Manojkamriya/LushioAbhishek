import React, { useState } from "react";
import { Stepper, Step, StepLabel, Typography, Box } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const DeliveryStatus = () => {
  // Define delivery steps
  const steps = ["Order Placed", "Shipped", "Out for Delivery", "Delivered"];
  
  // Set the current step
  const [currentStep, setCurrentStep] = useState(0);

  // Function to simulate status progression
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get color based on step
  const getStepColor = (stepIndex) => {
    if (stepIndex < currentStep) return "green";
    if (stepIndex === currentStep) return "#FFC107"; // Yellow for current step
    return "gray"; // Default for upcoming steps
  };

  return (
    <div style={{ width: "70%", margin: "auto", textAlign: "center", padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Delivery Status
      </Typography>
      
      <Box sx={{ position: "relative", marginBottom: "20px" }}>
        <LocalShippingIcon
          sx={{
            fontSize: "60px",
            color: currentStep === steps.length - 1 ? "green" : "#FFC107",
            position: "absolute",
            left: `${(currentStep / (steps.length - 1)) * 100}%`,
            transition: "left 0.5s ease-in-out",
          }}
        />
      </Box>

      <Stepper alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index} active={index <= currentStep}>
            <StepLabel
              StepIconProps={{
                style: { color: getStepColor(index) },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <div style={{ marginTop: "20px" }}>
        {currentStep < steps.length - 1 ? (
          <Typography variant="body1">
            Current Status: <strong>{steps[currentStep]}</strong>
          </Typography>
        ) : (
          <Typography variant="h6" style={{ color: "green" }}>
            Your order has been delivered! 🎉
          </Typography>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{
            margin: "5px",
            padding: "10px 20px",
            backgroundColor: currentStep > 0 ? "#1976d2" : "lightgray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentStep > 0 ? "pointer" : "not-allowed",
          }}
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </button>
        <button
          style={{
            margin: "5px",
            padding: "10px 20px",
            backgroundColor: currentStep < steps.length - 1 ? "#4caf50" : "lightgray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: currentStep < steps.length - 1 ? "pointer" : "not-allowed",
          }}
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryStatus;
