import React from "react";
import Our_Story_Banner from "../../assets/our_story_images/Our_Story_Banner.jpg";
import our_journey from "../../assets/our_story_images/our_journey.png";
import lady from "../../assets/our_story_images/lady.png";
import variety_legumes from "../../assets/our_story_images/variety-legumes.png";
import dark_wood from "../../assets/our_story_images/brown_wood.jpg";
import mix_items from "../../assets/our_story_images/mixes_items.jpg";

const OurStory = () => {
  return (
    <div>
      {/* Banner Section */}
      <div>
        <div className="banner">
          <img
            src={Our_Story_Banner}
            alt="our story banner"
            className="w-full"
          />
        </div>

        {/* Roadmap Section */}
        <div className="roadmap">
          <img
            src={our_journey}
            alt="our story banner"
            className="rounded-5 mx-auto w-full max-w-5xl"
          />
        </div>

        {/* Content and Image Section */}
        <div className="flex flex-col lg:flex-row justify-center items-center">
          <div className="content lg:w-2/3 text-center lg:text-left">
            <p className="text-lg sm:text-xl lg:text-2xl p-5 font-bold">
              Bon Millette” is founded & run by Woman entrepreneurs, so as
              mothers and wellness advocates, we wanted better snack choices
              especially for children. With Bon Millette, we’re reshaping
              snacking for all ages by blending ancient grains and natural
              ingredients for delicious, nourishing options.
            </p>
          </div>
          <div className="lady lg:w-1/2">
            <img src={lady} alt="lady" className="mx-auto w-2/3 " />
          </div>
        </div>

        {/* Why Millets Section */}
        <div
          className="relative flex flex-col lg:flex-row justify-evenly items-center p-5"
          style={{
            backgroundImage: `url(${dark_wood})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Wave SVG */}
          <svg
            className="absolute top-0 left-0 w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="white"
              fillOpacity="1"
              d="M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,149.3C672,139,768,149,864,160C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>

          <div
            className="image_all_collage w-full lg:w-1/2 pt-5 pb-5"
            style={{ animation: "slideInLeft 1s ease-in-out" }}
          >
            <img
              src={variety_legumes}
              alt="our story banner"
              className="rounded-5 mx-auto w-full max-w-lg"
            />
          </div>

          <div
            className="all_product_content mb-5 mt-5 text-white w-full lg:w-1/2  lg:text-left"
            style={{ animation: "slideInRight 1s ease-in-out" }}
          >
            <p className="text-2xl lg:text-4xl font-bold mb-4">Why Millets</p>
            <p className="text-base lg:text-xl mt-4 mb-4">
              Millets are more than just a grain—they’re nature’s nutrient-rich
              gift. Here’s why we chose this powerhouse ingredient to create a
              snacking experience like no other.
            </p>
            <p className="text-base lg:text-xl mt-4 mb-4">
              Nutritious Powerhouse: Packed with essential nutrients like fiber,
              iron, and protein.
            </p>
            <p className="text-base lg:text-xl mt-4 mb-4">
              Sustainable Choice: Millets require less water, making them an
              eco-friendly crop.
            </p>
            <p className="text-base lg:text-xl mt-4 mb-4">
              Energizing Fuel: Perfect for sustained energy without the crash.
            </p>
            <p className="text-base lg:text-xl mt-4 mb-4">
              Allergen-Friendly: Naturally gluten-free and easy on the digestive
              system.
            </p>
          </div>
        </div>
      </div>

      {/* About Products Section */}
      <div className="about_products container pt-5 pb-5">
        <p className="text-center text-lg sm:text-xl font-semibold">
          With BonMillette, you’re getting more than just a snack. Each bite is
          filled with carefully chosen ingredients that reflect our dedication
          to quality, health, and flavor.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-5">
          <div className="card h-100 p-4 bg-gray-200 border-0 shadow text-center">
            <h5 className="text-2xl font-bold">Pure Ingredients</h5>
            <p className="text-lg mt-2">
              No refined sugar, no maida, no palm oil.
            </p>
          </div>
          <div className="card h-100 p-4 bg-gray-200 border-0 shadow text-center">
            <h5 className="text-2xl font-bold">Natural Sweeteners</h5>
            <p className="text-lg mt-2">Only jaggery and dates syrup.</p>
          </div>
          <div className="card h-100 p-4 bg-gray-200 border-0 shadow text-center">
            <h5 className="text-2xl font-bold">Mindful Recipes</h5>
            <p className="text-lg mt-2">
              Designed for taste, nutrition, and balance.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div
        className="flex flex-col lg:flex-row justify-center items-center p-5"
        style={{
          backgroundImage: `url(${dark_wood})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="lady w-full lg:w-1/2 mb-4 lg:mb-0 ">
          <img
            src={mix_items}
            alt="lady"
            className="mx-auto w-full max-w-md rounded-5"
          />
        </div>
        <div className="content w-full lg:w-1/2 text-left lg:text-left">
          <p className="text-4xl lg:text-4xl font-semibold text-white mt-2 mb-2">
            Ready to snack smarter?
          </p>
          <p className="text-2xl lg:text-2xl font-semibold text-white mt-2 mb-2">
            Explore our products and find your favorite!
          </p>
          <a
            className="btn bg-red-500 text-white font-bold mt-2 mb-2 p-2 px-4 rounded-pill"
            href="/shop"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
