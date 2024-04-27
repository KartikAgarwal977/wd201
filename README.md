# Project Setup

## Requirements : 
* Node.js
* PostgreSQL (or any other MySQL server)
* npm (Node Package Manager)

## Setup Steps:

1. Install Node.js :
   * Download and install Node.js from the <a href="https://nodejs.org/">official website</a>
2. Install XAMPP:
   * Download and install PostgreSQL from the <a href="https://www.postgresql.org/download/linux/ubuntu/">official website.
   * Start the PostgreSQL service.
3. Clone the Repository:
   ``` bash
   git clone https://github.com/KartikAgarwal977/todo-web-app.git
   cd todo-web-app/todo-app
   ```
4. Install Dependencies:
   ``` bash
    npm install
   ```
5. Database Setup
* Ensure PostgreSQL is running.
* Create a new database using a PostgreSQL client or command line.
6. Configure Sequelize:
* Open config/config.json file.
* Update the database configuration with your PostgreSQL database credentials.
7. Run Migrations:
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
```
Usage:

* After completing the setup, you can run the project using:
```bash
npm start
```
* Access the application in your web browser at http://localhost:3000.
### Additional Notes:

* Ensure your PostgreSQL server is running before starting the application.
* You may need to adjust firewall settings to allow connections to the PostgreSQL server.
* For production deployment, consider configuring environment variables and securing sensitive information.
* Refer to the project documentation or source code for any further customization or usage instructions.

