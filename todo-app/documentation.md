# Nodejs Application deployment

Deploying a node.js application in cluster mode using PM2, implementing enviroment variable conf. for both development and production environments, and applying security measures.

## Environment Variable Cnfiguration
Environment variable are key-value pairs that are accessible from the operating system's environment in which a process runs. 

### Managing Sensitive Information
Sensitive information such as API keys or database credentials should be managed securely using environment variable, By storing values as environment variables they are not hard-coded within the application codebase reducing the risk of exposure. 

#### Setting Up  Environment Variables
* Create '.env' file: In root directory of our application , create a new file named ".env"

``` python

NODE_ENV=production
DATABASE_URL=postgres://todo_app_db_keqr_user:UCQMVSMBSskijrMcXiRN9Rb18F3QmIbu@dpg-cnjreh821fec73al6js0-a/todo_app_db_keqr
PROD_DATABASE=postgres
PROD_DIALECT=postgres

NODE_ENV=development
DEV_USERNAME=postgres
DEV_PASSWORD=kartik
DEV_DATABASE=postgres

PORT = 3010
COOKIE_SECRET=secret-key-874009116946977

```
#### Load Environment  variables in your app.js
Use the 'dotenv' npm package to load environment variables into 'process.env'.  Install it using npm : `npm install dotenv`
``` javascript
require('dotenv').config() 
```
#### Accessing Environment Variables in Your App
Access environment Variable using 'process.env'.
``` javascript
const port = process.env.PORT;
const databaseUrl = process.env.DATABASE_URL;
```

## PM2 Cluster Mode Deployment 
PM2 is a process manager for Node.js application that enables easy deployment and management of application processes. Deploying the application in cluster mode allows it to utilize multiple CPU cores efficiently.

### Configuration Paramenters
The following configuration parameters are used for deploying the application in using PM2:

``` js
module.exports = {
    apps: [{
        script: "index.js",
        instances: "max",
        watch: "true", 
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",            
        },
        exec_mode: "cluster"
    }]
    
} 
```

### Saving Application Logs
PM2 automatically saves application logs to the specified output path.

## Security Measures 
Implementing security measures is crucial for protecting the Node.js app from various threats and vulnerabilities.
- For Security I use middleware 'helmet' that protect the app from outside threats and vulnerabilities.

``` javascript
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        "script-src": ["'self'", "cdn.tailwindcss.com"],  
      },
  },
}));

```
