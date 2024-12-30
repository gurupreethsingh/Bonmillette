import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UpdateShippingAddress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const fetchShippingAddresses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not authorized. Please log in.");
          return navigate("/login");
        }

        const response = await axios.get(
          `http://localhost:3006/api/user/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setShippingAddresses(response.data.shipping_addresses || []);
      } catch (error) {
        console.error("Error fetching shipping addresses:", error.message);
        toast.error("Failed to fetch shipping addresses.");
      }
    };

    fetchShippingAddresses();
  }, [id, navigate]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not authorized. Please log in.");
      return navigate("/login");
    }

    try {
      const payload = {
        shipping_address: currentAddress,
        ...(isEditing ? { index: editingIndex } : {}),
      };

      await axios.put(
        `http://localhost:3006/api/update-shipping-address/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        isEditing
          ? "Shipping address updated successfully!"
          : "New shipping address added!"
      );
      setTimeout(() => {
        navigate(`/addresses/${id}`);
      }, 2000);
    } catch (error) {
      console.error("Error updating shipping address:", error.message);
      toast.error("Failed to update shipping address.");
    }
  };

  const handleEdit = (index) => {
    setCurrentAddress(shippingAddresses[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleAddNew = () => {
    setCurrentAddress({
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <ToastContainer />
      <h3 className="text-base font-semibold leading-7 text-gray-900 text-left">
        {isEditing ? "Edit Shipping Address" : "Add New Shipping Address"}
      </h3>

      <form onSubmit={handleSubmit} className="mt-6">
        {["street", "city", "state", "postalCode", "country"].map((field) => (
          <div key={field} className="mb-4">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              name={field}
              type="text"
              value={currentAddress[field] || ""}
              onChange={handleAddressChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        ))}

        <div className="flex justify-end gap-4">
          {isEditing && (
            <button
              type="button"
              onClick={handleAddNew}
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
            >
              Add New Address
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
