import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { GetOrdersService } from "../../services/OrderService";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from 'jspdf-autotable';

function Dashboard() {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-5">Dashboard Overview</h2>

            <div className="row mb-4">
                <div className="col-md-6 mb-4">
                    <RevenueCard />
                </div>
                <div className="col-md-6 mb-4">
                    <OrdersCard />
                </div>
            </div>
        </div>
    );
}

function RevenueCard() {
    const [orders, setOrders] = useState({ data: [] });
    // Call the API to fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await GetOrdersService();
                if (response.success) {
                    setOrders({ data: response.data });
                }
            } catch (error) {
                console.log("Error fetching orders: ", error);
            }
        };
        fetchOrders();
    }, []);

    console.log(orders);


    const completedOrders = orders.data.filter((order: { status: string }) => order.status === "Completed");

    const ordersByMonth = completedOrders.reduce((acc: { [key: number]: { orderDate: string; totalAmount: number }[] }, order: { orderDate: string; totalAmount: number }) => {
        const month = new Date(order.orderDate).getMonth() + 1;
        acc[month] = acc[month] || [];
        acc[month].push(order);
        return acc;
    }, {});

    const monthsWithOrders = Object.keys(ordersByMonth).filter(month => ordersByMonth[Number(month)].length > 0);

    const monthlyRevenue = monthsWithOrders.map(month => {
        const totalRevenue = ordersByMonth[Number(month)].reduce((acc: number, order) => acc + order.totalAmount, 0);
        return totalRevenue;
    });

    const labels = monthsWithOrders.map(month => {
        const date = new Date(2024, Number(month) - 1, 1);
        return date.toLocaleString('default', { month: 'short' });
    });

    const data = {
        labels,
        datasets: [{
            label: "Revenue",
            data: monthlyRevenue,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    };

    const exportRevenueReport = () => {
        const pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });

        pdf.text("Revenue Report", pdf.internal.pageSize.getWidth() / 2, 20);

        autoTable(pdf, {
            head: [['Month', 'Revenue']],
            body: data.labels.map((label, index) => [label, data.datasets[0].data[index]]),
            startY: 40,
        });

        pdf.save('revenue_report.pdf');
    };


    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Revenue Overview</h5>
            <Line data={data} />
            <button className="btn btn-sm btn-primary m-4" onClick={exportRevenueReport}>Export Report</button>
        </div>
    );
}



function OrdersCard() {
    const [ordersData, setOrdersData] = useState({
        labels: ["Pending", "Processing", "Cancelled", "Completed"],
        datasets: [
            {
                label: "Number of Orders",
                data: [0, 0, 0, 0],
                backgroundColor: ["#ffce56", "#36a2eb", "#ff6384", "#4caf50"],
                borderColor: ['#ffce56', '#36a2eb', '#ff6384', '#4caf50'],
                borderWidth: 1
            }
        ]
    });
    // Call the API to fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await GetOrdersService();
                if (response.success) {
                    const orderStatusCounts = {
                        Pending: 0,
                        Processing: 0,
                        Cancelled: 0,
                        Completed: 0,
                    };

                    for (const order of response.data as { status: 'Pending' | 'Processing' | 'Cancelled' | 'Completed' }[]) {
                        orderStatusCounts[order.status] += 1;
                    }

                    const updatedData = {
                        ...ordersData,
                        datasets: [
                            {
                                ...ordersData.datasets[0],
                                data: [
                                    orderStatusCounts.Pending,
                                    orderStatusCounts.Processing,
                                    orderStatusCounts.Cancelled,
                                    orderStatusCounts.Completed,
                                ],
                            },
                        ],
                    };

                    setOrdersData(updatedData);
                }
            } catch (error) {
                console.log("Error fetching orders: ", error);
            }
        };
        fetchOrders();
    }, []);

    const exportOrdersReport = () => {
        const pdf = new jsPDF();

        pdf.text("Orders Report", pdf.internal.pageSize.getWidth() / 2, 20);

        autoTable(pdf, {
            head: [['Status', 'Number of Orders']],
            body: ordersData.labels.map((label, index) => [label, ordersData.datasets[0].data[index]]),
            startY: 40
        });

        pdf.save('orders_report.pdf');
    };


    return (
        <div className="card shadow-sm p-4">
            <h5 className="card-title">Order Status Overview</h5>
            <Bar data={ordersData} />
            <button className="btn btn-sm btn-primary m-4" onClick={exportOrdersReport}>Export Report</button>
        </div>
    );
}


export default Dashboard;

