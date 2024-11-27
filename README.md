# Inventory Management System

The Inventory Management System (IMS) helps track and manage inventory levels. It provides tools for monitoring stock, managing workers, and processing shipments. Users can see inventory in real-time. The system reduces manual errors and improves efficiency. It is suitable for small to medium-sized businesses looking to improve inventory practices. The IMS aims to optimize stock availability and streamline operations.

## Features

- **Stock Management:** Track inventory levels, incoming stack and outgoing items
- **Shipment Management:** Manages creation, tracking, and delivery of shipments
- **User Management** Manages users with different roles
- **Real-time Tracking:** Monitors stock levels in real-time across multiple locations in the warehouse.
- **Barcode Scanning:** Get Item information by scanning its Barcode.


## Technologies Used

- Backend - Django
- Frontend - React-Native
- Database - PostgreSQL

## BACKEND SETUP

### Step 1: Install Requirements.txt

    It will install Django, Django rest framework, and other required packages.
    
    pip install -r requirements.txt

### Step 2: Setup Postgres

    ./setup-postgres.sh <db_name> <db_user_name> <db_user_password>

### Setp 3: Create .env file with following environment variables
    SECRET_KEY=
    ADMIN_NAME=
    ADMIN_EMAIL=
    ADMIN_PASS=
    GMAIL_EMAIL=
    GMAIL_PASSWORD=
    DB_PASSWORD=<db_user_password>
    DB_NAME=<db_name>
    DB_USER=<db_user_name>


### Step 4: Run Migrations

    python manage.py makemigrations
    python manage.py migrate

### Step 5: Populate Database

    python manage.py populate_database

### Step 6: Install redis-server

1. **Ubuntu/Debian:**
   ```bash
    sudo apt update
    sudo apt install redis-server
    ```

### Step 7: Run Server

    ./run-server.sh

## FRONTEND SETUP

### Step 1: Setup react native

    Refer to this: https://reactnative.dev/docs/set-up-your-environment

    Required Dependencies - node.js, java jdk, and android studio(for adb and some sdk tools)

### Step 2: Install Node Dependencies

    npm install 

### Step 3: Change BASE_URL oonstant

    In src/constants.js, change the BASE_URL constant to the backend server url

### Step 4: Run app

    npm start



## API Documentation

### User Endpoints

#### 1. Login

* **URL:** `/user/login/`
* **Method:** `POST`
* **Request Body:**
	+ `username`: string
	+ `password`: string
* **Response:**
	+ `message`: string
    + `refresh_token`: string
    + `access_token`: string
    + `username`: string
    + `email`: string
* **Description:** Authenticates a user and returns a JWT token.


#### 2. Refresh Token

* **URL:** `/user/refresh/`
* **Method:** `POST`
* **Request Body:**
	+ `refresh`: string
* **Response:**
	+ `access`: integer
	+ `refresh`: string
* **Description:** Refreshes access token.

#### 3. List Users

* **URL:** `/user/`
* **Method:** `GET`
* **Request Body:** None
* **Response:** List of User objects
* **Description:** Returns all the user objects

#### 4. Register User

* **URL:** `/user/register`
* **Method:** `POST`
* **Request Body:**
    + `username`: string
    + `email`: string
    + `password`: string
* **Response:**
    + `message`: string
* **Description:** Creates User object

#### 5. Delete User

* **URL:** `/user/register`
* **Method:** `POST`
* **Request Body:**
    + `user_id`: string
* **Response:**
    + `message`: string
* **Description:** Deletes User object

### Item Management Endpoints

#### 1. Add Item

* **URL:** `/item/add/`
* **Method:** `POST`
* **Request Body:**
	+ `name`: string
    + `price`: number
    + `description`:string
    + `quantity`:number
    + `category`:string
    + `minimum_stock_level`:number
    + `sku`: string
* **Response:** Item Object

* **Description:** Creates Item Object.

#### 2. List Items

* **URL:** `/item`
* **Method:** `GET`
* **Request Body:** None
* **Response:** List of Item objects

* **Description:** Lists Item objects.


#### 3. Delete Items

* **URL:** `/item/delete`
* **Method:** `DELETE`
* **Request Params:** `item_id`
* **Request Body:** None
* **Response:**
    + `message`: string

* **Description:** Delete Item object.

#### 4. Update Item

* **URL:** `/item/update/`
* **Method:** `PUT`
* **Request Body:** Item Object
* **Response:**
    + `message`: string
* **Description:** Updates an existing stock item.

#### 5. Barcode

* **URL:** `/item/barcode/`
* **Method:** `GET`
* **Request Params:** `item_id`
* **Request Body:** None
* **Response:** Barcode image
* **Description:** Returns Barcode image for the given item.

### Shipment Management Endpoints

#### 1. List All Shipments

* **URL:** `/shipment/`
* **Method:** `GET`
* **Request Body:** None
* **Response:** List of Shipments
* **Description:** Retrieves a list of all shipments.

#### 2. Create Shipment

* **URL:** `/shipment/`
* **Method:** `POST`
* **Request Body:** 
    + `type`: string,
    + `items`:[{
        `item_id`: string,
        `quantity`: number
    }]
* **Response:** Shipment Object
* **Description:** Creates Shipment.

#### 3. Assign Shipment

* **URL:** `/shipment/assign-worker`
* **Method:** `POST`
* **Request Body:**
	+ `shipment_id`: string
	+ `worker_id`: string
* **Response:** Shipment Object
* **Description:** Assigns the shipment to a worker.

#### 4. View Shipments

* **URL:** `/shipment/view`
* **Method:** `GET`
* **Request Body:** None
* **Response:** Shipment Object
* **Description:** Returns assigned shipments to the worker.

#### 5. In Progress

* **URL:** `/shipment/in-progress`
* **Method:** `POST`
* **Request Body:** 
    + `shipment_id`: string
* **Response:** Shipment Object
* **Description:** Sets the status of the shipment In Progress.


#### 6. Complete Shipment

* **URL:** `/shipment/complete`
* **Method:** `POST`
* **Request Body:** 
    + `shipment_id`: string
* **Response:** Shipment Object
* **Description:** Sets the status of the shipment to Completed.






        


