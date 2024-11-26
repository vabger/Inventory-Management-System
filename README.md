# Inventory Management System

The Inventory Management System (IMS) helps track and manage inventory levels. It provides tools for monitoring stock, processing orders, and generating reports. Users can see inventory in real-time. The system reduces manual errors and improves efficiency. It is suitable for small to medium-sized businesses looking to improve inventory practices. The IMS aims to optimize stock availability and streamline operations.

## Features

- **Stock Management:** Track inventory levels, incoming stack and outgoing items
- **Order Management:** Automates the creation and tracking of electronic purchase orders.
- **Real-time Tracking:** Monitors stock levels in real-time across multiple locations.
- **Barcode Scanning:** Easy scanning of items for faster inventory updates.
- **Reporting & Analytics:** Generates reports on stock levels, turnover rates, and order history(Excel file).
- **Multi-platform Support:** Accessible android and web application

## Django Backend

## Frontend using react-native

- **Responsive Design**
- **Real-time Data Sync**
- **Reusable UI Components**



## BACKEND SETUP

### Step 1: Install Requirements.txt

    It will install Django, Django rest framework, and other required packages.

### Step 2: Setup Postgres

    ./setup-postgres.sh <password>

### Step 3: Run Migrations

    python manage.py makemigrations
    python manage.py migrate

### Step 4: To create a admin user

    python manage.py createsuperuser

### Step 5: Run Server
    //set up the ngrock and follow the docs and run on the port 8000
    ngrok http 8000
    python manage.py runserver

## FRONTEND SETUP

### Step 1: Setup the react native

    Use this docs
    https://reactnative.dev/docs/set-up-your-environment
    select os - linux , target - android

    basically you need to  install 
    node.js, java jdk, and android studio(for adb and some sdk tools)

### Step 2:Install Dependencies
    //you can install the Dependencies from the package.json file
    npm install 

### step 3: Run app
    Install expo go app for running app on phone

    DO: npm start

    scan the QRcode from expo app

        


