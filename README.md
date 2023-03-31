# Submission for the citz-imb-full-stack-code-challenge-req97073 - Jashanpreet Singh

This repository contains the source code for a full stack web application built using React for the frontend and Node.js for the backend.

## Project Structure

## There are 2 folders in the root of the repo - `frontend` and `server`

### Frontend 
This contains the frontend code. I used React to develop the frontend.

### Server
The API is built using Node.js and Express.

## Installation

To get started, clone this repository to your local machine

Then, navigate into the cloned directory: 
```
cd <repository-name>```
```

### Frontend

The `frontend` directory contains the source code for the React frontend. To install the dependencies and start the development server, navigate to the `frontend` directory and run the following commands:

```
cd frontend
npm install
npm start
```


The frontend development server will start on `http://localhost:3001`, which you can access in your web browser.

### Backend

The `server` directory contains the source code for the Node.js backend. To install the dependencies and start the server, navigate to the `server` directory and run the following commands:

```
cd server
npm install
npm start
```


The backend server will start on `http://localhost:3000`, which you can access in your web browser. 

</br>
</br>

## Running both servers together

To run both the frontend and backend servers together, you can use the `concurrently` package to start them in parallel. First, ensure that both the frontend and backend servers are not running.

Then, from the root directory of the repository, run the following command:

```
npm run dev
```
PS: You would still need to do npm install for frontend and server folders seperately to get the node modules. but instead of running npm start twice. You could just run **`npm run dev`** in the root folder<br>

If there is a problem in running them together, you might be missing the concurrently package: 

```
npm install -g concurrently
```
</br>
</br>
</br>

# API ENDPOINTS

## Retrieve all products

Retrieves a list of products from the API with optional filters.

- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
    - `productOwner` (optional): Filter products by product owner.
    - `developerName` (optional): Filter products by developer name.
    - `scrumMaster` (optional): Filter products by scrum master.
    - `methodology` (optional): Filter products by methodology.
- **Success Response**:
    - **Code**: `200 OK`
    - **Content**: JSON array representing the list of products, filtered by the specified parameters if any.
- **Error Responses**:
    - **Code**: `404 Not Found`
    - **Content**: Error message indicating that no products were found.

```http
GET /api/products?productOwner=John%20Doe
Content-Type: application/json


[
    {
        "productNumber": 123,
        "productName": "Example Product 1",
        "productOwner": "John Doe",
        "developers": ["Jane Smith", "Bob Johnson"],
        "scrumMaster": "Sam Wilson",
        "methodology": "Agile"
    },
    {
        "productNumber": 456,
        "productName": "Example Product 2",
        "productOwner": "John Doe",
        "developers": ["Alice Brown", "Bob Johnson"],
        "scrumMaster": "Sam Wilson",
        "methodology": "Scrum"
    }
]
```


## Retrieve a Product by Product Number

Retrieves a product from the API using the product number.

- **URL**: `/api/product/:productNumber`
- **Method**: `GET`
- **URL Parameters**:
    - `productNumber` (required): The unique identifier for the product to retrieve.
- **Success Response**:
    - **Code**: `200 OK`
    - **Content**: JSON object representing the requested product.
- **Error Responses**:
    - **Code**: `404 Not Found`
    - **Content**: Error message indicating that the product with the specified ID was not found.

### Example Request

```http
GET /api/product/123
Content-Type: application/json

{
    "productNumber": 123,
    "productName": "Example Product",
    "productOwner": "John Doe",
    "developers": ["Jane Smith", "Bob Johnson"],
    "scrumMaster": "Sam Wilson",
    "methodology": "Agile"
}

```


## Create a New Product
Creates a new product and adds it to the API.

- **URL**: `/api/product`
- **Method**: `POST`
- **Request Body**: A JSON object representing the new product. The following fields are required:
    - **`productName`**: The name of the new product.
    - **`productOwner`**: The name of the product owner.
    - **`developers`**: An array of names of developers working on the product.
    - **`scrumMaster`**: The name of the scrum master.
    - **`startDate`**: The start date of the project.
    - **`methodology`**: The development methodology used for the project.
- **Success Response**:
    - **Code**: `200 OK`
    - **Content**: JSON object representing the newly created product.
- **Error Responses**:
    - **Code**: `400 Bad Request`
    - **Content**: Error message indicating that the product name already exists.
    - **Code**: `404 Not Found`
    - **Content**: Error message indicating that the request body did not pass validation.
- **Example Request**

```http
POST /api/product
Content-Type: application/json
{
    "productName": "New Product",
    "productOwner": "John Doe",
    "developers": ["Jane Smith", "Bob Johnson"],
    "scrumMaster": "Sam Wilson",
    "startDate": "2022-01-01",
    "methodology": "Agile"
}
```

- **Example Response**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "productNumber": 124,
    "productName": "New Product",
    "productOwner": "John Doe",
    "developers": ["Jane Smith", "Bob Johnson"],
    "scrumMaster": "Sam Wilson",
    "startDate": "2022-01-01",
    "methodology": "Agile"
}
```

## Update a Product
Updates an existing product in the API with the specified product number.

- **URL**: `/api/product/:productNumber`
- **Method**: `PUT`
- **URL Parameters**:
    - **productNumber** (required): The unique identifier for the product to update.
- Request Body:cJSON object containing the updated product information:
    - **productName** (required): The name of the product.
    - **productOwner** (required): The name of the product owner.
    - **developers** (required): An array of the names of the developers working on the product.
    - **scrumMaster** (required): The name of the Scrum Master overseeing the product.
    - **startDate** (optional): The start date of the product (in ISO 8601 format).
    - **methodology** (required): The methodology being used for the product development.
- **Success Response**:
    - **Code**: `200 OK`
    - **Content**: JSON object representing the updated product.
- **Error Responses**:
    - **Code**: `404 Not Found`
    - **Content**: Error message indicating that the product with the specified ID was not found.
    - **Code**: `400 Bad Request`
    - **Content**: Error message indicating that the request body was invalid.
- **Example Request**:
```http
PUT /api/product/123
Content-Type: application/json

{
    "productName": "New Product Name",
    "productOwner": "Jane Doe",
    "developers": ["John Smith", "Sara Johnson"],
    "scrumMaster": "David Wilson",
    "startDate": "2023-04-01",
    "methodology": "Scrum"
}
```

- **Example Response**

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "productNumber": 123,
    "productName": "New Product Name",
    "productOwner": "Jane Doe",
    "developers": ["John Smith", "Sara Johnson"],
    "scrumMaster": "David Wilson",
    "startDate": "2023-04-01",
    "methodology": "Scrum"
}
```
<br><br><br>











