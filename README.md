
# README: Set up and run TOEIC exam Website

## 1. Install and Run PostgreSQL

### Step 1: Download and Install PostgreSQL

1.  Visit the official PostgreSQL website: [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2.  Choose your operating system and follow the installation instructions provided.
3.  During installation, configure:
    -   The installation directory.
    -   Port number (default: 5432).
    -   A password for the PostgreSQL superuser (default user: `postgres`).

### Step 2: Start PostgreSQL

-   **Windows:**
    -   Start the PostgreSQL service using the `pgAdmin` tool or the Windows Services Manager.
-   **macOS/Linux:**
    -   Use the following terminal command:
        
        ```bash
        sudo service postgresql start
        
        ```
        

### Step 3: Access PostgreSQL

-   **Using pgAdmin:**
    -   Launch pgAdmin and log in using your configured superuser credentials.
-   **Using the Command Line:**
    -   Open a terminal and type:
        
        ```bash
        psql -U postgres
        
        ```
        
    -   Enter the password when prompted.

## 2. Restore a Backup File

### Prerequisites

-   Ensure the `toiec.backup` file is accessible on your system.
-   Make sure PostgreSQL is running.

### Restore the Backup

#### Using pgAdmin:

1.  Open pgAdmin and connect to your PostgreSQL server.
2.  Create a new database:
    -   Right-click on "Databases" > "Create" > "Database".
    -   Enter the name (e.g., `toiec`) and save.
3.  Restore the backup:
    -   Right-click on the created database > "Restore".
    -   In the "Filename" field, browse to the location of `toiec.backup`.
    -   Click "Restore".

#### Using the Command Line:

1.  Create a new database:
    
    ```bash
    createdb -U postgres toiec
    
    ```
    
2.  Restore the backup:
    
    ```bash
    pg_restore -U postgres -d toiec /path/to/toiec.backup
    
    ```
    
    Replace `/path/to/toiec.backup` with the actual path to your backup file.

### Verify the Restore

-   Access the database to ensure the restoration was successful:
    
    ```bash
    psql -U postgres -d toiec
    
    ```
    
-   Check the tables and data using SQL queries, such as:
    
    ```sql
    \dt
    SELECT * FROM <table_name>;
    
    ```
    

## 3. Ensure Configuration Matches the Code

Ensure the database configuration matches the code in `dbutil.js` located in the `Model` folder. Below is the relevant code:

```javascript
var sql = require("pg");

// config for your database
var config = {
    user: 'postgres',
    password: '123456',
    host: 'localhost', 
    port: 5432,
    database: 'toeic',
};    
const poolPromise = new sql.Pool(config)
  .connect()
  .then(pool => {
    console.log('Connected to PostgresSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}

```

### Notes:

-   If there is no password, leave the `password` field as an empty string (`''`).
-   The `database` field must match the name of the restored database (e.g., `toeic`).

## 4. Allocate Data Files

Place the following data files in the root of the `C:\` drive (disk C):

-   `Data`
-   `Exam`
-   `Ware`

**Warning:** The location of these data files is critical. The code will break if the files are not in the correct location.

## 5. Run the Application

To run the TOEIC exam website:

1.  Open the project code in the IDE of your choice.
2.  In the terminal, run the following command:
    
    ```bash
    node app.js
    
    ```
    
3.  If the setup is correct, the terminal should display:
    
    ```
    Server started running on : 3000
    Connected to PostgresSQL
    
    ```
4.  Open your browser and type the following the website should appear
    
    ```
    http://localhost:3000
    
    ```
