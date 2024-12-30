import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import logo_white from "../../assets/homepage_images/Bon_millette_logo_white.png";
import p1 from "../../assets/homepage_images/p1.JPG";
import b1 from "../../assets/homepage_images/b1.jpg";
import b2 from "../../assets/homepage_images/b2.jpg";
import b3 from "../../assets/homepage_images/b3.jpg";
import b4 from "../../assets/homepage_images/b4.jpg";
import b5 from "../../assets/homepage_images/b5.jpg";
import b6 from "../../assets/homepage_images/b6.jpg";
import brown_wood from "../../assets/our_story_images/brown_wood.jpg";
import festival_banner from "../../assets/homepage_images/festival_banner.jpg";
import VegIcon from "../../assets/homepage_images/Frame-4.svg";
import VegIcon10 from "../../assets/homepage_images/Frame-10.svg";
import VegIcon11 from "../../assets/homepage_images/Frame-11.svg";
import VegIcon12 from "../../assets/homepage_images/Frame-12.svg";
import VegIcon13 from "../../assets/homepage_images/Frame-13.svg";
import VegIcon14 from "../../assets/homepage_images/Frame-14.svg";
import { LiaShippingFastSolid } from "react-icons/lia";
import { LiaCertificateSolid } from "react-icons/lia";
import payment from "../../assets/homepage_images/payment.svg";
import shipping from "../../assets/homepage_images/shipping.svg";
import head_phones from "../../assets/homepage_images/head_phones.svg";
import certificate from "../../assets/homepage_images/certificate.svg";
import basen_laddo from "../../assets/homepage_images/basen_laddo.jpg";
import Bhoondi_laddo from "../../assets/homepage_images/Bhoondi_laddo.jpg";
import millet_laddu from "../../assets/homepage_images/millet_laddu.jpg";
import millet_pak from "../../assets/homepage_images/millet_pak.jpg";
import flax_seeds from "../../assets/homepage_images/flax_seeds.jpg";
import energy_bar from "../../assets/homepage_images/energy_bar.jpg";

import {
  FaRegEye,
  FaLeaf,
  FaHeart,
  FaDollarSign,
  FaPeopleArrows,
  FaCheckCircle,
} from "react-icons/fa"; // Additional icons

import friends from "../../assets/homepage_images/friends.jpeg";

const coreValuesData = [
  {
    title: "Transparency",
    description:
      "We believe in clear, honest ingredients and labels—no hidden additives, no artificial flavors.",
    icon: <FaRegEye size={50} className="text-white" />,
  },
  {
    title: "Quality",
    description:
      "From raw millet to the final product, each step reflects our commitment to quality.",
    icon: <FaCheckCircle size={50} className="text-white" />,
  },
  {
    title: "Affordability",
    description:
      "Premium health should be accessible to everyone. BonMillette ensures affordability without compromising on quality.",
    icon: <FaDollarSign size={50} className="text-white" />,
  },
  {
    title: "Health & Wellness",
    description:
      "Our ingredients and formulations are crafted to support a healthy lifestyle naturally.",
    icon: <FaHeart size={50} className="text-white" />,
  },
  {
    title: "Inclusivity",
    description:
      "We create products for everyone, from children to seniors, supporting diverse dietary needs with care.",
    icon: <FaPeopleArrows size={50} className="text-white" />,
  },
  {
    title: "Sustainability",
    description:
      "Relevant to the product’s production and packaging, add this to emphasize an eco-friendly approach.",
    icon: <FaLeaf size={50} className="text-white" />,
  },
];

// const top_seller_images = [
//   basen_laddo,
//   Bhoondi_laddo,
//   energy_bar,
//   flax_seeds,
//   millet_laddu,
//   millet_pak,
// ]; // Array of images

const top_seller_images = [
  {
    src: basen_laddo,
    link: "/single-product/676a8eb655ea7ab4c524f2b3",
    name: "Basen Laddo",
  },
  { src: Bhoondi_laddo, link: "/shop", name: "Bhoondi Laddo" },
  { src: energy_bar, link: "/shop", name: "Energy Bar" },
  {
    src: flax_seeds,
    link: "/single-product/676a900c55ea7ab4c524f2bf",
    name: "Flax Seeds",
  },
  {
    src: millet_laddu,
    link: "/single-product/676a8b8d55ea7ab4c524f1b5",
    name: "Millet Laddu",
  },
  { src: millet_pak, link: "/shop", name: "Millet Pak" },
];

