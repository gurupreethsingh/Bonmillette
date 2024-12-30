import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [categories, setCategories] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [vendors, setVendors] = useState([]); // New state for vendors
  const [vendorId, setVendorId] = useState(""); // Selected vendor ID
  const [stock, setStock] = useState("");
  const [brand, setBrand] = useState("");
  const [SKU, setSKU] = useState("");
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [tags, setTags] = useState("");
  const [discount, setDiscount] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState(true);
  const [mainProductImage, setMainProductImage] = useState(null);
  const [additionalProductImages, setAdditionalProductImages] = useState([]);
  const [volumes, setVolumes] = useState([
    { volume: "", sellingPrice: "", displayPrice: "" },
  ]);

  useEffect(() => {
    const fetchCategoriesAndOutletsAndVendors = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:3006/api/all-categories"
        );
        setCategories(categoryResponse.data);

        const outletResponse = await axios.get(
          "http://localhost:3006/api/all-outlets"
        );
        setOutlets(outletResponse.data);

        const vendorResponse = await axios.get(
          "http://localhost:3006/api/all-vendors"
        );
        setVendors(vendorResponse.data); // Set vendors in state

        if (outletResponse.data.length > 0 && !outletId) {
          setOutletId(outletResponse.data[0]._id);
        }

        if (vendorResponse.data.length > 0 && !vendorId) {
          setVendorId(vendorResponse.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching categories, outlets, or vendors:", error);
      }
    };
    fetchCategoriesAndOutletsAndVendors();
  }, [outletId, vendorId]);

  const handleMainImageChange = (e) => {
    setMainProductImage(e.target.files[0]);
  };

  const handleAdditionalImagesChange = (e) => {
    setAdditionalProductImages([...e.target.files]);
  };

  const handleVolumeChange = (index, field, value) => {
    const updatedVolumes = [...volumes];
    updatedVolumes[index][field] = value;
    setVolumes(updatedVolumes);
  };

  const addVolumeField = () => {
    setVolumes([...volumes, { volume: "", sellingPrice: "" }]);
  };

  const removeVolumeField = (index) => {
    const updatedVolumes = volumes.filter((_, i) => i !== index);
    setVolumes(updatedVolumes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("description", description);
    formData.append("category", categoryId);
    formData.append("vendor", vendorId); // Add selected vendor
    formData.append("stock", stock);
    formData.append("brand", brand);
    formData.append("SKU", SKU);
    formData.append("dimensions", JSON.stringify(dimensions));
    formData.append("color", color);
    formData.append("material", material);
    formData.append("tags", tags.split(","));
    formData.append("discount", discount);
    formData.append("availability_status", availabilityStatus);

    const formattedVolumes = [
      {
        outlet: outletId,
        products: volumes.map(({ volume, sellingPrice, displayPrice }) => ({
          volume,
          selling_price: sellingPrice,
          display_price: displayPrice,
        })),
      },
    ];
    formData.append("outlet", JSON.stringify(formattedVolumes));

    if (mainProductImage) {
      formData.append("product_image", mainProductImage);
    }

    if (additionalProductImages.length > 0) {
      additionalProductImages.forEach((image) => {
        formData.append("all_product_images", image);
      });
    }

    try {
      await axios.post("http://localhost:3006/api/add-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product added successfully!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      resetForm();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const resetForm = () => {
    setProductName("");
    setDescription("");
    setCategoryId("");
    setVendorId(vendors.length > 0 ? vendors[0]._id : ""); // Reset vendor
    setOutletId(outlets.length > 0 ? outlets[0]._id : "");
    setStock("");
    setBrand("");
    setSKU("");
    setDimensions({ length: "", width: "", height: "" });
    setColor("");
    setMaterial("");
    setTags("");
    setDiscount(0);
    setAvailabilityStatus(true);
    setMainProductImage(null);
    setAdditionalProductImages([]);
    setVolumes([{ volume: "", sellingPrice: "", displayPrice: "" }]);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        <div className="flex space-x-4">
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Outlet
            </label>
            <select
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Outlet</option>
              {outlets.map((outlet) => (
                <option key={outlet._id} value={outlet._id}>
                  {outlet.outlet_name || "Unnamed Outlet"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Vendor
            </label>
            <select
              value={vendorId}
              onChange={(e) => setVendorId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {vendor.vendor_name || "Unnamed Vendor"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Stock
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              SKU
            </label>
            <input
              type="text"
              value={SKU}
              onChange={(e) => setSKU(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4 w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags/Keywords (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Availability Status */}
        <div className="flex space-x-4">
          <div className="mb-4 w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Availability Status
            </label>
            <select
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value === "true")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          <div className="mb-4 w-1/2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Dimensions (Length, Width, Height)
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Length"
              value={dimensions.length}
              onChange={(e) =>
                setDimensions({ ...dimensions, length: e.target.value })
              }
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({ ...dimensions, width: e.target.value })
              }
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="number"
              placeholder="Height"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({ ...dimensions, height: e.target.value })
              }
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Main Product Image
          </label>
          <input
            type="file"
            onChange={handleMainImageChange}
            required
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Additional Product Images
          </label>
          <input
            type="file"
            onChange={handleAdditionalImagesChange}
            multiple
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Volumes, Selling Prices and Display Prices
          </label>
          {volumes.map((volume, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <input
                type="text"
                placeholder="Volume (e.g., 1L)"
                value={volume.volume}
                onChange={(e) =>
                  handleVolumeChange(index, "volume", e.target.value)
                }
                required
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Selling Price"
                value={volume.sellingPrice}
                onChange={(e) =>
                  handleVolumeChange(index, "sellingPrice", e.target.value)
                }
                required
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="number"
                placeholder="Display Price"
                value={volume.displayPrice}
                onChange={(e) =>
                  handleVolumeChange(index, "displayPrice", e.target.value)
                }
                required
                className="w-1/3 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addVolumeField}
                className="text-success"
              >
                <IoIosAddCircle className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={() => removeVolumeField(index)}
                className="text-danger"
              >
                <MdDelete className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="bg-orange-700 hover:bg-orange-800 rounded-pill text-white font-bold py-2 px-4 rounded-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
