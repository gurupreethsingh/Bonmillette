import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";

import Footer from "./components/common_components/Footer";
import Header from "./components/common_components/Header";
import Homepage from "./pages/common_pages/Homepage";
import AboutUs from "./pages/common_pages/AboutUs";
import ContactUs from "./pages/contact_pages/ContactUs";
import PageNotFound from "./pages/common_pages/PageNotFound";
import AllProducts from "./pages/shop_pages/AllProducts";
import SingleProduct from "./pages/shop_pages/SingleProduct";
import OurStory from "./pages/common_pages/OurStory";

// blog pages
import AddBlog from "./pages/blog_pages/AddBlog";
import AllBlogs from "./pages/blog_pages/AllBlogs";
import SingleBlog from "./pages/blog_pages/SingleBlog";

import AllTestimonials from "./pages/testimonial_pages/AllTestimonials";
import PrivacyPolicy from "./pages/common_pages/PrivacyPolicy";
import Cart from "./pages/cart_pages/Cart";
import Checkout from "./pages/cart_pages/Checkout";
import MyAccount from "./pages/user_pages/MyAccount";
import Register from "./pages/user_pages/Register";
import UserDashboard from "./pages/user_pages/UserDashboard";
import Addresses from "./pages/user_pages/Addresses";
import PrivateRoutes from "./components/auth_components/PrivateRoutes";
import Orders from "./pages/user_pages/Orders";
import EditAccount from "./pages/user_pages/EditAccount";
import ForgotPassword from "./pages/user_pages/ForgotPassword";
import ResetPassword from "./pages/user_pages/ResetPassword";
import Profile from "./pages/user_pages/Profile";
import UpdateProfile from "./pages/user_pages/UpdateProfile";
import UpdateShippingAddress from "./pages/user_pages/UpdateShippingAddress";
import PrivateRoute from "./components/auth_components/PrivateRoutes";

// messages pages.
import AllMessages from "./pages/contact_pages/AllMessages";
import ReplyMessage from "./pages/contact_pages/ReplyMessage";
import AllReplies from "./pages/contact_pages/AllReplies";
import SuperadminDashboard from "./pages/super_admin_pages/SuperadminDashboard";
import AllUsers from "./pages/user_pages/AllUsers";
import AllCustomers from "./pages/customer_pages/AllCustomers";
import AllEmployees from "./pages/employee_pages/AllEmployees";
import AllSuperadmins from "./pages/super_admin_pages/AllSuperadmins";
import AllAdmins from "./pages/admin_pages/AllAdmins";
import Subscriptions from "./pages/subscription_pages/Subscriptions";

// categoty pages
import AddCategory from "./pages/category_pages/AddCategory";
import AllCategories from "./pages/category_pages/AllCategories";
import SingleCategory from "./pages/category_pages/SingleCategory";
import CategoryAllProducts from "./pages/category_pages/CategoryAllProducts";

//product pages
import AddProduct from "./pages/product_pages/AddProduct";
import AllAddedProducts from "./pages/product_pages/AllAddedProducts";
import SingleAddedProduct from "./pages/product_pages/SingleAddedProduct";

// orders routes.
import AllOrders from "./pages/order_pages/AllOrders";
import UserOrders from "./pages/order_pages/UserOrders";
import UpdateOrder from "./pages/order_pages/UpdateOrder";
import MyOrders from "./pages/order_pages/MyOrders";
import SingleOrderDetails from "./pages/order_pages/SingleOrderDetails";
import AdminDashboard from "./pages/admin_pages/AdminDashboard";
import EmployeeDashboard from "./pages/employee_pages/EmployeeDashboard";

// issues.
import AddIssue from "./pages/issue_pages/AddIssue";
import AllIssues from "./pages/issue_pages/AllIssues";
import SingleIssue from "./pages/issue_pages/SingleIssue";
import AssignedTasks from "./pages/issue_pages/AssignedTasks";

// all outlets routes.
import AddOutlet from "./pages/outlet_pages/AddOutlet";
import AllOutlets from "./pages/outlet_pages/AllOutlets";
import SingleOutlet from "./pages/outlet_pages/SingleOutlet";

// order analysis.
import OrderAnalysis from "./pages/order_analytics_pages/OrderAnalysis";
import SalesAnalysis from "./pages/order_analytics_pages/SalesAnalysis";
import ProductPurchaseHistory from "./pages/product_pages/ProductPurchaseHistory";
import StockAnalysis from "./pages/product_pages/StockAnalysis";

// vendor pages.
import AddVendor from "./pages/vendor_pages/AddVendor";
import AllVendors from "./pages/vendor_pages/AllVendors";
import SingleVendor from "./pages/vendor_pages/SingleVendor";
import AddRawMaterialToVendor from "./pages/vendor_pages/AddRawMaterialToVendor";
import AllRawMaterials from "./pages/vendor_pages/AllRawMaterials";

