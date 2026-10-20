import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const sub_schema =  new Schema({
   subscriber : {
      type : Schema.Types.ObjectId,
      ref:"user"
   },
   channel : {
     type : Schema.Types.ObjectId,
     ref: "user"
   }
   

})

