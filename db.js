const mongoose = require('mongoose');


const mongoURI = "mongodb+srv://iNotebook:YGDHp2CuYEST8O6c@cluster0.cxae3kp.mongodb.net/?retryWrites=true&w=majority"                                          // YGDHp2CuYEST8O6c

const connectToMongo = () => {
    mongoose.connect(mongoURI, () => {
        console.log("Connected to Mongo Successfully");
    });
}

module.exports = connectToMongo;