// change roles.
import ChangeRoles from "./pages/super_admin_pages/ChangeRoles";

// coupon pages.
import CreateCoupon from "./pages/coupon_pages/CreateCoupon";
import AllCoupons from "./pages/coupon_pages/AllCoupons";
import SingleCoupon from "./pages/coupon_pages/SingleCoupon";

// outlet dashboard.
import OutletDashboard from "./pages/outlet_pages/OutletDashboard";

import VendorDashboard from "./pages/vendor_pages/VendorDashboard";
import SingleUser from "./pages/user_pages/SingleUser";

// return policy and terms and conditions page.
import ReturnPolicy from "./pages/common_pages/ReturnPolicy";
import TermsAndConditions from "./pages/common_pages/TermsAndConditions";

// delivery routes.
import AssignOrderForDelivery from "./pages/delivery_person_pages/AssignOrderForDelivery";

// Page title handler
const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} - Bonmillette`;

    const setFavicon = (iconPath) => {
      const link = document.querySelector("link[rel~='icon']");
      if (link) {
        link.href = iconPath;
      } else {
        const newLink = document.createElement("link");
        newLink.rel = "icon";
        newLink.href = iconPath;
        document.head.appendChild(newLink);
      }
    };

    setFavicon("/favicon.ico");
  }, [title]);

  return null;
};

const TitleUpdater = () => {
  const getPageTitle = (pathname) => {
    if (pathname === "/" || pathname === "/home" || pathname === "/homepage") {
      return "Homepage";
    } else if (pathname === "/contact-us") {
      return "Contact Us";
    } else if (pathname === "/about-us") {
      return "About Us";
    } else if (pathname === "/shop") {
      return "Shop";
    } else if (pathname === "/our-story") {
      return "Our Story";
    } else if (pathname === "/all-blogs") {
      return "All Blogs";
    } else if (pathname.startsWith("/single-blog/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Blog - ${id}`;
    } else if (pathname === "/testimonials") {
      return "Testimonials";
    } else if (pathname === "/privacy-policy") {
      return "Privacy Policy";
    } else if (pathname === "/my-account") {
      return "My Account";
    } else if (pathname === "/register") {
      return "Register";
    } else if (pathname === "/add-blog") {
      return "Add Blog";
    } else if (pathname === "/all-blogs") {
      return "All Blogs";
    } else if (pathname.startsWith("/single-product/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single pruduct - ${id}`;
    } else if (pathname === "/cart") {
      return "Cart";
    } else if (pathname.startsWith("/checkout/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Checkout - ${id}`;
    } else if (pathname.startsWith("/user-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `User Dashboard - ${id}`;
    } else if (pathname.startsWith("/orders/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Orders - ${id}`;
    } else if (pathname.startsWith("/addresses/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Addressses - ${id}`;
    } else if (pathname.startsWith("/edit-account/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Edit Account - ${id}`;
    } else if (pathname === "/forgot-password") {
      return `Forgot-Password`;
    } else if (pathname === "/reset-password/") {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Reset-Password - ${id}`;
    } else if (pathname === "/profile/") {
      const id = pathname.split("/")[2]; // Extract the ID
      return `profile - ${id}`;
    } else if (pathname.startsWith("/update-profile/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Update Profile - ${id}`;
    } else if (pathname.startsWith("/update-shipping-address/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Update Shipping Address - ${id}`;
    } else if (pathname.startsWith("/all-messages")) {
      return `All Messages`;
    } else if (pathname.startsWith("/reply-message/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Reply-Message - ${id}`;
    } else if (pathname.startsWith("/all-replies")) {
      return `All Replies`;
    } else if (pathname.startsWith("/superadmin-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Superadmin Dashboard - ${id}`;
    } else if (pathname.startsWith("/vendor-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Vendor Dashboard - ${id}`;
    } else if (pathname.startsWith("/admin-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Admin Dashboard - ${id}`;
    } else if (pathname.startsWith("/outlet-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Outlet Dashboard - ${id}`;
    } else if (pathname.startsWith("/employee-dashboard/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Employee Dashboard - ${id}`;
    } else if (pathname.startsWith("/all-users")) {
      return `All Users`;
    } else if (pathname.startsWith("/all-customers")) {
      return `All Customers`;
    } else if (pathname.startsWith("/all-employees")) {
      return `All Employees`;
    } else if (pathname.startsWith("/all-superadmins")) {
      return `All Superadmins`;
    } else if (pathname.startsWith("/all-admins")) {
      return `All Admins`;
    } else if (pathname === "/all-subscriptions") {
      return "All Subscriptions";
    } else if (pathname === "/add-category") {
      return "Add Category";
    } else if (pathname === "/all-categories") {
      return "All Categories";
    } else if (pathname.startsWith("/single-category/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Category - ${id}`;
    } else if (pathname === "/add-product") {
      return "Add Product";
    } else if (pathname === "/all-added-products") {
      return "All Added Products";
    } else if (pathname.startsWith("/single-added-product/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Added Product - ${id}`;
    } else if (pathname === "/all-orders") {
      return "All Orders";
    } else if (pathname.startsWith("/all-user-orders/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `All User Orders - ${id}`;
    } else if (pathname.startsWith("/update-order/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Update Order - ${id}`;
    } else if (pathname.startsWith("/my-orders/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `My Orders - ${id}`;
    } else if (pathname.startsWith("/single-order-details/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Order Details - ${id}`;
    } else if (pathname === "/add-issue") {
      return "Add Issue";
    } else if (pathname === "/all-issues") {
      return "All Issues";
    } else if (pathname.startsWith("/single-issue/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Issue - ${id}`;
    } else if (pathname.startsWith("/assigned-issue/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Assigned Issue - ${id}`;
    } else if (pathname === "/add-outlet") {
      return "Add Outlet";
    } else if (pathname === "/all-outlets") {
      return "All Outlets";
    } else if (pathname.startsWith("/single-outlet/")) {
      const id = pathname.split("/")[2]; // Extract the ID
      return `Single Outlet - ${id}`;
    } else if (pathname === "/get-order-analysis") {
      return "Order Analysis";
    } else if (pathname === "/get-sales-analysis") {
      return "Sales Analysis";
    } else if (pathname === "/product-purchase-history") {
      return "Product Purchase History";
    } else if (pathname === "/get-stock-analysis") {
      return "Stock Analysis";
    } else if (pathname === "/add-vendor") {
      return "Add Vendor";
    } else if (pathname === "/all-vendors") {
      return "All Vendors";
    } else if (pathname.startsWith("/single-vendor/")) {
      const id = pathname.split("/")[2];
      return `Single Vendor - ${id}`;
    } else if (pathname === "/add-raw-material-to-vendor") {
      return "Add Raw Material To Vendor";
    } else if (pathname === "/all-raw-materials") {
      return "All Raw Materials";
    } else if (pathname === "/change-roles") {
      return "Change Roles";
    } else if (pathname === "/create-coupon") {
      return "Create Coupon";
    } else if (pathname === "/all-coupons") {
      return "All Coupons";
    } else if (pathname.startsWith("/single-coupon/")) {
      const id = pathname.split("/")[2];
      return `Single Coupon - ${id}`;
    } else if (pathname === "/return-policy") {
      return "Return Policy";
    } else if (pathname === "/terms-and-conditions") {
      return "Terms And Conditions";
    } else if (pathname === "/assign-order-for-delivery") {
      return "Assing Order For Delivery";
    } else {
      return "Page Not Found";
    }
  };

  const pageTitle = getPageTitle(window.location.pathname);

  return <PageTitle title={pageTitle} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleUpdater />
        <Header />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/shop" element={<AllProducts />} />
          <Route path="/single-product/:id" element={<SingleProduct />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/all-blogs" element={<AllBlogs />} />
          <Route path="/single-blog/:id" element={<SingleBlog />} />
          <Route path="/testimonials" element={<AllTestimonials />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/cart" element={<Cart />} />

          {/* MyAccount Routes */}
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/login" element={<MyAccount />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/user-dashboard/:id"
            element={
              <PrivateRoutes>
                <UserDashboard />
              </PrivateRoutes>
            }
          />
          <Route
            path="/addresses/:id"
            element={
              <PrivateRoutes>
                <Addresses />
              </PrivateRoutes>
            }
          />
          <Route
            path="/checkout/:id"
            element={
              <PrivateRoutes>
                <Checkout />
              </PrivateRoutes>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <PrivateRoutes>
                <Orders />
              </PrivateRoutes>
            }
          />

          <Route
            path="/edit-account/:id"
            element={
              <PrivateRoutes>
                <EditAccount />
              </PrivateRoutes>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            path="/profile/:id"
            element={
              <PrivateRoutes>
                <Profile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/update-profile/:id"
            element={
              <PrivateRoutes>
                <UpdateProfile />
              </PrivateRoutes>
            }
          />

          <Route
            path="/update-shipping-address/:id"
            element={
              <PrivateRoutes>
                <UpdateShippingAddress />
              </PrivateRoutes>
            }
          />

          <Route
            path="/add-blog"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddBlog />
              </PrivateRoute>
            }
          />

          {/* Contact and message reply routes */}

          <Route
            path="/all-messages"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllMessages />
              </PrivateRoute>
            }
          />
          <Route
            path="/reply-message/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <ReplyMessage />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-replies"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllReplies />
              </PrivateRoute>
            }
          />

          <Route
            path="/superadmin-dashboard/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SuperadminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin-dashboard/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin", "admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/employee-dashboard/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin", "employee"]}>
                <EmployeeDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/outlet-dashboard/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin", "outlet"]}>
                <OutletDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-users"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-user/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SingleUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-customers"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllCustomers />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-employees"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllEmployees />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-superadmins"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllSuperadmins />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-admins"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllAdmins />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-subscriptions"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <Subscriptions />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-category"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddCategory />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-categories"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllCategories />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-category/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SingleCategory />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-product"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddProduct />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-added-products"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllAddedProducts />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-added-product/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SingleAddedProduct />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-orders"
            element={
              <PrivateRoute allowedRoles={["superadmin", "outlet"]}>
                <AllOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-user-orders/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin", "outlet"]}>
                <UserOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/update-order/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin", "outlet"]}>
                <UpdateOrder />
              </PrivateRoute>
            }
          />

          <Route
            path="/my-orders/:id"
            element={
              <PrivateRoute
                allowedRoles={[
                  "superadmin",
                  "user",
                  "vendor",
                  "employee",
                  "outlet",
                ]}
              >
                <MyOrders />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-order-details/:id"
            element={
              <PrivateRoute
                allowedRoles={[
                  "superadmin",
                  "admin",
                  "user",
                  "vendor",
                  "employee",
                  "outlet",
                ]}
              >
                <SingleOrderDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-issue"
            element={
              <PrivateRoute
                allowedRoles={[
                  "superadmin",
                  "admin",
                  "user",
                  "vendor",
                  "employee",
                ]}
              >
                <AddIssue />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-issues"
            element={
              <PrivateRoute
                allowedRoles={[
                  "superadmin",
                  "admin",
                  "user",
                  "vendor",
                  "employee",
                ]}
              >
                <AllIssues />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-issue/:id"
            element={
              <PrivateRoute
                allowedRoles={["superadmin", "user", "vendor", "employee"]}
              >
                <SingleIssue />
              </PrivateRoute>
            }
          />

          <Route
            path="/assigned-issue/:id"
            element={
              <PrivateRoute
                allowedRoles={["superadmin", "admin", "vendor", "employee"]}
              >
                <AssignedTasks />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-outlet"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddOutlet />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-outlets"
            element={
              <PrivateRoute allowedRoles={["superadmin", "admin"]}>
                <AllOutlets />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-outlet/:outletId"
            element={
              <PrivateRoute allowedRoles={["superadmin", "admin"]}>
                <SingleOutlet />
              </PrivateRoute>
            }
          />

          <Route
            path="/get-order-analysis"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <OrderAnalysis />
              </PrivateRoute>
            }
          />

          <Route
            path="/get-sales-analysis"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SalesAnalysis />
              </PrivateRoute>
            }
          />

          <Route
            path="/get-stock-analysis"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <StockAnalysis />
              </PrivateRoute>
            }
          />

          <Route
            path="/product-purchase-history"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <ProductPurchaseHistory />
              </PrivateRoute>
            }
          />

          {/* vendor routes.  */}

          <Route
            path="/vendor-dashboard/:vendorId"
            element={
              <PrivateRoute allowedRoles={["superadmin", "vendor"]}>
                <VendorDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-vendor"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddVendor />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-vendors"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllVendors />
              </PrivateRoute>
            }
          />

          <Route
            path="/single-vendor/:vendorId"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SingleVendor />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-raw-material-to-vendor"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AddRawMaterialToVendor />
              </PrivateRoute>
            }
          />

          <Route
            path="/all-raw-materials"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllRawMaterials />
              </PrivateRoute>
            }
          />
          <Route
            path="/change-roles"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <ChangeRoles />
              </PrivateRoute>
            }
          />

          {/* create coupon  */}
          <Route
            path="/create-coupon"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <CreateCoupon />
              </PrivateRoute>
            }
          />

          {/* fetch all  coupon  */}
          <Route
            path="/all-coupons"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <AllCoupons />
              </PrivateRoute>
            }
          />

          {/* fetch single coupon  */}
          <Route
            path="/single-coupon/:id"
            element={
              <PrivateRoute allowedRoles={["superadmin"]}>
                <SingleCoupon />
              </PrivateRoute>
            }
          />

          {/* assing order for delivery  /assign-order-for-delivery */}
          <Route
            path="/assign-order-for-delivery"
            element={
              <PrivateRoute allowedRoles={["superadmin", "outlet"]}>
                <AssignOrderForDelivery />
              </PrivateRoute>
            }
          />

          {/* Catch-All */}
          <Route path="/*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
