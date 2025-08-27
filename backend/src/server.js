import express from 'express';
import { ENV } from './config/env.js';

const app= express();


app.get("/",(req,res)=>{
res.send("hellow word")
})
console.log("mongo url:", ENV.MONGO_URL)
app.listen(ENV.PORT,()=>console.log("server started on port:",ENV.PORT))
