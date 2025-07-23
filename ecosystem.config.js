module.exports = {
    apps: [
        {
            name: "landfi",
            script: "./server.js", // or "npm", args: "start" if using a package script
            env: {
                NODE_ENV: "production",
                PORT: 3000 // Optional: set the port your app listens on
            }
        }
    ]
};