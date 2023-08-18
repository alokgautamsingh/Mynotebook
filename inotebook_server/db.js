const mongoose = require('mongoose');
const mongoURI = "mongodb://0.0.0.0:/inotebook";
const connectToMongo = async ()=>{
   mongoose.connect(mongoURI);
   console.log("connected to database");
}
module.exports = connectToMongo;