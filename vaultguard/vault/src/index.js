import dotenv from "dotenv";
import express from "express";
import tokenRouter from "./routes/token.route.js";

dotenv.config()

const app = express();

const port = process.env.PORT || 4001;

app.use(express.json());

app.use("/api/v1", tokenRouter)

app.listen(port, () => console.log("Tokenizer service listening on port:", port));
