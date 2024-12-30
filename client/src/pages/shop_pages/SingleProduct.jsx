import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import payment from "../../assets/homepage_images/payment.svg";
import shipping from "../../assets/homepage_images/shipping.svg";
import head_phones from "../../assets/homepage_images/head_phones.svg";
import certificate from "../../assets/homepage_images/certificate.svg";
import { FaTag } from "react-icons/fa";
import { MdTaskAlt } from "react-icons/md";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [quantity, setQuantity] = useState(1); // State for quantity
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sortOption, setSortOption] = useState("recent");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [selectedVolume, setSelectedVolume] = useState(null);

  // Calculate average rating dynamically based on reviews
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  // Sorted reviews based on the selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortOption === "high") return b.rating - a.rating; // High to Low
    if (sortOption === "low") return a.rating - b.rating; // Low to High
    return new Date(b.createdAt) - new Date(a.createdAt); // Most Recent (default)
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const productResponse = await axios.get(
          `http://localhost:3006/api/single-product/${id}`
        );
        const product = productResponse.data;

        setProductDetails(product);

        if (product.outlet?.length > 0) {
          const outletVolumes = product.outlet[0].products;
          if (outletVolumes.length > 0) {
            const sortedVolumes = outletVolumes.sort(
              (a, b) => a.selling_price - b.selling_price
            );
            setSelectedVolume(sortedVolumes[0]);
          }
        }

        if (product.category?._id) {
          const relatedResponse = await axios.get(
            `http://localhost:3006/api/products-by-category/${product.category._id}`
          );
          const relatedData = relatedResponse.data.map((product) => {
            const lowestPrice = product.outlet
              ?.flatMap((o) => o.products)
              .reduce((min, p) => Math.min(min, p.selling_price), Infinity);
            return { ...product, lowestPrice };
          });
          setRelatedProducts(relatedData.filter((p) => p._id !== id));
        }

        const reviewsResponse = await axios.get(
          `http://localhost:3006/api/get-all-reviews/${id}`
        );
        setReviews(reviewsResponse.data);
      } catch (err) {
        setError("Failed to load product details.");
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedVolume) {
      toast.error("Please select a volume.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to add products to the cart.");
      setTimeout(() => navigate("/my-account"), 3000);
      return;
    }

    try {
      await axios.post(
        "http://localhost:3006/api/cart",
        {
          productId: id,
          volume: selectedVolume.volume,
          priceAtPurchase: selectedVolume.selling_price,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Product added to cart successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error("Failed to add product to cart.");
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500 py-5">
        <p>{error}</p>
      </div>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.success("Please log in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3006/api/add-review`,
        {
          product: id,
          productType: "Product",
          rating: newReview.rating,
          comment: newReview.comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success("Review added successfully!");
        window.location.reload();
        setNewReview({ rating: 0, comment: "" });
        setReviews((prevReviews) => [...prevReviews, response.data]);
      } else {
        console.error("Unexpected response status:", response.status);
        toast.error("Failed to add review. Please try again.");
      }
    } catch (err) {
      toast.error("Error adding review:", err.response || err.message);
      MdTaskAlt.error(
        "Failed to add review. Please check your connection and try again."
      );
    }
  };

  const handleLoadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  return (
    <div className="w-full">
      <ToastContainer />
      {productDetails && (
        <div className="w-full md:w-5/6 mx-auto pt-5 flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="relative w-full h-auto">
              <div
                className="image_wrapper relative w-full aspect-square overflow-hidden shadow rounded-md"
                style={{ height: "90%" }}
              >
                <img
                  src={`http://localhost:3006/${productDetails?.all_product_images?.[currentImageIndex]}`}
                  alt={`Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-md shadow"
                />
              </div>
              <div className="flex justify-center mt-4">
                {productDetails?.all_product_images?.map((_, index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 mx-1 rounded-full cursor-pointer ${
                      index === currentImageIndex ? "bg-red-500" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="price_details w-full lg:w-1/2 h-full text-left ps-5">
            <p className="mb-5 font-bold text-3xl lg:text-5xl">
              {productDetails.product_name}
            </p>
            <p className="font-bold text-2xl lg:text-3xl mt-5">
              ₹{selectedVolume ? selectedVolume.selling_price : "N/A"}
            </p>
            <div className="mt-5">
              <label htmlFor="volume" className="font-semibold text-lg">
                Select Volume:
              </label>
              <select
                id="volume"
                value={selectedVolume?.volume || ""}
                onChange={(e) => {
                  const selected = productDetails.outlet[0].products.find(
                    (vol) => vol.volume === e.target.value
                  );
                  setSelectedVolume(selected);
                }}
                className="border rounded px-4 py-2 w-full"
              >
                {productDetails.outlet[0]?.products?.map((vol, index) => (
                  <option key={index} value={vol.volume}>
                    {vol.volume} - ₹{vol.selling_price}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 flex gap-4">
              <input
                type="number"
                min="1"
                max={productDetails.stock}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value, 10) || 1;
                  setQuantity(
                    value > productDetails.stock ? productDetails.stock : value
                  );
                }}
                disabled={productDetails.stock === 0}
                className="border rounded-full px-4 py-2"
              />
              <button
                className={`bg-red-500 text-white px-6 py-2 rounded-full hover:bg-gray-900 ${
                  productDetails.stock === 0
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleAddToCart}
                disabled={productDetails.stock === 0}
              >
                Add To Cart
              </button>
            </div>
            <p className="font-bold underline mt-5 mb-5">
              Category:{" "}
              <span className="text-red-500 font-semibold">
                {productDetails?.category?.category_name || "Uncategorized"}
              </span>
            </p>

            {/* Shipping Section */}
            <div className="shipping_section">
              <div className="flex items-center border-b pt-3 pb-3">
                <img
                  src={shipping}
                  className="w-12 h-12 mr-5 text-red-500"
                  alt="Free Shipping"
                />
                <div>
                  <h5 className="text-lg font-bold">Free Shipping</h5>
                  <p className="text-sm text-gray-600">
                    Free Shipping On All Orders
                  </p>
                </div>
              </div>
              <div className="flex items-center border-b pt-3 pb-3">
                <img
                  src={certificate}
                  alt="Quality Guarantee"
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h5 className="text-lg font-bold">Quality Guarantee</h5>
                  <p className="text-sm text-gray-600">
                    Best Quality Foods for all occasions
                  </p>
                </div>
              </div>
              <div className="flex items-center border-b pt-3 pb-3">
                <img
                  src={head_phones}
                  alt="Phone Order Supported"
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h5 className="text-lg font-bold">Phone Order Supported</h5>
                  <p className="text-sm text-gray-600">
                    Call us to place an order
                  </p>
                </div>
              </div>
              <div className="flex items-center border-b pt-3 pb-3">
                <img
                  src={payment}
                  alt="Secure Payment"
                  className="w-12 h-12 mr-4"
                />
                <div>
                  <h5 className="text-lg font-bold">Secure Payment</h5>
                  <p className="text-sm text-gray-600">All Cards Accepted</p>
                </div>
              </div>
            </div>
            <p className="mt-4 mb-4">
              <strong>Description:</strong>{" "}
              {productDetails?.description || "N/A"}
            </p>
          </div>
        </div>
      )}
      {/* Product Details Section */}
      <div className="w-full md:w-5/6 mx-auto mt-3">
        <div className="p-6 bg-white rounded-lg ">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6 text-center">
            Product Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <FaTag className="text-red-500 mr-3" />
              <span className="font-medium text-gray-700">Brand:</span>
              <span className="ml-2 text-gray-600">
                {" "}
                {productDetails?.brand || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Product Name:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.product_name || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.category?.category_name || "Uncategorized"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">SKU:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.SKU || "N/A"}
              </span>
            </div>

            <div className="flex items-center">
              <span className="font-medium text-gray-700">Dimensions:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.dimensions
                  ? `${productDetails.dimensions.length} cm x ${productDetails.dimensions.width} cm x ${productDetails.dimensions.height} cm`
                  : "N/A"}
              </span>
            </div>
            <div className="flex flex-col mt-4">
              <span className="font-medium text-gray-700">
                Volumes and Prices:
              </span>
              {productDetails?.outlet?.[0]?.products?.length > 0 ? (
                <ul className="mt-2 text-gray-600">
                  {productDetails.outlet[0].products.map((product, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="mr-4">{product.volume}</span>
                      <span>₹{product.selling_price.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-600">No volumes available.</span>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Material:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.material || "N/A"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Availability:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.availability_status
                  ? "Available"
                  : "Unavailable"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Discount:</span>
              <span className="ml-2 text-gray-600">
                {productDetails?.discount
                  ? `${productDetails.discount}%`
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Related Products Section */}
      <div className="w-full md:w-5/6 mx-auto py-5">
        <p className="text-center text-xl lg:text-4xl font-bold mb-5 text-gray-800">
          YOU MAY ALSO LIKE
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <div
              key={product._id}
              className="rounded-lg text-center group relative overflow-hidden shadow p-2"
            >
              <img
                src={`http://localhost:3006/${product.product_image}`}
                alt={product.product_name}
                className="w-full h-64 object-cover rounded-md mb-4 cursor-pointer"
                onClick={() => navigate(`/single-product/${product._id}`)}
              />
              <p className="font-bold">{product.product_name}</p>
              <p className="font-semibold text-gray-700">
                {product.stock > 0 ? (
                  product.stock < 6 ? (
                    <span className="text-red-500">
                      Only {product.stock} left!
                    </span>
                  ) : null
                ) : (
                  <span className="text-red-500 font-bold">Out of Stock</span>
                )}
              </p>
              <div className="relative mt-5">
                <div className="absolute left-[-40%] bottom-0 flex justify-between items-center transition-all duration-700 group-hover:left-0 w-full">
                  <button
                    className={`bg-red-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full ${
                      product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      product.stock > 0 &&
                      handleAddToCart(product._id, product.lowestPrice)
                    }
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </button>
                  <p className="text-gray-900 text-sm md:text-lg font-bold">
                    ₹
                    {product.lowestPrice
                      ? product.lowestPrice.toFixed(2)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Reviews Section */}
      <div className="w-full md:w-5/6 mx-auto mt-10 mb-10">
        <h2 className="text-2xl font-bold border-b-2 pb-4 mb-6 text-center md:text-left">
          User Reviews
        </h2>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          {/* Rating Overview Section */}
          <div className="w-full md:w-1/3 bg-gray-50 shadow rounded-lg p-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-800">
                {averageRating.toFixed(1)}
                <span className="text-lg">/5</span>
              </p>
              <div className="flex justify-center mt-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < Math.round(averageRating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-500">{reviews.length} reviews</p>
            </div>
            <div className="mt-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center mb-1">
                  <span className="text-gray-700 font-medium">{star}</span>
                  <FaStar className="text-yellow-500 mx-2" />
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (reviews.filter((r) => r.rating === star).length /
                            reviews.length) *
                            100 || 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-full font-semibold hover:bg-red-700 transition"
            >
              Add Review
            </button>
          </div>

          {/* Reviews List Section */}
          <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold">Sort by:</p>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="recent">Most Recent</option>
                <option value="high">Rating: High to Low</option>
                <option value="low">Rating: Low to High</option>
              </select>
            </div>
            <div>
              {sortedReviews.slice(0, visibleReviews).map((review) => (
                <div
                  key={review._id}
                  className="bg-gray-50 shadow rounded-lg p-4 mb-4"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800">
                      {review.user.name}
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <FaStar key={i} className="text-yellow-500" />
                    ))}
                    {Array.from({ length: 5 - review.rating }, (_, i) => (
                      <FaStar key={i} className="text-gray-300" />
                    ))}
                  </div>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                </div>
              ))}
              {visibleReviews < sortedReviews.length && (
                <button
                  onClick={handleLoadMoreReviews}
                  className="text-red-500 font-semibold mt-4 hover:underline"
                >
                  Load More
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Add Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 shadow rounded-lg p-6 mt-6">
            <h3 className="text-xl font-semibold mb-4">Add Your Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="flex gap-2 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={`cursor-pointer ${
                      newReview.rating > i ? "text-yellow-500" : "text-gray-300"
                    }`}
                    onClick={() =>
                      setNewReview({ ...newReview, rating: i + 1 })
                    }
                  />
                ))}
              </div>
              <textarea
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                rows="4"
                className="w-full p-2 border rounded"
                placeholder="Write your review here..."
                required
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
      );
      <ToastContainer />
    </div>
  );
};

export default SingleProduct;
