# KPT Calculator API

This is the backend API for the KPT Calculator application. It is built using Node.js, Express, and MongoDB. The API provides endpoints for creating, reading, and deleting customer and result data.

## Endpoints

### Customer Endpoints

- `GET /customers` - Get all customers | **Admin Only**
- `GET /customers/:id` - Get a customer by ID | **Admin Only**
- `POST /customers` - Create a new customer | **Admin Only**
- `PATCH /customers/:id` - Update a customer | **Admin Only**
- `DELETE /customers/:id` - Delete a customer | **Admin Only**

### Result Endpoints

- `GET /results` - Get all results
- `GET /results/by-date` - Get results by date
- `GET /results/search` - Search results by name
- `GET /results/:id` - Get a result by ID
- `POST /results` - Create a new result | **Admin Only**
- `PATCH /results/:id` - Update a result | **Admin Only**
- `DELETE /results/:id` - Delete a result | **Admin Only**

### Auth Endpoints

- `POST /auth/register` - User registration | **Admin Only**
- `POST /auth/login` - User login
- `POST /auth/logout/userId/:userId/token/:token` - User logout
- `DELETE /auth/delete/:id` - Account delete | **Admin Only**

### Admin Endpoints

- `GET /admin/users` - Get all users | **Admin Only**
- `GET /admin/dashboard` - Get dashboard data | **Admin Only**
- `GET /admin/results` - Get all results | **Admin Only**
- `GET /admin/customers` - Get all customers | **Admin Only**

## Authentication

The API uses JWT authentication. To authenticate, send a `POST` request to `/login` with a JSON body containing the username and password. The response will contain a JWT token that can be used to authenticate subsequent requests.

## Authorization

The API uses role-based authorization. The `isAdmin` middleware checks if the user has the `Admin` role. The `isAuth` middleware checks if the user is authenticated.

## Models

The API uses the following models:

- `Customer` - Represents a customer
- `Result` - Represents a result
- `User` - Represents a user
- `Blacklist` - Represents a blacklist of tokens

## Validations

The API uses the following validations:

- `checkName` - Checks if a name is valid
- `checkUsername` - Checks if a username is valid
- `checkNumber` - Checks if a number is valid
- `checkEnum` - Checks if a value is valid for an enum
- `checkPassword` - Checks if a password is valid
- `checkEmail` - Checks if an email is valid
- `checkMongooseId` - Checks if a Mongoose ID is valid
- `checkSearchQuery` - Checks if a search query is valid
- `checkDateFormat` - Checks if a date format is valid

## Middlewares

The API uses the following middlewares:

- `isAuth` - Checks if the user is authenticated
- `isAdmin` - Checks if the user has the `Admin` role
- `checkValidToken` - Checks if a token is valid and not blacklisted
