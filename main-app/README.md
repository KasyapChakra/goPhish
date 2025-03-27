# GoPhish Main Application

This application consists of a frontend and backend component that need to be run separately.

## Prerequisites
- Node.js (v14 or higher)
- Go (v1.16 or higher)

## Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install Go dependencies:
   ```bash
   go mod tidy
   ```

3. Run the backend server:
   ```bash
   go run main.go
   ```
   The backend server should start on `http://localhost:8080` by default.

## Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend application should start on `http://localhost:3000` and open automatically in your default browser.

## Development
- The backend API will be available at `http://localhost:8080`
- The frontend development server will be available at `http://localhost:3000`
- Any changes to the frontend code will automatically reload the page
- Backend changes require manual server restart

## Troubleshooting
- If you encounter port conflicts, check if any other services are running on ports 3000 or 8080
- Ensure all dependencies are properly installed
- Check the console output for any error messages