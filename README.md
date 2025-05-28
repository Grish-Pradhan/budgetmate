# Expense Tracker Backend

## Overview
This project is a backend application for an Expense Tracker, built using Node.js and MySQL. It provides user registration and authentication functionalities.

## Technologies Used
- Node.js
- Express
- MySQL
- dotenv
- bcrypt (for password hashing)
- jsonwebtoken (for authentication)

## Project Structure
```
expenses-backend
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers           # Contains controller functions for handling requests
│   │   └── authController.js # Handles user registration and authentication
│   ├── models                # Contains database models
│   │   └── userModel.js      # Defines user schema and database interactions
│   ├── routes                # Contains route definitions
│   │   └── authRoutes.js     # Defines routes for user authentication
│   └── config                # Configuration files
│       └── db.js             # Database connection setup
├── package.json              # NPM package configuration
├── .env                      # Environment variables
└── README.md                 # Project documentation
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd expenses-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your database connection details:
   ```
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints
- **POST /api/register**
  - Description: Register a new user.
  - Request Body: 
    ```json
    {
      "name": "User Name",
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```

- **POST /api/login**
  - Description: Authenticate a user and return a token.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "userpassword"
    }
    ```

## Usage Examples
- To register a new user, send a POST request to `/api/register` with the required fields.
- To log in, send a POST request to `/api/login` with the user's email and password.

## License
This project is licensed under the MIT License.