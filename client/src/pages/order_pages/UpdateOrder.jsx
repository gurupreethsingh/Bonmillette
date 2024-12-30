// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { AuthContext } from "../../components/AuthContext";

// const UpdateOrder = () => {
//   const { logout } = useContext(AuthContext);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Receive order details from the previous page
//   const [order, setOrder] = useState(location.state || null);
//   const [loading, setLoading] = useState(!location.state);
//   const [error, setError] = useState(null);

//   const deliveryStatusOptions = [
//     "Pending",
//     "Shipped",
//     "Delivered",
//     "Returned",
//     "Cancelled",
//   ];

//   const dispatchStatusOptions = [
//     "Dispatched",
//     "Not Dispatched",
//     "Dispatch",
//     "Dont Dispatch",
//   ];

//   useEffect(() => {
//     console.log("Received Order from Previous Page:", location.state); // Debug
//     if (!order) {
//       const fetchOrderDetails = async () => {
//         try {
//           const token = localStorage.getItem("token");
//           if (!token) throw new Error("Unauthorized. Please log in.");

//           const response = await axios.get(
//             `http://localhost:3006/api/get-order-details-by-orderid/${id}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           );

//           if (!response.data || !response.data.order)
//             throw new Error("No order details found.");

//           const fetchedOrder = response.data.order;

//           // Ensure product details are properly mapped
//           const updatedProducts = fetchedOrder.products.map(
//             (product, index) => ({
//               ...product,
//               price_per_unit: product.price_per_unit || 0, // Use price per unit
//               total_price:
//                 product.total_price ||
//                 product.quantity * (product.price_per_unit || 0),
//             })
//           );

//           setOrder({ ...fetchedOrder, products: updatedProducts });
//         } catch (err) {
//           setError(err.message);
//           toast.error(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchOrderDetails();
//     }
//   }, [id, location.state, order]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setOrder((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleQuantityChange = (index, newQuantity) => {
//     setOrder((prevOrder) => {
//       const updatedProducts = [...prevOrder.products];
//       const product = updatedProducts[index];
//       const updatedQuantity = parseInt(newQuantity, 10) || 1;
//       product.quantity = updatedQuantity;
//       product.total_price = updatedQuantity * (product.price_per_unit || 0); // Update total price
//       return { ...prevOrder, products: updatedProducts };
//     });
//   };

//   const handleProductCancellation = (index) => {
//     setOrder((prevOrder) => {
//       const updatedProducts = prevOrder.products.filter((_, i) => i !== index);
//       return { ...prevOrder, products: updatedProducts };
//     });
//   };

//   const handleUpdateOrder = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Unauthorized. Please log in.");

//       // Prepare updated product details with only quantity, price per unit, and total price
//       const updatedProducts = order.products.map((product) => ({
//         quantity: product.quantity,
//         price_per_unit: product.price_per_unit,
//         total_price: product.total_price,
//       }));

//       // Payload to update the order
//       const payload = {
//         delivery_status: order.delivery_status,
//         dispatch_status: order.dispatch_status,
//         shipping_address: order.shipping_address,
//         products: updatedProducts, // Only send the required product details
//       };

//       const response = await axios.put(
//         `http://localhost:3006/api/update-order/${id}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         toast.success("Order updated successfully.");
//         navigate("/all-orders");
//       } else {
//         throw new Error("Failed to update order.");
//       }
//     } catch (err) {
//       console.error(err.message);
//       toast.error(err.response?.data?.message || "Failed to update order.");
//     }
//   };

