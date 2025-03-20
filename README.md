🛂 SeaBasket - E-Commerce Web App

📌 Project Description

This project focuses on developing a backend for the SeaBasket e-commerce platform. The backend will enable seamless user registration and authentication, product browsing, order processing, and user profile management. The architecture will be built using Node.js for the server-side logic, MySQL for data storage, and Git for version control. To ensure a consistent and portable development and deployment environment.

🚀 Features

✅ User authentication (JWT-based login/signup)
✅ Forgot & Reset Password functionality
✅ Product search & trending items
✅ Product listing with filtering & sorting
✅ Product details with reviews & ratings
✅ Shopping cart functionality (add/remove items, update quantity)
✅ Orders management (place, track, cancel orders)
✅ User profile management
✅ Database migrations using Liquibase


🛠 Technologies Used

Back-end: Node.js, Express.js
Database: MySQL (using Sequelize ORM)
Migrations: Liquibase
Authentication: JWT (JSON Web Token)
Version Control: Git & GitHub

📌 Prerequisites

Before setting up the project, ensure you have:

Node.js (>=14.x) → https://nodejs.org/en
MySQL installed and running
Git → https://git-scm.com/
Liquibase → https://www.liquibase.com/download
Postman for testing APIs → https://www.postman.com/downloads/

⚙️ Installation Steps

🔹 1. Clone the Repository
🔹 2. Install Dependencies
🔹 3. Setup Environment Variables
Create a .env file (ignored in .gitignore) and add:

🔹 4. Setup Database & Migrations
Ensure MySQL is running
Run Liquibase migrations

🔹 5. Start the Application

📌 Testing API Endpoints

After starting the server, you can test the REST API endpoints using Postman:

Download Postman → https://www.postman.com/downloads/

Import the API collection (if available) or manually create requests.

Example test requests:

POST /api/auth/signup

GET /api/products

POST /api/cart/add

POST /api/orders/place


🐟 License

This project is licensed under the MIT License.