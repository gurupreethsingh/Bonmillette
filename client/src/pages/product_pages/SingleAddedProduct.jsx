import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MdAdd,
  MdViewList,
  MdDelete,
  MdEdit,
  MdSave,
  MdImage,
} from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";

export default function SingleAddedProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [editing, setEditing] = useState(false);
  const [productUpdates, setProductUpdates] = useState({});
  const [forceRender, setForceRender] = useState(false);
  const [newProductImage, setNewProductImage] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3006/api/single-product/${id}`
        );
        setProductData(response.data);
        setProductUpdates(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id, forceRender]);

  const handleDeleteProduct = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmation) return;

    try {
      await axios.delete(`http://localhost:3006/api/delete-product/${id}`);
      alert("Product deleted successfully.");
      navigate("/all-added-products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3006/api/update-product/${id}`,
        productUpdates
      );

      setProductData(response.data);
      setProductUpdates(response.data);

      alert("Product updated successfully!");
      setEditing(false);
      setForceRender(!forceRender);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "tags" && typeof value === "string") {
      setProductUpdates({ ...productUpdates, [field]: value.split(",") });
    } else {
      setProductUpdates({ ...productUpdates, [field]: value });
    }
  };

  const handleProductImageChange = (e) => {
    setNewProductImage(e.target.files[0]);
  };

  const handleProductImageUpload = async () => {
    if (!newProductImage) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("product_image", newProductImage);

    try {
      const response = await axios.put(
        `http://localhost:3006/api/update-product-image/${id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Product image updated successfully!");
      setForceRender(!forceRender);
      setNewProductImage(null);
    } catch (error) {
      console.error("Error updating product image:", error);
    }
  };

  const goToManageImagesPage = () => {
    navigate(`/manage-product-images/${id}`);
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl) {
      const normalizedPath = imageUrl
        .replace(/\\/g, "/")
        .split("uploads/")
        .pop();
      return `http://localhost:3006/uploads/${normalizedPath}`;
    }
    return "https://via.placeholder.com/150";
  };

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg">
        <div className="flex justify-between items-center flex-wrap mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Product Details</h2>
          <div className="flex space-x-2">
            <button
              onClick={editing ? handleUpdateProduct : () => setEditing(true)}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              {editing ? (
                <MdSave className="mr-1" />
              ) : (
                <MdEdit className="mr-1" />
              )}
              {editing ? "Save" : "Edit"}
            </button>
            <button
              onClick={handleDeleteProduct}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              <MdDelete className="mr-1" />
              Delete
            </button>
            <button
              onClick={() => navigate("/all-added-products")}
              className="flex items-center px-3 py-1 mt-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
            >
              <MdViewList className="mr-1" />
              All Products
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="w-full sm:w-1/2">
            <div
              className="w-full h-auto object-cover rounded-lg"
              style={{
                width: "300px",
                height: "300px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={getImageUrl(productData.product_image)}
                alt={productData.product_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                className="rounded-lg"
              />
            </div>
            <div className="flex mt-4 space-x-2">
              {productData.all_product_images?.length > 0
                ? productData.all_product_images.map((image, index) => (
                    <img
                      key={index}
                      src={getImageUrl(image)}
                      alt={`Additional ${index}`}
                      className="object-cover rounded-lg"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  ))
                : "No additional images available."}
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Update Product Image
              </h3>
              <input
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
                className="mt-4"
              />
              <button
                onClick={handleProductImageUpload}
                className="px-4 py-2 mt-2 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm"
              >
                Upload Image
              </button>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Other Product Images
              </h3>
              <button
                onClick={goToManageImagesPage}
                className="px-4 py-2 mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-md shadow hover:opacity-90 transition-opacity text-sm flex items-center"
              >
                <MdImage className="mr-1" />
                Manage Images
              </button>
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <h3 className="text-lg font-semibold text-gray-900">
              Product:{" "}
              {editing ? (
                <input
                  type="text"
                  value={productUpdates.product_name || ""}
                  onChange={(e) =>
                    handleInputChange("product_name", e.target.value)
                  }
                  className="w-full px-4 py-2 border rounded-md"
                />
              ) : (
                productData.product_name || "N/A"
              )}
            </h3>

            <div className="mt-4 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                {/* Description */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Description
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <textarea
                        value={productUpdates.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.description || "N/A"
                    )}
                  </dd>
                </div>

                {/* Category
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="text"
                        value={productUpdates.category?.name || ""}
                        onChange={(e) =>
                          handleInputChange("category", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.category?.name || "N/A"
                    )}
                  </dd>
                </div> */}

                {/* Stock */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Stock</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="number"
                        value={productUpdates.stock || ""}
                        onChange={(e) =>
                          handleInputChange("stock", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.stock
                    )}
                  </dd>
                </div>

                {/* Total Products Sold
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Total Products Sold
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.total_products_sold}
                  </dd>
                </div> */}

                {/* Brand */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Brand</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="text"
                        value={productUpdates.brand || ""}
                        onChange={(e) =>
                          handleInputChange("brand", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.brand
                    )}
                  </dd>
                </div>

                {/* SKU */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">SKU</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="text"
                        value={productUpdates.SKU || ""}
                        onChange={(e) =>
                          handleInputChange("SKU", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.SKU
                    )}
                  </dd>
                </div>

                {/* Dimensions */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Dimensions (LxWxH)
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          value={productUpdates.dimensions?.length || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dimensions.length",
                              e.target.value
                            )
                          }
                          placeholder="Length"
                          className="w-full px-4 py-2 border rounded-md"
                        />
                        <input
                          type="number"
                          value={productUpdates.dimensions?.width || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dimensions.width",
                              e.target.value
                            )
                          }
                          placeholder="Width"
                          className="w-full px-4 py-2 border rounded-md"
                        />
                        <input
                          type="number"
                          value={productUpdates.dimensions?.height || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "dimensions.height",
                              e.target.value
                            )
                          }
                          placeholder="Height"
                          className="w-full px-4 py-2 border rounded-md"
                        />
                      </div>
                    ) : (
                      `L: ${productData.dimensions?.length || "N/A"}, W: ${
                        productData.dimensions?.width || "N/A"
                      }, H: ${productData.dimensions?.height || "N/A"}`
                    )}
                  </dd>
                </div>

                {/* Tags */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Tags</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="text"
                        value={productUpdates.tags?.join(", ") || ""}
                        onChange={(e) =>
                          handleInputChange("tags", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      productData.tags?.join(", ") || "N/A"
                    )}
                  </dd>
                </div>

                {/* Discount */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Discount
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="number"
                        value={productUpdates.discount || ""}
                        onChange={(e) =>
                          handleInputChange("discount", e.target.value)
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    ) : (
                      `${productData.discount || 0}%`
                    )}
                  </dd>
                </div>

                {/* Availability Status */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Availability Status
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {editing ? (
                      <input
                        type="checkbox"
                        checked={productUpdates.availability_status || false}
                        onChange={(e) =>
                          handleInputChange(
                            "availability_status",
                            e.target.checked
                          )
                        }
                      />
                    ) : productData.availability_status ? (
                      "Available"
                    ) : (
                      "Out of Stock"
                    )}
                  </dd>
                </div>
                {/* Outlet Information */}
                <div className="py-2">
                  <dt className="text-sm font-medium text-gray-900">Outlets</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.outlet?.length > 0
                      ? productData.outlet.map((outletEntry, index) => (
                          <div key={index} className="mt-2">
                            <strong>Outlet:</strong>{" "}
                            {outletEntry.outlet?.name || "N/A"}
                            <div>
                              {outletEntry.products.map((product, idx) => (
                                <div key={idx}>
                                  <span>
                                    Volume: {product.volume}, Selling Price: ₹
                                    {product.selling_price}, Display Price: ₹
                                    {product.display_price}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      : "No outlet information available."}
                  </dd>
                </div>

                {/* Vendor */}
                {/* <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">Vendor</dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {productData.vendor?.name || "N/A"}
                  </dd>
                </div> */}

                {/* Created At */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Product Added On
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {new Date(productData.createdAt).toLocaleString()}
                  </dd>
                </div>

                {/* Updated At */}
                <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium text-gray-900">
                    Updated At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-700 sm:col-span-2 sm:mt-0">
                    {new Date(productData.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
