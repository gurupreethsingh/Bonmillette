// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Box,
//   TextField,
// } from "@mui/material";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
// } from "chart.js";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// ChartJS.register(
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title
// );

// const SalesAnalysis = () => {
//   const [salesData, setSalesData] = useState({
//     totalSales: 0,
//     monthlySales: [],
//   });
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const fetchSalesData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           "http://localhost:3006/api/get-sales-analysis",
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const data = await response.json();

//         if (data.success) {
//           const { totalSales, monthlySales } = data.salesAnalysis;

//           setSalesData({
//             totalSales,
//             monthlySales,
//           });
//         } else {
//           toast.error(data.message || "Failed to fetch sales data.");
//         }
//       } catch (error) {
//         toast.error("Error fetching sales data.");
//         console.error("Error fetching sales data:", error);
//       }
//     };

//     fetchSalesData();
//   }, []);

//   const handleFilter = (filterType) => {
//     const now = new Date();

//     switch (filterType) {
//       case "weekly":
//         setStartDate(
//           new Date(now.setDate(now.getDate() - 7)).toISOString().split("T")[0]
//         );
//         setEndDate(new Date().toISOString().split("T")[0]);
//         toast.info("Weekly filter applied.");
//         break;

//       case "monthly":
//         setStartDate(
//           new Date(now.setMonth(now.getMonth() - 1)).toISOString().split("T")[0]
//         );
//         setEndDate(new Date().toISOString().split("T")[0]);
//         toast.info("Monthly filter applied.");
//         break;

//       case "halfYearly":
//         setStartDate(
//           new Date(now.setMonth(now.getMonth() - 6)).toISOString().split("T")[0]
//         );
//         setEndDate(new Date().toISOString().split("T")[0]);
//         toast.info("Half-Yearly filter applied.");
//         break;

//       case "yearly":
//         setStartDate(
//           new Date(now.setFullYear(now.getFullYear() - 1))
//             .toISOString()
//             .split("T")[0]
//         );
//         setEndDate(new Date().toISOString().split("T")[0]);
//         toast.info("Yearly filter applied.");
//         break;

//       default:
//         toast.warning("Invalid filter type.");
//     }
//   };

//   const handleCustomDateApply = () => {
//     if (!startDate || !endDate) {
//       toast.error("Please select both start and end dates.", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     } else {
//       toast.success("Custom date filter applied!", {
//         position: "top-center",
//         autoClose: 3000,
//       });
//     }
//   };

//   const monthLabels = Array.from({ length: 12 }, (_, i) =>
//     new Date(0, i).toLocaleString("default", { month: "short" })
//   );

//   const barChartData = {
//     labels: monthLabels,
//     datasets: [
//       {
//         label: "Monthly Sales in ₹",
//         data: salesData.monthlySales || [],
//         backgroundColor: "rgba(75, 192, 192, 0.6)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 1,
//       },
//     ],
//   };

