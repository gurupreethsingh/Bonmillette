// ReturnPolicy.jsx
import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="px-6 md:px-20 lg:px-32 py-10 bg-gray-50 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">Return Policy</h1>
      <p className="text-lg mb-4 leading-7">
        We strive to ensure your satisfaction with every purchase. If you're not happy with your product, you can return it within 30 days of delivery.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Return Conditions</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>Items must be unused and in their original packaging.</li>
        <li>Provide proof of purchase for all returns.</li>
        <li>Custom or personalized items are non-returnable.</li>
      </ul>
      <h2 className="text-2xl font-semibold mb-3">How to Initiate a Return</h2>
      <p className="mb-4 leading-7">
        Contact our customer service team at returns@example.com to request a return authorization. Once approved, you will receive instructions for sending your item back.
      </p>
      <h2 className="text-2xl font-semibold mb-3">Refunds</h2>
      <p className="leading-7">
        Refunds will be processed within 7-10 business days after the return is received and inspected.
      </p>
    </div>
  );
};

export default ReturnPolicy;