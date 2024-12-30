import React from "react";
import {
  AiOutlineInstagram,
  AiFillLinkedin, // Borderless LinkedIn Icon
  AiFillFacebook, // Borderless Facebook Icon
  AiOutlineTwitter,
} from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa6";
import logo_black from "../../assets/logo/logo_black.png";
import logo_white from "../../assets/homepage_images/Bon_millette_logo_white.png";

const Footer = () => {
  return (
    <div>
      <div className="bg-orange-800 ps-4 pt-4 pe-4 pb-8 text-white">
        <div className="flex flex-col md:flex-row justify-around items-start md:items-center flex-wrap">
          {/* Social Links Section */}
          <div className="social_links w-full md:w-1/3 flex flex-col justify-center items-center mb-6 md:mb-0">
            <div className="text-center flex flex-col items-center">
              <img
                src={logo_white}
                alt="company logo"
                className="w-24 h-24 mb-3"
              />
              <p className="font-bold text-xl">Snack Smart, Live Healthy!</p>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition"
              >
                <AiOutlineInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition"
              >
                <FaLinkedinIn size={20} />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition"
              >
                <FaFacebookF size={15} />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-500 transition"
              >
                <AiOutlineTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="quick_links w-full md:w-1/3 text-center md:text-start mb-6 md:mb-0">
            <p className="text-xl font-bold">Quick Links</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="/"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-800 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about-us"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-800 transition"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/shop"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-800 transition"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="/contact-us"
                  rel="noopener noreferrer"
                  className="text-white font-semibold hover:text-red-800 transition"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="contact_information w-full md:w-1/3 text-center md:text-start">
            <p className="text-xl font-bold">Contact Us</p>
            <p className="mt-2">Phone: +91 90350 98282</p>
            <p className="mt-2">
              Bon Millette, Shed No 45, Katha No 125, <br />
              Hanumantha Nagar, <br />
              Srigandadha Kavalu, <br />
              Sunkadakatte, Bengaluru - 560091
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-around items-center pt-4 pb-4 bg-orange-800 text-white">
        <p className="sm:text-sm md:text-sm">
          &copy; 2024 Bon Millette. All rights reserved.
        </p>
        <p>
          <a
            href="/privacy-policy"
            className="sm:text-sm md:text-sm  transition"
          >
            Privacy Policy |
          </a>
          <a
            href="/terms-and-conditions"
            className="sm:text-sm md:text-sm  transition"
          >
            {" "}
            Terms & Conditions |{" "}
          </a>
          <a
            href="/return-policy"
            className="sm:text-sm md:text-sm  transition"
          >
            Return Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
