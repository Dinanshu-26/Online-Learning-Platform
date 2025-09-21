const mongoose = require("mongoose");
require("dotenv").config() ;

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {console.log("Database connected sucsessfully")})
    .catch((error) => {
        console.log("Error while connecting DB");
        console.log(error);
        process.exit(1) ;
    });
}