## Overview

The Admin Ecommerce System Management is a .NET Core-based application designed to manage and administer an ecommerce platform. This system provides functionalities for managing products, orders, customers, and other administrative tasks.

## Features

- **User Management**: Manage user information including login, logout, registration, roles, and permissions.
- **Component Management**: Manage the display components of the website such as menu, sidebar, footer, buttons, typography, and colors.
- **Collection Management**: Manage banners, sliders, and advertisements.
- **Product Management**: Manage product information, categories, and all product-related details.
- **Blog Management**: Manage blog posts and articles.
- **Page Management**: Manage standalone pages like contact, about, privacy, 404, 403, 500, etc.
- **Feedback Management**: Manage customer feedback, product reviews, and ratings.
- **Customer Management**: Manage customer information and interactions.
- **Cart Management**: Manage shopping cart details.
- **Support Management**: Manage customer support and product information inquiries.
- **Dashboard**: Manage overall business metrics including revenue, profit, inventory, reports, invoices, and statistics.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dungken/UTC2-AdminEcommerceSystem-NetCore.git
   ```
2. Navigate to the project directory:
   ```bash
   cd UTC2-AdminEcommerceSystem-NetCore
   ```
3. Restore the dependencies:
   ```bash
   dotnet restore
   ```
4. Build the project:
   ```bash
   dotnet build
   ```

## Usage

1. Run the application:
   ```bash
   dotnet run
   ```
2. Open your browser and navigate to `http://localhost:5000` to access the admin dashboard.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or support, please contact [dungken.work@gmail.com](mailto:dungken.work@gmail.com).

### User Experience and Interface (UX-UI)

- Design a user-friendly interface that is easy to use on various devices (computers, mobile phones, tablets).

### Functionality

- Login/logout (integrated with third-party services: Google, Facebook, etc.).
- Create an account to log in to the website.
- Manage personal accounts (edit information, change passwords).
- User management and role-based access control (admin, staff, user,...).
- Add, edit, delete product information, product categories, featured articles, sliders, etc.
- Search, filter, and sort information and products by various criteria.
- Real-time communication between buyers and sellers.
- Integrate online payment methods for purchases.
- Send emails and product information notifications to customers.
- Generate reports, invoices, statistical charts, etc.

### Performance and Security

- Secure user information.
- Ensure fast page load speed, smooth, simple, and easy to use.

### Technology

#### Backend

- Use ASP.NET Web API to design and implement RESTful APIs for the backend of the application.

#### Frontend

- Use React JS + TypeScript.
- React JS is a popular JavaScript library for developing efficient and maintainable user interfaces.
- TypeScript ensures consistency and better code quality in the React JS project.
- HTML, CSS, JavaScript, Bootstrap, etc.

#### Database

- Use Entity Framework to interact with the database.
- Use SQL Server to manage data.

#### Security

- Integrate security solutions such as SSL/TLS encryption, secure user authentication, and input validation to protect user information.
- User authentication: Use JWT (JSON Web Tokens) or OAuth to manage sessions and secure APIs.
- Error handling and security: Ensure the API handles errors correctly and protects against common attacks like SQL Injection, XSS, CSRF, etc.

### Source Code Management

- Use Git version control system to track and manage the project's source code, and store the source code on a platform like GitHub or GitLab.

### Backup and Recovery

- Perform regular backups of the website's data and source code to ensure recovery capability after incidents.

### Other Requirements

- Browser compatibility: Ensure the website works smoothly and is compatible with popular browsers like Chrome, Firefox, Safari, and Microsoft Edge.
- Mobile compatibility: Ensure the website is responsive and works on mobile devices like phones and tablets.
