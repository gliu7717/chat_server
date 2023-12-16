const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name :String,
    email:String,
    phone: Number,
    password: String,
    accessToken: String,
    createdAt:Date
})

module.exports = mongoose.model("User", userSchema,"user")
