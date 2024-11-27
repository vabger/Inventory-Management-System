#!/bin/bash

# Check for required argument
if [ $# -ne 3 ]; then
    echo "Usage: $0 <db_name> <db_user_name> <db_user_password>"
    exit 1
fi

# Set variables
POSTGRES_PASSWORD=$3
DB_NAME=$1
USER_NAME=$2
USER_PASSWORD=$POSTGRES_PASSWORD 

# Update package list and install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql



sudo -u postgres psql -c "ALTER USER postgres PASSWORD '$POSTGRES_PASSWORD';"
sudo -u postgres createdb "$DB_NAME"

# Create a new user with a password and grant privileges on the database
sudo -u postgres psql -c "CREATE USER $USER_NAME WITH PASSWORD '$USER_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE \"$DB_NAME\" TO \"$USER_NAME\";"

# Create a new schema (fixed the syntax error in the original script)
sudo -u postgres psql -d $DB_NAME -c "CREATE SCHEMA newschema AUTHORIZATION \"$USER_NAME\";"

# Set user role options
sudo -u postgres psql -c "ALTER ROLE \"$USER_NAME\" SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE \"$USER_NAME\" SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE \"$USER_NAME\" SET timezone TO 'UTC';"
sudo -u postgres psql -c "ALTER ROLE \"$USER_NAME\" SET search_path = newschema;"

echo "PostgreSQL installed and configured successfully."
echo "Database '$DB_NAME' created and user '$USER_NAME' granted privileges."
