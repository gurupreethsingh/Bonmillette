// PrivacyPolicy.jsx
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 py-10 bg-gray-50 text-gray-800 text-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-lg mb-4 leading-7">
        At our e-commerce store, we value your privacy and are committed to protecting your personal information. This policy outlines how we collect, use, and safeguard your data.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Information We Collect</h2>
      <p className="mb-4 leading-7">
        We may collect personal information such as your name, email address, shipping address, and payment details to provide you with a seamless shopping experience.
      </p>
      <h2 className="text-2xl font-semibold mb-3">How We Use Your Information</h2>
      <p className="mb-4 leading-7">
        Your information is used to process transactions, manage your account, and send updates about your orders. We do not share your data with third parties without your consent.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
      <p className="leading-7">
        If you have any questions about our privacy practices, please reach out to our support team at support@example.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;