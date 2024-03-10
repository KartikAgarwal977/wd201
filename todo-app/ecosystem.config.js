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