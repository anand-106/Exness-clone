import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
}

const JWT_SECRET = "anand"

export function verifyJwt(req: Request, res: Response, next: NextFunction) {
  
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Invalid token format" });

    
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;


  
    (req as any).userId = payload.userId;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
