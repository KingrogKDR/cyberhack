import { decodeJWT } from "../lib/jwt.js";

export function jwtMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]
  console.log("JWT Middleware - Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing in cookies" });
  }

  try {
    const decoded = decodeJWT(token);
    console.log("Decoded JWT:", decoded);
    req.user = decoded;
    req.userId = decoded.id 
    req.role = decoded.role 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token", error: error.message });
  }
}

// Middleware to check if user has 'user' role
export function requirerole(req, res, next) {
  if (req.role !== 'user') {
    return res.status(403).json({ message: "Forbidden: User role required" });
  }
  next();
}

// Middleware to check if user has 'bank' role
export function requireBankRole(req, res, next) {
  if (req.role !== 'bank') {
    return res.status(403).json({ message: "Forbidden: Bank role required" });
  }
  next();
}