//   if (loading) return <div>Loading order details...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h1 className="text-2xl font-bold mb-4">Update Order</h1>
//       <div className="bg-white p-6 shadow-md rounded-lg">
//         <div className="mb-4">
//           <label className="block font-semibold">Order ID</label>
//           <input
//             type="text"
//             value={order.orderId}
//             readOnly
//             className="border w-full p-2 rounded bg-gray-100"
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold">Delivery Status</label>
//           <select
//             value={order.delivery_status || ""}
//             name="delivery_status"
//             onChange={handleInputChange}
//             className="border w-full p-2 rounded"
//           >
//             {deliveryStatusOptions.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block font-semibold">Dispatch Status</label>
//           <select
//             value={order.dispatch_status || ""}
//             name="dispatch_status"
//             onChange={handleInputChange}
//             className="border w-full p-2 rounded"
//           >
//             {dispatchStatusOptions.map((status) => (
//               <option key={status} value={status}>
//                 {status}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <h2 className="text-xl font-semibold mb-4">Products</h2>
//           {order.products.map((product, idx) => (
//             <div
//               key={`product-${idx}`}
//               className="p-4 mb-4 bg-gray-50 rounded-lg"
//             >
//               <p>
//                 <strong>Product Name:</strong> {product.product_name || "N/A"}
//               </p>
//               <p>Price Per Unit: ₹{(product.price_per_unit || 0).toFixed(2)}</p>
//               <p>
//                 <strong>Total Price:</strong> ₹
//                 {(product.total_price || 0).toFixed(2)}
//               </p>
//               <div className="flex items-center gap-4 mt-2">
//                 <label className="font-semibold">Quantity:</label>
//                 <input
//                   type="number"
//                   min="1"
//                   value={product.quantity || 1}
//                   onChange={(e) => handleQuantityChange(idx, e.target.value)}
//                   className="border p-2 rounded w-20"
//                 />
//                 <button
//                   onClick={() => handleProductCancellation(idx)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Cancel Product
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-center mt-6">
//           <button
//             onClick={handleUpdateOrder}
//             className="bg-green-500 text-white px-6 py-2 rounded"
//           >
//             Update Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateOrder;

// //

// // import React, { useEffect, useState, useContext } from "react";
// // import { useParams, useNavigate, useLocation } from "react-router-dom";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";
// // import { AuthContext } from "../../components/AuthContext";

// // const UpdateOrder = () => {
// //   const { logout } = useContext(AuthContext);
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const [order, setOrder] = useState(location.state || null);
// //   const [loading, setLoading] = useState(!location.state);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchOrderDetails = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) throw new Error("Unauthorized. Please log in.");

// //         const orderResponse = await axios.get(
// //           `http://localhost:3006/api/get-order-details-by-orderid/${id}`,
// //           { headers: { Authorization: `Bearer ${token}` } }
// //         );

// //         if (!orderResponse.data || !orderResponse.data.order) {
// //           throw new Error("Order details not found.");
// //         }

// //         setOrder(orderResponse.data.order);
// //       } catch (err) {
// //         setError(err.message);
// //         toast.error(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     if (!order) fetchOrderDetails();
// //   }, [id, order]);

// //   const handleQuantityChange = (index, newQuantity) => {
// //     setOrder((prevOrder) => {
// //       const updatedProducts = [...prevOrder.products];
// //       const product = updatedProducts[index];
// //       const updatedQuantity = parseInt(newQuantity, 10) || 1;
// //       product.quantity = updatedQuantity;
// //       product.total_price = updatedQuantity * (product.price_per_unit || 0);
// //       return { ...prevOrder, products: updatedProducts };
// //     });
// //   };

// //   const handleProductCancellation = (index) => {
// //     setOrder((prevOrder) => {
// //       const updatedProducts = prevOrder.products.filter((_, i) => i !== index);
// //       return { ...prevOrder, products: updatedProducts };
// //     });
// //   };

// //   const handleUpdateOrder = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const token = localStorage.getItem("token");
// //       if (!token) throw new Error("Unauthorized. Please log in.");

// //       const updatedProducts = order.products.map((product) => ({
// //         product: product.product._id,
// //         sku: product.sku,
// //         product_name: product.product_name,
// //         quantity: product.quantity || 1,
// //         price_per_unit: product.price_per_unit || 0,
// //         total_price: (product.quantity || 1) * (product.price_per_unit || 0),
// //       }));

// //       const payload = {
// //         products: updatedProducts,
// //       };

// //       const response = await axios.put(
// //         `http://localhost:3006/api/update-order/${id}`,
// //         payload,
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );

// //       if (response.status === 200) {
// //         // Show success message and alert
// //         toast.success("Order updated successfully.");
// //         alert(
// //           "Customer and outlet have been informed about the update via email."
// //         );

// //         navigate("/all-orders");
// //       } else {
// //         throw new Error(response.data?.message || "Failed to update order.");
// //       }
// //     } catch (err) {
// //       toast.error(err.message || "Failed to update order.");
// //     }
// //   };

// //   if (loading) return <div>Loading order details...</div>;
// //   if (error) return <div className="text-red-500">{error}</div>;

