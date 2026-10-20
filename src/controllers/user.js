import { asynca } from "../utils/asynchan.js";
import { apierror } from "../utils/apierror.js";
import { user } from "../models/user.js";
import { uploadoncl } from "../utils/cloud.js";
import jwt from "jsonwebtoken"
// import {byenc}

const register = asynca(async (req, res) => {
    const { name, password, email } = req.body;
    const username = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!username || !password?.trim() || !normalizedEmail) {
        throw new apierror(400, "Name, email, and password are required");
    }

    const avatarFile = req.files?.avatar?.[0];
    if (!avatarFile) {
        throw new apierror(400, "An avatar image is required");
    }

    const existingUser = await user.findOne({
        $or: [{ username: username.toLowerCase() }, { email: normalizedEmail }],
    });
    if (existingUser) {
        throw new apierror(409, "A user with that name or email already exists");
    }

    const coverFile = req.files?.coverImage?.[0];
    const [avatar, cover] = await Promise.all([
        uploadoncl(avatarFile.path),
        coverFile ? uploadoncl(coverFile.path) : Promise.resolve(null),
    ]);
    if (!avatar?.url) {
        throw new apierror(502, "Avatar upload failed");
    }
    if (coverFile && !cover?.url) {
        throw new apierror(502, "Cover image upload failed");
    }

    const createdUser = await user.create({
        username,
        email: normalizedEmail,
        password,
        avatar: avatar.url,
        ...(cover?.url ? { cover_i: cover.url } : {}),
    });

    const responseUser = createdUser.toObject();
    delete responseUser.password;
    delete responseUser.r_token;

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: responseUser,
    });
});


const login = asynca(async (req, res) => {
    const { name, email, password } = req.body;
    //basic checks
    if (!name || !email) {
        throw new apierror(401, "fill proper detials")
    }

    const use = await user.findOne({ email: email });
    if (!use) {
        throw new apierror(400, "register first");
    }


    const booll = await use.iscorrect(password, use.password);
    if (!booll) {
        throw new apierror(401, "password not correct");
    }
    //tokens
    const a_t = use.generateA;
    const r_t = use.generateR;
    if (!a_r || r_t) {
        throw new apierror(403, "somehting went wrong in fenerating tokens");

    }
    use.r_token = r_t;
    await use.save({ validateBeforeSave: false })
    use.a_token = a_t;

    //cookies and response
    const options = {
        httpOnly: true,
        secure: true
    }


    const dat = {

        email: use.email
    };


    res.status(201).
        cookie("access_token", a_t, options).
        cookie("refersh_token", r_t, options).
        json({
            success: true,
            message: "login successful",
            data: dat,
        })


})

const logout = async (req, res) => {
    try {
        const use = req.user;
        const id = use._id;

        const filter = { _id: id };
        const update = { r_token: undefined };


        const options = {
            httpOnly: true,
            secure: true
        }
        changed = await user.findOneAndUpdate(filter, update)

        return res.status(201).clearCookie("accessToken", options).clearCookie("refreshToken").json(
            {
                message: "user logges out",
                success: true
            }
        )


    }
    catch(error){
     res.status(401).json({
       success: false, 
       message: "somethign went wrong while logging the user out"
     })
    }
}

const r_a_t = async (req, res) =>{
   try{
   const refresh = req.cookies.refreshToken || req.body.refreshToken;
   if(!refresh()){
     throw new apierror(400, "not authorised")
   }
   const decoded= jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET)
   const use = await user.findById(decoded._id);

   const access_t = await  use.generateA();
   if(refresh != use.r_token){
     throw new apierror(400, "");
   }

   res.status(400).cookie("accessToken", access_t, {
      httpOnly: true,
      secure: true
   }).cookie("refreshToken", refresh).json({
    success: true,
     a_t: access_t
   })

   }
   catch(error){
     res.status(400).json({
      success: false,
      message: "refresh_t"
     })
   }
}

const change_p = asynca(async (req, res) => {
  const use = req.user;

  const f_use = await user.findById(use?._id);

  if (!f_use) {
    throw new apierror(404, "User does not exist");
  }

  const n_password = req.body.password;

  f_use.password = n_password;

  // Triggers pre("save") and hashes the modified password
  await f_use.save();

  const access_t = f_use.generateA();
  const refresh_t = f_use.generateR();

  f_use.refresh_t = refresh_t;
  await f_use.save();

  res.status(200)
    .cookie("refresh_token", refresh_t)
    .cookie("access_token", access_t)
    .json({
      success: true,
      message: "Password changed"
    });
});

const update_details = asynca(async (req, res) => {
  const allowed = ["name", "email"];

  const updates = Object.keys(req.body);

  const isvalid = updates.every((f) =>
    allowed.includes(f)
  );

  if (!isvalid) {
    throw new apierror(400, "Invalid update request");
  }

  if (updates.length === 0) {
    throw new apierror(400, "No fields provided");
  }

  const user_id = req.user._id;

  const new_details = await user.findByIdAndUpdate(
    user_id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!new_details) {
    throw new apierror(404, "User does not exist");
  }

  return res.status(200).json({
    success: true,
    message: "User details updated",
    data: new_details
  });
});

const get_user = asynca(async(req, res) =>{
   const {username} = 
})
 
export { register, login, logout};
