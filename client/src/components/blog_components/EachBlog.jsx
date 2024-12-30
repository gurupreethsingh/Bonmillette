import React from "react";

const EachBlog = ({ image, date, title, content, author }) => {
  return (
    <div className="col">
      <div className="card h-100 border-0">
        <img
          src={image}
          className="rounded-5 transition-shadow duration-300 hover:shadow-2xl"
          alt="Blog Thumbnail"
        />
        <div className="card-body">
          <p className="card-title text-xl font-thin text-red-500">
            {date} - <span className="text-gray-800">{author}</span>
          </p>
          <p className="card-title text-xl font-extrabold">{title}</p>
          <p className="card-text text-xl font-thin">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default EachBlog;
