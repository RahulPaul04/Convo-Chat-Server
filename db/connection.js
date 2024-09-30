const mongoose = require('mongoose')

const connectdb = async(url)=>{
    try{
        await mongoose.connect(url)
        console.log("MongoDB Server Connected");
    }
    catch(err){
        console.log(err);
        console.log("Error Connecting to mongoDB Server");
    }
}

module.exports = connectdb