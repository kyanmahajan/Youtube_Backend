import { apierror } from "../utils/apierror.js";
// import { asynca } from "../utils/asynchan";
import jwt from "jsonwebtoken";

import {user} from "../models/user.js"
// import { useReducer } from "react";

export const V_JW = async(req, res, next) => {
     try{
       
       const token = req.Cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
       if(!token){
         throw new apierror(401, "unauth");

       }
       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )

      const use  =  user.findById(decoded._id);
      req.user = use;
      next();
        
     }
     catch(error){
       res.status(404).json(
       {
         success: false, 
         error : error
       })
     }
}