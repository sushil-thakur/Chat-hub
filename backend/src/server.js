import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app= express();


app.get("/",(req,res)=>{
res.send("hellow word")
})

app.listen(ENV.PORT,()=>console.log("server started on port:",ENV.PORT))
connectDB();
