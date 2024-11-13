import React from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';
import { saveAs } from 'file-saver';

const ExportButton = () => {
    const handleExportCSV = async () => {
        try {
            const response = await axios.get('https://your-api-url/api/User/export/csv', {
                responseType: 'blob', // Expecting the file as a blob
            });
            const blob = new Blob([response.data], { type: 'text/csv' });
            saveAs(blob, 'User.csv'); // File download
        } catch (error) {
            console.error('Error exporting CSV:', error);
            alert('Failed to export CSV.');
        }
    };

    const handleExportExcel = async () => {
        try {
            const response = await axios.get('/User/Export/Excel', {
                responseType: 'blob', // Expecting the file as a blob
            });
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'User.xlsx'); // File download
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Failed to export Excel.');
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Sample user data (you can replace this with real data)
        const User = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        ];

        // Add headers
        doc.text('ID', 10, 10);
        doc.text('Name', 40, 10);
        doc.text('Email', 80, 10);
        doc.text('Role', 120, 10);

        // Add user data
        User.forEach((user, index) => {
            const yPosition = 20 + (index * 10);
            doc.text(user.id.toString(), 10, yPosition);
            doc.text(user.name, 40, yPosition);
            doc.text(user.email, 80, yPosition);
            doc.text(user.role, 120, yPosition);
        });

        // Save the PDF
        doc.save('User.pdf');
    };

    return (
        <div className="btn-group">
            <button
                className="btn btn-primary dropdown-toggle rounded"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="bx bx-export"></i> Export
            </button>
            <ul className="dropdown-menu">
                <li>
                    <a
                        className="dropdown-item"
                        href="#"
                        onClick={handleExportCSV} // Trigger CSV export
                    >
                        Export as CSV
                    </a>
                </li>
                <li>
                    <a
                        className="dropdown-item"
                        href="#"
                        onClick={handleExportExcel} // Trigger Excel export
                    >
                        Export as Excel
                    </a>
                </li>
                <li>
                    <a
                        className="dropdown-item"
                        href="#"
                        onClick={handleExportPDF} // Trigger PDF export
                    >
                        Export as PDF
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default ExportButton;