//   const lineChartData = {
//     labels: monthLabels,
//     datasets: [
//       {
//         label: "Monthly Sales Trend in ₹",
//         data: salesData.monthlySales || [],
//         fill: false,
//         borderColor: "#742774",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <Box sx={{ padding: 4, backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
//       <Typography variant="h4" textAlign="center" mb={4}>
//         Sales Analysis Dashboard
//       </Typography>
//       <ToastContainer />
//       <Grid container spacing={2} mb={4}>
//         <Grid item xs={12} md={6} lg={3}>
//           <Button
//             variant="contained"
//             color="primary"
//             fullWidth
//             onClick={() => handleFilter("weekly")}
//           >
//             Weekly
//           </Button>
//         </Grid>
//         <Grid item xs={12} md={6} lg={3}>
//           <Button
//             variant="contained"
//             color="secondary"
//             fullWidth
//             onClick={() => handleFilter("monthly")}
//           >
//             Monthly
//           </Button>
//         </Grid>
//         <Grid item xs={12} md={6} lg={3}>
//           <Button
//             variant="contained"
//             color="success"
//             fullWidth
//             onClick={() => handleFilter("halfYearly")}
//           >
//             Half-Yearly
//           </Button>
//         </Grid>
//         <Grid item xs={12} md={6} lg={3}>
//           <Button
//             variant="contained"
//             color="error"
//             fullWidth
//             onClick={() => handleFilter("yearly")}
//           >
//             Yearly
//           </Button>
//         </Grid>
//       </Grid>
//       <Box mb={4} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
//         <TextField
//           type="date"
//           label="Start Date"
//           value={startDate}
//           onChange={(e) => setStartDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//           sx={{ maxWidth: "200px" }}
//         />
//         <TextField
//           type="date"
//           label="End Date"
//           value={endDate}
//           onChange={(e) => setEndDate(e.target.value)}
//           InputLabelProps={{ shrink: true }}
//           fullWidth
//           sx={{ maxWidth: "200px" }}
//         />
//         <Button
//           variant="contained"
//           color="info"
//           onClick={handleCustomDateApply}
//           sx={{ alignSelf: "center", height: "fit-content" }}
//         >
//           Apply
//         </Button>
//       </Box>
//       <Grid container spacing={4}>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Bar Chart - Monthly Sales in ₹
//               </Typography>
//               <Bar data={barChartData} />
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card>
//             <CardContent>
//               <Typography variant="h6" gutterBottom>
//                 Line Chart - Monthly Sales Trend in ₹
//               </Typography>
//               <Line data={lineChartData} />
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default SalesAnalysis;

//

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Box,
  TextField,
} from "@mui/material";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const SalesAnalysis = () => {
  const navigate = useNavigate();
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    monthlySales: [],
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3006/api/get-sales-analysis",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        if (data.success) {
          const { totalSales, monthlySales } = data.salesAnalysis;

          setSalesData({
            totalSales,
            monthlySales,
          });
        } else {
          toast.error(data.message || "Failed to fetch sales data.");
        }
      } catch (error) {
        toast.error("Error fetching sales data.");
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const handleCustomDateApply = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      toast.success("Custom date filter applied!", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const generateExcelReport = () => {
    if (salesData.monthlySales.length === 0) {
      toast.warning("No data available to generate a report.");
      return;
    }

    const worksheetData = [
      ["Month", "Sales in ₹"],
      ...salesData.monthlySales.map((value, index) => [
        new Date(0, index).toLocaleString("default", { month: "short" }),
        value,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Analysis");

    XLSX.writeFile(workbook, "SalesAnalysisReport.xlsx");
    toast.success("Excel report generated successfully!");
  };

  const monthLabels = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "short" })
  );

  const barChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Monthly Sales in ₹",
        data: salesData.monthlySales || [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Monthly Sales Trend in ₹",
        data: salesData.monthlySales || [],
        fill: false,
        borderColor: "#742774",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Navigation Section */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                🏠 Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/get-order-analysis"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📊 Order Analysis
              </Link>
            </li>
            <li>
              <Link
                to="/sales-analysis"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📊 Sales Analysis
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/login");
                }}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content Section */}
        <div className="w-full md:w-4/5">
          <Typography variant="h4" textAlign="center" mb={4}>
            Sales Analysis Dashboard
          </Typography>
          <ToastContainer />
          <Box mb={4} sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ maxWidth: "200px" }}
            />
            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ maxWidth: "200px" }}
            />
            <Button
              variant="contained"
              color="info"
              onClick={handleCustomDateApply}
              sx={{ alignSelf: "center", height: "fit-content" }}
            >
              Apply
            </Button>
          </Box>
          <Button
            variant="contained"
            color="success"
            onClick={generateExcelReport}
            sx={{ mb: 4 }}
          >
            Download Excel Report
          </Button>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Bar Chart - Monthly Sales in ₹
                  </Typography>
                  <Bar data={barChartData} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Line Chart - Monthly Sales Trend in ₹
                  </Typography>
                  <Line data={lineChartData} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;
