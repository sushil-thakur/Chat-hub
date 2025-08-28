import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { inngest, functions } from "./config/inngest.js";
import { serve } from "inngest/express";

const app = express();
app.use(express.json()); //req.body
app.use(clerkMiddleware()); //req.auth will be availabe in the request object
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("hellow word");
});

export const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => {
        console.log("server started on port:", ENV.PORT);
      });
    }
  } catch (error) {
    console.log("error starting server:",error);
    process.exit(1)
  }
};
// In serverless platforms (e.g., Vercel), export the app for the runtime to handle requests
export default app;

// Start the server when running locally
if (process.env.VERCEL !== "1") {
  startServer();
}
