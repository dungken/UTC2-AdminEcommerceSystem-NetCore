import React from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";

function Dashboard() {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5">Dashboard Overview</h2>

            {/* Row 1: Revenue and Orders */}
            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <RevenueCard />
                </div>
                <div className="col-md-6 mb-4">
                    <OrdersCard />
                </div>
            </div>

            {/* Row 2: Customers and Inventory */}
            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <CustomersCard />
                </div>
                <div className="col-md-6 mb-4">
                    <InventoryCard />
                </div>
            </div>

            {/* Row 3: Performance Analysis */}
            <div className="row">
                <div className="col-md-12">
                    <PerformanceAnalysis />
                </div>
            </div>
        </div>
    );
}

function RevenueCard() {
    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
            {
                label: "Revenue",
                data: [12000, 19000, 30000, 50000, 45000, 60000],
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 2,
                tension: 0.3,
            },
        ],
    };

    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Revenue Overview</h5>
            <Line data={data} />
        </div>
    );
}

function OrdersCard() {
    const data = {
        labels: ["Pending", "Processing", "Shipped", "Delivered"],
        datasets: [
            {
                label: "Orders",
                data: [300, 450, 150, 500],
                backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
            },
        ],
    };

    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Order Status Overview</h5>
            <Bar data={data} />
        </div>
    );
}

function CustomersCard() {
    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Customer Metrics</h5>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    New Customers <span className="badge bg-primary rounded-pill">120</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Active Customers <span className="badge bg-success rounded-pill">850</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Total Customers <span className="badge bg-info rounded-pill">2500</span>
                </li>
            </ul>
        </div>
    );
}

function InventoryCard() {
    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Inventory Summary</h5>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Total Stock <span className="badge bg-info rounded-pill">1200</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Low Stock Alerts <span className="badge bg-danger rounded-pill">30</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Out of Stock <span className="badge bg-warning rounded-pill">15</span>
                </li>
            </ul>
        </div>
    );
}

function PerformanceAnalysis() {
    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Performance Analysis</h5>
            <p>Revenue and order analysis will be displayed here...</p>
            {/* Additional charts or data can go here */}
        </div>
    );
}

export default Dashboard;
