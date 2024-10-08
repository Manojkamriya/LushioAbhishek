import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './MultiStepForm.css';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
  });

  // Handle selection of an option
  const handleOptionSelect = (step, value) => {
    setFormData((prevData) => ({ ...prevData, [`question${step}`]: value }));

    // Automatically move to the next step if it's not the last step
    if (step < 3) {
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  };

  // Move to next or previous step
  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    alert('Form Submitted: ' + JSON.stringify(formData, null, 2));
  };

  // Step Components
  // const Step1 = (
  //   <div className="form-step">
  //     <h2>Question 1: What is your favorite color?</h2>
  //     <div className="options">
  //       {['Red', 'Blue', 'Green', 'Yellow'].map((color) => (
  //         <label
  //           key={color}
  //           className={`option ${formData.question1 === color ? 'selected' : ''}`}
  //           onClick={() => handleOptionSelect(1, color)}
  //         >
  //           <input
  //             type="radio"
  //             name="question1"
  //             value={color}
  //             checked={formData.question1 === color}
  //             onChange={() => handleOptionSelect(1, color)}
  //           />
  //           {color}
  //         </label>
  //       ))}
  //     </div>
  //   </div>
  // );

  // const Step2 = (
  //   <div className="form-step">
  //     <h2>Question 2: What is your favorite animal?</h2>
  //     <div className="options">
  //       {['Dog', 'Cat', 'Bird', 'Fish'].map((animal) => (
  //         <label
  //           key={animal}
  //           className={`option ${formData.question2 === animal ? 'selected' : ''}`}
  //           onClick={() => handleOptionSelect(2, animal)}
  //         >
  //           <input
  //             type="radio"
  //             name="question2"
  //             value={animal}
  //             checked={formData.question2 === animal}
  //             onChange={() => handleOptionSelect(2, animal)}
  //           />
  //           {animal}
  //         </label>
  //       ))}
  //     </div>
  //   </div>
  // );

  // const Step3 = (
  //   <div className="form-step">
  //     <h2>Question 3: What is your favorite season?</h2>
  //     <div className="options">
  //       {['Spring', 'Summer', 'Fall', 'Winter'].map((season) => (
  //         <label
  //           key={season}
  //           className={`option ${formData.question3 === season ? 'selected' : ''}`}
  //           onClick={() => handleOptionSelect(3, season)}
  //         >
  //           <input
  //             type="radio"
  //             name="question3"
  //             value={season}
  //             checked={formData.question3 === season}
  //             onChange={() => handleOptionSelect(3, season)}
  //           />
  //           {season}
  //         </label>
  //       ))}
  //     </div>
  //     <button className="btn submit" onClick={handleSubmit}>
  //       Submit
  //     </button>
  //   </div>
  // );
  const Step1 = (
    <div className="form-step">
      <h2>Question 1: How would you rate the overall quality of the item?</h2>
      <div className="options">
        {['Poor', 'Fair', 'Good', 'Excellent'].map((rating) => (
          <label
            key={rating}
            className={`option ${formData.question1 === rating ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(1, rating)}
          >
            <input
              type="radio"
              name="question1"
              value={rating}
              checked={formData.question1 === rating}
              onChange={() => handleOptionSelect(1, rating)}
            />
            {rating}
          </label>
        ))}
      </div>
    </div>
  );
  
  const Step2 = (
    <div className="form-step">
      <h2>Question 2: How well does the item fit?</h2>
      <div className="options">
        {['Too Small', 'Slightly Small', 'True to Size', 'Slightly Large', 'Too Large'].map((fit) => (
          <label
            key={fit}
            className={`option ${formData.question2 === fit ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(2, fit)}
          >
            <input
              type="radio"
              name="question2"
              value={fit}
              checked={formData.question2 === fit}
              onChange={() => handleOptionSelect(2, fit)}
            />
            {fit}
          </label>
        ))}
      </div>
    </div>
  );
  
  const Step3 = (
    <div className="form-step">
      <h2>Question 3: Would you recommend this item to others?</h2>
      <div className="options">
        {['Definitely Not', 'Probably Not', 'Maybe', 'Probably', 'Definitely'].map((recommendation) => (
          <label
            key={recommendation}
            className={`option ${formData.question3 === recommendation ? 'selected' : ''}`}
            onClick={() => handleOptionSelect(3, recommendation)}
          >
            <input
              type="radio"
              name="question3"
              value={recommendation}
              checked={formData.question3 === recommendation}
              onChange={() => handleOptionSelect(3, recommendation)}
            />
            {recommendation}
          </label>
        ))}
      </div>
      {/* <div className="form-group">
        <h3>Additional Comments</h3>
        <textarea
          name="additionalComments"
          value={formData.additionalComments || ''}
          // onChange={(e) => handleInputChange('additionalComments', e.target.value)}
          placeholder="Please share any additional thoughts about the item..."
          rows="4"
        ></textarea>
      </div> */}
      {/* <button className="btn submit" onClick={handleSubmit}>
        Submit Review
      </button> */}
    </div>
  );
  const steps = {
    1: Step1,
    2: Step2,
    3: Step3,
  };

  // Pagination indicator
  const renderPagination = () => (
    <div className="pagination">
      {[1, 2, 3].map((step) => (
        <span key={step} className={step === currentStep ? 'active' : ''} />
      ))}
    </div>
  );

  return (
    <div className="multi-step-form">
      <SwitchTransition>
        <CSSTransition
          key={currentStep}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          {steps[currentStep]}
        </CSSTransition>
      </SwitchTransition>

      <div className="form-button-container">
        {currentStep > 1 && (
          <button className="btn prev" onClick={prevStep}>
            Back
          </button>

        )}
           {renderPagination()}
           {currentStep > 1 && currentStep <=4  && (
          <button className="btn prev" onClick={nextStep}>
            Skip
          </button>

        )}
      </div>

   
    </div>
  );
};

export default MultiStepForm;


