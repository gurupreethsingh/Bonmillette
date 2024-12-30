import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import * as XLSX from "xlsx";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const OrderAnalysis = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [orderCounts, setOrderCounts] = useState({
    totalOrders: 0,
    weeklyOrders: 0,
    monthlyOrders: 0,
    yearlyOrders: 0,
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:3006/api/get-order-analysis",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data.orders);
        calculateOrderCounts(data.orders);
        processMonthlyData(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const calculateOrderCounts = (orders) => {
    const now = new Date();
    const weeklyOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) > new Date(now.setDate(now.getDate() - 7))
    ).length;
    const monthlyOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) > new Date(now.setMonth(now.getMonth() - 1))
    ).length;
    const yearlyOrders = orders.filter(
      (order) =>
        new Date(order.createdAt) >
        new Date(now.setFullYear(now.getFullYear() - 1))
    ).length;

    setOrderCounts({
      totalOrders: orders.length,
      weeklyOrders,
      monthlyOrders,
      yearlyOrders,
    });
  };

  const processMonthlyData = (orders) => {
    const monthlyCounts = Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlyCounts[month] += 1;
    });

    setMonthlyData(monthlyCounts);
  };

  const generateExcelReport = () => {
    if (orders.length === 0) {
      alert("No data available to generate a report.");
      return;
    }

    const worksheetData = [
      ["Metric", "Count"],
      ["Total Orders", orderCounts.totalOrders],
      ["Weekly Orders", orderCounts.weeklyOrders],
      ["Monthly Orders", orderCounts.monthlyOrders],
      ["Yearly Orders", orderCounts.yearlyOrders],
      [],
      ["Month", "Orders"],
      ...monthlyData.map((count, index) => [
        new Date(2000, index).toLocaleString("default", { month: "long" }),
        count,
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Analysis");

    XLSX.writeFile(workbook, "OrderAnalysisReport.xlsx");
  };

  const pieChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        data: monthlyData,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  return (
    <div className="flex flex-col bg-white mt-5 mb-5">
      <div className="flex-grow flex flex-col md:flex-row justify-between w-full md:w-5/6 mx-auto py-6 px-4">
        {/* Left Section */}
        <div className="w-full md:w-1/5 mb-6 md:mb-0">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Navigation
          </h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/superadmin-dashboard"
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
                to="/get-sales-analysis"
                className="text-gray-600 hover:text-blue-500 font-medium flex items-center gap-2 p-2"
              >
                📊 Sales Analysis
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.clear();
                  navigate("/my-account");
                }}
                className="text-red-500 hover:text-red-700 font-medium flex items-center gap-2"
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-4/5">
          <div className="flex justify-end space-x-4 mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={generateExcelReport}
            >
              Download Excel Report
            </Button>
          </div>

          {/* Bar Chart */}
          <div className="mb-6">
            <BarChart
              series={[{ data: monthlyData }]}
              height={290}
              xAxis={[
                {
                  data: [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  scaleType: "band",
                },
              ]}
              margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            />
          </div>

          {/* Responsive Pie Chart */}
          <Box sx={{ maxWidth: "400px", margin: "0 auto" }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Monthly Orders Distribution
            </Typography>
            <Pie data={pieChartData} />
          </Box>

          {/* Cards */}
          <div className="flex flex-wrap justify-around mt-6">
            <Card style={{ minWidth: 200, margin: 10 }}>
              <CardContent>
                <Typography variant="h6">Total Orders</Typography>
                <Typography variant="h4" color="primary">
                  {orderCounts.totalOrders}
                </Typography>
              </CardContent>
            </Card>
            <Card style={{ minWidth: 200, margin: 10 }}>
              <CardContent>
                <Typography variant="h6">Weekly Orders</Typography>
                <Typography variant="h4" color="secondary">
                  {orderCounts.weeklyOrders}
                </Typography>
              </CardContent>
            </Card>
            <Card style={{ minWidth: 200, margin: 10 }}>
              <CardContent>
                <Typography variant="h6">Monthly Orders</Typography>
                <Typography variant="h4" color="success">
                  {orderCounts.monthlyOrders}
                </Typography>
              </CardContent>
            </Card>
            <Card style={{ minWidth: 200, margin: 10 }}>
              <CardContent>
                <Typography variant="h6">Yearly Orders</Typography>
                <Typography variant="h4" color="warning">
                  {orderCounts.yearlyOrders}
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAnalysis;
