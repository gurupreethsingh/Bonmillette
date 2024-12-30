// TermsConditions.jsx
import React from "react";

const TermsConditions = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 py-10 bg-gray-50 text-gray-800 text-center">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms and Conditions</h1>
      <p className="text-lg mb-4 leading-7">
        Welcome to our e-commerce store. By using our services, you agree to comply with and be bound by the following terms and conditions.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Use of Website</h2>
      <p className="mb-4 leading-7">
        You agree to use this website for lawful purposes only. Any unauthorized use of this website may result in legal action.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Order Acceptance</h2>
      <p className="mb-4 leading-7">
        We reserve the right to accept or reject your order at any time. Order confirmation does not guarantee acceptance.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
      <p className="leading-7">
        We are not liable for any indirect or consequential losses arising from the use of our website or services.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Changes to Terms</h2>
      <p className="leading-7">
        We may update these terms at any time. Continued use of our services indicates your agreement to the updated terms.
      </p>
    </div>
  );
};

export default TermsConditions;