import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3006/api/add-category",
        { category_name: categoryName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Category added successfully!");
      setCategoryName("");
      alert("New Category added successfully.");
      navigate("/all-categories");
    } catch (error) {
      console.error("There was an error adding the category!", error);
      setMessage("Error adding category. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Add Main Category
      </h2>
      {message && <p className="text-green-500 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="categoryName"
          >
            Category Name
          </label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter the category name"
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity duration-300"
          >
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}
