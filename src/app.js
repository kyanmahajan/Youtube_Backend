import express from "express"

import cors from "cors"
import cookieParser from "cookie-parser"
import u_router from "./routes/user.js"
const app = express();


app.use(cors());

//allow express to accept the json format files
app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());
//in middlewar next is  a bool

app.use("/user", u_router);
  
export { app };
