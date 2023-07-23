const mongoose = require('mongoose');
mongoose.set("strictQuery", true);   //only schema fields into db, no other data fields allowed 
const mongoURL = "mongodb+srv://mongcluster:mongocluster%409939@cluster0.jsjyuy7.mongodb.net/inotebook"

const connectToMongo = () =>{
  mongoose.connect(mongoURL, ()=>{
    console.log(" Hello Rajesh ! connected to mongo Cloud  successfully");
  })
}
module.exports = connectToMongo;