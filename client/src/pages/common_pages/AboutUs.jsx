import React from "react";
import logo from "../../assets/logo/logo.png";

const AboutUs = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row justify-between w-full md:w-5/6 mx-auto pt-5 pb-5 overflow-hidden">
      {/* Left Section with Text */}
      <div
        className="w-full md:w-1/2 px-3 md:px-5"
        style={{
          animation: "fadeInUp 1.2s ease-in-out",
        }}
      >
        <p className="text-red-600 font-bold mt-3 mb-4 text-base">
          Welcome To Bonmillette
        </p>
        <p className="text-5xl md:text-5xl font-bold mt-3 mb-4">Who We Are</p>
        {/* Desktop width unchanged, mobile spans full width */}
        <p className="text-base md:text-lg font-thin mb-4 w-full md:w-2/3">
          At BonMillette, we believe in snacking smarter. We've created a range
          of millet-based superfoods - snacks and sweets free of refined sugar,
          maida, and palm oil. Perfect for adults looking for a health boost and
          children who deserve wholesome, nutritious treats. Made with natural
          sweeteners like date syrup and jaggery, our snacks deliver guilt-free
          enjoyment without compromising on taste.
        </p>
        <p className="font-bold text-base md:text-xl text-gray-600 mb-3 w-full md:w-7xl">
          "We are both excited and proud of this exquisite line of mithais,
          savouries and many packaged in a wonderful box of traditional opulence
          that you will love to share with everyone you know and care for."
        </p>
        <hr className="w-10" />
        <div>
          <a
            href="/contact-us"
            className="btn border-0 bg-red-500 text-white font-bold px-5 py-3 rounded-full mt-4 mb-5"
          >
            Contact Us
          </a>
        </div>
      </div>

      {/* Right Section with Logo */}
      <div
        className="w-full md:w-1/2 flex justify-center items-center px-3"
        style={{
          animation: "fadeInDown 1.2s ease-in-out",
        }}
      >
        <div className="about_logo shadow-lg border w-full md:w-3/4 bg-white mx-auto rounded-5">
          <img
            src={logo}
            alt="BonMillette Logo"
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeInDown {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @media (max-width: 768px) {
            body {
              margin: 0;
              overflow-x: hidden;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AboutUs;
