 
import "dotenv/config";
import connectDB from "./db/db.js";

import { app } from "./app.js";


connectDB().then(() => {
  app.listen(process.env.PORT || 8000, () => {
    console.log(`server started at ${process.env.PORT || 8000}`);
  });
}).catch((err) => {
  console.error("connection failed to db", err);
});


//  const app = express();


//  import { db_name } from "./constants";

//   async function connect() {
//       try {
      
//         await mongoose.connect(`${process.env.MONGO_URL}/${db_name}`)
//         app.listen(process.env.PORT, ()=>{
//           console.log("app s tarts")
//         })

//       }
//       catch(error){
//         console.log("ERROR:", error)
//       }
//   }
