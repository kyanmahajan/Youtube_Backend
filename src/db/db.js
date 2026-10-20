import mongoose from "mongoose";

import { db_name  } from "../constants.js";

const connectDB = async () =>{
    try{ 
    
     const connection =  await mongoose.connect(`${process.env.MONGO_URL}${db_name}`)

     console.log(`\n mongodb connected `)
    }
    catch(error){
       console.log("mongo db connection err or", error)
       process.exit(1)
    } 
 }  


 export default connectDB 