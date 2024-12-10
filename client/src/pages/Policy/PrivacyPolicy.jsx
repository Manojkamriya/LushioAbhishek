import React from "react";
import "./PrivacyPolicy.css"; // Import CSS for styling

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h1 className="privacy-policy-title">Privacy Policy</h1>
      <p className="privacy-policy-intro">
        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our services.
      </p>

      <section className="privacy-policy-section">
        <h2>Information We Collect</h2>
        <p>
          We may collect the following types of information:
          <ul>
            <li>Personal details such as name, email address, and phone number.</li>
            <li>Usage data such as pages visited, time spent on pages, and browser information.</li>
            <li>Cookies to enhance your browsing experience.</li>
          </ul>
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>How We Use Your Information</h2>
        <p>
          We use your information to:
          <ul>
            <li>Provide and improve our services.</li>
            <li>Respond to your inquiries and requests.</li>
            <li>Send updates and promotional materials, if consented.</li>
          </ul>
        </p>
      </section>

      <section className="privacy-policy-section">
        <h2>Your Rights</h2>
        <p>
          You have the right to:
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Request corrections or updates to your data.</li>
            <li>Request deletion of your data, subject to applicable laws.</li>
          </ul>
        </p>
      </section>

      {/* <section className="privacy-policy-section">
        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
          <strong> privacy@yourdomain.com</strong>
        </p>
      </section> */}
    </div>
  );
};

export default PrivacyPolicy;
