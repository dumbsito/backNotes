module.exports = {
    database: process.env.MONGO_URL || "mongodb://127.0.0.1/express-server",
    secret: "mysecret"
}