// //   return (
// //     <div className="max-w-4xl mx-auto mt-10 mb-10">
// //       <h1 className="text-2xl font-bold mb-4">Update Order Details</h1>
// //       <div className="bg-white p-6 shadow-md rounded-lg">
// //         <div>
// //           {order.products.map((product, idx) => (
// //             <div
// //               key={`product-${idx}`}
// //               className="p-4 mb-4 bg-gray-50 rounded-lg"
// //             >
// //               <p>
// //                 <strong>Product Name:</strong> {product.product_name || "N/A"}
// //               </p>
// //               <p>SKU: {product.sku || "N/A"}</p>
// //               <p>Price Per Unit: ₹{(product.price_per_unit || 0).toFixed(2)}</p>
// //               <p>
// //                 <strong>Total Price:</strong> ₹
// //                 {(product.total_price || 0).toFixed(2)}
// //               </p>
// //               <div className="flex items-center gap-4 mt-2">
// //                 <label className="font-semibold">Quantity:</label>
// //                 <input
// //                   type="number"
// //                   min="1"
// //                   value={product.quantity || 1}
// //                   onChange={(e) => handleQuantityChange(idx, e.target.value)}
// //                   className="border p-2 rounded w-20"
// //                 />
// //                 <button
// //                   onClick={() => handleProductCancellation(idx)}
// //                   className="text-white font-bold btn btn-sm rounded-pill bg-red-500"
// //                 >
// //                   Cancel Product
// //                 </button>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="flex justify-center mt-6">
// //           <button
// //             onClick={handleUpdateOrder}
// //             className="bg-green-500 text-white px-6 py-2 rounded"
// //           >
// //             Update Order
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UpdateOrder;

//

import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../components/AuthContext";

const UpdateOrder = () => {
  const { logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized. Please log in.");

        const response = await axios.get(
          `http://localhost:3006/api/get-order-details-by-orderid/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status !== 200 || !response.data?.order) {
          throw new Error("Order details not found.");
        }

        setOrder(response.data.order);
      } catch (err) {
        console.error("Error fetching order details:", err.message || err);
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (!order) fetchOrderDetails();
  }, [id, order]);

  const handleQuantityChange = (index, newQuantity) => {
    setOrder((prevOrder) => {
      const updatedProducts = [...prevOrder.products];
      const product = updatedProducts[index];
      const updatedQuantity = parseInt(newQuantity, 10) || 1;
      product.quantity = updatedQuantity;
      product.total_price = updatedQuantity * (product.price_per_unit || 0);
      return { ...prevOrder, products: updatedProducts };
    });
  };

  const handleProductCancellation = (index) => {
    setOrder((prevOrder) => {
      const updatedProducts = prevOrder.products.filter((_, i) => i !== index);
      return { ...prevOrder, products: updatedProducts };
    });
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized. Please log in.");

      const updatedProducts = order.products.map((product) => ({
        product: product.product._id,
        sku: product.sku,
        product_name: product.product_name,
        quantity: product.quantity || 1,
        price_per_unit: product.price_per_unit || 0,
        total_price: (product.quantity || 1) * (product.price_per_unit || 0),
      }));

      const payload = { products: updatedProducts };

      const response = await axios.put(
        `http://localhost:3006/api/update-order/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Order updated successfully.");
        alert("Customer and outlet have been informed via email.");
        navigate("/all-orders");
      } else {
        throw new Error(response.data?.message || "Failed to update order.");
      }
    } catch (err) {
      console.error("Error updating order:", err.message || err);
      toast.error(err.message || "Failed to update order.");
    }
  };

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 mb-10">
      <h1 className="text-2xl font-bold mb-4">Update Order Details</h1>
      <div className="bg-white p-6 shadow-md rounded-lg">
        <div>
          {order.products.map((product, idx) => (
            <div
              key={`product-${idx}`}
              className="p-4 mb-4 bg-gray-50 rounded-lg"
            >
              <p>
                <strong>Product Name:</strong> {product.product_name || "N/A"}
              </p>
              <p>SKU: {product.sku || "N/A"}</p>
              <p>Price Per Unit: ₹{(product.price_per_unit || 0).toFixed(2)}</p>
              <p>
                <strong>Total Price:</strong> ₹
                {(product.total_price || 0).toFixed(2)}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={product.quantity || 1}
                  onChange={(e) => handleQuantityChange(idx, e.target.value)}
                  className="border p-2 rounded w-20"
                />
                <button
                  onClick={() => handleProductCancellation(idx)}
                  className="text-white font-bold btn btn-sm rounded-pill bg-red-500"
                >
                  Cancel Product
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUpdateOrder}
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateOrder;
