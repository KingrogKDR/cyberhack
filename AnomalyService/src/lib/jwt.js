import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

export function decodeJWT(token) {
  try {
    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded
  } catch (error) {
    console.log("Error decoding JWT:", error);
    throw new Error("Invalid token");
  }
}