const Homepage = () => {
  const images = [b1, b2, b3, b4, b5, b6];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const visibleItemsCount = isMobile ? 1 : 3;
  const totalItems = images.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalItems - 1 : prevIndex - 1
    );
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = 0; i < visibleItemsCount; i++) {
      visible.push(images[(currentIndex + i) % totalItems]);
    }
    return visible;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div id="carouselExampleFade" className="relative h-[500px] md:h-[900px]">
        {/* Image Display */}
        <div className="relative h-full">
          <img
            src={images[currentIndex]}
            className="d-block w-full h-full object-cover"
            alt={`Slide ${currentIndex + 1}`}
          />
          <div className="absolute inset-0 bg-black opacity-40 z-10 "></div>
        </div>

        {/* Logo and Text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
          <img
            src={logo_white}
            alt="Bon Millette Logo"
            className="w-1/2 md:w-1/4 rounded-4"
          />
          <p
            className="text-white text-xl md:text-4xl font-bold mt-2 md:mt-3 text-center px-4"
            style={{ marginTop: "-10px" }}
          >
            Snack Smart, Live Healthy!
          </p>
          <div className="text-center mt-5 mb-3">
            <a
              href="/shop"
              className="btn btn-lg bg-red-600 text-white py-3 ps-5 pe-5 rounded-pill hover:bg-red-800 font-extrabold"
            >
              Shop Now
            </a>
          </div>
        </div>
      </div>

      {/* Top Sellers Carousel */}

      <div className="top_sellers relative py-10">
        <div className="mx-auto w-4/5 lg:px-10">
          <h2 className="text-center text-5xl font-bold text-gray-800 mb-8">
            Top Sellers
          </h2>

          <div className="relative flex items-center">
            {/* Left Icon */}
            {top_seller_images.length > visibleItemsCount && !isMobile && (
              <button
                onClick={handlePrev}
                className="absolute left-3 sm:left-5 text-orange-600 hover:text-orange-800 z-10"
              >
                <FaChevronLeft size={30} />
              </button>
            )}

            {/* Carousel Content */}
            <div className="flex overflow-hidden justify-center gap-4 w-full p-3">
              {Array.from({ length: visibleItemsCount }).map((_, i) => {
                const imageIndex =
                  (currentIndex + i) % top_seller_images.length;
                const { src, link, name } = top_seller_images[imageIndex];

                return (
                  <div
                    key={imageIndex}
                    className="flex-shrink-0 w-[300px] md:w-[350px] text-center border bg-red-500 rounded"
                  >
                    {/* Image */}
                    <div className="rounded-b-lg overflow-hidden  transition-transform duration-300 hover:scale-105">
                      <a href={link}>
                        <img
                          src={src}
                          alt={name}
                          className="w-full h-[300px] md:h-[350px] object-cover"
                        />
                      </a>
                    </div>
                    {/* Link/Button */}
                    <div className="">
                      <a
                        href={link}
                        className="inline-block mt-2 mb-2 py-2 px-4  transition-all duration-300 btn btn-sm  text-white font-bold rounded-pill"
                      >
                        Shop Now
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Icon */}
            {top_seller_images.length > visibleItemsCount && !isMobile && (
              <button
                onClick={handleNext}
                className="absolute right-3 sm:right-5 text-orange-600 hover:text-orange-800 z-10"
              >
                <FaChevronRight size={30} />
              </button>
            )}
          </div>

          {/* Indicators */}
          {top_seller_images.length > visibleItemsCount && (
            <div className="flex justify-center mt-5 space-x-2">
              {top_seller_images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    Math.floor(currentIndex) === index
                      ? "bg-gray-800"
                      : "bg-gray-300"
                  }`}
                ></button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-full  bg-orange-300 p-10 md:p-20  flex flex-col md:flex-row justify-center items-center h-auto md:h-[600px] transition-all duration-300 hover:shadow-[0_0_20px_rgb(255,182,193)]">
        {/* Left Side */}
        <div className="left_side w-full md:w-1/2 border mb-5 md:mb-0">
          <img
            src={festival_banner}
            alt="Bon Millette Logo"
            className="w-full object-cover rounded-lg"
          />
        </div>

        {/* Right Side */}
        <div
          className="right_side w-full md:w-1/2 p-5 text-center md:text-left"
          style={{
            animation: "slideUp 0.5s ease-out",
          }}
        >
          <p className="text-white font-bold text-xl">Limited time offer</p>
          <p className="text-white font-bold text-3xl md:text-5xl mt-2">
            Festive Specials
          </p>
          <div className="mt-4">
            <a
              href="/shop"
              className="rounded-pill bg-red-600 px-5 py-2 text-white font-bold hover:bg-red-800"
            >
              Shop
            </a>
          </div>
        </div>
        {/* Keyframe Animation */}
        <style>
          {`
      @keyframes slideUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `}
        </style>
      </div>

      <div
        className="core_values p-20 relative bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${friends})`,
        }}
      >
        {/* Faded black overlay */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="text-white relative z-10 mb-10">
          <p className="text-5xl font-bold text-white mt-3 mb-5">Core Values</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {/* Dynamic Content */}
          {coreValuesData.map((value, index) => (
            <div key={index} className="each p-12 rounded-lg  ">
              <div className="flex justify-start items-center mb-4">
                {value.icon} {/* Dynamic Icon */}
                <p className="ml-4 text-3xl font-semibold text-white">
                  {value.title}
                </p>
              </div>
              <p className="text-white text-lg leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bon_diff p-5 bg-gray-50">
        {/* Title */}
        <div className="text-left mb-8">
          <p className="sm:text-2xl lg:text-4xl font-bold text-red-600">
            WHAT MAKES BON MILLETTE DIFFERENT?
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bon_diff_container">
          {/* First Card */}
          <div className="each_diff p-6 rounded-lg  text-left shadow">
            <div className="flex justify-start items-center mb-4">
              <img src={VegIcon10} alt="Veg Icon" className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              100% VEGETARIAN
            </p>
            <p className="text-gray-600 text-xl">
              We believe in clear, honest ingredients and labels—no hidden
              additives, no artificial flavors.
            </p>
          </div>

          {/* Second Card */}
          <div className="each_diff  p-6 rounded-lg  text-left shadow">
            <div className="flex justify-start items-center mb-4 ">
              <img src={VegIcon11} alt="Veg Icon" className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              NO MAIDA
            </p>
            <p className="text-gray-600 text-xl">
              From raw millet to the final product, each step reflects our
              commitment to quality.
            </p>
          </div>

          {/* Third Card */}
          <div className="each_diff  p-6 rounded-lg  text-left shadow">
            <div className="flex justify-start items-center mb-4">
              <img src={VegIcon12} alt="Veg Icon" className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              NO PALM OIL
            </p>
            <p className="text-gray-600 text-xl">
              Premium health should be accessible to everyone. Bon Millette
              ensures affordability without compromising on quality.
            </p>
          </div>

          {/* Fourth Card */}
          <div className="each_diff  p-6 rounded-lg  hover:shadow-lg text-left shadow">
            <div className="flex justify-start items-center mb-4">
              <img src={VegIcon13} alt="Veg Icon" className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              NO ARTIFICIAL FLAVORS / PRESERVATIVES
            </p>
            <p className="text-gray-600 text-xl">
              We create products for everyone, from children to seniors,
              supporting diverse dietary needs with care.
            </p>
          </div>

          {/* Fifth Card */}
          <div className="each_diff  p-6 rounded-lg  hover:shadow-lg text-left shadow">
            <div className="flex justify-start items-center mb-4">
              <img src={VegIcon14} alt="Veg Icon" className="w-16 h-16" />
            </div>
            <p className="text-2xl font-semibold text-gray-800 mb-2">
              BUDGET-FRIENDLY, PREMIUM FEEL
            </p>
            <p className="text-gray-600 text-xl">
              Relevant to the product’s production and packaging, we emphasize
              an eco-friendly approach.
            </p>
          </div>
        </div>
      </div>

      <div className="our_vision_mission p-5  border-0 shadow bg-orange-800 ">
        <div className="our_vision_container grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Our Vision */}
          <div className="our_vision p-6 ">
            <p className="text-5xl font-bold text-center mb-4 text-white">
              Our Vision
            </p>
            <p className="text-xl text-center text-white">
              Bon Millette is dedicated to bringing the goodness of millet to
              everyone’s plate, offering products that are pure, nutritious, and
              free from additives. Designed for all ages, our millet-based foods
              provide accessible, high-quality nutrition at an affordable
              price—making healthy eating a simple choice for everyone.
            </p>
          </div>

          {/* Our Mission */}
          <div className="our_mission  p-6">
            <p className="text-5xl font-bold text-center mb-4 text-white">
              Our Mission
            </p>
            <p className="text-xl text-center text-white">
              “To make healthy, natural millet-based foods accessible,
              affordable, and enjoyable for all, empowering people to live
              healthier lives through natural nutrition.”
            </p>
          </div>
        </div>
      </div>

      <div className="testimonial_slider sm:w-full mx-auto border rounded-lg shadow-lg">
        <div className="relative w-full">
          {/* Carousel Inner */}
          <div className="relative h-full overflow-hidden">
            <div
              id="testimonialCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              {/* Carousel Items */}
              <div className="carousel-inner">
                {/* Testimonial 1 */}
                <div className="carousel-item active">
                  <div
                    className="text-center p-6 rounded-lg shadow-md"
                    style={{ background: "#E7D3A4" }}
                  >
                    <h5 className="text-2xl font-bold mt-5 text-gray-900">
                      Arjun Mehta
                    </h5>
                    <div className="flex justify-center items-center my-2">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className="text-orange-800 sm:text-lg mr-1"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-900 text-lg">
                      "BonMillette snacks are my ultimate post-workout fuel! The
                      Popped Millet Energy Bar keeps me energized,
                      <br /> while Jowar Joy is a perfect balance of protein and
                      taste. Healthy snacking made simple!"
                    </p>
                    <p className="text-sm text-gray-900 mt-2 mb-5">
                      7 days ago
                    </p>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="carousel-item">
                  <div
                    className="text-center p-6 rounded-lg shadow-md"
                    style={{ background: "#E7D3A4" }}
                  >
                    <h5 className="text-2xl font-bold mt-5 text-gray-900">
                      Priya Iyer
                    </h5>
                    <div className="flex justify-center items-center my-2">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className="text-orange-800 sm:text-lg mr-1"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-900 text-lg">
                      "BonMillette snacks are my go-to! Healthy, delicious, and
                      guilt-free, they're perfect for my busy days. <br />
                      Millet Bliss and Mellet are simply divine. Highly
                      recommended for health-conscious foodies!"
                    </p>
                    <p className="text-sm text-gray-900 mt-2 mb-5">
                      7 days ago
                    </p>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="carousel-item">
                  <div
                    className="text-center p-6 rounded-lg shadow-md"
                    style={{ background: "#E7D3A4" }}
                  >
                    <h5 className="text-2xl font-bold mt-5 text-gray-900">
                      Rohan Desai
                    </h5>
                    <div className="flex justify-center items-center my-2">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className="text-orange-800 sm:text-lg mr-1"
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-gray-900 text-lg">
                      "As someone who loves snacking but avoids junk,
                      BonMillette is a game-changer.
                      <br /> Millet Boondi Blast is my favorite--crunchy and
                      flavorful! Plus, it's great to support such a natural
                      brand."
                    </p>
                    <p className="text-sm text-gray-900 mt-2 mb-5">
                      7 days ago
                    </p>
                  </div>
                </div>
              </div>

              {/* Dotted Indicators Inside */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <button
                  type="button"
                  data-bs-target="#testimonialCarousel"
                  data-bs-slide-to="0"
                  className="w-3 h-3 rounded-full bg-orange-800 mx-2"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#testimonialCarousel"
                  data-bs-slide-to="1"
                  className="w-3 h-3 rounded-full bg-orange-800 mx-2"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#testimonialCarousel"
                  data-bs-slide-to="2"
                  className="w-3 h-3 rounded-full bg-orange-800 mx-2"
                  aria-label="Slide 3"
                ></button>
              </div>

              {/* Navigation Controls */}
              <button
                className="carousel-control-prev absolute top-1/2 left-4 transform -translate-y-1/2"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="text-orange-800 text-3xl font-bold"
                  aria-hidden="true"
                >
                  ❮
                </span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next absolute top-1/2 right-4 transform -translate-y-1/2"
                type="button"
                data-bs-target="#testimonialCarousel"
                data-bs-slide="next"
              >
                <span
                  className="text-orange-800 text-3xl font-bold"
                  aria-hidden="true"
                >
                  ❯
                </span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shipping_section p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="flex items-center p-4 ">
            <img src={shipping} className="w-16 h-16 mr-4 text-red-500" />
            <div>
              <h5 className="text-lg font-bold">Free Shipping</h5>
              <p className="text-sm text-gray-600">
                Free Shipping On All Orders
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center p-4 ">
            <img
              src={certificate}
              alt="Easy Returns"
              className="w-16 h-16 mr-4"
            />
            <div>
              <h5 className="text-lg font-bold">Quality Guarantee</h5>
              <p className="text-sm text-gray-600">
                Best Quality Foods for all occasions
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center p-4 ">
            <img
              src={head_phones}
              alt="24/7 Support"
              className="w-16 h-16 mr-4"
            />
            <div>
              <h5 className="text-lg font-bold">Phone Order Supported</h5>
              <p className="text-sm text-gray-600">Call us to place an order</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-center p-4 ">
            <img
              src={payment}
              alt="Secure Payment"
              className="w-16 h-16 mr-4"
            />
            <div>
              <h5 className="text-lg font-bold">Secure Payment</h5>
              <p className="text-sm text-gray-600">All Cards Accepted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
