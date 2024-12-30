import React, { useContext, useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { CiMenuFries } from "react-icons/ci";
import { AuthContext } from "../../components/AuthContext";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GiCancel } from "react-icons/gi";

import logo from "../../assets/logo/logo.png";

const Header = () => {
  const { isLoggedIn, user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isLoggedIn) return; // Skip fetching if the user is not logged in
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3006/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: (status) => status === 200 || status === 404, // Treat 404 as valid status
        });

        // If 404 is returned, set cartItems as empty array
        if (response.status === 404) {
          setCartItems([]);
        } else {
          setCartItems(response.data.items || []);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error.message);
        setCartItems([]); // Fallback to empty cart items
      }
    };

    fetchCartItems();
  }, [isLoggedIn]);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  const openSearchModal = () => {
    setIsSearchOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      try {
        navigate(`/search?q=${searchTerm}`);
      } catch (error) {
        console.error("Search error:", error);
      }
    }
    setIsSearchOpen(false);
  };

  const handleMyAccountClick = () => {
    if (isLoggedIn && user?.role) {
      // Navigate based on user's role
      switch (user.role) {
        case "superadmin":
          navigate(`/superadmin-dashboard/${user.id}`);
          break;
        case "admin":
          navigate(`/admin-dashboard/${user.id}`);
          break;
        case "employee":
          navigate(`/employee-dashboard/${user.id}`);
          break;
        case "outlet":
          navigate(`/outlet-dashboard/${user.id}`);
          break;
        case "vendor":
          navigate(`/vendor-dashboard/${user.id}`);
          break;
        case "user":
          navigate(`/user-dashboard/${user.id}`);
          break;
        default:
          navigate(`/user-dashboard/${user.id}`); // Default to user dashboard
      }
    } else {
      navigate("/my-account"); // Redirect to login and register page
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); // Clear token
    setUser(null); // Clear user context
    setIsLoggedIn(false); // Reset login state
    navigate("/my-account"); // Redirect to login
  };

  return (
    <>
      <nav className="flex items-center justify-between p-4 sm:w-full lg:w-5/6 mx-auto relative z-[2000] border-b">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-20 h-20" />
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-10">
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-800 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-800 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Shop
            </NavLink>
          </li>
          {/* <li>
    <NavLink
      to="/about-us"
      className={({ isActive }) =>
        `text-lg font-bold transition duration-300 ${
          isActive
            ? "text-red-800 border-b-2 border-red-800"
            : "text-black hover:text-red-800 hover:border-b-2 hover:border-red-800"
        }`
      }
    >
      About Us
    </NavLink>
  </li> */}
          <li>
            <NavLink
              to="/our-story"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-700 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Our Story
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/all-blogs"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-700 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Blog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/testimonials"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-800 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Testimonials
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact-us"
              className={({ isActive }) =>
                `text-lg font-bold transition duration-300 ${
                  isActive
                    ? "text-red-800 border-b-2 border-red-800"
                    : "text-black hover:text-red-800 hover:border-b-2 hover:border-red-800"
                }`
              }
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-6">
          {/* My Account Link */}
          <button
            onClick={handleMyAccountClick}
            className="hidden md:flex text-black font-bold text-lg"
          >
            My Account
          </button>

          {/* Search Icon */}
          <button onClick={openSearchModal} className="text-black">
            <AiOutlineSearch size={20} />
          </button>

          {/* Cart Icon */}
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <button className="text-black relative">
              <HiOutlineShoppingBag size={24} />
              {isLoggedIn && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2">
                  {totalQuantity}
                </span>
              )}
            </button>
            {isCartOpen && isLoggedIn && (
              <div
                className="absolute right-0  w-80 bg-white shadow-lg rounded-lg p-4 animate-fade-in z-[2001]"
                style={{ top: "100%" }}
              >
                {cartItems.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex items-center justify-between"
                        >
                          <img
                            src={`http://localhost:3006/${item.product.product_image}`}
                            alt={item.product.product_name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 ml-4">
                            <p className="text-sm font-bold">
                              {item.product.product_name}
                            </p>
                            <p className="text-sm">
                              {item.quantity} × ₹{item.priceAtPurchase}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <hr className="my-4" />
                    <div className="flex flex-col justify-between items-center">
                      <a
                        href="/cart"
                        className="px-4 py-2 w-full border border-black rounded-md text-sm font-bold hover:bg-gray-100 text-center mt-2 mb-2"
                      >
                        View Cart
                      </a>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-sm text-gray-500">
                    Your cart is empty.
                  </p>
                )}
              </div>
            )}
          </div>

          <button className="text-black md:hidden">
            <CiMenuFries size={24} />
          </button>
        </div>
      </nav>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[3000] flex items-center justify-center">
          <div className="relative rounded-lg p-6 w-11/12 max-w-lg animate-fade-in">
            <button
              onClick={closeSearchModal}
              className="absolute top-4 right-4 text-red-700 text-xl transform translate-x-full animate-slide-in-right"
            >
              <GiCancel />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for blogs..."
              className="w-full px-4 py-2  rounded-full"
            />
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSearch}
                className="bg-red-500 text-white px-4 py-2 rounded-pill font-bold"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
