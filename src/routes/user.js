import { Router } from "express";
import  {register, login, logout } from "../controllers/user.js"
import {upload} from "../middlewares/multer.js"
import {V_JW} from "../middlewares/auth.js"

const router = Router();
router.route("/register").post(
upload.fields([{
  name: "avatar",
  maxCount: 1
},
{
  name: "coverImage",
  maxCount: 1
}
]),


register)

const prinh = (req, res)=>{
  console.log("healthy")
  res.send("healthy")
}

router.route("/").get(prinh)
router.route("/login").post(login)
router.route("/logout").post(V_JW, logout)
// router.route("/login").post(login)


export default router