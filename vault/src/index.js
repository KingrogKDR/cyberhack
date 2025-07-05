import dotenv from "dotenv";
import express from "express";
import pinoHTTP from "pino-http";
import logger from "./utils/logger.js";

dotenv.config()

const app = express();
app.use(express.json());
app.use(pinoHTTP({ logger })) // logs all HTTP requests (Global middleware)

// routes

import adminRouter from "./routes/admin.route.js";
import tokenRouter from "./routes/token.route.js";

app.use("/api/v1", tokenRouter)
app.use("/admin", adminRouter)

const port = process.env.PORT || 4001;

app.listen(port, () => console.log("Tokenizer service listening on port:", port));
