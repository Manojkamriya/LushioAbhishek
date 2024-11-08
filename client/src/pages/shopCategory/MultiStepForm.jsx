import React, { useState,useContext } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import MediaRenderer from "../../components/MediaRenderer";
import { storage } from "../../firebaseConfig"; // Import storage from Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import './MultiStepForm.css';
import axios from "axios";
import { UserContext } from '../../components/context/UserContext';

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const {user} = useContext(UserContext);
  const [formData, setFormData] = useState({
    starRating: 0, // Star rating
    qualityRating: '', // Quality rating
    fitRating: '', // Fit rating
    mediaFiles: [], // Media files
    reviewText: '', // Review text
   
  });
  const [images, setImages] = useState([]);
  const totalSteps = 5; // Updated to 5 steps (star rating, quality, fit, media, review)
  const [buttonState, setButtonState] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); 
  const handleClickAndClose = () => {
    setButtonState("onclic");
    setTimeout(() => {
      setButtonState("validate");
      setTimeout(() => {
        setButtonState("");
        handleSubmit();
        setCurrentStep(1);
      }, 700);
    }, 1250);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 3 files
    if (files.length > 3) {
      alert('You can only upload a maximum of 3 files.');
      return;
    }

    // Check that each file is less than 15 MB
    for (const file of files) {
      if (file.size > 15 * 1024 * 1024) { // 15 MB in bytes
        alert(`File ${file.name} is larger than 15 MB. Please choose smaller files.`);
        return;
      }
    }

    setImages([...images, ...files]);
  };

  // const handleRemoveImage = (index) => {
  //   setImages(images.filter((_, i) => i !== index));
  // };
  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setUploadedImageUrls(uploadedImageUrls.filter((_, i) => i !== index)); // Remove from uploaded URLs if needed
  };

  const uploadImagesToFirebase = async () => {
    return Promise.all(
      images.map((image) => {
        const storageRef = ref(storage, `reviews/${Date.now()}_${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Error uploading image:", error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                  resolve(downloadURL);
                })
                .catch((error) => {
                  console.error("Error getting download URL:", error);
                  reject(error);
                });
            }
          );
        });
      })
    );
  };

  const handleOptionSelect = (type, value) => {
    setFormData((prevData) => ({ ...prevData, [type]: value }));
    if (currentStep < totalSteps) {
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleStarClick = (rating) => {
    setFormData((prevData) => ({ ...prevData, starRating: rating })); // Save star rating in form data
    if (currentStep < totalSteps) {
      setTimeout(() => {
        nextStep();
      }, 300);
    }
  };


  const handleSubmit = async () => {
    try {
      const urls = await uploadImagesToFirebase(); 
      setUploadedImageUrls(urls); 
  
      const payload = {
        starRating: formData.starRating,
        quality: formData.qualityRating,
        fit: formData.fitRating,
        media: urls,
        review: formData.reviewText,
        userId: user.uid,
      };
  
      console.log('Payload being sent:', payload); // Log the payload

      //
      // in the below request replace the hardcoded dummy product id 
      //

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/reviews/3bdLgiX03RoYo56IvlKG`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Review submitted successfully:', response.data);
      alert('Form submitted successfully!');
  
    } catch (error) {
      console.error('Error uploading images or submitting form:', error.response?.data || error.message);
      alert('There was an error submitting your form: ' + (error.response?.data?.message || error.message));
    }
  };
  

  // Step 1: Star Rating
  const Step1 = (
    <div className="form-step">
      <h2>Rate the Item:</h2>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star1 ${formData.starRating >= star ? 'filled' : ''}`}
            onClick={() => handleStarClick(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );

  // Step 2: Quality Rating
  const Step2 = (
    <div className="form-step">
      <h2>How would you rate the overall quality of the item?</h2>
      <div className="options">
        {['Poor', 'Fair', 'Good', 'Excellent'].map((rating) => (
          <label
            key={rating}
            className={`option ${formData.qualityRating === rating ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('qualityRating', rating)}
          >
            <input
              type="radio"
              name="quality"
              value={rating}
              checked={formData.qualityRating === rating}
              onChange={() => handleOptionSelect('qualityRating', rating)}
            />
            {rating}
          </label>
        ))}
      </div>
    </div>
  );

  // Step 3: Fit Rating
  const Step3 = (
    <div className="form-step">
      <h2>How well does the item fit?</h2>
      <div className="options">
        {['Too Small', 'Slightly Small', 'True to Size', 'Slightly Large', 'Too Large'].map((fit) => (
          <label
            key={fit}
            className={`option ${formData.fitRating === fit ? 'selected' : ''}`}
            onClick={() => handleOptionSelect('fitRating', fit)}
          >
            <input
              type="radio"
              name="fit"
              value={fit}
              checked={formData.fitRating === fit}
              onChange={() => handleOptionSelect('fitRating', fit)}
            />
            {fit}
          </label>
        ))}
      </div>
    </div>
  );

  // Step 4: Media Upload
  const Step4 = (
    <div className="form-step">
      <h2>Upload Media (Optional):</h2>
      <p></p>
      <div class="upload-button-container">
        <label htmlFor="file-upload" className="upload-btn">Choose or Drop Media Files (max size: 15MB)</label>
        <input
          id="file-upload"
          type="file"
          accept="image/*, video/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>

      <div className="image-preview">
        {images.map((image, index) => (
          <div key={index} className="image-item">
            <MediaRenderer src={URL.createObjectURL(image)} file={image} alt={`Preview ${index}`} />
            <button className="image-remove-button" onClick={() => handleRemoveImage(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <p className="upload-message">You can upload upto 3 media files (images or videos) (optional).</p>
    </div>
  );

  // Step 5: Review
  const Step5 = (
    <div className="form-step">
      <h2>Your Review:</h2>
      <textarea
        name="reviewText"
        value={formData.reviewText}
        onChange={(e) => handleOptionSelect('reviewText', e.target.value)}
        placeholder="Please share your thoughts about the item..."
        rows="4"
      />
    </div>
  );

  const steps = {
    1: Step1,
    2: Step2,
    3: Step3,
    4: Step4,
    5: Step5,
  };

  const renderPagination = () => (
    <div className="pagination">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
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
        {currentStep < totalSteps && (
          <button className="btn next" onClick={nextStep}>
            Next
          </button>
        )}
      </div>

      {currentStep === totalSteps && (
        <div className="container">
          <button className={buttonState} onClick={handleClickAndClose}>
          
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
