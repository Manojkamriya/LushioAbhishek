import React from 'react';
import "./Policy.css"
const PrivacyPolicy = () => {
  const policies = [
    {
      title: 'Introduction',
      content:
        'Describes how LUSHIO and its affiliates (collectively referred to as "LUSHIO, we, our, us") collect, use, share, and process your information/personal data through the Platform.',
    },
    {
      title: 'Collection',
      content:
        'Information collected includes personal data provided during sign-up, usage of the Platform, and related interactions. Includes name, date of birth, address, phone number, email, proof of identity, sensitive data like bank account details, and biometric information, collected with consent. Behaviour, preferences, and transactional data are also tracked and compiled. Users should read third-party privacy policies when engaging with them. Cautions users against providing sensitive information over unsolicited communications.',
    },
    {
      title: 'Usage',
      content:
        'Personal data is used to provide requested services, assist sellers, enhance customer experience, troubleshoot, conduct research, customize services, detect fraud, and enforce terms.',
    },
    {
      title: 'Sharing',
      content:
        'Data may be shared internally within group entities and with affiliates for marketing, service provision, and legal compliance. Data may also be shared with government or law enforcement agencies if required by law or in good faith for protection or enforcement purposes.',
    },
    {
      title: 'Security Precautions',
      content:
        'Adopts reasonable practices to protect data but acknowledges inherent risks in internet transmission. Users are responsible for safeguarding login credentials.',
    },
    {
      title: 'Data Deletion and Retention',
      content:
        'Users can delete accounts, resulting in loss of all account-related information. Deletion may be delayed for pending claims or services. Retains anonymized data for analytics and prevents fraud.',
    },
    {
      title: 'Your Rights',
      content:
        'Users may access, rectify, and update data directly via the Platform.',
    },
    {
      title: 'Consent',
      content:
        'Consent is assumed upon use of the Platform or disclosure of information. Consent withdrawal is permitted but may affect service availability.',
    },
    {
      title: 'Changes to Privacy Policy',
      content:
        'Updates to the policy may be made periodically, with notifications for significant changes as required by law.',
    },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }} className='privacy-policy-container'>
      <h1>Privacy Policy</h1>
      {policies.map((policy, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>{policy.title}</h2>
          <p>{policy.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
