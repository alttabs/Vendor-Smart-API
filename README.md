# VendorSmartAPI

VendorSmartAPI is a Node.js application that provides a RESTful API for managing vendors and jobs in the VendorSmart system. The application is built using TypeScript, Express, and MongoDB, and is designed to be easily deployable using Docker.

## Features
- Manage vendors and jobs with CRUD operations.
- Basic authentication with `Basic Auth`.
- Rate limiting to prevent abuse.
- API documentation using Swagger.
- Docker.

## Getting-Started

### Prerequisites
- Node.js (>=14.x)
- MongoDB (>=4.x)
- Docker (optional, for containerization)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/vendorsmart-api.git
   cd vendorsmart-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and configure it based on the `.env.example` file:

   ```
   NODE_ENV=development
   HOST=127.0.0.1
   PORT=5000
   LOG_LEVEL=info
   DATA_DIR=data
   DB_URL=mongodb://localhost:27017/vendorsmart
   BASIC_AUTH_USER=vs_tech_challenge
   BASIC_AUTH_PASSWORD=SuperSecurePassword123@
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`.

## Environment Variables

The application relies on the following environment variables:

- `NODE_ENV`: The environment mode (`development`, `production`).
- `HOST`: The host address (default `127.0.0.1`).
- `PORT`: The port the server runs on (default `5000`).
- `LOG_LEVEL`: The level of logging (`info`, `error`, etc.).
- `DATA_DIR`: The directory for storing logs and data.
- `DB_URL`: The MongoDB connection string.
- `BASIC_AUTH_USER`: The username for Basic Auth.
- `BASIC_AUTH_PASSWORD`: The password for Basic Auth.

## Architecture

The `VendorSmartAPI` is designed using a modular and layered architecture, separation of concerns, scalability, and maintainability:

### 1. **Controllers**
- **Location**: `src/controllers`
- **Purpose**: Controllers are responsible for handling incoming HTTP requests, processing them, and returning the appropriate HTTP responses. They serve as the entry point for API requests and delegate business logic to the services layer.

### 2. **Models**
- **Location**: `src/models`
- **Purpose**: Models define the data structure and schema for your application entities using Mongoose. They map the application’s data to the MongoDB collections and provide an abstraction over the database layer.

### 3. **Routes**
- **Location**: `src/routes`
- **Purpose**: Routes map incoming HTTP requests to the appropriate controller methods.

### 4. **Services**
- **Location**: `src/services`
- **Purpose**: The services layer contains the business logic of the application. 

### 5. **Middleware**
- **Location**: `src/middleware`
- **Purpose**: Middleware functions are used to handle cross-cutting concerns like authentication, input validation, error handling, and logging. 

### 6. **Configuration**
- **Location**: `src/config`
- **Purpose**: Configuration files manage environment-specific settings, including database connections, logging, and environment variables. 
- 
### 7. **Tests**
- **Location**: `src/__tests__`
- **Purpose**: Unit tests are used to validate the expected behavior of the application.

### 8. **Swagger Documentation**
- **Location**: Configured in `app.ts` and served at `/api/v1/docs`


### 9. **Rate Limiting**
- **Location**: Configured in `app.ts`
- **Purpose**: Rate limiting is applied to prevent abuse of the API by limiting the number of requests a single client. Is ser to set to 100 requests per 15 minutes per IP address.


### Summary:
- **Modular Design**: The architecture is modular, separating concerns across different layers (controllers, services, models) to improve maintainability and scalability.
- **RESTful API**: The application follows REST principles, providing a clear and predictable API for managing vendors and jobs.
- **Best Practices**: The use of TypeScript, proper error handling, and unit testing are incorporated to ensure a robust and reliable codebase.

