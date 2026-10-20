import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import "dotenv/config";

cloudinary.config({
  url: process.env.CLOUDINARY_URL,
});

// Log the configuration

const uploadoncl = async (filepath) =>{
  try{
     if(!filepath) return null;

    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully");
    return result;

  }
  catch(error){
    throw error;
  } finally {
    if (filepath && fs.existsSync(filepath)) fs.unlinkSync(filepath);
  }
}


// cloudinary.v2.uploader
// .upload("dog.mp4", {
//   resource_type: "video", 
//   public_id: "my_dog",
//   overwrite: true, 
//   notification_url: "https://mysite.example.com/notify_endpoint"})
// .then(result=>console.log(result));


export { uploadoncl };
