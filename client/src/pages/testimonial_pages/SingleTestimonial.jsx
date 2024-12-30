export default function SingleTestimonial({ text, name, designation }) {
  return (
    <div className="w-full">
      <div className="testimonial-box p-8 text-gray-800 border border-gray-400 rounded m-2">
        <p className="text-lg font-medium text-gray-700">{text}</p>
      </div>

      <div className="m-4">
        <p className="font-semibold">{name}</p>
        <p className="text-md text-gray-400 font-extrabold">{designation}</p>
      </div>

      <style jsx>{`
        .testimonial-box {
          position: relative;
          background-color: white;
        }

        .testimonial-box::after {
          content: "";
          position: absolute;
          bottom: -20px; /* Move further outside the box */
          left: 30px; /* Adjust the horizontal position of the arrow */
          border-width: 10px;
          border-style: solid;
          border-color: white transparent transparent transparent;
          z-index: 1; /* Ensure the arrow appears above the background */
        }

        .testimonial-box::before {
          content: "";
          position: absolute;
          bottom: -22px; /* Slightly lower than ::after for border effect */
          left: 28px; /* Match the horizontal position of the arrow */
          border-width: 10px;
          border-style: solid;
          border-color: gray transparent transparent transparent;
          z-index: 0; /* Place behind the white arrow for border effect */
        }
      `}</style>
    </div>
  );
}
