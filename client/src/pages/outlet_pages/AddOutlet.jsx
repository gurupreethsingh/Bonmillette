import React, { useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaHome,
  FaMoneyCheck,
} from "react-icons/fa";
import { MdSave } from "react-icons/md";
import { Link } from "react-router-dom";

const AddOutlet = () => {
  const [outlet, setOutlet] = useState({
    outlet_name: "",
    location: "",
    outlet_email: "",
    outlet_phone: "",
    street: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    company_name: "",
    company_registration_number: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    status: "active",
  });

  const handleChange = (e) => {
    setOutlet({ ...outlet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const outletData = {
      outlet_name: outlet.outlet_name,
      location: outlet.location,
      outlet_email: outlet.outlet_email,
      outlet_phone: outlet.outlet_phone,
      outlet_address: {
        street: outlet.street,
        city: outlet.city,
        state: outlet.state,
        zip_code: outlet.zip_code,
        country: outlet.country,
      },
      company_name: outlet.company_name,
      company_registration_number: outlet.company_registration_number,
      bank_details: {
        bank_name: outlet.bank_name,
        account_number: outlet.account_number,
        ifsc_code: outlet.ifsc_code,
      },
      status: outlet.status,
    };

    try {
      await axios.post("http://localhost:3006/api/add-outlet", outletData);
      alert("Outlet added successfully!");
      setOutlet({
        outlet_name: "",
        location: "",
        outlet_email: "",
        outlet_phone: "",
        street: "",
        city: "",
        state: "",
        zip_code: "",
        country: "",
        company_name: "",
        company_registration_number: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error adding outlet:", error);
      alert("There was an issue adding the outlet.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        {/* Header with title and button */}
        <div className="flex justify-between items-center">
          <h2 className="text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Add New Outlet
          </h2>
          <Link to="/all-outlets">
            <button className="bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold py-1 px-3 rounded-md shadow hover:opacity-90 transition-opacity text-sm">
              View All Outlets
            </button>
          </Link>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Outlet Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaUser className="text-green-500 mr-2" /> Outlet Name
            </label>
            <input
              type="text"
              name="outlet_name"
              value={outlet.outlet_name}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet name"
            />
          </div>

          {/* Location */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Location
            </label>
            <input
              type="text"
              name="location"
              value={outlet.location}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter location"
            />
          </div>

          {/* Outlet Email */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaEnvelope className="text-blue-500 mr-2" /> Email
            </label>
            <input
              type="email"
              name="outlet_email"
              value={outlet.outlet_email}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet email"
            />
          </div>

          {/* Outlet Phone */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaPhone className="text-green-500 mr-2" /> Phone
            </label>
            <input
              type="text"
              name="outlet_phone"
              value={outlet.outlet_phone}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter outlet phone"
            />
          </div>

          {/* Address fields */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Street
            </label>
            <input
              type="text"
              name="street"
              value={outlet.street}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter street"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> City
            </label>
            <input
              type="text"
              name="city"
              value={outlet.city}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter city"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> State
            </label>
            <input
              type="text"
              name="state"
              value={outlet.state}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter state"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Zip Code
            </label>
            <input
              type="text"
              name="zip_code"
              value={outlet.zip_code}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter zip code"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaHome className="text-green-500 mr-2" /> Country
            </label>
            <input
              type="text"
              name="country"
              value={outlet.country}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter country"
            />
          </div>

          {/* Company Name */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={outlet.company_name}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter company name"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaBuilding className="text-blue-500 mr-2" /> Registration Number
            </label>
            <input
              type="text"
              name="company_registration_number"
              value={outlet.company_registration_number}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter registration number"
            />
          </div>

          {/* Bank Details */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> Bank Name
            </label>
            <input
              type="text"
              name="bank_name"
              value={outlet.bank_name}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter bank name"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> Account Number
            </label>
            <input
              type="text"
              name="account_number"
              value={outlet.account_number}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter account number"
            />
          </div>

          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              <FaMoneyCheck className="text-blue-500 mr-2" /> IFSC Code
            </label>
            <input
              type="text"
              name="ifsc_code"
              value={outlet.ifsc_code}
              onChange={handleChange}
              required
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter IFSC code"
            />
          </div>

          {/* Status */}
          <div className="flex items-center">
            <label className="block text-sm font-medium leading-6 text-gray-900 flex items-center w-1/3">
              Status
            </label>
            <select
              name="status"
              value={outlet.status}
              onChange={handleChange}
              className="w-2/3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="flex items-center justify-center w-full py-2 px-4 mt-4 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 rounded-md shadow hover:opacity-90 transition-opacity"
            >
              <MdSave className="mr-1" />
              Add Outlet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOutlet;
