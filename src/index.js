import dotenv from "dotenv";
import connectDB from "./db/index";
dotenv.config();

import express from "express";
const app = express();
const port = process.env.PORT || 3000;

connectDB()
  .then(()=>{
    app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
  })
  .catch((err) => {
    console.error(err);
  });
