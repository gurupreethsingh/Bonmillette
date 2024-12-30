import React from "react";
import SingleTestimonial from "./SingleTestimonial";

const AllTestimonials = () => {
  const testimonials = [
    {
      text: "BonMillette snacks are my go-to! Healthy, delicious, and guilt-free, they’re perfect for my busy days. Millet Bliss and Meltaway Millet are simply divine. Highly recommend for health-conscious foodies!",
      name: "Priya Iyer",
      designation: "Nutritionist",
    },
    {
      text: "As someone who loves snacking but avoids junk, BonMillette is a game-changer. Millet Boondi Blast is my favorite—crunchy and flavorful! Plus, it’s great to support such a natural brand.",
      name: "Rohan Desai",
      designation: "Software Engineer",
    },
    {
      text: "BonMillette has made healthy snacking so easy. My kids love Omega Bites, and I enjoy Jowar Joy with my chai. A perfect mix of tradition and nutrition!",
      name: "Meera Kulkarni",
      designation: "Teacher",
    },
    {
      text: "BonMillette snacks are my ultimate post-workout fuel! The Popped Millet Energy Bar keeps me energized, while Jowar Joy is a perfect balance of protein and taste. Healthy snacking made simple!",
      name: "Arjun Mehta",
      designation: "Fitness Trainer",
    },
    {
      text: "BonMillette snacks are my go-to during study sessions! The Popped Millet Energy Bar gives me the boost I need, and Millet Bliss is the perfect sweet treat to satisfy cravings while staying healthy.",
      name: "Ananya Rao",
      designation: "Homemaker and Mom",
    },
    {
      text: "The perfect companion for my morning tea! I can’t imagine my day without their amazing snack options.",
      name: "Ravi Kumar",
      designation: "College Student",
    },
  ];

  return (
    <div>
      <div className="w-full md:w-5/6 mx-auto pt-5 pb-5">
        <p className="text-3xl md:text-5xl font-bold text-center">
          Testimonials
        </p>

        {/* Grid layout for testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {testimonials.map((testimonial, index) => (
            <div className="h-full flex" key={index}>
              <SingleTestimonial
                text={testimonial.text}
                name={testimonial.name}
                designation={testimonial.designation}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllTestimonials;
